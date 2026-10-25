/* Isolated visual rehearsal; this file never touches a saved game or combat authority. */
(() => {
  'use strict';
  const embedded = typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location?.search || '').get('embedded') === '1';
  if (embedded) document.documentElement.classList.add('embedded-dojo');
  const $ = id => document.getElementById(id), data = window.CHEON_NAMGUNG, FX = window.CheonNamgungEffects;
  const canvas = $('namgung-canvas'), world = document.createElement('canvas');
  let W = 1100, H = 680;
  world.width = W / 2; world.height = H / 2;
  const ctx = world.getContext('2d'), display = canvas.getContext('2d');
  const renderer = new window.CheonGameRenderer(document.createElement('canvas'), { width: W, height: H });
  const directions = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'], names = ['오른쪽', '오른쪽 아래', '아래', '왼쪽 아래', '왼쪽', '왼쪽 위', '위', '오른쪽 위'];
  const arrows = [['nw', '↖'], ['n', '↑'], ['ne', '↗'], ['w', '←'], ['e', '→'], ['sw', '↙'], ['s', '↓'], ['se', '↘']];
  const ranks = { sword: 1, formation: 1, dash: 1 }, minds = { sword: 0, formation: 0, dash: 0 }, keys = new Set(), cache = new Map();
  let sampleHeld = 0, resourceEvent = null;
  let path = 'sword', direction = 'e', walking = false, paused = false, detail = 'active', time = 0, last = 0, manual = { x: 0, y: 0 }, giant = null, giantMetrics = null, raf;
  const level = (list, rank) => Array.isArray(list) ? list.find(item => Number(item.rank) === rank) : list[rank];
  for (let rank = 1; rank <= 7; rank++) { const b = document.createElement('button'); b.textContent = rank; if (rank === 7) { const label = document.createElement('small'); label.textContent = '절세'; b.append(label); } b.dataset.rank = rank; b.setAttribute('aria-label', rank === 7 ? '절세무공 7단계' : `${rank}단계`); b.onclick = () => { ranks[path] = rank; detail = 'active'; reset(); }; $('rank-buttons').append(b); }
  for (let rank = 0; rank <= 6; rank++) { const b = document.createElement('button'); b.textContent = rank; if (rank === 0) { const label = document.createElement('small'); label.textContent = '없음'; b.append(label); } b.dataset.mind = rank; b.setAttribute('aria-label', rank === 0 ? '심법 없음' : `심법 ${rank}성`); b.onclick = () => { minds[path] = rank; detail = 'mind'; reset(); }; $('mind-buttons').append(b); }
  for (const [dir, arrow] of arrows) { const b = document.createElement(dir ? 'button' : 'span'); b.textContent = arrow; if (dir) { b.dataset.direction = dir; b.setAttribute('aria-label', names[directions.indexOf(dir)]); b.onclick = () => { direction = dir; reset(); }; } else b.className = 'pad-center'; $('direction-pad').append(b); }
  document.querySelectorAll('[data-path]').forEach(b => b.onclick = () => { path = b.dataset.path; detail = 'active'; reset(); });
  function capacity() { const m = minds[path]; return 1 + (path === 'formation' ? Number(m >= 1) + Number(m >= 3) : path === 'sword' ? Number(m >= 2) : 0); }
  $('qi-pickup').onclick = () => { if (minds[path] === 0 || sampleHeld >= capacity() || path === 'dash' && (minds[path] < 6 || ranks[path] < 4 || time < .95)) return; sampleHeld++; resourceEvent = { type: 'pickup', at: time, burst: path === 'formation' && minds[path] >= 6 }; update(); render(); };
  $('qi-hit').onclick = () => { if (sampleHeld <= 0) return; const m = minds[path]; sampleHeld = Math.max(0, sampleHeld - (path === 'formation' && m >= 4 || path === 'sword' && m >= 3 ? 2 : 1)); resourceEvent = { type: 'block', at: time, burst: path === 'formation' && m >= 5 }; update(); render(); };
  $('walking').onclick = () => { walking = !walking; reset(); };
  $('mind-focus').onclick = () => { detail = detail === 'mind' ? 'active' : 'mind'; update(); };
  $('pause').onclick = () => { paused = !paused; update(); };
  $('replay').onclick = () => reset();
  $('step').onclick = () => { paused = true; time = Math.min(7, time + 1 / 60); update(); render(); };
  $('timeline').oninput = e => { time = Number(e.target.value); paused = true; cache.clear(); update(); render(); };
  const mechanics = { sword: ['검 자체의 근접 찌르기 · 붓 검기 없음', '몸 중심 · 75° 부채꼴', '확장된 75° 검격', '부채꼴 + 직선 천뢰 한 줄기', '한 줄기에서 세 갈래로', '부채꼴 없이 · 가장 먼 적을 가르는 일검', '거대한 검격 → 검로를 따라 순차 낙뢰'], formation: ['작은 검 한 자루가 적 몸을 반복해서 찌르기', '서로 다른 적 · 최대 세 자루', '세 자루의 강화된 위력', '서로 다른 적 · 최대 여덟 자루', '적 뒤에서 앞으로 통과하는 베기 · 주변 피해', '적 수와 무관하게 고정 여덟 방향으로 왕복', '원거리 적 우선 · 손잡이까지 지면 관통'], dash: ['도주기 이동 · 무적 없음', '늘어난 경공 거리', '경공 경로에 감전 지대 3초', '감전 지대 + 가까운 적에게 큰 낙뢰', '더 넓은 감전 지대', '강화된 단일 일격', '경공과 하늘에서 떨어지는 큰 천뢰 · 무적 없음'] };
  function update() {
    const p = data.paths[path], rank = ranks[path], mind = data.minds[p.partnerId], m = minds[path], stage = level(p.levels, rank), ml = level(mind.levels, m);
    $('stage-title').textContent = p.name; $('stage-rank').textContent = `${rank === 7 ? '絶世' : rank === 6 ? '化境' : ['一', '二', '三', '四', '五'][rank - 1]} · ${stage.title}`;
    $('stage-mind').textContent = m ? `${mind.name} ${m}성` : '심법 없음 · 순수 초식';
    $('rank-caption').textContent = rank === 7 ? '절세무공' : `${rank}단계`;
    $('mind-name').textContent = mind.name; $('direction-caption').textContent = names[directions.indexOf(direction)];
    $('detail-type').textContent = detail === 'mind' ? `內功 · ${m}성` : rank === 7 ? '絶世 · 절세무공' : rank === 6 ? '化境 · 6단계' : `初式 · ${rank}단계`;
    $('form-name').textContent = detail === 'mind' ? `${mind.name} ${m === 0 ? '미습득' : m + '성'}` : stage.title;
    $('form-description').textContent = detail === 'mind' ? ml.description : stage.description;
    $('mind-focus').setAttribute('aria-pressed', String(detail === 'mind'));
    $('fusion-note').textContent = rank === 7 && m < 6 ? '연출 비교용 7단계 · 실제 조합 조건: 초식 6 + 심법 6' : '초식 6단계 + 짝 심법 6성에서 절세무공 완성';
    $('mechanic-note').textContent = mechanics[path][rank - 1] + (path === 'sword' && rank === 1 ? ' · 찌르기 전신 원화 보강 예정' : '');
    $('qi-pickup').disabled = path === 'dash' && (m < 6 || rank < 4);
    $('qi-count').textContent = `${sampleHeld} / ${capacity()}`; $('qi-demo').hidden = m === 0; $('qi-note').textContent = path === 'formation' ? '육합공 방어·획득 효과를 위한 자원 시연' : path === 'dash' ? '천뢰기 6성의 직접 명중으로 검기를 드랍' : '처치로 얻은 호신 검기를 가정한 시연';
    document.querySelectorAll('[data-path]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === path)));
    document.querySelectorAll('[data-rank]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.rank) === rank)));
    document.querySelectorAll('[data-mind]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.mind) === m)));
    document.querySelectorAll('[data-direction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.direction === direction)));
    $('walking').textContent = walking ? '걷기 끄기' : '걷기 켜기'; $('walking').setAttribute('aria-pressed', String(walking));
    $('pause').textContent = paused ? '계속 재생' : '일시정지'; $('pause').setAttribute('aria-pressed', String(paused)); $('pause').setAttribute('aria-label', paused ? '계속 재생' : '일시정지');
  }
  function reset() { time = 0; cache.clear(); resourceEvent = null; sampleHeld = path === 'sword' && minds[path] >= 1 ? 1 : 0; manual = { x: 0, y: 0 }; update(); render(); }
  function heroAt(t) {
    const a = directions.indexOf(direction) * Math.PI / 4;
    const dx = walking ? Math.sin(t * 1.55) * 37 : 0, dy = walking ? Math.cos(t * 1.55) * 17 - 17 : 0;
    let dash = 0;
    if (path === 'dash') { const age = t - .75; dash = age < 0 ? 0 : age < .24 ? age / .24 * 180 : 180; }
    return { x: W / 2 + dx + manual.x + Math.cos(a) * dash, y: H / 2 + dy + manual.y + Math.sin(a) * dash, faceX: Math.cos(a), faceY: Math.sin(a), dashRemaining: path === 'dash' && t > .75 && t < .99 ? .99 - t : 0 };
  }
  function targets() {
    const a = directions.indexOf(direction) * Math.PI / 4;
    return Array.from({ length: 10 }, (_, i) => { const theta = a + (i === 0 ? 0 : i / 9 * Math.PI * 2), radius = i === 0 ? 92 : 144 + i % 3 * 50; return { id: i + 1, x: W / 2 + Math.cos(theta) * radius, y: H / 2 - 38 + Math.sin(theta) * radius * .84, ranged: i === 3 || i === 7 }; });
  }
  function casts(t, enemies) {
    const interval = path === 'sword' ? 1 : 5, result = [], a = directions.indexOf(direction) * Math.PI / 4;
    for (let n = 0; n < 8; n++) {
      const at = .75 + n * interval; if (at > t || t - at > FX.castDuration(path, ranks[path])) continue;
      const key = `${path}:${n}`;
      if (!cache.has(key)) {
        const h = heroAt(at - .01), x = h.x, y = h.y - 38;
        const far = enemies.filter(e => Math.hypot(e.x - x, e.y - y) <= 335).sort((a, b) => Math.hypot(b.x - x, b.y - y) - Math.hypot(a.x - x, a.y - y))[0];
        const aim = path === 'sword' && ranks[path] >= 6 && far ? Math.atan2(far.y - y, far.x - x) : a;
        const cast = { path, rank: ranks[path], x, y, angle: aim, at, seed: n + 41, length: far ? Math.hypot(far.x - x, far.y - y) + 38 : 330 }; cast.targetIds = FX.allocateTargets(cast, enemies); cache.set(key, cast);
      }
      result.push(cache.get(key));
    }
    return result;
  }
  function background(t) {
    // Share Hwasan's actual ground art at the same two-screen-pixel native density.
    renderer.ctx = ctx; renderer.width = W; renderer.height = H;
    renderer.ox = W / 2; renderer.oy = H / 2; renderer.time = t;
    renderer.drawGround();
    ctx.save(); ctx.translate(renderer.ox, renderer.oy); renderer.drawLandmarks(false); ctx.restore();
    ctx.globalAlpha = 1;
  }
  function resize() {
    W = Math.max(1, Math.round(window.innerWidth || 1100));
    H = Math.max(1, Math.round(window.innerHeight || 680));
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    world.width = Math.ceil(W / 2); world.height = Math.ceil(H / 2);
    cache.clear(); render();
  }
  function drawGiant(c, x, y, angle, height, alpha, options = {}) {
    if (!giant || !giantMetrics) return;
    c.save();
    // Clip in battlefield coordinates before the blade rotates and sinks: even its
    // guard and hilt pass below the same ground line instead of fading in midair.
    if (Number.isFinite(options.groundY)) { c.beginPath(); c.rect(-100000, -100000, 200000, 100000 + options.groundY); c.clip(); }
    c.translate(Math.round(x / 2) * 2, Math.round(y / 2) * 2); c.rotate(angle); c.globalAlpha = alpha; c.imageSmoothingEnabled = false;
    // Its middle blade face, rather than the guard's bounding box, determines width.
    c.drawImage(giant, -giantMetrics.tip.x * 2, -giantMetrics.tip.y * 2, giant.width * 2, giant.height * 2); c.restore();
  }
  const image = new Image();
  image.onload = () => {
    const temp = document.createElement('canvas'); temp.width = image.naturalWidth; temp.height = image.naturalHeight; const c = temp.getContext('2d'); c.drawImage(image, 0, 0);
    const pixels = c.getImageData(0, 0, temp.width, temp.height).data; let x0 = temp.width, x1 = 0, y0 = temp.height, y1 = 0;
    for (let y = 0; y < temp.height; y++) for (let x = 0; x < temp.width; x++) if (pixels[(y * temp.width + x) * 4 + 3] > 127) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 <= x0 || y1 <= y0) return;
    const geometry = FX.giantSwordGeometry, sourceWidth = x1 - x0 + 1, sourceHeight = y1 - y0 + 1;
    const bladeRow = y0 + Math.round((sourceHeight - 1) * geometry.sourceBladeRow), bladeSpans = [];
    for (let y = bladeRow - 3; y <= bladeRow + 3; y++) {
      let left = x1, right = x0;
      for (let x = x0; x <= x1; x++) if (pixels[(y * temp.width + x) * 4 + 3] > 127) { left = Math.min(left, x); right = Math.max(right, x); }
      if (right >= left) bladeSpans.push(right - left + 1);
    }
    bladeSpans.sort((a, b) => a - b); const sourceBladeWidth = bladeSpans[Math.floor(bladeSpans.length / 2)] || sourceWidth;
    const worldWidth = geometry.bladeWidth / sourceBladeWidth * sourceWidth;
    giant = document.createElement('canvas'); giant.width = Math.round(worldWidth / geometry.pixelStep); giant.height = Math.round(geometry.height / geometry.pixelStep);
    const g = giant.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(image, x0, y0, sourceWidth, sourceHeight, 0, 0, giant.width, giant.height);
    const px = g.getImageData(0, 0, giant.width, giant.height);
    for (let i = 0; i < px.data.length; i += 4) px.data[i + 3] = px.data[i + 3] < 127 ? 0 : 255;
    g.putImageData(px, 0, 0);
    let bottom = giant.height - 1, tipXs = [];
    for (; bottom >= 0; bottom--) { for (let x = 0; x < giant.width; x++) if (px.data[(bottom * giant.width + x) * 4 + 3]) tipXs.push(x + .5); if (tipXs.length) break; }
    giantMetrics = { sourceBounds: { x: x0, y: y0, width: sourceWidth, height: sourceHeight }, sourceBladeRow: bladeRow, sourceBladeWidth,
      worldBladeWidth: sourceBladeWidth / sourceWidth * giant.width * 2, worldWidth: giant.width * 2, worldHeight: giant.height * 2,
      nativeWidth: giant.width, nativeHeight: giant.height, tip: { x: tipXs.reduce((a, b) => a + b, 0) / tipXs.length, y: bottom + 1 } };
    render();
  };
  image.src = 'assets/namgung/imperial-jian-v2.png';
  function drawFan(c, x, y, angle, radius, progress, alpha) {
    renderer.ctx = c;
    c.save(); c.translate(x, y);
    renderer.drawBodyFan(radius, angle, progress, alpha, FX.palette.body,
      [FX.palette.dark, FX.palette.body, FX.palette.light, FX.palette.ink]);
    c.restore();
  }
  function drawRibbon(c, x, y, angle, length, width, progress, alpha) {
    renderer.ctx = c;
    const reach = Math.max(1, Math.round(Math.max(0, Math.min(1, progress)) * 8)) / 8;
    const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
    c.save(); c.translate(x, y);
    renderer.drawPixelRibbon(Math.cos(angle) * length * reach / 2, Math.sin(angle) * length * reach / 2,
      angle, length, width, reach, .02, alpha, length + width * 2,
      [FX.palette.dark, FX.palette.light, FX.palette.white].map(rgb));
    c.restore();
  }
  function actorPose(hero, t, instances) {
    const latest = instances.filter(c => c.path === 'sword' && t - c.at < .58).at(-1), rank = 2;
    const nextAttack = t < .75 ? .75 : .75 + Math.floor(t - .75) + 1;
    const state = { player: hero, time: t, skills: { plum_sword: path === 'sword' ? rank : 0 }, effects: [], attackTimer: path === 'sword' ? nextAttack - t : 1 };
    const attack = latest ? { type: 'slash', rank, id: latest.seed, angle: latest.angle, age: t - latest.at, duration: .58 } : null;
    return { state, pose: window.CheonCombatAnimation.poseFor(state, t, { attack, moving: walking || keys.size > 0 || hero.dashRemaining > 0, walkDistance: t * 88, locomotionX: hero.faceX, locomotionY: hero.faceY }) };
  }
  function drawHero(hero, t, instances) {
    const { state, pose } = actorPose(hero, t, instances); renderer.ctx = ctx; renderer.state = state; renderer.time = t; renderer.reduced = false;
    ctx.save(); ctx.translate(hero.x, hero.y); ctx.fillStyle = '#102529'; ctx.beginPath(); ctx.ellipse(0, 4, 21, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    FX.drawQi(ctx, hero, t, sampleHeld, 'back');
    const gait = (walking || keys.size > 0) && pose.phase !== 'idle';
    if (gait) {
      const walk = window.CheonCombatAnimation.poseFor({ ...state, skills: { plum_sword: 0 }, attackTimer: 1 }, t, { attack: null, moving: true, walkDistance: t * 88, locomotionX: hero.faceX, locomotionY: hero.faceY });
      ctx.save(); ctx.beginPath(); ctx.rect(hero.x - 90, hero.y - 29, 180, 55); ctx.clip(); ctx.translate(hero.x, hero.y); renderer.drawHeroFrame(walk); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(hero.x - 110, hero.y - 145, 220, 116); ctx.clip(); ctx.translate(hero.x, hero.y); renderer.drawHeroFrame(pose); ctx.restore();
    } else { ctx.save(); ctx.translate(hero.x, hero.y); renderer.drawHeroFrame(pose); ctx.restore(); }
    if (!pose.bakedWeapon && renderer.heroFrameReady(pose)) renderer.drawHeldBlade(pose);
    FX.drawQi(ctx, hero, t, sampleHeld, 'front');
  }
  function drawTarget(target, t, instances) {
    const direct = path === 'sword' && instances.some(c => t - c.at > .1 && t - c.at < .32 && (ranks[path] >= 6 || Math.abs(Math.atan2(Math.sin(Math.atan2(target.y - c.y, target.x - c.x) - c.angle), Math.cos(Math.atan2(target.y - c.y, target.x - c.x) - c.angle))) < .7));
    const mark = minds[path] >= 5 && path === 'sword' && instances.some(c => t - c.at > .12 && Math.abs(Math.atan2(Math.sin(Math.atan2(target.y - c.y, target.x - c.x) - c.angle), Math.cos(Math.atan2(target.y - c.y, target.x - c.x) - c.angle))) < .65);
    renderer.state = { player: heroAt(t), skills: {} }; renderer.time = t; renderer.reduced = true;
    const enemy = { id: target.id, x: target.x, y: target.y + 32, type: target.ranged ? 'ranged' : 'melee', hp: 80, maxHp: 100, radius: 12, flashUntil: direct ? t + .02 : 0 };
    renderer.drawEnemy(enemy);
    if (mark) { ctx.save(); ctx.globalAlpha = .65; ctx.strokeStyle = FX.palette.light; ctx.lineWidth = 2; ctx.strokeRect(target.x - 14, target.y + 1, 28, 30); ctx.restore(); }
    if (target.ranged) { ctx.globalAlpha = 1; ctx.fillStyle = '#a1bdbb'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('遠', target.x, target.y - 10); }
    if (direct && minds[path] >= 6) FX.skyLightning(ctx, target.x, target.y + 32, (t - .75) % 1 - .1, target.id, 7, 120);
  }
  function render() {
    ctx.setTransform(.5, 0, 0, .5, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
    background(time); const hero = heroAt(time), enemies = targets(), instances = casts(time, enemies), visible = $('targets').checked;
    if ($('range').checked) { ctx.save(); ctx.strokeStyle = '#6b8585'; ctx.setLineDash([3, 10]); ctx.lineWidth = 2; ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(hero.x, hero.y - 38, path === 'sword' && ranks[path] === 2 ? 122 : 285, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    FX.field(ctx, instances.filter(c => c.rank >= 3), time);
    if (resourceEvent?.burst) { const age = time - resourceEvent.at; if (age >= 0 && age < .7) FX.ring(ctx, hero.x, hero.y + 3, 20 + age * 135, (1 - age / .7) * .8, 14, 10); }
    const effects = { targets: visible ? enemies : [], giant: giant ? drawGiant : null, fan: drawFan, ribbon: drawRibbon };
    for (const cast of instances) FX.draw(ctx, cast, time, { ...effects, layer: 'back' });
    if (visible) for (const target of enemies.slice().sort((a, b) => a.y - b.y)) drawTarget(target, time, instances);
    for (const cast of instances) FX.draw(ctx, cast, time, { ...effects, layer: 'front' });
    // Shared brush cuts cross every enemy, but never cover the player's sprite.
    for (const cast of instances) FX.draw(ctx, cast, time, { ...effects, layer: 'between' });
    drawHero(hero, time, instances);
    if (path === 'dash' && ranks[path] >= 4 && minds[path] >= 6 && time > .96 && time < 3.9 && sampleHeld === 0 && visible) {
      const end = { x: W / 2 + Math.cos(directions.indexOf(direction) * Math.PI / 4) * 180, y: H / 2 - 38 + Math.sin(directions.indexOf(direction) * Math.PI / 4) * 180 };
      const target = enemies.slice().sort((a, b) => Math.hypot(a.x - end.x, a.y - end.y) - Math.hypot(b.x - end.x, b.y - end.y))[0];
      FX.jian(ctx, target.x, target.y + 45 + Math.sin(time * 4) * 3, -.8, 45, .95);
    }
    ctx.save(); ctx.translate(renderer.ox, renderer.oy); renderer.drawLandmarks(true); ctx.restore();
    renderer.time = time; renderer.drawAtmosphere();
    ctx.globalAlpha = 1; display.imageSmoothingEnabled = false; display.clearRect(0, 0, canvas.width, canvas.height); display.drawImage(world, 0, 0, canvas.width, canvas.height);
    $('timeline').value = time; $('time-readout').textContent = `${time.toFixed(2)}초`;
  }
  function tick(stamp) { const dt = Math.min(.05, (stamp - (last || stamp)) / 1000); last = stamp; if (!paused && !document.hidden) { time += dt; if (time > 7) { time %= 7; cache.clear(); manual = { x: 0, y: 0 }; } const x = Number(keys.has('d')) - Number(keys.has('a')), y = Number(keys.has('s')) - Number(keys.has('w')); if (x || y) { const l = Math.hypot(x, y); manual.x = Math.max(-220, Math.min(330, manual.x + x / l * dt * 100)); manual.y = Math.max(-210, Math.min(170, manual.y + y / l * dt * 100)); direction = directions[(Math.round(Math.atan2(y, x) / (Math.PI / 4)) + 8) % 8]; } } render(); raf = requestAnimationFrame(tick); }
  window.addEventListener('keydown', e => { if (e.code === 'Escape' && embedded) { e.preventDefault(); e.stopImmediatePropagation(); window.parent.postMessage({ type: 'cheon-namgung-close' }, window.location.origin); return; } if (e.target.matches('input,a,select,textarea,summary')) return; const key = e.key.toLowerCase(); if ('wasd'.includes(key) && key.length === 1) { keys.add(key); e.preventDefault(); } if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) { paused = !paused; update(); } } if (/^[1-7]$/.test(key)) { e.preventDefault(); ranks[path] = Number(key); detail = 'active'; reset(); } if (key === 'p' && !e.repeat) { paused = !paused; update(); } });
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase())); window.addEventListener('blur', () => keys.clear());
  window.CHEON_NAMGUNG_PREVIEW = Object.freeze({
    set(options = {}) { if (options.path && data.paths[options.path]) path = options.path; if (options.rank != null) ranks[path] = Math.max(1, Math.min(7, options.rank)); if (options.mind != null) minds[path] = Math.max(0, Math.min(6, options.mind)); if (directions.includes(options.direction)) direction = options.direction; if (options.walking != null) walking = Boolean(options.walking); if (options.paused != null) paused = Boolean(options.paused); if (options.targets != null) $('targets').checked = Boolean(options.targets); if (options.detail) detail = options.detail; sampleHeld = path === 'sword' && minds[path] >= 1 ? 1 : 0; resourceEvent = null; time = options.time != null ? Math.max(0, Math.min(7, options.time)) : 0; cache.clear(); update(); render(); },
    seek(value) { time = Math.max(0, Math.min(7, value)); paused = true; cache.clear(); update(); render(); },
    getState() { return { path, rank: ranks[path], mind: minds[path], direction, walking, paused, time, giantLoaded: Boolean(giant), giantMetrics, sampleHeld, width: W, height: H, hero: heroAt(time), casts: casts(time, targets()) }; },
    render, drawGiant, canvas
  });
  window.addEventListener('resize', resize);
  update(); resize(); raf = requestAnimationFrame(tick); window.addEventListener('pagehide', () => { cancelAnimationFrame(raf); renderer.destroy(); });
})();



