/* A separate, visible rehearsal run. Combat and presentation use the actual game modules. */
(() => {
  'use strict';
  const core = window.CheonGameCore;
  const screen = document.getElementById('dojo-screen');
  const canvas = document.getElementById('dojo-canvas');
  const $ = id => document.getElementById(id);
  const paths = {
    sword: { active: 'plum_sword', partner: 'zixia', title: '매화만리향', summary: '손끝에서 이어지는 검로. 화경의 개화와 절세신공의 한 번에 압축된 매화 베기를 비교하세요.' },
    rain: { active: 'plum_rain', partner: 'liuhe', title: '매향침골', summary: '가까운 서로 다른 적에게 최대 수량만큼 외날 도를 내립니다. 절세신공은 표적마다 도 또는 꽃잎 하나를 무작위로 내리며, 도는 남아 있는 원거리 적을 먼저 노립니다.' },
    dash: { active: 'dark_fragrance', partner: 'five_elements', title: '매인설한', summary: '암향표와 오행매화보는 같은 도주기를 강화합니다. 한 번 이동하고 같은 착지 지점에서 하나의 먹빛 파문을 펼칩니다. 절세신공은 꽃잎을 모두 소모해 0.3초 무적을 얻습니다.' }
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, run, active = false, paused = false, walking = false;
  let school = 'hwasan', namgungFrame = null;
  let category = 'sword', rank = 1, frame = 0, lastFrame = 0, nextDash = .65;
  const partnerRanks = { sword: 0, rain: 0, dash: 0 };
  let detailSource = 'active';
  const directions = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'];
  const directionNames = { e: '오른쪽', se: '오른쪽 아래', s: '아래', sw: '왼쪽 아래', w: '왼쪽', nw: '왼쪽 위', n: '위', ne: '오른쪽 위' };
  let direction = 'e';

  function resize() {
    if (!renderer || !active || school !== 'hwasan') return;
    renderer.resize(screen.clientWidth, screen.clientHeight);
    if (run) { run.width = screen.clientWidth; run.height = screen.clientHeight; }
  }

  function reset() {
    run = core.createRun({ seed: 240624, mode: 'showcase', width: screen.clientWidth, height: screen.clientHeight });
    for (const id of core.skillIds) run.skills[id] = 0;
    const path = paths[category];
    run.skills[path.active] = rank;
    run.skills[path.partner] = partnerRanks[category];
    // Rehearsal targets never fight, die, or advance the player's real run.
    run.spawnTimer = Infinity;
    run.bossSpawned = true;
    run.nextXp = Infinity;
    // Targets are inert and HP is restored below. Only the real fused dash
    // should enable the renderer's invulnerability glow.
    run.player.invulnerableUntil = 0;
    run.player.petals = partnerRanks[category] > 0 ? core.getStats(run).maxPetals : 0;
    run.player.x = category === 'dash' ? -95 : 0;
    const aimAngle = directions.indexOf(direction) * Math.PI / 4;
    run.player.faceX = Math.cos(aimAngle);
    run.player.faceY = Math.sin(aimAngle);
    run.camera.x = run.player.x;
    run.attackTimer = .35;
    run.rainTimer = .7;
    nextDash = .65;
    const count = category === 'rain' ? 12 : 8;
    for (let i = 0; i < count; i++) {
      const e = core.spawnEnemy(run, i % 4 === 0 ? 'ranged' : 'melee');
      const angle = i / count * Math.PI * 2 + aimAngle;
      // One closest target gives the core a genuine, exact eight-direction aim.
      // Other targets remain further away for testing circular coverage.
      const radius = category === 'rain' ? 125 + (i % 3) * 48 : category === 'dash' ? 125 : i === 0 ? 45 : i % 2 ? 120 : 175;
      if (category === 'sword') {
        const playerCenter = core.getCombatCenter(run.player);
        const enemyOffset = e.y - core.getCombatCenter(e).y;
        e.x = playerCenter.x + Math.cos(angle) * radius;
        e.y = playerCenter.y + Math.sin(angle) * radius + enemyOffset;
      } else {
        e.x = Math.cos(angle) * radius;
        e.y = Math.sin(angle) * radius;
      }
      e.hp = e.maxHp = 1000000;
      e.stunnedUntil = Infinity;
      e.attackTimer = Infinity;
    }
    core.syncAttachments(run);
    lastFrame = performance.now();
    updateControls();
  }

  function updateControls() {
    const path = paths[category];
    const skill = window.CHEONJONG_DATA.schools.hwasan.skills.find(item => item.id === path.active);
    const stage = skill.levels.find(item => Number(item.rank) === rank);
    const partner = window.CHEONJONG_DATA.schools.hwasan.skills.find(item => item.id === path.partner);
    if (detailSource === 'partner') {
      const level = partnerRanks[category];
      const partnerStage = partner.levels.find(item => Number(item.rank) === level);
      $('dojo-rank-tag').textContent = level === 0 ? '짝 무공 · 0성' : `${partner.type} · ${level}성`;
      $('dojo-form-name').textContent = level === 0 ? `${partner.name} 없음` : `${partner.name} · ${level}성`;
      $('dojo-description').textContent = level === 0
        ? `${partner.name}을 적용하지 않은 상태입니다. 이 심법·보법의 추가 효과 없이 주 무공을 재생합니다.`
        : partnerStage.description;
    } else {
      $('dojo-rank-tag').textContent = rank === 7 ? '絶世 · 절세신공' : rank === 6 ? '化境 · 6단계' : `初式 · ${rank}단계`;
      $('dojo-form-name').textContent = rank === 7 ? path.title : (stage?.title || skill.name);
      $('dojo-description').textContent = `${stage?.description || path.summary} ${walking ? '걷는 동작과 함께 비교 중입니다.' : ''}`;
    }
    screen.querySelectorAll('[data-dojo-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dojoCategory === category)));
    screen.querySelectorAll('[data-dojo-rank]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.dojoRank) === rank)));
    $('dojo-partner-label').textContent = partner.name;
    $('dojo-partner-levels').setAttribute('aria-label', `${partner.name} 단계 선택`);
    screen.querySelectorAll('[data-dojo-partner]').forEach(button => {
      const level = Number(button.dataset.dojoPartner);
      button.setAttribute('aria-pressed', String(level === partnerRanks[category]));
      button.setAttribute('aria-label', `${partner.name} ${level === 0 ? '없음, 0성' : level + '성'}`);
    });
    screen.querySelectorAll('[data-dojo-direction]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dojoDirection === direction)));
    $('dojo-pause').setAttribute('aria-pressed', String(paused));
    $('dojo-pause').textContent = paused ? '계속 재생' : '일시정지';
    $('dojo-walk').setAttribute('aria-pressed', String(walking));
    $('dojo-walk').textContent = walking ? '걷기 끄기' : '걷기 켜기';
    $('dojo-live').textContent = `${skill.name} ${rank === 7 ? '절세신공' : rank + '단계'}, ${partner.name} ${partnerRanks[category] === 0 ? '없음' : partnerRanks[category] + '성'}, ${directionNames[direction]}${paused ? ', 일시정지' : ', 반복 재생'}`;
    $('dojo-time').textContent = `${run.time.toFixed(2)}초`;
  }

  function advance(dt) {
      if (run.time > 14) reset();
      const t = run.time;
      // Use a normal walking pace; a short orbit keeps the rehearsal in view.
      const input = walking ? { moveX: Math.cos(t * 2.8), moveY: Math.sin(t * 2.8) * .72 } : { moveX: 0, moveY: 0 };
      if (category === 'dash' && run.time >= nextDash) {
        // Alternating directions keep the actual dash inside the rehearsal space.
        input.moveX = run.player.x < 0 ? 1 : -1;
        input.moveY = 0;
        input.dash = true;
        if (rank === 7 && partnerRanks[category] > 0 && run.player.petals === 0 && run.time >= run.player.pickupLockedUntil) run.player.petals = core.getStats(run).maxPetals;
        nextDash = run.time + core.getStats(run).dashCooldown + .15;
      }
      const previousX = run.player.x, previousY = run.player.y;
      core.step(run, dt, input);
      if (category === 'sword' && walking) {
        // Keep the selected rehearsal direction while the whole-body gait moves.
        const dx = run.player.x - previousX, dy = run.player.y - previousY;
        for (const e of run.enemies) { e.x += dx; e.y += dy; }
      }
      for (const e of run.enemies) { e.hp = e.maxHp; e.stunnedUntil = Infinity; }
      run.player.hp = run.player.maxHp;
  }

  function animate(now) {
    if (!active || school !== 'hwasan' || !renderer) return;
    const dt = Math.min(.04, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (!paused && !document.hidden) advance(dt);
    $('dojo-time').textContent = `${run.time.toFixed(2)}초`;
    renderer.draw(run, { paused, reducedMotion: reducedMotion.matches });
    frame = requestAnimationFrame(animate);
  }

  function stopHwasan() {
    cancelAnimationFrame(frame);
    frame = 0;
    renderer?.destroy();
    renderer = null;
  }

  function removeNamgung() {
    if (namgungFrame) {
      namgungFrame.onload = null;
      namgungFrame.onerror = null;
      namgungFrame.remove();
      namgungFrame = null;
    }
    $('dojo-namgung-host').hidden = true;
    $('dojo-namgung-error').hidden = true;
  }

  function setSchool(next) {
    if (!['hwasan', 'namgung'].includes(next)) return;
    if (!active) { open(); if (next === 'hwasan') return; }
    if (next === school && (school === 'namgung' ? namgungFrame : renderer)) {
      if (school === 'namgung') namgungFrame.contentWindow?.focus?.();
      return;
    }
    stopHwasan();
    removeNamgung();
    school = next;
    screen.dataset.school = school;
    $('dojo-school-caption').textContent = school === 'namgung' ? '演武場 · 南宮' : '演武場 · 華山';
    $('dojo-pause').hidden = school === 'namgung';
    screen.querySelectorAll('[data-dojo-school]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dojoSchool === school)));
    if (school === 'namgung') {
      const host = $('dojo-namgung-host');
      host.hidden = false;
      const child = document.createElement('iframe');
      child.className = 'dojo-namgung-frame';
      child.title = '남궁세가 동작 비교 · 초식과 심법 단계 선택';
      child.setAttribute('allow', 'fullscreen');
      child.onload = () => {
        if (child !== namgungFrame) return;
        try {
          $('dojo-namgung-error').hidden = Boolean(child.contentWindow?.CHEON_NAMGUNG_PREVIEW);
          if ($('dojo-namgung-error').hidden) child.contentWindow?.focus?.();
        }
        catch { $('dojo-namgung-error').hidden = false; }
      };
      child.onerror = () => { if (child === namgungFrame) $('dojo-namgung-error').hidden = false; };
      child.src = screen.dataset.namgungSrc;
      namgungFrame = child;
      host.append(child);
    } else {
      renderer = new window.CheonGameRenderer(canvas);
      resize();
      if (!run) reset();
      else updateControls();
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }

  function open() {
    if (active) return;
    window.MartialPreview?.destroy();
    $('title-screen').hidden = true;
    $('martial-screen').hidden = true;
    screen.hidden = false;
    document.body.classList.add('in-dojo');
    active = true;
    paused = false;
    school = 'hwasan';
    run = null;
    setSchool('hwasan');
    $('dojo-back').focus();
  }

  function close() {
    active = false;
    stopHwasan();
    removeNamgung();
    run = null;
    screen.hidden = true;
    document.body.classList.remove('in-dojo');
    $('title-screen').hidden = false;
    $('open-dojo').focus();
  }

  $('open-dojo').addEventListener('click', open);
  $('dojo-back').addEventListener('click', close);
  $('dojo-restart').addEventListener('click', reset);
  $('dojo-pause').addEventListener('click', () => { paused = !paused; updateControls(); });
  $('dojo-walk').addEventListener('click', () => { walking = !walking; updateControls(); });
  $('dojo-step').addEventListener('click', () => {
    paused = true;
    advance(1 / 60);
    renderer.draw(run, { paused, reducedMotion: reducedMotion.matches });
    updateControls();
  });
  screen.addEventListener('click', event => {
    const schoolButton = event.target.closest('[data-dojo-school]');
    if (schoolButton) { setSchool(schoolButton.dataset.dojoSchool); return; }
    if (school !== 'hwasan') return;
    const pathButton = event.target.closest('[data-dojo-category]');
    const rankButton = event.target.closest('[data-dojo-rank]');
    const partnerButton = event.target.closest('[data-dojo-partner]');
    const directionButton = event.target.closest('[data-dojo-direction]');
    if (pathButton) { category = pathButton.dataset.dojoCategory; detailSource = 'active'; reset(); }
    if (rankButton) { rank = Number(rankButton.dataset.dojoRank); detailSource = 'active'; reset(); }
    if (partnerButton) { partnerRanks[category] = Number(partnerButton.dataset.dojoPartner); detailSource = 'partner'; reset(); }
    if (directionButton) { direction = directionButton.dataset.dojoDirection; reset(); }
  });
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', event => {
    if (!active || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(); }
    else if (school !== 'hwasan') return;
    else if (/^[1-7]$/.test(event.key)) { event.preventDefault(); rank = Number(event.key); detailSource = 'active'; reset(); }
    else if (event.code === 'Space') { event.preventDefault(); event.stopImmediatePropagation(); if (!event.repeat) { paused = !paused; updateControls(); } }
  }, true);
  document.addEventListener('visibilitychange', () => { if (active && school === 'hwasan' && document.hidden) { paused = true; updateControls(); } });
  window.addEventListener('message', event => {
    if (!active || school !== 'namgung' || !namgungFrame || event.origin !== window.location.origin || event.source !== namgungFrame.contentWindow) return;
    if (event.data?.type === 'cheon-namgung-close') close();
  });
  window.CheonDojo = Object.freeze({ open, close, setSchool,
    getState: () => ({ active, school, paused, walking, category, rank, partnerRanks: { ...partnerRanks }, time: run?.time ?? null, hwasanAnimating: Boolean(frame), namgungMounted: Boolean(namgungFrame) })
  });
})();
