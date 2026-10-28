/* Seekable 천마신교 rehearsal. Never reads or changes a combat run or save. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), data = window.CHEON_HEAVENLY_DEMON, FX = window.CheonHeavenlyDemonEffects;
  const embedded = new URLSearchParams(window.location.search).get('embedded') === '1';
  if (embedded) document.documentElement.classList.add('embedded-dojo');
  const canvas = $('heavenly-demon-canvas'), world = document.createElement('canvas');
  const ctx = world.getContext('2d'), display = canvas.getContext('2d');
  let W = 1100, H = 680, time = 0, paused = false, walking = false, path = 'sword', direction = 'e', detail = 'active', last = 0, raf = 0;
  const ranks = { sword: 1, ring: 1, dash: 1 }, minds = { sword: 0, ring: 0, dash: 0 }, keys = new Set();
  let initialQi = 0, qiCapacity = 0, events = [], serial = 0, manual = { x: 0, y: 0 }, sceneYRatio = .45;
  const directions = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'];
  const directionNames = ['오른쪽', '오른쪽 아래', '아래', '왼쪽 아래', '왼쪽', '왼쪽 위', '위', '오른쪽 위'];
  const arrows = [['nw', '↖'], ['n', '↑'], ['ne', '↗'], ['w', '←'], [null, '·'], ['e', '→'], ['sw', '↙'], ['s', '↓'], ['se', '↘']];
  let appearanceProvider;
  if (embedded) {
    try { if (window.parent !== window && window.parent.location.origin === window.location.origin && window.parent.CheonHub) appearanceProvider = () => window.parent.CheonHub.getCurrentAppearance?.() || window.parent.CheonHub.appearance; }
    catch { /* Foreign pages cannot supply an appearance. */ }
  }
  const renderer = new window.CheonGameRenderer(canvas, { appearanceProvider });
  const ghost = document.createElement('canvas'); ghost.width = 240; ghost.height = 280;
  const ghostContext = ghost.getContext('2d');
  const stage = (list, rank) => list.find(item => Number(item.rank) === rank);
  const angle = () => directions.indexOf(direction) * Math.PI / 4;
  const compact = () => window.innerWidth <= 700;
  function sceneCenter() { return { x: W / 2, y: H * sceneYRatio }; }
  function originAt(t) {
    const center = sceneCenter(), distance = path === 'dash' ? (ranks.dash >= 2 ? 170 : 110) + (minds.dash >= 2 ? 45 : 0) : 0;
    return { x: center.x - Math.cos(angle()) * distance / 2 + manual.x + (walking ? Math.sin(t * 1.4) * 32 : 0), y: center.y - Math.sin(angle()) * distance / 2 + manual.y + (walking ? Math.cos(t * 1.4) * 15 : 0) };
  }
  function targets() {
    const center = sceneCenter(), a = angle(); center.y -= 30;
    return Array.from({ length: 10 }, (_, i) => { const theta = i < 3 ? a + (i - 1) * .15 : a + i / 7 * Math.PI * 2, r = i < 3 ? 125 + i * 35 : 175 + i % 3 * 28; return { id: i + 1, x: center.x + Math.cos(theta) * r, y: center.y + Math.sin(theta) * r * .68, ranged: i === 6 || i === 9 }; });
  }
  function scene() {
    const enemies = $('targets').checked ? targets() : [], currentEvents = [...events];
    const origin = originAt(time), range = Math.hypot(W, H) * .8;
    const waveRadius = Math.max(origin.x, W - origin.x, origin.y, H - origin.y) * .94;
    return FX.frame({ path, rank: ranks[path], mind: minds[path], time, angle: angle(), origin, targets: enemies, heldQi: initialQi, qiCapacity, events: currentEvents, range, waveRadius });
  }
  function reset() { time = 0; events = []; serial = 0; manual = { x: 0, y: 0 }; initialQi = minds[path] > 0 || path === 'dash' && ranks[path] === 7 ? 1 : 0; update(); render(); }
  for (let rank = 1; rank <= 7; rank++) { const b = document.createElement('button'); b.type = 'button'; b.textContent = rank; b.dataset.rank = rank; b.setAttribute('aria-label', rank === 7 ? '절세무공 7단계' : `${rank}단계`); if (rank === 7) { const s = document.createElement('small'); s.textContent = '절세'; b.append(s); } b.onclick = () => { ranks[path] = rank; detail = 'active'; reset(); }; $('rank-buttons').append(b); }
  for (let mind = 0; mind <= 6; mind++) { const b = document.createElement('button'); b.type = 'button'; b.textContent = mind; b.dataset.mind = mind; b.setAttribute('aria-label', mind ? `짝 무공 ${mind}성` : '짝 무공 없음'); if (!mind) { const s = document.createElement('small'); s.textContent = '없음'; b.append(s); } b.onclick = () => { minds[path] = mind; detail = 'mind'; reset(); }; $('mind-buttons').append(b); }
  for (const [dir, arrow] of arrows) { const b = document.createElement(dir ? 'button' : 'span'); b.textContent = arrow; if (dir) { b.type = 'button'; b.dataset.direction = dir; b.setAttribute('aria-label', directionNames[directions.indexOf(dir)]); b.onclick = () => { direction = dir; reset(); }; } else b.className = 'pad-center'; $('direction-pad').append(b); }
  document.querySelectorAll('[data-path]').forEach(b => b.onclick = () => { path = b.dataset.path; detail = 'active'; reset(); });
  $('pause').onclick = () => { paused = !paused; update(); };
  $('walking').onclick = () => { walking = !walking; reset(); };
  $('replay').onclick = reset;
  $('step').onclick = () => { paused = true; time = Math.min(7, time + 1 / 60); update(); render(); };
  $('timeline').oninput = e => { paused = true; time = FX.clamp(e.target.value, 0, 7); update(); render(); };
  $('mind-focus').onclick = () => { detail = detail === 'mind' ? 'active' : 'mind'; update(); };
  function action(type) {
    const f = scene(), target = targets()[0], base = { at: time, targetId: target.id, x: target.x, y: target.y + 30, serial: serial++ };
    if (type === 'pickup') events.push({ ...base, type, blocked: Boolean($('qi-lock')?.checked) });
    if (type === 'block') events.push({ ...base, type, x: f.hero.x, y: f.hero.y });
    if (type === 'clear') events.push({ ...base, type });
    if (type === 'mark') events.push({ ...base, type: 'direct-hit', source: 'sword' });
    if (type === 'kill' || type === 'mark-kill') {
      if (type === 'mark-kill') events.push({ ...base, type: 'direct-hit', source: 'sword' });
      events.push({ ...base, type: 'kill', source: path === 'ring' ? 'ring' : 'sword' });
    }
    update(); render();
  }
  const actions = { 'qi-pickup': 'pickup', 'qi-hit': 'block', 'qi-clear': 'clear', 'qi-mark': 'mark', 'qi-kill': 'kill', 'qi-mark-kill': 'mark-kill' };
  for (const [id, type] of Object.entries(actions)) if ($(id)) $(id).onclick = () => action(type);
  if ($('qi-lock')) $('qi-lock').onchange = update;
  if ($('qi-capacity')) $('qi-capacity').onchange = e => { qiCapacity = FX.clamp(Number(e.target.value), 0, 3); reset(); };
  function update() {
    const p = data.paths[path], rank = ranks[path], mind = data.minds[p.partnerId], m = minds[path], selected = stage(detail === 'mind' ? mind.levels : p.levels, detail === 'mind' ? m : rank), f = scene();
    $('stage-title').textContent = rank === 7 ? p.evolutionName : p.name;
    $('stage-rank').textContent = rank === 7 ? '절세무공' : `${rank}단계`;
    $('stage-mind').textContent = m ? `${mind.name} ${m}성` : '짝 무공 없음';
    $('rank-caption').textContent = rank === 7 ? '절세무공' : `${rank}단계`;
    $('direction-caption').textContent = directionNames[directions.indexOf(direction)];
    $('mind-name').textContent = mind.name;
    $('detail-type').textContent = detail === 'mind' ? `內功 · ${m}성` : rank === 7 ? '絶世 · 절세무공' : `初式 · ${rank}단계`;
    $('form-name').textContent = detail === 'mind' ? `${mind.name} ${m ? m + '성' : '미습득'}` : selected.title;
    $('form-description').textContent = selected.description;
    $('mind-focus').setAttribute('aria-pressed', String(detail === 'mind'));
    $('fusion-note').textContent = rank === 7 && m < 6 ? '연출 비교용 7단계 · 실제 조합 조건: 초식 6단계 + 짝 무공 6성' : `초식 6단계 + ${mind.name} 6성에서 ${p.evolutionName} 완성`;
    const swordNotes = ['', '근접 횡베기', '초승달 검기 한 발', '부채꼴 세 방향 초승달', '보름달처럼 한 바퀴 베기 · 3초 흑염', '사방으로 자라는 초승달 네 개 · 이동 경로 흑염', '십자 네 발 → 대각선 네 발 · 이동 경로 흑염', '십자 → 대각선 초승달 발사 → 몸 쪽으로 회수'];
    $('mechanic-note').textContent = path === 'sword' ? swordNotes[rank] : path === 'dash' && rank === 7 ? `마기 전량 소모 · 1초 회피 수치 +30 · 무적·경직 없음${f.qi.evasionRating ? ' · 회피 강화 중' : ''}` : path === 'ring' && rank === 7 ? '작은 멸륜 합체·확대 → 발밑 폭발 → 화면 가장자리 파문 · 3초 흑염' : '전투 수치가 없는 연출 비교 · 공격 계수와 강화 증가량 미확정';
    $('qi-demo').hidden = m === 0 && rank !== 7;
    $('qi-count').textContent = `${f.qi.held} / ${f.qi.capacity}`;
    if ($('qi-capacity')) $('qi-capacity').value = qiCapacity;
    $('qi-note').textContent = `시연용 마기 · 보유 한계에서 획득하면 증가·추가 고리가 발생하지 않습니다.${path === 'ring' && m >= 6 ? ' 실제 증가 시에만 고리 +1, 2초.' : ''}${path === 'sword' && m >= 5 ? ' 직접 명중 → 마인 처치로 폭발; 6성은 흡정.' : ''}${path === 'dash' && rank === 7 ? ' 비우기 후 재생하면 마기 부족 시 강림이 발동하지 않습니다.' : ''}`;
    if ($('qi-mark')) $('qi-mark').disabled = !(path === 'sword' && m >= 5);
    if ($('qi-mark-kill')) $('qi-mark-kill').disabled = !(path === 'sword' && m >= 5);
    $('qi-hit').disabled = f.qi.held === 0;
    document.querySelectorAll('[data-path]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === path)));
    document.querySelectorAll('[data-rank]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.rank) === rank)));
    document.querySelectorAll('[data-mind]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.mind) === m)));
    document.querySelectorAll('[data-direction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.direction === direction)));
    $('walking').textContent = walking ? '걷기 끄기' : '걷기 켜기'; $('walking').setAttribute('aria-pressed', String(walking));
    $('pause').textContent = paused ? '계속 재생' : '일시정지'; $('pause').setAttribute('aria-pressed', String(paused));
  }
  function pose(hero, t, attack = true) {
    const interval = FX.timing.swordInterval, age = t >= .75 ? (t - .75) % interval : -1, isAttack = attack && path === 'sword' && age >= 0 && age < .58;
    const state = { player: hero, time: t, skills: { plum_sword: path === 'sword' ? 2 : 0 }, effects: [], attackTimer: path === 'sword' ? t < .75 ? .75 - t : interval - (t - .75) % interval : 1 };
    return { state, pose: window.CheonCombatAnimation.poseFor(state, t, { attack: isAttack ? { type: 'slash', action: 'sweep', rank: 2, id: Math.floor(t), angle: angle(), age, duration: .58 } : null, action: 'sweep', moving: walking || keys.size > 0 || hero.dashRemaining > 0, walkDistance: t * 88, locomotionX: hero.faceX, locomotionY: hero.faceY }) };
  }
  function drawHero(f) {
    const p = pose(f.hero, time); renderer.ctx = ctx; renderer.state = p.state; renderer.time = time; renderer.reduced = false;
    renderer.frameMoving = walking || keys.size > 0 || f.hero.dashRemaining > 0; renderer.walkPhase = time * 8;
    FX.drawQi(ctx, f.hero, time, f.qi.held, 'back');
    ctx.save(); ctx.translate(f.hero.x, f.hero.y); renderer.drawHeroFrame(p.pose); ctx.restore();
    if (!renderer.appearanceProvider && !p.pose.bakedWeapon && renderer.heroFrameReady(p.pose)) renderer.drawHeldBlade(p.pose);
    FX.drawQi(ctx, f.hero, time, f.qi.held, 'front');
  }
  function drawSilhouette(s) {
    const hero = { x: s.x, y: s.y, faceX: Math.cos(angle()), faceY: Math.sin(angle()), dashRemaining: .1 }, p = pose(hero, s.at, false);
    ghostContext.setTransform(1, 0, 0, 1, 0, 0); ghostContext.clearRect(0, 0, ghost.width, ghost.height);
    ghostContext.save(); ghostContext.translate(120, 230); renderer.ctx = ghostContext; renderer.state = p.state; renderer.time = s.at; renderer.drawHeroFrame(p.pose); ghostContext.restore();
    ghostContext.globalCompositeOperation = 'source-in'; ghostContext.fillStyle = FX.palette.body; ghostContext.fillRect(0, 0, ghost.width, ghost.height); ghostContext.globalCompositeOperation = 'source-over';
    renderer.ctx = ctx; ctx.save(); ctx.globalAlpha = s.alpha; ctx.imageSmoothingEnabled = false; ctx.drawImage(ghost, s.x - 120 * s.scale, s.y - 230 * s.scale, ghost.width * s.scale, ghost.height * s.scale); ctx.restore();
  }
  function render() {
    if (!world.width) return;
    const f = scene();
    ctx.setTransform(.5, 0, 0, .5, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
    renderer.ctx = ctx; renderer.width = W; renderer.height = H; renderer.ox = W / 2; renderer.oy = H / 2; renderer.time = time;
    renderer.drawGround(); ctx.save(); ctx.translate(renderer.ox, renderer.oy); renderer.drawLandmarks(false); ctx.restore();
    if ($('range').checked) { ctx.save(); ctx.strokeStyle = '#877a88'; ctx.globalAlpha = .35; ctx.setLineDash([2, 12]); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(f.hero.x, f.hero.y, 195, 120, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    FX.draw(ctx, f, { layer: 'back', drawSilhouette });
    renderer.ctx = ctx; renderer.state = { player: f.hero, skills: {} }; renderer.time = time; renderer.reduced = true;
    if ($('targets').checked) for (const enemy of targets().sort((a, b) => a.y - b.y)) {
      const offset = f.targetOffsets.find(o => o.id === enemy.id) || { x: 0, y: 0 };
      const killed = events.filter(e => e.type === 'kill' && e.targetId === enemy.id && e.at <= time).at(-1);
      if (killed && time - killed.at < .7) continue;
      const flash = f.hitAccents.some(h => h.id === enemy.id) || f.directHits.some(hit => hit.targetId === enemy.id && time - hit.at < .12);
      renderer.drawEnemy({ ...enemy, x: enemy.x + offset.x, y: enemy.y + 32 + offset.y, type: enemy.ranged ? 'ranged' : 'melee', hp: 100, maxHp: 100, radius: 12, flashUntil: flash ? time + .02 : 0 });
    }
    FX.draw(ctx, f, { layer: 'front' });
    drawHero(f);
    ctx.save(); ctx.translate(renderer.ox, renderer.oy); renderer.drawLandmarks(true); ctx.restore(); renderer.drawAtmosphere();
    display.imageSmoothingEnabled = false; display.clearRect(0, 0, canvas.width, canvas.height); display.drawImage(world, 0, 0, canvas.width, canvas.height);
    $('timeline').value = time; $('time-readout').textContent = `${time.toFixed(2)}초`; $('qi-count').textContent = `${f.qi.held} / ${f.qi.capacity}`; $('qi-hit').disabled = !f.qi.held;
  }
  function resize() {
    const width = Math.max(1, window.innerWidth || 1100), height = Math.max(1, window.innerHeight || 680);
    const short = height <= 560;
    const stageHeight = Math.max(1, (document.querySelector('.dojo-controls')?.getBoundingClientRect().top || height * .45) - 12);
    const scale = short ? Math.min(1, width / 760, stageHeight / 600) : compact() ? Math.min(1, width / 760) : 1;
    sceneYRatio = short ? stageHeight * .6 / height : compact() ? .38 : .45;
    // Fit the same logical choreography into portrait screens without changing its distances or timing.
    W = width / scale; H = height / scale;
    renderer.resize(width, height);
    world.width = Math.ceil(W / 2); world.height = Math.ceil(H / 2);
    render();
  }
  function tick(stamp) {
    const dt = Math.min(.05, Math.max(0, (stamp - (last || stamp)) / 1000)); last = stamp;
    if (!paused && !document.hidden) {
      time += dt;
      if (time > 7) { time %= 7; events = []; manual = { x: 0, y: 0 }; }
      const x = Number(keys.has('d')) - Number(keys.has('a')), y = Number(keys.has('s')) - Number(keys.has('w'));
      if (x || y) { const l = Math.hypot(x, y); manual.x = FX.clamp(manual.x + x / l * dt * 100, -W * .3, W * .3); manual.y = FX.clamp(manual.y + y / l * dt * 100, -H * .25, H * .2); direction = directions[(Math.round(Math.atan2(y, x) / (Math.PI / 4)) + 8) % 8]; }
    }
    render(); raf = requestAnimationFrame(tick);
  }
  window.addEventListener('keydown', e => {
    if (e.code === 'Escape') { if (embedded) { e.preventDefault(); e.stopImmediatePropagation(); window.parent.postMessage({ type: 'cheon-heavenly-demon-close' }, window.location.origin); } else window.location.href = 'index.html'; return; }
    if (e.target.matches('input,a,select,textarea,summary')) return;
    const key = e.key.toLowerCase(); if ('wasd'.includes(key) && key.length === 1) { keys.add(key); e.preventDefault(); }
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) { paused = !paused; update(); } }
    if (/^[1-7]$/.test(key)) { e.preventDefault(); ranks[path] = Number(key); detail = 'active'; reset(); }
  });
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase())); window.addEventListener('blur', () => keys.clear());
  window.CHEON_HEAVENLY_DEMON_PREVIEW = Object.freeze({
    set(options = {}) {
      if (options.path && data.paths[options.path]) path = options.path;
      if (options.rank != null) ranks[path] = FX.clamp(Math.round(options.rank), 1, 7);
      if (options.mind != null) minds[path] = FX.clamp(Math.round(options.mind), 0, 6);
      if (directions.includes(options.direction)) direction = options.direction;
      if (options.walking != null) walking = Boolean(options.walking);
      if (options.paused != null) paused = Boolean(options.paused);
      if (options.targets != null) $('targets').checked = Boolean(options.targets);
      if (options.detail) detail = options.detail;
      if (options.qiCapacity != null) qiCapacity = FX.clamp(Math.round(options.qiCapacity), 0, 3);
      initialQi = options.heldQi == null ? minds[path] > 0 || path === 'dash' && ranks[path] === 7 ? 1 : 0 : FX.clamp(options.heldQi, 0, qiCapacity || FX.capacity(path, minds[path]));
      events = Array.isArray(options.events) ? options.events.map(e => ({ ...e })) : [];
      manual = { x: 0, y: 0 }; time = FX.clamp(options.time || 0, 0, 7); update(); render();
    },
    seek(value) { time = FX.clamp(value, 0, 7); paused = true; update(); render(); },
    getState() { return { path, rank: ranks[path], mind: minds[path], direction, walking, paused, time, initialQi, qiCapacity, sampleHeld: scene().qi.held, width: W, height: H, hero: scene().hero, frame: scene(), events: events.map(e => ({ ...e })) }; },
    render, action, canvas
  });
  window.addEventListener('resize', resize); update(); resize(); raf = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(raf); renderer.destroy(); });
})();
