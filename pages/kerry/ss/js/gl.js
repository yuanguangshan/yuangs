/* gl.js — 轻量 WebGL 渲染器：网格 / 海面波浪 / 天空 / 粒子 / 线段 / 投影 */
(function (global) {
  'use strict';
  const { M4, V3 } = global.MM;

  const GL = {
    ok: false, msg: '', canvas: null, gl: null,
    W: 1, H: 1, dpr: 1,
    // 环境
    eye: V3.create(), view: M4.create(), proj: M4.create(), vp: M4.create(), invVP: M4.create(),
    sunDir: { x: 0.3, y: 0.6, z: -0.7 },
    sunCol: [1.0, 0.96, 0.88], ambCol: [0.22, 0.26, 0.32], skyCol: [0.45, 0.60, 0.82],
    fogCol: [0.68, 0.78, 0.86], fogNear: 1500, fogFar: 26000,
    zenith: [0.16, 0.36, 0.70], horizon: [0.74, 0.84, 0.92],
    deep: [0.015, 0.075, 0.135], shallow: [0.05, 0.30, 0.38],
    time: 0,
  };

  /* ============================ 着色器 ============================ */
  const VS_MESH = `
precision highp float;
attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aCol;
uniform mat4 uMVP; uniform mat4 uModel; uniform mat3 uNM;
uniform vec3 uEye; uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uAmbCol; uniform vec3 uSkyCol;
uniform vec2 uFogRange; uniform float uEmissive; uniform vec3 uTint; uniform float uFlash;
varying vec3 vN; varying vec3 vC; varying float vFog;
void main(){
  vec4 wp = uModel * vec4(aPos, 1.0);
  vec3 n = normalize(uNM * aNrm);
  float ndl = max(dot(n, uSunDir), 0.0);
  float up = n.y * 0.5 + 0.5;
  vec3 amb = mix(uAmbCol * 0.8, uSkyCol, up * 0.9);
  vec3 v = normalize(uEye - wp.xyz);
  vec3 h = normalize(uSunDir + v);
  float spec = pow(max(dot(n, h), 0.0), 30.0) * 0.30;
  vec3 base = aCol * uTint;
  vec3 col = base * (amb + uSunCol * ndl) + uSunCol * spec;
  col = mix(col, base * 1.15, uEmissive);
  col = mix(col, vec3(1.0, 0.55, 0.25), uFlash);
  vC = col;
  float d = length(uEye - wp.xyz);
  vFog = clamp((d - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;
  const FS_MESH = `
precision highp float;
varying vec3 vN; varying vec3 vC; varying float vFog;
uniform vec3 uFogCol; uniform float uAlpha;
void main(){ gl_FragColor = vec4(mix(vC, uFogCol, vFog * 0.96), uAlpha); }`;

  const VS_SEA = `
precision highp float;
attribute vec3 aPos;
uniform mat4 uMVP; uniform vec2 uCenter; uniform float uTime;
varying vec3 vW; varying vec3 vN; varying float vH; varying float vDist;
float waveH(vec2 p){
  float h = 0.0;
  h += 1.35 * sin(dot(p, vec2( 0.982, 0.190)) * 0.0150 + uTime * 0.55);
  h += 0.80 * sin(dot(p, vec2(-0.560, 0.828)) * 0.0300 - uTime * 0.88);
  h += 0.40 * sin(dot(p, vec2( 0.300,-0.954)) * 0.0620 + uTime * 1.45);
  h += 0.19 * sin(dot(p, vec2(-0.866,-0.500)) * 0.1150 - uTime * 2.20);
  h += 0.10 * sin(dot(p, vec2( 0.707, 0.707)) * 0.2100 + uTime * 3.00);
  return h;
}
void main(){
  vec2 wp = aPos.xz + uCenter;
  float h = waveH(wp);
  float e = clamp(length(aPos.xz) * 0.05, 2.0, 60.0);
  float hx = waveH(wp + vec2(e, 0.0));
  float hz = waveH(wp + vec2(0.0, e));
  vN = normalize(vec3(-(hx - h) / e, 1.0, -(hz - h) / e));
  vW = vec3(wp.x, h, wp.y);
  vH = h;
  vec4 mv = uMVP * vec4(vW.x, h, vW.z, 1.0);
  vDist = length(mv.xyz);
  gl_Position = mv;
}`;
  const FS_SEA = `
precision highp float;
varying vec3 vW; varying vec3 vN; varying float vH; varying float vDist;
uniform vec3 uEye; uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol;
uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFogCol; uniform vec2 uFogRange; uniform float uTime;
float n2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){ v += a * n2(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main(){
  vec3 V = normalize(uEye - vW);
  float att = exp(-vDist / 2600.0);
  // 细浪法线
  vec2 g = vec2(0.0);
  vec2 d1 = vec2(0.90, 0.44); float a1 = 0.055 * att;
  vec2 d2 = vec2(-0.30, 0.95); float a2 = 0.034 * att;
  vec2 d3 = vec2(0.70, -0.71); float a3 = 0.020 * att;
  vec2 d4 = vec2(-0.86, -0.51); float a4 = 0.012 * att;
  g += d1 * (a1 * cos(dot(vW.xz, d1) * 0.55 + uTime * 2.4));
  g += d2 * (a2 * cos(dot(vW.xz, d2) * 0.95 - uTime * 3.1));
  g += d3 * (a3 * cos(dot(vW.xz, d3) * 1.70 + uTime * 4.2));
  g += d4 * (a4 * cos(dot(vW.xz, d4) * 3.10 - uTime * 5.5));
  vec3 n = normalize(vec3(vN.x - g.x, 1.0, vN.z - g.y));

  float ndl = max(dot(n, uSunDir), 0.0);
  float fres = pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 4.0);
  float crest = clamp(vH * 0.22 + 0.5, 0.0, 1.0);
  vec3 body = mix(uDeep, uShallow, crest * 0.75);
  vec3 col = body * (0.35 + 0.85 * ndl);
  // 天空反射
  col = mix(col, uSkyCol * 0.85, fres * 0.8);
  // 太阳镜面
  vec3 H = normalize(uSunDir + V);
  float sp = pow(max(dot(n, H), 0.0), 220.0);
  float sp2 = pow(max(dot(n, H), 0.0), 26.0);
  float sparkle = 0.55 + 0.45 * fbm(vW.xz * 0.06 + uTime * 0.05);
  col += uSunCol * sp * 3.2 * sparkle;
  col += uSunCol * sp2 * 0.10;
  // 浪尖白沫
  float foam = smoothstep(1.55, 2.35, vH + (fbm(vW.xz * 0.09) - 0.5) * 0.9);
  col = mix(col, vec3(0.85, 0.92, 0.96), foam * 0.55 * (0.4 + 0.6 * att));
  float fog = clamp((vDist - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  gl_FragColor = vec4(mix(col, uFogCol, fog * 0.97), 1.0);
}`;

  const VS_SKY = `
precision highp float;
attribute vec2 aNdc;
uniform mat4 uInvVP; uniform vec3 uEye;
varying vec3 vRay;
void main(){
  gl_Position = vec4(aNdc, 0.0, 1.0);
  vec4 p = uInvVP * vec4(aNdc, 1.0, 1.0);
  vRay = p.xyz / p.w - uEye;
}`;
  const FS_SKY = `
precision highp float;
varying vec3 vRay;
uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSunCol; uniform vec3 uSunDir; uniform float uTime;
float n2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 5; i++){ v += a * n2(p); p = p * 2.07 + 3.1; a *= 0.5; } return v; }
void main(){
  vec3 d = normalize(vRay);
  float y = clamp(d.y, -1.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(clamp(y, 0.0, 1.0), 0.52));
  col = mix(col, uHorizon * 0.72, smoothstep(0.0, -0.10, y));
  // 高空卷云带
  if (y > 0.02) {
    vec2 uv = d.xz / max(y, 0.05);
    float c = fbm(uv * 0.045 + vec2(uTime * 0.004, uTime * 0.002));
    float band = smoothstep(0.55, 0.85, c) * smoothstep(0.02, 0.22, y) * (1.0 - smoothstep(0.45, 0.95, y));
    col = mix(col, vec3(1.0, 0.99, 0.98), band * 0.5);
  }
  float sd = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSunCol * pow(sd, 1600.0) * 8.0;
  col += uSunCol * pow(sd, 10.0) * 0.30;
  col += uSunCol * pow(sd, 2.0) * 0.09;
  gl_FragColor = vec4(col, 1.0);
}`;

  const VS_PART = `
precision highp float;
attribute vec3 aPos; attribute vec4 aCol; attribute float aSize;
uniform mat4 uMVP; uniform float uScale; uniform float uPointMax;
varying vec4 vCol;
void main(){
  vec4 mv = uMVP * vec4(aPos, 1.0);
  gl_Position = mv;
  gl_PointSize = clamp(aSize * uScale / max(-mv.z, 0.5), 1.0, uPointMax);
  vCol = aCol;
}`;
  const FS_PART = `
precision mediump float;
varying vec4 vCol;
uniform float uAdditive;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d, d) * 4.0;
  if (r2 > 1.0) discard;
  float a = 1.0 - r2; a = a * a;
  gl_FragColor = vec4(vCol.rgb * (1.0 + uAdditive * 0.6), vCol.a * a);
}`;

  const VS_LINE = `
precision highp float;
attribute vec3 aPos; attribute vec4 aCol;
uniform mat4 uMVP; uniform vec2 uFogRange;
varying vec4 vCol; varying float vFog;
void main(){
  vec4 mv = uMVP * vec4(aPos, 1.0);
  gl_Position = mv;
  vCol = aCol;
  vFog = clamp((length(mv.xyz) - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
}`;
  const FS_LINE = `
precision mediump float;
varying vec4 vCol; varying float vFog; uniform vec3 uFogCol;
void main(){ gl_FragColor = vec4(mix(vCol.rgb, uFogCol, vFog * 0.9), vCol.a); }`;

  /* ============================ 初始化 ============================ */
  const PART_DATA = new Float32Array(9000 * 8);   // 粒子（加色 + 普通）共用
  const LINE_DATA = new Float32Array(4000 * 7);   // 线段
  const _ldata = LINE_DATA;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error('shader: ' + gl.getShaderInfoLog(s) + '\n' + src.split('\n').slice(0, 6).join('\n'));
    }
    return s;
  }
  function program(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.bindAttribLocation(p, 1, 'aNrm');
    gl.bindAttribLocation(p, 2, 'aCol');
    gl.bindAttribLocation(p, 3, 'aSize');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return { p, u };
  }

  GL.init = function (canvas) {
    GL.canvas = canvas;
    const opts = { antialias: true, alpha: false, depth: true, stencil: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' };
    let gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) { GL.msg = '当前浏览器不支持 WebGL，无法运行 3D 画面'; return false; }
    GL.gl = gl;
    try {
      GL.pMesh = program(gl, VS_MESH, FS_MESH);
      GL.pSea = program(gl, VS_SEA, FS_SEA);
      GL.pSky = program(gl, VS_SKY, FS_SKY);
      GL.pPart = program(gl, VS_PART, FS_PART);
      GL.pLine = program(gl, VS_LINE, FS_LINE);
    } catch (e) { GL.msg = String(e); return false; }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0.6, 0.75, 0.88, 1);

    // 全屏三角形
    GL.skyBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.skyBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    GL.skyAttr = gl.getAttribLocation(GL.pSky.p, 'aNdc');

    // 海面极坐标网格
    GL.rebuildSea();

    // 动态粒子缓冲（每个粒子 8 个 float：pos3 + rgba + size）
    GL.partBuf = gl.createBuffer();
    GL.partStride = 8;
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.partBuf);
    gl.bufferData(gl.ARRAY_BUFFER, PART_DATA.byteLength, gl.DYNAMIC_DRAW);
    GL.lineBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, LINE_DATA.byteLength, gl.DYNAMIC_DRAW);

    // 内置阴影圆盘（16 边形）
    GL.disc = makeDisc(18);
    GL.ok = true;
    GL.resize();
    return true;
  };

  function buildSeaGrid(segA, segR, r0, r1) {
    const gl = GL.gl;
    const verts = [];
    const k = Math.pow(r1 / r0, 1 / segR);
    for (let i = 0; i <= segR; i++) {
      const r = r0 * Math.pow(k, i);
      for (let j = 0; j < segA; j++) {
        const a = (j / segA) * Math.PI * 2;
        verts.push(Math.cos(a) * r, 0, Math.sin(a) * r);
      }
    }
    const idx = new Uint16Array(segR * segA * 6);
    let p = 0;
    for (let i = 0; i < segR; i++) {
      for (let j = 0; j < segA; j++) {
        const j2 = (j + 1) % segA;
        const a = i * segA + j, b = i * segA + j2, c = (i + 1) * segA + j2, d = (i + 1) * segA + j;
        idx[p++] = a; idx[p++] = b; idx[p++] = c;
        idx[p++] = a; idx[p++] = c; idx[p++] = d;
      }
    }
    const total = verts.length;
    const buf = new ArrayBuffer(total * 4 + idx.byteLength);
    new Float32Array(buf, 0, total).set(verts);
    new Uint16Array(buf, total * 4).set(idx);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.seaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(buf), gl.STATIC_DRAW);
    GL.seaVertCount = total / 3;
    GL.seaIdxCount = idx.length;
    return total / 3;
  }

  function makeDisc(n) {
    const pos = [], nrm = [], col = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      pos.push(0, 0, 0, Math.cos(a0), 0, Math.sin(a0), Math.cos(a1), 0, Math.sin(a1));
      for (let k = 0; k < 3; k++) { nrm.push(0, 1, 0); col.push(0, 0, 0); }
    }
    return { pos: new Float32Array(pos), nrm: new Float32Array(nrm), col: new Float32Array(col), count: pos.length / 3 };
  }

  /* ============================ 网格管理 ============================ */
  GL.upload = function (mesh) {
    const gl = GL.gl;
    if (mesh._gl) return mesh;
    mesh.vbP = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbP); gl.bufferData(gl.ARRAY_BUFFER, mesh.pos, gl.STATIC_DRAW);
    mesh.vbN = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbN); gl.bufferData(gl.ARRAY_BUFFER, mesh.nrm, gl.STATIC_DRAW);
    mesh.vbC = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbC); gl.bufferData(gl.ARRAY_BUFFER, mesh.col, gl.STATIC_DRAW);
    mesh._gl = true;
    return mesh;
  };

  /* ============================ 画质 ============================ */
  GL.quality = { scale: 1, maxDpr: 2, pointMax: 300, shadows: true, seaA: 132, seaR: 76, seaMax: 62000 };
  GL.renderScale = 1;
  GL.mobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  /** 按设备设定初始画质档位 */
  GL.autoQuality = function () {
    if (!GL.mobile) return;
    GL.quality.scale = 0.72;
    GL.quality.maxDpr = 1.75;
    GL.quality.pointMax = 128;
    GL.quality.shadows = false;
    GL.quality.seaA = 104; GL.quality.seaR = 56; GL.quality.seaMax = 46000;
    GL.renderScale = GL.quality.scale;
    GL.rebuildSea();
    GL.resize();
  };
  /** 动态降/升分辨率（移动端发热或掉帧时用） */
  GL.setRenderScale = function (s) {
    const v = Math.max(0.45, Math.min(1, s));
    if (Math.abs(v - GL.renderScale) < 0.02) return;
    GL.renderScale = v;
    GL.resize();
  };
  GL.rebuildSea = function () {
    GL.seaBuf = GL.gl.createBuffer();
    buildSeaGrid(GL.quality.seaA, GL.quality.seaR, 3, GL.quality.seaMax);
  };

  GL.resize = function () {
    if (!GL.gl) return;
    const c = GL.canvas, dpr = Math.min(global.devicePixelRatio || 1, GL.quality.maxDpr) * GL.renderScale;
    const w = c.clientWidth || c.width, h = c.clientHeight || c.height;
    const W = Math.max(2, Math.round(w * dpr)), H = Math.max(2, Math.round(h * dpr));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    GL.W = W; GL.H = H; GL.dpr = dpr; GL.cssW = w; GL.cssH = h;
  };

  /* ============================ 每帧 ============================ */
  GL.beginFrame = function (env) {
    const gl = GL.gl;
    GL.resize();
    Object.assign(GL, env);
    M4.multiply(GL.vp, GL.proj, GL.view);
    M4.invert(GL.invVP, GL.vp);
    gl.viewport(0, 0, GL.W, GL.H);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
  };

  GL.drawSky = function () {
    const gl = GL.gl, p = GL.pSky;
    gl.useProgram(p.p);
    gl.depthMask(false); gl.disable(gl.DEPTH_TEST);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.skyBuf);
    gl.enableVertexAttribArray(GL.skyAttr);
    gl.vertexAttribPointer(GL.skyAttr, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(p.u.uInvVP, false, GL.invVP);
    gl.uniform3fv(p.u.uEye, [GL.eye.x, GL.eye.y, GL.eye.z]);
    gl.uniform3fv(p.u.uZenith, GL.zenith);
    gl.uniform3fv(p.u.uHorizon, GL.horizon);
    gl.uniform3fv(p.u.uSunCol, GL.sunCol);
    gl.uniform3fv(p.u.uSunDir, [GL.sunDir.x, GL.sunDir.y, GL.sunDir.z]);
    gl.uniform1f(p.u.uTime, GL.time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.disableVertexAttribArray(GL.skyAttr);
  };

  GL.drawSea = function (cx, cz) {
    const gl = GL.gl, p = GL.pSea;
    gl.useProgram(p.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.seaBuf);
    const aPos = gl.getAttribLocation(p.p, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(p.u.uMVP, false, GL.vp);
    gl.uniform2f(p.u.uCenter, cx, cz);
    gl.uniform1f(p.u.uTime, GL.time);
    gl.uniform3fv(p.u.uEye, [GL.eye.x, GL.eye.y, GL.eye.z]);
    gl.uniform3fv(p.u.uSunDir, [GL.sunDir.x, GL.sunDir.y, GL.sunDir.z]);
    gl.uniform3fv(p.u.uSunCol, GL.sunCol);
    gl.uniform3fv(p.u.uSkyCol, GL.skyCol);
    gl.uniform3fv(p.u.uDeep, GL.deep);
    gl.uniform3fv(p.u.uShallow, GL.shallow);
    gl.uniform3fv(p.u.uFogCol, GL.fogCol);
    gl.uniform2f(p.u.uFogRange, GL.fogNear, GL.fogFar);
    gl.drawElements(gl.TRIANGLES, GL.seaIdxCount, gl.UNSIGNED_SHORT, GL.seaVertCount * 12);
    gl.disableVertexAttribArray(aPos);
  };

  const _nm = new Float32Array(9);
  GL.drawMesh = function (mesh, model, opts) {
    if (!mesh || !mesh.count) return;
    const gl = GL.gl, p = GL.pMesh, o = opts || {};
    GL.upload(mesh);
    gl.useProgram(p.p);
    gl.uniformMatrix4fv(p.u.uMVP, false, GL.vp);
    gl.uniformMatrix4fv(p.u.uModel, false, model);
    M4.normalMat(_nm, model);
    gl.uniformMatrix3fv(p.u.uNM, false, _nm);
    gl.uniform3fv(p.u.uEye, [GL.eye.x, GL.eye.y, GL.eye.z]);
    gl.uniform3fv(p.u.uSunDir, [GL.sunDir.x, GL.sunDir.y, GL.sunDir.z]);
    gl.uniform3fv(p.u.uSunCol, GL.sunCol);
    gl.uniform3fv(p.u.uAmbCol, GL.ambCol);
    gl.uniform3fv(p.u.uSkyCol, GL.skyCol);
    gl.uniform3fv(p.u.uFogCol, GL.fogCol);
    gl.uniform2f(p.u.uFogRange, GL.fogNear, GL.fogFar);
    gl.uniform1f(p.u.uEmissive, o.emissive || 0);
    gl.uniform1f(p.u.uFlash, o.flash || 0);
    gl.uniform1f(p.u.uAlpha, o.alpha === undefined ? 1 : o.alpha);
    gl.uniform3fv(p.u.uTint, o.tint || [1, 1, 1]);
    if (o.alpha !== undefined && o.alpha < 1) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbP); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbN); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbC); gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    gl.disableVertexAttribArray(0); gl.disableVertexAttribArray(1); gl.disableVertexAttribArray(2);
    if (o.alpha !== undefined && o.alpha < 1) { gl.disable(gl.BLEND); gl.depthMask(true); }
  };

  /** 粒子：addBuf/addCount 为加色粒子，alphaBuf/alphaCount 为普通混合粒子
   *  每点 8 个 float：[x,y,z, r,g,b,a, size] */
  GL.particles = function (addBuf, addCount, alphaBuf, alphaCount) {
    if (!addCount && !alphaCount) return;
    const gl = GL.gl, p = GL.pPart;
    const stride = 32;
    gl.useProgram(p.p);
    gl.uniformMatrix4fv(p.u.uMVP, false, GL.vp);
    gl.uniform1f(p.u.uScale, GL.H * 0.9);
    gl.uniform1f(p.u.uPointMax, GL.quality.pointMax);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    const aPos = gl.getAttribLocation(p.p, 'aPos'), aCol = gl.getAttribLocation(p.p, 'aCol'), aSize = gl.getAttribLocation(p.p, 'aSize');
    const setup = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, GL.partBuf);
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(aCol); gl.vertexAttribPointer(aCol, 4, gl.FLOAT, false, stride, 12);
      gl.enableVertexAttribArray(aSize); gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride, 28);
    };
    if (addCount) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform1f(p.u.uAdditive, 1);
      gl.bufferData(gl.ARRAY_BUFFER, addBuf.subarray(0, addCount * 8), gl.DYNAMIC_DRAW);
      setup();
      gl.drawArrays(gl.POINTS, 0, addCount);
    }
    if (alphaCount) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(p.u.uAdditive, 0);
      gl.bufferData(gl.ARRAY_BUFFER, alphaBuf.subarray(0, alphaCount * 8), gl.DYNAMIC_DRAW);
      setup();
      gl.drawArrays(gl.POINTS, 0, alphaCount);
    }
    gl.disableVertexAttribArray(aPos); gl.disableVertexAttribArray(aCol); gl.disableVertexAttribArray(aSize);
    gl.depthMask(true); gl.disable(gl.BLEND);
  };

  /** 线段：segs = [[x1,y1,z1,x2,y2,z2,r,g,b,a], ...] */
  GL.lines = function (segs) {
    if (!segs.length) return;
    const gl = GL.gl, p = GL.pLine;
    const n = Math.min(segs.length, LINE_DATA.length / 7);
    for (let i = 0; i < n; i++) {
      const s = segs[i], o = i * 7;
      _ldata[o] = s[0]; _ldata[o + 1] = s[1]; _ldata[o + 2] = s[2];
      _ldata[o + 3] = s[6]; _ldata[o + 4] = s[7]; _ldata[o + 5] = s[8];
      _ldata[o + 6] = s[9];
    }
    gl.useProgram(p.p);
    gl.uniformMatrix4fv(p.u.uMVP, false, GL.vp);
    gl.uniform3fv(p.u.uFogCol, GL.fogCol);
    gl.uniform2f(p.u.uFogRange, GL.fogNear, GL.fogFar);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, _ldata.subarray(0, n * 7), gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(p.p, 'aPos'), aCol = gl.getAttribLocation(p.p, 'aCol');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(aCol); gl.vertexAttribPointer(aCol, 4, gl.FLOAT, false, 28, 12);
    gl.drawArrays(gl.LINES, 0, n * 2);
    gl.disableVertexAttribArray(aPos); gl.disableVertexAttribArray(aCol);
    gl.depthMask(true); gl.disable(gl.BLEND);
  };

  /** 世界坐标 -> 屏幕像素（供 HUD 使用），ok=false 表示在相机后方 */
  GL.project = function (p, out) {
    const m = GL.vp;
    const x = p.x, y = p.y, z = p.z;
    const cw = m[3] * x + m[7] * y + m[11] * z + m[15];
    const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
    const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
    const o = out || {};
    o.dist = Math.hypot(x - GL.eye.x, y - GL.eye.y, z - GL.eye.z);
    if (cw <= 0.0001) { o.ok = false; o.x = GL.cssW / 2; o.y = GL.cssH / 2; return o; }
    o.ok = true;
    o.x = (cx / cw * 0.5 + 0.5) * GL.cssW;
    o.y = (0.5 - cy / cw * 0.5) * GL.cssH;
    return o;
  };

  global.GL = GL;
})(window);