/* 시설(3단계)
 * 폐관동 — 은자로 기본 능력치를 영구 강화하고, 주세력 특수 능력치는 비급으로 올린다(저장 seclusion).
 * 연무장 — 고난도 맹약(무료, 다음 출전에 걸림), 새로고침 · 부활 횟수, 폐공 칸과 폐공 무공(저장 hall).
 * 연단방 — 판에서 얻은 약재 · 영물과 은자로 영단(영구 강화)을 빚어 먹는다(저장 alchemy).
 * 대장간 — 수문장이 떨군 장비를 끼고, 합성 · 속성 변경 · 분해한다(저장 forge, 규칙은 forge.js).
 *   낀 장비 이름은 hub.js 의 장비 칸(state.equipment)에도 적어 둔다.
 * 저장은 hub.js 의 저장 데이터(window.CheonHub.state)에 함께 들어간다.
 * 출전할 때 game-controller.js 가 runOptions() 를 전투 코어 createRun 에 넘긴다(bonuses · pacts · banned).
 * 맹약 보상은 판이 끝날 때(cheon:run-end) hub.js 의 은자 보상 뒤에 더한다.
 * 수치는 docs/시설-경제-기획.md 의 임시값. */
(() => {
  'use strict';
  const hub = () => window.CheonHub;
  const B = window.CHEONJONG_BALANCE;
  const FG = window.CheonForge;
  const MAX_LEVEL = 10, GROWTH = 1.5;
  const pct = v => `${Math.round(v * 1000) / 10}%`;
  const won = n => n.toLocaleString('ko-KR');
  // [id, 이름, 한자, 단계당 값, 기본 비용(은자), 표시, 설명] — 한 능력치 10단계 ≈ 기본 비용 × 113 ≈ 보통 난이도 100판 남짓
  const STATS = [
    ['hp', '체력', '體', 12, 400, v => `+${v}`, '최대 생명'],
    ['damage', '공력', '力', 0.04, 500, v => `+${pct(v)}`, '주는 모든 피해'],
    ['speed', '이동 속도', '輕', 0.02, 400, v => `+${pct(v)}`, '걷는 속도'],
    ['reduction', '피해 감소', '護', 0.015, 600, v => `−${pct(v)}`, '받는 피해'],
    ['critChance', '치명타 확률', '銳', 0.01, 600, v => `+${pct(v)}p`, '기본 8%'],
    ['critDamage', '치명타 피해', '破', 0.05, 500, v => `+${pct(v)}p`, '기본 170%'],
    ['area', '범위', '廣', 0.03, 600, v => `+${pct(v)}`, '검격 · 장판 반경'],
    ['innerForce', '내력', '氣', 10, 500, v => `+${v}`, '최대 내력(마나) · 검우 · 경공에 씀'],
  ].map(([id, name, glyph, per, base, show, note]) => ({ id, name, glyph, per, base, show, note }));
  // 주세력 특수 능력치(비급). 단계 n 으로 올리는 비용 = 비급 n.
  const SPECIALS = {
    hwasan: { name: '매화심득', glyph: '梅', max: 5,
      note: '단계마다 꽃잎 갑옷 고정 감소 +10%, 3 · 5단계에서 꽃잎 최대 보유 +1',
      bonus: level => ({ petalArmor: level * 0.1, petalCapacity: Number(level >= 3) + Number(level >= 5) }),
      show: level => `꽃잎 갑옷 +${level * 10}% · 꽃잎 최대 +${Number(level >= 3) + Number(level >= 5)}` },
  };
  // 연무장: 단계를 올리는 비용(목록 길이 = 최대 단계)
  const HALL = {
    rerolls: { name: '새로고침', glyph: '轉', unit: '은자', costs: [1500, 4500, 13500], note: '레벨업 선택창을 다시 뽑는 횟수(판마다)', show: n => `판당 ${n}회` },
    revives: { name: '부활', glyph: '甦', unit: '비급', costs: [2, 4], note: '쓰러져도 생명 절반으로 일어남(판마다)', show: n => `판당 ${n}회` },
    banSlots: { name: '폐공 칸', glyph: '封', unit: '비급', costs: [1, 2, 3], note: '이번 판 선택지에 안 나올 무공 수', show: n => `${n}칸` },
  };
  const PACT_TEXT = {
    blood: '받는 피해 +20% · 주는 피해 +10%',
    solo: '생명 회복 없음(재생 · 운기조식)',
    swift: '제한 4분 → 3분 · 수문장 2분 30초 → 1분 50초',
  };
  const SKILL_GLYPHS = { plum_sword: '劍', zixia: '紫', plum_rain: '雨', liuhe: '合', dark_fragrance: '影', five_elements: '步' };
  // 연단방 영단(영구). 같은 영단 n번째는 효과 1/n — 먹은 수 n 이면 합계 = 효과 × (1 + 1/2 + … + 1/n).
  const ELIXIRS = {
    gongcheong: { name: '공청석유', glyph: '乳', note: '영구 내력 +10', herbs: 30, spirit: 1, silver: 10000,
      bonus: m => ({ innerForce: 10 * m }), show: m => `내력 +${Math.round(10 * m * 10) / 10}` },
    daehwan: { name: '대환단', glyph: '丹', note: '영구 체력 +2 · 공력·이동·범위 +1%', herbs: 60, spirit: 3, silver: 25000,
      bonus: m => ({ hp: 2 * m, damage: 0.01 * m, speed: 0.01 * m, area: 0.01 * m }),
      show: m => `체력 +${Math.round(2 * m * 10) / 10} · 공력 · 이동 · 범위 +${Math.round(m * 100) / 100}%` },
  };
  const harmonic = n => Array.from({ length: n }, (_, i) => 1 / (i + 1)).reduce((a, b) => a + b, 0);

  // ---- 저장 ----
  const cost = (stat, level) => Math.round(stat.base * GROWTH ** level / 10) * 10;
  function data() {
    const state = hub().state;
    const saved = state.seclusion || {};
    state.seclusion = { levels: { ...saved.levels }, special: { ...saved.special } };
    return state.seclusion;
  }
  function hall() {
    const state = hub().state, saved = state.hall || {};
    const level = (key, max) => Math.max(0, Math.min(max, Number(saved[key]) || 0));
    state.hall = {
      pacts: Array.isArray(saved.pacts) ? saved.pacts.filter(id => B.pacts[id]) : [],
      rerolls: level('rerolls', HALL.rerolls.costs.length), revives: level('revives', HALL.revives.costs.length),
      banSlots: level('banSlots', HALL.banSlots.costs.length),
      banned: Array.isArray(saved.banned) ? saved.banned.filter(id => SKILL_GLYPHS[id]) : [],
    };
    state.hall.banned = state.hall.banned.slice(0, state.hall.banSlots);
    return state.hall;
  }
  function forge() {
    const state = hub().state, saved = state.forge || {};
    const items = Array.isArray(saved.items) ? saved.items.filter(item => FG.SLOTS[item?.slot] && FG.GRADES[item?.grade] && Array.isArray(item.attrs)) : [];
    for (const item of items) {
      item.attrs = item.attrs.filter(attr => FG.ATTRS[attr?.key]);
      item.locked = Array.isArray(item.locked) ? item.locked.filter(i => Number.isInteger(i) && i >= 0 && i < item.attrs.length) : [];
    }
    const equipped = Object.fromEntries(FG.SLOT_IDS.map(slot => [slot, items.some(item => item.id === saved.equipped?.[slot] && item.slot === slot) ? saved.equipped[slot] : null]));
    state.forge = { items, equipped, nextId: Math.max(Number(saved.nextId) || 1, ...items.map(item => item.id + 1)), testSeeded: Number(saved.testSeeded) || 0 };
    return state.forge;
  }
  const equippedItems = () => { const fg = forge(); return fg.items.filter(item => fg.equipped[item.slot] === item.id); };
  // hub.js 의 장비 칸은 이름 글자만 본다.
  function syncEquipmentNames() {
    const state = hub().state;
    state.equipment = {};
    for (const item of equippedItems()) state.equipment[item.slot] = FG.itemName(item);
  }
  function alchemy() {
    const state = hub().state, saved = state.alchemy || {};
    const count = v => Math.max(0, Math.floor(Number(v) || 0));
    state.alchemy = { herbs: count(saved.herbs), spirit: count(saved.spirit),
      eaten: Object.fromEntries(Object.keys(ELIXIRS).map(id => [id, count(saved.eaten?.[id])])) };
    return state.alchemy;
  }
  const levelOf = id => Math.max(0, Math.min(MAX_LEVEL, Number(data().levels[id]) || 0));
  function bonuses() {
    if (!hub()) return {};
    const out = Object.fromEntries(STATS.map(stat => [stat.id, stat.per * levelOf(stat.id)]));
    const school = hub().state.mainSchool, special = SPECIALS[school];
    if (special) Object.assign(out, special.bonus(Math.min(special.max, Number(data().special[school]) || 0)));
    const h = hall();
    out.rerolls = h.rerolls; out.revives = h.revives;
    if (FG) for (const [key, value] of Object.entries(FG.bonusesOf(equippedItems()))) out[key] = (out[key] || 0) + value;
    if (FG) out.specials = FG.specialsOf(equippedItems());
    const eaten = alchemy().eaten;
    for (const [id, elixir] of Object.entries(ELIXIRS)) {
      for (const [key, value] of Object.entries(elixir.bonus(harmonic(eaten[id])))) out[key] = (out[key] || 0) + value;
    }
    return out;
  }
  // 출전 때 전투에 넘길 것. 걸어 둔 맹약은 판이 끝날 때 보상을 셈하려고 기억해 둔다.
  let runPacts = [], runSilverGain = 0;
  function runOptions() {
    if (!hub()) return {};
    const h = hall(), out = bonuses();
    runPacts = [...h.pacts]; runSilverGain = out.silverGain || 0;
    return { bonuses: out, pacts: [...h.pacts], banned: [...h.banned] };
  }
  const pactReward = pacts => pacts.reduce((sum, id) => sum + (B.pacts[id]?.reward || 0), 0);

  // ---- 화면 (hub.css 의 창 모양을 그대로 쓴다) ----
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
  // 시설은 무공록처럼 허브 위에 전체 화면으로 열린다: 위 줄(← 메인으로 · 이름 · 재화), 뒤 장면 그림, 오른쪽 패널.
  const sceneImage = h('img', { class: 'fac-scene', alt: '', decoding: 'async' });
  const backButton = h('button', { type: 'button', class: 'fac-back', onclick: () => close() }, '← 메인으로');
  const eyebrowEl = h('p', { class: 'fac-eyebrow' }), titleEl = h('h2', { id: 'fac-title' }), walletEl = h('p', { class: 'fac-wallet' });
  const panel = h('div', { class: 'fac-panel' });
  const screen = h('section', { class: 'fac-screen', hidden: true, 'aria-labelledby': 'fac-title' },
    sceneImage, h('div', { class: 'fac-shade', 'aria-hidden': 'true' }),
    h('header', { class: 'fac-top' }, backButton, h('div', { class: 'fac-heading' }, eyebrowEl, titleEl), walletEl),
    panel);
  screen.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
  let opener = null, current = null;
  const hubScreen = () => document.getElementById('title-screen');
  function close() {
    if (screen.hidden) return;
    screen.classList.remove('is-open');
    screen.hidden = true;
    panel.replaceChildren();
    current = null;
    document.body.classList.remove('fac-open');
    if (hubScreen()) hubScreen().inert = false;
    opener?.focus?.({ preventScroll: true });
  }
  const DRAW = { seclusion: focus => drawSeclusion(focus), hall: focus => drawHall(focus), alchemy: focus => drawAlchemy(focus), forge: focus => drawForge(focus) };
  function commit(focusSelector) {
    hub().save(); hub().render();
    DRAW[current](focusSelector);
  }
  function pips(level, max) {
    return h('span', { class: 'fac-pips', 'aria-hidden': 'true' }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < level ? 'is-on' : '' })));
  }
  function show(body, focusSelector) {
    // 다시 그려도 패널 스크롤 자리는 그대로.
    const scroll = panel.scrollTop;
    panel.replaceChildren(body);
    panel.scrollTop = scroll;
    if (!focusSelector) return;
    requestAnimationFrame(() => body.querySelector(focusSelector)?.focus({ preventScroll: true }));
  }
  function frame(eyebrow, title, ...content) {
    const state = hub().state;
    eyebrowEl.textContent = eyebrow;
    titleEl.textContent = title;
    walletEl.textContent = `은자 ${won(state.silver)} · 비급 ${won(state.manuals)}`;
    return h('div', { class: 'fac-body' }, ...content);
  }
  function open(kind) {
    if (!hub()) return;
    if (screen.hidden) opener = document.activeElement;
    current = kind;
    screen.dataset.kind = kind;
    sceneImage.src = `assets/facilities/${kind}.webp`;
    panel.scrollTop = 0;
    screen.hidden = false;
    document.body.classList.add('fac-open');
    if (hubScreen()) hubScreen().inert = true;
    DRAW[kind]();
    requestAnimationFrame(() => { screen.classList.add('is-open'); backButton.focus({ preventScroll: true }); });
  }

  // ---- 폐관동 ----
  function buy(id) {
    const stat = STATS.find(item => item.id === id), level = levelOf(id), price = cost(stat, level);
    const state = hub().state;
    if (level >= MAX_LEVEL || state.silver < price) return;
    state.silver -= price;
    data().levels[id] = level + 1;
    commit(`[data-stat="${id}"] button`);
  }
  function buySpecial(school) {
    const special = SPECIALS[school], state = hub().state, level = Number(data().special[school]) || 0, price = level + 1;
    if (level >= special.max || state.manuals < price) return;
    state.manuals -= price;
    data().special[school] = level + 1;
    commit('.fac-special button');
  }
  function drawSeclusion(focusSelector) {
    const state = hub().state;
    const rows = STATS.map(stat => {
      const level = levelOf(stat.id), maxed = level >= MAX_LEVEL, price = cost(stat, level);
      return h('li', { class: 'fac-row', 'data-stat': stat.id },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, stat.glyph),
        h('span', { class: 'fac-name' }, h('strong', {}, stat.name), h('small', {}, stat.note)),
        h('span', { class: 'fac-level' }, pips(level, MAX_LEVEL), h('small', {}, `${level} / ${MAX_LEVEL}`)),
        h('span', { class: 'fac-value' }, level ? stat.show(stat.per * level) : '—',
          maxed ? null : h('small', {}, `다음 ${stat.show(stat.per * (level + 1))}`)),
        h('button', { type: 'button', class: 'fac-buy', disabled: maxed || state.silver < price,
          'aria-label': maxed ? `${stat.name} 최고 단계` : `${stat.name} ${level + 1}단계로 강화, 은자 ${price}`,
          onclick: () => buy(stat.id) }, maxed ? '완성' : `銀 ${won(price)}`));
    });
    const school = state.mainSchool, special = SPECIALS[school];
    let specialBox;
    if (special) {
      const level = Math.min(special.max, Number(data().special[school]) || 0), maxed = level >= special.max;
      specialBox = h('div', { class: 'fac-special' },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, special.glyph),
        h('span', { class: 'fac-name' }, h('strong', {}, `주세력 특수 · ${special.name}`), h('small', {}, special.note)),
        h('span', { class: 'fac-level' }, pips(level, special.max), h('small', {}, `${level} / ${special.max}`)),
        h('span', { class: 'fac-value' }, level ? special.show(level) : '—'),
        h('button', { type: 'button', class: 'fac-buy', disabled: maxed || state.manuals < level + 1,
          'aria-label': maxed ? `${special.name} 최고 단계` : `${special.name} ${level + 1}단계, 비급 ${level + 1}`,
          onclick: () => buySpecial(school) }, maxed ? '완성' : `書 ${level + 1}`));
    } else {
      specialBox = h('p', { class: 'fac-special is-empty' }, '이 주세력의 특수 능력치는 무공 설계와 함께 열립니다.');
    }
    show(frame('閉關洞 · 폐관동', '기본 능력을 끌어올리는 곳',
      h('ul', { class: 'fac-list' }, ...rows),
      specialBox,
      h('p', { class: 'fac-note' }, '강화는 다음 출전부터 적용됩니다. 수치는 임시값입니다.')), focusSelector);
  }

  // ---- 연무장 ----
  function togglePact(id) {
    const hl = hall();
    hl.pacts = hl.pacts.includes(id) ? hl.pacts.filter(p => p !== id) : [...hl.pacts, id];
    commit(`[data-pact="${id}"]`);
  }
  function buyHall(key) {
    const item = HALL[key], hl = hall(), state = hub().state, level = hl[key];
    if (level >= item.costs.length) return;
    const price = item.costs[level], wallet = item.unit === '은자' ? 'silver' : 'manuals';
    if (state[wallet] < price) return;
    state[wallet] -= price;
    hl[key] = level + 1;
    commit(`[data-hall="${key}"] button`);
  }
  function toggleBan(id) {
    const hl = hall();
    if (hl.banned.includes(id)) hl.banned = hl.banned.filter(b => b !== id);
    else if (hl.banned.length < hl.banSlots) hl.banned = [...hl.banned, id];
    else return;
    commit(`[data-ban="${id}"]`);
  }
  function drawHall(focusSelector) {
    const state = hub().state, hl = hall();
    const pacts = Object.entries(B.pacts).map(([id, pact]) => {
      const on = hl.pacts.includes(id);
      return h('li', { class: 'fac-row fac-pact' },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, { blood: '血', solo: '孤', swift: '速' }[id]),
        h('span', { class: 'fac-name' }, h('strong', {}, pact.name), h('small', {}, PACT_TEXT[id])),
        h('span', { class: 'fac-value' }, `보상 +${Math.round(pact.reward * 100)}%`),
        h('button', { type: 'button', class: `fac-toggle${on ? ' is-on' : ''}`, 'aria-pressed': String(on), 'data-pact': id,
          onclick: () => togglePact(id) }, on ? '걸었음' : '걸기'));
    });
    const upgrades = Object.entries(HALL).map(([key, item]) => {
      const level = hl[key], max = item.costs.length, maxed = level >= max, price = item.costs[level];
      const enough = maxed ? false : state[item.unit === '은자' ? 'silver' : 'manuals'] >= price;
      return h('li', { class: 'fac-row', 'data-hall': key },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, item.glyph),
        h('span', { class: 'fac-name' }, h('strong', {}, item.name), h('small', {}, item.note)),
        h('span', { class: 'fac-level' }, pips(level, max), h('small', {}, `${level} / ${max}`)),
        h('span', { class: 'fac-value' }, level ? item.show(level) : '—', maxed ? null : h('small', {}, `다음 ${item.show(level + 1)}`)),
        h('button', { type: 'button', class: 'fac-buy', disabled: maxed || !enough,
          'aria-label': maxed ? `${item.name} 최고 단계` : `${item.name} ${level + 1}단계, ${item.unit} ${price}`,
          onclick: () => buyHall(key) }, maxed ? '완성' : `${item.unit === '은자' ? '銀' : '書'} ${won(price)}`));
    });
    const skills = window.CHEONJONG_DATA?.schools?.hwasan?.skills || [];
    const bans = skills.filter(skill => SKILL_GLYPHS[skill.id]).map(skill => {
      const on = hl.banned.includes(skill.id), full = !on && hl.banned.length >= hl.banSlots;
      return h('button', { type: 'button', class: `fac-ban${on ? ' is-on' : ''}`, 'aria-pressed': String(on), 'data-ban': skill.id,
        disabled: full, onclick: () => toggleBan(skill.id) },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, SKILL_GLYPHS[skill.id]), skill.name);
    });
    const reward = pactReward(hl.pacts);
    show(frame('演武場 · 연무장', '수련의 규칙을 다듬는 곳',
      h('h3', {}, `고난도 맹약 · 다음 출전에 걸림${reward ? ` · 보상 +${Math.round(reward * 100)}%` : ''}`),
      h('ul', { class: 'fac-list' }, ...pacts),
      h('h3', {}, '수련 강화'),
      h('ul', { class: 'fac-list' }, ...upgrades),
      h('h3', {}, `폐공 · ${hl.banned.length} / ${hl.banSlots}칸`),
      hl.banSlots ? h('div', { class: 'fac-bans' }, ...bans) : h('p', { class: 'fac-note' }, '폐공 칸을 열면 이번 판 선택지에 안 나올 무공을 고를 수 있습니다.'),
      h('p', { class: 'fac-note' }, '맹약 보상은 은자 보상에 더해집니다. 수치는 임시값입니다.')), focusSelector);
  }

  // ---- 연단방 ----
  function brew(id) {
    const elixir = ELIXIRS[id], al = alchemy(), state = hub().state;
    if (al.herbs < elixir.herbs || al.spirit < elixir.spirit || state.silver < elixir.silver) return;
    al.herbs -= elixir.herbs; al.spirit -= elixir.spirit; state.silver -= elixir.silver;
    al.eaten[id] += 1;
    commit(`[data-elixir="${id}"] button`);
  }
  function drawAlchemy(focusSelector) {
    const state = hub().state, al = alchemy();
    const rows = Object.entries(ELIXIRS).map(([id, elixir]) => {
      const n = al.eaten[id], ready = al.herbs >= elixir.herbs && al.spirit >= elixir.spirit && state.silver >= elixir.silver;
      return h('li', { class: 'fac-row fac-elixir', 'data-elixir': id },
        h('span', { class: 'fac-glyph', 'aria-hidden': 'true' }, elixir.glyph),
        h('span', { class: 'fac-name' }, h('strong', {}, elixir.name), h('small', {}, elixir.note)),
        h('span', { class: 'fac-level' }, h('small', {}, `${n}번 복용`), h('small', {}, `다음 효과 ×1/${n + 1}`)),
        h('span', { class: 'fac-value' }, n ? elixir.show(harmonic(n)) : '—',
          h('small', {}, `草 ${elixir.herbs} · 靈 ${elixir.spirit} · 銀 ${won(elixir.silver)}`)),
        h('button', { type: 'button', class: 'fac-buy', disabled: !ready,
          'aria-label': `${elixir.name} 빚어 먹기, 약재 ${elixir.herbs} 영물 ${elixir.spirit} 은자 ${elixir.silver}`,
          onclick: () => brew(id) }, '빚어 먹기'));
    });
    show(frame('煉丹房 · 연단방', '영단을 빚는 곳',
      h('p', { class: 'fac-stock' }, h('span', {}, `草 약재 ${won(al.herbs)}`), h('span', {}, `靈 영물 ${won(al.spirit)}`)),
      h('ul', { class: 'fac-list' }, ...rows),
      h('p', { class: 'fac-note' }, '약재는 일반 적이 가끔(3%), 영물은 수문장이 떨굽니다. 영단은 빚는 즉시 먹고 효과는 영구입니다. 같은 영단은 먹을수록 효과가 줄어듭니다. 수치는 임시값입니다.')), focusSelector);
  }

  // ---- 대장간 ----
  // 왼쪽 작업대(합성 · 재련 중 하나), 오른쪽 내 장비(장착 칸 + 가방 칸). 가방에서 고른 장비가 작업대로 옮겨 가고,
  // 작업대 아래에 올린 장비의 능력이 나온다. 작업대 상태는 저장하지 않는다.
  let forgeMode = 'combine', bench = [];
  const pay = (silver, spirit = 0) => {
    const state = hub().state, al = alchemy();
    if (state.silver < silver || al.spirit < spirit) return false;
    state.silver -= silver; al.spirit -= spirit;
    return true;
  };
  // forge() 는 부를 때마다 저장 객체를 새로 만든다. 조회는 지금 객체를 그대로 봐야 손에 쥔 fg 가 낡지 않는다.
  const liveForge = () => hub().state.forge || forge();
  const itemById = id => liveForge().items.find(i => i.id === id);
  const isEquipped = item => liveForge().equipped[item.slot] === item.id;
  function setMode(mode) {
    if (forgeMode === mode) return;
    forgeMode = mode;
    // 재련은 한 개만: 합성대에 올려 둔 첫 장비를 그대로 가져간다.
    bench = mode === 'refine' ? bench.slice(0, 1) : bench.filter(id => !isEquipped(itemById(id)));
    DRAW.forge(`.fg-tab[data-mode="${mode}"]`);
  }
  // 가방 칸을 누르면: 재련은 그 장비로 바꾸고, 합성은 같은 부위 · 같은 등급이면 더 올리고 아니면 새로 시작한다.
  function pick(id) {
    const item = itemById(id);
    if (!item) return;
    if (bench.includes(id)) bench = bench.filter(b => b !== id);
    else if (forgeMode === 'refine') bench = [id];
    else {
      if (isEquipped(item)) return;
      const first = itemById(bench[0]), need = FG.GRADES[item.grade].combine;
      if (first && first.slot === item.slot && first.grade === item.grade && bench.length < need) bench = [...bench, id];
      else bench = [id];
    }
    DRAW.forge(`[data-inv="${id}"]`);
  }
  // 합성대를 같은 부위 · 같은 등급(장착 안 한 것)으로 가득 채운다.
  function fillBench() {
    const first = itemById(bench[0]);
    if (!first) return;
    const plan = FG.combineCandidates(forge().items, first.slot, first.grade, Object.values(forge().equipped));
    bench = [...bench, ...plan.use.map(i => i.id).filter(id => !bench.includes(id))].slice(0, plan.need);
    DRAW.forge('.fg-fill');
  }
  function toggleEquip(id) {
    const fg = forge(), item = itemById(id);
    if (!item) return;
    fg.equipped[item.slot] = fg.equipped[item.slot] === id ? null : id;
    syncEquipmentNames(); commit('.fg-equip');
  }
  function combine() {
    const fg = forge(), items = bench.map(itemById).filter(Boolean), first = items[0];
    if (!first) return;
    const need = FG.GRADES[first.grade].combine;
    if (!need || items.length !== need || items.some(i => i.slot !== first.slot || i.grade !== first.grade || isEquipped(i))) return;
    if (!pay(FG.GRADES[first.grade].combineSilver)) return;
    const used = new Set(bench);
    fg.items = fg.items.filter(item => !used.has(item.id));
    const made = FG.makeItem(first.slot, first.grade + 1, Math.random, fg.nextId++);
    fg.items.push(made);
    bench = [made.id];
    commit('.fg-go');
  }
  function toggleLock(id, index) {
    const item = itemById(id);
    if (!item) return;
    FG.toggleLock(item, index);
    commit(`.fg-lock[data-attr="${index}"]`);
  }
  function reroll(id) {
    const item = itemById(id);
    const plan = item && FG.rerollPlan(item);
    if (!plan?.possible || !pay(plan.silver, plan.spirit)) return;
    FG.rerollItem(item, Math.random);
    commit('.fg-go');
  }
  function salvage(id) {
    const fg = forge(), item = itemById(id);
    if (!item || isEquipped(item)) return;
    fg.items = fg.items.filter(i => i.id !== id);
    bench = bench.filter(b => b !== id);
    hub().state.silver += FG.GRADES[item.grade].salvage;
    commit();
  }
  // 테스트: 가방을 모든 슬롯 · 모든 등급 장비로 갈아 끼우고(장착 해제), 은자 · 비급 · 영물을 넉넉히 채운다.
  // TEST_SEED 를 올리면 이미 받은 사람도 대장간을 열 때 한 번 더 받는다.
  const TEST_SEED = 2, TEST_FILL = 100000000;
  function testReset() {
    const fg = forge(), al = alchemy(), state = hub().state;
    fg.items = FG.testSet(Math.random, fg.nextId);
    fg.nextId += fg.items.length;
    for (const slot of FG.SLOT_IDS) fg.equipped[slot] = null;
    fg.testSeeded = TEST_SEED;
    bench = [];
    state.silver = Math.max(state.silver, TEST_FILL);
    state.manuals = Math.max(state.manuals, TEST_FILL);
    al.spirit = Math.max(al.spirit, TEST_FILL);
    syncEquipmentNames(); commit('.fac-test');
  }
  // 네모 칸: 부위 글자 + 등급 색 틀. 장착 중이면 모서리 점.
  function cell(item, { class: extra = '', onclick, ...rest } = {}) {
    return h('button', { type: 'button', class: `fg-cell grade-${item.grade}${isEquipped(item) ? ' is-on' : ''}${extra ? ' ' + extra : ''}`,
      title: `${FG.itemName(item)}${isEquipped(item) ? ' · 장착 중' : ''}`, 'aria-label': `${FG.itemName(item)}${isEquipped(item) ? ', 장착 중' : ''}`,
      ...rest, onclick: onclick || (() => pick(item.id)) }, FG.SLOTS[item.slot].glyph);
  }
  function attrLines(item, withLocks) {
    return h('ul', { class: 'fg-attrs' }, ...item.attrs.map((attr, index) => {
      const locked = item.locked.includes(index), fixed = FG.ATTRS[attr.key].fixed;
      return h('li', { class: locked ? 'is-locked' : '' },
        withLocks ? h('button', { type: 'button', class: `fac-mini fac-lock fg-lock${locked ? ' is-on' : ''}`, 'data-attr': index, 'aria-pressed': String(locked),
          'aria-label': `${FG.describe(attr)} ${locked ? '고정 풀기' : '고정'}`, onclick: () => toggleLock(item.id, index) }, locked ? '固' : '·') : '',
        h('span', {}, FG.describe(attr)),
        fixed ? '' : h('small', { class: `fac-tier tier-${attr.tier}`, title: `${attr.tier} / 7단계` }, `${attr.tier}단`));
    }),
    FG.SPECIALS[item.special] ? h('li', { class: 'fac-special-opt' }, `傳 ${FG.SPECIALS[item.special].name} — ${FG.SPECIALS[item.special].note}`) : '');
  }
  function drawCombine(state) {
    const items = bench.map(itemById).filter(Boolean), first = items[0];
    const grade = first ? FG.GRADES[first.grade] : null, need = grade?.combine || 3;
    const slots = Array.from({ length: need }, (_, i) => items[i]
      ? cell(items[i], { class: 'is-big', onclick: () => pick(items[i].id), 'aria-label': `${FG.itemName(items[i])} 내리기` })
      : h('span', { class: 'fg-cell is-big is-empty', 'aria-hidden': 'true' }));
    const full = Boolean(first && grade.combine && items.length === need);
    const have = first ? FG.combineCandidates(forge().items, first.slot, first.grade, Object.values(forge().equipped)).have : 0;
    return [
      h('div', { class: 'fg-slots' }, ...slots,
        h('span', { class: 'fg-arrow', 'aria-hidden': 'true' }, '→'),
        h('span', { class: `fg-cell is-big is-result${first && grade.combine ? ` grade-${first.grade + 1}` : ' is-empty'}`, 'aria-hidden': 'true' },
          first && grade.combine ? FG.SLOTS[first.slot].glyph : '?')),
      h('p', { class: 'fac-note' }, !first ? '오른쪽 가방에서 같은 부위 · 같은 등급 장비를 골라 올리세요(범품 3 · 양품 4 · 상품 5 · 극품 6 · 신품 7개, 장착 중인 장비는 못 씀).'
        : !grade.combine ? '신병이기는 더 합성할 수 없습니다.'
        : `${grade.name} ${FG.SLOTS[first.slot].noun} ${items.length} / ${need} → ${FG.GRADES[first.grade + 1].name} 1개 · 가방에 같은 것 ${have}개`),
      h('div', { class: 'fg-buttons' },
        h('button', { type: 'button', class: 'fac-toggle fg-fill', disabled: !first || !grade.combine || items.length >= need || have <= items.length, onclick: fillBench }, '같은 장비 채우기'),
        h('button', { type: 'button', class: 'fac-buy fg-go', disabled: !full || state.silver < grade.combineSilver, onclick: combine },
          grade?.combine ? `합성 · 銀 ${won(grade.combineSilver)}` : '합성')),
      items.length ? h('div', { class: 'fg-info' }, ...items.map(item => h('section', { class: `fg-card grade-${item.grade}` },
        h('strong', {}, FG.itemName(item)), attrLines(item, false)))) : '',
    ];
  }
  function drawRefine(state, al) {
    const item = itemById(bench[0]);
    if (!item) return [h('div', { class: 'fg-slots' }, h('span', { class: 'fg-cell is-big is-empty', 'aria-hidden': 'true' })),
      h('p', { class: 'fac-note' }, '오른쪽 가방에서 재련할 장비를 고르세요.')];
    const on = isEquipped(item), plan = FG.rerollPlan(item), grade = FG.GRADES[item.grade];
    const canReroll = plan.possible && state.silver >= plan.silver && al.spirit >= plan.spirit;
    return [
      h('div', { class: 'fg-slots' }, cell(item, { class: 'is-big', 'aria-label': `${FG.itemName(item)} 내리기` })),
      h('div', { class: 'fg-buttons' },
        h('button', { type: 'button', class: 'fac-buy fg-go', disabled: !canReroll, onclick: () => reroll(item.id),
          title: plan.possible ? '' : '고정 안 한 옵션이 하나는 있어야 재련할 수 있습니다' },
          `재련 · 銀 ${won(plan.silver)} · 영물 ${won(plan.spirit)}`)),
      h('section', { class: `fg-card grade-${item.grade}` },
        h('strong', {}, FG.itemName(item), on ? ' · 장착 중' : ''), attrLines(item, true),
        h('p', { class: 'fac-note' }, `고정(固)하지 않은 옵션을 모두 다시 굴립니다. 고정 하나마다 비용 2배. 전설(傳) 옵션은 고정할 수 없고 늘 같이 돕니다.`),
        h('div', { class: 'fg-buttons' },
          h('button', { type: 'button', class: `fac-toggle fg-equip${on ? ' is-on' : ''}`, 'aria-pressed': String(on), onclick: () => toggleEquip(item.id) }, on ? '해제' : '장착'),
          h('button', { type: 'button', class: 'fac-toggle', disabled: on, onclick: () => salvage(item.id) }, `분해 +銀 ${won(grade.salvage)}`))),
    ];
  }
  function drawForge(focusSelector) {
    if (forge().testSeeded !== TEST_SEED) return testReset();
    const state = hub().state, fg = forge(), al = alchemy();
    bench = bench.filter(id => itemById(id));
    const tabs = h('div', { class: 'fg-tabs', role: 'tablist' }, ...[['combine', '합성'], ['refine', '재련']].map(([mode, label]) =>
      h('button', { type: 'button', role: 'tab', class: `fg-tab${forgeMode === mode ? ' is-on' : ''}`, 'data-mode': mode,
        'aria-selected': String(forgeMode === mode), onclick: () => setMode(mode) }, label)));
    const left = h('section', { class: 'fg-bench', 'aria-label': '대장간' }, tabs,
      ...(forgeMode === 'combine' ? drawCombine(state) : drawRefine(state, al)));
    const worn = h('div', { class: 'fg-worn' }, ...FG.SLOT_IDS.map(slot => {
      const item = itemById(fg.equipped[slot]);
      return item ? cell(item, { class: bench.includes(item.id) ? 'is-picked' : '', 'data-inv': item.id })
        : h('span', { class: 'fg-cell is-empty', title: `${FG.SLOTS[slot].label} · 비어 있음` }, FG.SLOTS[slot].glyph);
    }));
    const bag = fg.items.filter(item => !bench.includes(item.id))
      .sort((a, b) => b.grade - a.grade || FG.SLOT_IDS.indexOf(a.slot) - FG.SLOT_IDS.indexOf(b.slot) || a.id - b.id)
      .map(item => cell(item, { 'data-inv': item.id, disabled: forgeMode === 'combine' && isEquipped(item) }));
    const legend = h('p', { class: 'fg-legend' }, ...FG.GRADES.map(g => h('span', { class: `grade-${g.index}` }, g.name)));
    const right = h('section', { class: 'fg-inv', 'aria-label': '내 장비' },
      h('h3', {}, '장착'), worn,
      h('h3', {}, `가방 · ${fg.items.length}개 · 영물 ${won(al.spirit)}`), legend,
      bag.length ? h('div', { class: 'fg-grid' }, ...bag) : h('p', { class: 'fac-note' }, '수문장을 쓰러뜨리면 범품 장비가 하나씩 들어옵니다.'),
      h('p', { class: 'fac-note' }, '장비는 다음 출전부터 적용됩니다. 수치는 임시값입니다.'),
      h('div', { class: 'fac-row fg-test' },
        h('span', { class: 'fac-name' }, h('strong', {}, '테스트 · 장비 초기화'),
          h('small', {}, `모든 부위 × 모든 등급을 다시 넣고 은자 · 비급 · 영물을 ${won(TEST_FILL)}까지 채움`)),
        h('button', { type: 'button', class: 'fac-buy fac-test', onclick: testReset }, '초기화')));
    show(frame('鍛冶場 · 대장간', '장비를 다듬는 곳', h('div', { class: 'fg-layout' }, left, right)), focusSelector);
  }

  // ---- 판이 끝나면 전리품을 넣는다: 재료는 연단방, 장비는 대장간 가방 ----
  window.addEventListener('cheon:run-end', event => {
    const loot = event.detail?.loot;
    if (!hub() || !loot || (!loot.herbs && !loot.spirit && !loot.gear)) return;
    const al = alchemy();
    al.herbs += Math.max(0, Math.floor(loot.herbs || 0));
    al.spirit += Math.max(0, Math.floor(loot.spirit || 0));
    if (FG) {
      const fg = forge();
      for (let i = 0; i < Math.max(0, Math.floor(loot.gear || 0)); i++) fg.items.push(FG.makeItem(FG.randomSlot(Math.random), 0, Math.random, fg.nextId++));
    }
    hub().save();
  });

  // ---- 맹약 보상: hub.js 의 보상 정산 뒤에 더한다 ----
  window.addEventListener('cheon:run-end', event => {
    if (!hub() || !runPacts.length) return;
    const { won: victory, difficulty = { count: 1, attack: 1, health: 1 }, kills = 0 } = event.detail || {};
    const factor = Math.cbrt(difficulty.count * difficulty.attack * difficulty.health);
    const extra = Math.round((kills + (victory ? 100 : 0)) * factor * pactReward(runPacts));
    runPacts = [];
    if (!extra) return;
    const state = hub().state;
    state.silver += extra;
    if (state.lastReward) state.lastReward.silver += extra;
    hub().save(); hub().render();
  });

  // ---- 대장간 은자 수량: 이번 판 은자 보상(맹약 포함)에 비율만큼 더한다 ----
  window.addEventListener('cheon:run-end', () => {
    const gain = runSilverGain; runSilverGain = 0;
    const state = hub()?.state;
    if (!state?.lastReward || !gain) return;
    const extra = Math.round(state.lastReward.silver * gain);
    if (!extra) return;
    state.silver += extra; state.lastReward.silver += extra;
    hub().save(); hub().render();
  });

  function start() {
    document.body.append(screen);
    // 네 시설 버튼은 hub.js 의 "준비 중" 창 대신 이 화면을 연다.
    for (const kind of ['seclusion', 'hall', 'alchemy', 'forge']) {
      document.querySelectorAll(`[data-facility="${kind}"]`).forEach(button => button.addEventListener('click', event => {
        event.stopImmediatePropagation();
        open(kind);
      }, true));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.CheonFacilities = { bonuses, runOptions, openSeclusion: () => open('seclusion'), openHall: () => open('hall'),
    openAlchemy: () => open('alchemy'), openForge: () => open('forge'), stats: STATS, cost, elixirs: ELIXIRS };
})();
