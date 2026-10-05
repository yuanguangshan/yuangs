/* entities.js — 飞行力学、飞机、舰船、导弹、炸弹、干扰弹与敌机 AI */
(function (global) {
  'use strict';
  const { V3, Q, clamp, lerp, smoothstep, RAD } = MM;

  /* ============================ 物理参数 ============================ */
  const P = {
    g: 9.81, rho: 1.225, mass: 15500, S: 37,
    ClAlpha: 4.7, ClMax: 1.55, Cd0: 0.042, kInd: 0.050,
    Tmil: 62000, Tab: 152000,
    pitchRate: 0.85, rollRate: 3.9, yawRate: 0.55,
    authSpd: 58,
    aStall: 0.33,
    gearCd: 0.028, flapCd: 0.018, brakeCd: 0.05,
    fuelBurn: 0.0052,          // 每秒满油门耗油比例（约 190s）
    vNe: 175,
  };
  const AX = { f: { x: 0, y: 0, z: -1 }, u: { x: 0, y: 1, z: 0 }, r: { x: 1, y: 0, z: 0 } };

  const Ent = { P };

  /* ============================ 飞机 ============================ */
  Ent.makePlane = function (kind, x, y, z, yaw) {
    return {
      kind,
      pos: V3.create(x, y, z), vel: V3.create(0, 0, 0), q: Q.create(),
      omega: { x: 0, y: 0, z: 0 },
      throttle: 0, ab: false, gear: false, gearPos: 0, flap: 0, brake: false,
      onGround: false, groundY: 0, carrier: null,
      alive: true, hp: 100, fuel: 1, fuelIdle: 1,
      spd: 0, vs: 0, alpha: 0, gload: 1, stalled: false, aoaAbs: 0,
      // 战斗
      missiles: 6, bombs: 4, flares: 24, gunHeat: 0, gunCool: 0,
      lockT: 0, locked: false, lockTarget: null, lockConeOk: false, lockTone: 0,
      beingLocked: 0, inbound: 0,
      // AI
      state: 'idle', stateT: 0, skill: 0.6, aggression: 0.6, ammo: 4,
      evadeDir: 1, seed: Math.random() * 100, target: null,
      dying: 0, smokeT: 0, damageSmoke: false,
    };
  };

  Ent.axes = function (p) { return Q.axes(AX, p.q); };

  Ent.setOrientation = function (p, yaw, pitch, roll) {
    Q.fromEulerYXZ(p.q, yaw, pitch, roll);
  };

  Ent.orientFromFwdUp = function (p, fwd, upHint) {
    // 由前向 + 参考上向量构造四元数
    const f = V3.normalize(V3.create(), fwd);
    let u = upHint ? V3.clone(upHint) : V3.create(f.z, 0, -f.x);
    if (V3.lenSq(u) < 1e-6) u = V3.create(f.z, 0, -f.x);
    u = V3.normalize(u, u);
    // 右手系：right = f × up，up = right × f
    const r = V3.normalize(V3.create(), V3.cross(V3.create(), f, u));
    V3.cross(u, r, f);
    // 旋转矩阵 -> 四元数
    const m00 = r.x, m01 = u.x, m02 = -f.x, m10 = r.y, m11 = u.y, m12 = -f.y,
      m20 = r.z, m21 = u.z, m22 = -f.z;
    const tr = m00 + m11 + m22;
    if (tr > 0) {
      const s = Math.sqrt(tr + 1) * 2;
      p.q.w = 0.25 * s; p.q.x = (m21 - m12) / s; p.q.y = (m02 - m20) / s; p.q.z = (m10 - m01) / s;
    } else if (m00 > m11 && m00 > m22) {
      const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
      p.q.w = (m21 - m12) / s; p.q.x = 0.25 * s; p.q.y = (m01 + m10) / s; p.q.z = (m02 + m20) / s;
    } else if (m11 > m22) {
      const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
      p.q.w = (m02 - m20) / s; p.q.x = (m01 + m10) / s; p.q.y = 0.25 * s; p.q.z = (m12 + m21) / s;
    } else {
      const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
      p.q.w = (m10 - m01) / s; p.q.x = (m02 + m20) / s; p.q.y = (m12 + m21) / s; p.q.z = 0.25 * s;
    }
    Q.normalize(p.q, p.q);
  };

  const _d1 = V3.create(), _d2 = V3.create(), _d3 = V3.create(), _lift = V3.create(), _acc = V3.create();

  /** 空中飞行力学一步 */
  Ent.updatePlane = function (p, dt, c) {
    const ax = Q.axes(AX, p.q);
    const F = ax.f, U = ax.u, R = ax.r;
    let spd = V3.len(p.vel);
    let vhx, vhy, vhz;
    if (spd > 0.5) { vhx = p.vel.x / spd; vhy = p.vel.y / spd; vhz = p.vel.z / spd; }
    else { vhx = F.x; vhy = F.y; vhz = F.z; spd = 0; }

    // 迎角
    const vf = vhx * F.x + vhy * F.y + vhz * F.z;
    const vu = vhx * U.x + vhy * U.y + vhz * U.z;
    const alpha = Math.atan2(-vu, clamp(vf, -1, 1));
    p.alpha = alpha; p.aoaAbs = Math.abs(alpha);

    // 升力系数：线性段 → 到达 ClMax 后保持并缓慢衰减（真实战机失速后仍有相当升力）
    let Cl;
    if (p.aoaAbs <= P.aStall) Cl = P.ClAlpha * alpha;
    else {
      const t = clamp((p.aoaAbs - P.aStall) / 0.30, 0, 1);
      Cl = P.ClMax * (1 - 0.55 * t * t) * (alpha < 0 ? -1 : 1);
    }
    const wasStall = p.stalled;
    p.stalled = p.aoaAbs > P.aStall + 0.02;

    const qd = 0.5 * P.rho * spd * spd;
    const liftMag = qd * P.S * Cl;
    // 升力方向：机体上方在速度平面内的投影
    const vuDot = vhx * U.x + vhy * U.y + vhz * U.z;
    V3.setv(_lift, U.x - vhx * vuDot, U.y - vhy * vuDot, U.z - vhz * vuDot);
    const ll = V3.len(_lift);
    if (ll > 1e-4) V3.scale(_lift, _lift, 1 / ll); else V3.copy(_lift, U);

    // 阻力（含起落架 / 襟翼 / 减速板）
    let cd = P.Cd0 + Cl * Cl * P.kInd + p.gearPos * P.gearCd + p.flap * P.flapCd;
    if (c.brake) cd += P.brakeCd;
    if (c.slow) cd += 0.022;
    const dragMag = qd * P.S * cd;

    // 推力
    let T = c.throttle * P.Tmil;
    if (c.ab && c.throttle > 0.96) T = P.Tab * (0.55 + 0.45 * c.throttle);
    const hasFuel = p.fuel > 0;
    if (!hasFuel) T = 0;

    // 加速度
    V3.setv(_acc, 0, -P.g, 0);
    _acc.x += (liftMag * _lift.x - dragMag * vhx + T * F.x) / P.mass;
    _acc.y += (liftMag * _lift.y - dragMag * vhy + T * F.y) / P.mass;
    _acc.z += (liftMag * _lift.z - dragMag * vhz + T * F.z) / P.mass;
    // 侧向力（抑制侧滑）
    const sideV = vhx * R.x + vhy * R.y + vhz * R.z;
    const sideF = -sideV * spd * 0.55;
    _acc.x += sideF * R.x / P.mass; _acc.y += sideF * R.y / P.mass; _acc.z += sideF * R.z / P.mass;
    // 地面效应（低空翼尖诱导阻力降低）
    if (p.pos.y < 120) {
      const k = smoothstep(120, 8, p.pos.y) * 0.35;
      _acc.x -= dragMag * k * vhx / P.mass;
      _acc.y -= dragMag * k * vhy / P.mass;
      _acc.z -= dragMag * k * vhz / P.mass;
    }

    p.vel.x += _acc.x * dt; p.vel.y += _acc.y * dt; p.vel.z += _acc.z * dt;
    p.pos.x += p.vel.x * dt; p.pos.y += p.vel.y * dt; p.pos.z += p.vel.z * dt;

    // 过载
    const nz = (_lift.x * _acc.x + _lift.y * _acc.y + _lift.z * _acc.z + P.g) / P.g;
    p.gload = lerp(p.gload, clamp(nz, -4, 12), 1 - Math.exp(-8 * dt));

    // 角运动
    const auth = clamp(spd / P.authSpd, 0.12, 1.05) * (1 - 0.28 * clamp(spd / 340, 0, 1));
    let pr = c.pitch * P.pitchRate * auth;
    let rr = c.roll * P.rollRate * auth;
    let yr = c.yaw * P.yawRate * auth;
    if (p.stalled) { pr *= 0.5; rr *= 0.55; }
    // 迎角限制（模拟飞控律 FLAT-B）：超过 ~22° 后操纵权限快速衰减，避免一拉到底翻筋斗
    if (p.aoaAbs > 0.38) pr *= clamp(1 - (p.aoaAbs - 0.38) / 0.34, 0.10, 1);
    // 超限自动推杆：迎角过大时飞控主动压低头，保证可恢复
    if (p.aoaAbs > 0.42 && p.fbw !== false) pr -= (p.aoaAbs - 0.42) * 5.0;
    // 协调转弯
    const rH = Math.hypot(R.x, R.z);
    const bank = Math.atan2(-R.y, rH);
    yr += (P.g * Math.tan(clamp(bank, -1.2, 1.2)) / Math.max(spd, 60)) * 0.62;
    // 自动回平（可关闭）
    if (!c.roll && c.assist !== false) rr += -bank * 0.75;
    // 机体系角速度：pitch 抬头为正，yaw 右转为正（世界系中绕 -Y 轴），roll 右滚为正
    Q.integrate(p.q, p.q, pr, -yr, -rr, dt);
    p.omega.x = pr; p.omega.y = yr; p.omega.z = -rr;

    // 燃油
    if (hasFuel) {
      const burn = P.fuelBurn * (0.55 + 0.85 * c.throttle + (c.ab ? 0.5 : 0));
      p.fuel = Math.max(0, p.fuel - burn * dt);
    }
    // 数值
    p.spd = V3.len(p.vel);
    p.vs = p.vel.y;
    p.stalled = p.stalled || wasStall && spd < 120;
  };

  /* ============================ 舰船 ============================ */
  const SHIP_DEF = {
    carrier: { len: 330, beam: 41, deckY: 14, mass: 60000, hp: 100000, speed: 9.4, name: 'CVN-72 亚伯拉罕·林肯' },
    destroyer: { len: 145, beam: 16, deckY: 11, mass: 9000, hp: 4200, speed: 8.2, name: 'DDG-112 约翰·芬' },
  };

  Ent.makeShip = function (kind, x, z, yaw) {
    const d = SHIP_DEF[kind];
    return {
      kind, def: d, name: d.name,
      pos: V3.create(x, 0, z), vel: V3.create(0, 0, 0), yaw,
      speed: d.speed, targetSpeed: d.speed,
      len: d.len, beam: d.beam, deckY: d.deckY,
      hp: d.hp, maxHp: d.hp, alive: true, burning: 0,
      route: [], wp: 0, wakeT: 0, offset: null,
      q: Q.create(),
    };
  };
  // 航向角（罗盘式：0=北，右转为正）
  Ent.shipFwd = function (s) { return { x: Math.sin(s.yaw), y: 0, z: -Math.cos(s.yaw) }; };
  Ent.shipRight = function (s) { return { x: Math.cos(s.yaw), y: 0, z: Math.sin(s.yaw) }; };

  Ent.updateShip = function (s, dt, W) {
    if (!s.alive) return;
    if (s.offset) {
      // 随队：跟随母舰
      const m = W.ships.find(x => x.kind === 'carrier' && x.alive);
      if (m) {
        const f = Ent.shipFwd(m), r = Ent.shipRight(m);
        s.yaw = m.yaw;
        s.pos.x = m.pos.x + f.x * s.offset.z + r.x * s.offset.x;
        s.pos.z = m.pos.z + f.z * s.offset.z + r.z * s.offset.x;
        s.pos.y = Math.sin(W.time * 0.9 + s.offset.x) * 0.35;
      }
    } else if (s.route.length) {
      const wp = s.route[s.wp];
      const dx = wp.x - s.pos.x, dz = wp.z - s.pos.z;
      const want = Math.atan2(dx, -dz);
      const d = wrapTo(want - s.yaw);
      s.yaw += clamp(d, -0.035 * dt * 12, 0.035 * dt * 12);
      if (Math.abs(d) < 0.02 && Math.hypot(dx, dz) < 900) {
        s.wp = (s.wp + 1) % s.route.length;
      }
    }
    s.yaw = wrapTo(s.yaw);
    const f = Ent.shipFwd(s);
    s.vel.x = f.x * s.speed; s.vel.z = f.z * s.speed;
    s.pos.x += s.vel.x * dt; s.pos.z += s.vel.z * dt;
    s.pos.y = Math.sin(W.time * 0.75 + s.pos.x * 0.01) * 0.45;
    Q.fromEulerYXZ(s.q, s.yaw, 0, Math.sin(W.time * 0.6 + s.pos.z * 0.01) * 0.012);

    // 尾流
    s.wakeT -= dt;
    if (s.wakeT <= 0) {
      s.wakeT = 0.16;
      const r = Ent.shipRight(s);
      const bx = s.pos.x - f.x * s.len * 0.48, bz = s.pos.z - f.z * s.len * 0.48;
      FX.wake(V3.create(bx + r.x * s.beam * 0.45, 0.6, bz + r.z * s.beam * 0.45), r, 3);
      FX.wake(V3.create(bx - r.x * s.beam * 0.45, 0.6, bz - r.z * s.beam * 0.45), V3.create(-r.x, 0, -r.z), 3);
      const fx2 = s.pos.x + f.x * s.len * 0.45, fz = s.pos.z + f.z * s.len * 0.45;
      FX.wake(V3.create(fx2, 0.6, fz), r, 5);
    }
    // 起火冒烟
    if (s.burning > 0) {
      s.burning -= dt;
      if (Math.random() < 0.5) {
        FX.spawn(V3.create(s.pos.x + (Math.random() - .5) * s.len * 0.4, s.deckY + 6 + Math.random() * 10, s.pos.z + (Math.random() - .5) * s.beam), {
          vx: 0, vy: 9, vz: 0, life: 3.4, size0: 8, size1: 44,
          r: 0.16, g: 0.15, b: 0.15, r2: 0.5, g2: 0.5, b2: 0.52, a0: 0.65, drag: 0.4,
        });
      }
    }
  };

  function wrapTo(a) { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; }
  Ent.wrapTo = wrapTo;

  /** 世界点 -> 舰船局部坐标（z 沿航向，x 向右） */
  Ent.shipLocal = function (s, p, out) {
    const f = Ent.shipFwd(s), r = Ent.shipRight(s);
    const dx = p.x - s.pos.x, dz = p.z - s.pos.z;
    const o = out || V3.create();
    o.z = dx * f.x + dz * f.z;
    o.x = dx * r.x + dz * r.z;
    o.y = p.y - s.pos.y;
    return o;
  };

  /* ============================ 导弹 ============================ */
  Ent.makeMissile = function (pos, dir, target, fromPlayer, kind) {
    const spd = 330;
    return {
      pos: V3.create(pos.x, pos.y, pos.z),
      vel: V3.create(dir.x * spd, dir.y * spd, dir.z * spd),
      target, fromPlayer, kind: kind || 'aim',
      fuel: 26, ttl: 90, armed: 0, lost: 0, alive: true,
      turnRate: 0.42, speed: spd, maxSpeed: 560,
      prox: 70, trailT: 0, armedT: 0, armDelay: 1.1,
    };
  };

  Ent.updateMissile = function (m, dt, W) {
    if (!m.alive) return;
    m.ttl -= dt; m.armedT += dt;
    if (m.ttl <= 0 || m.fuel <= 0) { m.lost = Math.max(m.lost, 2.0); }
    if (m.fuel > 0) m.fuel -= dt;

    // 目标（可能被干扰弹诱骗）
    let tg = m.target;
    if (!tg || !tg.alive) {
      const fl = nearestFlare(m, W, m.lost > 0);
      tg = fl || null;
    }
    if (m.lost > 0) m.lost -= dt;
    const hasLock = tg && m.lost <= 0;

    V3.normalize(_d1, m.vel);
    if (hasLock) {
      V3.sub(_d2, tg.pos, m.pos);
      const dist = V3.len(_d2);
      const vT = tg.vel || { x: 0, y: 0, z: 0 };
      const closing = Math.max(60, m.speed - V3.dot(vT, _d1));
      const tI = dist / closing;
      // 提前量 + 少量比例导引修正
      const ax = tg.pos.x + vT.x * tI * 0.92, ay = tg.pos.y + vT.y * tI * 0.92, az = tg.pos.z + vT.z * tI * 0.92;
      V3.set(_d3, ax - m.pos.x, ay - m.pos.y, az - m.pos.z);
      V3.normalize(_d3, _d3);
      turnToward(m, _d3, dt);
      if (dist < m.prox && m.armedT > m.armDelay) detonate(m, W);
    } else {
      m.lost = Math.max(m.lost, 1.6);
      // 无控直飞
      if (m.fuel > 0) m.speed = Math.min(m.maxSpeed, m.speed + 42 * dt);
      V3.scale(m.vel, _d1, m.speed);
      m.pos.x += m.vel.x * dt; m.pos.y += m.vel.y * dt; m.pos.z += m.vel.z * dt;
      if (m.fuel <= 0) m.vel.y -= 9.81 * dt;
      if (m.pos.y < 2 || m.ttl <= 0) detonate(m, W, true);
      m.trailT -= dt;
      if (m.trailT <= 0) { m.trailT = 0.02; trailFX(m.pos, m.vel); }
      return;
    }

    // 推力与速度（注意：用转向后的方向重新归一化，否则会覆盖掉 turnToward 的结果）
    if (m.fuel > 0) m.speed = Math.min(m.maxSpeed, m.speed + 40 * dt);
    else m.speed = Math.max(180, m.speed - 4 * dt);
    V3.normalize(_d1, m.vel);
    V3.scale(m.vel, _d1, m.speed);
    m.pos.x += m.vel.x * dt; m.pos.y += m.vel.y * dt; m.pos.z += m.vel.z * dt;
    m.turnRate = lerp(0.40, 0.13, clamp(1 - m.fuel / 26, 0, 1));
    if (m.pos.y < 2) detonate(m, W, true);
    m.trailT -= dt;
    if (m.trailT <= 0) { m.trailT = 0.018; trailFX(m.pos, m.vel); }
  };

  function turnToward(m, desired, dt) {
    const cur = V3.normalize(_d1, m.vel);
    const dot = clamp(V3.dot(cur, desired), -1, 1);
    let ang = Math.acos(dot);
    const maxAng = m.turnRate * dt;
    if (ang > 1e-4) {
      const t = Math.min(1, maxAng / ang);
      const nx = lerp(cur.x, desired.x, t), ny = lerp(cur.y, desired.y, t), nz = lerp(cur.z, desired.z, t);
      V3.normalize(m.vel, V3.set(_d2, nx, ny, nz));
    }
  }

  function trailFX(pos, vel) {
    V3.normalize(_d1, vel);
    FX.spawn(pos, {
      vx: -_d1.x * 8, vy: -_d1.y * 8, vz: -_d1.z * 8,
      life: 1.5, size0: 2.2, size1: 15,
      r: 0.95, g: 0.95, b: 0.96, r2: 0.7, g2: 0.72, b2: 0.75, a0: 0.30, drag: 0.9,
    });
    if (Math.random() < 0.5) {
      FX.spawn(pos, {
        vx: 0, vy: 0, vz: 0, life: 0.16, size0: 1.4, size1: 0.3,
        r: 1, g: 0.7, b: 0.35, a0: 0.9, add: true,
      });
    }
  }

  function nearestFlare(m, W, any) {
    let best = null, bd = any ? 1e9 : 1600;
    for (const f of W.flares) {
      const d = V3.dist(f.pos, m.pos);
      if (d < bd) { bd = d; best = f; }
    }
    return best;
  }

  function detonate(m, W, dud) {
    if (!m.alive) return;
    m.alive = false;
    FX.explosion(m.pos, dud ? 0.8 : 1.25);
    AudioSys.play('explode', { pos: m.pos });
    W.shake(clamp(60 / Math.max(30, V3.dist(m.pos, W.eye)), 0, 1));
    const R = dud ? 30 : 130;
    if (dud) return;
    for (const e of W.enemies) {
      if (!e.alive) continue;
      const d = V3.dist(e.pos, m.pos);
      // 近炸引信内基本必杀（145 * k，k∈[0.25,1]）
      if (d < R) W.damagePlane(e, 150 * clamp(1 - (d - 55) / 90, 0.25, 1), m);
    }
    if (W.player.alive) {
      const d = V3.dist(W.player.pos, m.pos);
      if (d < R) W.damagePlane(W.player, 120 * clamp(1 - (d - 55) / 90, 0.25, 1), m);
    }
    for (const s of W.ships) {
      if (!s.alive) continue;
      const d = V3.dist(s.pos, m.pos);
      if (d < R) W.damageShip(s, 110 * (1 - d / R) * (s.kind === 'carrier' ? 0.25 : 1));
    }
  }

  /* ============================ 炸弹 ============================ */
  Ent.makeBomb = function (pos, vel, ship) {
    return { pos: V3.create(pos.x, pos.y, pos.z), vel: V3.create(vel.x, vel.y, vel.z), alive: true, spin: 0, ttl: 30 };
  };
  Ent.updateBomb = function (b, dt, W) {
    b.ttl -= dt;
    b.spin += dt * 6;
    b.vel.y -= 9.81 * dt;
    b.vel.x *= 1 - 0.06 * dt; b.vel.z *= 1 - 0.06 * dt;
    b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt; b.pos.z += b.vel.z * dt;
    if (Math.random() < 0.6) FX.spawn(b.pos, { life: 0.5, size0: 1.4, size1: 5, r: 0.9, g: 0.9, b: 0.92, a0: 0.25 });
    if (b.pos.y < 1.5 || b.ttl <= 0) {
      b.alive = false;
      const onShip = W.ships.some(s => s.alive && Math.abs(Ent.shipLocal(s, b.pos).z) < s.len * 0.5 && Math.abs(Ent.shipLocal(s, b.pos).x) < s.beam * 0.5);
      FX.explosion(b.pos, 1.5);
      FX.splash(b.pos, 2.2);
      AudioSys.play('explode', { pos: b.pos });
      W.shake(clamp(120 / Math.max(40, V3.dist(b.pos, W.eye)), 0, 1));
      for (const s of W.ships) {
        if (!s.alive) continue;
        const d = V3.dist(s.pos, b.pos);
        if (d < 220) W.damageShip(s, 420 * (1 - d / 220));
      }
      if (!onShip) W.log('炸弹落点偏离目标舰船');
    }
  };

  /* ============================ 干扰弹 ============================ */
  Ent.makeFlare = function (pos, vel) {
    return { pos: V3.create(pos.x, pos.y, pos.z), vel: V3.create(vel.x, vel.y, vel.z), life: 7, alive: true };
  };
  Ent.updateFlare = function (f, dt) {
    f.life -= dt;
    if (f.life <= 0) { f.alive = false; return; }
    f.vel.y -= 7 * dt;
    f.vel.x *= 1 - 1.1 * dt; f.vel.z *= 1 - 1.1 * dt;
    f.pos.x += f.vel.x * dt; f.pos.y += f.vel.y * dt; f.pos.z += f.vel.z * dt;
    if (Math.random() < 0.85) FX.flare(f.pos, f.vel);
  };

  /* ============================ 曳光弹（机炮） ============================ */
  Ent.makeTracer = function (pos, vel, life, fromPlayer) {
    return { p0: V3.create(pos.x, pos.y, pos.z), p1: V3.create(pos.x, pos.y, pos.z), vel: V3.clone(vel), life, max: life, fromPlayer };
  };
  Ent.updateTracer = function (t, dt) {
    t.life -= dt;
    V3.copy(t.p0, t.p1);
    t.p1.x += t.vel.x * dt; t.p1.y += t.vel.y * dt; t.p1.z += t.vel.z * dt;
    t.vel.y -= 4 * dt;
  };

  /* ============================ 敌机 AI ============================ */
  const _vTo = V3.create(), _cr = V3.create();

  Ent.aiThink = function (e, dt, W) {
    const ax = Q.axes(AX, e.q);
    const P0 = e.pos;
    const c = { pitch: 0, roll: 0, yaw: 0, throttle: 1, ab: false, brake: false, assist: false };
    e.stateT += dt;
    const tgt = W.player.alive ? W.player : null;

    // 威胁评估：是否有导弹逼近
    let threat = null, td = 1e9;
    for (const m of W.missiles) {
      if (!m.alive || m.fromPlayer || !m.target) continue;
      const d = V3.dist(m.pos, e.pos);
      if (d < td) { td = d; threat = m; }
    }
    if (threat && td < 2600) {
      e.inbound = 1;
      if (!e.evadeNow) { e.evadeNow = true; e.state = 'break'; e.stateT = 0; e.evadeDir = Math.random() < 0.5 ? -1 : 1; AudioSys.play('flare', { pos: e.pos }); W.dropFlares(e, 6); }
    } else e.inbound = 0;

    let aimPoint = null;
    if (e.state === 'break') {
      if (e.stateT > 9 || (!threat && e.stateT > 4)) { e.state = 'pursue'; e.stateT = 0; e.evadeNow = false; }
    }
    if (e.state === 'rtb') {
      if (e.stateT > 25) { e.state = 'pursue'; e.stateT = 0; }
    }

    switch (e.state) {
      case 'ingress': {
        if (tgt) {
          V3.set(_vTo, tgt.pos.x - P0.x, tgt.pos.y - P0.y, tgt.pos.z - P0.z);
          if (V3.len(_vTo) < 14000) { e.state = 'pursue'; e.stateT = 0; }
        }
        aimPoint = _vTo;
        break;
      }
      case 'pursue': {
        if (e.hp < 35 || e.fuel < 0.12) { e.state = 'rtb'; e.stateT = 0; break; }
        if (!tgt) { aimPoint = { x: P0.x, y: 1200, z: P0.z - 3000 }; break; }
        V3.set(_vTo, tgt.pos.x - P0.x, tgt.pos.y - P0.y, tgt.pos.z - P0.z);
        const d = V3.len(_vTo);
        // 锁定与发射
        V3.normalize(_vTo, _vTo);
        const cone = V3.dot(_vTo, ax.f);
        e.lockTone += dt;
        if (cone > 0.94 && d < 12000 && d > 700) {
          e.lockT = Math.min(1, e.lockT + dt * (0.55 + e.skill * 0.9));
          if (e.lockT >= 1 && e.ammo > 0 && e.fireCd <= 0) {
            e.ammo--; e.fireCd = 5.5 + Math.random() * 4;
            e.lockT = 0; e.lockTone = 0;
            W.fireMissile(e, tgt);
          }
        } else {
          e.lockT = Math.max(0, e.lockT - dt * 0.8);
          if (e.lockTone > 3.2) e.lockTone = 0;
        }
        // 攻击机动：接近后做桶滚
        if (d < 3500 && !e.rolling) { e.rolling = 4 + Math.random() * 3; }
        if (e.rolling > 0) e.rolling -= dt;
        aimPoint = _vTo;
        break;
      }
      case 'break': {
        // 规避：朝侧下方大坡度转弯
        const th = threat ? threat.pos : (tgt ? tgt.pos : { x: P0.x, y: 0, z: P0.z });
        V3.set(_vTo, P0.x - th.x, 200 - P0.y * 0.1, P0.z - th.z);
        aimPoint = _vTo;
        c.throttle = 1; c.ab = true;
        break;
      }
      case 'rtb': {
        V3.set(_vTo, P0.x - (tgt ? tgt.pos.x : P0.x), 900, P0.z - (tgt ? tgt.pos.z : P0.z));
        V3.normalize(_vTo, _vTo);
        aimPoint = _vTo;
        c.throttle = 0.9;
        break;
      }
      default: e.state = 'pursue';
    }

    if (e.fireCd > 0) e.fireCd -= dt;

    // 转换为操纵输入
    if (!aimPoint) aimPoint = { x: P0.x, y: P0.y + 200, z: P0.z - 2000 };
    V3.normalize(_vTo, V3.set(_d2, aimPoint.x - P0.x, aimPoint.y - P0.y, aimPoint.z - P0.z));

    const errF = V3.dot(_vTo, ax.f);
    if (errF < 0) {
      // 目标在身后：做大坡度转弯（先滚转 180）
      c.roll = e.evadeDir * 1;
      c.pitch = 0.25;
    } else {
      V3.cross(_cr, ax.u, _vTo);
      const s = V3.dot(_cr, ax.f);
      const up = V3.dot(ax.u, _vTo);
      c.roll = clamp(s * 3.2, -1, 1);
      c.pitch = clamp(up * 3.4 + (e.rolling > 0 ? e.evadeDir * 0.35 : 0), -1, 1);
      // 速度管理
      const want = errF < 0.3 ? 0.55 : 1;
      c.throttle = want;
      c.ab = errF > 0.6 && e.spd < 260;
      if (e.spd > 330) c.throttle = 0.55;
    }
    // 高度保护
    if (P0.y < 220) { c.pitch = Math.max(c.pitch, 0.45); }
    if (P0.y > 9000) { c.pitch = Math.min(c.pitch, -0.3); }
    if (P0.y < 60 && e.vel.y < -30) { c.pitch = 1; }
    return c;
  };

  Ent.PHYS = P;
  void lerp; void smoothstep; void RAD;
  global.Ent = Ent;
})(window);