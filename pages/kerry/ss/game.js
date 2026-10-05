/* game.js — 主循环、状态机、任务流程、输入与渲染调度 */
(function (global) {
  'use strict';
  const { V3, M4, Q, clamp, lerp, smoothstep, wrapPi, RAD, DEG } = MM;

  const DECK = { halfLen: 165, halfBeam: 20.5, y: 14 };
  const SUN = V3.normalize(V3.create(), V3.create(0.42, 0.50, -0.76));

  const G = {
    state: 'boot',            // boot | menu | brief | play | pause | over
    time: 0, dt: 0, real: 0,
    player: null, enemies: [], missiles: [], ships: [], bombs: [], flares: [], tracers: [],
    carrier: null, islands: [], clouds: [],
    msgs: [], warns: [],
    lock: null, lockTarget: null,
    damageFlash: 0, shakeAmt: 0, shakeT: 0,
    eye: V3.create(),
    camMode: 0, camPos: V3.create(0, 60, 60), camLook: V3.create(), camFov: 68, camShake: V3.create(),
    camInit: false,
    phase: '', remaining: 0, wave: 0, waveT: 8, waveNo: 0,
    stats: null, radarRange: 20000, bombAim: null,
    result: null, difficulty: 1, helpOpen: false,
    models: {},
    msgsDirty: true,
  };

  /* ============================ 初始化 ============================ */
  function boot() {
    const cvs = document.getElementById('gl');
    if (!GL.init(cvs)) {
      document.getElementById('bootMsg').textContent = GL.msg || 'WebGL 初始化失败';
      document.getElementById('bootMsg').style.color = '#ff6b60';
      return;
    }
    // 移动端画质：先按设备粗判，再由帧率动态微调
    GL.autoQuality();
    if (location.search.indexOf('touch') >= 0) TouchUI.enable(true);
    const M = Models.buildAll();
    G.models = {
      player: M.fighter, enemy: M.fighterEnemy, carrier: M.carrier, destroyer: M.destroyer,
      missile: M.missile, bomb: M.bomb, island: M.island, cloud: M.cloud, buoy: M.buoy,
    };
    G.models.gear = buildGear();
    for (const k in G.models) GL.upload(G.models[k]);
    G.state = 'menu';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    requestAnimationFrame(frame);
  }

  /** 起落架（收放动画用缩放模拟） */
  function buildGear() {
    const b = new MB.Builder();
    const strut = '#9aa2ab', tire = '#1c1f22';
    // 主轮（左右）
    for (const s of [-1, 1]) {
      b.push(); b.translate(s * 2.6, 0, 0);
      b.cylinderY(0.09, 0.85, 6, strut);            // 支柱向上
      b.translate(0, -0.85, 0); b.rotateZ(Math.PI / 2);
      b.cylinderZ(0.24, 0.3, 8, tire);             // 轮胎
      b.pop();
    }
    // 前轮
    b.push(); b.translate(0, -0.35, -5.2);
    b.cylinderY(0.08, 0.7, 6, strut);
    b.translate(0, -0.7, 0); b.rotateZ(Math.PI / 2);
    b.cylinderZ(0.2, 0.26, 8, tire);
    b.pop();
    return b.finish('gear');
  }

  /* ============================ 输入 ============================ */
  const keys = {};
  const K = {
    pressed(code) { return !!keys[code]; },
    axis(neg, pos) { return (keys[pos] ? 1 : 0) - (keys[neg] ? 1 : 0); },
  };
  let mouseDown = false, mouseX = 0, mouseY = 0;

  function initInput() {
    const held = {};
    window.addEventListener('keydown', e => {
      if (e.repeat) { return; }
      keys[e.code] = true;
      onKeyDown(e.code, e);
      if (['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyC', 'KeyB'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => {
      keys[e.code] = false;
      onKeyUp(e.code, e);
    });
    window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouseDown = false; });
    const cvs = document.getElementById('gl');
    cvs.addEventListener('mousedown', e => { if (e.button === 0 && !TouchUI.enabled) mouseDown = true; });
    window.addEventListener('mouseup', e => { if (e.button === 0) mouseDown = false; });
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    // 切到后台自动暂停（移动端切 App 很常见）
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && G.state === 'play') togglePause();
    });
    // 阻止 iOS 的双击缩放 / 页面橡皮筋
    document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', e => { if (e.target.closest && e.target.closest('#touchLayer')) e.preventDefault(); }, { passive: false });
    void held;
  }

  function onKeyDown(code, e) {
    AudioSys.init();
    if (G.state === 'menu') {
      if (code === 'Enter' || code === 'Space') startGame();
      return;
    }
    if (G.state === 'over') {
      if (code === 'Enter' || code === 'KeyR') startGame();
      return;
    }
    if (code === 'KeyP' || code === 'Escape') { togglePause(); return; }
    if (code === 'KeyM') { AudioSys.toggleMuted(); log(AudioSys.isMuted() ? '静音' : '声音开启'); return; }
    if (code === 'KeyH') { G.helpOpen = !G.helpOpen; document.getElementById('help').style.display = G.helpOpen ? 'flex' : 'none'; return; }
    if (G.state !== 'play') return;
    const p = G.player;
    switch (code) {
      case 'KeyG':
        if (p.gearReady) {
          p.gear = !p.gear; AudioSys.play('gear');
          log(p.gear ? '起落架放下' : '起落架收起');
        }
        break;
      case 'KeyV':
        G.camMode = (G.camMode + 1) % 3;
        G.camInit = false;
        log(['追踪视角', '座舱视角', '外部视角'][G.camMode]);
        break;
      case 'Tab':
        cycleTarget();
        break;
      case 'KeyF': dropFlares(p, 8); break;
      case 'KeyB': dropBomb(); break;
      case 'KeyX': break;
      case 'Space':
        if (p.onGround && p.carrier) {
          if (!p.catDone || p.spd < 55) tryCatapult(); else p.brake = true;
        } else p.brakeT = 0.9;
        break;
    }
    void e;
  }

  function onKeyUp(code) {
    if (G.state === 'play' && code === 'Space') G.player.brake = false;
    if (G.state !== 'play') return;
    if (code === 'KeyC') {
      // 松开锁定键：若已锁定则发射
      const p = G.player;
      if (p.locked && p.missiles > 0) firePlayerMissile();
      else if (!p.locked) { p.lockT = 0; G.lock = null; }
    }
  }

  function cycleTarget() {
    const p = G.player;
    let best = null, bestScore = -1;
    for (const e of G.enemies) {
      if (!e.alive) continue;
      const d = V3.dist(e.pos, p.pos);
      if (d > 30000) continue;
      const dir = V3.normalize(V3.create(), V3.sub(V3.create(), e.pos, p.pos));
      const ax = Q.axes({ f: {}, u: {}, r: {} }, p.q);
      const dot = V3.dot(dir, ax.f);
      const score = dot * 2 + 1 / (1 + d / 6000);
      if (score > bestScore) { bestScore = score; best = e; }
    }
    G.lockTarget = best;
    if (best) log('目标：' + best.name);
  }

  /* ============================ 世界构建 ============================ */
  function startGame() {
    AudioSys.init();
    FX.reset();
    G.time = 0; G.msgs.length = 0; G.warns.length = 0;
    G.enemies.length = 0; G.missiles.length = 0; G.bombs.length = 0;
    G.flares.length = 0; G.tracers.length = 0;
    G.camInit = false; G.damageFlash = 0;
    G.lockTarget = null; G.lock = null;
    G.phase = '起飞'; G.wave = 0; G.waveNo = 0; G.waveT = 10; G.remaining = 0;
    TouchUI.throttle = TouchUI.enabled ? 0.7 : null;
    TouchUI.syncThrottleUI(0.7);
    G.stats = { kills: 0, bombs: 0, shots: 0, hits: 0, damage: 0, landed: false, time: 0 };
    G.result = null; G.resultShown = false;

    // 航母：起点在原点附近，向北航行
    const c = Ent.makeShip('carrier', 0, 0, 0);
    c.route = [
      { x: 0, z: -24000 }, { x: 6000, z: -52000 }, { x: -3000, z: -82000 }, { x: -6000, z: -112000 },
    ];
    G.carrier = c;
    G.ships.length = 0; G.ships.push(c);
    // 护航舰
    const d1 = Ent.makeShip('destroyer', 0, 0, 0);
    d1.offset = { x: 260, z: 700 };
    const d2 = Ent.makeShip('destroyer', 0, 0, 0);
    d2.offset = { x: -300, z: 500 };
    G.ships.push(d1, d2);
    for (const s of G.ships) { s.speed = s.targetSpeed = s.def.speed; }

    // 岛屿
    G.islands = [
      { pos: V3.create(9000, 0, -14000), scale: 1.0 },
      { pos: V3.create(-16000, 0, -6000), scale: 1.6 },
      { pos: V3.create(6000, 0, -46000), scale: 0.8 },
    ];
    // 云
    G.clouds.length = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        G.clouds.push({
          gx: i, gz: j, off: V3.create((Math.random() - .5) * 1500, 0, (Math.random() - .5) * 1500),
          h: 1150 + Math.random() * 900, s: 0.7 + Math.random() * 0.9, rot: Math.random() * 6.28,
        });
      }
    }

    // 玩家：停在甲板尾部
    const p = Ent.makePlane('player', 0, 0, 0, 0);
    // 注意：shipLocal 的 z 轴朝"舰首方向"为正（艏 +165，艉 -165），x 轴向右为正
    const f = Ent.shipFwd(c), r = Ent.shipRight(c);
    p.pos.x = c.pos.x + f.x * -138 + r.x * 0;
    p.pos.y = c.deckY;
    p.pos.z = c.pos.z + f.z * -138 + r.z * 0;
    p.yaw = c.yaw;
    Q.fromEulerYXZ(p.q, p.yaw, 0, 0);
    p.onGround = true; p.carrier = c; p.throttle = 0.65; p.gear = true; p.gearPos = 1;
    if (TouchUI.enabled) p.throttle = TouchUI.throttle !== null ? TouchUI.throttle : 0.65;
    p.gearReady = true; p.catT = 0; p.catDone = false; p.brake = false; p.brakeT = 0;
    p.aoaAbs = 0; p.stalled = false; p.fuelOut = false; p.gunHeat = 0; p.gunCd = 0;
    p.gunReady = true; p.gunCool = 0; p.beingLocked = false;
    p.missiles = 6; p.bombs = 4; p.flares = 24; p.hp = 100; p.fuel = 1;
    p.name = 'F/A-18E "老虎" 01';
    G.player = p;

    G.state = 'play';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('hudWrap').style.display = 'block';
    document.getElementById('missionCard').classList.add('show');
    setTimeout(() => document.getElementById('missionCard').classList.remove('show'), 5200);
    log(TouchUI.enabled ? '任务开始：油门推到底，再向上拉摇杆即可弹射起飞' : '任务开始：加满油门（Shift），按 空格 弹射起飞', true);
    setTimeout(() => {
      if (G.state === 'play') log(TouchUI.enabled ? '保持摇杆上推，接近 70 m/s 自动离舰' : '接近 70 m/s 后拉杆（↓/S）离舰');
    }, 6000);
    AudioSys.play('startup');
  }

  function togglePause() {
    if (G.state === 'play') { G.state = 'pause'; document.getElementById('pause').style.display = 'flex'; }
    else if (G.state === 'pause') { G.state = 'play'; document.getElementById('pause').style.display = 'none'; }
  }

  /* ============================ 消息 ============================ */
  function log(text, big) {
    G.msgs.push({ text, t: G.time, big: !!big, color: big ? '#ffd75e' : '#7dffb0' });
    if (G.msgs.length > 7) G.msgs.shift();
  }

  /* ============================ 武器 ============================ */
  function tryCatapult() {
    const p = G.player;
    if (p.catT > 0 || p.catDone) return;
    p.catT = 2.6; p.catDone = true; p.throttle = 1;
    AudioSys.play('catapult', { pos: p.pos });
    shake(0.9);
    log('弹射器发射！', true);
    FX.burst(V3.create(p.pos.x, p.pos.y + 1, p.pos.z), 26, 26, {
      life: 1.1, size0: 4, size1: 24, r: 0.9, g: 0.9, b: 0.92, r2: 0.6, g2: 0.62, b2: 0.65, a0: 0.7, drag: 1.2, grav: -2,
    });
  }

  function firePlayerMissile() {
    const p = G.player;
    if (p.missiles <= 0) { AudioSys.play('warn'); return; }
    const ax = Q.axes({ f: {}, u: {}, r: {} }, p.q);
    const r = ax.r, u = ax.u, f = ax.f;
    const side = (p.missiles % 2 === 0) ? 1 : -1;
    const off = V3.create(
      p.pos.x + r.x * 3.6 * side + u.x * -1.2 + f.x * 1.0,
      p.pos.y + r.y * 3.6 * side + u.y * -1.2 + f.y * 1.0,
      p.pos.z + r.z * 3.6 * side + u.z * -1.2 + f.z * 1.0);
    const dir = V3.normalize(V3.create(), V3.addScaled(V3.create(), f, ax.r, side * 0.25));
    const m = Ent.makeMissile(off, dir, G.lockTarget, true, 'aim');
    V3.set(m.vel, p.vel.x * 0.6, p.vel.y * 0.6, p.vel.z * 0.6);
    m.vel.x += f.x * 300; m.vel.y += f.y * 300; m.vel.z += f.z * 300;
    m.speed = V3.len(m.vel);
    G.missiles.push(m);
    p.missiles--;
    G.stats.shots++;
    AudioSys.play('missile', { pos: p.pos });
    shake(0.35);
    FX.muzzle(off, dir);
    G.lockTarget = null; G.lock = null; p.locked = false; p.lockT = 0;
    log('导弹离架！');
  }

  function dropFlares(plane, n) {
    if (plane.flares <= 0) return;
    const n2 = Math.min(n, plane.flares);
    const ax = Q.axes({ f: {}, u: {}, r: {} }, plane.q);
    for (let i = 0; i < n2; i++) {
      const side = (i % 2 === 0) ? 1 : -1;
      const pos = V3.create(
        plane.pos.x + ax.r.x * 3 * side - ax.f.x * 4,
        plane.pos.y + ax.r.y * 3 * side - ax.f.y * 4,
        plane.pos.z + ax.r.z * 3 * side - ax.f.z * 4);
      const vel = V3.create(plane.vel.x * 0.6 + (Math.random() - .5) * 40, plane.vel.y * 0.6 - 10,
        plane.vel.z * 0.6 + (Math.random() - .5) * 40);
      G.flares.push(Ent.makeFlare(pos, vel));
    }
    plane.flares -= n2;
    AudioSys.play('flare', { pos: plane.pos });
  }

  function dropBomb() {
    const p = G.player;
    if (p.bombs <= 0) { AudioSys.play('warn'); return; }
    const ax = Q.axes({ f: {}, u: {}, r: {} }, p.q);
    const pos = V3.create(p.pos.x - ax.f.x * 2, p.pos.y - ax.u.y * 1.5, p.pos.z - ax.f.z * 2);
    const b = Ent.makeBomb(pos, p.vel, null);
    V3.addScaled(b.vel, b.vel, ax.f, -8);
    G.bombs.push(b);
    p.bombs--;
    G.stats.bombs++;
    AudioSys.play('gear', { pos: p.pos });
    log('炸弹投出');
  }

  function fireGun() {
    const p = G.player;
    if (p.gunCd > 0 || !p.gunReady) return;
    p.gunCd = 0.075; p.gunHeat += 0.055;
    if (p.gunHeat > 1) { p.gunReady = false; p.gunCool = 1.6; }
    const ax = Q.axes({ f: {}, u: {}, r: {} }, p.q);
    const j = 0.004;
    const dx = (Math.random() - .5) * j * 2, dy = (Math.random() - .5) * j * 2, dz = (Math.random() - .5) * j * 2;
    const dir = V3.normalize(V3.create(), V3.create(
      ax.f.x + ax.r.x * dx + ax.u.x * dy,
      ax.f.y + ax.r.y * dx + ax.u.y * dy,
      ax.f.z + ax.r.z * dx + ax.u.z * dy));
    const pos = V3.create(p.pos.x + ax.f.x * 6, p.pos.y + ax.u.y * 0.2, p.pos.z + ax.f.z * 6);
    const vel = V3.create(dir.x * 1000, dir.y * 1000, dir.z * 1000);
    G.tracers.push(Ent.makeTracer(pos, vel, 0.9, true));
    G.stats.shots++;
    AudioSys.play('gun', { gain: 0.5 });
  }

  /* ============================ 伤害 ============================ */
  const W = {
    get eye() { return G.eye; },
    get player() { return G.player; },
    get enemies() { return G.enemies; },
    get missiles() { return G.missiles; },
    get ships() { return G.ships; },
    get flares() { return G.flares; },
    get time() { return G.time; },
    shake: v => shake(v),
    dropFlares: (p, n) => dropFlares(p, n),
    fireMissile: (e, tgt) => enemyFire(e, tgt),
    damagePlane: (p, dmg, src) => damagePlane(p, dmg, src),
    damageShip: (s, dmg) => damageShip(s, dmg),
    log: t => log(t),
  };

  function damagePlane(p, dmg, src) {
    if (!p.alive) return;
    p.hp -= dmg;
    if (p.hp <= 0) { killPlane(p, src); return; }
    p.damageSmoke = true;
    if (p === G.player) { G.damageFlash = Math.min(1, G.damageFlash + dmg / 45); AudioSys.play('hit'); shake(0.5); }
    else if (G.time - (p.hitT || -9) > 1.5) { p.hitT = G.time; log('命中 ' + (p.name || '敌机') + '（' + Math.round(100 - p.hp) + '% 损伤）'); }
  }

  function killPlane(p, src) {
    if (!p.alive) return;
    p.alive = false; p.hp = 0;
    FX.explosion(p.pos, 1.7);
    AudioSys.play('explode', { pos: p.pos });
    shake(clamp(160 / Math.max(40, V3.dist(p.pos, G.eye)), 0, 1));
    if (p === G.player) {
      G.state = 'over';
      setTimeout(() => endGame(false, '战机损毁'), 1400);
    } else {
      G.stats.kills++;
      G.stats.damage += 100;
      log('击落敌机！' + (p.name || ''));
    }
    void src;
  }

  function damageShip(s, dmg) {
    if (!s.alive) return;
    s.hp -= dmg;
    if (s.hp <= 0) {
      s.alive = false; s.burning = 12;
      FX.explosion(V3.create(s.pos.x, s.deckY, s.pos.z), 3.2);
      AudioSys.play('explode', { pos: s.pos });
      if (s === G.carrier) {
        log('母舰重创！', true);
        G.carrierDead = true;
      } else {
        G.stats.damage += Math.round(dmg);
        log(s.name + ' 沉没');
      }
    }
  }

  function enemyFire(e, tgt) {
    if (e.ammo <= 0) return;
    const ax = Q.axes({ f: {}, u: {}, r: {} }, e.q);
    const side = (e.ammo % 2 === 0) ? 1 : -1;
    const off = V3.create(
      e.pos.x + ax.r.x * 3.4 * side + ax.f.x * 1,
      e.pos.y + ax.r.y * 3.4 * side + ax.f.y * 1,
      e.pos.z + ax.r.z * 3.4 * side + ax.f.z * 1);
    const m = Ent.makeMissile(off, ax.f, tgt, false, 'aim');
    V3.set(m.vel, e.vel.x * 0.5 + ax.f.x * 280, e.vel.y * 0.5 + ax.f.y * 280, e.vel.z * 0.5 + ax.f.z * 280);
    m.speed = V3.len(m.vel);
    G.missiles.push(m);
    AudioSys.play('missile', { pos: e.pos, gain: 0.5 });
    FX.muzzle(off, ax.f);
  }

  /* ============================ 更新：玩家 ============================ */
  const _ctrl = { pitch: 0, roll: 0, yaw: 0, throttle: 0, ab: false, brake: false, slow: false };
  const AX2 = { f: {}, u: {}, r: {} };

  function updatePlayer(dt) {
    const p = G.player;
    if (!p.alive) { updateAttitude(p); return; }
    // 姿态量（HUD 用）
    updateAttitude(p);

    // 输入：键盘（数字量）+ 摇杆（模拟量）合成
    const T = TouchUI.enabled ? TouchUI.axes : null;
    const kPitch = K.axis('KeyW', 'KeyS') || K.axis('ArrowUp', 'ArrowDown');
    const kRoll = K.axis('KeyA', 'KeyD') || K.axis('ArrowLeft', 'ArrowRight');
    const kYaw = K.axis('KeyQ', 'KeyE');
    const pitchIn = clamp(kPitch + (T ? T.pitch : 0), -1, 1);
    const rollIn = clamp(kRoll + (T ? T.roll : 0), -1, 1);
    const yawIn = clamp(kYaw + (T ? T.yaw : 0), -1, 1);
    let thr = p.throttle;
    if (TouchUI.throttle !== null) thr = TouchUI.throttle;
    if (keys['ShiftLeft'] || keys['ShiftRight']) thr = Math.min(1, thr + dt * 0.55);
    if (keys['ControlLeft'] || keys['ControlRight']) thr = Math.max(0, thr - dt * 0.5);
    p.throttle = clamp(thr, 0, 1);

    const c = _ctrl;
    c.pitch = pitchIn;       // S/↓ = 抬头
    c.roll = rollIn;
    c.yaw = yawIn;
    c.throttle = p.throttle;
    c.ab = !!keys['KeyZ'];
    c.slow = p.brakeT > 0;
    if (p.brakeT > 0) p.brakeT -= dt;

    // 机炮
    p.gunCd -= dt;
    if (p.gunCool > 0) { p.gunCool -= dt; if (p.gunCool <= 0) p.gunHeat = 0; }
    p.gunReady = p.gunCool <= 0;
    if (p.gunHeat > 0) { p.gunHeat = Math.max(0, p.gunHeat - dt * 0.11); if (p.gunHeat < 0.02) p.gunReady = true; }
    if (keys['KeyX'] || mouseDown) fireGun();

    // 起落架动画
    const gearTgt = p.gear ? 1 : 0;
    p.gearPos += clamp(gearTgt - p.gearPos, -dt * 0.75, dt * 0.75);
    p.gearReady = p.gearPos < 0.02 || p.gearPos > 0.98;

    if (p.onGround && p.carrier) updateOnDeck(p, dt, c);
    else updateAir(p, dt, c);

    // 锁定逻辑
    updateLock(dt);
    // 炸弹瞄准点
    updateBombAim();
    // 尾迹与涡流
    updatePlaneFX(p, dt);

    // 撞击检测
    checkCollisions(p, dt);
  }

  function updateAttitude(p) {
    const ax = Q.axes(AX2, p.q);
    p.pitch = Math.asin(clamp(ax.f.y, -1, 1));
    p.yaw = Math.atan2(ax.f.x, -ax.f.z);          // 罗盘航向（0=北，右转为正）
    const rh = Math.hypot(ax.r.x, ax.r.z);
    p.roll = Math.atan2(-ax.r.y, rh);
  }

  function updateOnDeck(p, dt, c) {
    const s = p.carrier;
    const L = Ent.shipLocal(s, p.pos);
    const ax = Q.axes(AX2, p.q);
    const r = ax.r, f = ax.f;
    // 航向基本锁定母舰，保留一点操纵权
    const rel = wrapPi((p.yaw - s.yaw));
    let accel;
    // 弹射
    if (p.catT > 0) {
      p.catT -= dt;
      accel = p.catT > 0 ? 34 : 3.5;
      if (p.catT <= 0) { log('达到起飞速度，拉杆！', true); AudioSys.play('beep'); }
    } else {
      accel = c.throttle * 3.4 - (p.brake ? 8 : 0.35) - (p.speedBrake ? 2 : 0);
    }
    p.spd += accel * dt;
    p.spd = Math.max(0, p.spd);
    // 侧向偏移与航向（右打舵 -> 向右移）
    L.x = clamp(L.x + clamp(c.yaw * 2.4 + c.roll * 0.6, -6, 6) * dt * 3, -19, 19);
    const worldPos = V3.create(
      s.pos.x + Ent.shipFwd(s).x * L.z + Ent.shipRight(s).x * L.x,
      s.pos.y + DECK.y,
      s.pos.z + Ent.shipFwd(s).z * L.z + Ent.shipRight(s).z * L.x);
    V3.copy(p.pos, worldPos);
    p.yaw = s.yaw + clamp(rel * 0.98, -0.5, 0.5);
    const dir = V3.addScaled(V3.create(), Ent.shipFwd(s), Ent.shipRight(s), 0);
    V3.set(p.vel, dir.x * p.spd + s.vel.x, 0, dir.z * p.spd + s.vel.z);
    p.alpha = 0; p.gload = 1; p.stalled = false; p.vs = 0;

    // 起飞拉杆（弹射结束后自动带杆，帮助离舰；必须先经过一次弹射）
    let pitchCmd = c.pitch;
    // 触屏：油门推到底 + 拉摇杆 = 弹射
    if (TouchUI.enabled && !p.catDone && c.throttle > 0.85 && pitchCmd > 0.35) tryCatapult();
    if (p.catDone && p.spd > 62 && p.catT <= 0 && p.spd > 68) pitchCmd = Math.max(pitchCmd, 0.6);
    if (p.catDone && p.spd > 66 && pitchCmd > 0.25) {
      // 离舰
      p.onGround = false; p.carrier = null;
      Q.fromEulerYXZ(p.q, p.yaw, 0.13, 0);
      p.vel.y = 6.5;
      p.toAssist = 6;
      AudioSys.play('gear');
      log('离舰！', true);
      FX.dust(V3.create(p.pos.x, p.pos.y + 0.4, p.pos.z), 22, 1, 26);
      // 轮胎烟
      for (let i = 0; i < 14; i++) {
        FX.spawn(V3.create(p.pos.x, p.pos.y + 1, p.pos.z), {
          vx: (Math.random() - .5) * 20, vy: 3 + Math.random() * 8, vz: (Math.random() - .5) * 20,
          life: 1.4, size0: 3, size1: 22, r: 0.75, g: 0.75, b: 0.74, a0: 0.5, drag: 1.4, grav: -0.6,
        });
      }
    } else if (p.spd > 55) {
      p.pitch = clamp(c.pitch * 0.12, -0.05, 0.12);
      Q.fromEulerYXZ(p.q, p.yaw, p.pitch, 0);
    } else {
      Q.fromEulerYXZ(p.q, p.yaw, 0, 0);
    }
    // 冲出甲板（舰首方向为 +）
    if (L.z > DECK.halfLen + 2) {
      log('冲出甲板！', true);
      crash('flew_off');
    }
    if (p.catDone && p.spd < 1.2 && p.throttle < 0.2) p.catDone = false; // 允许二次弹射
  }

  function updateAir(p, dt, c) {
    // 离舰后 5 秒内的起飞辅助：自动带杆到 12° 并保持机翼水平（新手友好）
    if (p.toAssist > 0) {
      p.toAssist -= dt;
      c.pitch = Math.max(c.pitch, clamp((0.21 - p.pitch) * 2.2, 0, 0.6));
      c.roll = clamp(c.roll - p.roll * 1.2, -1, 1);
      if (p.spd > 140 && p.pos.y > 90) p.toAssist = 0;
    }
    // 进近模式（类似真实战机的 LAND 模式）：松杆时自动跟随 3.4° 下滑道并保持 7° 迎角
    if (p.gearPos > 0.8 && p.pos.y < 90) {
      const ship = G.carrier;
      if (ship && ship.alive && V3.dist(p.pos, ship.pos) < 8000 && !c.pitch) {
        const spd = Math.max(30, p.spd);
        const fpa = Math.asin(clamp(p.vel.y / spd, -1, 1));
        c.pitch = clamp((0.21 - p.alpha) * 2.5 + (-3.4 * DEG - fpa) * 4.0, -1, 1);
        c.roll = clamp(c.roll - p.roll * 1.5, -1, 1);   // 同时自动压坡度对正中线
      }
    }
    Ent.updatePlane(p, dt, c);
    // 撞海
    if (p.pos.y < 1.6) {
      FX.splash(p.pos, 3);
      AudioSys.play('splash', { pos: p.pos });
      crash('ditched');
    }
    // 燃油耗尽提示
    if (p.fuel <= 0 && !p.fuelOut) { p.fuelOut = true; log('燃油耗尽！发动机停车', true); AudioSys.play('warn'); }
    if (p.fuel > 0) p.fuelOut = false;
  }

  function crash(reason) {
    const p = G.player;
    if (!p.alive) return;
    p.alive = false; p.hp = 0;
    const why = {
      ditched: '坠海', flew_off: '冲出甲板', hard: '重着陆失败', hit: '撞上目标',
      ship: '撞上舰体', island: '撞上岛屿', timeout: '任务失败',
    }[reason] || '失事';
    G.state = 'over';
    if (reason !== 'ditched') { FX.explosion(p.pos, 1.6); AudioSys.play('explode', { pos: p.pos }); }
    shake(1);
    setTimeout(() => endGame(false, why), 1300);
  }

  function updateLock(dt) {
    const p = G.player;
    G.lock = null;
    if (!K.pressed('KeyC')) { if (!p.locked) p.lockT = Math.max(0, p.lockT - dt * 1.4); }
    // 自动捕获
    if (!G.lockTarget || !G.lockTarget.alive || V3.dist(G.lockTarget.pos, p.pos) > 34000) {
      if (!p.locked) G.lockTarget = null;
    }
    if (!G.lockTarget) {
      const ax = Q.axes(AX2, p.q);
      let best = null, bd = 1e9;
      for (const e of G.enemies) {
        if (!e.alive) continue;
        const d = V3.dist(e.pos, p.pos);
        if (d > 26000 || d < 250) continue;
        const dir = V3.normalize(V3.create(), V3.sub(V3.create(), e.pos, p.pos));
        if (V3.dot(dir, ax.f) > 0.90 && d < bd) { bd = d; best = e; }
      }
      if (best) { G.lockTarget = best; p.lockT = 0; AudioSys.play('lock'); }
    }
    const e = G.lockTarget;
    if (!e || !e.alive) { p.lockT = 0; p.locked = false; return; }
    const d = V3.dist(e.pos, p.pos);
    const dir = V3.normalize(V3.create(), V3.sub(V3.create(), e.pos, p.pos));
    const ax = Q.axes(AX2, p.q);
    const dot = V3.dot(dir, ax.f);
    const inCone = dot > 0.82 && d < 26000 && d > 200;
    const relV = V3.dot(e.vel, dir);
    const closing = -(V3.dot(dir, V3.normalize(V3.create(), p.vel)) * p.spd) - relV * 0;
    G.lock = { target: e, t: p.lockT, closing: dot > 0.5 ? (p.spd * dot - Math.max(0, relV)) : 0, inCone };
    if (p.locked) { p.lockT = 1; return; }
    if (K.pressed('KeyC')) {
      if (inCone) {
        const rate = clamp(2600 / d, 0.28, 1.0);
        p.lockT = Math.min(1, p.lockT + dt * rate * 1.5);
        p.lockTone -= dt;
        if (p.lockTone <= 0) { AudioSys.play('lock', { gain: 0.5 }); p.lockTone = 0.18; }
        if (p.lockT >= 1) { p.locked = true; AudioSys.play('locked'); log('锁定完成！松开 C 发射'); }
      } else {
        p.lockT = Math.max(0, p.lockT - dt * 0.9);
        p.lockConeOk = false;
      }
    }
  }

  function updateBombAim() {
    const p = G.player;
    if (p.bombs <= 0) { G.bombAim = null; return; }
    const y = Math.max(1, p.pos.y);
    const t = (p.vel.y + Math.sqrt(p.vel.y * p.vel.y + 2 * 9.81 * y)) / 9.81;
    const pt = V3.create(p.pos.x + p.vel.x * t, 0, p.pos.z + p.vel.z * t);
    const s = GL.project(pt, {});
    G.bombAim = { ok: s.ok, x: s.x, y: s.y, label: (V3.dist(pt, p.pos) / 1000).toFixed(1) + 'km  ' + Math.round(t * 10) / 10 + 's' };
  }

  function updatePlaneFX(p, dt) {
    if (!p.alive) return;
    const ax = Q.axes(AX2, p.q);
    const f = ax.f, r = ax.r, u = ax.u;
    const engPos = V3.create(p.pos.x - f.x * 7.6 + u.x * 0.2, p.pos.y - f.y * 7.6 + u.y * 0.2, p.pos.z - f.z * 7.6 + u.z * 0.2);
    const abOn = p.throttle > 0.95;
    if (p.throttle > 0.08 && p.fuel > 0) {
      if (Math.random() < 0.9) FX.afterburner(engPos, f, abOn ? 1 : p.throttle * 0.55);
      if (abOn && p.pos.y > 6500 && Math.random() < 0.4) FX.exhaustTrail(engPos);
    }
    // 翼尖涡流
    if ((p.aoaAbs > 0.2 || p.gload > 4.2) && p.spd > 110) {
      for (const s of [-1, 1]) {
        if (Math.random() < 0.6) FX.vortex(V3.create(
          p.pos.x + r.x * 5.4 * s - f.x * 1, p.pos.y + r.y * 5.4 * s - f.y * 1, p.pos.z + r.z * 5.4 * s - f.z * 1), r);
      }
    }
    // 受损冒烟
    if (p.damageSmoke && Math.random() < 0.7) {
      FX.spawn(V3.create(p.pos.x - f.x * 4, p.pos.y - f.y * 4, p.pos.z - f.z * 4), {
        vx: p.vel.x * 0.1, vy: 6, vz: p.vel.z * 0.1, life: 1.8, size0: 2, size1: 16,
        r: 0.15, g: 0.14, b: 0.14, r2: 0.5, g2: 0.5, b2: 0.52, a0: 0.55, drag: 0.5,
      });
    }
    void dt;
  }

  /* ============================ 碰撞 ============================ */
  function checkCollisions(p, dt) {
    // 航母甲板
    const c = G.carrier;
    if (c.alive && !p.onGround) {
      const L = Ent.shipLocal(c, p.pos);
      const overDeck = Math.abs(L.x) < DECK.halfBeam && L.z > -DECK.halfLen && L.z < DECK.halfLen;
      // 舰岛（右舷中段，shipLocal 坐标：x>0，z∈[-28,30]）
      if (L.x > 6.5 && L.x < DECK.halfBeam && L.z > -24 && L.z < 32 && p.pos.y < DECK.y + 26 && p.pos.y > DECK.y - 6) {
        crash('ship'); return;
      }
      if (overDeck && p.pos.y < DECK.y + 1.1) {
        // 只有在下降穿越甲板高度时才判定着舰（避免刚离舰就被判成着舰）
        if (p.vel.y < -0.3 && p.pos.y > DECK.y - 1.2) tryTouchdown(p, L, c);
        else if (p.pos.y <= DECK.y - 1.2) crash('ship');
        return;
      }
      // 撞船体侧面
      if (Math.abs(L.x) < DECK.halfBeam + 2 && L.z > -DECK.halfLen - 6 && L.z < DECK.halfLen + 6 && p.pos.y < DECK.y && p.pos.y > -4) {
        crash('ship');
      }
    }
    // 岛屿
    for (const is of G.islands) {
      const dx = p.pos.x - is.pos.x, dz = p.pos.z - is.pos.z;
      const rr = 250 * is.scale;
      if (dx * dx + dz * dz < rr * rr && p.pos.y < 120 * is.scale) {
        log('撞上岛屿！', true);
        crash('island'); return;
      }
    }
    // 与敌机碰撞
    for (const e of G.enemies) {
      if (!e.alive) continue;
      const d = V3.dist(e.pos, p.pos);
      if (d < 16) {
        FX.explosion(V3.create((e.pos.x + p.pos.x) / 2, (e.pos.y + p.pos.y) / 2, (e.pos.z + p.pos.z) / 2), 2);
        damagePlane(e, 200, p); damagePlane(p, 45, e);
        AudioSys.play('explode', { pos: p.pos });
        return;
      }
    }
    void dt;
  }

  function tryTouchdown(p, L, c) {
    const sink = -p.vel.y;
    const relSpd = p.spd - c.speed;
    // 着舰方向与母舰艏向相反（从舰艏外侧向舰艉降落），故与 c.yaw+π 比较
    const hdgErr = Math.abs(wrapPi(p.yaw - c.yaw - Math.PI));
    const gear = p.gearPos > 0.85;
    const inZone = Math.abs(L.x) < 15 && L.z > -160 && L.z < 150;
    const lateral = L.x;
    let bad = [];
    if (!gear) bad.push('未放起落架');
    if (sink > 7.0) bad.push('下沉率过大');
    if (relSpd > 110) bad.push('速度过大');
    if (relSpd < 42) bad.push('速度过低');
    if (hdgErr > 0.35) bad.push('对正偏差');
    if (!inZone) bad.push('未落在着舰区');
    if (bad.length === 0) {
      // 成功着舰（阻拦索兜住）；下沉率过大时按重着陆计损伤
      p.onGround = true; p.carrier = c; p.catDone = false; p.catT = 0;
      const landZ = clamp(L.z, -150, 140);
      const landX = clamp(lateral, -16, 16);
      const f = Ent.shipFwd(c), r = Ent.shipRight(c);
      V3.set(p.pos,
        c.pos.x + f.x * landZ + r.x * landX,
        c.deckY,
        c.pos.z + f.z * landZ + r.z * landX);
      p.yaw = c.yaw; Q.fromEulerYXZ(p.q, p.yaw, 0, 0);
      p.spd = Math.max(0, relSpd);
      V3.set(p.vel, f.x * p.spd + c.vel.x, 0, f.z * p.spd + c.vel.z);
      const over = Math.max(0, sink - 4.6);
      const dmg = over * 7 + Math.max(0, relSpd - 95) * 1.6 + Math.abs(lateral) * 1.2;
      const score = clamp(Math.round(1000 - over * 45 - Math.abs(lateral) * 12 - hdgErr * 400), 0, 1000);
      if (dmg > 4) {
        log('重着陆！损伤 ' + Math.round(dmg) + '%（下沉率 ' + sink.toFixed(1) + ' m/s）', true);
        damagePlane(p, dmg, null);
        shake(0.9);
        AudioSys.play('hit');
      } else {
        AudioSys.play('gear'); AudioSys.play('beep');
        log('着舰成功！评级得分 ' + score, true);
      }
      G.stats.landed = true;
      G.stats.landScore = score;
      FX.dust(V3.create(p.pos.x, p.pos.y + 0.3, p.pos.z), 26, 1, 30);
      shake(0.5);
      if (p.alive) setTimeout(() => { if (G.state === 'play') endGame(true, '任务完成'); }, 2800);
      else crash('hard');
    } else {
      FX.explosion(p.pos, 1.5);
      AudioSys.play('explode', { pos: p.pos });
      log('着舰失败：' + bad.join('、') + `（着舰点 x=${L.x.toFixed(1)}m z=${L.z.toFixed(0)}m 下沉${sink.toFixed(1)}m/s 速度${relSpd.toFixed(0)}m/s）`, true);
      crash('hard');
    }
  }

  /* ============================ 敌机 ============================ */
  const WAVES = [2, 3, 4];
  const NAMES = ['红鳍 01', '红鳍 02', '红鳍 03', '红鳍 04', '红鳍 05', '红鳍 06', '红鳍 07', '红鳍 08', '红鳍 09'];

  function spawnWave(n, count) {
    const p = G.player;
    const ang = Math.random() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      const dist = 13000 + i * 900;
      const a = ang + (i - count / 2) * 0.10;
      const e = Ent.makePlane('enemy', 0, 0, 0, 0);
      e.pos.x = p.pos.x + Math.sin(a) * dist;
      e.pos.y = 2200 + Math.random() * 1800;
      e.pos.z = p.pos.z + Math.cos(a) * dist;
      const toP = V3.normalize(V3.create(), V3.sub(V3.create(), p.pos, e.pos));
      Ent.orientFromFwdUp(e, toP);
      e.vel.x = toP.x * 260; e.vel.y = toP.y * 260; e.vel.z = toP.z * 260;
      e.spd = 260; e.throttle = 0.9;
      e.hp = 100; e.ammo = 4; e.skill = 0.5 + Math.random() * 0.45;
      e.state = 'ingress'; e.name = NAMES[(G.waveNo * 3 + i) % NAMES.length];
      e.missiles = 4;
      G.enemies.push(e);
    }
    G.waveNo++;
    log('发现敌机编队！' + count + ' 架 inbound', true);
    AudioSys.play('warn');
  }

  function updateEnemies(dt) {
    for (const e of G.enemies) {
      if (!e.alive) continue;
      const c = Ent.aiThink(e, dt, W);
      Ent.updatePlane(e, dt, c);
      e.throttle = c.throttle;
      updatePlaneFX(e, dt);
      e.spd = V3.len(e.vel);
      if (e.pos.y < 2.5) {
        FX.explosion(e.pos, 1.4);
        FX.splash(e.pos, 2);
        AudioSys.play('explode', { pos: e.pos });
        if (e === G.lockTarget) { G.lockTarget = null; }
        e.alive = false;
        G.stats.kills++;
        log('敌机坠海：' + e.name);
      }
      // 被锁定提示（给玩家预警）
      const p = G.player;
      if (p.alive) {
        const d = V3.dist(e.pos, p.pos);
        const wasLocked = e.beingLocked > 0;
        const dir = V3.normalize(V3.create(), V3.sub(V3.create(), p.pos, e.pos));
        const ax = Q.axes(AX2, e.q);
        const aspect = V3.dot(dir, ax.f);
        e.beingLocked = (aspect > 0.94 && d < 16000 && e.lockT > 0.25) ? 1 : 0;
        if (e.beingLocked && !wasLocked) log('警告：被 ' + e.name + ' 锁定！', true);
        p.beingLocked = G.enemies.some(x => x.alive && x.beingLocked);
      }
    }
  }

  /* ============================ 任务流程 ============================ */
  function updateMission(dt) {
    const alive = G.enemies.filter(e => e.alive).length;
    G.remaining = alive;
    if (G.phase === '起飞' && !G.player.onGround) {
      G.phase = '拦截';
      log('进入拦截航线，注意雷达上的红点', true);
    }
    if (G.phase === '拦截') {
      if (G.wave < WAVES.length) {
        if (alive === 0) {
          G.waveT -= dt;
          if (G.waveT <= 0) { spawnWave(G.wave, WAVES[G.wave]); G.wave++; G.waveT = 12; }
        }
      } else if (alive === 0) {
        G.phase = '返航';
        log('空域已肃清！返航母舰降落（自动放起落架）', true);
      }
    }
    if (G.phase === '返航') {
      const c = G.carrier;
      const d = V3.dist(G.player.pos, c.pos);
      if (d < 12000 && !G.gearWarn) { G.gearWarn = true; G.player.gear = true; AudioSys.play('gear'); log('已放起落架，进入着舰航线', true); }
      G.carrierHint = d;
    }
    // 波次计时
    if (G.phase === '拦截' && alive === 0 && G.wave < WAVES.length && G.waveT <= 0) G.waveT = 10;
  }

  /* ============================ 告警 ============================ */
  function updateWarnings() {
    const p = G.player, W2 = [];
    if (!p.alive) { G.warns = []; return; }
    if (p.pos.y < 220 && p.vs < -26) W2.push({ text: 'PULL UP 拉杆！', color: 'red', blink: true, big: true });
    if (p.stalled && p.spd < 130) W2.push({ text: 'STALL 失速 — 松杆加油门', color: 'red', blink: true });
    if (p.pos.y < 900 && !p.gear && p.pos.y < 320) W2.push({ text: 'GEAR 起落架', color: 'amber', blink: true });
    if (p.beingLocked) W2.push({ text: '被敌机锁定 — S 机动 / F 投放干扰弹', color: 'red', blink: true });
    let inbound = false;
    for (const m of G.missiles) if (m.alive && !m.fromPlayer && m.target === p && V3.dist(m.pos, p.pos) < 5000) inbound = true;
    if (inbound) W2.push({ text: '导弹来袭！', color: 'red', blink: true, big: true });
    if (p.fuel < 0.12) W2.push({ text: '燃油不足', color: 'amber', blink: true });
    if (p.hp < 35) W2.push({ text: '机体受损', color: 'amber', blink: true });
    if (p.gunHeat > 0.92) W2.push({ text: '炮管过热', color: 'amber' });
    G.warns = W2;
  }

  /* ============================ 相机 ============================ */
  function updateCamera(dt) {
    const p = G.player;
    const ax = Q.axes(AX2, p.q);
    const f = ax.f, u = ax.u, r = ax.r;
    let want = V3.create(), look = V3.create(), fov = 68;
    if (G.camMode === 0) {
      const back = G.camDist === undefined ? (G.camDist = 17) : G.camDist;
      G.camDist = lerp(G.camDist, 17 + clamp(p.spd * 0.022, 0, 9), 1 - Math.exp(-2 * dt));
      want = V3.create(
        p.pos.x - f.x * G.camDist + u.x * 4.2,
        p.pos.y - f.y * G.camDist + u.y * 4.2,
        p.pos.z - f.z * G.camDist + u.z * 4.2);
      look = V3.create(p.pos.x + f.x * 60, p.pos.y + f.y * 60 + u.y * 2, p.pos.z + f.z * 60);
      fov = 66 + clamp((p.spd - 180) * 0.045, 0, 16);
    } else if (G.camMode === 1) {
      want = V3.create(
        p.pos.x + f.x * 1.6 + u.x * 1.05,
        p.pos.y + f.y * 1.6 + u.y * 1.05,
        p.pos.z + f.z * 1.6 + u.z * 1.05);
      look = V3.create(p.pos.x + f.x * 300, p.pos.y + f.y * 300, p.pos.z + f.z * 300);
      fov = 72 + clamp((p.spd - 180) * 0.03, 0, 10);
    } else {
      // 外部机位：绕飞机缓慢环绕
      const t = G.time * 0.25;
      want = V3.create(p.pos.x + Math.sin(t) * 34, p.pos.y + 9, p.pos.z + Math.cos(t) * 34);
      look = V3.clone(p.pos);
      fov = 55;
    }
    if (!G.camInit) { V3.copy(G.camPos, want); V3.copy(G.camLook, look); G.camInit = true; }
    else {
      const rate = G.camMode === 2 ? 3.5 : (G.camMode === 1 ? 26 : 9);
      V3.lerp(G.camPos, G.camPos, want, 1 - Math.exp(-rate * dt));
      V3.lerp(G.camLook, G.camLook, look, 1 - Math.exp(-(rate * 1.4) * dt));
    }
    G.camFov = lerp(G.camFov, fov, 1 - Math.exp(-4 * dt));
    // 震动
    G.shakeT -= dt;
    if (G.shakeT <= 0) { G.shakeAmt *= 0.55; if (G.shakeAmt < 0.01) G.shakeAmt = 0; }
    const s = G.shakeAmt;
    V3.set(G.camShake, (Math.random() - .5) * s * 2.2, (Math.random() - .5) * s * 2.2, (Math.random() - .5) * s * 1.2);
    V3.add(G.eye, G.camPos, G.camShake);
  }
  function shake(v) { G.shakeAmt = Math.min(1.4, G.shakeAmt + v); G.shakeT = 0.25; }

  /* ============================ 渲染 ============================ */
  const _m = M4.create(), _m2 = M4.create(), _q = Q.create();

  function render() {
    const p = G.player;
    const aspect = Math.max(0.2, GL.cssW / Math.max(1, GL.cssH));
    M4.perspective(GL.proj, G.camFov * DEG, aspect, 0.6, 90000);
    // 相机上方向随滚转
    const ax = Q.axes(AX2, G.player.q);
    const up = ax.u;
    M4.lookAt(GL.view, G.eye, G.camLook, up);
    GL.beginFrame({
      eye: G.eye, sunDir: SUN, time: G.time,
      sunCol: [1.0, 0.95, 0.86], ambCol: [0.26, 0.30, 0.36], skyCol: [0.42, 0.56, 0.76],
      fogCol: [0.70, 0.80, 0.88], fogNear: 2600, fogFar: 30000,
      zenith: [0.12, 0.30, 0.66], horizon: [0.78, 0.87, 0.94],
      deep: [0.010, 0.055, 0.105], shallow: [0.04, 0.30, 0.36],
    });
    GL.drawSky();
    GL.drawSea(G.eye.x, G.eye.z);

    // 云
    const CELL = 4200;
    const cx = Math.round(G.eye.x / CELL), cz = Math.round(G.eye.z / CELL);
    for (const c of G.clouds) {
      for (let ox = -1; ox <= 1; ox++) {
        for (let oz = -1; oz <= 1; oz++) {
          const gx = cx + ox, gz = cz + oz;
          if (gx !== c.gx || gz !== c.gz) continue;
          const x = gx * CELL + c.off.x, z = gz * CELL + c.off.z;
          const d = Math.hypot(x - G.eye.x, z - G.eye.z);
          if (d > 26000) continue;
          Q.setAxisAngle(_q, 0, 1, 0, c.rot);
          M4.fromRotTransScale(_m, _q, V3.create(x, c.h, z), c.s);
          GL.drawMesh(G.models.cloud, _m, { emissive: 0.45 });
        }
      }
    }
    // 岛屿
    for (const is of G.islands) {
      Q.setAxisAngle(_q, 0, 1, 0, is.pos.x * 0.01);
      M4.fromRotTransScale(_m, _q, is.pos, is.scale);
      GL.drawMesh(G.models.island, _m, {});
    }
    // 舰船
    for (const s of G.ships) {
      if (!s.alive) continue;
      M4.fromRotTrans(_m, s.q, s.pos);
      GL.drawMesh(s.kind === 'carrier' ? G.models.carrier : G.models.destroyer, _m, {});
      // 舰载机（停机坪）
      if (s.kind === 'carrier') drawDeckParked(s);
    }
    // 玩家
    if (p.alive) {
      M4.fromRotTrans(_m, p.q, p.pos);
      GL.drawMesh(G.models.player, _m, { flash: G.damageFlash * 0.5 });
      if (p.gearPos > 0.02) {
        M4.fromRotTransScale(_m2, p.q, p.pos, 1);
        // 用 Y 缩放模拟收放
        const m = _m2;
        m[5] = lerp(0.15, 1, p.gearPos) * 1; m[13] = p.pos.y - (1 - lerp(0.15, 1, p.gearPos)) * 0.9;
        GL.drawMesh(G.models.gear, m, {});
      }
      drawShadow(p.pos, 11, p.pos.y);
    }
    // 敌机
    for (const e of G.enemies) {
      if (!e.alive) continue;
      M4.fromRotTrans(_m, e.q, e.pos);
      GL.drawMesh(G.models.enemy, _m, { flash: e.hp < 35 ? 0.35 : 0 });
      drawShadow(e.pos, 10, e.pos.y);
    }
    // 导弹与炸弹
    for (const m of G.missiles) {
      if (!m.alive) continue;
      Q.setAxisAngle(_q, 0, 1, 0, 0);
      const dir = V3.normalize(V3.create(), m.vel);
      Ent.orientFromFwdUp(_tmpPlane, dir);
      M4.fromRotTrans(_m, _tmpPlane.q, m.pos);
      GL.drawMesh(G.models.missile, _m, {});
    }
    for (const b of G.bombs) {
      if (!b.alive) continue;
      Q.setAxisAngle(_q, 1, 0, 0, b.spin);
      M4.fromRotTrans(_m, _q, b.pos);
      GL.drawMesh(G.models.bomb, _m, {});
    }
    // 特效
    FX.render();
  }
  const _tmpPlane = { q: Q.create() };

  function drawDeckParked(s) {
    // 甲板上的舰载机（装饰，随航母移动）
    const f = Ent.shipFwd(s), r = Ent.shipRight(s);
    const spots = [[-13, -70], [-13, -50], [13, -40], [-13, 40], [13, 60], [0, 95]];
    for (let i = 0; i < spots.length; i++) {
      const sp = spots[i];
      const pos = V3.create(s.pos.x + f.x * sp[1] + r.x * sp[0], s.deckY + 1.9, s.pos.z + f.z * sp[1] + r.z * sp[0]);
      Q.fromEulerYXZ(_q, s.yaw + Math.PI, 0, 0);
      M4.fromRotTrans(_m, _q, pos);
      GL.drawMesh(G.models.enemy, _m, { emissive: 0.12, tint: [0.8, 0.85, 0.9] });
    }
  }

  function drawShadow(pos, size, alt) {
    if (alt > 2600 || !GL.quality.shadows) return;
    const k = 1 + alt / 2600 * 2.4;
    M4.fromRotTransScale(_m, Q.identity(_q), V3.create(pos.x, 0.45, pos.z), size * k);
    GL.drawMesh(GL.disc, _m, { alpha: clamp(0.34 - alt / 2600 * 0.2, 0.05, 0.34) });
  }

  /* ============================ 结束 ============================ */
  function endGame(win, reason) {
    if (G.resultShown) return;
    G.resultShown = true;
    G.state = 'over';
    G.result = {
      win, reason,
      kills: G.stats.kills, bombs: G.stats.bombs,
      shots: G.stats.shots, hits: G.stats.hits,
      land: G.stats.landScore || 0,
      time: G.time,
    };
    const acc = G.stats.shots ? Math.round(G.stats.hits / G.stats.shots * 100) : 0;
    document.getElementById('resTitle').textContent = win ? '任务完成' : '任务失败';
    document.getElementById('resTitle').style.color = win ? '#7dffb0' : '#ff5a52';
    document.getElementById('resSub').textContent = reason;
    document.getElementById('resBody').innerHTML =
      `<div class="row"><span>击落敌机</span><b>${G.stats.kills} 架</b></div>` +
      `<div class="row"><span>命中率</span><b>${acc}%</b></div>` +
      `<div class="row"><span>投弹</span><b>${G.stats.bombs} 枚</b></div>` +
      `<div class="row"><span>着舰评级</span><b>${win ? (G.stats.landScore || 0) + ' 分' : '—'}</b></div>` +
      `<div class="row"><span>飞行时间</span><b>${Math.floor(G.time / 60)} 分 ${Math.floor(G.time % 60)} 秒</b></div>`;
    document.getElementById('result').style.display = 'flex';
    document.getElementById('hudWrap').style.display = 'none';
  }

  /* ============================ 主循环 ============================ */
  let last = 0, ftAcc = 0, ftN = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    const now = ts / 1000;
    let dt = Math.min(0.05, now - last || 0.016);
    last = now;
    // 帧率自适应：掉帧就降渲染分辨率，回升再逐步恢复
    ftAcc += dt; ftN++;
    if (ftN >= 45) {
      const avg = ftAcc / ftN; ftAcc = 0; ftN = 0;
      if (avg > 0.026) GL.setRenderScale(GL.renderScale * 0.88);
      else if (avg < 0.0165) GL.setRenderScale(GL.renderScale * 1.06);
    }
    const playing = G.state === 'play';
    G.dt = dt;
    try {
    if (playing || G.state === 'over') {
      if (playing) G.time += dt;
      stepWorld(dt);
    } else {
      // 菜单/暂停：保持场景
      if (G.state === 'menu') { G.time += dt * 0.35; stepMenuScene(dt); }
      FX.update(dt);
      render();
      const ctx = document.getElementById('hud').getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    if (playing || G.state === 'over') {
      render();
      const h = document.getElementById('hud');
      const ctx = h.getContext('2d');
      const dpr = GL.dpr;                     // 与 3D 画布同步（含渲染缩放）
      if (h.width !== Math.round(GL.cssW * dpr) || h.height !== Math.round(GL.cssH * dpr)) {
        h.width = Math.round(GL.cssW * dpr); h.height = Math.round(GL.cssH * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      HUD.draw(ctx, G, GL.cssW, GL.cssH);
    }
    } catch (e) {
      if (!G._err) {
        G._err = (e && (e.stack || e.message)) || String(e);
        if (window.__errors) window.__errors.push('CAUGHT: ' + G._err);
        console.error(e);
      }
    }
  }

  function stepWorld(dt) {
    const p = G.player;
    // 舰船
    for (const s of G.ships) Ent.updateShip(s, dt, W);
    if (playingSafe()) {
      updatePlayer(dt);
      updateEnemies(dt);
      updateMission(dt);
      updateWarnings();
      G.stats.time = G.time;
    }
    // 导弹
    for (const m of G.missiles) if (m.alive) Ent.updateMissile(m, dt, W);
    for (let i = G.missiles.length - 1; i >= 0; i--) if (!G.missiles[i].alive) G.missiles.splice(i, 1);
    for (const b of G.bombs) if (b.alive) Ent.updateBomb(b, dt, W);
    for (let i = G.bombs.length - 1; i >= 0; i--) if (!G.bombs[i].alive) G.bombs.splice(i, 1);
    for (const f of G.flares) if (f.alive) Ent.updateFlare(f, dt);
    for (let i = G.flares.length - 1; i >= 0; i--) if (!G.flares[i].alive) G.flares.splice(i, 1);
    for (const t of G.tracers) Ent.updateTracer(t, dt);
    for (let i = G.tracers.length - 1; i >= 0; i--) if (G.tracers[i].life <= 0) G.tracers.splice(i, 1);
    // 曳光弹命中判定
    checkTracerHits();
    // 清理死亡敌机
    for (let i = G.enemies.length - 1; i >= 0; i--) if (!G.enemies[i].alive) G.enemies.splice(i, 1);
    if (G.lockTarget && !G.lockTarget.alive) { G.lockTarget = null; }
    // 特效与相机
    FX.update(dt);
    updateCamera(dt);
    G.damageFlash = Math.max(0, G.damageFlash - dt * 0.55);
    // 音频状态
    AudioSys.update(dt, {
      throttle: p.throttle, spd: p.spd, alt: p.pos.y, gload: p.gload,
      stall: p.stalled && p.alive, vs: p.vs, gear: p.gear, running: p.alive,
    });
    // 随机环境音
    if (Math.random() < dt * 0.12 && p.alive && p.pos.y > 3000) AudioSys.play('wave', { gain: 0.25 });
  }

  function playingSafe() { return G.state === 'play'; }

  function checkTracerHits() {
    for (const t of G.tracers) {
      if (t.life <= 0) continue;
      for (const e of G.enemies) {
        if (!e.alive) continue;
        if (segSphere(t.p0, t.p1, e.pos, 7)) {
          t.life = 0; damagePlane(e, 26, t); G.stats.hits++;
          FX.impact(e.pos, V3.normalize(V3.create(), V3.sub(V3.create(), e.pos, G.player.pos)));
          break;
        }
      }
      for (const s of G.ships) {
        if (!s.alive) continue;
        if (segSphere(t.p0, t.p1, V3.create(s.pos.x, s.deckY + 6, s.pos.z), s.beam * 0.6)) {
          t.life = 0; damageShip(s, 4); G.stats.hits++;
          FX.impact(t.p1, V3.create(0, 1, 0));
          break;
        }
      }
    }
  }

  function segSphere(a, b, c, r) {
    const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
    const acx = c.x - a.x, acy = c.y - a.y, acz = c.z - a.z;
    const ab2 = abx * abx + aby * aby + abz * abz;
    if (ab2 < 1e-9) return false;
    let t = (acx * abx + acy * aby + acz * abz) / ab2;
    t = clamp(t, 0, 1);
    const dx = a.x + abx * t - c.x, dy = a.y + aby * t - c.y, dz = a.z + abz * t - c.z;
    return dx * dx + dy * dy + dz * dz < r * r;
  }

  /* 菜单背景：航母巡航 */
  let menuScene = null;
  function stepMenuScene(dt) {
    if (!menuScene) {
      const c = Ent.makeShip('carrier', 0, 0, 0.6);
      c.route = [{ x: 4000, z: -40000 }, { x: -4000, z: -80000 }];
      const p = Ent.makePlane('player', 26, 190, 120, 0);
      Ent.orientFromFwdUp(p, V3.create(-0.2, -0.02, -1));
      p.vel.x = -20; p.vel.z = -220;
      menuScene = { c, p };
      G.carrier = c; G.ships.length = 0; G.ships.push(c);
      G.player = p;
      p.missiles = 6; p.bombs = 4; p.flares = 24; p.gear = false;
    }
    Ent.updateShip(menuScene.c, dt, W);
    const p = menuScene.p;
    p.spd = 220; p.vs = 0; p.alpha = 0; p.gload = 1; p.throttle = 0.8;
    V3.addScaled(p.pos, p.pos, p.vel, dt);
    updateAttitude(p);
    updatePlaneFX(p, dt);
    updateCamera(dt);
  }

  /* ============================ 启动 ============================ */
  window.addEventListener('DOMContentLoaded', () => {
    initInput();
    TouchUI.init();
    HUD.touch = TouchUI.enabled;
    const tb = document.getElementById('touchBtn');
    if (tb) tb.addEventListener('click', () => {
      const on = TouchUI.toggle();
      HUD.touch = on;
      tb.textContent = on ? '📱 触屏模式：开' : '📱 触屏模式';
    });
    const btn = document.getElementById('startBtn');
    if (btn) btn.addEventListener('click', startGame);
    const rb = document.getElementById('againBtn');
    if (rb) rb.addEventListener('click', startGame);
    const pb = document.getElementById('resumeBtn');
    if (pb) pb.addEventListener('click', togglePause);
    const qb = document.getElementById('quitBtn');
    if (qb) qb.addEventListener('click', () => {
      document.getElementById('pause').style.display = 'none';
      G.state = 'menu'; document.getElementById('menu').style.display = 'flex';
      document.getElementById('hudWrap').style.display = 'none';
    });
    boot();
  });

  global.G = G;
  G._render = render;
  G._start = startGame;
  G._log = log;
  G.keys = keys;
  void smoothstep; void lerp;
})(window);