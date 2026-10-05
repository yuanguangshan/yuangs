/* audio.js — 纯 Web Audio 合成的空海战斗音效系统（零外部资源 / 零依赖 / 单文件） */
(function (global) {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  // 高频音效的最小间隔（秒），防止机炮之类被同帧调用多次导致爆音/过载
  const CD = { gun: 0.03, warn: 0.12 };
  const cdAt = {};

  let ctx = null, master = null, noiseBuf = null;
  let muted = false, vol = 0.5, stallPh = 0;
  const loops = {};   // 循环音节点组，只在首次需要时创建一次

  // 只有真正在运行的时候才发声；否则所有方法静默返回，永不抛异常打断主循环
  const ready = () => !!(ctx && master && ctx.state === 'running');

  /* ---------------- 基础构件 ---------------- */

  // 程序生成 2 秒白噪声并缓存复用（低频成分略强，听起来更"厚"）
  function mkNoise() {
    if (noiseBuf) return noiseBuf;
    const n = Math.floor(ctx.sampleRate * 2);
    noiseBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; lp = (lp + 0.03 * w) / 1.03; d[i] = w * 0.72 + lp * 2.2; }
    return noiseBuf;
  }

  function ns() { const s = ctx.createBufferSource(); s.buffer = mkNoise(); s.loop = true; return s; }

  // 用完即焚：到点 stop 并在 onended 里断开，避免节点泄漏
  function kill(src, nodes, t) {
    const off = () => { for (let i = 0; i < nodes.length; i++) { try { nodes[i].disconnect(); } catch (e) {} } try { src.disconnect(); } catch (e) {} };
    try { src.onended = off; src.stop(t); } catch (e) {}
  }

  // 音量包络：attack 线性起、exp 衰减
  function env(g, t0, peak, a, d) {
    const v = g.gain;
    v.setValueAtTime(0.0001, t0);
    v.linearRampToValueAtTime(Math.max(peak, 0.0002), t0 + a);
    v.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  }

  // 单音：type 波形，f0→f1 频率滑移
  function tone(type, f0, f1, dur, peak, t0, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(1, f0), t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    env(g, t0, peak, 0.006, dur);
    o.connect(g); g.connect(dest || master);
    o.start(t0); kill(o, [g], t0 + dur + 0.03);
  }

  // 噪声爆：带通/低通/高通滤波 + 可选频率扫频
  function noise(dur, peak, t0, type, f0, f1, q, dest) {
    const s = ns(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = type || 'bandpass';
    f.frequency.setValueAtTime(Math.max(20, f0), t0);
    if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    f.Q.value = q == null ? 1 : q;
    env(g, t0, peak, 0.005, dur);
    s.connect(f); f.connect(g); g.connect(dest || master);
    s.start(t0, Math.random() * 1.2); kill(s, [f, g], t0 + dur + 0.03);
  }

  function applyGain() {
    if (!master || !ctx) return;
    try { master.gain.setTargetAtTime(muted ? 0 : vol, ctx.currentTime, 0.05); } catch (e) {}
  }

  /* ---------------- 循环音节点组 ---------------- */

  // 发动机：噪声过低通（底噪）+ 低频 sawtooth（涡轮啸叫）
  function buildEngine() {
    const n = { src: ns(), lp: ctx.createBiquadFilter(), ng: ctx.createGain(), osc: ctx.createOscillator(), og: ctx.createGain() };
    n.src.connect(n.lp); n.lp.connect(n.ng); n.ng.connect(master);
    n.lp.type = 'lowpass'; n.lp.frequency.value = 900; n.lp.Q.value = 0.9;
    n.ng.gain.value = 0.12;
    n.osc.type = 'sawtooth'; n.osc.frequency.value = 60;
    n.osc.connect(n.og); n.og.connect(master); n.og.gain.value = 0.02;
    n.osc.start(); n.src.start();
    return n;
  }

  // 加力：更响的低频轰鸣 + 高频嘶声（可被 stopLoop 单独关掉）
  function buildAB() {
    const n = { lo: ns(), lof: ctx.createBiquadFilter(), lg: ctx.createGain(), hi: ns(), hif: ctx.createBiquadFilter(), hg: ctx.createGain() };
    n.lo.connect(n.lof); n.lof.connect(n.lg); n.lg.connect(master);
    n.hi.connect(n.hif); n.hif.connect(n.hg); n.hg.connect(master);
    n.lof.type = 'lowpass'; n.lof.frequency.value = 260; n.lof.Q.value = 1.2;
    n.hif.type = 'bandpass'; n.hif.frequency.value = 2600; n.hif.Q.value = 0.7;
    n.lg.gain.value = 0; n.hg.gain.value = 0;
    n.lo.start(); n.hi.start();
    return n;
  }

  function buildWind() {
    const n = { src: ns(), bp: ctx.createBiquadFilter(), g: ctx.createGain() };
    n.src.connect(n.bp); n.bp.connect(n.g); n.g.connect(master);
    n.bp.type = 'bandpass'; n.bp.frequency.value = 800; n.bp.Q.value = 0.6;
    n.g.gain.value = 0;
    n.src.start(); return n;
  }

  function buildStall() {
    const n = { osc: ctx.createOscillator(), g: ctx.createGain() };
    n.osc.type = 'square'; n.osc.frequency.value = 800;
    n.osc.connect(n.g); n.g.connect(master); n.g.gain.value = 0; n.osc.start();
    return n;
  }

  function stopGroup(n) {
    for (const k in n) { try { if (n[k] && n[k].stop) n[k].stop(); } catch (e) {} }
    for (const k in n) { try { if (n[k] && n[k].disconnect) n[k].disconnect(); } catch (e) {} }
  }

  /* ---------------- 每帧调制 ---------------- */

  function update(dt, st) {
    if (!ready()) return;
    try {
      st = st || {};
      const L = loops, t = ctx.currentTime, T = 0.09;
      const th = clamp(st.throttle || 0, 0, 1);
      const spd = clamp(st.spd || 0, 0, 400);
      const run = st.running === false ? 0 : 1;

      const e = L.engine || (L.engine = buildEngine());
      e.osc.frequency.setTargetAtTime(55 + th * 135, t, T);                       // 啸叫 55→190Hz
      e.lp.frequency.setTargetAtTime(420 + th * 2100 + spd * 2.2, t, T);          // 低通 0.4k→2.5k
      e.ng.gain.setTargetAtTime((0.10 + 0.44 * th) * (0.72 + 0.28 * spd / 400) * run, t, T);
      e.og.gain.setTargetAtTime((0.014 + 0.075 * th * th) * run, t, T);

      const ab = L.afterburner || (L.afterburner = buildAB());
      const abOn = (st.gload > 1 || th > 0.98) ? 1 : 0;
      ab.lg.gain.setTargetAtTime(0.40 * abOn * (0.6 + 0.4 * th), t, 0.12);
      ab.hg.gain.setTargetAtTime(0.13 * abOn * th, t, 0.12);

      const w = L.wind || (L.wind = buildWind());
      w.bp.frequency.setTargetAtTime(clamp(620 + spd * 2.4, 420, 3400), t, T);    // 中心频率随速度上移
      w.g.gain.setTargetAtTime(spd > 150 ? 0.10 + 0.34 * clamp((spd - 150) / 250, 0, 1) : 0, t, 0.12);

      const sl = L.stall || (L.stall = buildStall());
      let on = 0;
      if (st.stall && run) { stallPh += (dt || 0) * 3.4; on = (stallPh % 1) < 0.55 ? 1 : 0; } else stallPh = 0;
      sl.g.gain.setTargetAtTime(0.17 * on, t, 0.01);                                // 800Hz 断续蜂鸣
    } catch (e) { /* 调制失败不影响游戏 */ }
  }

  /* ---------------- 一次性音效 ---------------- */

  function play(name, opt) {
    if (!ready()) return;
    opt = opt || {};
    const t = ctx.currentTime;
    if (CD[name] && t < (cdAt[name] || 0)) return;
    if (CD[name]) cdAt[name] = t + CD[name];
    let V = clamp(opt.gain == null ? 1 : opt.gain, 0, 4);
    if (opt.pos != null) {                       // 不做真 3D，仅按距离衰减音量
      const p = opt.pos;
      const d = typeof p === 'number' ? Math.abs(p) : Math.hypot(p.x || 0, p.y || 0, p.z || 0);
      V *= 260 / (260 + Math.max(0, d));
    }
    const r = opt.rate || 1;
    try {
      switch (name) {
        case 'startup':                           // 开机自检：嘟—嘟
          tone('sine', 660 * r, 660 * r, 0.13, 0.28 * V, t);
          tone('sine', 990 * r, 990 * r, 0.18, 0.28 * V, t + 0.19); break;
        case 'gear':                              // 起落架：液压嘶声 + 金属咔哒
          noise(0.26, 0.20 * V, t, 'bandpass', 900, 2600, 1.2);
          tone('square', 1700, 1100, 0.03, 0.12 * V, t + 0.05);
          tone('triangle', 340, 120, 0.07, 0.26 * V, t + 0.24); break;
        case 'flap':                              // 襟翼/减速板：同风格更短
          noise(0.15, 0.17 * V, t, 'bandpass', 1200, 2900, 1.4);
          tone('triangle', 520, 210, 0.05, 0.18 * V, t + 0.12); break;
        case 'catapult':                          // 弹射器：蓄力上拉 → 金属滑行 → 轰
          tone('sawtooth', 55, 170, 0.34, 0.14 * V, t);
          noise(0.46, 0.11 * V, t + 0.36, 'bandpass', 2600, 650, 3);
          tone('sine', 130, 38, 0.5, 0.55 * V, t + 0.38);
          noise(0.4, 0.30 * V, t + 0.38, 'lowpass', 1400, 180); break;
        case 'missile':                           // 导弹：快速上扫"咻——"
          noise(0.60, 0.30 * V, t, 'bandpass', 420, 3800, 4.5);
          tone('sawtooth', 180 * r, 900 * r, 0.45, 0.10 * V, t); break;
        case 'lock':                              // 开始锁定：短"嘀"
          tone('square', 1250 * r, 1250 * r, 0.05, 0.20 * V, t); break;
        case 'locked':                            // 锁定完成：下行大三度"叮咚"
          tone('sine', 880 * r, 880 * r, 0.12, 0.30 * V, t);
          tone('sine', 740 * r, 740 * r, 0.34, 0.30 * V, t + 0.12); break;
        case 'gun':                               // 机炮：短促低频砰
          tone('sine', 190 * r, 55, 0.10, 0.50 * V, t);
          noise(0.07, 0.24 * V, t, 'highpass', 1900, 800, 0.8); break;
        case 'hit':                               // 中弹：低撞 + 噪声爆裂
          tone('sine', 155, 48, 0.28, 0.50 * V, t);
          noise(0.30, 0.34 * V, t, 'bandpass', 1500, 260, 0.9); break;
        case 'explode':                           // 大爆炸：冲击 + 1.2s 噪声轰鸣
          noise(0.22, 0.34 * V, t, 'highpass', 3200, 700, 0.6);
          noise(1.20, 0.50 * V, t, 'lowpass', 2400, 120, 0.7);
          tone('sine', 92, 28, 1.20, 0.65 * V, t); break;
        case 'splash':                            // 坠海：沉闷水花
          noise(0.70, 0.42 * V, t, 'lowpass', 1800, 190, 0.8);
          tone('sine', 210, 55, 0.42, 0.24 * V, t + 0.02); break;
        case 'beep':                              // UI 确认
          tone('sine', 1320 * r, 1320 * r, 0.06, 0.22 * V, t); break;
        case 'warn':                              // 告警：两声短蜂鸣
          tone('square', 640, 640, 0.09, 0.16 * V, t);
          tone('square', 640, 640, 0.09, 0.16 * V, t + 0.14); break;
        case 'flare':                             // 干扰弹：弹射嘶声 + 小爆
          noise(0.28, 0.26 * V, t, 'bandpass', 2000, 420, 1.0);
          tone('square', 760, 320, 0.05, 0.10 * V, t); break;
        case 'wave':                              // 低频掠过
          noise(0.90, 0.18 * V, t, 'lowpass', 900, 120, 0.7);
          tone('sine', 72 * r, 38, 0.90, 0.50 * V, t); break;
        default: return;
      }
    } catch (e) { /* 音效失败不打断游戏 */ }
  }

  function stopLoop(name) {
    const n = loops[name];
    if (!n) return;
    stopGroup(n);
    delete loops[name];                          // 下次 update 会按需重建
  }

  /* ---------------- 生命周期与对外 API ---------------- */

  function init() {
    if (ctx) {                                   // 已初始化则只尝试恢复
      try { if (ctx.state === 'suspended') ctx.resume(); } catch (e) {}
      return;
    }
    const AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return;                             // 环境不支持：静默降级
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : vol;
      master.connect(ctx.destination);
      if (ctx.state === 'suspended') ctx.resume();// 必须发生在用户手势内
    } catch (e) { ctx = null; master = null; }
  }

  global.AudioSys = {
    init: init,
    update: update,
    play: play,
    stopLoop: stopLoop,
    setMuted: function (b) { muted = !!b; applyGain(); return muted; },
    toggleMuted: function () { muted = !muted; applyGain(); return muted; },
    isMuted: function () { return muted; },
    setVolume: function (v) { vol = clamp(Number(v) || 0, 0, 1); applyGain(); return vol; },
    isReady: ready
  };

})(window);