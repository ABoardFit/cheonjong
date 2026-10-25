/* 시설(3단계): 폐관동 — 은자로 기본 능력치를 영구 강화하고, 주세력 특수 능력치는 비급으로 올린다.
 * 저장은 hub.js 의 저장 데이터(window.CheonHub.state.seclusion)에 함께 들어간다.
 * 출전할 때 game-controller.js 가 bonuses() 를 전투 코어 createRun({ bonuses }) 에 넘긴다.
 * 수치는 docs/시설-경제-기획.md 의 임시값. 나머지 시설(연무장·연단방·대장간)은 아직 hub.js 의 "준비 중" 창. */
(() => {
  'use strict';
  const hub = () => window.CheonHub;
  const MAX_LEVEL = 10, GROWTH = 1.5;
  const pct = v => `${Math.round(v * 1000) / 10}%`;
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

  const cost = (stat, level) => Math.round(stat.base * GROWTH ** level / 10) * 10;
  function data() {
    const state = hub().state;
    const saved = state.seclusion || {};
    state.seclusion = { levels: { ...saved.levels }, special: { ...saved.special } };
    return state.seclusion;
  }
  const levelOf = id => Math.max(0, Math.min(MAX_LEVEL, Number(data().levels[id]) || 0));
  function bonuses() {
    if (!hub()) return {};
    const out = Object.fromEntries(STATS.map(stat => [stat.id, stat.per * levelOf(stat.id)]));
    const school = hub().state.mainSchool, special = SPECIALS[school];
    if (special) Object.assign(out, special.bonus(Math.min(special.max, Number(data().special[school]) || 0)));
    return out;
  }

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
  let opener = null;
  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.replaceChildren();
    opener?.focus?.({ preventScroll: true });
  }
  function buy(id) {
    const stat = STATS.find(item => item.id === id), level = levelOf(id), price = cost(stat, level);
    const state = hub().state;
    if (level >= MAX_LEVEL || state.silver < price) return;
    state.silver -= price;
    data().levels[id] = level + 1;
    hub().save(); hub().render(); draw(`[data-stat="${id}"] button`);
  }
  function buySpecial(school) {
    const special = SPECIALS[school], state = hub().state, level = Number(data().special[school]) || 0, price = level + 1;
    if (level >= special.max || state.manuals < price) return;
    state.manuals -= price;
    data().special[school] = level + 1;
    hub().save(); hub().render(); draw('.fac-special button');
  }
  function pips(level, max) {
    return h('span', { class: 'fac-pips', 'aria-hidden': 'true' }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < level ? 'is-on' : '' })));
  }
  function draw(focusSelector) {
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
          onclick: () => buy(stat.id) }, maxed ? '완성' : `銀 ${price.toLocaleString('ko-KR')}`));
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
    const card = h('section', { class: 'hub-dialog fac-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fac-title' },
      h('button', { type: 'button', class: 'hub-close', 'aria-label': '닫기', onclick: close }, '×'),
      h('p', { class: 'hub-eyebrow' }, '閉關洞 · 폐관동'),
      h('h2', { id: 'fac-title' }, '기본 능력을 끌어올리는 곳'),
      h('p', { class: 'fac-wallet' }, `은자 ${state.silver.toLocaleString('ko-KR')} · 비급 ${state.manuals.toLocaleString('ko-KR')}`),
      h('ul', { class: 'fac-list' }, ...rows),
      specialBox,
      h('p', { class: 'fac-note' }, '강화는 다음 출전부터 적용됩니다. 수치는 임시값입니다.'),
      h('div', { class: 'hub-dialog-footer' }, h('button', { type: 'button', class: 'hub-secondary', onclick: close }, '닫기')));
    modal.replaceChildren(card);
    requestAnimationFrame(() => {
      const target = (focusSelector && card.querySelector(focusSelector)) || card.querySelector('.fac-buy:not(:disabled)') || card.querySelector('.hub-close');
      target?.focus({ preventScroll: true });
    });
  }
  function openSeclusion() {
    if (!hub()) return;
    if (modal.hidden) opener = document.activeElement;
    modal.hidden = false;
    draw();
  }

  function start() {
    document.body.append(modal);
    // 폐관동 버튼은 hub.js 의 "준비 중" 창 대신 이 화면을 연다.
    document.querySelectorAll('[data-facility="seclusion"]').forEach(button => button.addEventListener('click', event => {
      event.stopImmediatePropagation();
      openSeclusion();
    }, true));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.CheonFacilities = { bonuses, openSeclusion, stats: STATS, cost };
})();
