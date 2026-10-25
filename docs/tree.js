/* 무공록 스킬 트리. 허브의 무공록(또는 캐릭터)을 누르면 다른 부분은 화면 밖으로 밀려나고, 캐릭터·먹 원·도장이
 * 남은 채 줌아웃되며 그 둘레로 트리가 펼쳐진다. 캐릭터가 트리의 시작점이고 정파는 왼쪽 위, 사파는 오른쪽 위,
 * 세외는 아래로 갈라진다. 우선 개발 6세력은 원형 군집(화산만 실제 무공 이름), 나머지는 잠긴 자리다.
 * 노드의 효과 값·포인트(기본 3 + 경지마다 3)는 임시이며 아직 전투에 연결하지 않았다(오른쪽 위 효과 합계에만 보인다).
 * 트리 모양(위치·연결·글·효과)은 CheonTree.model 을 고치고 rebuild()/layout() 하면 다시 그려진다(수정 도구용). */
(() => {
  'use strict';
  const data = window.CHEONJONG_DATA;
  const hub = () => window.CheonHub;
  const title = document.getElementById('title-screen');
  const portrait = document.querySelector('.hub-portrait');
  const openButton = document.getElementById('open-martial');
  if (!data || !title || !portrait || !openButton) return;

  const SVG = 'http://www.w3.org/2000/svg';
  // 트리 중심의 캐릭터 상자(월드 단위). 허브 초상(440×430)을 같은 비율로 줄인 크기다.
  const PORTRAIT_W = 176;
  const BRANCHES = {
    righteous: { angle: -135, glyph: '正', label: '정파' },
    heterodox: { angle: -45, glyph: '邪', label: '사파' },
    outer: { angle: 90, glyph: '外', label: '세외' },
  };
  const HWASAN_GLYPHS = { plum_sword: '劍', zixia: '紫', plum_rain: '雨', liuhe: '合', dark_fragrance: '影', five_elements: '步' };
  const HWASAN_PAIRS = [['plum_sword', 'zixia', '매화만리향'], ['plum_rain', 'liuhe', '매향침골'], ['dark_fragrance', 'five_elements', '매인설한']];
  // 노드 종류별 임시 효과(전투 연결 전, 효과 합계에 보이는 값).
  const DEFAULT_EFFECTS = {
    path: ['이동 속도 +2%'], bridge: ['공력 +2%'], minor: ['체력 +3%'], entry: ['공력 +3%'],
    gate: ['치명타 확률 +2%'], heart: ['피해 +8%'],
  };
  const RADIUS = { origin: 0, minor: 9, entry: 15, skill: 19, fusion: 17, notable: 27, locked: 15 };
  const radiusOf = n => (n.kind === 'origin' ? PORTRAIT_W / 2 : RADIUS[n.kind] || 12);
  const pointsFor = realmIndex => 3 + realmIndex * 3;
  const rad = degrees => degrees * Math.PI / 180;
  const polar = (r, degrees) => ({ x: Math.cos(rad(degrees)) * r, y: Math.sin(rad(degrees)) * r });

  // ---- 트리 모양(기본) ----
  const model = { nodes: new Map(), edges: [], labels: [] };
  const nodes = model.nodes;
  function node(id, props) { nodes.set(id, { id, effects: [], ...props }); return id; }
  function link(a, b) { model.edges.push([a, b]); }

  node('origin', { kind: 'origin', x: 0, y: 0, name: '천종지자', desc: '모든 무학의 시작. 여기에서 이어진 노드만 찍을 수 있습니다.' });

  function buildCluster(category, faction, center, facing) {
    const hwasan = faction.id === 'hwasan';
    const skills = hwasan ? data.schools.hwasan.skills : null;
    const prefix = `${faction.id}:`;
    const glyphs = ['招', '心', '招', '心', '招', '心'];
    const ringRadius = 150;
    // 군집 입구는 트리 중심 쪽을 향한다.
    const inward = facing + 180;
    const entry = node(`${prefix}entry`, { kind: 'entry', category, faction: faction.id, ...polar(ringRadius + 64, inward), glyph: '門',
      name: `${faction.name} 입문`, effects: [...DEFAULT_EFFECTS.entry],
      desc: hwasan ? '화산의 문을 두드립니다. 매화검수의 길이 여기서 시작됩니다.' : `${faction.name}의 문. 임시 뼈대이며 무공은 설계 예정입니다.` });
    shift(entry, center);
    // 고리: [무공, 합, 짝 무공, 기운] × 3.
    const ring = [];
    for (let pair = 0; pair < 3; pair++) {
      const [a, b, fusion] = hwasan ? HWASAN_PAIRS[pair] : [null, null, null];
      const skillA = hwasan ? skills.find(skill => skill.id === a) : null;
      const skillB = hwasan ? skills.find(skill => skill.id === b) : null;
      const nameA = hwasan ? skillA.name : `${faction.name} 초식 ${'一二三'[pair]}`;
      const nameB = hwasan ? skillB.name : `${faction.name} 심법 ${'一二三'[pair]}`;
      const fusionName = hwasan ? fusion : `${faction.name} 합 ${'一二三'[pair]}`;
      ring.push(node(`${prefix}s${pair * 2}`, { kind: 'skill', category, faction: faction.id, glyph: hwasan ? HWASAN_GLYPHS[a] : glyphs[pair * 2],
        name: nameA, effects: [`${nameA} 습득`],
        desc: hwasan ? `${skillA.type} · ${skillA.levels[0].title}: ${skillA.levels[0].description}` : '임시 뼈대 · 초식 설계 예정' }));
      ring.push(node(`${prefix}f${pair}`, { kind: 'fusion', category, faction: faction.id, glyph: '合',
        name: fusionName, effects: [`${fusionName} 해금`],
        desc: hwasan ? `${skillA.name}과 ${skillB.name}을 함께 완성하면 피어나는 절세신공.` : '임시 뼈대 · 조합 설계 예정' }));
      ring.push(node(`${prefix}s${pair * 2 + 1}`, { kind: 'skill', category, faction: faction.id, glyph: hwasan ? HWASAN_GLYPHS[b] : glyphs[pair * 2 + 1],
        name: nameB, effects: [`${nameB} 습득`],
        desc: hwasan ? `${skillB.type} · ${skillB.levels[0].title}: ${skillB.levels[0].description}` : '임시 뼈대 · 심법 설계 예정' }));
      ring.push(node(`${prefix}m${pair}`, { kind: 'minor', category, faction: faction.id, effects: [...DEFAULT_EFFECTS.minor],
        name: hwasan ? '매화의 기운' : `${faction.name}의 기운`, desc: '기초 수련.' }));
    }
    ring.forEach((id, i) => { Object.assign(nodes.get(id), polar(ringRadius, inward + 45 + i * 30), { cx: center.x, cy: center.y }); shift(id, center); });
    ring.forEach((id, i) => link(id, ring[(i + 1) % ring.length]));
    link(entry, ring[ring.length - 1]);
    const heart = node(`${prefix}heart`, { kind: 'notable', category, faction: faction.id, x: center.x, y: center.y, glyph: '奧',
      name: `${faction.name} 오의`, effects: [...DEFAULT_EFFECTS.heart],
      desc: hwasan ? '화산 무학의 정점. 세 절세신공을 잇는 자리입니다.' : '임시 뼈대 · 오의 설계 예정' });
    ring.filter(id => nodes.get(id).kind === 'fusion').forEach(id => link(id, heart));
    const far = polar(ringRadius + 78, facing);
    model.labels.push({ x: center.x + far.x, y: center.y + far.y + 10, text: faction.name, size: 34, kind: 'faction' });
    return entry;
  }
  function shift(id, by) { const n = nodes.get(id); n.x += by.x; n.y += by.y; }

  for (const category of data.categories) {
    const branch = BRANCHES[category.id];
    if (!branch) continue;
    const start = node(`${category.id}:path`, { kind: 'minor', category: category.id, ...polar(185, branch.angle),
      name: `${branch.label}의 길`, desc: `${branch.label}으로 나아가는 첫걸음.`, effects: [...DEFAULT_EFFECTS.path] });
    link('origin', start);
    const gate = node(`${category.id}:gate`, { kind: 'notable', category: category.id, ...polar(360, branch.angle), glyph: branch.glyph,
      name: branch.label, desc: `${category.name}의 갈림길. 여기서 각 세력으로 갈라집니다.`, effects: [...DEFAULT_EFFECTS.gate] });
    link(start, gate);
    model.labels.push({ ...polar(360, branch.angle), dy: -52, text: branch.label, size: 44, kind: 'branch' });
    const priority = category.factions.filter(faction => faction.planned);
    const others = category.factions.filter(faction => !faction.planned);
    // 우선 세력: 갈래 방향 양옆으로 큰 원형 군집.
    const spread = priority.length > 1 ? 30 : 0;
    priority.forEach((faction, i) => {
      const angle = branch.angle + (i - (priority.length - 1) / 2) * spread;
      const entry = buildCluster(category.id, faction, polar(880, angle), angle);
      const bridge = node(`${faction.id}:bridge`, { kind: 'minor', category: category.id, faction: faction.id, ...polar(560, angle + (i - (priority.length - 1) / 2) * 4),
        name: `${faction.name}로 가는 길`, desc: `${faction.name}의 문으로 이어집니다.`, effects: [...DEFAULT_EFFECTS.bridge] });
      link(gate, bridge);
      link(bridge, entry);
    });
    // 나머지 세력: 갈림길 양옆(우선 세력으로 가는 길을 비켜서)의 잠긴 자리.
    const leftCount = Math.ceil(others.length / 2);
    others.forEach((faction, i) => {
      const side = i < leftCount ? -1 : 1, step = i < leftCount ? i : i - leftCount;
      const id = node(`${faction.id}:locked`, { kind: 'locked', category: category.id, faction: faction.id, ...polar(500 + (step % 2) * 70, branch.angle + side * (34 + step * 15)),
        glyph: '鎖', name: faction.name, desc: '설계 예정인 세력입니다. 아직 찍을 수 없습니다.' });
      link(gate, id);
    });
  }

  let neighbors = new Map();
  function relink() {
    model.edges = model.edges.filter(([a, b]) => nodes.has(a) && nodes.has(b) && a !== b);
    neighbors = new Map([...nodes.keys()].map(id => [id, new Set()]));
    for (const [a, b] of model.edges) { neighbors.get(a).add(b); neighbors.get(b).add(a); }
  }
  relink();

  // ---- 줄 경로: 다른 원은 반드시 비켜 가고(못 비키면 blocked), 이미 그린 줄과는 되도록 엇갈리지 않게 휜다 ----
  const SAMPLES = 16;
  const curve = (p, c, q) => Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES, u = 1 - t;
    return { x: u * u * p.x + 2 * u * t * c.x + t * t * q.x, y: u * u * p.y + 2 * u * t * c.y + t * t * q.y };
  });
  // 한 번 휘어서는 못 피할 때 쓰는 S자(3차) 곡선. 크게 돌아가므로 점을 더 촘촘히 찍는다.
  const curve3 = (p, c, e, q) => Array.from({ length: SAMPLES * 2 + 1 }, (_, i) => {
    const t = i / (SAMPLES * 2), u = 1 - t, a = u * u * u, b = 3 * u * u * t, m = 3 * u * t * t, z = t * t * t;
    return { x: a * p.x + b * c.x + m * e.x + z * q.x, y: a * p.y + b * c.y + m * e.y + z * q.y };
  });
  const boxOf = points => points.reduce((b, pt) => ({ x0: Math.min(b.x0, pt.x), y0: Math.min(b.y0, pt.y), x1: Math.max(b.x1, pt.x), y1: Math.max(b.y1, pt.y) }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
  const cross = (a, b, c, d) => {
    const s = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    return s(a, b, c) * s(a, b, d) < 0 && s(c, d, a) * s(c, d, b) < 0;
  };
  // 이미 그린 줄(placed: {a, b, points, box})과 몇 번 엇갈리는지. 같은 노드에서 만나는 줄은 세지 않는다.
  // limit: 그 수에 닿으면 더 셀 필요 없이 바로 돌려준다(이미 더 나은 후보가 있음).
  function crossings(points, box, a, b, placed, limit = Infinity) {
    let count = 0;
    for (const other of placed) {
      if (other.a === a || other.a === b || other.b === a || other.b === b) continue;
      if (other.box.x0 > box.x1 || other.box.x1 < box.x0 || other.box.y0 > box.y1 || other.box.y1 < box.y0) continue;
      for (let i = 0; i < points.length - 1; i++) for (let j = 0; j < other.points.length - 1; j++) {
        if (cross(points[i], points[i + 1], other.points[j], other.points[j + 1]) && ++count >= limit) return count;
      }
    }
    return count;
  }
  function route(a, b, placed = []) {
    const p = nodes.get(a), q = nodes.get(b);
    const obstacles = [...nodes.values()].filter(n => n.id !== a && n.id !== b);
    const clear = points => points.slice(1, -1).every(pt => obstacles.every(o => Math.hypot(pt.x - o.x, pt.y - o.y) >= radiusOf(o) + 7));
    const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const nx = -(q.y - p.y) / len, ny = (q.x - p.x) / len;
    let best = null;
    for (const k of [0, 0.5, -0.5, 1, -1, 1.5, -1.5, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6]) {
      const c = { x: mid.x + nx * k * 45, y: mid.y + ny * k * 45 };
      const points = curve(p, c, q);
      const box = boxOf(points);
      const hits = placed.length ? crossings(points, box, a, b, placed, best ? best.hits : Infinity) : 0;
      if (best && hits >= best.hits) continue;
      if (!clear(points)) continue;
      best = { c, points, box, hits };
      if (!hits) break;
    }
    if (!best || best.hits) {
      // 양 끝 손잡이를 따로 벌려 S자·큰 활 모양으로 돌아가 본다.
      const at = (f, k) => ({ x: p.x + (q.x - p.x) * f + nx * k * 60, y: p.y + (q.y - p.y) * f + ny * k * 60 });
      const ks = [0, 1, -1, 2, -2, 3, -3, 4, -4, 6, -6, 8, -8, 11, -11];
      for (const f of [0.25, 0]) for (const k1 of ks) for (const k2 of ks) {
        if (best && !best.hits) break;
        const c = at(f, k1), e = at(1 - f, k2), points = curve3(p, c, e, q);
        const box = boxOf(points);
        const hits = crossings(points, box, a, b, placed, best ? best.hits : Infinity);
        if (best && hits >= best.hits) continue;
        if (clear(points)) best = { c, e, points, box, hits };
      }
    }
    if (!best) return { d: `M${p.x} ${p.y}L${q.x} ${q.y}`, ok: false, points: curve(p, mid, q) };
    const d = best.e ? `M${p.x} ${p.y}C${best.c.x} ${best.c.y} ${best.e.x} ${best.e.y} ${q.x} ${q.y}` : `M${p.x} ${p.y}Q${best.c.x} ${best.c.y} ${q.x} ${q.y}`;
    return { d, ok: true, points: best.points, box: best.box, crossings: best.hits };
  }

  // ---- 찍기 규칙: 시작점(캐릭터)과 이어진 노드만, 되돌릴 때는 남은 노드가 끊기지 않을 때만 ----
  const allocated = () => new Set((hub()?.state.tree.allocated || []).filter(id => nodes.has(id)));
  const totalPoints = () => pointsFor(hub()?.realm().index || 0);
  const isOn = (id, set = allocated()) => id === 'origin' || set.has(id);
  function canTake(id) {
    const n = nodes.get(id), set = allocated();
    if (!n || n.kind === 'locked' || n.kind === 'origin' || set.has(id)) return false;
    return [...neighbors.get(id)].some(other => isOn(other, set));
  }
  function connectedWithout(id) {
    const set = allocated();
    set.delete(id);
    const seen = new Set(['origin']), queue = ['origin'];
    while (queue.length) for (const next of neighbors.get(queue.shift()) || []) if (set.has(next) && !seen.has(next)) { seen.add(next); queue.push(next); }
    return [...set].every(other => seen.has(other));
  }
  const canGive = id => allocated().has(id) && connectedWithout(id);

  function commit(list) {
    const state = hub().state;
    state.tree.allocated = list;
    // 찍은 수 → 허브의 [정파·사파·세외] 칸, 가장 많이 찍은 세력 → 주세력(문양·도장).
    const counts = { righteous: 0, heterodox: 0, outer: 0 }, perFaction = {};
    for (const id of list) {
      const n = nodes.get(id);
      if (!n) continue;
      if (n.category in counts) counts[n.category]++;
      if (n.faction) perFaction[n.faction] = (perFaction[n.faction] || 0) + 1;
    }
    state.factions = counts;
    const best = Object.entries(perFaction).filter(([faction]) => hub().schools.includes(faction)).sort((a, b) => b[1] - a[1])[0];
    state.mainSchool = best ? best[0] : 'hwasan';
    hub().save();
    hub().render();
    draw();
  }
  function take(id) { if (canTake(id) && allocated().size < totalPoints()) commit([...allocated(), id]); }
  function give(id) { if (canGive(id)) commit([...allocated()].filter(other => other !== id)); }

  // ---- 효과 합계: 같은 효과(이름·단위)는 더하고, 숫자 없는 효과는 개수로 묶는다 ----
  const EFFECT = /^(.+?)\s*([+-]\s*\d+(?:\.\d+)?)\s*(%|초|개|회|점)?$/;
  function effectTotals() {
    const sums = new Map(), flags = new Map();
    for (const id of allocated()) {
      for (const line of nodes.get(id)?.effects || []) {
        const text = line.trim();
        if (!text) continue;
        const m = text.match(EFFECT);
        if (m) {
          const key = `${m[1].trim()}|${m[3] || ''}`;
          sums.set(key, (sums.get(key) || 0) + Number(m[2].replace(/\s/g, '')));
        } else flags.set(text, (flags.get(text) || 0) + 1);
      }
    }
    const lines = [...sums].map(([key, value]) => {
      const [name, unit] = key.split('|');
      return `${name} ${value >= 0 ? '+' : ''}${Math.round(value * 100) / 100}${unit}`;
    });
    for (const [text, count] of flags) lines.push(count > 1 ? `${text} ×${count}` : text);
    return lines;
  }

  // ---- 화면 ----
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attrs)) if (value !== undefined && value !== null) node.setAttribute(key, value);
    node.append(...children);
    return node;
  };
  const h = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else if (key in node) node[key] = value;
      else node.setAttribute(key, value);
    }
    node.append(...children.filter(child => child !== null && child !== undefined && child !== false));
    return node;
  };

  const world = el('g', { class: 'tree-world' });
  const edgeLayer = el('g', { class: 'tree-edges' });
  const labelLayer = el('g', { class: 'tree-labels' });
  const nodeLayer = el('g', { class: 'tree-nodes' });
  const overlayLayer = el('g', { class: 'tree-overlay' });
  world.append(edgeLayer, labelLayer, nodeLayer, overlayLayer);
  const svg = el('svg', { class: 'tree-svg', role: 'img', 'aria-label': '무공록 스킬 트리' }, world);
  const pointsText = h('strong');
  const realmText = h('span');
  const info = h('aside', { class: 'tree-info', hidden: true, 'aria-live': 'polite' });
  const backButton = h('button', { type: 'button', class: 'tree-back', onclick: () => close() }, '← 메인으로');
  const tools = h('div', { class: 'tree-tools' },
    h('button', { type: 'button', onclick: resetAll }, '모두 되돌리기'),
    h('button', { type: 'button', 'aria-label': '축소', onclick: () => zoomBy(1 / 1.25) }, '−'),
    h('button', { type: 'button', 'aria-label': '확대', onclick: () => zoomBy(1.25) }, '+'),
    h('button', { type: 'button', 'aria-label': '가운데로', onclick: () => fit(true) }, '⌖'));
  const top = h('header', { class: 'tree-top' },
    backButton,
    h('div', { class: 'tree-title' }, h('strong', {}, '무공록'), h('small', {}, '효과 값은 임시이며 아직 전투에 연결되지 않았습니다')),
    h('div', { class: 'tree-points' }, realmText, pointsText),
    tools);
  const legend = h('div', { class: 'tree-legend', 'aria-hidden': 'true' },
    h('span', { class: 'is-on' }, '찍음'), h('span', { class: 'is-open' }, '찍을 수 있음'), h('span', {}, '이어지지 않음'), h('span', { class: 'is-locked' }, '설계 예정'));
  // 오른쪽 위: 검색창과 접을 수 있는 효과 합계.
  const searchInput = h('input', { type: 'search', placeholder: '패시브 검색', 'aria-label': '패시브 검색', autocomplete: 'off', spellcheck: false });
  const searchCount = h('span', { class: 'tree-search-count' });
  const effectsToggle = h('button', { type: 'button', class: 'tree-effects-toggle', 'aria-expanded': 'true' });
  const effectsList = h('ul', { class: 'tree-effects-list' });
  const side = h('div', { class: 'tree-side' },
    h('label', { class: 'tree-search' }, searchInput, searchCount),
    h('section', { class: 'tree-effects', 'aria-label': '찍은 패시브 효과 합계' }, effectsToggle, effectsList));
  // 상단 바·범례·정보 창은 트리 위의 캐릭터 초상보다 위 층에 둔다.
  const ui = h('div', { class: 'tree-ui' }, top, side, legend, info);
  const screen = h('div', { class: 'tree-screen', id: 'tree-screen', hidden: true }, svg);
  const shell = h('div', { class: 'tree-shell', hidden: true }, screen, ui);
  title.append(shell);

  let effectsOpen = true;
  try { effectsOpen = localStorage.getItem('cheonjong-tree-effects') !== 'closed'; } catch {}
  effectsToggle.addEventListener('click', () => {
    effectsOpen = !effectsOpen;
    try { localStorage.setItem('cheonjong-tree-effects', effectsOpen ? 'open' : 'closed'); } catch {}
    renderEffects();
  });
  function renderEffects() {
    const lines = effectTotals();
    effectsToggle.textContent = `찍은 효과 합계 (${allocated().size}) ${effectsOpen ? '▴' : '▾'}`;
    effectsToggle.setAttribute('aria-expanded', String(effectsOpen));
    effectsList.hidden = !effectsOpen;
    effectsList.replaceChildren(...(lines.length ? lines.map(line => h('li', {}, line)) : [h('li', { class: 'is-empty' }, '찍은 패시브가 없습니다.')]));
  }

  // 검색: 이름·설명·효과·한자에 검색어가 든 노드가 흰빛으로 점멸한다.
  let searchTerm = '';
  searchInput.addEventListener('input', () => { searchTerm = searchInput.value.trim().toLowerCase(); markSearch(); });
  searchInput.addEventListener('keydown', event => { if (event.key === 'Escape') { searchInput.value = ''; searchTerm = ''; markSearch(); event.stopPropagation(); } });
  function markSearch() {
    let count = 0;
    for (const [id, view] of nodeViews) {
      const n = nodes.get(id);
      const hit = Boolean(searchTerm) && [n.name, n.desc, n.glyph, ...(n.effects || [])].some(text => String(text || '').toLowerCase().includes(searchTerm));
      view.classList.toggle('is-match', hit);
      if (hit) count++;
    }
    searchCount.textContent = searchTerm ? `${count}개` : '';
  }

  const nodeViews = new Map();
  let edgeViews = [];
  // 모양을 처음부터 다시 그린다(노드·연결이 늘거나 줄었을 때).
  function rebuild() {
    relink();
    edgeLayer.replaceChildren();
    labelLayer.replaceChildren();
    nodeLayer.replaceChildren();
    nodeViews.clear();
    edgeViews = model.edges.map(([a, b]) => {
      const path = el('path', { 'data-edge': `${a}|${b}` });
      edgeLayer.append(path);
      return { a, b, path };
    });
    for (const label of model.labels) {
      labelLayer.append(el('text', { x: label.x, y: label.y + (label.dy || 0), class: `tree-label is-${label.kind}`, 'font-size': label.size, 'text-anchor': 'middle' }, label.text));
    }
    for (const n of nodes.values()) {
      if (n.kind === 'origin') continue;
      const r = radiusOf(n);
      const group = el('g', { class: `tree-node is-${n.kind}`, 'data-node': n.id, tabindex: '0', role: 'button', 'aria-label': n.name });
      group.append(el('circle', { r: r + 9, class: 'tree-hit' }), el('circle', { r: r + 7, class: 'tree-glow' }), el('circle', { r, class: 'tree-dot' }));
      if (n.glyph) group.append(el('text', { class: 'tree-glyph', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.round(r * 1.05) }, n.glyph));
      if (['skill', 'notable', 'locked', 'fusion'].includes(n.kind) || n.custom) {
        group.append(el('text', { class: 'tree-name', 'font-size': n.kind === 'notable' ? 15 : 12 }, n.name));
      }
      nodeLayer.append(group);
      nodeViews.set(n.id, group);
    }
    layout();
    markSearch();
  }
  // 위치만 다시: 노드 자리, 이름표 방향, 줄 경로.
  function layout() {
    for (const [id, group] of nodeViews) {
      const n = nodes.get(id), r = radiusOf(n);
      group.setAttribute('transform', `translate(${n.x} ${n.y})`);
      const name = group.querySelector('.tree-name');
      if (name) {
        // 군집 고리의 이름은 군집 바깥쪽으로 펼쳐 이웃과 겹치지 않게 한다.
        let lx = 0, ly = r + 17, anchor = 'middle';
        if (n.cx !== undefined) {
          const a = Math.atan2(n.y - n.cy, n.x - n.cx), ux = Math.cos(a), uy = Math.sin(a);
          lx = ux * (r + 10); ly = uy * (r + 10) + 4 + (uy > 0.5 ? 8 : 0);
          anchor = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
        }
        name.setAttribute('x', lx);
        name.setAttribute('y', ly);
        name.setAttribute('text-anchor', anchor);
      }
    }
    // 짧은 줄부터 그려 두고, 긴 줄이 그 사이를 피해 휘게 한다.
    const placed = [];
    const length = view => Math.hypot(nodes.get(view.a).x - nodes.get(view.b).x, nodes.get(view.a).y - nodes.get(view.b).y);
    for (const view of [...edgeViews].sort((x, y) => length(x) - length(y))) {
      const result = route(view.a, view.b, placed);
      view.path.setAttribute('d', result.d);
      view.ok = result.ok;
      view.crossings = result.crossings || 0;
      placed.push({ a: view.a, b: view.b, points: result.points, box: result.box || boxOf(result.points) });
    }
    draw();
  }

  let selected = null;
  function draw() {
    const set = allocated(), left = totalPoints() - set.size;
    realmText.textContent = `경지 ${hub()?.realm().name || '삼류'}`;
    pointsText.textContent = `남은 포인트 ${Math.max(0, left)} / ${totalPoints()}`;
    for (const [id, view] of nodeViews) {
      const on = set.has(id), open = !on && canTake(id) && left > 0;
      view.classList.toggle('is-on', on);
      view.classList.toggle('is-open', open);
      view.classList.toggle('is-selected', id === selected);
      view.classList.toggle('is-isolated', !neighbors.get(id)?.size);
    }
    for (const { a, b, path, ok } of edgeViews) {
      const on = isOn(a, set) && isOn(b, set);
      const reach = !on && (isOn(a, set) || isOn(b, set)) && nodes.get(a).kind !== 'locked' && nodes.get(b).kind !== 'locked';
      path.setAttribute('class', [on ? 'is-on' : reach ? 'is-reach' : '', ok === false ? 'is-blocked' : ''].join(' ').trim());
    }
    renderInfo();
    renderEffects();
  }

  function renderInfo() {
    const n = selected && nodes.get(selected);
    info.hidden = !n || editing;
    if (!n || editing) return;
    const set = allocated(), left = totalPoints() - set.size;
    const kindName = { minor: '수련', entry: '입문', skill: '무공', fusion: '절세신공', notable: '요결', locked: '설계 예정' }[n.kind];
    const category = n.category && BRANCHES[n.category]?.label;
    const faction = n.faction && data.categories.flatMap(c => c.factions).find(f => f.id === n.faction)?.name;
    let status, action = null;
    if (n.kind === 'locked') status = '아직 설계되지 않은 세력입니다.';
    else if (set.has(n.id)) {
      status = '찍었습니다.';
      action = canGive(n.id) ? h('button', { type: 'button', onclick: () => give(n.id) }, '되돌리기 (+1)')
        : h('button', { type: 'button', disabled: true, title: '이 노드를 빼면 바깥 노드가 끊깁니다' }, '바깥 노드부터 되돌리세요');
    } else if (!canTake(n.id)) status = '찍은 노드와 이어져 있지 않습니다.';
    else if (left <= 0) status = '남은 포인트가 없습니다. 경지가 오르면 늘어납니다.';
    else { status = '찍을 수 있습니다.'; action = h('button', { type: 'button', class: 'is-primary', onclick: () => take(n.id) }, '찍기 (−1)'); }
    info.replaceChildren(
      h('button', { type: 'button', class: 'tree-info-close', 'aria-label': '닫기', onclick: () => { selected = null; draw(); } }, '×'),
      h('p', { class: 'tree-info-kind' }, [category, faction, kindName].filter(Boolean).join(' · ')),
      h('h2', {}, n.name),
      h('p', {}, n.desc),
      n.effects?.length ? h('ul', { class: 'tree-info-effects' }, ...n.effects.map(line => h('li', {}, line))) : null,
      h('p', { class: 'tree-info-status' }, status),
      ...(action ? [action] : []));
  }

  // ---- 시점: 끌어서 이동, 휠·핀치로 확대 ----
  const view = { x: 0, y: 0, k: 1 };
  const portraitBase = { cx: 0, cy: 0, w: 440 };
  const clampK = k => Math.min(2.6, Math.max(0.12, k));
  function applyView() {
    world.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${view.k})`);
    // 캐릭터·먹 원·도장은 허브의 실제 초상을 트리 중심에 맞춰 함께 움직인다.
    const scale = PORTRAIT_W * view.k / portraitBase.w;
    portrait.style.transform = `translate(${view.x - portraitBase.cx}px, ${view.y - portraitBase.cy}px) scale(${scale})`;
    screen.classList.toggle('is-far', view.k < 0.8);
  }
  // 처음 보이는 크기: 트리 전체(이름표 여유 포함)가 화면에 들어오게.
  function fitK() {
    const bounds = [...nodes.values()].reduce((b, n) => ({ x: Math.max(b.x, Math.abs(n.x)), y: Math.max(b.y, Math.abs(n.y)) }), { x: 0, y: 0 });
    const w = screen.clientWidth, hgt = screen.clientHeight - 70;
    return clampK(Math.min(w / (bounds.x * 2 + 160), hgt / (bounds.y * 2 + 160)));
  }
  function fit(animate) {
    const target = { x: screen.clientWidth / 2, y: (screen.clientHeight + 40) / 2, k: fitK() };
    if (!animate) { Object.assign(view, target); applyView(); return; }
    tween(target, 380);
  }
  function zoomBy(factor, cx = screen.clientWidth / 2, cy = screen.clientHeight / 2) {
    const k = clampK(view.k * factor), ratio = k / view.k;
    view.x = cx - (cx - view.x) * ratio;
    view.y = cy - (cy - view.y) * ratio;
    view.k = k;
    applyView();
  }
  function panBy(dx, dy) { view.x += dx; view.y += dy; applyView(); }
  const toWorld = (clientX, clientY) => ({ x: (clientX - view.x) / view.k, y: (clientY - view.y) / view.k });
  // 트리와 그 위 UI를 함께 흐리게(둘을 묶은 상자에 걸면 초상이 그 사이에 끼지 못한다).
  const setOpacity = value => { screen.style.opacity = value; ui.style.opacity = value; };
  let tweenFrame = 0;
  function tween(target, duration, done) {
    cancelAnimationFrame(tweenFrame);
    const from = { ...view }, start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1, e = ease(t);
      view.x = from.x + (target.x - from.x) * e;
      view.y = from.y + (target.y - from.y) * e;
      view.k = Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e);
      if (target.opacity) setOpacity(String(target.opacity[0] + (target.opacity[1] - target.opacity[0]) * Math.min(1, Math.max(0, t * 1.4 - 0.2))));
      applyView();
      if (t < 1) tweenFrame = requestAnimationFrame(step); else done?.();
    };
    tweenFrame = requestAnimationFrame(step);
  }

  // 수정 도구가 켜져 있으면 왼쪽 버튼·한 손가락은 도구가 쓰고, 트리는 가운데·오른쪽 버튼 끌기와 휠·핀치만 받는다.
  let editing = false;
  const pointers = new Map();
  let pan = null, pinch = null;
  svg.addEventListener('pointerdown', event => {
    const primary = event.button === 0;
    if (editing && primary && !pointers.size) return;
    try { svg.setPointerCapture(event.pointerId); } catch {}
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
      pan = null;
    } else pan = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y, moved: false, primary, target: event.target.closest('[data-node]') };
  });
  svg.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomBy((pinch.k * d / pinch.d) / view.k, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (!pan) return;
    const dx = event.clientX - pan.x, dy = event.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) < 5) return;
    pan.moved = true;
    view.x = pan.vx + dx;
    view.y = pan.vy + dy;
    applyView();
  });
  const release = event => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pan && !pan.moved && pan.primary && !editing && event.type === 'pointerup') {
      selected = pan.target?.dataset.node || null;
      draw();
    }
    if (!pointers.size) pan = null;
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  svg.addEventListener('contextmenu', event => { if (editing) event.preventDefault(); });
  svg.addEventListener('dblclick', event => {
    if (editing) return;
    const id = event.target.closest('[data-node]')?.dataset.node;
    if (!id) return;
    allocated().has(id) ? give(id) : take(id);
  });
  svg.addEventListener('wheel', event => {
    event.preventDefault();
    zoomBy(Math.exp(-event.deltaY * 0.0015), event.clientX, event.clientY);
  }, { passive: false });
  nodeLayer.addEventListener('keydown', event => {
    const id = event.target.closest?.('[data-node]')?.dataset.node;
    if (editing || !id || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    if (selected === id) allocated().has(id) ? give(id) : take(id);
    selected = id;
    draw();
  });

  function resetAll() {
    if (!allocated().size || !confirm('찍은 노드를 모두 되돌릴까요?')) return;
    commit([]);
  }

  // ---- 열기·닫기: 허브가 밀려나고, 초상이 트리 중심으로 줄어들며 트리가 펼쳐진다 ----
  let open = false, busy = false;
  // 밀려난 허브 부분은 트리가 열린 동안 키보드로도 닿지 않게 한다.
  const hubParts = () => [...title.children].filter(part => part !== shell && !part.classList.contains('hub-center'))
    .concat([...portrait.parentElement.children].filter(part => part !== portrait));
  const setHubInert = value => hubParts().forEach(part => { part.inert = value; });
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function measurePortrait() {
    portrait.style.transform = '';
    const rect = portrait.getBoundingClientRect();
    Object.assign(portraitBase, { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, w: rect.width || 440 });
  }
  function openTree() {
    if (open || busy || title.hidden) return;
    busy = true;
    open = true;
    measurePortrait();
    document.body.classList.add('tree-open');
    title.classList.add('hub--tree');
    setHubInert(true);
    shell.hidden = false;
    screen.hidden = false;
    setOpacity('0');
    // 시작: 트리 중심 = 지금 초상 자리, 캐릭터 크기 = 지금 초상 크기 → 끝: 화면 중앙, 전체가 보이는 크기.
    Object.assign(view, { x: portraitBase.cx, y: portraitBase.cy, k: portraitBase.w / PORTRAIT_W });
    applyView();
    draw();
    const target = { x: screen.clientWidth / 2, y: (screen.clientHeight + 40) / 2, k: fitK(), opacity: [0, 1] };
    tween(target, reduce() ? 0 : 900, () => { busy = false; setOpacity(''); backButton.focus({ preventScroll: true }); emit('open'); });
  }
  function close() {
    if (!open || busy) return;
    if (closeGuard && closeGuard() === false) return;
    busy = true;
    selected = null;
    info.hidden = true;
    const target = { x: portraitBase.cx, y: portraitBase.cy, k: portraitBase.w / PORTRAIT_W, opacity: [1, 0] };
    tween(target, reduce() ? 0 : 700, () => {
      shell.hidden = true;
      screen.hidden = true;
      setOpacity('');
      portrait.style.transform = '';
      title.classList.remove('hub--tree');
      setHubInert(false);
      document.body.classList.remove('tree-open');
      open = false;
      busy = false;
      openButton.focus({ preventScroll: true });
      emit('close');
    });
  }

  openButton.addEventListener('click', openTree);
  document.addEventListener('keydown', event => {
    if (!open || editing || event.key !== 'Escape' || event.defaultPrevented) return;
    if (selected) { selected = null; draw(); return; }
    close();
  });
  addEventListener('resize', () => {
    if (!open || busy) return;
    // 창 크기가 바뀌면 초상의 원래 자리를 다시 재되 트리 시점은 유지한다.
    const transform = portrait.style.transform;
    measurePortrait();
    portrait.style.transform = transform;
    applyView();
  });

  // ---- 수정 도구용 창구 ----
  const listeners = {};
  const emit = name => (listeners[name] || []).forEach(fn => fn());
  let closeGuard = null;
  rebuild();
  window.CheonTree = {
    open: openTree, close, take, give, model, nodes, route, rebuild, layout, draw,
    get isOpen() { return open; },
    get view() { return { ...view }; },
    toWorld, panBy, zoomBy, svg, nodeLayer, overlayLayer, ui, tools, screen,
    radiusOf,
    neighbors: id => [...(neighbors.get(id) || [])],
    setEditing(on) { editing = on; selected = null; screen.classList.toggle('is-editing', on); draw(); },
    setCloseGuard(fn) { closeGuard = fn; },
    on(name, fn) { (listeners[name] ||= []).push(fn); },
  };
})();
