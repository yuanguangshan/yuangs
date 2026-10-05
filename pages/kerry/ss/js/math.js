/* math.js — 极简线性代数库（vec3 / mat4 / quat），无依赖 */
(function (global) {
  'use strict';

  const DEG = Math.PI / 180, RAD = 180 / Math.PI, TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sign = v => (v < 0 ? -1 : 1);
  const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  // 帧率无关的指数平滑系数
  const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
  // 把角度归一到 (-PI, PI]
  const wrapPi = a => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };

  /* ============================ vec3 ============================ */
  const V3 = {
    create: (x = 0, y = 0, z = 0) => ({ x, y, z }),
    set(o, x, y, z) { o.x = x; o.y = y; o.z = z; return o; },
    // 只改分量、不改对象引用（.set 的 3 参陷阱）
    setv(o, x, y, z) { o.x = x; o.y = y; o.z = z; return o; },
    copy(o, a) { o.x = a.x; o.y = a.y; o.z = a.z; return o; },
    clone(a) { return { x: a.x, y: a.y, z: a.z }; },
    zero(o) { o.x = o.y = o.z = 0; return o; },
    add(o, a, b) { o.x = a.x + b.x; o.y = a.y + b.y; o.z = a.z + b.z; return o; },
    sub(o, a, b) { o.x = a.x - b.x; o.y = a.y - b.y; o.z = a.z - b.z; return o; },
    mul(o, a, b) { o.x = a.x * b.x; o.y = a.y * b.y; o.z = a.z * b.z; return o; },
    scale(o, a, s) { o.x = a.x * s; o.y = a.y * s; o.z = a.z * s; return o; },
    addScaled(o, a, b, s) { o.x = a.x + b.x * s; o.y = a.y + b.y * s; o.z = a.z + b.z * s; return o; },
    neg(o, a) { o.x = -a.x; o.y = -a.y; o.z = -a.z; return o; },
    dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
    cross(o, a, b) {
      const ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
      o.x = ay * bz - az * by; o.y = az * bx - ax * bz; o.z = ax * by - ay * bx; return o;
    },
    lenSq: a => a.x * a.x + a.y * a.y + a.z * a.z,
    len: a => Math.hypot(a.x, a.y, a.z),
    distSq: (a, b) => { const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z; return dx * dx + dy * dy + dz * dz; },
    dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
    horizDistSq: (a, b) => { const dx = a.x - b.x, dz = a.z - b.z; return dx * dx + dz * dz; },
    horizDist: (a, b) => Math.hypot(a.x - b.x, a.z - b.z),
    normalize(o, a) { const l = Math.hypot(a.x, a.y, a.z) || 1; o.x = a.x / l; o.y = a.y / l; o.z = a.z / l; return o; },
    lerp(o, a, b, t) { o.x = a.x + (b.x - a.x) * t; o.y = a.y + (b.y - a.y) * t; o.z = a.z + (b.z - a.z) * t; return o; },
    // 用四元数旋转向量
    transformQuat(o, a, q) {
      const { x, y, z } = a, qx = q.x, qy = q.y, qz = q.z, qw = q.w;
      const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
      o.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      o.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      o.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      return o;
    },
    transformM4(o, a, m) {
      const x = a.x, y = a.y, z = a.z;
      const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
      o.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
      o.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      o.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
      return o;
    },
    transformDirM4(o, a, m) {
      const x = a.x, y = a.y, z = a.z;
      o.x = m[0] * x + m[4] * y + m[8] * z;
      o.y = m[1] * x + m[5] * y + m[9] * z;
      o.z = m[2] * x + m[6] * y + m[10] * z;
      return o;
    },
    // 世界点 -> 以 origin 为中心、朝向 dir 的圆柱体局部坐标（用于甲板判定）
    toLocal(o, p, origin, dir, upHint) {
      const dx = p.x - origin.x, dy = p.y - origin.y, dz = p.z - origin.z;
      const fx = dir.x, fy = dir.y, fz = dir.z;
      const rx = fz, rz = -fx;                    // right = forward × up(0,1,0) 取近似
      const rl = Math.hypot(rx, rz) || 1;
      o.z = dx * fx + dy * fy + dz * fz;          // 沿航向
      o.x = (dx * rx + dz * rz) / rl;             // 横向（右为正）
      o.y = dy - fy * (dx * fx + dy * fy + dz * fz) / (fy || 1);
      return o;
    },
  };

  /* ============================ mat4（列主序） ============================ */
  const M4 = {
    create() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); },
    identity(o) { o.set(M4.I); return o; },
    copy(o, a) { o.set(a); return o; },
    I: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    multiply(o, a, b) {
      const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      for (let i = 0; i < 4; i++) {
        const b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
        o[i * 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        o[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        o[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        o[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      }
      return o;
    },
    perspective(o, fovy, aspect, near, far) {
      const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
      o[0] = f / aspect; o[1] = 0; o[2] = 0; o[3] = 0;
      o[4] = 0; o[5] = f; o[6] = 0; o[7] = 0;
      o[8] = 0; o[9] = 0; o[10] = (far + near) * nf; o[11] = -1;
      o[12] = 0; o[13] = 0; o[14] = 2 * far * near * nf; o[15] = 0;
      return o;
    },
    lookAt(o, eye, center, up) {
      let zx = eye.x - center.x, zy = eye.y - center.y, zz = eye.z - center.z;
      let l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
      let xx = up.y * zz - up.z * zy, xy = up.z * zx - up.x * zz, xz = up.x * zy - up.y * zx;
      l = Math.hypot(xx, xy, xz);
      if (l < 1e-6) { xx = 1; xy = 0; xz = 0; } else { xx /= l; xy /= l; xz /= l; }
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0;
      o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0;
      o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
      o[12] = -(xx * eye.x + xy * eye.y + xz * eye.z);
      o[13] = -(yx * eye.x + yy * eye.y + yz * eye.z);
      o[14] = -(zx * eye.x + zy * eye.y + zz * eye.z);
      o[15] = 1;
      return o;
    },
    fromRotTrans(o, q, p) {
      const x = q.x, y = q.y, z = q.z, w = q.w;
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      o[0] = 1 - (yy + zz); o[1] = xy + wz; o[2] = xz - wy; o[3] = 0;
      o[4] = xy - wz; o[5] = 1 - (xx + zz); o[6] = yz + wx; o[7] = 0;
      o[8] = xz + wy; o[9] = yz - wx; o[10] = 1 - (xx + yy); o[11] = 0;
      o[12] = p.x; o[13] = p.y; o[14] = p.z; o[15] = 1;
      return o;
    },
    fromRotTransScale(o, q, p, s) {
      M4.fromRotTrans(o, q, p);
      o[0] *= s; o[1] *= s; o[2] *= s;
      o[4] *= s; o[5] *= s; o[6] *= s;
      o[8] *= s; o[9] *= s; o[10] *= s;
      return o;
    },
    scaleXYZ(o, x, y, z) { M4.identity(o); o[0] = x; o[5] = y; o[10] = z; return o; },
    rotY(o, a) {
      const c = Math.cos(a), s = Math.sin(a);
      M4.identity(o); o[0] = c; o[2] = -s; o[8] = s; o[10] = c; return o;
    },
    rotX(o, a) {
      const c = Math.cos(a), s = Math.sin(a);
      M4.identity(o); o[5] = c; o[6] = s; o[9] = -s; o[10] = c; return o;
    },
    rotZ(o, a) {
      const c = Math.cos(a), s = Math.sin(a);
      M4.identity(o); o[0] = c; o[1] = s; o[4] = -s; o[5] = c; return o;
    },
    translate(o, x, y, z) { M4.identity(o); o[12] = x; o[13] = y; o[14] = z; return o; },
    invert(o, a) {
      const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
      let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) return M4.identity(o);
      det = 1 / det;
      o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      return o;
    },
    // 由 4x4 提取法线矩阵（3x3，逆转置）
    normalMat(o3, m) {
      const a00 = m[0], a01 = m[1], a02 = m[2], a10 = m[4], a11 = m[5], a12 = m[6], a20 = m[8], a21 = m[9], a22 = m[10];
      const b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
      let det = a00 * b01 + a01 * b11 + a02 * b21;
      if (!det) { o3[0] = o3[4] = o3[8] = 1; o3[1] = o3[5] = o3[9] = 0; o3[2] = o3[6] = o3[10] = 0; return o3; }
      det = 1 / det;
      o3[0] = b01 * det;
      o3[1] = (-a22 * a01 + a02 * a21) * det;
      o3[2] = (a12 * a01 - a02 * a11) * det;
      o3[3] = b11 * det;
      o3[4] = (a22 * a00 - a02 * a20) * det;
      o3[5] = (-a12 * a00 + a02 * a10) * det;
      o3[6] = b21 * det;
      o3[7] = (-a21 * a00 + a01 * a20) * det;
      o3[8] = (a11 * a00 - a01 * a10) * det;
      return o3;
    },
  };

  /* ============================ quat（x,y,z,w） ============================ */
  const Q = {
    create: (x = 0, y = 0, z = 0, w = 1) => ({ x, y, z, w }),
    identity(o) { o.x = 0; o.y = 0; o.z = 0; o.w = 1; return o; },
    copy(o, a) { o.x = a.x; o.y = a.y; o.z = a.z; o.w = a.w; return o; },
    setAxisAngle(o, ax, ay, az, rad) {
      const h = rad * 0.5, s = Math.sin(h);
      o.x = ax * s; o.y = ay * s; o.z = az * s; o.w = Math.cos(h); return o;
    },
    multiply(o, a, b) {
      const ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
      o.x = ax * bw + aw * bx + ay * bz - az * by;
      o.y = ay * bw + aw * by + az * bx - ax * bz;
      o.z = az * bw + aw * bz + ax * by - ay * bx;
      o.w = aw * bw - ax * bx - ay * by - az * bz;
      return o;
    },
    normalize(o, a) {
      let l = Math.hypot(a.x, a.y, a.z, a.w) || 1;
      o.x = a.x / l; o.y = a.y / l; o.z = a.z / l; o.w = a.w / l; return o;
    },
    slerp(o, a, b, t) {
      let ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
      let cos = ax * bx + ay * by + az * bz + aw * bw;
      if (cos < 0) { cos = -cos; bx = -bx; by = -by; bz = -bz; bw = -bw; }
      let s0, s1;
      if (1 - cos > 1e-6) {
        const om = Math.acos(cos), sin = Math.sin(om);
        s0 = Math.sin((1 - t) * om) / sin; s1 = Math.sin(t * om) / sin;
      } else { s0 = 1 - t; s1 = t; }
      o.x = s0 * ax + s1 * bx; o.y = s0 * ay + s1 * by; o.z = s0 * az + s1 * bz; o.w = s0 * aw + s1 * bw;
      return o;
    },
    // 航向(罗盘角：0=正北，顺时针为正) → 俯仰(抬头为正) → 滚转(右滚为正)
    // q = Ry(-yaw) * Rx(pitch) * Rz(-roll)
    fromEulerYXZ(o, yaw, pitch, roll) {
      const qy = { x: 0, y: Math.sin(-yaw * .5), z: 0, w: Math.cos(yaw * .5) };
      const qx = { x: Math.sin(pitch * .5), y: 0, z: 0, w: Math.cos(pitch * .5) };
      const qz = { x: 0, y: 0, z: -Math.sin(roll * .5), w: Math.cos(roll * .5) };
      const a = { x: 0, y: 0, z: 0, w: 0 }, r = { x: 0, y: 0, z: 0, w: 0 };
      Q.multiply(a, qy, qx);
      Q.multiply(r, a, qz);
      o.x = r.x; o.y = r.y; o.z = r.z; o.w = r.w;
      return Q.normalize(o, o);
    },
    // 从四元数提取机体轴（世界系）——取旋转矩阵的三个列向量
    axes(o, q) {
      const { x, y, z, w } = q;
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      o.r = { x: 1 - (yy + zz), y: xy + wz, z: xz - wy };       // 右 = +X 列
      o.u = { x: xy - wz, y: 1 - (xx + zz), z: yz + wx };       // 上 = +Y 列
      o.f = { x: -(xz + wy), y: -(yz - wx), z: -(1 - (xx + yy)) }; // 前 = -Z 列
      return o;
    },
    // 四元数积分（角速度为机体系 rad/s）：q̇ = ½ q ⊗ ω
    integrate(o, q, wx, wy, wz, dt) {
      const hx = wx * dt * .5, hy = wy * dt * .5, hz = wz * dt * .5;
      const { x, y, z, w } = q;
      o.x = x + (hx * w + hz * y - hy * z);
      o.y = y + (hy * w + hx * z - hz * x);
      o.z = z + (hz * w + hy * x - hx * y);
      o.w = w + (-hx * x - hy * y - hz * z);
      return Q.normalize(o, o);
    },
    slerpVec(o, v, axis, ang) {
      const q = Q.create(); Q.setAxisAngle(q, axis.x, axis.y, axis.z, ang);
      return V3.transformQuat(o, v, q);
    },
    // 四元数 -> {yaw, pitch, roll}（用于 HUD 姿态仪）
    toEuler(o, q) {
      const f = V3.transformQuat(V3.create(), { x: 0, y: 0, z: -1 }, q);
      const r = V3.transformQuat(V3.create(), { x: 1, y: 0, z: 0 }, q);
      const u = V3.transformQuat(V3.create(), { x: 0, y: 1, z: 0 }, q);
      o.yaw = Math.atan2(-f.x, -f.z);
      o.pitch = Math.asin(clamp(f.y, -1, 1));
      // roll：机体右向量与"水平右向量"的夹角
      const flatR = { x: Math.cos(o.yaw), y: 0, z: -Math.sin(o.yaw) };
      o.roll = Math.atan2(u.y * flatR.x - u.x * 0, 0) || 0;
      // 更稳的滚转角：right 向量的水平分量 与 flatR 的夹角
      const hr = Math.hypot(r.x, r.z) || 1;
      const fh = Math.hypot(flatR.x, flatR.z) || 1;
      const d = (r.x * flatR.x + r.z * flatR.z) / (hr * fh);
      o.roll = -Math.acos(clamp(d, -1, 1)) * sign(r.y || 1);
      // 更正：垂直状态时退化，改用 up.y
      if (u.y > 0.9999) o.roll = 0;
      return o;
    },
  };

  global.MM = { V3, M4, Q, DEG, RAD, TAU, clamp, lerp, sign, smoothstep, damp, wrapPi };
})(window);