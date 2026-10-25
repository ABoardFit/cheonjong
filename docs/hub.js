/* 메인 허브: 저장 데이터(이 브라우저 localStorage), 세력·재화·능력치 표시, 출전 → 스테이지·난이도 선택,
 * 별호·이름, 시설(연단방·대장간·연무장·폐관동) 준비 중 창.
 * 보상·경지·별호 조건은 시제품용 임시 규칙이다(시설·경제 설계는 다음 단계). */
(() => {
  'use strict';
  const SAVE_KEY = 'cheonjong-save-v1';
  const $ = id => document.getElementById(id);
  const screen = $('title-screen');
  const B = window.CHEONJONG_BALANCE;
  if (!screen || !document.querySelector('.hub-center')) return;

  const CATEGORIES = [['righteous', '정파'], ['heterodox', '사파'], ['outer', '세외']];
  // 주세력에 따라 가운데 문양과 도장이 바뀐다. 지금은 화산만 있다.
  // 화산 문양은 검법 4·5·6단계에 피는 채워진 매화(렌더러 flatPlumRaster)를 그대로 그린다.
  const SCHOOLS = {
    hwasan: { name: '화산', emblem: 'plum-bloom', seal: '華山\n梅花' },
  };
  const STAGES = [
    { id: 'hwasan', school: 'hwasan', name: '화산의 시련', hanja: '華山',
      summary: '사방에서 몰려드는 강호 무인을 버티고, 2분 30초에 나타나는 수문장을 4분 안에 쓰러뜨리세요.' },
  ];
  const LOCKED_STAGES = ['남궁세가의 시련', '사파 · 혈교의 시련', '세외 · 북해빙궁의 시련'];
  const AXES = [['count', '적 수'], ['attack', '적 공격력'], ['health', '적 체력']];
  const PRESETS = [
    ['보통', { count: 1, attack: 1, health: 1 }],
    ['어려움', { count: 1.5, attack: 1.25, health: 1.5 }],
    ['극악', { count: 2, attack: 2, health: 2 }],
  ];
  // [필요한 총 돌파 수, 경지]
  const REALMS = [[0, '삼류'], [1, '이류'], [3, '일류'], [6, '절정'], [10, '초절정'], [15, '화경'], [25, '현경'], [40, '생사경']];
  const TITLES = [
    { id: 'novice', name: '강호초출', condition: '처음부터 지닌 별호', unlocked: () => true },
    { id: 'first_step', name: '첫걸음', condition: '시련에 한 번 출전', unlocked: s => s.runs >= 1 },
    { id: 'plum_bud', name: '매화봉오리', condition: '화산의 시련 첫 돌파', unlocked: s => (s.clears.hwasan || 0) >= 1 },
    { id: 'hundred_cuts', name: '백인참', condition: '한 번의 시련에서 300명 격파', unlocked: s => s.best.kills >= 300 },
    { id: 'iron_blood', name: '철혈', condition: '난이도 평균 1.5배 이상으로 돌파', unlocked: s => s.best.hardClear >= 1.5 },
    { id: 'plum_swordsman', name: '매화검수', condition: '화산의 시련 5회 돌파', unlocked: s => (s.clears.hwasan || 0) >= 5 },
  ];
  const EQUIPMENT = [['weapon', '劍', '무기'], ['robe', '袍', '의복'], ['belt', '帶', '요대'], ['boots', '靴', '신발'], ['charm', '佩', '장신구']];
  const FACILITIES = {
    alchemy: { name: '연단방', hanja: '煉丹房', lead: '영단을 빚는 곳',
      plans: ['재료와 은자로 영단을 제조합니다.'] },
    forge: { name: '대장간', hanja: '鍛冶場', lead: '장비를 다듬는 곳',
      plans: ['장비 합성', '장비 속성 변경'] },
    hall: { name: '연무장', hanja: '演武場', lead: '수련의 규칙을 다듬는 곳',
      plans: ['폐공 — 배운 무공 중 한 판에서 등장하지 않게 할 무공 지정',
        '레벨업 무공 선택창 새로고침 횟수',
        '부활 횟수 강화',
        '고난도 맹약 — 더 어렵게 하는 대신 혜택(예: 받는 피해 +20%, 주는 피해 +10%)'] },
    seclusion: { name: '폐관동', hanja: '閉關洞', lead: '기본 능력을 끌어올리는 곳',
      plans: ['체력 · 이동속도 · 공력 · 내력 · 피해 감소 · 치명타 확률 · 치명타 피해 · 범위 강화',
        '주세력에 따라 열리는 특수 능력치'] },
  };

  // ---- save data ----
  const fresh = () => ({
    version: 1, name: '무명객', title: 'novice', silver: 0, manuals: 0,
    factions: { righteous: 0, heterodox: 0, outer: 0 }, mainSchool: 'hwasan',
    runs: 0, clears: {}, best: { kills: 0, hardClear: 0 },
    difficulty: { count: 1, attack: 1, health: 1 }, equipment: {}, lastReward: null,
    tree: { allocated: [] },
  });
  function load() {
    const base = fresh();
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && saved.version === 1) {
        return { ...base, ...saved, factions: { ...base.factions, ...saved.factions }, best: { ...base.best, ...saved.best },
          difficulty: { ...base.difficulty, ...saved.difficulty }, clears: { ...saved.clears }, equipment: { ...saved.equipment },
          tree: { allocated: Array.isArray(saved.tree?.allocated) ? [...saved.tree.allocated] : [] } };
      }
    } catch {}
    return base;
  }
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
  }
  let state = load();

  const totalClears = () => Object.values(state.clears).reduce((sum, n) => sum + n, 0);
  const realmIndex = () => REALMS.reduce((index, [need], i) => (totalClears() >= need ? i : index), 0);
  const unlockedTitles = () => TITLES.filter(title => title.unlocked(state));
  const titleName = () => (TITLES.find(title => title.id === state.title && title.unlocked(state)) || TITLES[0]).name;
  const times = value => `×${Number(value).toFixed(2).replace(/\.?0+$/, '')}`;
  const rewardFactor = d => Math.cbrt(d.count * d.attack * d.health);

  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'class') el.className = value;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
      else if (key in el) el[key] = value;
      else el.setAttribute(key, value);
    }
    el.append(...children.filter(child => child !== null && child !== undefined && child !== false));
    return el;
  }

  // ---- hub rendering ----
  function render() {
    const school = SCHOOLS[state.mainSchool] || SCHOOLS.hwasan;
    for (const [id, label] of CATEGORIES) {
      const cell = document.querySelector(`[data-faction-count="${id}"]`);
      if (cell) cell.replaceChildren(h('span', {}, label), h('strong', {}, String(state.factions[id] || 0)));
    }
    const emblem = document.querySelector('.hub-emblem');
    if (emblem && emblem.dataset.emblem !== school.emblem) drawEmblem(emblem, school.emblem);
    emblem?.setAttribute('aria-label', `${school.name} 문양`);
    const seal = document.querySelector('.title-seal');
    if (seal) seal.textContent = school.seal;
    $('hub-wallet').replaceChildren(
      h('span', { title: '은자' }, h('i', { 'aria-hidden': 'true' }, '銀'), `은자 ${state.silver.toLocaleString('ko-KR')}`),
      h('span', { title: '비급' }, h('i', { 'aria-hidden': 'true' }, '書'), `비급 ${state.manuals.toLocaleString('ko-KR')}`));
    $('hub-nameplate').replaceChildren(h('span', { class: 'hub-title-tag' }, `[${titleName()}]`), h('strong', {}, state.name));
    const stage = STAGES[0];
    $('hub-stage-caption').textContent = `현재 시련 · ${stage.name} — ${stage.summary}`;
    renderStats();
  }

  // 문양 그리기. 'plum-bloom'은 게임 렌더러가 검법 단계 공격에 쓰는 꽃을 같은 2배 도트로 옮긴다.
  function drawEmblem(canvas, kind) {
    canvas.dataset.emblem = kind;
    const Renderer = window.CheonGameRenderer;
    if (kind !== 'plum-bloom' || !Renderer) return;
    const renderer = new Renderer(document.createElement('canvas'));
    const paint = () => {
      const stamp = renderer.flatPlumRaster(140, -Math.PI / 2);
      if (!stamp) return false;
      const source = stamp.canvas, hub = stamp.displayCenter;
      const alpha = source.getContext('2d').getImageData(0, 0, source.width, source.height).data;
      let reach = 0;
      for (let y = 0; y < source.height; y++) for (let x = 0; x < source.width; x++) {
        if (alpha[(y * source.width + x) * 4 + 3]) reach = Math.max(reach, Math.abs(x + 0.5 - hub.x), Math.abs(y + 0.5 - hub.y));
      }
      // 꽃잎이 모이는 나선 중심을 캔버스 가운데에 둔다(게임에서도 이 점이 몸 중심에 맞는다).
      const half = Math.ceil(reach) + 2;
      canvas.width = canvas.height = half * 4;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(source, Math.round((half - hub.x) * 2), Math.round((half - hub.y) * 2), source.width * 2, source.height * 2);
      renderer.destroy?.();
      return true;
    };
    if (!paint()) renderer.bloomAtlas.addEventListener('load', paint, { once: true });
  }

  function renderStats() {
    const realm = realmIndex(), next = REALMS[realm + 1];
    const cell = (label, value, note) => h('div', { class: 'hub-stat' }, h('span', {}, label), h('strong', {}, value), note ? h('small', {}, note) : null);
    $('hub-stats').replaceChildren(
      h('div', { class: 'hub-realm' }, h('span', {}, '경지'), h('strong', {}, REALMS[realm][1]),
        h('small', {}, next ? `다음 경지 ${next[1]} · 돌파 ${totalClears()}/${next[0]}` : '무학의 끝에 닿았습니다')),
      h('div', { class: 'hub-stat-grid' },
        cell('공력', String(B?.player.attackDamage ?? '—'), '기본 검격 피해'),
        cell('내력', '0', '연단방·폐관동에서 쌓을 예정'),
        cell('체력', String(B?.player.hp ?? '—'), '최대 생명'),
        cell('시련 돌파', String(totalClears()), `출전 ${state.runs}회`),
        cell('업적', `${unlockedTitles().length - 1} / ${TITLES.length - 1}`, '별호 해금 기준')),
      h('div', { class: 'hub-equipment', 'aria-label': '장비' },
        h('span', {}, '장비'),
        ...EQUIPMENT.map(([slot, glyph, label]) => h('div', { class: `hub-slot${state.equipment[slot] ? '' : ' is-empty'}`, title: `${label} · ${state.equipment[slot] || '비어 있음'}` },
          h('i', { 'aria-hidden': 'true' }, glyph), h('small', {}, label)))));
  }

  // ---- dialogs ----
  const modal = h('div', { class: 'hub-modal', hidden: true, onclick: event => { if (event.target === modal) closeModal(); } });
  document.body.append(modal);
  let opener = null;
  function openModal(labelledBy, ...content) {
    if (modal.hidden) opener = document.activeElement;
    const card = h('section', { class: 'hub-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': labelledBy },
      h('button', { type: 'button', class: 'hub-close', 'aria-label': '닫기', onclick: closeModal }, '×'), ...content);
    modal.replaceChildren(card);
    modal.hidden = false;
    requestAnimationFrame(() => (card.querySelector('[data-autofocus]') || card.querySelector('button'))?.focus());
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.replaceChildren();
    opener?.focus?.({ preventScroll: true });
  }
  modal.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not(:disabled), input, [tabindex="0"]')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  function openStageSelect() {
    const stage = STAGES[0];
    const chosen = { ...state.difficulty };
    const outputs = {}, sliders = {};
    const reward = h('p', { class: 'hub-reward' });
    const presetButtons = PRESETS.map(([label, values]) => h('button', { type: 'button', class: 'hub-chip', onclick: () => { Object.assign(chosen, values); sync(); } }, label));
    function sync() {
      for (const [key] of AXES) { sliders[key].value = chosen[key]; outputs[key].textContent = times(chosen[key]); }
      PRESETS.forEach(([, values], i) => presetButtons[i].setAttribute('aria-pressed', String(AXES.every(([key]) => values[key] === chosen[key]))));
      reward.textContent = `보상 배율 ${times(Math.round(rewardFactor(chosen) * 100) / 100)} · 격파한 적과 돌파 보상(은자)에 곱해집니다`;
    }
    const rows = AXES.map(([key, label]) => {
      sliders[key] = h('input', { type: 'range', min: 0.5, max: 3, step: 0.25, value: chosen[key], 'aria-label': `${label} 배율`,
        oninput: event => { chosen[key] = Number(event.target.value); sync(); } });
      outputs[key] = h('output', {});
      return h('label', { class: 'hub-slider' }, h('span', {}, label), sliders[key], outputs[key]);
    });
    const start = () => {
      state.difficulty = { ...chosen };
      save();
      closeModal();
      window.CheonBattle?.start({ stage: stage.id, difficulty: { ...chosen } });
    };
    openModal('hub-stage-title',
      h('p', { class: 'hub-eyebrow' }, '出戰 · 시련 선택'),
      h('h2', { id: 'hub-stage-title' }, '어느 시련에 나서겠습니까'),
      h('div', { class: 'hub-stage-list' },
        h('button', { type: 'button', class: 'hub-stage is-selected', 'aria-pressed': 'true', 'data-autofocus': '' },
          h('i', { 'aria-hidden': 'true' }, stage.hanja), h('strong', {}, stage.name), h('small', {}, stage.summary),
          h('em', {}, `돌파 ${state.clears[stage.id] || 0}회`)),
        ...LOCKED_STAGES.map(name => h('button', { type: 'button', class: 'hub-stage is-locked', disabled: true },
          h('i', { 'aria-hidden': 'true' }, '鎖'), h('strong', {}, name), h('small', {}, '준비 중')))),
      h('h3', {}, '난이도'),
      h('div', { class: 'hub-presets' }, ...presetButtons),
      ...rows,
      reward,
      h('div', { class: 'hub-dialog-footer' },
        h('button', { type: 'button', class: 'hub-secondary', onclick: closeModal }, '돌아가기'),
        h('button', { type: 'button', class: 'primary-button', onclick: start }, `${stage.name} 출전 `, h('span', { 'aria-hidden': 'true' }, '→'))));
    sync();
  }

  function openNameplate() {
    const input = h('input', { type: 'text', value: state.name, maxLength: 12, 'aria-label': '이름', 'data-autofocus': '' });
    const list = h('div', { class: 'hub-title-list' }, ...TITLES.map(title => {
      const open = title.unlocked(state);
      return h('button', { type: 'button', class: `hub-title-option${state.title === title.id ? ' is-selected' : ''}`, disabled: !open,
        'aria-pressed': String(state.title === title.id),
        onclick: () => { state.title = title.id; save(); render(); openNameplate(); } },
      h('strong', {}, open ? title.name : `🔒 ${title.name}`), h('small', {}, open ? title.condition : `해금 조건 · ${title.condition}`));
    }));
    const saveName = () => {
      const name = input.value.trim().slice(0, 12);
      if (name) { state.name = name; save(); render(); }
      closeModal();
    };
    input.addEventListener('keydown', event => { if (event.key === 'Enter') saveName(); });
    openModal('hub-name-title',
      h('p', { class: 'hub-eyebrow' }, '別號 · 이름'),
      h('h2', { id: 'hub-name-title' }, '강호에 알려질 이름'),
      h('label', { class: 'hub-field' }, h('span', {}, '이름 (12자까지)'), input),
      h('h3', {}, `별호 · ${unlockedTitles().length} / ${TITLES.length} 해금`),
      list,
      h('div', { class: 'hub-dialog-footer' },
        h('button', { type: 'button', class: 'hub-secondary', onclick: closeModal }, '닫기'),
        h('button', { type: 'button', class: 'primary-button', onclick: saveName }, '이름 저장 ', h('span', { 'aria-hidden': 'true' }, '→'))));
  }

  function openFacility(id) {
    const facility = FACILITIES[id];
    openModal('hub-facility-title',
      h('p', { class: 'hub-eyebrow' }, `${facility.hanja} · 준비 중`),
      h('h2', { id: 'hub-facility-title' }, facility.name),
      h('p', { class: 'hub-lead' }, `${facility.lead}입니다. 아직 문을 열지 않았습니다. 들어갈 기능:`),
      h('ul', { class: 'hub-plans' }, ...facility.plans.map(plan => h('li', {}, plan))),
      h('div', { class: 'hub-dialog-footer' }, h('button', { type: 'button', class: 'primary-button', 'data-autofocus': '', onclick: closeModal }, '확인 ', h('span', { 'aria-hidden': 'true' }, '→'))));
  }

  // ---- results from a finished run (임시 보상 규칙) ----
  let toastTimer = 0;
  function toast(text) {
    const box = $('hub-toast');
    box.textContent = text;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, 6000);
  }
  window.addEventListener('cheon:run-end', event => {
    const { won, stage = 'hwasan', difficulty, kills = 0 } = event.detail || {};
    const before = new Set(unlockedTitles().map(title => title.id));
    const factor = rewardFactor(difficulty || state.difficulty);
    const silver = Math.round((kills + (won ? 100 : 0)) * factor);
    state.runs += 1;
    state.silver += silver;
    if (won) {
      state.manuals += 1;
      state.clears[stage] = (state.clears[stage] || 0) + 1;
      const average = (difficulty.count + difficulty.attack + difficulty.health) / 3;
      state.best.hardClear = Math.max(state.best.hardClear, average);
    }
    state.best.kills = Math.max(state.best.kills, kills);
    const unlocked = unlockedTitles().filter(title => !before.has(title.id)).map(title => title.name);
    state.lastReward = { silver, manuals: won ? 1 : 0, unlocked };
    save();
    render();
  });
  window.addEventListener('cheon:title', () => {
    const reward = state.lastReward;
    if (!reward) return;
    state.lastReward = null;
    save();
    toast(`지난 수련 보상 · 은자 +${reward.silver}${reward.manuals ? ` · 비급 +${reward.manuals}` : ''}${reward.unlocked.length ? ` · 새 별호: ${reward.unlocked.join(', ')}` : ''}`);
  });

  // ---- wiring ----
  $('start-battle').addEventListener('click', openStageSelect);
  $('hub-nameplate').addEventListener('click', openNameplate);
  $('hub-character').addEventListener('click', () => $('open-martial').click());
  document.querySelectorAll('[data-facility]').forEach(button => button.addEventListener('click', () => openFacility(button.dataset.facility)));
  render();

  // 무공록 스킬 트리(tree.js)가 저장 데이터·경지를 읽고 세력 칸을 갱신하는 창구.
  window.CheonHub = {
    get state() { return state; },
    save,
    render,
    realm: () => ({ index: realmIndex(), name: REALMS[realmIndex()][1], next: REALMS[realmIndex() + 1] || null }),
    schools: Object.keys(SCHOOLS),
  };
})();
