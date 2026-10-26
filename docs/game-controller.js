(() => {
  'use strict';
  const screen = document.querySelector('#game-screen');
  const canvas = document.querySelector('#game-canvas');
  const modal = document.querySelector('#battle-modal');
  const dialog = document.querySelector('#battle-dialog');
  const core = window.CheonGameCore;
  const skills = window.CHEONJONG_DATA.schools.hwasan.skills;
  const symbols = { plum_sword: '劍', zixia: '紫', plum_rain: '雨', liuhe: '合', dark_fragrance: '影', five_elements: '步' };
  const order = ['plum_sword', 'zixia', 'plum_rain', 'liuhe', 'dark_fragrance', 'five_elements'];
  const pairs = [
    { active: 'plum_sword', partner: 'zixia', result: '매화만리향' },
    { active: 'plum_rain', partner: 'liuhe', result: '매향침골' },
    { active: 'dark_fragrance', partner: 'five_elements', result: '매인설한' }
  ];
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const skillById = id => skills.find(skill => skill.id === id);
  const clock = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const percent = value => `${Math.round(value * 100)}%`;
  let active = false;
  let run = null;
  let renderer = null;
  let modalKind = '';
  let lastFrame = 0;
  let nextHud = 0;
  let lastSkillSignature = '';
  let dashQueued = false;
  let runOptions = {};
  let drag = null;
  let pointerMove = { x: 0, y: 0 };
  const keys = new Set();
  const heldActionKeys = new Set();
  const blockedActionKeys = new Set();
  const actionKeys = ['Space', 'Enter', 'NumpadEnter'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const moveKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

  function clearInput() {
    keys.clear();
    dashQueued = false;
    drag = null;
    pointerMove = { x: 0, y: 0 };
    $('battle-stick').hidden = true;
  }
  function resize() {
    if (!renderer) return;
    renderer.resize(screen.clientWidth, screen.clientHeight);
    if (run) { run.width = screen.clientWidth; run.height = screen.clientHeight; }
  }
  function announce(text) { $('battle-announcer').textContent = text; }
  function rankText(id, rank) {
    return rank === 7 ? '절세' : rank === 0 ? '미습득' : `${rank}${['zixia', 'liuhe', 'five_elements'].includes(id) ? '성' : '단계'}`;
  }
  function skillMarkup() {
    return order.map(id => {
      const skill = skillById(id);
      const rank = run.skills[id] || 0;
      return `<div class="battle-skill ${rank === 0 ? 'unlearned' : ''} ${rank === 7 ? 'fused' : ''}" title="${esc(skill.name)} · ${rankText(id, rank)}"><span class="battle-skill-symbol" aria-hidden="true">${symbols[id]}</span><span class="battle-rank">${rank || '−'}</span><small>${esc(skill.name === '이십사수매화검법' ? '매화검법' : skill.name)}</small><span class="battle-sr-only">${rankText(id, rank)}</span></div>`;
    }).join('');
  }
  function ownedMarkup() {
    return `<section class="dialog-owned" aria-label="현재 보유 무공과 조합 조건"><p>현재 무공 · 강화 효과는 누적됩니다</p><div id="dialog-owned-skills">${skillMarkup()}</div><div class="fusion-progress">${pairs.map(pair => {
      const a = run.skills[pair.active] || 0;
      const b = run.skills[pair.partner] || 0;
      return `<div><strong>${pair.result}${a === 7 ? ' · 완성' : ''}</strong>${esc(skillById(pair.active).name)} ${Math.min(a, 6)}/6<br>${esc(skillById(pair.partner).name)} ${Math.min(b, 6)}/6</div>`;
    }).join('')}</div></section>`;
  }
  function openModal(kind, html) {
    heldActionKeys.forEach(key => blockedActionKeys.add(key));
    clearInput();
    modalKind = kind;
    modal.classList?.toggle('is-levelup', kind === 'levelup');
    dialog.classList?.toggle('is-levelup', kind === 'levelup');
    modal.hidden = false;
    dialog.innerHTML = html;
    requestAnimationFrame(() => dialog.querySelector('button')?.focus());
  }
  function closeModal() {
    modalKind = '';
    modal.hidden = true;
    dialog.innerHTML = '';
    lastFrame = performance.now();
    canvas.focus({ preventScroll: true });
  }
  function setupRun(withBrief) {
    clearInput();
    modal.hidden = true;
    modalKind = '';
    // 시설(폐관동 등)의 영구 강화는 출전할 때마다 새로 읽는다.
    // 연무장 맹약·폐공·새로고침·부활도 함께(CheonFacilities.runOptions).
    const facility = window.CheonFacilities?.runOptions?.() || {};
    run = core.createRun({ ...facility, ...runOptions, seed: Date.now() >>> 0, width: screen.clientWidth, height: screen.clientHeight });
    run.reported = false;
    lastSkillSignature = '';
    nextHud = 0;
    updateHud();
    if (withBrief) {
      openModal('brief', `<p class="dialog-eyebrow">第一試 · 華山</p><h2 id="battle-dialog-title">매화가 피는 곳</h2><p class="dialog-lead">매화검법과 자하신공으로 시작합니다. 적을 격파하고 기를 모아 무공을 강화하세요.<br>초식 6단계와 짝 심법 6성을 완성하면 절세신공을 선택할 수 있습니다.</p><div class="battle-help"><p><strong>움직이고, 베고, 살아남으세요</strong><kbd>W A S D</kbd> 또는 방향키로 이동 · 자동 공격<br><kbd>Space</kbd> 경공 · <kbd>Esc</kbd> 일시정지 · <kbd>Tab</kbd> 능력치</p><p><strong>터치와 마우스도 사용할 수 있습니다</strong>전장을 누른 채 원하는 방향으로 끌어 이동<br>오른쪽 아래 경공 버튼으로 위험 지역을 벗어나세요.</p></div><p class="dialog-lead">꽃잎은 피격 피해를 막아 주며, 보유량에 따라 적에게 부착됩니다.<br>분홍 표시를 확인하고 적의 공격 예고 영역을 피하세요.</p><p class="dialog-difficulty">난이도 · 적 수 ×${run.difficulty.count} · 적 공격력 ×${run.difficulty.attack} · 적 체력 ×${run.difficulty.health}</p><div class="dialog-footer"><small>공격 계수와 난이도는 전투 검증용 임시 수치입니다.</small><button class="dialog-primary" data-action="resume">수련 시작 →</button></div>`);
    } else {
      canvas.focus({ preventScroll: true });
      announce('화산 수련을 시작합니다.');
    }
  }
  // options: { stage, difficulty: { count, attack, health }, bonuses? } from the hub's stage select.
  function startBattle(options = {}) {
    runOptions = options;
    if (!core || !window.CheonGameRenderer) {
      alert('전투 파일을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      return;
    }
    window.MartialPreview?.destroy();
    $('title-screen').hidden = true;
    $('martial-screen').hidden = true;
    screen.hidden = false;
    document.body.classList.add('in-battle');
    active = true;
    renderer ||= new window.CheonGameRenderer(canvas, { appearanceProvider: () => window.CheonHub?.getCurrentAppearance?.() || window.CheonHub?.appearance || window.CheonAppearance?.resolve({}) });
    resize();
    setupRun(true);
    lastFrame = performance.now();
  }
  function returnTitle() {
    heldActionKeys.forEach(key => blockedActionKeys.add(key));
    clearInput();
    active = false;
    modalKind = '';
    run = null;
    modal.hidden = true;
    screen.hidden = true;
    document.body.classList.remove('in-battle');
    $('martial-screen').hidden = true;
    $('title-screen').hidden = false;
    $('start-battle').focus();
    window.dispatchEvent(new CustomEvent('cheon:title'));
  }
  function showPause() {
    if (!active || run.status !== 'running') return;
    openModal('pause', `<p class="dialog-eyebrow">잠시 호흡을 고릅니다</p><h2 id="battle-dialog-title">일시정지</h2><p class="dialog-lead">전장의 시간이 멈췄습니다. 보유 무공과 다음 조합을 확인하세요.</p>${ownedMarkup()}<div class="dialog-footer"><button data-action="title">메인으로</button><button class="dialog-primary" data-action="resume">계속 수련 →</button></div>`);
    announce('일시정지');
  }
  function showStats() {
    if (!active || !['running', 'levelup'].includes(run.status)) return;
    if (run.status === 'levelup') return;
    const s = core.getStats(run);
    const statRows = [
      ['생명', `${Math.ceil(run.player.hp)} / ${run.player.maxHp}`],
      ['공격 속도', `초당 ${s.attackSpeed.toFixed(2)}회`],
      ['기본 검격 피해', `${Math.round(s.attackDamage)}`],
      ['치명타 확률', percent(s.critChance)],
      ['이동 속도', `${Math.round(s.moveSpeed)}`],
      ['발동형 기본 재사용', `${s.rainCooldown.toFixed(1)}초`],
      ['꽃잎 보유 한도', `${s.maxPetals}개`],
      ['피격당 꽃잎 소모', `최대 ${s.petalConsumption}개`],
      ['꽃잎당 고정 감소', `${s.petalFlatReduction}`],
      ['받는 피해 비율 감소', percent(s.damageReduction)]
    ];
    openModal('stats', `<p class="dialog-eyebrow">현재 능력치</p><h2 id="battle-dialog-title">내공을 살피다</h2><p class="dialog-lead">꽃잎의 고정 피해 감소를 먼저 적용한 다음, 비율 피해 감소를 적용합니다.<br>공격 계수와 거리 수치는 밸런스 검증 중입니다.</p><dl class="stats-grid">${statRows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl><div class="dialog-footer"><small>전투는 일시정지되어 있습니다.</small><button class="dialog-primary" data-action="resume">전투로 돌아가기 →</button></div>`);
  }
  function showCodex() {
    if (!active || run.status !== 'running') return;
    openModal('codex', `<p class="dialog-eyebrow">이번 수련의 무공록</p><h2 id="battle-dialog-title">매화의 길</h2><p class="dialog-lead">현재 배운 무공의 효과입니다. 1~6단계는 누적되며, 절세신공도 양쪽 효과를 계승합니다.</p>${order.map(id => {
      const skill = skillById(id);
      const rank = run.skills[id] || 0;
      return `<section class="codex-entry"><h3>${symbols[id]} · ${esc(skill.name)}<small>${rankText(id, rank)}</small></h3>${rank === 7 && id === 'plum_sword' ? '<p><strong>절세신공의 압축:</strong> 기존 1·2차 직접 피해를 한 번의 매화 베기에 합산합니다. 개화 폭발을 따로 재생하지 않으며, 3초 장판과 심법 효과는 유지합니다.</p>' : ''}${rank ? skill.levels.filter(level => Number(level.rank) <= rank).map(level => `<p><strong>${level.rank}${['zixia', 'liuhe', 'five_elements'].includes(id) ? '성' : '단계'}</strong> · ${esc(level.description)}</p>`).join('') : '<p>레벨이 오르면 새 무공으로 습득할 수 있습니다.</p>'}</section>`;
    }).join('')}<div class="dialog-footer"><small>계보 전체는 메인 화면의 무공록에서 확인할 수 있습니다.</small><button class="dialog-primary" data-action="resume">전투로 돌아가기 →</button></div>`);
  }
  // 레벨업 한 줄: 아이콘(아래 단계) · "이름 - 초식/심법" · 짧은 효과. 오른쪽 위는 조합 짝 아이콘(보유하면 색, 아니면 흐리게).
  function comboIcon(id) {
    const rank = run.skills[id] || 0;
    return `<span class="lv-combo-icon${rank ? '' : ' is-off'}" title="${esc(skillById(id).name)} · ${rankText(id, rank)}">${symbols[id]}</span>`;
  }
  function choiceRow(choice) {
    const id = choice.skillId, heal = choice.type === 'heal', fusion = choice.rank === 7;
    const mind = ['zixia', 'liuhe', 'five_elements'].includes(id);
    const pair = pairs.find(p => p.active === id || p.partner === id);
    const kind = heal ? '운기' : fusion ? '절세신공' : mind ? '심법' : '초식';
    const name = heal || fusion ? choice.title : skillById(id).name;
    const level = heal ? '' : fusion ? '절세' : choice.rank === 1 ? 'NEW' : `Lv.${choice.rank}`;
    const combo = heal || !pair ? '' : `<span class="lv-combo" aria-label="조합 ${esc(pair.result)}">${fusion ? `${comboIcon(pair.active)}${comboIcon(pair.partner)}` : comboIcon(id === pair.active ? pair.partner : pair.active)}</span>`;
    const short = String(choice.description || '').split(/(?<=다\.)\s+/)[0];
    const full = `${choice.formTitle ? `「${choice.formTitle}」 ` : ''}${choice.description || ''}`;
    return `<button class="lv-row${mind ? ' is-mind' : ''}${fusion ? ' is-fusion' : ''}" data-choice="${esc(choice.id)}" title="${esc(full)}"><span class="lv-icon" aria-hidden="true"><b>${heal ? '修' : symbols[id]}</b><small>${level}</small></span><span class="lv-text"><strong><span class="lv-name">${esc(name)}</span><span class="lv-kind">- ${kind}</span></strong><span class="lv-desc">${choice.formTitle ? `<b>${esc(choice.formTitle)}</b> · ` : ''}${esc(short)}</span></span>${combo}</button>`;
  }
  function showChoices() {
    const choices = core.getChoices(run);
    openModal('levelup', `<div class="lv-head"><p class="dialog-eyebrow">무학의 깨달음 · Lv. ${run.level}</p><h2 id="battle-dialog-title">초식을 고르세요</h2></div><div class="lv-list">${choices.map(choiceRow).join('')}</div>`);
    announce(`레벨 ${run.level}. 다음 무공을 선택하세요.`);
    addRerollButton();
  }
  // 연무장 새로고침: 남은 횟수가 있으면 선택창에 "다시 뽑기".
  function addRerollButton() {
    if (!(run.rerollsLeft > 0)) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'battle-reroll'; button.dataset.action = 'reroll';
    button.textContent = `다시 뽑기 · ${run.rerollsLeft}회 남음`;
    dialog.querySelector('.lv-list')?.after(button);
  }
  function showResult() {
    const won = run.status === 'won';
    const fusions = pairs.filter(pair => run.skills[pair.active] === 7).map(pair => pair.result);
    if (!run.reported) {
      run.reported = true;
      window.dispatchEvent(new CustomEvent('cheon:run-end', { detail: { won, stage: run.stage, difficulty: { ...run.difficulty }, time: run.time, kills: run.kills, level: run.level, loot: { ...run.loot } } }));
    }
    openModal('result', `<p class="dialog-eyebrow">${won ? '華山 · 시련 돌파' : '다시 피어날 매화를 위하여'}</p><h2 id="battle-dialog-title">${won ? '매화, 시련을 넘다' : '이번 수련을 마칩니다'}</h2><p class="dialog-lead">${won ? '공세와 보스의 시련을 이겨냈습니다. 다른 무공 조합으로 다시 수련해 보세요.' : '배운 무공과 적의 예고를 기억하세요. 다음 수련에서 새로운 길을 택할 수 있습니다.'}</p><div class="battle-result-numbers"><div><span>수련 시간</span><strong>${clock(run.time)}</strong></div><div><span>격파</span><strong>${run.kills}</strong></div><div><span>도달 레벨</span><strong>${run.level}</strong></div><div><span>완성한 절세신공</span><strong>${fusions.length}</strong></div></div>${fusions.length ? `<p class="dialog-lead">${esc(fusions.join(' · '))}</p>` : ''}${ownedMarkup()}<div class="dialog-footer"><button data-action="title">메인으로</button><button class="dialog-primary" data-action="retry">다시 수련 →</button></div>`);
    announce(won ? '시련 돌파. 수련 결과를 확인하세요.' : '수련 종료. 다시 도전할 수 있습니다.');
    addLootLine();
  }
  // 전리품: 이번 판에 얻은 약재 · 영물(연단방) · 장비(대장간)를 결과 창에 한 줄로.
  function addLootLine() {
    const loot = run.loot || {};
    if (!loot.herbs && !loot.spirit && !loot.gear) return;
    const line = document.createElement('p');
    line.className = 'dialog-lead battle-loot';
    line.textContent = `전리품 · 약재 +${loot.herbs || 0}${loot.spirit ? ` · 영물 +${loot.spirit}` : ''}${loot.gear ? ` · 장비 +${loot.gear}` : ''}`;
    dialog.querySelector('.battle-result-numbers')?.after(line);
  }
  // 내력(마나) 줄: 생명 줄 바로 아래에 한 번만 만든다(index.html 은 건드리지 않음).
  function ensureManaRow() {
    if ($('battle-mana-fill')) return;
    const hp = document.querySelector('.battle-hp-row');
    if (!hp) return;
    const row = document.createElement('div'), label = document.createElement('span'), meter = document.createElement('div');
    const fill = document.createElement('i'), value = document.createElement('strong');
    row.className = 'battle-hp-row battle-mana-row';
    label.textContent = '내력';
    meter.className = 'battle-meter mana';
    fill.id = 'battle-mana-fill';
    value.id = 'battle-mana';
    meter.append(fill);
    row.append(label, meter, value);
    hp.after(row);
  }
  function updateHud() {
    if (!run) return;
    const s = core.getStats(run);
    $('battle-time').textContent = clock(run.time);
    $('battle-level').textContent = `Lv. ${run.level}`;
    $('battle-hp').textContent = `${Math.max(0, Math.ceil(run.player.hp))} / ${run.player.maxHp}`;
    $('battle-hp-fill').style.width = `${Math.max(0, run.player.hp / run.player.maxHp) * 100}%`;
    ensureManaRow();
    if ($('battle-mana')) {
      $('battle-mana').textContent = `${Math.floor(run.player.mana)} / ${run.player.maxMana}`;
      $('battle-mana-fill').style.width = `${Math.max(0, run.player.mana / run.player.maxMana) * 100}%`;
    }
    $('battle-xp').textContent = `${Math.floor(run.xp)} / ${Math.ceil(run.nextXp)}`;
    $('battle-xp-fill').style.width = `${Math.min(1, run.xp / run.nextXp) * 100}%`;
    $('battle-petals').textContent = `${run.player.petals} / ${s.maxPetals}`;
    $('battle-kills').textContent = run.kills;
    const lock = Math.max(0, run.player.pickupLockedUntil - run.time);
    $('battle-petal-lock').textContent = lock > 0 ? `획득 금지 ${lock.toFixed(1)}초` : '';
    const cooldown = run.player.dashCooldown || 0;
    const needsPetal = run.skills.dark_fragrance === 7 && run.skills.five_elements === 7 && run.player.petals < 1;
    $('battle-dash-cooldown').textContent = needsPetal ? '꽃잎 필요' : cooldown > 0 ? `${cooldown.toFixed(1)}초` : 'Space · 준비';
    $('battle-dash').disabled = cooldown > 0 || needsPetal || !!modalKind;
    $('battle-dash').setAttribute('aria-label', needsPetal ? '매인설한 경공. 꽃잎이 1개 이상 필요합니다.' : `경공. ${cooldown > 0 ? `${cooldown.toFixed(1)}초 후 사용 가능` : '사용 가능'}`);
    $('battle-dash').title = run.skills.dark_fragrance === 7 ? '매인설한: 꽃잎 1개 이상 필요 · 전량 소모 · 0.3초 무적 · 3초 획득 금지' : '스페이스바로 경공';
    const boss = run.enemies.find(enemy => enemy.type === 'boss');
    $('battle-boss').hidden = !boss;
    if (boss) {
      $('battle-boss-name').textContent = boss.name || '매화의 시련 · 수문장';
      $('battle-boss-fill').style.width = `${Math.max(0, boss.hp / boss.maxHp) * 100}%`;
    }
    $('battle-goal').textContent = boss ? '예고 영역을 피하고 시련을 돌파하세요' : '기를 모아 무공을 완성하세요';
    const signature = order.map(id => run.skills[id] || 0).join(',');
    if (signature !== lastSkillSignature) {
      $('battle-skills').innerHTML = skillMarkup();
      lastSkillSignature = signature;
    }
  }
  function getInput() {
    let x = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    let y = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0);
    if (!x && !y) { x = pointerMove.x; y = pointerMove.y; }
    const input = { moveX: x, moveY: y, dash: dashQueued };
    dashQueued = false;
    return input;
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!active || !run) { lastFrame = now; return; }
    const dt = Math.min(.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (!modalKind && run.status === 'running') core.step(run, dt, getInput());
    if (!modalKind && run.status === 'levelup') showChoices();
    if (!modalKind && (run.status === 'won' || run.status === 'lost')) showResult();
    renderer.draw(run, { paused: !!modalKind, reducedMotion: reducedMotion.matches });
    if (now >= nextHud) { updateHud(); nextHud = now + 100; }
  }

  // The hub's stage select calls start; 출전 itself opens that select (hub.js). The page edit tool pauses a running fight.
  window.CheonBattle = { start: startBattle, pause: showPause };
  $('battle-pause').addEventListener('click', showPause);
  $('battle-stats').addEventListener('click', showStats);
  $('battle-codex').addEventListener('click', showCodex);
  $('battle-dash').addEventListener('click', () => { if (active && !modalKind) dashQueued = true; });
  dialog.addEventListener('click', event => {
    const choice = event.target.closest('[data-choice]');
    if (choice && modalKind === 'levelup') {
      const accepted = core.choose(run, choice.dataset.choice);
      if (accepted === false) return;
      closeModal();
      updateHud();
      if (run.status === 'levelup') showChoices();
      return;
    }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'reroll') { if (core.reroll(run)) showChoices(); return; }
    if (button.dataset.action === 'resume') closeModal();
    if (button.dataset.action === 'title') returnTitle();
    if (button.dataset.action === 'retry') setupRun(false);
  });
  window.addEventListener('keydown', event => {
    if (actionKeys.includes(event.code)) {
      heldActionKeys.add(event.code);
      if (blockedActionKeys.has(event.code) || (active && event.repeat)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
    }
    if (!active) return;
    if (event.code === 'Escape') {
      event.preventDefault(); event.stopImmediatePropagation();
      if (event.repeat) return;
      if (['pause', 'stats', 'codex'].includes(modalKind)) closeModal();
      else if (!modalKind) showPause();
      return;
    }
    // 레벨업 창: 숫자 1 · 2 · 3 으로 고른다.
    if (modalKind === 'levelup' && /^(Digit|Numpad)[1-9]$/.test(event.code)) {
      event.preventDefault();
      dialog.querySelectorAll('[data-choice]')[Number(event.code.slice(-1)) - 1]?.click();
      return;
    }
    if (event.code === 'Tab') {
      if (modalKind) {
        const buttons = [...dialog.querySelectorAll('button:not(:disabled)')];
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
      } else { event.preventDefault(); showStats(); }
      return;
    }
    if (moveKeys.includes(event.code) || event.code === 'Space') {
      if (modalKind) return;
      event.preventDefault();
      if (event.code === 'Space') { if (!event.repeat) dashQueued = true; }
      else keys.add(event.code);
    }
  }, true);
  window.addEventListener('keyup', event => {
    keys.delete(event.code);
    heldActionKeys.delete(event.code);
    if (blockedActionKeys.has(event.code)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      blockedActionKeys.delete(event.code);
    }
  }, true);
  canvas.addEventListener('pointerdown', event => {
    if (!active || modalKind || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    const stick = $('battle-stick');
    stick.hidden = false;
    stick.style.left = `${drag.x - 45}px`;
    stick.style.top = `${drag.y - 45}px`;
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x; const dy = event.clientY - drag.y;
    const distance = Math.hypot(dx, dy);
    const strength = Math.min(1, distance / 35);
    pointerMove = distance > 5 ? { x: dx / distance * strength, y: dy / distance * strength } : { x: 0, y: 0 };
    $('battle-stick').firstElementChild.style.transform = `translate(${pointerMove.x * 25}px,${pointerMove.y * 25}px)`;
  });
  const releasePointer = event => {
    if (drag?.id !== event.pointerId) return;
    drag = null; pointerMove = { x: 0, y: 0 }; $('battle-stick').hidden = true;
  };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);
  canvas.addEventListener('lostpointercapture', releasePointer);
  window.addEventListener('resize', resize);
  window.addEventListener('blur', () => { clearInput(); heldActionKeys.clear(); if (active && !modalKind && run.status === 'running') showPause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); if (active && !modalKind && run.status === 'running') showPause(); } });
  window.addEventListener('pagehide', event => {
    // BFCache resumes this same renderer and its pending outfit image loads.
    if (event.persisted) return;
    renderer?.destroy();
    renderer = null;
  });
  requestAnimationFrame(frame);
})();
