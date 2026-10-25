/* 대장간 장비 규칙(화면 없음). 슬롯 5개, 등급 5개(범품 → 신품), 속성은 슬롯마다 나올 수 있는 것에서 굴린다.
 * 드랍은 범품만, 위 등급은 합성으로만 만든다(같은 슬롯 · 같은 등급 3 · 4 · 5 · 6개 → 한 등급 위 1개).
 * 수치는 docs/시설-경제-기획.md 의 임시값. rng 는 0~1 을 돌려주는 함수(테스트에서 바꿔 끼움). */
(function (root) {
  'use strict';
  // [이름, 속성 수, 값 배율, 다음 등급으로 합성할 때 필요 수, 합성 은자, 속성 변경 은자, 분해 은자]
  const GRADES = [
    ['범품', 1, 1, 3, 2500, 1500, 300],
    ['양품', 2, 1.6, 4, 7500, 4000, 1200],
    ['상품', 2, 2.4, 5, 20000, 10000, 4000],
    ['극품', 3, 3.4, 6, 50000, 25000, 12000],
    ['신품', 4, 4.6, 0, 0, 60000, 35000],
  ].map(([name, attrs, scale, combine, combineSilver, rerollSilver, salvage], index) =>
    ({ index, name, attrs, scale, combine, combineSilver, rerollSilver, salvage }));
  const SLOTS = {
    weapon: { label: '무기', glyph: '劍', noun: '검', pool: ['damage', 'critChance', 'critDamage'] },
    robe: { label: '의복', glyph: '袍', noun: '도포', pool: ['hp', 'reduction', 'innerForce'] },
    belt: { label: '요대', glyph: '帶', noun: '요대', pool: ['hp', 'innerForce', 'reduction'] },
    boots: { label: '신발', glyph: '靴', noun: '신발', pool: ['speed', 'innerForce', 'hp'] },
    charm: { label: '장신구', glyph: '佩', noun: '패옥', pool: ['area', 'critChance', 'critDamage', 'innerForce'] },
  };
  // 범품 한 줄의 값 범위. 등급 배율을 곱한다. pct = 비율(표시는 %).
  const ATTRS = {
    damage: { name: '공력', min: 0.02, max: 0.04, pct: true },
    critChance: { name: '치명타 확률', min: 0.01, max: 0.02, pct: true, point: true },
    critDamage: { name: '치명타 피해', min: 0.04, max: 0.08, pct: true, point: true },
    hp: { name: '체력', min: 6, max: 12 },
    reduction: { name: '피해 감소', min: 0.01, max: 0.02, pct: true },
    innerForce: { name: '내력', min: 5, max: 10 },
    speed: { name: '이동 속도', min: 0.01, max: 0.02, pct: true },
    area: { name: '범위', min: 0.02, max: 0.04, pct: true },
  };
  const SLOT_IDS = Object.keys(SLOTS);

  function rollValue(key, grade, rng) {
    const a = ATTRS[key], raw = (a.min + (a.max - a.min) * rng()) * GRADES[grade].scale;
    return a.pct ? Math.round(raw * 1000) / 1000 : Math.round(raw);
  }
  // 속성 줄: 슬롯 목록에서 겹치지 않게 고르고, 목록보다 많이 필요하면 다시 고른다.
  function rollKeys(slot, count, rng) {
    const pool = SLOTS[slot].pool.slice(), keys = [];
    while (keys.length < count) {
      const left = pool.filter(k => !keys.includes(k));
      const from = left.length ? left : pool;
      keys.push(from[Math.floor(rng() * from.length) % from.length]);
    }
    return keys;
  }
  function makeItem(slot, grade, rng, id) {
    return { id, slot, grade, attrs: rollKeys(slot, GRADES[grade].attrs, rng).map(key => ({ key, value: rollValue(key, grade, rng) })) };
  }
  const randomSlot = rng => SLOT_IDS[Math.floor(rng() * SLOT_IDS.length) % SLOT_IDS.length];
  const itemName = item => `${GRADES[item.grade].name} ${SLOTS[item.slot].noun}`;
  function describe(attr) {
    const a = ATTRS[attr.key];
    if (!a.pct) return `${a.name} +${attr.value}`;
    return `${a.name} +${Math.round(attr.value * 1000) / 10}%${a.point ? 'p' : ''}`;
  }
  function bonusesOf(items) {
    const out = {};
    for (const item of items) for (const attr of item.attrs) out[attr.key] = (out[attr.key] || 0) + attr.value;
    return out;
  }
  // 합성: 같은 슬롯 · 같은 등급의 (장착하지 않은) 장비 목록 → 필요 수와 쓸 장비.
  function combineCandidates(items, slot, grade, equippedIds = []) {
    const g = GRADES[grade];
    const pool = items.filter(item => item.slot === slot && item.grade === grade && !equippedIds.includes(item.id));
    return { need: g.combine, have: pool.length, use: g.combine ? pool.slice(0, g.combine) : [], silver: g.combineSilver,
      possible: Boolean(g.combine) && pool.length >= g.combine };
  }
  // 속성 하나를 다시 굴린다(다른 줄과 겹치지 않는 속성을 먼저).
  function rerollAttr(item, index, rng) {
    const others = item.attrs.filter((_, i) => i !== index).map(a => a.key);
    const pool = SLOTS[item.slot].pool, left = pool.filter(k => !others.includes(k));
    const from = left.length ? left : pool, key = from[Math.floor(rng() * from.length) % from.length];
    item.attrs[index] = { key, value: rollValue(key, item.grade, rng) };
    return item.attrs[index];
  }

  root.CheonForge = Object.freeze({ GRADES, SLOTS, ATTRS, SLOT_IDS, makeItem, randomSlot, itemName, describe, bonusesOf, combineCandidates, rerollAttr });
})(typeof window !== 'undefined' ? window : globalThis);
