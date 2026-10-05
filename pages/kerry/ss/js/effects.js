/* effects.js — 粒子特效系统：爆炸、尾焰、烟、尾迹、溅射、水花 */
(function (global) {
  'use strict';
  const { V3, clamp, lerp } = MM;

  const MAX = 4200;
  const FX = {
    P: [],           // 粒子对象池
    n: 0,
    addBuf: new Float32Array(MAX * 8),
    alphaBuf: new Float32Array(MAX * 8),
    addN: 0, alphaN: 0,
    lines: [],
  };

  function particle() {
    if (FX.P.length < MAX) FX.P.push({});
    return FX.P[FX.P.length < MAX ? FX.P.length - 1 : (FX.__i = ((FX.__i || 0) + 1) % MAX)];
  }
  FX.particle = particle;

  /**
   * opts: {vx,vy,vz, life, size0,size1, r,g,b, r2,g2,b2, a0, drag, grav, add, spread}
   */
  FX.spawn = function (pos, opts) {
    const p = particle();
    p.x = pos.x; p.y = pos.y; p.z = pos.z;
    p.vx = opts.vx || 0; p.vy = opts.vy || 0; p.vz = opts.vz || 0;
    p.life = p.max = opts.life || 1;
    p.s0 = opts.size0 === undefined ? 2 : opts.size0;
    p.s1 = opts.size1 === undefined ? p.s0 : opts.size1;
    p.r = opts.r === undefined ? 1 : opts.r; p.g = opts.g === undefined ? 1 : opts.g; p.b = opts.b === undefined ? 1 : opts.b;
    p.r2 = opts.r2 === undefined ? p.r : opts.r2; p.g2 = opts.g2 === undefined ? p.g : opts.g2; p.b2 = opts.b2 === undefined ? p.b : opts.b2;
    p.a = opts.a0 === undefined ? 1 : opts.a0;
    p.drag = opts.drag === undefined ? 0.6 : opts.drag;
    p.grav = opts.grav || 0;
    p.add = !!opts.add;
    return p;
  };

  /** 随机方向速度 */
  FX.burst = function (pos, count, speed, opts) {
    for (let i = 0; i < count; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      const s = speed * (0.35 + 0.65 * Math.random());
      FX.spawn(pos, Object.assign({}, opts, {
        vx: Math.sin(ph) * Math.cos(th) * s, vy: Math.cos(ph) * s, vz: Math.sin(ph) * Math.sin(th) * s,
      }));
    }
  };

  /* ---------------- 预设特效 ---------------- */

  FX.muzzle = function (pos, dir) {
    for (let i = 0; i < 6; i++) {
      FX.spawn(pos, {
        vx: dir.x * 40 + (Math.random() - .5) * 12, vy: dir.y * 40 + (Math.random() - .5) * 12, vz: dir.z * 40 + (Math.random() - .5) * 12,
        life: 0.10 + Math.random() * 0.08, size0: 3.2, size1: 0.6,
        r: 1.0, g: 0.85, b: 0.45, r2: 1.0, g2: 0.35, b2: 0.1, a0: 0.95, add: true,
      });
    }
  };

  FX.afterburner = function (pos, dir, throttle) {
    if (Math.random() > 0.55 + throttle * 0.45) return;
    const sp = 26 + throttle * 30;
    FX.spawn(pos, {
      vx: -dir.x * sp + (Math.random() - .5) * 5, vy: -dir.y * sp + (Math.random() - .5) * 5, vz: -dir.z * sp + (Math.random() - .5) * 5,
      life: 0.16 + Math.random() * 0.14,
      size0: 1.6 + throttle * 2.4, size1: 0.4,
      r: 1.0, g: 0.72, b: 0.42, r2: 1.0, g2: 0.25, b2: 0.06,
      a0: 0.85, add: true,
    });
  };

  FX.exhaustTrail = function (pos) {
    FX.spawn(pos, {
      vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, vz: (Math.random() - .5) * 3,
      life: 0.9 + Math.random() * 0.8, size0: 3.0, size1: 14,
      r: 0.82, g: 0.84, b: 0.88, r2: 0.62, g2: 0.66, b2: 0.72,
      a0: 0.30, drag: 1.6, grav: 0.4, add: false,
    });
  };

  FX.vortex = function (pos, right) {
    FX.spawn(pos, {
      vx: right.x * 2, vy: 1.5, vz: right.z * 2,
      life: 0.7, size0: 1.2, size1: 7,
      r: 0.95, g: 0.97, b: 1.0, a0: 0.30, add: false,
    });
  };

  FX.contrail = function (pos) {
    FX.spawn(pos, {
      vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2, vz: (Math.random() - .5) * 2,
      life: 2.4 + Math.random(), size0: 2.5, size1: 26,
      r: 0.95, g: 0.96, b: 0.98, a0: 0.18, drag: 0.2, add: false,
    });
  };

  FX.impact = function (pos, dir) {
    FX.burst(pos, 14, 90, {
      life: 0.5, size0: 3, size1: 0.5,
      r: 1, g: 0.9, b: 0.55, r2: 1, g2: 0.3, b2: 0.1, a0: 1, add: true, drag: 2.5,
      vx: dir.x * 30, vy: dir.y * 30, vz: dir.z * 30,
    });
    FX.burst(pos, 6, 30, {
      life: 1.6, size0: 4, size1: 20,
      r: 0.25, g: 0.24, b: 0.24, r2: 0.4, g2: 0.4, b2: 0.42, a0: 0.6, drag: 1.0, grav: 1.5,
    });
  };

  /** 大爆炸：火球 + 烟 + 冲击碎片 */
  FX.explosion = function (pos, scale, opts) {
    const o = opts || {};
    const S = scale || 1;
    FX.burst(pos, Math.round(26 * S), 70 * S, {
      life: 0.55 + 0.25 * S, size0: 5 * S, size1: 2 * S,
      r: 1, g: 0.95, b: 0.7, r2: 1, g2: 0.35, b2: 0.08, a0: 1, add: true, drag: 2.2, grav: 2,
    });
    FX.burst(pos, Math.round(16 * S), 34 * S, {
      life: 0.9, size0: 8 * S, size1: 26 * S,
      r: 1, g: 0.6, b: 0.2, r2: 0.5, g2: 0.16, b2: 0.06, a0: 0.85, add: true, drag: 3.0,
    });
    FX.burst(pos, Math.round(18 * S), 26 * S, {
      life: 2.6 + S, size0: 10 * S, size1: 46 * S,
      r: 0.22, g: 0.21, b: 0.2, r2: 0.55, g2: 0.56, b2: 0.58,
      a0: 0.75, drag: 1.1, grav: -0.4,
    });
    FX.burst(pos, Math.round(10 * S), 140 * S, {
      life: 1.4, size0: 1.4 * S, size1: 0.4,
      r: 1, g: 0.8, b: 0.3, r2: 1, g2: 0.3, b2: 0.1, a0: 0.9, add: true, drag: 0.9, grav: 9,
    });
    void o;
  };

  FX.splash = function (pos, scale) {
    const S = scale || 1;
    FX.burst(pos, Math.round(16 * S), 26 * S, {
      life: 1.1, size0: 4 * S, size1: 22 * S,
      r: 0.92, g: 0.96, b: 0.98, r2: 0.75, g2: 0.85, b2: 0.9,
      a0: 0.8, drag: 1.4, grav: -3,
    });
    FX.burst(pos, Math.round(6 * S), 12 * S, {
      life: 1.6, size0: 6 * S, size1: 30 * S,
      r: 0.95, g: 0.98, b: 1.0, a0: 0.35, drag: 1.0, grav: -1.5,
    });
  };

  /** 舰船尾流 */
  FX.wake = function (pos, right, speed) {
    FX.spawn(pos, {
      vx: right.x * speed * 0.5 + (Math.random() - .5) * 3, vy: 0.6, vz: right.z * speed * 0.5 + (Math.random() - .5) * 3,
      life: 3.2, size0: 6, size1: 34,
      r: 0.88, g: 0.94, b: 0.97, a0: 0.34, drag: 0.5,
    });
  };

  FX.flare = function (pos, vel) {
    FX.spawn(pos, {
      vx: vel.x * 0.4 + (Math.random() - .5) * 30, vy: vel.y * 0.4 + (Math.random() - .5) * 30, vz: vel.z * 0.4 + (Math.random() - .5) * 30,
      life: 3.4, size0: 4, size1: 1,
      r: 1, g: 0.85, b: 0.5, r2: 1, g2: 0.2, b2: 0.1, a0: 1, add: true, drag: 0.9, grav: 5,
    });
  };

  FX.dust = function (pos, n, spread, speed) {
    FX.burst(pos, n, speed, {
      life: 1.8, size0: 3, size1: 26,
      r: 0.85, g: 0.82, b: 0.75, r2: 0.7, g2: 0.72, b2: 0.72, a0: 0.5, drag: 1.6, grav: -1,
      });
    void spread;
  };

  /* ---------------- 更新与渲染 ---------------- */
  FX.update = function (dt) {
    const P = FX.P;
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) continue;
      const d = Math.exp(-p.drag * dt);
      p.vx *= d; p.vz *= d; p.vy = p.vy * d - p.grav * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y < 0.5) { p.y = 0.5; p.vy = 0; }
    }
  };

  FX.render = function () {
    const P = FX.P;
    let a = 0, b = 0;
    const A = FX.addBuf, B = FX.alphaBuf;
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (p.life <= 0) continue;
      const t = 1 - p.life / p.max;
      const s = lerp(p.s0, p.s1, t);
      const alpha = p.a * (1 - t * t);
      if (alpha <= 0.004 || s <= 0.05) continue;
      if (p.add) {
        if (a >= MAX) continue;
        const o = a * 8;
        A[o] = p.x; A[o + 1] = p.y; A[o + 2] = p.z;
        A[o + 3] = lerp(p.r, p.r2, t); A[o + 4] = lerp(p.g, p.g2, t); A[o + 5] = lerp(p.b, p.b2, t);
        A[o + 6] = alpha; A[o + 7] = s;
        a++;
      } else {
        if (b >= MAX) continue;
        const o = b * 8;
        B[o] = p.x; B[o + 1] = p.y; B[o + 2] = p.z;
        B[o + 3] = lerp(p.r, p.r2, t); B[o + 4] = lerp(p.g, p.g2, t); B[o + 5] = lerp(p.b, p.b2, t);
        B[o + 6] = alpha; B[o + 7] = s;
        b++;
      }
    }
    FX.addN = a; FX.alphaN = b;
    GL.particles(A, a, B, b);
  };

  FX.reset = function () { FX.P.length = 0; FX.addN = FX.alphaN = 0; };

  global.FX = FX;
  void V3; void clamp;
})(window);