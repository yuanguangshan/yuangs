/* models.js — sea-strike 全程序化模型库（纯代码生成，无任何外部资源）
 * ---------------------------------------------------------------------------
 * 坐标约定：机首 / 船首朝 -Z，上方 +Y，横向为 X（右舷 = +X），模型原点贴近质心。
 * 产物：MB.Builder.finish() → { name, pos:Float32Array, nrm:Float32Array,
 *        col:Float32Array, count }，三角形列表、平面着色、顶点色 0~1。
 * 导出：window.Models = { fighter, carrier, destroyer, missile, bomb,
 *        island, cloud, buoy, buildAll }
 *
 * 面数（三角面 = count/3，实测）：
 *   fighter 696（预算 350~700）   fighterEnemy 696（同一几何，仅 cfg 配色不同）
 *   carrier 991（预算 900~1600）  destroyer  720
 *   missile  88                  bomb       92
 *   island  240                  cloud     360      buoy 106
 *   buildAll() 九件合计 3989 面（预算 < 4000）
 *
 * 已知取舍：
 *  1) meshbuilder._xf 写作 `p[0] || p.x`，坐标恰为 0 的顶点会变 NaN；本文件在
 *     唯一出口 tri() 上做 0 → 1e-9 修正（见 newBuilder），不改动 meshbuilder。
 *  2) meshbuilder.halfSphere 有参数遮蔽 bug（const ry = ... * ry），本文件改用
 *     本地 dome()。
 *  3) 座舱盖、云朵、挂载副油箱等为埋入机体的开口薄壳，视觉上不可见；机翼/尾翼
 *     按要求为单片双面可见。
 *
 * 用法：先加载 meshbuilder.js，再加载本文件；模型不缓存，每次调用重新生成。
 * ------------------------------------------------------------------------ */
(function (global) {
  'use strict';

  var MB = global.MB;
  var shade = MB.shade, mix = MB.mix;
  var D2R = Math.PI / 180;

  /* =======================================================================
   * 局部工具：按面法线 Y 分量做顶亮/底暗的分层着色
   * ==================================================================== */

  /* 规避 meshbuilder._xf 的缺陷：它写作 `const x = p[0] || p.x`，
     于是任何 x/y/z 恰为 0 的顶点都会取到 undefined 并变成 NaN（MB.ring 的
     偶数边截面、box/plate/wing 都会大量产生 0 坐标）。这里在唯一的出口
     tri() 上做一次替换：0 → 1e-9，几何上无差别（原本就是零面积/零分量）。 */
  function nz(p) {
    return [
      p[0] === 0 ? 1e-9 : p[0],
      p[1] === 0 ? 1e-9 : p[1],
      p[2] === 0 ? 1e-9 : p[2]
    ];
  }

  /** 建一个 Builder，并把 tri 出口包一层 0 → 1e-9 修正 */
  function newBuilder() {
    var b = new MB.Builder(), orig = b.tri;
    b.tri = function (a, p1, p2, col) {
      return orig.call(b, nz(a), nz(p1), nz(p2), col);
    };
    return b;
  }

  /** 返回着色函数 tn(ny)：ny=+1 最亮，ny=0 基色，ny=-1 最暗 */
  function toner(base, o) {
    o = o || {};
    var up = o.up || shade(base, o.upF === undefined ? 1.18 : o.upF);
    var dn = o.dn || shade(base, o.dnF === undefined ? 0.60 : o.dnF);
    return function (ny) {
      return ny >= 0 ? mix(base, up, ny) : mix(base, dn, -ny);
    };
  }

  /** 四边形（按法线着色） */
  function qN(b, a, p1, p2, p3, tn) {
    var ux = p1[0] - a[0], uy = p1[1] - a[1], uz = p1[2] - a[2];
    var vx = p3[0] - a[0], vy = p3[1] - a[1], vz = p3[2] - a[2];
    var ny = uz * vx - ux * vz;
    var l = Math.hypot(uy * vz - uz * vy, ny, ux * vy - uy * vx) || 1;
    var col = tn(ny / l);
    b.tri(a, p1, p2, col);
    b.tri(a, p2, p3, col);
    return b;
  }

  /** 三角形（按法线着色） */
  function tN(b, a, p1, p2, tn) {
    var ux = p1[0] - a[0], uy = p1[1] - a[1], uz = p1[2] - a[2];
    var vx = p2[0] - a[0], vy = p2[1] - a[1], vz = p2[2] - a[2];
    var ny = uz * vx - ux * vz;
    var l = Math.hypot(uy * vz - uz * vy, ny, ux * vy - uy * vx) || 1;
    b.tri(a, p1, p2, tn(ny / l));
    return b;
  }

  /** 取截面的部分点构成新截面（idx 需按环向顺序） */
  function subRing(R, idx) {
    var pts = [], i;
    for (i = 0; i < idx.length; i++) pts.push(R.pts[idx[i]]);
    return { z: R.z, pts: pts };
  }

  /** 截面封口（扇形三角化）；flip=true → 法线朝 -Z */
  function capRing(b, R, flip, col) {
    var cx = 0, cy = 0, i;
    for (i = 0; i < R.pts.length; i++) { cx += R.pts[i][0]; cy += R.pts[i][1]; }
    cx /= R.pts.length; cy /= R.pts.length;
    var cen = [cx, cy, R.z];
    for (i = 0; i < R.pts.length; i++) {
      var j = (i + 1) % R.pts.length;
      var p1 = [R.pts[i][0], R.pts[i][1], R.z];
      var p2 = [R.pts[j][0], R.pts[j][1], R.z];
      if (flip) b.tri(cen, p2, p1, col); else b.tri(cen, p1, p2, col);
    }
    return b;
  }

  /** 局部放样：逐面法线着色 + 可选封口
   *  o = { up, dn, upF, dnF, caps, capCol, capCol0 }  capCol0 = -Z 端封口色 */
  function loft(b, rings, base, o) {
    o = o || {};
    var tn = o.tone || toner(base, o);
    var n = rings.length, i, j, m, A, B, j2;
    for (i = 0; i < n - 1; i++) {
      A = rings[i]; B = rings[i + 1]; m = A.pts.length;
      for (j = 0; j < m; j++) {
        j2 = (j + 1) % m;
        qN(b,
          [A.pts[j][0], A.pts[j][1], A.z], [A.pts[j2][0], A.pts[j2][1], A.z],
          [B.pts[j2][0], B.pts[j2][1], B.z], [B.pts[j][0], B.pts[j][1], B.z], tn);
      }
    }
    if (o.caps) {
      capRing(b, rings[0], true, o.capCol0 || o.capCol || base);
      capRing(b, rings[n - 1], false, o.capCol || base);
    }
    return b;
  }

  /** 沿 Y 轴（局部 z 轴经 rotX(-90°) 之后）的放样带：世界 y = base + z */
  function bandY(b, z0, z1, rx, ry, sides, col, o) {
    b.push(); b.rotX(-Math.PI / 2);
    loft(b, [MB.ring(z0, rx, ry, 0, 0, sides), MB.ring(z1, rx, ry, 0, 0, sides)], col, o);
    b.pop();
    return b;
  }

  /** 机身 / 船体通用截面：n 边形 + 背部脊线(ridge) + 平直腹部(belly) */
  function fsec(z, rx, ry, o) {
    o = o || {};
    var n = o.n || 8, ridge = o.ridge || 0, belly = o.belly || 0;
    var ph = o.ph || 0, pts = [], i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + ph, sn = Math.sin(a);
      pts.push([
        Math.cos(a) * rx * (1 + (sn > 0 ? ridge : -belly) * sn * sn),
        sn * ry * (1 + (sn > 0 ? ridge * 0.7 : -belly * 0.7) * sn * sn)
      ]);
    }
    return { z: z, pts: pts };
  }

  /** 向上半球（底面在 y=0，高 = rz）
   *  注意：本地实现，替代 meshbuilder.halfSphere —— 后者第 231 行
   *  `const ry = Math.sin(phi) * ry;` 遮蔽了同名参数，运行必抛 TDZ ReferenceError。 */
  function dome(b, rx, ry, rz, seg, rings, col, o) {
    var tn = toner(col, o), i, j, t0, t1, A, B, C, D;
    for (i = 0; i < rings; i++) {
      var p0 = (i / rings) * (Math.PI / 2), p1 = ((i + 1) / rings) * (Math.PI / 2);
      var s0 = Math.sin(p0), c0 = Math.cos(p0), s1 = Math.sin(p1), c1 = Math.cos(p1);
      for (j = 0; j < seg; j++) {
        t0 = (j / seg) * Math.PI * 2; t1 = ((j + 1) / seg) * Math.PI * 2;
        A = [Math.cos(t0) * rx * s0, c0 * rz, Math.sin(t0) * ry * s0];
        B = [Math.cos(t1) * rx * s0, c0 * rz, Math.sin(t1) * ry * s0];
        C = [Math.cos(t1) * rx * s1, c1 * rz, Math.sin(t1) * ry * s1];
        D = [Math.cos(t0) * rx * s1, c1 * rz, Math.sin(t0) * ry * s1];
        // 顶点环退化成一点时改用三角扇，避免零面积三角形（法线会是 0,0,0）
        if (s0 < 1e-6) b.tri(A, C, D, tn(1));
        else qN(b, A, B, C, D, tn);
      }
    }
    return b;
  }

  /** 甲板 / 水面薄片（贴地的水平四边形，带抬升避免 z-fighting） */
  function mark(b, x0, x1, z0, z1, y, col) {
    b.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], col);
    return b;
  }

  var M = {};

  /* =======================================================================
   * 舰载战斗机  全长 15.6m / 翼展 11.7m / 高约 4.5m
   * ==================================================================== */
  /* 机翼挂点用的精简导弹（64 面）：锥头+柱身一体放样 + 4 片单片尾鳍 */
  function missileInto(b, sc, col, finCol, dark) {
    b.push();
    b.scale(sc, sc, sc);
    loft(b, [
      MB.ring(-1.85, 0.035, 0.035, 0, 0, 6),
      MB.ring(-0.95, 0.105, 0.105, 0, 0, 6),
      MB.ring(1.72, 0.105, 0.105, 0, 0, 6)
    ], col, { caps: true, capCol: dark, capCol0: shade(col, 0.75), upF: 1.1, dnF: 0.72 });
    for (var i = 0; i < 4; i++) {
      b.push(); b.rotZ(i * 90 * D2R);
      b.quad([0.10, 0, 1.50], [0.10, 0, 1.02], [0.40, 0, 1.60], [0.40, 0, 1.28], finCol);
      b.quad([0.10, 0, 1.50], [0.40, 0, 1.28], [0.40, 0, 1.60], [0.10, 0, 1.02], finCol);
      b.pop();
    }
    b.pop();
    return b;
  }

  M.fighter = function (cfg) {
    cfg = cfg || {};
    var body = MB.hex(cfg.body || '#8e959e');
    var accent = MB.hex(cfg.accent || '#2f3b4a');
    var tailc = MB.hex(cfg.tail || '#39434f');
    var canopy = MB.hex(cfg.canopy || '#1b2733');
    var warn = MB.hex(cfg.warn || '#b8402f');
    var dark = 0x14161a;
    var b = newBuilder();
    var ZO = 1.7;                 // 把原点挪到质心附近
    b.push(); b.translate(0, 0, ZO);

    /* ---- 机身：机头雷达罩 → 座舱段 → 进气道鼓包 → 尾段收敛 ---- */
    var S = [
      [-9.50, 0.06, 0.06, 0.00],
      [-8.40, 0.42, 0.36, 0.02],
      [-7.20, 0.66, 0.56, 0.07],
      [-6.00, 0.88, 0.74, 0.11],
      [-4.60, 0.98, 0.90, 0.14],
      [-3.00, 1.15, 1.03, 0.15],
      [-1.20, 1.10, 1.00, 0.11],
      [0.80, 1.02, 0.95, 0.08],
      [2.90, 0.98, 0.94, 0.06],
      [5.50, 0.94, 0.90, 0.04]
    ];
    var rings = [], i;
    for (i = 0; i < S.length; i++) {
      rings.push(fsec(S[i][0], S[i][1], S[i][2], { ridge: S[i][3], belly: S[i][3] * 0.55 }));
    }
    loft(b, rings, body, { caps: true, capCol: shade(body, 0.7), capCol0: shade(body, 0.86), dnF: 0.52 });

    /* ---- 座舱盖（深色玻璃罩）+ 框条 ---- */
    var CR = [
      [-7.00, 0.26, 0.16, 0.86],
      [-6.20, 0.52, 0.56, 0.72],
      [-5.30, 0.58, 0.76, 0.66],
      [-4.10, 0.34, 0.36, 0.78]
    ];
    var cr = [];
    for (i = 0; i < CR.length; i++) {
      cr.push(fsec(CR[i][0], CR[i][1], CR[i][2], { n: 6, ph: 0.52 }));
      cr[i].pts.forEach(function (p) { p[1] += CR[i][3]; });
    }
    loft(b, cr, canopy, { upF: 1.35, dnF: 0.8 });
    // 座舱框条（浅色细长条）
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -0.56 : 0.56, 0.78, -5.55); b.rotY(i ? -2 : 2);
      b.box(0.07, 0.13, 2.6, shade(body, 1.22), { ny: false, py: false });
      b.pop();
    }
    b.push(); b.translate(0, 0.80, -6.95); b.rotX(-22 * D2R);
    b.box(1.16, 0.09, 0.14, shade(body, 1.3), { ny: false });
    b.pop();

    /* ---- 主翼：后掠梯形，根部弦长 5.2m ---- */
    for (i = 0; i < 2; i++) {
      b.push();
      b.translate(1.0, -0.15, -3.0);
      b.wing({
        chord: 5.2, tipChord: 1.6, span: 4.85, sweep: 4.2,
        dihedral: 1, thick: 0.28, side: i ? -1 : 1,
        col: accent, topCol: shade(accent, 1.12), botCol: shade(accent, 0.86),
        tipCol: shade(accent, 1.3), rootCap: false
      });
      b.pop();
    }
    // 翼尖导轨挡板
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -5.62 : 5.62, -0.02, 1.35);
      b.box(0.20, 0.40, 1.55, shade(accent, 0.8), { ny: false });
      b.pop();
    }

    /* ---- 水平尾翼 ---- */
    for (i = 0; i < 2; i++) {
      b.push();
      b.translate(0.85, 0.28, 2.6);
      b.wing({
        chord: 2.6, tipChord: 1.0, span: 2.0, sweep: 1.4,
        dihedral: -1, thick: 0.17, side: i ? -1 : 1,
        col: accent, topCol: shade(accent, 1.12), botCol: shade(accent, 0.86), rootCap: false
      });
      b.pop();
    }

    /* ---- 双垂尾（外倾 20°）+ 警示斜条 ---- */
    for (i = 0; i < 2; i++) {
      var s = i ? -1 : 1;
      b.push(); b.translate(s * 0.55, 0.50, 2.9); b.rotZ(-s * 20 * D2R);
      b.plate([[0, 0, 0], [0, 0, 2.6], [0, 2.0, 2.4], [0, 2.0, 1.4]], [1, 0, 0], 0.14,
        tailc, { backCol: shade(tailc, 0.86), edgeCol: shade(tailc, 1.1) });
      // 警示色斜条（贴在垂尾外侧，红白两道）
      b.quad([s * 0.075, 0.90, 1.50], [s * 0.075, 1.34, 1.56],
             [s * 0.075, 1.40, 2.10], [s * 0.075, 0.96, 2.04], warn);
      b.quad([s * 0.075, 1.38, 1.57], [s * 0.075, 1.82, 1.63],
             [s * 0.075, 1.88, 2.17], [s * 0.075, 1.44, 2.11], 0xe6e8ea);
      b.pop();
    }

    /* ---- 双发动机喷口：浅色外唇 + 深色内孔 ---- */
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -0.52 : 0.52, 0.02, 5.45);
      b.frustumZ(0.9, 0.42, 0.38, 6, shade(tailc, 1.25), { caps: true, capCol: dark });
      b.pop();
      b.push(); b.translate(i ? -0.52 : 0.52, 0.02, 5.72);
      b.frustumZ(0.9, 0.50, 0.46, 6, shade(tailc, 1.45), { caps: false });
      b.pop();
    }

    /* ---- 机腹：进气道口 + 中央挂梁 ---- */
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -0.62 : 0.62, -0.92, -4.45); b.rotX(-10 * D2R);
      b.box(0.92, 0.34, 1.9, shade(body, 0.82), { py: false });
      b.pop();
    }
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -0.58 : 0.58, -1.16, -0.5);
      b.box(0.16, 0.20, 5.0, shade(accent, 0.9), { py: false });
      b.pop();
    }

    /* ---- 翼下 4 个挂点（导弹 0.85 倍）：内侧带挂梁，外侧直接贴翼下 ---- */
    var PY = [[3.2, 0.6], [4.6, 2.0]];
    for (i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        var sx = PY[i][0], sz = PY[i][1], sd = j ? -1 : 1;
        if (i === 0) {
          b.push(); b.translate(sd * sx, -0.42, sz);
          b.box(0.15, 0.34, 1.0, shade(accent, 0.8), { py: false });
          b.pop();
        }
        b.push(); b.translate(sd * sx, -0.74, sz);
        missileInto(b, 0.85, shade(0xd6dade, 0.92), shade(0x6b7076, 1.0), dark);
        b.pop();
      }
    }

    /* ---- 机身下 2 枚副油箱 / 炸弹 ---- */
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? -0.58 : 0.58, -1.40, -0.6);
      b.loft([
        MB.ring(-1.10, 0.04, 0.04, 0, 0, 6),
        MB.ring(-0.45, 0.23, 0.23, 0, 0, 6),
        MB.ring(0.95, 0.19, 0.19, 0, 0, 6)
      ], shade(body, 0.9), { caps: false });
      b.pop();
    }

    /* ---- 天线 / 面板线 ---- */
    b.push(); b.translate(0, 1.16, -1.6);
    b.box(0.10, 0.30, 1.3, shade(accent, 0.7), { py: false });
    b.pop();

    b.pop();
    return b.finish(cfg.name || 'fighter');
  };

  /* =======================================================================
   * 核动力航母  全长 330m / 舰宽 41m / 甲板面 y = +14
   * 飞行甲板精确范围：x ∈ [-20.5, 20.5]，z ∈ [-165, 165]，顶面 y = 14.0，
   * 厚 1.2m（底面 y = 12.8）；艏右舷斜切（angled deck）、艉方尾。
   * ==================================================================== */
  var CARRIER_HULL = [
    // z, 半宽, 龙骨y, 舷顶y
    [-163, 2.5, -3.0, 12.2],
    [-152, 7.0, -5.2, 12.4],
    [-138, 12.0, -7.2, 12.6],
    [-118, 16.0, -8.0, 12.8],
    [-90, 18.6, -8.6, 12.9],
    [-50, 19.8, -8.8, 13.0],
    [0, 20.0, -8.8, 13.0],
    [60, 20.0, -8.8, 13.0],
    [115, 19.8, -8.8, 13.0],
    [150, 18.8, -8.4, 12.9],
    [165, 17.0, -7.2, 12.7]
  ];
  var HULL_SHAPE = [ // 9 点，环向顺序（从右舷水线下开始逆时针）
    [1.00, -0.55], [1.00, 0.72], [0.72, 1.00], [0.00, 1.06], [-0.72, 1.00],
    [-1.00, 0.72], [-1.00, -0.55], [-0.55, -1.00], [0.55, -1.00]
  ];
  function hullSection(st, idx) {
    var pts = [], i, p, y;
    for (i = 0; i < idx.length; i++) {
      p = HULL_SHAPE[idx[i]];
      y = st[2] + (p[1] + 1) * 0.5 * (st[3] - st[2]);
      pts.push([p[0] * st[1], y]);
    }
    return { z: st[0], pts: pts };
  }

  function carrierHull(b) {
    var grey = 0x777d84, anti = 0x5c3a33, i;
    var low = [], up = [], k;
    for (i = 0; i < CARRIER_HULL.length; i++) {
      low.push(hullSection(CARRIER_HULL[i], [6, 7, 8, 0]));
      up.push(hullSection(CARRIER_HULL[i], [0, 1, 2, 4, 5, 6]));
    }
    // 水线以下：防污漆带
    loft(b, low, anti, { upF: 1.28, dnF: 0.72 });
    // 水线以上：舷侧 + 舷顶
    loft(b, up, grey, { upF: 1.1, dnF: 0.8 });
    capRing(b, hullSection(CARRIER_HULL[0], [0, 1, 2, 3, 4, 5, 6, 7, 8]), true, shade(grey, 0.8));
    capRing(b, hullSection(CARRIER_HULL[CARRIER_HULL.length - 1], [0, 1, 2, 3, 4, 5, 6, 7, 8]), false, shade(grey, 0.85));
    // 舷侧涂色带（略深一档）+ 锚链孔 / 舷侧平台
    for (i = 0; i < CARRIER_HULL.length - 1; i++) {
      var A = CARRIER_HULL[i], B = CARRIER_HULL[i + 1];
      var y0 = A[2] + (HULL_SHAPE[1][1] + 1) * 0.5 * (A[3] - A[2]);
      var y1 = B[2] + (HULL_SHAPE[1][1] + 1) * 0.5 * (B[3] - B[2]);
      var xa = A[1] * 1.004, xb = B[1] * 1.004;
      k = i % 2 ? shade(grey, 0.86) : shade(grey, 0.94);
      b.quad([xa, y0, A[0]], [xa, y0 - 1.6, A[0]], [xb, y1 - 1.6, B[0]], [xb, y1, B[0]], k);
      b.quad([-xa, y0, A[0]], [-xb, y1, B[0]], [-xb, y1 - 1.6, B[0]], [-xa, y0 - 1.6, A[0]], k);
    }
  }

  M.carrier = function () {
    var b = newBuilder();
    var deckGrey = 0x5d646b, dark = 0x1c1f24, white = 0xe8ecef, yellow = 0xd8c23a;
    carrierHull(b);

    /* ---- 飞行甲板：厚 1.2m，顶面 y=14.0，x∈[-20.5,20.5], z∈[-165,165] ---- */
    var DECK = [
      [1.5, -165], [20.5, -140], [20.5, 165], [-20.5, 165], [-20.5, -60]
    ];
    var dp = [];
    for (var i = 0; i < DECK.length; i++) dp.push([DECK[i][0], 13.4, DECK[i][1]]);
    b.plate(dp, [0, 1, 0], 1.2, deckGrey, { backCol: shade(deckGrey, 0.55), edgeCol: shade(deckGrey, 0.72) });

    /* ---- 甲板标线 ---- */
    // 中央虚线（每段 8m、间隔 8m）
    for (i = -152; i < 158; i += 16) mark(b, -0.45, 0.45, i, i + 8, 14.02, white);
    // 艏部起飞机头三角标线
    for (i = 0; i < 3; i++) {
      var z0 = -158 + i * 13;
      b.tri([-6.5 + i * 0.4, 14.02, z0], [6.5 - i * 0.4, 14.02, z0], [0, 14.02, z0 + 9], i === 1 ? yellow : white);
    }
    // 4 台弹射器黑色轨道
    var CAT = [[-3.6, -160, -78], [3.6, -160, -78], [-11.5, -40, 34], [11.5, -40, 34]];
    for (i = 0; i < CAT.length; i++) {
      mark(b, CAT[i][0] - 0.5, CAT[i][0] + 0.5, CAT[i][1], CAT[i][2], 14.02, dark);
      mark(b, CAT[i][0] - 0.85, CAT[i][0] + 0.85, CAT[i][1], CAT[i][1] + 2.4, 14.02, yellow);
      mark(b, CAT[i][0] - 0.85, CAT[i][0] + 0.85, CAT[i][2] - 2.4, CAT[i][2], 14.02, yellow);
    }
    // 4 条阻拦索（横向黑线）
    for (i = 0; i < 4; i++) mark(b, -16, 16, 18 + i * 24, 18.8 + i * 24, 14.02, dark);
    // 2 部升降机（边框 + 内部色块）
    var ELV = [[-11.5, 62, 8, 22], [11.5, 108, 8, 22]];
    for (i = 0; i < ELV.length; i++) {
      var e = ELV[i], x0 = e[0] - e[2], x1 = e[0] + e[2], z0 = e[1] - e[3], z1 = e[1] + e[3];
      mark(b, x0 - 1.1, x1 + 1.1, z0 - 1.1, z0, 14.03, yellow);
      mark(b, x0 - 1.1, x1 + 1.1, z1, z1 + 1.1, 14.03, yellow);
      mark(b, x0 - 1.1, x0, z0, z1, 14.03, yellow);
      mark(b, x1, x1 + 1.1, z0, z1, 14.03, yellow);
      mark(b, x0, x1, z0, z1, 14.025, 0x3b4148);
      mark(b, x0, x1, (z0 + z1) / 2 - 0.5, (z0 + z1) / 2 + 0.5, 14.04, shade(0x3b4148, 0.8));
    }
    // 机库顶部网格开口（深色矩形）
    for (i = 0; i < 6; i++) {
      var hz = 104 + i * 7.5;
      mark(b, -8.5, 8.5, hz, hz + 5.2, 14.02, 0x2b3036);
      mark(b, -9.2, -8.4, hz, hz + 5.2, 14.03, shade(deckGrey, 1.25));
      mark(b, 8.4, 9.2, hz, hz + 5.2, 14.03, shade(deckGrey, 1.25));
    }
    // 滑行道黄线（全部落在甲板 z∈[-163,163] 内）
    for (i = 0; i < 6; i++) mark(b, -18.4, -17.2, -30 + i * 32, -4 + i * 32, 14.02, yellow);
    for (i = 0; i < 6; i++) mark(b, 17.2, 18.4, -20 + i * 32, 6 + i * 32, 14.02, yellow);
    // 喷流挡板
    for (i = 0; i < 4; i++) {
      b.push(); b.translate(i < 2 ? -6.2 : 6.2, 14.4, -20 + i * 26); b.rotX(-26 * D2R);
      b.box(4.4, 2.6, 0.5, shade(deckGrey, 1.15), { ny: false });
      b.pop();
    }

    /* ---- 甲板边缘灯点（0.6m 发光小方块） ---- */
    var lf = 0xf2f0c4;
    function lamp(x, z) {
      b.push(); b.translate(x, 14.25, z);
      b.box(0.6, 0.5, 0.6, lf, { ny: false });
      b.pop();
    }
    for (i = -138; i <= 158; i += 30) lamp(19.6, i);      // 右舷
    for (i = -56; i <= 158; i += 30) lamp(-19.6, i);     // 左舷
    for (i = 0; i < 3; i++) { lamp(-11 + i * 11, 163.8); }
    lamp(1.5, -163); lamp(-18.5, -58);

    /* ---- 舰岛（右舷，22m 多层建筑 + 桅杆 + 雷达） ---- */
    var isl = 0x6a7078;
    b.push(); b.translate(11, 14, -4);
    b.box(14, 8, 64, isl, { ny: false });                 // 底层 y 14~22
    b.box(12.4, 6, 54, shade(isl, 1.08), { ny: false });  // 二层 y 22~28
    b.pop();
    b.push(); b.translate(11.6, 28, 2);
    b.box(13, 4.6, 22, shade(isl, 0.94), { ny: false }); // 舰桥 y 28~32.6
    b.pop();
    b.push(); b.translate(11.6, 32.6, 2);
    b.box(11.6, 1.4, 18, shade(isl, 1.14), { ny: false });// 舰桥顶
    b.pop();
    // 舰桥翼（右舷外伸到舷侧）
    b.push(); b.translate(19.8, 27.6, 2);
    b.box(5.2, 1.8, 6, shade(isl, 1.02), { ny: false });
    b.pop();
    // 暗色窗户条带
    b.push(); b.translate(11.6, 30.6, -9.02);
    b.box(12.2, 1.3, 0.12, 0x1a222b, { nz: false, pz: false });
    b.pop();
    b.push(); b.translate(18.12, 30.6, 2);
    b.box(0.12, 1.3, 20, 0x1a222b, { px: false, nx: false });
    b.pop();
    b.push(); b.translate(5.08, 30.6, 2);
    b.box(0.12, 1.3, 20, 0x1a222b, { px: false, nx: false });
    b.pop();
    // 桅杆 + 雷达天线板
    b.push(); b.translate(10, 34.0, -2);
    b.cylinderY(0.85, 9.0, 6, shade(isl, 0.86));
    b.pop();
    b.push(); b.translate(10, 43.0, -2);
    b.box(9.5, 0.8, 1.3, 0xb9bec4, { ny: false });        // 旋转雷达天线
    b.pop();
    b.push(); b.translate(10, 41.2, -2);
    b.box(0.5, 3.2, 0.5, shade(isl, 0.8), { py: false }); // 横桁
    b.pop();
    b.push(); b.translate(13.5, 34.0, 8);
    b.cylinderY(0.55, 5.2, 6, shade(isl, 0.86));          // 二号桅
    b.pop();

    /* ---- 细节：舰艏跳板、舷侧平台 ---- */
    b.push(); b.translate(0, 12.4, -156); b.rotX(8 * D2R);
    b.box(9, 0.5, 12, shade(isl, 0.9), { py: false });
    b.pop();
    for (i = 0; i < 6; i++) {
      var pz = -120 + i * 46;
      b.push(); b.translate(-20.4, 11.4, pz);
      b.box(2.2, 0.5, 7, shade(isl, 0.86), { py: false });
      b.pop();
      b.push(); b.translate(20.4, 11.4, pz);
      b.box(2.2, 0.5, 7, shade(isl, 0.86), { py: false });
      b.pop();
    }
    // 锚孔
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? 17.2 : -17.2, 9.6, -142);
      b.box(1.6, 1.6, 4, dark, { px: false, nx: false });
      b.pop();
    }
    return b.finish('carrier');
  };

  /* =======================================================================
   * 导弹驱逐舰  全长 145m / 舰宽 16m / 甲板面 y = +11
   * ==================================================================== */
  var DD_HULL = [
    [-72.5, 0.6, -2.6, 8.6],
    [-64, 2.4, -3.6, 9.0],
    [-52, 4.6, -4.8, 9.4],
    [-36, 6.6, -5.6, 9.8],
    [-16, 7.6, -6.0, 10.2],
    [10, 8.0, -6.2, 10.5],
    [36, 8.0, -6.2, 10.6],
    [56, 7.6, -5.8, 10.8],
    [68, 6.8, -5.0, 10.9],
    [72.5, 5.6, -4.2, 10.8]
  ];
  var DD_SHAPE = [
    [1.00, -0.45], [1.00, 0.78], [0.62, 1.00], [-0.62, 1.00], [-1.00, 0.78], [-1.00, -0.45],
    [-0.42, -1.00], [0.42, -1.00]
  ];
  function ddSection(st, idx) {
    var pts = [], i, p;
    for (i = 0; i < idx.length; i++) {
      p = DD_SHAPE[idx[i]];
      pts.push([p[0] * st[1], st[2] + (p[1] + 1) * 0.5 * (st[3] - st[2])]);
    }
    return { z: st[0], pts: pts };
  }

  M.destroyer = function () {
    var b = newBuilder();
    var grey = 0x6f757c, anti = 0x5a3a33, sup = 0x79808a, i;
    var low = [], up = [];
    for (i = 0; i < DD_HULL.length; i++) {
      low.push(ddSection(DD_HULL[i], [5, 6, 7, 0]));
      up.push(ddSection(DD_HULL[i], [0, 1, 2, 3, 4, 5]));
    }
    loft(b, low, anti, { upF: 1.3, dnF: 0.72 });
    loft(b, up, grey, { upF: 1.12, dnF: 0.82 });
    capRing(b, ddSection(DD_HULL[0], [0, 1, 2, 3, 4, 5, 6, 7]), true, shade(grey, 0.8));
    capRing(b, ddSection(DD_HULL[DD_HULL.length - 1], [0, 1, 2, 3, 4, 5, 6, 7]), false, shade(grey, 0.85));

    /* ---- 主甲板（顶面精确 y = +11 水平面） ---- */
    mark(b, -7.6, 7.6, -40, 66, 10.72, shade(grey, 0.92));
    b.push(); b.translate(0, 10.8, 13);
    b.box(15.2, 0.4, 106, shade(grey, 0.88), { ny: false });
    b.pop();

    /* ---- 艏部封闭炮塔 + 76mm 主炮 ---- */
    b.push(); b.translate(0, 12.6, -46); b.rotX(-4 * D2R);
    b.box(6.4, 3.2, 8.4, sup, { ny: false });
    b.pop();
    b.push(); b.translate(0, 12.9, -52.5); b.rotX(-6 * D2R);
    b.frustumZ(9, 0.32, 0.22, 6, 0x555b62, { caps: true });
    b.pop();
    /* ---- 艉部 76mm ---- */
    b.push(); b.translate(0, 12.3, 60);
    b.box(4.2, 2.4, 4.6, sup, { ny: false });
    b.pop();
    b.push(); b.translate(0, 12.4, 65.5);
    b.frustumZ(6.4, 0.28, 0.18, 6, 0x555b62, { caps: true });
    b.pop();

    /* ---- 上层建筑（分层） ---- */
    var t1 = [[0, 13.6, -20, 15.5, 8, 34], [0, 17.6, -14, 11.5, 5, 26],
              [0, 20.4, -6, 8.5, 3.6, 20], [0, 22.6, -2, 6.5, 2.6, 13]];
    for (i = 0; i < t1.length; i++) {
      var t = t1[i];
      b.push(); b.translate(t[0], t[1], t[2]);
      b.box(t[3], t[4], t[5], shade(sup, 1 - i * 0.04), { ny: false });
      b.pop();
    }
    // 暗色窗带
    for (i = 0; i < 3; i++) {
      b.push(); b.translate(0, 19.6 + i * 2.4, -16 + i * 8);
      b.box(12.4 - i * 2.2, 0.9, 0.14, 0x1a222b, { nz: false, pz: false });
      b.pop();
    }
    /* ---- 烟囱 2 座 ---- */
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? 2.6 : -2.6, 17.6, 14);
      b.box(3.4, 5.6, 6.4, shade(sup, 0.9), { ny: false });
      b.pop();
      b.push(); b.translate(i ? 2.6 : -2.6, 23.2, 14);
      b.box(2.9, 0.7, 5.9, 0x3a3f45, { ny: false });
      b.pop();
    }
    /* ---- 桅杆 + 雷达 ---- */
    b.push(); b.translate(0, 24.2, -2);
    b.frustumZ(16, 0.55, 0.34, 6, shade(sup, 0.82), { caps: true });
    b.pop();
    b.push(); b.translate(0, 26.4, 6);
    b.box(5.6, 0.5, 1.0, 0xb9bec4, { ny: false });
    b.pop();
    b.push(); b.translate(0, 25.2, -4); b.rotZ(22 * D2R);
    b.box(0.4, 6.4, 0.4, shade(sup, 0.78), { py: false });
    b.pop();

    /* ---- 舷侧 VLS 阵列 ---- */
    for (i = 0; i < 2; i++) {
      for (var r2 = 0; r2 < 2; r2++) {
        for (var c2 = 0; c2 < 3; c2++) {
          b.push();
          b.translate(i ? 6.4 : -6.4, 11.35, -32 + r2 * 3.2 + (i ? 12 : 0));
          b.box(2.1, 1.0, 2.6, shade(sup, 0.94), { py: false });
          b.pop();
        }
      }
    }
    /* ---- 艉部直升机甲板 + 机库 ---- */
    b.push(); b.translate(0, 11.0, 56);
    b.box(13.6, 0.5, 16, 0x4a5058, { ny: false });
    b.pop();
    b.push(); b.translate(0, 14.6, 66);
    b.box(11.5, 7.2, 12, shade(sup, 0.98), { ny: false });
    b.pop();
    b.push(); b.translate(0, 14.8, 59.9);
    b.box(8.4, 5.0, 0.3, 0x2a2f35, { nz: false, pz: false });
    b.pop();
    // 甲板圆标
    for (i = 0; i < 2; i++) {
      var cx = i ? 3.4 : -3.4;
      b.push(); b.translate(cx, 11.28, 56); b.rotX(-90 * D2R);
      b.frustumZ(0.12, 3.4, 3.4, 6, 0xd8c23a, { caps: true });
      b.pop();
    }
    // 舷侧栏杆 / 细节
    for (i = 0; i < 5; i++) {
      var rz = -48 + i * 24;
      b.push(); b.translate(-7.7, 11.7, rz);
      b.box(0.14, 0.9, 22, shade(grey, 0.8), { ny: false });
      b.pop();
      b.push(); b.translate(7.7, 11.7, rz);
      b.box(0.14, 0.9, 22, shade(grey, 0.8), { ny: false });
      b.pop();
    }
    return b.finish('destroyer');
  };

  /* =======================================================================
   * 空对空导弹  长 3.75m / 半径 0.11m
   * ==================================================================== */
  M.missile = function () {
    var col = 0xd6dade, fin = 0x8d9399, dark = 0x14161a, b = newBuilder();
    b.push(); b.translate(0, 0, -1.40);
    b.coneZ(0.11, 0.9, 6, col, { capCol: col });
    b.pop();
    b.push(); b.translate(0, 0, 0.30);
    b.frustumZ(2.5, 0.11, 0.11, 6, col, { caps: true, capCol: col });
    b.pop();
    b.push(); b.translate(0, 0, 1.72);
    b.frustumZ(0.35, 0.085, 0.07, 6, shade(fin, 0.8), { caps: true, capCol: dark });
    b.pop();
    for (var i = 0; i < 4; i++) {
      b.push(); b.rotZ(i * 90 * D2R);
      b.quad([0.11, 0, 1.52], [0.11, 0, 1.02], [0.42, 0, 1.62], [0.42, 0, 1.28], fin);
      b.quad([0.11, 0, 1.52], [0.42, 0, 1.28], [0.42, 0, 1.62], [0.11, 0, 1.02], fin);
      b.pop();
    }
    return b.finish('missile');
  };

  /* =======================================================================
   * 炸弹  长 2.4m
   * ==================================================================== */
  M.bomb = function () {
    var col = 0x767c83, fin = 0x5c6268, b = newBuilder();
    loft(b, [
      MB.ring(-1.20, 0.02, 0.02, 0, 0, 6),
      MB.ring(-0.82, 0.17, 0.17, 0, 0, 6),
      MB.ring(-0.10, 0.27, 0.27, 0, 0, 6),
      MB.ring(0.70, 0.26, 0.26, 0, 0, 6),
      MB.ring(1.15, 0.20, 0.20, 0, 0, 6)
    ], col, { caps: true, capCol: shade(col, 0.6), capCol0: shade(col, 0.7), upF: 1.16, dnF: 0.6 });
    // 头部引信
    b.push(); b.translate(0, 0, -1.26);
    b.frustumZ(0.3, 0.10, 0.07, 4, 0x9aa0a6, { caps: true });
    b.pop();
    // 尾部四片尾翼
    for (var i = 0; i < 4; i++) {
      b.push(); b.rotZ(i * 90 * D2R);
      b.quad([0.24, 0, 0.72], [0.24, 0, 0.20], [0.46, 0, 1.00], [0.46, 0, 0.62], fin);
      b.quad([0.24, 0, 0.72], [0.46, 0, 0.62], [0.46, 0, 1.00], [0.24, 0, 0.20], fin);
      b.pop();
    }
    return b.finish('bomb');
  };

  /* =======================================================================
   * 海岛（风景）  底面 y=0，最高约 120m，跨直径约 500m
   * ==================================================================== */
  M.island = function () {
    var b = newBuilder();
    var rock = 0x6b6a63, sand = 0xbdb086, green = 0x3f5a3a;
    var N = 10, jit = [], i, j;
    for (i = 0; i < N; i++) jit.push(0.82 + ((i * 7919) % 37) / 100); // 固定抖动，截面间一致
    var RING = [[0, 250], [20, 218], [44, 172], [68, 126], [88, 84], [104, 42]];
    var rings = [];
    for (i = 0; i < RING.length; i++) {
      var pts = [];
      for (j = 0; j < N; j++) {
        var a = (j / N) * Math.PI * 2 + 0.19;
        var r = RING[i][1] * jit[j] * (1 + (i === 0 ? 0.08 * Math.sin(j * 2.3) : 0));
        pts.push([Math.cos(a) * r, Math.sin(a) * r * (i === 0 ? 1.08 : 1)]);
      }
      rings.push({ z: RING[i][0], pts: pts });
    }
    // 局部 z 轴 → 世界 +Y：山体竖起来，底面落在 y=0
    b.push(); b.rotX(-Math.PI / 2);
    // 分带上色：沙滩 → 岩石 → 岩石 → 暗绿草坡 → 暗绿山顶
    var BANDS = [[sand, 1.12, 0.86], [mix(rock, sand, 0.55), 1.14, 0.8], [rock, 1.16, 0.66],
                 [mix(rock, green, 0.6), 1.18, 0.62], [green, 1.2, 0.7]];
    for (i = 0; i < RING.length - 1; i++) {
      var bc = BANDS[i];
      loft(b, [rings[i], rings[i + 1]], bc[0], { upF: bc[1], dnF: bc[2] });
    }
    capRing(b, rings[0], true, shade(sand, 0.5));
    // 顶部两个小丘（此处局部坐标已被 rotX 映射：世界 y = 局部 z，世界 z = -局部 y）
    for (i = 0; i < 2; i++) {
      b.push(); b.translate(i ? 20 : -22, i ? -18 : 12, 92);
      loft(b, [
        MB.ring(0, 34, 30, 0, 0, 5, i * 0.4),
        MB.ring(16, 20, 17, 0, 0, 5, i * 0.4),
        MB.ring(26, 5, 4, 0, 0, 5, i * 0.4)
      ], mix(green, rock, 0.25), { caps: true, capCol: shade(green, 0.8), capCol0: shade(rock, 0.8) });
      b.pop();
    }
    b.pop();
    // 小灯塔（bandY 已是竖直方向）
    b.push(); b.translate(-6, 88, 6);
    bandY(b, 0, 6, 4.2, 4.2, 6, 0xb9bec4, { caps: true, capCol: shade(0xb9bec4, 0.7) });
    for (i = 0; i < 2; i++) {
      bandY(b, 6 + i * 7, 13 + i * 7, 2.6, 2.6, 6, i % 2 ? 0xd23a30 : 0xe8ecef, { caps: false });
    }
    bandY(b, 20, 22, 3.0, 3.0, 6, 0x4a5058, { caps: false });
    b.push(); b.translate(0, 22, 0);
    b.box(2.6, 2.4, 2.6, 0xfff2c0, { ny: false });
    b.pop();
    b.pop();
    return b.finish('island');
  };

  /* =======================================================================
   * 云团  直径约 600m，整体球心在 y=0（自发光用）
   * ==================================================================== */
  M.cloud = function () {
    var b = newBuilder();
    var c0 = 0xf2f5f8, c1 = 0xdfe6ee, c2 = 0xe9eef4;
    var P = [
      // x, 底面y, z, rx, rz(纵深), 高, 色
      [0, -110, 0, 250, 208, 236, c0],
      [-150, -120, 50, 165, 138, 166, c1],
      [148, -115, -58, 170, 140, 162, c1],
      [48, -140, -155, 145, 120, 140, c2],
      [-76, -132, -148, 132, 110, 128, c1],
      [36, -125, 150, 138, 116, 132, c0],
      [-168, -152, 138, 116, 96, 112, c2],
      [122, -156, -162, 122, 100, 116, c1],
      [-12, -175, -46, 118, 96, 112, c2]
    ];
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      b.push();
      b.translate(p[0], p[1], p[2]);
      dome(b, p[3], p[4], p[5], 8, 3, p[6], { upF: 1.06, dnF: 0.9 });
      b.pop();
    }
    return b.finish('cloud');
  };

  /* =======================================================================
   * 浮标  直径 3m / 高 6m
   * ==================================================================== */
  M.buoy = function () {
    var b = newBuilder();
    var red = 0xc0392b, white = 0xe8ecef, steel = 0x5a6068, dark = 0x2f343a;
    b.push(); b.translate(0, 0.2, 0); b.rotX(-Math.PI / 2);
    b.frustumZ(0.4, 1.5, 1.2, 6, dark, { caps: true, capCol: dark });     // 底座 y 0~0.4
    b.pop();
    bandY(b, 0.4, 1.4, 0.72, 0.72, 6, steel, { caps: false, upF: 1.2, dnF: 0.7 });
    // 红白相间细柱
    for (var i = 0; i < 4; i++) {
      bandY(b, 1.4 + i * 1.05, 2.45 + i * 1.05, 0.55, 0.55, 6, i % 2 ? red : white, { caps: false });
    }
    bandY(b, 5.6, 6.0, 0.55, 0.55, 6, steel, { caps: false, upF: 1.2, dnF: 0.7 });
    b.push(); b.translate(0, 6.0, 0);
    b.box(0.66, 0.66, 0.66, 0xfff0b8, { ny: false });
    b.pop();
    return b.finish('buoy');
  };

  /* =======================================================================
   * 一键构建全部模型
   * ==================================================================== */
  M.buildAll = function () {
    return {
      fighter: M.fighter(),
      fighterEnemy: M.fighter({
        name: 'fighterEnemy',
        body: '#7d868f', accent: '#333d49', tail: '#39434f',
        canopy: '#141b23', warn: '#a8362c'
      }),
      carrier: M.carrier(),
      destroyer: M.destroyer(),
      missile: M.missile(),
      bomb: M.bomb(),
      island: M.island(),
      cloud: M.cloud(),
      buoy: M.buoy()
    };
  };

  global.Models = M;
})(window);