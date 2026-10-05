/* meshbuilder.js — 低多边形网格构造器（平面着色 / flat shading）
 * 坐标约定：机首朝 -Z，上方 +Y，原点在质心附近。
 * 产物：{ pos:Float32Array, nrm:Float32Array, col:Float32Array, count:number }
 */
(function (global) {
  'use strict';

  /* ---------- 颜色工具 ---------- */
  function hex(c) {
    if (Array.isArray(c)) return c;
    if (typeof c === 'number') return [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255];
    if (typeof c === 'string') {
      if (c[0] === '#') c = c.slice(1);
      if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      const n = parseInt(c, 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    return [1, 0, 1];
  }
  function shade(c, f) { c = hex(c); return [clampf(c[0] * f), clampf(c[1] * f), clampf(c[2] * f)]; }
  function mixc(a, b, t) { a = hex(a); b = hex(b); return [lerpf(a[0], b[0], t), lerpf(a[1], b[1], t), lerpf(a[2], b[2], t)]; }
  function clampf(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerpf(a, b, t) { return a + (b - a) * t; }

  /* ---------- 4x4 小工具（列主序，与 gl-matrix 风格一致） ---------- */
  const T = {
    ident: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    mul(o, a, b) {
      for (let i = 0; i < 4; i++) {
        const b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
        o[i * 4] = b0 * a[0] + b1 * a[4] + b2 * a[8] + b3 * a[12];
        o[i * 4 + 1] = b0 * a[1] + b1 * a[5] + b2 * a[9] + b3 * a[13];
        o[i * 4 + 2] = b0 * a[2] + b1 * a[6] + b2 * a[10] + b3 * a[14];
        o[i * 4 + 3] = b0 * a[3] + b1 * a[7] + b2 * a[11] + b3 * a[15];
      }
      return o;
    },
    translate(x, y, z) { const m = T.ident(); m[12] = x; m[13] = y; m[14] = z; return m; },
    scale(x, y, z) { const m = T.ident(); m[0] = x; m[5] = y; m[10] = z; return m; },
    rotX(a) { const m = T.ident(), c = Math.cos(a), s = Math.sin(a); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; },
    rotY(a) { const m = T.ident(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; },
    rotZ(a) { const m = T.ident(), c = Math.cos(a), s = Math.sin(a); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; },
  };

  /* ============================ Builder ============================ */
  function Builder() {
    this.pos = []; this.nrm = []; this.col = [];
    this.m = T.ident();
    this.stack = [];
    this.triCount = 0;
  }
  Builder.ident = T.ident;

  Builder.prototype._x = function (m) { this.m = T.mul(T.ident(), this.m, m); return this; };
  Builder.prototype.push = function () { this.stack.push(this.m.slice()); return this; };
  Builder.prototype.pop = function () { this.m = this.stack.pop() || T.ident(); return this; };
  Builder.prototype.translate = function (x, y, z) { return this._x(T.translate(x, y, z)); };
  Builder.prototype.scale = function (x, y, z) { return this._x(T.scale(x === undefined ? 1 : x, y === undefined ? 1 : y, z === undefined ? 1 : z)); };
  Builder.prototype.rotX = function (a) { return this._x(T.rotX(a)); };
  Builder.prototype.rotY = function (a) { return this._x(T.rotY(a)); };
  Builder.prototype.rotZ = function (a) { return this._x(T.rotZ(a)); };
  // 别名
  Builder.prototype.rotateX = Builder.prototype.rotX;
  Builder.prototype.rotateY = Builder.prototype.rotY;
  Builder.prototype.rotateZ = Builder.prototype.rotZ;
  Builder.prototype.applyMat = function (m) { return this._x(m); };

  // 点可以是 [x,y,z] 数组或 {x,y,z} 对象；注意不能用 `||` 兜底（坐标恰为 0 时会取到 undefined）
  Builder.prototype._xf = function (p) {
    const m = this.m;
    const x = (p.length !== undefined) ? p[0] : p.x;
    const y = (p.length !== undefined) ? p[1] : p.y;
    const z = (p.length !== undefined) ? p[2] : p.z;
    return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
  };
  Builder.prototype._xfDir = function (p) {
    const m = this.m;
    const x = (p.length !== undefined) ? p[0] : p.x;
    const y = (p.length !== undefined) ? p[1] : p.y;
    const z = (p.length !== undefined) ? p[2] : p.z;
    return [m[0] * x + m[4] * y + m[8] * z, m[1] * x + m[5] * y + m[9] * z, m[2] * x + m[6] * y + m[10] * z];
  };

  /** 三角形（平面着色） */
  Builder.prototype.tri = function (a, b, c, col) {
    const A = this._xf(a), B = this._xf(b), C = this._xf(c);
    const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
    const vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const rgb = hex(col);
    const P = this.pos, N = this.nrm, CO = this.col;
    for (let i = 0; i < 3; i++) {
      const p = i === 0 ? A : i === 1 ? B : C;
      P.push(p[0], p[1], p[2]); N.push(nx, ny, nz); CO.push(rgb[0], rgb[1], rgb[2]);
    }
    this.triCount++;
    return this;
  };
  /** 四边形（a-b-c-d 逆时针为正面） */
  Builder.prototype.quad = function (a, b, c, d, col) { this.tri(a, b, c, col); this.tri(a, c, d, col); return this; };
  /** 任意多边形（自动三角扇） */
  Builder.prototype.poly = function (pts, col) {
    for (let i = 1; i < pts.length - 1; i++) this.tri(pts[0], pts[i], pts[i + 1], col);
    return this;
  };

  /* ---------------- 基本体 ---------------- */

  /** 盒体：中心在原点，w=宽(x) h=高(y) d=深(z)。faces 可指定六面颜色 */
  Builder.prototype.box = function (w, h, d, col, faces) {
    const x = w / 2, y = h / 2, z = d / 2;
    const f = faces || {};
    const p = (sx, sy, sz) => [sx * x, sy * y, sz * z];
    if (f.pz !== false) this.quad(p(-1, -1, 1), p(1, -1, 1), p(1, 1, 1), p(-1, 1, 1), f.pz || col);
    if (f.nz !== false) this.quad(p(1, -1, -1), p(-1, -1, -1), p(-1, 1, -1), p(1, 1, -1), f.nz || col);
    if (f.px !== false) this.quad(p(1, -1, 1), p(1, -1, -1), p(1, 1, -1), p(1, 1, 1), f.px || col);
    if (f.nx !== false) this.quad(p(-1, -1, -1), p(-1, -1, 1), p(-1, 1, 1), p(-1, 1, -1), f.nx || col);
    if (f.py !== false) this.quad(p(-1, 1, 1), p(1, 1, 1), p(1, 1, -1), p(-1, 1, -1), f.py || col);
    if (f.ny !== false) this.quad(p(-1, -1, -1), p(1, -1, -1), p(1, -1, 1), p(-1, -1, 1), f.ny || col);
    return this;
  };

  /**
   * 沿 Z 的多边形放样：rings = [{z, pts:[[x,y],...]}, ...]，pts 数量一致。
   * 构造机身、船体、炮塔等一切"截面沿轴变化"的形体。
   */
  Builder.prototype.loft = function (rings, col, opts) {
    const o = opts || {};
    const shadeTop = o.shadeTop !== undefined ? o.shadeTop : 1.0;
    const n = rings.length;
    for (let i = 0; i < n - 1; i++) {
      const A = rings[i], B = rings[i + 1];
      const m = A.pts.length;
      for (let j = 0; j < m; j++) {
        const j2 = (j + 1) % m;
        const a = [A.pts[j][0], A.pts[j][1], A.z];
        const b = [A.pts[j2][0], A.pts[j2][1], A.z];
        const c = [B.pts[j2][0], B.pts[j2][1], B.z];
        const d = [B.pts[j][0], B.pts[j][1], B.z];
        // 上半部分提亮，增强体积感
        const mid = (A.pts[j][1] + B.pts[j][1]) * 0.5 / (Math.max(1, Math.abs(A.pts[j][0])) || 1);
        const cc = shadeTop === 1 ? col : shade(col, 1);
        this.quad(a, b, c, d, cc);
        void mid;
      }
    }
    if (o.caps) {
      // 首尾封口（用截面中心做扇形）
      const capRing = (R, flip) => {
        let cx = 0, cy = 0;
        for (const p of R.pts) { cx += p[0]; cy += p[1]; }
        cx /= R.pts.length; cy /= R.pts.length;
        const cen = [cx, cy, R.z];
        for (let j = 0; j < R.pts.length; j++) {
          const j2 = (j + 1) % R.pts.length;
          const a = [R.pts[j][0], R.pts[j][1], R.z], b = [R.pts[j2][0], R.pts[j2][1], R.z];
          if (flip) this.tri(cen, b, a, o.capCol || col); else this.tri(cen, a, b, o.capCol || col);
        }
      };
      capRing(rings[0], true);
      capRing(rings[n - 1], false);
    }
    return this;
  };

  /** 椭圆截面生成器 */
  function ring(z, rx, ry, cx, cy, sides, phase) {
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 + (phase || 0);
      pts.push([(cx || 0) + Math.cos(a) * rx, (cy || 0) + Math.sin(a) * ry]);
    }
    return { z, pts };
  }
  Builder.ring = ring;

  /** 沿 Z 的锥台（机头、翼尖、烟囱等） */
  Builder.prototype.frustumZ = function (len, r0, r1, sides, col, opts) {
    const o = opts || {};
    const hz = len / 2;
    const rings = [
      ring(-hz, r0, r0 * (o.squash0 === undefined ? 1 : o.squash0), 0, o.y0 || 0, sides, o.phase),
      ring(hz, r1, r1 * (o.squash1 === undefined ? 1 : o.squash1), 0, o.y1 || 0, sides, o.phase),
    ];
    return this.loft(rings, col, { caps: o.caps !== false, capCol: o.capCol || col });
  };

  /** 沿 Z 的圆柱 */
  Builder.prototype.cylinderZ = function (r, len, sides, col, opts) {
    return this.frustumZ(len, r, r, sides, col, Object.assign({ squash1: 1 }, opts || {}));
  };
  /** 沿 Z 的圆锥，尖端在 -Z 端 */
  Builder.prototype.coneZ = function (r, len, sides, col, opts) {
    return this.frustumZ(len, 0.0001, r, sides, col, Object.assign({ caps: true }, opts || {}));
  };
  /** 沿 Y 轴的圆柱（桅杆、炮管），底面在原点 */
  Builder.prototype.cylinderY = function (r, len, sides, col, opts) {
    this.push(); this.rotX(-Math.PI / 2);
    this.frustumZ(len, r, r, sides, col, opts);
    this.pop();
    return this;
  };

  /** UV 球 */
  Builder.prototype.sphere = function (r, seg, rings, col, opts) {
    const o = opts || {}, rx = o.rx || r, ry = o.ry || r, rz = o.rz || r;
    const rows = [];
    for (let i = 0; i <= rings; i++) {
      const v = i / rings, phi = v * Math.PI;
      rows.push({ z: -Math.cos(phi) * rz, pts: [] });
    }
    // 使用 loft 的方式绕 Z 轴旋转生成球面
    const prof = [];
    for (let i = 0; i <= rings; i++) {
      const phi = (i / rings) * Math.PI;
      prof.push({ z: -Math.cos(phi) * rz, r: Math.sin(phi) * rx, ry: Math.sin(phi) * ry });
    }
    const grid = [];
    for (let i = 0; i < prof.length; i++) {
      const p = prof[i];
      grid.push({ z: p.z, pts: (function () {
        const a = [];
        for (let j = 0; j < seg; j++) {
          const th = (j / seg) * Math.PI * 2;
          a.push([Math.cos(th) * p.r, Math.sin(th) * p.ry]);
        }
        return a;
      })() });
    }
    return this.loft(grid, col, { caps: false });
  };
  /** 半椭球（上半球），底部在 y=0 */
  Builder.prototype.halfSphere = function (rx, ry, seg, rings, col, opts) {
    const o = opts || {};
    const half = (o.flip ? -1 : 1);
    const grid = [];
    for (let i = 0; i <= rings; i++) {
      const phi = (i / rings) * (Math.PI / 2);
      const z = -half * Math.cos(phi) * (o.rz || rx);
      const r = Math.sin(phi) * rx;
      const ryv = Math.sin(phi) * ry;
      const pts = [];
      for (let j = 0; j < seg; j++) {
        const th = (j / seg) * Math.PI * 2;
        pts.push([Math.cos(th) * r, Math.sin(th) * ryv]);
      }
      grid.push({ z, pts });
    }
    return this.loft(grid, col, { caps: false });
  };

  /**
   * 机翼：从原点（前缘根部）沿 +X 延伸，前缘后掠。
   * o = { chord, tipChord, span, sweep, dihedral(deg), thick, col, side(+1/-1), mirror(bool) }
   */
  Builder.prototype.wing = function (o) {
    const chord = o.chord, tc = o.tipChord === undefined ? chord * 0.4 : o.tipChord;
    const span = o.span, sweep = o.sweep || 0, th = o.thick === undefined ? 0.08 : o.thick;
    const dih = (o.dihedral || 0) * Math.PI / 180;
    const yTip = Math.sin(dih) * span, xTip = Math.cos(dih) * span;
    const s = o.side === undefined ? 1 : o.side;
    const col = o.col;
    // 根部前缘 (0,0,0) 后缘 (0,0,chord)；翼尖前缘 (s*xTip, yTip, sweep) 后缘 (s*xTip, yTip, sweep+tc)
    const P = [
      [0, 0, 0], [0, 0, chord], [s * xTip, yTip, sweep + tc], [s * xTip, yTip, sweep]
    ];
    const T4 = P.map(p => [p[0], p[1] + th / 2, p[2]]);
    const B4 = P.map(p => [p[0], p[1] - th / 2, p[2]]);
    if (s > 0) {
      this.quad(T4[0], T4[3], T4[2], T4[1], o.topCol || col);
      this.quad(B4[0], B4[1], B4[2], B4[3], o.botCol || col);
      this.quad(T4[3], B4[3], B4[2], T4[2], o.tipCol || col);   // 翼尖
      if (o.rootCap !== false) this.quad(T4[0], B4[0], B4[1], T4[1], o.rootCol || col);
    } else {
      this.quad(T4[0], T4[1], T4[2], T4[3], o.topCol || col);
      this.quad(B4[0], B4[3], B4[2], B4[1], o.botCol || col);
      this.quad(T4[3], T4[2], B4[2], B4[3], o.tipCol || col);
      if (o.rootCap !== false) this.quad(T4[0], B4[0], B4[1], T4[1], o.rootCol || col);
    }
    return this;
  };

  /** 由三维闭合多边形沿 dir 挤出成薄板（垂尾、舵面、平尾） */
  Builder.prototype.plate = function (pts3, dir, thick, col, opts) {
    const o = opts || {};
    const d = normalizeArr(dir), h = thick / 2;
    const n = pts3.length;
    const up = pts3.map(p => [p[0] + d[0] * h, p[1] + d[1] * h, p[2] + d[2] * h]);
    const dn = pts3.map(p => [p[0] - d[0] * h, p[1] - d[1] * h, p[2] - d[2] * h]);
    // 判断 winding：外法线应背离 dir
    const c = [0, 0, 0];
    for (const p of pts3) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }
    c[0] /= n; c[1] /= n; c[2] /= n;
    const e1 = [pts3[1][0] - c[0], pts3[1][1] - c[1], pts3[1][2] - c[2]];
    const e2 = [pts3[2][0] - c[0], pts3[2][1] - c[1], pts3[2][2] - c[2]];
    const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const flip = cr[0] * d[0] + cr[1] * d[1] + cr[2] * d[2] > 0;
    for (let i = 1; i < n - 1; i++) {
      if (flip) this.tri(up[0], up[i], up[i + 1], col);
      else this.tri(up[0], up[i + 1], up[i], col);
    }
    for (let i = 1; i < n - 1; i++) {
      if (flip) this.tri(dn[0], dn[i + 1], dn[i], o.backCol || col);
      else this.tri(dn[0], dn[i], dn[i + 1], o.backCol || col);
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = dn[i], b = dn[j], c2 = up[j], d2 = up[i];
      if (flip) this.quad(a, b, c2, d2, o.edgeCol || col);
      else this.quad(a, d2, c2, b, o.edgeCol || col);
    }
    return this;
  };

  function normalizeArr(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  /* ---------------- 输出 ---------------- */
  Builder.prototype.finish = function (name) {
    const mesh = {
      name: name || 'mesh',
      pos: new Float32Array(this.pos),
      nrm: new Float32Array(this.nrm),
      col: new Float32Array(this.col),
      count: this.pos.length / 3,
    };
    return mesh;
  };

  global.MB = {
    Builder,
    hex, shade, mix: mixc,
    mat: T,
    ring,
    IDENT: T.ident,
  };
})(window);