/* 대장간 장비 규칙(화면 없음). 슬롯 5개, 등급 6개(범품 → 신병이기).
 * 옵션 줄 수: 범품 1 · 양품 2 · 상품 3 · 극품 4 · 신품 5 · 신병이기 5 + 전설 옵션 1(무공 메커니즘을 바꾸거나 강화).
 * 옵션은 부위 전용 하나(무기 공격력 · 의복 피해 감소 · 요대 시작 레벨 · 신발 이동 속도 · 장신구 내력)와 공용 목록에서 가중치로 뽑는다.
 *   같은 옵션은 한 장비에 두 줄까지(두 번째는 낮은 확률). 스테이지 진행 속도 · 캐릭터 크기는 원래 드물다.
 *   값은 7단계 — 높은 단계일수록 드물다.
 * 옵션 변경은 고정하지 않은 줄을 모두 다시 굴린다(전설 옵션은 고정할 수 없고 늘 같이 돈다).
 *   고정한 줄 하나마다 비용 2배, 고정 안 한 줄이 하나는 있어야 돌릴 수 있다.
 * 드랍은 범품만, 위 등급은 합성으로만 만든다(같은 슬롯 · 같은 등급 3 · 4 · 5 · 6 · 7개 → 한 등급 위 1개).
 * 수치는 docs/시설-경제-기획.md 의 임시값. rng 는 0~1 을 돌려주는 함수(테스트에서 바꿔 끼움). */
(function (root) {
  'use strict';
  // [이름, 옵션 수, 값 배율, 다음 등급으로 합성할 때 필요 수, 합성 은자, 옵션 변경 은자, 분해 은자]
  const GRADES = [
    ['범품', 1, 1, 3, 2500, 1500, 300],
    ['양품', 2, 1.6, 4, 7500, 4000, 1200],
    ['상품', 3, 2.4, 5, 20000, 10000, 4000],
    ['극품', 4, 3.4, 6, 50000, 25000, 12000],
    ['신품', 5, 4.6, 7, 120000, 60000, 35000],
    ['신병이기', 5, 6, 0, 0, 150000, 90000],
  ].map(([name, attrs, scale, combine, combineSilver, rerollSilver, salvage], index) =>
    ({ index, name, attrs, scale, combine, combineSilver, rerollSilver, salvage }));
  const SLOTS = {
    weapon: { label: '무기', glyph: '劍', noun: '검' },
    robe: { label: '의복', glyph: '袍', noun: '도포' },
    belt: { label: '요대', glyph: '帶', noun: '요대' },
    boots: { label: '신발', glyph: '靴', noun: '신발' },
    charm: { label: '장신구', glyph: '佩', noun: '패옥' },
  };
  // 범품 한 줄의 값 범위(1단계 min ~ 7단계 max). 등급 배율을 곱한다.
  // slot = 그 부위 전용, weight = 뽑힐 무게(기본 10), pct = 비율(표시는 %), digits = 소수 자리, signed = ± 어느 쪽으로도, fixed = 단계 · 등급과 무관.
  const ATTRS = {
    damage: { name: '공격력', min: 0.02, max: 0.04, pct: true, slot: 'weapon' },
    reduction: { name: '피해 감소', min: 0.01, max: 0.02, pct: true, slot: 'robe' },
    startLevel: { name: '시작 레벨', min: 1, max: 1, slot: 'belt', fixed: true },
    speed: { name: '이동 속도', min: 0.02, max: 0.04, pct: true, slot: 'boots' },
    innerForce: { name: '내력', min: 5, max: 10, slot: 'charm' },
    hp: { name: '체력', min: 8, max: 16 },
    xpGain: { name: '경험치 획득', min: 0.03, max: 0.06, pct: true },
    pickupRange: { name: '획득 범위', min: 0.05, max: 0.1, pct: true },
    area: { name: '스킬 범위', min: 0.02, max: 0.04, pct: true },
    cooldown: { name: '재사용 대기시간 감소', min: 0.02, max: 0.04, pct: true },
    attackSpeed: { name: '공격 속도', min: 0.02, max: 0.04, pct: true },
    regen: { name: '초당 생명력 재생', min: 0.1, max: 0.2, digits: 2 },
    projectileSpeed: { name: '투사체 속도', min: 0.05, max: 0.1, pct: true },
    size: { name: '캐릭터 크기', min: 0.03, max: 0.06, pct: true, signed: true, weight: 2 },
    dodge: { name: '회피 확률', min: 0.01, max: 0.02, pct: true, point: true },
    dropChance: { name: '아이템 획득 확률', min: 0.05, max: 0.1, pct: true },
    silverGain: { name: '은자 수량', min: 0.03, max: 0.06, pct: true },
    specialChance: { name: '특수 아이템 등장 확률', min: 0.1, max: 0.2, pct: true },
    critChance: { name: '치명타 확률', min: 0.01, max: 0.02, pct: true, point: true },
    critDamage: { name: '치명타 피해배율', min: 0.04, max: 0.08, pct: true, point: true },
    stageSpeed: { name: '스테이지 진행 속도', min: 0.02, max: 0.04, pct: true, weight: 2 },
  };
  const SLOT_IDS = Object.keys(SLOTS);
  const poolOf = slot => Object.keys(ATTRS).filter(key => !ATTRS[key].slot || ATTRS[key].slot === slot);
  // 값 단계 1~7의 무게(높을수록 드묾)와 같은 옵션 두 번째 줄의 무게 배율.
  const TIER_WEIGHTS = [30, 24, 18, 12, 8, 5, 3];
  const DUPLICATE_WEIGHT = 0.12, MAX_SAME = 2;
  // 신병이기 전설 옵션(부위마다 둘 중 하나). 효과는 game-core.js 가 bonuses.specials 로 읽는다.
  const SPECIALS = {
    sword_echo: { slot: 'weapon', name: '매화 잔영', note: '이십사수매화검법의 검격이 0.3초 뒤 같은 자리에서 한 번 더 터진다(피해 50%)' },
    rain_extra: { slot: 'weapon', name: '만천화우', note: '매화검우가 3자루 더 떨어진다' },
    petal_thorns: { slot: 'robe', name: '매화 가시', note: '꽃잎 갑옷이 피해를 막을 때 주변 적에게 피해 30' },
    zixia_heal: { slot: 'robe', name: '자하 호신', note: '꽃잎을 주울 때마다 체력 3 회복(단신 맹약이면 없음)' },
    petal_cap: { slot: 'belt', name: '육합 보옥', note: '꽃잎 최대 보유 +2' },
    liuhe_quake: { slot: 'belt', name: '육합 진동', note: '꽃잎 갑옷이 막을 때 적을 밀쳐낸다(육합공 5단계 효과를 미리)' },
    dash_cd: { slot: 'boots', name: '암향 질풍', note: '암향표 재사용 대기 −40%' },
    landing_wave: { slot: 'boots', name: '낙화 착지', note: '경공 착지 때 늘 피해 파동(암향표 3단계 효과를 미리)' },
    rain_free: { slot: 'charm', name: '무념 검우', note: '매화검우에 내력이 들지 않는다' },
    field_long: { slot: 'charm', name: '잔향', note: '모든 장판 지속 +50%' },
  };
  const specialsFor = slot => Object.keys(SPECIALS).filter(key => SPECIALS[key].slot === slot);
  const SPECIAL_GRADE = 5;

  function weighted(entries, rng) {
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = rng() * total;
    for (const [value, w] of entries) { if ((roll -= w) < 0) return value; }
    return entries[entries.length - 1][0];
  }
  function rollValue(key, grade, rng) {
    const a = ATTRS[key];
    if (a.fixed) return { tier: 1, value: a.min };
    const tier = weighted(TIER_WEIGHTS.map((w, i) => [i + 1, w]), rng);
    const sign = a.signed && rng() < 0.5 ? -1 : 1;
    const raw = (a.min + (a.max - a.min) * (tier - 1) / 6) * GRADES[grade].scale * sign;
    const unit = a.pct ? 1000 : 10 ** (a.digits || 0);
    return { tier, value: Math.round(raw * unit) / unit };
  }
  // 한 줄: 이미 붙은 줄(taken)을 보고 무게를 정한다 — 두 번째는 DUPLICATE_WEIGHT 배, 세 번째는 없음.
  function rollLine(slot, grade, rng, taken) {
    const entries = poolOf(slot).map(key => {
      const same = taken.filter(k => k === key).length;
      return [key, same >= MAX_SAME ? 0 : (ATTRS[key].weight || 10) * (same ? DUPLICATE_WEIGHT : 1)];
    }).filter(([, w]) => w > 0);
    const key = weighted(entries, rng);
    return { key, ...rollValue(key, grade, rng) };
  }
  function makeItem(slot, grade, rng, id) {
    const attrs = [];
    for (let i = 0; i < GRADES[grade].attrs; i++) attrs.push(rollLine(slot, grade, rng, attrs.map(a => a.key)));
    const item = { id, slot, grade, attrs, locked: [] };
    if (grade >= SPECIAL_GRADE) { const pool = specialsFor(slot); item.special = pool[Math.floor(rng() * pool.length) % pool.length]; }
    return item;
  }
  const randomSlot = rng => SLOT_IDS[Math.floor(rng() * SLOT_IDS.length) % SLOT_IDS.length];
  const itemName = item => `${GRADES[item.grade].name} ${SLOTS[item.slot].noun}${SPECIALS[item.special] ? ` 「${SPECIALS[item.special].name}」` : ''}`;
  function describe(attr) {
    const a = ATTRS[attr.key], sign = attr.value < 0 ? '−' : '+', v = Math.abs(attr.value);
    if (!a.pct) return `${a.name} ${sign}${v}`;
    return `${a.name} ${sign}${Math.round(v * 1000) / 10}%${a.point ? 'p' : ''}`;
  }
  function bonusesOf(items) {
    const out = {};
    for (const item of items) for (const attr of item.attrs) out[attr.key] = (out[attr.key] || 0) + attr.value;
    return out;
  }
  const specialsOf = items => [...new Set(items.map(item => item.special).filter(key => SPECIALS[key]))];
  // 합성: 같은 슬롯 · 같은 등급의 (장착하지 않은) 장비 목록 → 필요 수와 쓸 장비.
  function combineCandidates(items, slot, grade, equippedIds = []) {
    const g = GRADES[grade];
    const pool = items.filter(item => item.slot === slot && item.grade === grade && !equippedIds.includes(item.id));
    return { need: g.combine, have: pool.length, use: g.combine ? pool.slice(0, g.combine) : [], silver: g.combineSilver,
      possible: Boolean(g.combine) && pool.length >= g.combine };
  }
  // 옵션 변경 비용: 등급 은자 + 영물 1, 고정한 줄 하나마다 2배. 고정 안 한 줄이 없으면 돌릴 수 없다.
  function rerollPlan(item) {
    const locked = (item.locked || []).filter(i => i >= 0 && i < item.attrs.length);
    const factor = 2 ** locked.length;
    return { locked: locked.length, silver: GRADES[item.grade].rerollSilver * factor, spirit: factor,
      possible: locked.length < item.attrs.length };
  }
  function toggleLock(item, index) {
    if (index < 0 || index >= item.attrs.length) return false;
    const locked = item.locked || [];
    item.locked = locked.includes(index) ? locked.filter(i => i !== index) : [...locked, index].sort((a, b) => a - b);
    return item.locked.includes(index);
  }
  // 고정 안 한 줄을 모두 다시 굴린다(고정한 줄의 옵션도 겹침 계산에 넣는다). 전설 옵션도 같이 돈다.
  function rerollItem(item, rng) {
    if (!rerollPlan(item).possible) return false;
    const locked = item.locked || [];
    const taken = item.attrs.filter((_, i) => locked.includes(i)).map(a => a.key);
    item.attrs = item.attrs.map((attr, i) => {
      if (locked.includes(i)) return attr;
      const line = rollLine(item.slot, item.grade, rng, taken);
      taken.push(line.key);
      return line;
    });
    if (item.grade >= SPECIAL_GRADE) { const pool = specialsFor(item.slot); item.special = pool[Math.floor(rng() * pool.length) % pool.length]; }
    return true;
  }

  // 테스트용 가방: 모든 슬롯 × 모든 등급, 합성 한 번 할 만큼(범품 3 · 양품 4 · 상품 5 · 극품 6 · 신품 7), 신병이기는 특수 옵션마다 1개.
  function testSet(rng, firstId = 1) {
    const items = [];
    for (const slot of SLOT_IDS) for (const g of GRADES)
      if (g.index >= SPECIAL_GRADE) for (const key of specialsFor(slot)) items.push({ ...makeItem(slot, g.index, rng, firstId + items.length), special: key });
      else for (let i = 0; i < g.combine; i++) items.push(makeItem(slot, g.index, rng, firstId + items.length));
    return items;
  }

  root.CheonForge = Object.freeze({ GRADES, SLOTS, ATTRS, SLOT_IDS, SPECIALS, TIER_WEIGHTS, poolOf, makeItem, randomSlot, itemName, describe, bonusesOf, specialsOf, combineCandidates, rerollPlan, toggleLock, rerollItem, testSet });
})(typeof window !== 'undefined' ? window : globalThis);
