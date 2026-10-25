// 무공록 수정 도구 (트리 전용). 트리 위쪽의 "✎ 무공록 수정"으로 켠다.
// - 노드를 누르면 한자·이름·설명·효과·종류가 보이고 고칠 수 있으며, 어떻게 바꾸고 싶은지 요청 메모도 적는다.
// - 끌어서 옮기면 줄이 따라 늘고 줄며, 다른 원을 피해 돌아간다. 돌아갈 길이 없으면 그 줄은 끊긴다.
// - 두 개를 고르면 연결/연결 해제. 연결이 하나도 없는 노드는 노랗게 빛난다(tree.css).
// - 빈 곳을 끌면 영역 선택: 그 안의 노드가 골라지고, 그 영역을 어떻게 바꾸고 싶은지 메모할 수 있다.
// 트리 모양 바꿈은 끌 때 docs/tree.json 으로 사이트에 저장(페이지 수정 도구와 같은 열쇠). 메모는 이 브라우저에만 남고
// "요청서 복사"로 전달한다. 저장된 tree.json 은 모든 방문자의 트리에 적용된다.
(() => {
  const T = window.CheonTree;
  if (!T) return;
  const DRAFT = 'cheonjong-tree-draft-v1', MEMOS = 'cheonjong-tree-memo-v1', PATH = 'docs/tree.json';
  const FIELDS = ['x', 'y', 'kind', 'category', 'glyph', 'name', 'desc', 'effects'];
  const KINDS = [['minor', '수련(작은 점)'], ['entry', '입문'], ['skill', '무공'], ['fusion', '절세신공'], ['notable', '요결(큰 점)'], ['locked', '잠김']];
  const CATEGORIES = [['', '갈래 없음'], ['righteous', '정파'], ['heterodox', '사파'], ['outer', '세외']];

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
    del(key) { try { localStorage.removeItem(key); } catch {} },
  };
  const parse = text => { try { return JSON.parse(text); } catch { return null; } };
  const clone = value => JSON.parse(JSON.stringify(value));
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

  // ---- 기본 트리(게임이 만든 모양)와 바뀐 점 ----
  const base = { nodes: clone([...T.nodes.values()]), edges: clone(T.model.edges) };
  const baseNodes = new Map(base.nodes.map(n => [n.id, n]));
  const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const baseEdges = new Set(base.edges.map(([a, b]) => edgeKey(a, b)));
  const empty = () => ({ version: 1, nodes: {}, added: [], removed: [], links: { add: [], remove: [] } });
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // 지금 트리 → 기본과 다른 점만 담은 바꿈.
  function diff() {
    const out = empty();
    for (const n of T.nodes.values()) {
      const original = baseNodes.get(n.id);
      if (!original) { out.added.push(Object.fromEntries(['id', ...FIELDS, 'custom'].map(key => [key, clone(n[key] ?? null)]))); continue; }
      const changed = {};
      for (const key of FIELDS) {
        const value = key === 'x' || key === 'y' ? Math.round(n[key]) : n[key];
        const was = key === 'x' || key === 'y' ? Math.round(original[key]) : original[key];
        if (!same(value ?? null, was ?? null)) changed[key] = clone(value ?? null);
      }
      if (Object.keys(changed).length) out.nodes[n.id] = changed;
    }
    out.removed = base.nodes.map(n => n.id).filter(id => !T.nodes.has(id));
    const now = new Set(T.model.edges.map(([a, b]) => edgeKey(a, b)));
    out.links.add = [...now].filter(key => !baseEdges.has(key)).map(key => key.split('|'));
    out.links.remove = [...baseEdges].filter(key => !now.has(key)).map(key => key.split('|'));
    return out;
  }
  // 바꿈 → 트리(기본에서 다시 시작).
  function apply(change) {
    const c = { ...empty(), ...(change || {}), links: { ...empty().links, ...(change?.links || {}) } };
    T.nodes.clear();
    for (const n of base.nodes) T.nodes.set(n.id, clone(n));
    T.model.edges.length = 0;
    T.model.edges.push(...clone(base.edges));
    for (const id of c.removed) if (id !== 'origin') T.nodes.delete(id);
    for (const [id, fields] of Object.entries(c.nodes)) if (T.nodes.has(id)) Object.assign(T.nodes.get(id), clone(fields));
    for (const n of c.added) if (n && n.id && !T.nodes.has(n.id)) T.nodes.set(n.id, { effects: [], ...clone(n), custom: true });
    const drop = new Set(c.links.remove.map(([a, b]) => edgeKey(a, b)));
    const kept = T.model.edges.filter(([a, b]) => !drop.has(edgeKey(a, b)));
    T.model.edges.length = 0;
    T.model.edges.push(...kept);
    for (const [a, b] of c.links.add) if (T.nodes.has(a) && T.nodes.has(b)) T.model.edges.push([a, b]);
    T.rebuild();
    paint();
  }

  let published = empty();
  const draft = parse(store.get(DRAFT));
  const memos = { nodes: {}, regions: [], ...(parse(store.get(MEMOS)) || {}) };
  const saveMemos = () => store.set(MEMOS, JSON.stringify(memos));
  const dirty = () => !same(diff(), published);
  const keepDraft = () => { if (dirty()) store.set(DRAFT, JSON.stringify(diff())); else store.del(DRAFT); };

  // ---- 실행 취소 ----
  const undoStack = [], redoStack = [];
  function mark() {
    undoStack.push(JSON.stringify(diff()));
    if (undoStack.length > 200) undoStack.shift();
    redoStack.length = 0;
  }
  function travel(from, to) {
    if (!from.length) return;
    to.push(JSON.stringify(diff()));
    apply(JSON.parse(from.pop()));
    keepDraft();
    render();
  }

  // ---- 화면 ----
  let editing = false, selection = [], pendingRegion = null, toastTimer = 0;
  const toggle = h('button', { type: 'button', class: 'te-toggle', onclick: () => setEditing(!editing) }, '✎ 무공록 수정');
  T.tools.prepend(toggle);
  const panel = h('aside', { class: 'te-panel', hidden: true, 'aria-label': '무공록 수정' });
  const marquee = h('div', { class: 'te-marquee', hidden: true });
  const toast = h('p', { class: 'te-toast', hidden: true, role: 'status' });
  T.ui.append(panel, marquee, toast);
  panel.addEventListener('keydown', event => event.stopPropagation());
  const say = text => {
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  };

  function setEditing(on) {
    if (on === editing) return;
    editing = on;
    T.setEditing(on);
    document.documentElement.classList.toggle('tree-editing', on);
    toggle.classList.toggle('is-on', on);
    toggle.textContent = on ? '✎ 무공록 수정 끝내기' : '✎ 무공록 수정';
    panel.hidden = !on;
    selection = [];
    pendingRegion = null;
    render();
    if (!on && dirty()) {
      window.UIE?.saveDialog({
        title: '바뀐 무공록을 저장할까요?',
        lead: '노드 위치·연결·글·효과를 바꾼 내용이 있습니다. 사이트에 저장하면 1~2분 뒤 모든 사람의 무공록이 이렇게 보입니다.',
        path: PATH, message: '무공록 트리 저장 (수정 도구)',
        text: () => `${JSON.stringify({ ...diff(), savedAt: new Date().toISOString() }, null, 2)}\n`,
        onSaved: () => { published = diff(); store.del(DRAFT); },
        onDiscard: () => { mark(); apply(published); keepDraft(); },
        note: memoCount() ? `요청 메모 ${memoCount()}개는 저장과 따로 "요청서 복사"로 보내 주세요.` : null,
      });
    }
  }
  T.setCloseGuard(() => { if (editing) setEditing(false); return true; });

  const memoCount = () => Object.keys(memos.nodes).length + memos.regions.length;
  const nameOf = id => T.nodes.get(id)?.name || id;

  // 고른 노드 표시, 영역 메모 테두리.
  function paint() {
    for (const group of T.nodeLayer.querySelectorAll('[data-node]')) group.classList.toggle('is-picked', editing && selection.includes(group.dataset.node));
    T.overlayLayer.replaceChildren();
    if (!editing) return;
    const ns = 'http://www.w3.org/2000/svg';
    memos.regions.forEach((region, i) => {
      const rect = document.createElementNS(ns, 'rect');
      for (const [key, value] of Object.entries({ x: region.x, y: region.y, width: region.w, height: region.h, class: 'te-region' })) rect.setAttribute(key, value);
      const label = document.createElementNS(ns, 'text');
      for (const [key, value] of Object.entries({ x: region.x + 8, y: region.y + 26, class: 'te-region-label' })) label.setAttribute(key, value);
      label.textContent = `영역 ${i + 1}`;
      T.overlayLayer.append(rect, label);
    });
    if (pendingRegion) {
      const rect = document.createElementNS(ns, 'rect');
      for (const [key, value] of Object.entries({ x: pendingRegion.x, y: pendingRegion.y, width: pendingRegion.w, height: pendingRegion.h, class: 'te-region is-pending' })) rect.setAttribute(key, value);
      T.overlayLayer.append(rect);
    }
  }

  // ---- 바꾸기 ----
  function changed() { keepDraft(); render(); }
  // 줄이 다른 원을 피해 돌아갈 길이 없으면 끊는다.
  function dropBlocked() {
    const blocked = T.model.edges.filter(([a, b]) => !T.route(a, b).ok);
    if (!blocked.length) return;
    const gone = new Set(blocked.map(([a, b]) => edgeKey(a, b)));
    const kept = T.model.edges.filter(([a, b]) => !gone.has(edgeKey(a, b)));
    T.model.edges.length = 0;
    T.model.edges.push(...kept);
    T.rebuild();
    say(`돌아갈 길이 없어 연결을 끊었습니다: ${blocked.map(([a, b]) => `${nameOf(a)}–${nameOf(b)}`).join(', ')}`);
  }
  function connectToggle() {
    if (selection.length !== 2) return;
    const [a, b] = selection, key = edgeKey(a, b);
    mark();
    if (T.model.edges.some(([x, y]) => edgeKey(x, y) === key)) {
      const kept = T.model.edges.filter(([x, y]) => edgeKey(x, y) !== key);
      T.model.edges.length = 0;
      T.model.edges.push(...kept);
      say(`${nameOf(a)}–${nameOf(b)} 연결을 끊었습니다.`);
    } else if (!T.route(a, b).ok) {
      undoStack.pop();
      say('사이에 원이 막고 있어 돌아갈 길이 없습니다. 노드를 옮긴 뒤 다시 연결하세요.');
      return;
    } else {
      T.model.edges.push([a, b]);
      say(`${nameOf(a)}–${nameOf(b)}를 연결했습니다.`);
    }
    T.rebuild();
    paint();
    changed();
  }
  function addNode() {
    mark();
    const v = T.view, rect = T.screen.getBoundingClientRect();
    const at = T.toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2 + 20);
    const id = `custom:${Date.now().toString(36)}`;
    T.nodes.set(id, { id, kind: 'minor', category: '', x: Math.round(at.x + 40 / v.k), y: Math.round(at.y), glyph: '', name: '새 노드', desc: '', effects: [], custom: true });
    T.rebuild();
    dropBlocked();
    selection = [id];
    paint();
    changed();
  }
  function removeSelected() {
    const ids = selection.filter(id => id !== 'origin');
    if (!ids.length || !confirm(`고른 노드 ${ids.length}개를 지울까요? 이어진 줄도 함께 사라집니다.`)) return;
    mark();
    for (const id of ids) { T.nodes.delete(id); delete memos.nodes[id]; }
    saveMemos();
    selection = [];
    T.rebuild();
    paint();
    changed();
  }
  function setField(id, key, value) {
    const n = T.nodes.get(id);
    if (!n) return;
    mark();
    n[key] = value;
    if (key === 'kind' || key === 'glyph' || key === 'name') { T.rebuild(); dropBlocked(); paint(); }
    else T.draw();
    keepDraft();
  }

  // ---- 패널 ----
  const undoButton = h('button', { type: 'button', title: 'Ctrl+Z', onclick: () => travel(undoStack, redoStack) }, '↶');
  const redoButton = h('button', { type: 'button', title: 'Ctrl+Shift+Z', onclick: () => travel(redoStack, undoStack) }, '↷');
  const linkButton = h('button', { type: 'button', onclick: connectToggle }, '연결');
  const requestButton = h('button', { type: 'button', onclick: () => window.UIE?.copyDialog('무공록 수정 요청서', requestText()) });
  const body = h('div', { class: 'te-body' });
  panel.append(
    h('header', {}, h('strong', {}, '무공록 수정'), h('button', { type: 'button', class: 'te-done', onclick: () => setEditing(false) }, '끝내기')),
    h('div', { class: 'te-tools' }, undoButton, redoButton,
      h('button', { type: 'button', onclick: addNode }, '+ 노드'), linkButton,
      h('button', { type: 'button', class: 'te-danger', onclick: removeSelected }, '지우기'), requestButton),
    h('p', { class: 'te-hint' }, '노드 누르기(Shift: 여러 개) · 끌어서 이동 · 빈 곳 끌기 = 영역 선택 · Space+끌기나 오른쪽 버튼 끌기 = 화면 이동 · 휠 = 확대'),
    body);

  const put = (...parts) => body.append(...parts.filter(part => part !== null && part !== undefined && part !== false));
  function field(label, input) { return h('label', { class: 'te-field' }, h('span', {}, label), input); }

  function render() {
    paint();
    undoButton.disabled = !undoStack.length;
    redoButton.disabled = !redoStack.length;
    requestButton.textContent = `요청서 복사 (${memoCount()})`;
    const pair = selection.length === 2;
    const linked = pair && T.model.edges.some(([x, y]) => edgeKey(x, y) === edgeKey(...selection));
    linkButton.disabled = !pair;
    linkButton.textContent = linked ? '연결 해제' : '연결';
    if (!editing) return;
    body.replaceChildren();
    if (selection.length === 1 && T.nodes.has(selection[0])) {
      const id = selection[0], n = T.nodes.get(id);
      const kind = h('select', { onchange: event => setField(id, 'kind', event.target.value) }, ...KINDS.map(([value, label]) => h('option', { value, selected: n.kind === value }, label)));
      const category = h('select', { onchange: event => setField(id, 'category', event.target.value) }, ...CATEGORIES.map(([value, label]) => h('option', { value, selected: (n.category || '') === value }, label)));
      put(
        h('p', { class: 'te-kind' }, id === 'origin' ? '시작점(캐릭터)' : `${n.custom ? '새 노드' : '기본 노드'} · 연결 ${T.neighbors(id).length}개${T.neighbors(id).length ? '' : ' · 고립됨'}`),
        id === 'origin' ? null : h('div', { class: 'te-row' }, field('종류', kind), field('갈래', category)),
        field('한자(원 안 글자)', h('input', { type: 'text', maxLength: 2, value: n.glyph || '', oninput: event => setField(id, 'glyph', event.target.value) })),
        field('이름', h('input', { type: 'text', value: n.name || '', oninput: event => setField(id, 'name', event.target.value) })),
        field('설명', h('textarea', { rows: 3, value: n.desc || '', oninput: event => setField(id, 'desc', event.target.value) })),
        field('효과 (한 줄에 하나, 예: 체력 +3%)', h('textarea', { rows: 3, value: (n.effects || []).join('\n'), oninput: event => setField(id, 'effects', event.target.value.split('\n').map(line => line.trim()).filter(Boolean)) })),
        field('요청 메모 · 어떻게 바꾸고 싶은지 (사이트에는 안 올라감)', h('textarea', { rows: 3, value: memos.nodes[id] || '', placeholder: '예: 이 자리에 화산 검기 강화 노드 3개를 일렬로.',
          oninput: event => { if (event.target.value.trim()) memos.nodes[id] = event.target.value; else delete memos.nodes[id]; saveMemos(); requestButton.textContent = `요청서 복사 (${memoCount()})`; } })),
        T.neighbors(id).length ? h('p', { class: 'te-links' }, `이어진 노드: ${T.neighbors(id).map(nameOf).join(', ')}`) : null);
    } else if (selection.length > 1) {
      put(h('p', { class: 'te-kind' }, `${selection.length}개 선택`), h('p', { class: 'te-links' }, selection.map(nameOf).join(', ')),
        pair ? h('p', { class: 'te-hint' }, linked ? '두 노드는 이어져 있습니다. 위의 "연결 해제"로 끊습니다.' : '위의 "연결"로 두 노드를 잇습니다. 사이에 원이 있으면 돌아서 갑니다.') : null);
    }
    if (pendingRegion) {
      const area = h('textarea', { rows: 3, placeholder: '예: 이 영역은 화산 군집을 더 넓게, 꽃잎 모양으로 펼치고 싶다.' });
      put(h('div', { class: 'te-region-form' },
        field(`이 영역을 어떻게 바꾸고 싶은지 (안의 노드 ${pendingRegion.ids.length}개)`, area),
        h('div', { class: 'te-row' },
          h('button', { type: 'button', class: 'te-primary', onclick: () => {
            if (!area.value.trim()) { area.focus(); return; }
            memos.regions.push({ ...pendingRegion, text: area.value });
            saveMemos();
            pendingRegion = null;
            render();
          } }, '영역 메모 남기기'),
          h('button', { type: 'button', onclick: () => { pendingRegion = null; render(); } }, '취소'))));
    }
    if (memos.regions.length) {
      put(h('div', { class: 'te-regions' }, h('strong', {}, `영역 메모 ${memos.regions.length}개`),
        ...memos.regions.map((region, i) => h('div', { class: 'te-region-item' },
          h('span', {}, `영역 ${i + 1} · ${region.text}`),
          h('button', { type: 'button', 'aria-label': `영역 ${i + 1} 메모 지우기`, onclick: () => { memos.regions.splice(i, 1); saveMemos(); render(); } }, '×')))));
    }
    if (!selection.length && !pendingRegion && !memos.regions.length) put(h('p', { class: 'te-hint' }, '노드를 누르거나 빈 곳을 끌어 영역을 고르세요.'));
  }

  // ---- 끌기: 노드 이동 / 영역 선택 / 화면 이동 ----
  let drag = null, spaceHeld = false;
  addEventListener('keydown', event => { if (event.code === 'Space' && editing && !event.target.closest?.('input, textarea, select')) { spaceHeld = true; event.preventDefault(); } }, true);
  addEventListener('keyup', event => { if (event.code === 'Space') spaceHeld = false; }, true);
  T.svg.addEventListener('pointerdown', event => {
    if (!editing || event.button !== 0) return;
    event.preventDefault();
    try { T.svg.setPointerCapture(event.pointerId); } catch {}
    const id = event.target.closest('[data-node]')?.dataset.node;
    if (spaceHeld) { drag = { mode: 'pan', x: event.clientX, y: event.clientY }; return; }
    if (id) {
      if (event.shiftKey) selection = selection.includes(id) ? selection.filter(other => other !== id) : [...selection, id];
      else if (!selection.includes(id)) selection = [id];
      pendingRegion = null;
      render();
      const moving = selection.filter(other => other !== 'origin' && T.nodes.has(other));
      drag = { mode: 'move', x: event.clientX, y: event.clientY, moved: false, start: moving.map(other => [other, T.nodes.get(other).x, T.nodes.get(other).y]) };
    } else {
      drag = { mode: 'region', x: event.clientX, y: event.clientY, moved: false, add: event.shiftKey };
    }
  });
  T.svg.addEventListener('pointermove', event => {
    if (!drag) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (drag.mode === 'pan') { T.panBy(dx, dy); drag.x = event.clientX; drag.y = event.clientY; return; }
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved && drag.mode === 'move') mark();
    drag.moved = true;
    if (drag.mode === 'move') {
      const k = T.view.k;
      for (const [id, x, y] of drag.start) Object.assign(T.nodes.get(id), { x: Math.round(x + dx / k), y: Math.round(y + dy / k) });
      T.layout();
      paint();
    } else {
      Object.assign(marquee.style, { left: `${Math.min(drag.x, event.clientX)}px`, top: `${Math.min(drag.y, event.clientY)}px`, width: `${Math.abs(dx)}px`, height: `${Math.abs(dy)}px` });
      marquee.hidden = false;
    }
  });
  const finish = event => {
    if (!drag) return;
    if (drag.mode === 'move' && drag.moved) { dropBlocked(); paint(); changed(); }
    else if (drag.mode === 'region') {
      marquee.hidden = true;
      if (!drag.moved) { if (!drag.add) { selection = []; pendingRegion = null; render(); } }
      else {
        const a = T.toWorld(Math.min(drag.x, event.clientX), Math.min(drag.y, event.clientY));
        const b = T.toWorld(Math.max(drag.x, event.clientX), Math.max(drag.y, event.clientY));
        const ids = [...T.nodes.values()].filter(n => n.id !== 'origin' && n.x >= a.x && n.x <= b.x && n.y >= a.y && n.y <= b.y).map(n => n.id);
        selection = drag.add ? [...new Set([...selection, ...ids])] : ids;
        pendingRegion = { x: Math.round(a.x), y: Math.round(a.y), w: Math.round(b.x - a.x), h: Math.round(b.y - a.y), ids };
        render();
      }
    }
    drag = null;
  };
  T.svg.addEventListener('pointerup', finish);
  T.svg.addEventListener('pointercancel', finish);
  T.on('open', () => paint());

  addEventListener('keydown', event => {
    if (!editing || event.target.closest?.('input, textarea, select')) return;
    if ((event.ctrlKey || event.metaKey) && (event.code === 'KeyZ' || event.code === 'KeyY')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.code === 'KeyY' || event.shiftKey) travel(redoStack, undoStack); else travel(undoStack, redoStack);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (selection.length || pendingRegion) { selection = []; pendingRegion = null; render(); } else setEditing(false);
    } else if (event.key === 'Delete' && selection.length) removeSelected();
  }, true);

  // ---- 요청서: 메모가 있는 노드와 영역만 ----
  function requestText() {
    const out = ['[천종지자 무공록 수정 요청]', ''];
    const ids = Object.keys(memos.nodes);
    if (ids.length) {
      out.push('■ 노드');
      for (const id of ids) {
        const n = T.nodes.get(id);
        out.push(`- ${n ? n.name : '(지운 노드)'} (${id})${n ? ` · 한자 ${n.glyph || '없음'} · 연결 ${T.neighbors(id).length}개` : ''}`);
        if (n?.effects?.length) out.push(`    지금 효과: ${n.effects.join(', ')}`);
        out.push(`    요청: ${memos.nodes[id]}`);
      }
      out.push('');
    }
    if (memos.regions.length) {
      out.push('■ 영역');
      memos.regions.forEach((region, i) => {
        out.push(`- 영역 ${i + 1} (월드 좌표 ${region.x}, ${region.y} · ${region.w}×${region.h}) · 안의 노드: ${region.ids.map(nameOf).join(', ') || '없음'}`);
        out.push(`    요청: ${region.text}`);
      });
      out.push('');
    }
    if (!ids.length && !memos.regions.length) out.push('(요청 메모가 없습니다. 위치·연결·글·효과 바꿈은 수정을 끝낼 때 사이트에 바로 저장됩니다.)');
    return out.join('\n');
  }

  // ---- 시작: 사이트에 저장된 무공록(또는 이 브라우저의 저장 안 한 바꿈)을 적용 ----
  fetch(`tree.json?t=${Date.now()}`, { cache: 'no-store' })
    .then(response => (response.ok ? response.json() : null))
    .catch(() => null)
    .then(data => {
      // 저장된 모양을 한 번 적용해 같은 형식으로 읽어 두고(비교용), 저장 안 한 바꿈이 있으면 그 위에 적용한다.
      apply(data);
      published = diff();
      if (draft && draft.version === 1) apply(draft);
      render();
    });
})();
