/* 시설(3단계)
 * 폐관동 — 은자로 기본 능력치를 영구 강화하고, 주세력 특수 능력치는 비급으로 올린다(저장 seclusion).
 * 연무장 — 고난도 맹약(무료, 다음 출전에 걸림), 새로고침 · 부활 횟수, 폐공 칸과 폐공 무공(저장 hall).
 * 저장은 hub.js 의 저장 데이터(window.CheonHub.state)에 함께 들어간다.
 * 출전할 때 game-controller.js 가 runOptions() 를 전투 코어 createRun 에 넘긴다(bonuses · pacts · banned).
 * 맹약 보상은 판이 끝날 때(cheon:run-end) hub.js 의 은자 보상 뒤에 더한다.
 * 수치는 docs/시설-경제-기획.md 의 임시값. 연단방·대장간은 아직 hub.js 의 "준비 중" 창. */
(() => {
  'use strict';
  const hub = () => window.CheonHub;
  const B = window.CHEONJONG_BALANCE;
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
  const levelOf = id => Math.max(0, Math.min(MAX_LEVEL, Number(data().levels[id]) || 0));
  function bonuses() {
    if (!hub()) return {};
    const out = Object.fromEntries(STATS.map(stat => [stat.id, stat.per * levelOf(stat.id)]));
    const school = hub().state.mainSchool, special = SPECIALS[school];
    if (special) Object.assign(out, special.bonus(Math.min(special.max, Number(data().special[school]) || 0)));
    const h = hall();
    out.rerolls = h.rerolls; out.revives = h.revives;
    return out;
  }
  // 출전 때 전투에 넘길 것. 걸어 둔 맹약은 판이 끝날 때 보상을 셈하려고 기억해 둔다.
  let runPacts = [];
  function runOptions() {
    if (!hub()) return {};
    const h = hall();
    runPacts = [...h.pacts];
    return { bonuses: bonuses(), pacts: [...h.pacts], banned: [...h.banned] };
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
  const modal = h('div', { class: 'hub-modal fac-modal', hidden: true, onclick: event => { if (event.target === modal) close(); } });
  modal.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
  let opener = null, current = null;
  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.replaceChildren();
    current = null;
    opener?.focus?.({ preventScroll: true });
  }
  function commit(focusSelector) {
    hub().save(); hub().render();
    (current === 'hall' ? drawHall : drawSeclusion)(focusSelector);
  }
  function pips(level, max) {
    return h('span', { class: 'fac-pips', 'aria-hidden': 'true' }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < level ? 'is-on' : '' })));
  }
  function show(card, focusSelector) {
    modal.replaceChildren(card);
    requestAnimationFrame(() => {
      const target = (focusSelector && card.querySelector(focusSelector)) || card.querySelector('.fac-buy:not(:disabled), .fac-toggle') || card.querySelector('.hub-close');
      target?.focus({ preventScroll: true });
    });
  }
  function frame(eyebrow, title, ...content) {
    const state = hub().state;
    return h('section', { class: 'hub-dialog fac-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fac-title' },
      h('button', { type: 'button', class: 'hub-close', 'aria-label': '닫기', onclick: close }, '×'),
      h('p', { class: 'hub-eyebrow' }, eyebrow),
      h('h2', { id: 'fac-title' }, title),
      h('p', { class: 'fac-wallet' }, `은자 ${won(state.silver)} · 비급 ${won(state.manuals)}`),
      ...content,
      h('div', { class: 'hub-dialog-footer' }, h('button', { type: 'button', class: 'hub-secondary', onclick: close }, '닫기')));
  }
  function open(kind) {
    if (!hub()) return;
    if (modal.hidden) opener = document.activeElement;
    modal.hidden = false;
    current = kind;
    (kind === 'hall' ? drawHall : drawSeclusion)();
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

  function start() {
    document.body.append(modal);
    // 폐관동 · 연무장 버튼은 hub.js 의 "준비 중" 창 대신 이 화면을 연다.
    for (const kind of ['seclusion', 'hall']) {
      document.querySelectorAll(`[data-facility="${kind}"]`).forEach(button => button.addEventListener('click', event => {
        event.stopImmediatePropagation();
        open(kind);
      }, true));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.CheonFacilities = { bonuses, runOptions, openSeclusion: () => open('seclusion'), openHall: () => open('hall'), stats: STATS, cost };
})();
