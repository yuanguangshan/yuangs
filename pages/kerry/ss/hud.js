/* hud.js — 平视显示器：仪表带、姿态仪、雷达、锁定框、告警 */
(function (global) {
  'use strict';
  const { clamp, lerp, RAD } = MM;
  const Q = MM.Q, V3 = MM.V3;

  const HUD = { W: 0, H: 0, t: 0, touch: false };

  // 磷光配色
  const C = {
    g: '#7dffb0', gd: 'rgba(125,255,176,0.40)', gf: 'rgba(125,255,176,0.14)',
    c: '#79e6ff', cd: 'rgba(121,230,255,0.45)',
    a: '#ffd75e', ad: 'rgba(255,215,94,0.5)',
    r: '#ff5a52', rd: 'rgba(255,90,82,0.5)',
    w: '#eaf6ff', wd: 'rgba(234,246,255,0.4)',
    k: '#0a0f14',
  };

  const _e = { yaw: 0, pitch: 0, roll: 0 };
  const _pr = {};

  function font(ctx, size, bold) {
    ctx.font = (bold ? '600 ' : '') + size + 'px "SF Mono", Menlo, Consolas, monospace';
  }
  function txt(ctx, s, x, y, color, size, align, bold) {
    font(ctx, size || 12, bold);
    ctx.fillStyle = color || C.g;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  }

  function bracket(ctx, x, y, s, col) {
    ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    const l = s * 0.42;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s + l); ctx.lineTo(x - s, y - s); ctx.lineTo(x - s + l, y - s);
    ctx.moveTo(x + s - l, y - s); ctx.lineTo(x + s, y - s); ctx.lineTo(x + s, y - s + l);
    ctx.moveTo(x + s, y + s - l); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s - l, y + s);
    ctx.moveTo(x - s + l, y + s); ctx.lineTo(x - s, y + s); ctx.lineTo(x - s, y + s - l);
    ctx.stroke();
  }

  HUD.draw = function (ctx, G, W, H) {
    HUD.W = W; HUD.H = H; HUD.t = G.time;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1.2;
    const p = G.player;
    if (!p) { ctx.restore(); return; }
    const yaw = p.yaw || 0, pitch = p.pitch || 0, roll = p.roll || 0;
    const spd = p.spd * 3.6;                       // m/s -> km/h
    const alt = p.pos.y;
    const vs = p.vs;

    const safe = !p.alive;
    const dim = safe ? 0.25 : 1;
    ctx.globalAlpha = dim;

    /* ---------- 中心十字与机炮瞄准点 ---------- */
    if (!safe) {
      const cx = W / 2, cy = H / 2;
      ctx.strokeStyle = C.g; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - 34, cy); ctx.lineTo(cx - 12, cy);
      ctx.moveTo(cx + 12, cy); ctx.lineTo(cx + 34, cy);
      ctx.moveTo(cx, cy - 34); ctx.lineTo(cx, cy - 14);
      ctx.moveTo(cx, cy + 14); ctx.lineTo(cx, cy, cy + 0) ;
      ctx.moveTo(cx, cy + 14); ctx.lineTo(cx, cy + 26);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 7); ctx.stroke();
      // 加力指示
      if (p.throttle > 0.96) {
        txt(ctx, 'AB', cx + 30, cy - 22, p.ab ? C.a : C.gd, 11);
      }
    }

    /* ---------- 目标框 ---------- */
    if (!safe) drawTargets(ctx, G, W, H);

    /* ---------- 导弹锁定框 ---------- */
    if (!safe) drawLock(ctx, G, W, H);

    /* ---------- 炸弹瞄准点 ---------- */
    if (!safe && G.bombAim && G.bombAim.ok) {
      const a = G.bombAim;
      ctx.strokeStyle = C.a; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(a.x - 16, a.y); ctx.lineTo(a.x - 5, a.y);
      ctx.moveTo(a.x + 5, a.y); ctx.lineTo(a.x + 16, a.y);
      ctx.moveTo(a.x, a.y - 16); ctx.lineTo(a.x, a.y - 5);
      ctx.moveTo(a.x, a.y + 5); ctx.lineTo(a.x, a.y + 16);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(a.x, a.y, 22, 0, 7); ctx.strokeStyle = C.ad; ctx.stroke();
      txt(ctx, a.label || '', a.x, a.y + 32, C.a, 11, 'center');
    }

    /* ---------- 姿态仪（左下） ---------- */
    drawHorizon(ctx, G, W, H, roll, pitch);
    /* ---------- 进近指示 ---------- */
    drawApproach(ctx, G, W, H);
    /* ---------- 速度带（左） ---------- */
    drawTape(ctx, W, H, spd, 20, H * 0.62, -H * 0.31, 'V', 'km/h', C.g);
    /* ---------- 高度带（右） ---------- */
    drawTape(ctx, W, H, alt, 100, H * 0.62, -H * 0.31, 'ALT', 'm', C.c, vs);
    /* ---------- 航向带（上） ---------- */
    drawHeading(ctx, W, H, yaw);
    /* ---------- 雷达（右下） ---------- */
    drawRadar(ctx, G, W, H);
    /* ---------- 武器与状态（右上） ---------- */
    drawStatus(ctx, G, W, H);
    /* ---------- 油门（右下角竖条） ---------- */
    drawThrottle(ctx, G, W, H);
    /* ---------- 告警 ---------- */
    drawWarnings(ctx, G, W, H);
    /* ---------- 消息 ---------- */
    drawMsgs(ctx, G, W, H);

    /* ---------- 受击红晕 ---------- */
    if (G.damageFlash > 0) {
      ctx.globalAlpha = clamp(G.damageFlash, 0, 1) * 0.55;
      const gr = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.78);
      gr.addColorStop(0, 'rgba(255,40,30,0)');
      gr.addColorStop(1, 'rgba(255,40,30,0.95)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  /* ---------------- 进近指示（下滑道 / 航道 / 速度窗口） ---------------- */
  function drawApproach(ctx, G, W, H) {
    const p = G.player, c = G.carrier;
    if (!p.alive || !c || !c.alive) return;
    if (p.gearPos < 0.6) return;
    const Lx = { x: 0, y: 0, z: 0 };
    const f = Ent.shipFwd(c), r = Ent.shipRight(c);
    const dx = p.pos.x - c.pos.x, dz = p.pos.z - c.pos.z;
    const lz = dx * f.x + dz * f.z;      // 沿舰首为正
    const lx = dx * r.x + dz * r.z;
    const range = Math.hypot(dx, dz);
    if (lz < -400 || range > 9000) return;

    const cx = W / 2, cy = H / 2;
    const yawErr = wrapAng(c.yaw + Math.PI - p.yaw);   // 着舰方向与母舰艏向相反
    const glideErr = (p.pos.y - (c.deckY + 1.2)) - Math.tan(4.2 * Math.PI / 180) * Math.max(0, -lz + 100);
    const relSpd = p.spd - c.speed;
    const near = lz < 2600;

    ctx.save();
    ctx.globalAlpha = 0.92;
    // 航道条
    const bw = Math.min(320, W * 0.28);
    const bx = cx - bw / 2, by = cy + 96;
    ctx.strokeStyle = 'rgba(125,255,176,0.25)'; ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, 6);
    ctx.beginPath(); ctx.moveTo(bx + bw / 2, by - 6); ctx.lineTo(bx + bw / 2, by + 12); ctx.stroke();
    const lxN = clamp(yawErr * 380 + lx * 0.10, -bw / 2 + 6, bw / 2 - 6);
    const onLoc = Math.abs(yawErr) < 0.035;
    ctx.fillStyle = onLoc ? C.g : C.a;
    ctx.beginPath();
    ctx.moveTo(bx + bw / 2 + lxN, by - 9); ctx.lineTo(bx + bw / 2 + lxN - 7, by - 18);
    ctx.lineTo(bx + bw / 2 + lxN + 7, by - 18); ctx.closePath(); ctx.fill();
    txt(ctx, onLoc ? 'LOC OK' : (yawErr > 0 ? 'LOC L' : 'LOC R'), bx + bw / 2, by + 24,
      onLoc ? C.g : C.a, 11, 'center');

    // 下滑道条（垂直）
    const vh = Math.min(190, H * 0.22), vy0 = cy - vh - 70;
    ctx.strokeStyle = 'rgba(125,255,176,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + 150, vy0); ctx.lineTo(cx + 150, vy0 + vh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 142, vy0 + vh / 2); ctx.lineTo(cx + 158, vy0 + vh / 2); ctx.stroke();
    const gN = clamp(glideErr * 1.6, -vh / 2, vh / 2);
    const onGlide = Math.abs(glideErr) < 9;
    ctx.fillStyle = onGlide ? C.g : (glideErr > 0 ? C.a : C.a);
    ctx.beginPath();
    ctx.arc(cx + 150, vy0 + vh / 2 + gN, 6, 0, 7); ctx.fill();
    txt(ctx, onGlide ? 'G/P OK' : (glideErr > 0 ? 'HIGH' : 'LOW'), cx + 150, vy0 + vh + 14, onGlide ? C.g : C.a, 11, 'center');

    // 速度窗口
    const onSpd = relSpd > 66 && relSpd < 82;
    txt(ctx, onSpd ? 'SPD OK' : (relSpd > 82 ? 'SPD +' : 'SPD -'), cx - 150, vy0 + vh + 14, onSpd ? C.g : C.a, 11, 'center');
    if (near) {
      txt(ctx, 'STABILIZED — LAND', cx, vy0 - 22, C.a, 13, 'center', true);
      txt(ctx, 'DECK ' + Math.round(lz) + 'm', cx, vy0 - 40, C.wd, 11, 'center');
    }
    ctx.restore();
  }

  /* ---------------- 目标指示 ---------------- */
  function drawTargets(ctx, G, W, H) {
    const list = G.enemies;
    const cam = GL.eye;
    // 返航时指引母舰
    if (G.phase === '返航' && G.carrier && G.carrier.alive) {
      const c = G.carrier;
      const dc = V3.dist(c.pos, G.player.pos);
      const sc = GL.project(V3.create(c.pos.x, c.deckY + 20, c.pos.z), _pr);
      const br = V3.normalize(V3.create(), V3.sub(V3.create(), c.pos, G.player.pos));
      const rel = wrapAng(Math.atan2(br.x, -br.z) - (G.player.yaw || 0));
      if (sc.ok && sc.x > 0 && sc.x < W && sc.y > 0 && sc.y < H) {
        ctx.strokeStyle = C.w; ctx.lineWidth = 1.5;
        const b2 = clamp(7000 / dc, 14, 120);
        ctx.beginPath();
        ctx.moveTo(sc.x, sc.y - b2); ctx.lineTo(sc.x + b2 * 0.7, sc.y); ctx.lineTo(sc.x, sc.y + b2); ctx.lineTo(sc.x - b2 * 0.7, sc.y);
        ctx.closePath(); ctx.stroke();
        txt(ctx, 'CVN ' + (dc / 1000).toFixed(1) + 'km  方位 ' + (rel * RAD).toFixed(0) + '°', sc.x, sc.y + b2 + 14, C.w, 11, 'center');
      } else {
        // 边缘箭头
        const cx = W / 2, cy = H / 2;
        const ang = rel - Math.PI / 2;
        const rr = Math.min(W, H) * 0.34;
        const ax2 = cx + Math.cos(ang) * rr, ay2 = cy + Math.sin(ang) * rr;
        ctx.save(); ctx.translate(ax2, ay2); ctx.rotate(ang + Math.PI / 2);
        ctx.fillStyle = C.w;
        ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-9, 8); ctx.lineTo(9, 8); ctx.closePath(); ctx.fill();
        ctx.restore();
        txt(ctx, (dc / 1000).toFixed(1) + 'km', ax2, ay2 + 26, C.w, 11, 'center');
      }
    }
    for (const e of list) {
      if (!e.alive) continue;
      const d = V3.dist(e.pos, G.player.pos);
      if (d > 30000) continue;
      const s = GL.project(e.pos, _pr);
      if (!s.ok) continue;
      const inView = s.x > -60 && s.x < W + 60 && s.y > -60 && s.y < H + 60;
      const isTarget = G.lockTarget === e;
      const size = clamp(1400 / d, 6, 90);
      if (!inView) {
        // 屏幕外方向箭头
        const cx = W / 2, cy = H / 2;
        let dx = s.x - cx, dy = s.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const m = Math.min(W, H) * 0.36 / len;
        const ax = cx + dx * m, ay = cy + dy * m;
        const ang = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(ax, ay); ctx.rotate(ang);
        ctx.fillStyle = isTarget ? C.a : C.rd;
        ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, 6); ctx.lineTo(-7, -6); ctx.closePath(); ctx.fill();
        ctx.restore();
        continue;
      }
      ctx.strokeStyle = isTarget ? C.a : (C.r + 'aa');
      ctx.lineWidth = isTarget ? 1.8 : 1.1;
      const b = size;
      ctx.beginPath();
      // 八角标记
      ctx.moveTo(s.x - b, s.y); ctx.lineTo(s.x - b, s.y - b * 0.55);
      ctx.lineTo(s.x - b * 0.55, s.y - b * 0.55); ctx.lineTo(s.x - b * 0.55, s.y - b);
      ctx.moveTo(s.x + b, s.y); ctx.lineTo(s.x + b, s.y + b * 0.55);
      ctx.lineTo(s.x + b * 0.55, s.y + b * 0.55); ctx.lineTo(s.x + b * 0.55, s.y + b);
      ctx.stroke();
      // 尾迹/垂线
      ctx.strokeStyle = isTarget ? C.ad : C.rd;
      ctx.beginPath(); ctx.moveTo(s.x, s.y - b); ctx.lineTo(s.x, s.y - b - 14); ctx.stroke();
      if (isTarget) {
        const rel = MM.V3.normalize(MM.V3.create(), MM.V3.sub(MM.V3.create(), e.pos, cam));
        const clos = -MM.V3.dot(rel, MM.V3.normalize(MM.V3.create(), G.player.vel));
        txt(ctx, (d / 1000).toFixed(1) + 'km', s.x + b + 8, s.y - 6, C.a, 11);
        txt(ctx, (clos * 3.6).toFixed(0), s.x + b + 8, s.y + 8, clos > 0 ? C.a : C.g, 11);
      }
    }
    // 敌弹
    for (const m of G.missiles) {
      if (!m.alive || m.fromPlayer) continue;
      const d = V3.dist(m.pos, G.player.pos);
      if (d > 9000) continue;
      const s = GL.project(m.pos, _pr);
      if (!s.ok || s.x < 0 || s.x > W || s.y < 0 || s.y > H) continue;
      ctx.fillStyle = C.r;
      ctx.beginPath(); ctx.arc(s.x, s.y, 3.2, 0, 7); ctx.fill();
      ctx.strokeStyle = C.rd; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, 7); ctx.stroke();
    }
    // 己方导弹
    for (const m of G.missiles) {
      if (!m.alive || !m.fromPlayer) continue;
      const s = GL.project(m.pos, _pr);
      if (!s.ok || s.x < 0 || s.x > W || s.y < 0 || s.y > H) continue;
      ctx.fillStyle = C.g;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.4, 0, 7); ctx.fill();
    }
  }

  /* ---------------- 锁定 ---------------- */
  function drawLock(ctx, G, W, H) {
    const p = G.player;
    const lk = G.lock;
    // 锁定进度环（屏幕中心）
    const cx = W / 2, cy = H / 2;
    if (lk && lk.t > 0 && lk.t < 1) {
      const r = 34;
      ctx.strokeStyle = C.gd; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.a; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lk.t); ctx.stroke();
    }
    if (!G.lockTarget || !G.lockTarget.alive) {
      if (p.locked) { }
      return;
    }
    const e = G.lockTarget;
    const d = V3.dist(e.pos, p.pos);
    if (d > 34000) return;
    const s = GL.project(e.pos, _pr);
    if (!s.ok) return;
    const base = clamp(2600 / d, 18, 220);
    const closing = lk ? lk.closing : 0;
    const half = base * 0.5;
    const col = p.locked ? C.a : (lk && lk.t > 0 ? C.g : C.gd);
    if (p.locked) {
      // 锁定：四角括号 + 闪烁 LOCKED
      const flash = (Math.sin(G.time * 9) > -0.2) ? 1 : 0.25;
      ctx.globalAlpha = dim2(flash);
      bracket(ctx, s.x, s.y, half, C.a);
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = C.ad; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, cy); ctx.lineTo(s.x - half, s.y); ctx.stroke();
      ctx.restore();
      txt(ctx, 'LOCKED', s.x, s.y - half - 14, C.a, 13, 'center', true);
      txt(ctx, 'R ' + (d / 1000).toFixed(1), s.x, s.y + half + 16, C.a, 11, 'center');
      txt(ctx, 'V ' + (closing * 3.6).toFixed(0), s.x, s.y + half + 30, closing > 0 ? C.a : C.g, 11, 'center');
    } else {
      ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      const k = half;
      ctx.strokeRect(s.x - k, s.y - k, k * 2, k * 2);
      txt(ctx, d > 1000 ? (d / 1000).toFixed(1) + 'km' : Math.round(d) + 'm', s.x, s.y - k - 10, col, 11, 'center');
      if (lk && lk.t > 0) txt(ctx, 'TRACKING', s.x, s.y + k + 12, C.g, 10, 'center');
    }
  }
  function dim2(v) { return 0.25 + 0.75 * v; }
  function wrapAng(a) { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; }

  /* ---------------- 姿态仪 ---------------- */
  function drawHorizon(ctx, G, W, H, roll, pitch) {
    const R = HUD.touch ? 54 : 68;
    const cx = HUD.touch ? W * 0.5 : 118, cy = HUD.touch ? H - R - 26 : H - 118;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    // 内部地平线
    ctx.translate(cx, cy);
    ctx.rotate(-roll);
    const pxPerDeg = R / 32;
    ctx.translate(0, clamp(pitch * RAD, -60, 60) * pxPerDeg);
    ctx.fillStyle = 'rgba(30,80,140,0.55)';
    ctx.fillRect(-R * 2, -R * 3, R * 4, R * 3);
    ctx.fillStyle = 'rgba(120,80,30,0.55)';
    ctx.fillRect(-R * 2, 0, R * 4, R * 3);
    ctx.strokeStyle = C.w; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-R * 2, 0); ctx.lineTo(R * 2, 0); ctx.stroke();
    // 俯仰梯
    ctx.strokeStyle = C.wd; ctx.lineWidth = 1;
    ctx.font = '9px monospace'; ctx.fillStyle = C.wd; ctx.textAlign = 'center';
    for (let d = -30; d <= 30; d += 5) {
      if (d === 0) continue;
      const y = -d * pxPerDeg;
      const w = (d % 10 === 0) ? 22 : 11;
      ctx.beginPath(); ctx.moveTo(-w, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();
    // 外圈与滚转刻度
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let a = -60; a <= 60; a += 15) {
      const rad = (a - 90) * Math.PI / 180;
      const r0 = R, r1 = R + (a % 30 === 0 ? 7 : 4);
      ctx.strokeStyle = a === 0 ? C.g : C.gd;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * r0, cy + Math.sin(rad) * r0);
      ctx.lineTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
      ctx.stroke();
    }
    // 滚转指针
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-roll);
    ctx.fillStyle = C.g;
    ctx.beginPath(); ctx.moveTo(0, -R + 2); ctx.lineTo(-5, -R + 11); ctx.lineTo(5, -R + 11); ctx.closePath(); ctx.fill();
    ctx.restore();
    // 固定机头符号
    ctx.strokeStyle = C.a; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy); ctx.lineTo(cx - 10, cy); ctx.lineTo(cx - 6, cy + 6);
    ctx.moveTo(cx + 26, cy); ctx.lineTo(cx + 10, cy); ctx.lineTo(cx + 6, cy + 6);
    ctx.stroke();
    ctx.fillStyle = C.g;
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, 7); ctx.fill();
    txt(ctx, 'ATT', cx, cy + R + 16, C.gd, 10, 'center');
    // 过载
    const gl = G.player.gload;
    txt(ctx, gl.toFixed(1) + 'G', cx + R + 14, cy, gl > 7 ? C.a : C.gd, 12);
    // 侧滑/滚转角
    txt(ctx, Math.abs(roll * RAD).toFixed(0) + '°', cx - R - 18, cy, C.gd, 11, 'right');
  }

  /* ---------------- 纵向仪表带 ---------------- */
  function drawTape(ctx, W, H, val, step, y, h, label, unit, col, vs) {
    const x = 74;
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1;
    ctx.strokeRect(x, y - h / 2, 46, h);
    const pxPer = h / (step * 6);
    const start = Math.floor((val - step * 3) / step) * step;
    ctx.textAlign = 'right';
    for (let v = start; v <= val + step * 3.4; v += step) {
      const yv = y + (val - v) * pxPer;
      if (yv < y - h / 2 - 2 || yv > y + h / 2 + 2) continue;
      const major = ((v / step) % 2 === 0);
      ctx.strokeStyle = major ? col : C.gd;
      ctx.beginPath(); ctx.moveTo(x, yv); ctx.lineTo(x + (major ? 11 : 6), yv); ctx.stroke();
      if (major) { txt(ctx, String(Math.round(v)), x - 4, yv, col, 10, 'right'); }
    }
    // 当前值读数框
    ctx.fillStyle = 'rgba(6,14,10,0.82)';
    ctx.strokeStyle = col; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 11); ctx.lineTo(x + 50, y - 11); ctx.lineTo(x + 56, y);
    ctx.lineTo(x + 50, y + 11); ctx.lineTo(x - 2, y + 11); ctx.closePath();
    ctx.fill(); ctx.stroke();
    txt(ctx, String(Math.round(val)), x + 46, y, col, 14, 'right', true);
    txt(ctx, label, x + 23, y - h / 2 - 12, col, 10, 'center');
    txt(ctx, unit, x + 23, y + h / 2 + 12, C.gd, 10, 'center');
    if (vs !== undefined) {
      const vy = y + clamp(-vs * 3, -h / 2 + 6, h / 2 - 6);
      ctx.fillStyle = Math.abs(vs) > 25 ? C.a : C.c;
      ctx.beginPath(); ctx.moveTo(x + 52, vy); ctx.lineTo(x + 60, vy - 4); ctx.lineTo(x + 60, vy + 4); ctx.closePath(); ctx.fill();
    }
    ctx.textAlign = 'left';
  }

  /* ---------------- 航向带 ---------------- */
  function drawHeading(ctx, W, H, yaw) {
    const cx = W / 2, y = 26, half = 190, pxPerDeg = half / 45;
    ctx.save();
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - half, y + 10); ctx.lineTo(cx + half, y + 10); ctx.stroke();
    const deg = ((yaw * RAD) % 360 + 360) % 360;
    for (let d = -50; d <= 50; d += 5) {
      const hd = Math.round((deg + d) / 5) * 5;
      const diff = MM.wrapPi((hd - deg) * Math.PI / 180) * RAD;
      const x = cx + diff * pxPerDeg;
      const nd = ((hd % 360) + 360) % 360;
      const major = nd % 10 === 0;
      ctx.strokeStyle = major ? C.g : C.gd;
      ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x, y + 10 - (major ? 8 : 4)); ctx.stroke();
      if (major) {
        const lbl = nd === 0 ? 'N' : nd === 90 ? 'E' : nd === 180 ? 'S' : nd === 270 ? 'W' : String(nd / 10);
        txt(ctx, lbl, x, y - 6, C.g, nd % 90 === 0 ? 13 : 11, 'center', nd % 90 === 0);
      }
    }
    // 当前航向
    ctx.fillStyle = C.a;
    ctx.beginPath(); ctx.moveTo(cx, y + 12); ctx.lineTo(cx - 6, y + 22); ctx.lineTo(cx + 6, y + 22); ctx.closePath(); ctx.fill();
    txt(ctx, String(Math.round(deg)).padStart(3, '0'), cx, y + 30, C.a, 13, 'center', true);
    ctx.restore();
  }

  /* ---------------- 雷达 ---------------- */
  function drawRadar(ctx, G, W, H) {
    // 触屏时把雷达挪到左上，避免和右拇指的按钮区打架
    const R = HUD.touch ? 70 : 92;
    const cx = HUD.touch ? R + 34 : W - R - 42;
    const cy = HUD.touch ? R + 128 : H - R - 42;
    const rangeM = G.radarRange || 20000;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7);
    ctx.fillStyle = 'rgba(4,16,12,0.55)'; ctx.fill();
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.clip();
    ctx.strokeStyle = C.gf; ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath(); ctx.arc(cx, cy, R * i / 3, 0, 7); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    // 扫描线
    const sw = (G.time * 1.1) % (Math.PI * 2);
    const sg = ctx.createConicGradient ? null : null;
    void sg;
    ctx.strokeStyle = 'rgba(125,255,176,0.35)';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(sw) * R, cy - Math.cos(sw) * R); ctx.stroke();
    // 扫描扇区
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, -sw - 0.5, -sw);
    ctx.closePath(); ctx.fillStyle = 'rgba(125,255,176,0.10)'; ctx.fill();

    const rot = G.player.yaw || 0;
    const s2r = R / rangeM;
    const cs = Math.cos(rot), sn = Math.sin(rot);
    const plot = (p, color, shape, size) => {
      const dx = (p.x - G.player.pos.x), dz = (p.z - G.player.pos.z);
      const lx = dx * cs + dz * sn;           // 右为正
      const lz = dx * sn - dz * cs;           // 机头方向为正
      const x = cx + lx * s2r, y = cy - lz * s2r;
      if (Math.hypot(x - cx, y - cy) > R) return;
      ctx.fillStyle = color;
      if (shape === 'tri') {
        ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x - size, y + size); ctx.lineTo(x + size, y + size); ctx.closePath(); ctx.fill();
      } else if (shape === 'sq') {
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      } else if (shape === 'dia') {
        ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x - size, y); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fill();
      }
    };
    for (const s of G.ships) if (s.alive) plot(s.pos, s.kind === 'carrier' ? C.w : C.c, s.kind === 'carrier' ? 'dia' : 'sq', 4);
    for (const m of G.missiles) if (m.alive) plot(m.pos, m.fromPlayer ? C.g : C.r, 'dot', 2.2);
    for (const b of G.bombs) if (b.alive) plot(b.pos, C.a, 'dot', 2);
    for (const e of G.enemies) {
      if (!e.alive) continue;
      plot(e.pos, G.lockTarget === e ? C.a : C.r, 'tri', 5);
    }
    ctx.restore();
    // 自机
    ctx.fillStyle = C.g;
    ctx.beginPath(); ctx.moveTo(cx, cy - 7); ctx.lineTo(cx - 5, cy + 6); ctx.lineTo(cx + 5, cy + 6); ctx.closePath(); ctx.fill();
    txt(ctx, (rangeM / 1000) + 'km', cx, cy - R - 12, C.gd, 10, 'center');
    txt(ctx, 'RDR', cx, cy + R + 14, C.gd, 10, 'center');
  }

  /* ---------------- 武器与状态 ---------------- */
  function drawStatus(ctx, G, W, H) {
    const p = G.player;
    const x = W - 196, y = 22;
    ctx.save();
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 4, 188, 116);
    txt(ctx, 'WEAPON', x, y + 4, C.g, 11, 'left', true);
    let yy = y + 24;
    // AIM 状态
    const locked = p.locked;
    const lkTxt = locked ? 'AIM  LOCKED' : (G.lock && G.lock.t > 0 ? 'AIM  TRACK' : 'AIM  READY');
    txt(ctx, lkTxt, x, yy, locked ? C.a : C.g, 12, 'left', locked);
    txt(ctx, 'AMMO ' + String(p.missiles).padStart(2, '0'), x + 96, yy, p.missiles ? C.g : C.r, 12);
    yy += 17;
    txt(ctx, 'GUN  ' + (p.gunReady ? 'OK' : 'RELOAD'), x, yy, p.gunReady ? C.g : C.a, 11);
    txt(ctx, 'FLR ' + String(p.flares).padStart(2, '0'), x + 96, yy, p.flares ? C.g : C.r, 12);
    yy += 17;
    txt(ctx, 'BRK ' + (p.bombSel ? 'SEL ' : '--- ') + p.bombs, x, yy, p.bombs ? C.a : C.gd, 11);
    txt(ctx, p.gear ? 'GEAR DN' : (p.gearPos > 0.05 ? 'GEAR ...' : 'GEAR UP'), x + 96, yy, p.gear ? C.g : C.gd, 11);
    yy += 17;
    // 生命值
    const hp = clamp(p.hp / 100, 0, 1);
    txt(ctx, 'HULL', x, yy, C.gd, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 30, yy - 5, 60, 9);
    ctx.fillStyle = hp > 0.5 ? C.g : hp > 0.25 ? C.a : C.r;
    ctx.fillRect(x + 30, yy - 5, 60 * hp, 9);
    txt(ctx, Math.max(0, Math.round(p.hp)) + '%', x + 96, yy, hp > 0.25 ? C.g : C.r, 11);
    yy += 16;
    // 燃油
    txt(ctx, 'FUEL', x, yy, C.gd, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 30, yy - 5, 60, 9);
    const fu = clamp(p.fuel, 0, 1);
    ctx.fillStyle = fu > 0.2 ? C.c : C.r;
    ctx.fillRect(x + 30, yy - 5, 60 * fu, 9);
    txt(ctx, Math.round(fu * 100) + '%', x + 96, yy, C.gd, 11);
    ctx.restore();
    // 任务目标
    txt(ctx, G.phase || '', W - 12, H - 232, C.gd, 11, 'right');
    txt(ctx, 'TARGETS ' + G.remaining, W - 12, H - 216, G.remaining ? C.g : C.a, 12, 'right');
  }

  /* ---------------- 油门 ---------------- */
  function drawThrottle(ctx, G, W, H) {
    const p = G.player;
    const x = W - 16, y0 = H * 0.30, h = H * 0.34;
    ctx.strokeStyle = C.gd; ctx.lineWidth = 1;
    ctx.strokeRect(x - 10, y0, 12, h);
    ctx.fillStyle = p.ab ? C.a : C.g;
    const hh = h * clamp(p.throttle, 0, 1);
    ctx.fillRect(x - 9, y0 + h - hh, 10, hh);
    // 目标速度标记
    const vs = (p.targetSpd || 0) / 400;
    if (vs > 0) {
      const yy = y0 + h - h * clamp(vs, 0, 1);
      ctx.strokeStyle = C.a; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x - 14, yy); ctx.lineTo(x + 6, yy); ctx.stroke();
    }
    txt(ctx, 'THR', x - 4, y0 - 10, C.gd, 10, 'center');
    txt(ctx, Math.round(p.throttle * 100) + '', x - 4, y0 + h + 12, C.g, 11, 'center');
  }

  /* ---------------- 告警 ---------------- */
  function drawWarnings(ctx, G, W, H) {
    const p = G.player;
    const warns = G.warns;
    if (!warns || !warns.length) return;
    let i = 0;
    for (const w of warns) {
      const blink = w.blink ? (Math.sin(G.time * 11) > 0 ? 1 : 0.15) : 1;
      ctx.globalAlpha = blink;
      const col = w.color === 'red' ? C.r : w.color === 'amber' ? C.a : C.g;
      txt(ctx, w.text, W / 2, H * 0.30 + i * 26, col, w.big ? 24 : 16, 'center', true);
      ctx.globalAlpha = 1;
      i++;
    }
    void p;
  }

  /* ---------------- 消息 ---------------- */
  function drawMsgs(ctx, G, W, H) {
    const x = HUD.touch ? 196 : 24;
    let y = 96;
    for (let i = G.msgs.length - 1; i >= 0; i--) {
      const m = G.msgs[i];
      const age = G.time - m.t;
      if (age > 7) continue;
      ctx.globalAlpha = clamp(1 - (age - 5) / 2, 0, 1);
      txt(ctx, m.text, x, y, m.color || C.g, m.big ? 16 : 13);
      y += m.big ? 22 : 18;
      ctx.globalAlpha = 1;
    }
  }

  void lerp; void _e;
  global.HUD = HUD;
})(window);