/* touch.js — iPad / 触屏操纵：浮动虚拟摇杆 + 油门杆 + 功能按钮
 * 只在检测到触摸（或菜单里手动打开）时启用，桌面端完全不受影响。
 */
(function (global) {
  'use strict';

  const T = {
    enabled: false,      // 是否启用触屏层
    seen: false,         // 是否检测到过触摸
    axes: { pitch: 0, roll: 0, yaw: 0 },   // 模拟量 -1..1
    throttle: null,      // null = 跟随键盘油门；数值 = 摇杆/滑条设定
    el: {}, stick: { id: -1, ox: 0, oy: 0, R: 70 },
    thr: { id: -1 },
    onChange: null,
  };

  const DEAD = 0.09;
  const R_MAX = 1;

  function $(id) { return document.getElementById(id); }

  /* ---------------- 键盘事件模拟（复用游戏原有逻辑） ---------------- */
  function keyEvent(type, code) {
    window.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true, cancelable: true }));
  }
  function tap(code) { keyEvent('keydown', code); setTimeout(() => keyEvent('keyup', code), 30); }

  /* ---------------- 启用 / 禁用 ---------------- */
  T.enable = function (on) {
    T.enabled = on;
    document.body.classList.toggle('touch', on);
    if (global.HUD) HUD.touch = on;
    if (!on) {
      T.axes.pitch = T.axes.roll = T.axes.yaw = 0;
      T.throttle = null;
      const s = T.el.stick; if (s) s.style.display = 'none';
    }
    if (T.onChange) T.onChange(on);
  };

  /* ---------------- 初始化 ---------------- */
  T.init = function () {
    const layer = $('touchLayer');
    if (!layer) return;
    T.el = {
      layer, zone: $('tStickZone'), stick: $('tStick'), knob: $('tKnob'),
      thr: $('tThr'), thrFill: $('tThrFill'), btns: $('tBtns'), pause: $('tPause'),
    };
    // 首次触摸自动启用
    window.addEventListener('touchstart', function () {
      if (!T.seen) { T.seen = true; if (!T.enabled) T.enable(true); }
    }, { passive: true, once: false });

    /* ---- 浮动摇杆 ---- */
    const zone = T.el.zone;
    zone.addEventListener('pointerdown', e => {
      if (!T.enabled) return;
      zone.setPointerCapture(e.pointerId);
      T.stick.id = e.pointerId;
      T.stick.ox = e.clientX; T.stick.oy = e.clientY;
      T.stick.R = Math.min(78, Math.max(52, Math.min(window.innerWidth, window.innerHeight) * 0.11));
      const s = T.el.stick;
      s.style.display = 'block';
      s.style.left = (e.clientX - T.stick.R) + 'px';
      s.style.top = (e.clientY - T.stick.R) + 'px';
      T.el.knob.style.transform = 'translate(0px,0px)';
      moveStick(e);
      e.preventDefault();
    }, { passive: false });
    zone.addEventListener('pointermove', e => {
      if (e.pointerId !== T.stick.id) return;
      moveStick(e);
      e.preventDefault();
    }, { passive: false });
    const endStick = e => {
      if (e.pointerId !== T.stick.id) return;
      T.stick.id = -1;
      T.axes.pitch = 0; T.axes.roll = 0;
      T.el.stick.style.display = 'none';
    };
    zone.addEventListener('pointerup', endStick);
    zone.addEventListener('pointercancel', endStick);

    function moveStick(e) {
      const dx = e.clientX - T.stick.ox, dy = e.clientY - T.stick.oy;
      const R = T.stick.R;
      let nx = dx / R, ny = dy / R;
      const m = Math.hypot(nx, ny);
      if (m > 1) { nx /= m; ny /= m; }
      // 模拟量 + 死区
      const ax = Math.abs(nx) < DEAD ? 0 : (nx - Math.sign(nx) * DEAD) / (1 - DEAD);
      const ay = Math.abs(ny) < DEAD ? 0 : (ny - Math.sign(ny) * DEAD) / (1 - DEAD);
      T.axes.roll = clamp1(ax);
      T.axes.pitch = clamp1(-ay);              // 上推 = 抬头
      T.el.knob.style.transform = `translate(${nx * R * 0.62}px,${ny * R * 0.62}px)`;
    }

    /* ---- 油门杆（右侧竖向滑条） ---- */
    const thr = T.el.thr;
    const setThr = e => {
      const r = thr.getBoundingClientRect();
      let v = 1 - (e.clientY - r.top) / r.height;
      v = clamp1((v - DEAD) / (1 - DEAD));
      T.throttle = v;
      T.el.thrFill.style.height = (v * 100) + '%';
    };
    thr.addEventListener('pointerdown', e => { thr.setPointerCapture(e.pointerId); T.thr.id = e.pointerId; setThr(e); e.preventDefault(); }, { passive: false });
    thr.addEventListener('pointermove', e => { if (e.pointerId === T.thr.id) { setThr(e); e.preventDefault(); } }, { passive: false });
    const endThr = e => { if (e.pointerId === T.thr.id) T.thr.id = -1; };
    thr.addEventListener('pointerup', endThr);
    thr.addEventListener('pointercancel', endThr);

    /* ---- 功能按钮 ---- */
    const HOLD = { KeyC: 1, KeyX: 1, ShiftLeft: 1, ControlLeft: 1, KeyZ: 1 };
    T.el.btns.querySelectorAll('.tbtn').forEach(b => {
      const code = b.dataset.key;
      const kind = b.dataset.mode || (HOLD[code] ? 'hold' : 'tap');
      b.addEventListener('pointerdown', e => {
        e.preventDefault();
        b.classList.add('on');
        if (kind === 'hold') keyEvent('keydown', code); else tap(code);
      }, { passive: false });
      const up = e => {
        b.classList.remove('on');
        if (kind === 'hold') keyEvent('keyup', code);
        if (e) e.preventDefault();
      };
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('pointerleave', e => { if (kind === 'hold' && b.classList.contains('on')) up(null); });
    });

    T.el.pause.addEventListener('pointerdown', e => { e.preventDefault(); tap('KeyP'); }, { passive: false });
  };

  function clamp1(v) { return v < -R_MAX ? -R_MAX : v > R_MAX ? R_MAX : v; }

  /** 触屏上把油门轴显示到 UI */
  T.syncThrottleUI = function (v) {
    if (T.throttle === null && T.el.thrFill) T.el.thrFill.style.height = (clamp1(v) * 100) + '%';
  };

  /** 菜单里的开关按钮 */
  T.toggle = function () { T.enable(!T.enabled); return T.enabled; };

  global.TouchUI = T;
})(window);