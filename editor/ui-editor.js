// Main-screen UI edit tool. The top "수정" button turns edit mode on: parts get name tags, can be selected,
// dragged, resized, renamed, re-worded or hidden, and new buttons/text/boxes can be added.
// "요청서 복사" turns every change into a request text. Changes live only in this browser (localStorage).
(() => {
  const screen = document.getElementById('title-screen');
  if (!screen) return;
  const STORE = 'cheonjong-ui-edit-v1';
  // [selector, name, kind, options]
  const PARTS = [
    ['#title-screen', '메인 화면 전체', '배경 영역', { fixed: true }],
    ['#title-screen .title-copy', '왼쪽 글 묶음', '영역', { container: true }],
    ['#title-screen .eyebrow', '윗줄 문구', '글'],
    ['#game-title', '게임 제목', '글'],
    ['#title-screen .title-description', '소개 문구', '글'],
    ['#start-battle', '화산 출전 버튼', '버튼'],
    ['#open-martial', '무공록 버튼', '버튼'],
    ['#open-dojo', '연무장 버튼', '버튼'],
    ['#title-screen .prototype-caption', '시제품 안내 문구', '글'],
    ['#title-screen .title-art', '오른쪽 그림 영역', '영역', { container: true }],
    ['#title-screen .ink-circle', '먹 원', '장식'],
    ['#title-screen .hero-art', '주인공 그림', '그림'],
    ['#title-screen .title-seal', '낙관(도장)', '글'],
    ['#title-screen .title-bottom', '하단 줄', '영역', { container: true }],
  ];
  const ADD_KIND = { button: '버튼', text: '글', box: '영역' };

  let state = load();
  let editing = false, showTags = true, hovered = null, drag = null;
  // selection: chosen parts; keyItem: the part others are aligned to (Alt+click), else the screen.
  let selection = [], keyItem = null;
  const items = [];
  const movable = item => !item.fixed;
  const single = () => (selection.length === 1 ? selection[0] : null);

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE));
      if (saved && saved.parts && Array.isArray(saved.added)) return saved;
    } catch {}
    return { parts: {}, added: [], seq: 0 };
  }
  function save() {
    for (const [key, value] of Object.entries(state.parts)) if (!Object.keys(value).length) delete state.parts[key];
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {}
  }

  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === 'class') el.className = value;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
      else if (key in el) el[key] = value;
      else el.setAttribute(key, value);
    }
    el.append(...children);
    return el;
  }

  // Where the editable wording of a part lives: the whole element, lines split by <br>, or its first text node.
  function textSlot(el) {
    if (el.tagName === 'IMG') return null;
    const kids = [...el.children];
    if (!kids.length) return { get: () => el.textContent.trim(), set: value => { el.textContent = value; } };
    if (kids.every(kid => kid.tagName === 'BR')) {
      return { get: () => el.innerText.trim(), set: value => { el.style.whiteSpace = 'pre-line'; el.textContent = value; } };
    }
    const node = [...el.childNodes].find(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
    if (!node) return null;
    return { get: () => node.textContent.trim(), set: value => { node.textContent = value + ' '; } };
  }

  function register(item) {
    item.el.dataset.uie = item.key;
    item.slot = item.added || item.el.textContent.trim() ? textSlot(item.el) : null;
    item.originalText = item.slot ? item.slot.get() : '';
    items.push(item);
    apply(item);
    return item;
  }
  function edit(item) {
    if (item.added) return item.added;
    return state.parts[item.key] || (state.parts[item.key] = {});
  }
  const nameOf = item => edit(item).name || item.defaultName;

  function apply(item) {
    const e = edit(item), style = item.el.style;
    style.translate = e.dx || e.dy ? `${e.dx || 0}px ${e.dy || 0}px` : '';
    style.width = e.w ? `${e.w}px` : '';
    style.height = e.h ? `${e.h}px` : '';
    style.fontSize = e.fs ? `${e.fs}px` : '';
    item.el.classList.toggle('uie-gone', Boolean(e.hidden));
    if (item.slot) item.slot.set(typeof e.text === 'string' ? e.text : item.originalText);
  }

  function createAdded(added) {
    const el = h(added.type === 'button' ? 'button' : 'div', { class: `uie-added uie-added-${added.type}` });
    if (added.type === 'button') el.type = 'button';
    el.style.left = `${added.x}px`;
    el.style.top = `${added.y}px`;
    screen.append(el);
    const defaults = { button: '새 버튼', text: '새 글', box: '' };
    const item = { key: added.id, el, defaultName: `추가한 ${ADD_KIND[added.type]} ${added.id.slice(4)}`, kind: `새 ${ADD_KIND[added.type]}`, added };
    el.textContent = defaults[added.type];
    return register(item);
  }

  for (const [selector, defaultName, kind, options = {}] of PARTS) {
    const el = document.querySelector(selector);
    if (el) register({ key: selector, el, defaultName, kind: `기존 ${kind}`, selector, ...options });
  }
  state.added.forEach(createAdded);

  // ---- toolbar, overlay and inspector ----
  const toggle = h('button', { type: 'button', class: 'uie-toggle', title: '메인 화면 수정 도구 (이 브라우저에만 저장)', onclick: () => setEditing(!editing) });
  const tagToggle = h('input', { type: 'checkbox', checked: true, onchange: () => { showTags = tagToggle.checked; } });
  const tools = h('div', { class: 'uie-tools' },
    h('button', { type: 'button', onclick: () => add('button') }, '+ 버튼'),
    h('button', { type: 'button', onclick: () => add('text') }, '+ 글'),
    h('button', { type: 'button', onclick: () => add('box') }, '+ 영역'),
    h('label', { class: 'uie-check' }, tagToggle, '이름표'),
    h('button', { type: 'button', onclick: openRequest }, '요청서 복사'),
    h('button', { type: 'button', class: 'uie-danger', onclick: resetAll }, '전체 초기화'));
  const ALIGN = [
    ['left', '⇤ 좌측'], ['hcenter', '↔ 가로 중앙'], ['right', '⇥ 우측'],
    ['top', '⤒ 상단'], ['vcenter', '↕ 세로 중앙'], ['bottom', '⤓ 하단'],
  ];
  const alignButtons = ALIGN.map(([mode, label]) => h('button', { type: 'button', onclick: () => align(mode) }, label));
  const alignRef = h('span', { class: 'uie-ref' });
  const alignRow = h('div', { class: 'uie-align' }, h('strong', {}, '정렬'), ...alignButtons, alignRef);
  const bar = h('div', { class: 'uie-bar', role: 'toolbar', 'aria-label': '메인 화면 수정 도구' },
    h('div', { class: 'uie-row' }, toggle, tools), alignRow);
  const layer = h('div', { class: 'uie-layer', 'aria-hidden': 'true' });
  const handle = h('div', { class: 'uie-handle', title: '끌어서 크기 조절 · Shift: 같은 비율' });
  const marquee = h('div', { class: 'uie-marquee', hidden: true });
  layer.append(marquee, handle);
  const frames = [];
  const tags = new Map();

  const panel = h('aside', { class: 'uie-panel', 'aria-label': '선택한 부분 수정', hidden: true });
  document.body.append(bar, layer, panel);
  // Keep typing in the tool away from the game's own keyboard shortcuts.
  for (const host of [bar, panel]) host.addEventListener('keydown', event => event.stopPropagation());

  function setEditing(on) {
    editing = on;
    document.documentElement.classList.toggle('uie-on', on);
    toggle.textContent = on ? '✎ 수정 ON' : '✎ 수정 OFF';
    toggle.setAttribute('aria-pressed', String(on));
    if (!on) setSelection([]);
    if (on) requestAnimationFrame(frame);
  }

  function setSelection(next, nextKey = keyItem) {
    selection = next;
    keyItem = nextKey && selection.includes(nextKey) ? nextKey : null;
    for (const item of items) item.el.classList.toggle('uie-selected', selection.includes(item));
    renderPanel();
    renderAlign();
  }
  const select = item => setSelection(item ? [item] : []);

  function add(type) {
    const rect = screen.getBoundingClientRect();
    const size = { button: [160, 46], text: [120, 30], box: [220, 140] }[type];
    const added = {
      id: `add-${++state.seq}`, type,
      x: Math.round(rect.width / 2 - size[0] / 2),
      y: Math.round(Math.min(window.innerHeight, rect.bottom) / 2 - rect.top - size[1] / 2 + Math.max(0, -rect.top) / 2),
    };
    state.added.push(added);
    save();
    select(createAdded(added));
  }

  function remove(item) {
    state.added = state.added.filter(added => added !== item.added);
    items.splice(items.indexOf(item), 1);
    item.el.remove();
    tags.get(item)?.remove();
    tags.delete(item);
    save();
    setSelection(selection.filter(other => other !== item));
  }

  function resetPart(item) {
    if (item.added) {
      const { id, type, x, y } = item.added;
      for (const key of Object.keys(item.added)) delete item.added[key];
      Object.assign(item.added, { id, type, x, y });
    } else delete state.parts[item.key];
    apply(item);
    save();
    renderPanel();
  }

  function resetAll() {
    if (!confirm('메인 화면 수정 내용(추가한 것 포함)을 모두 지울까요?')) return;
    try { localStorage.removeItem(STORE); } catch {}
    location.reload();
  }

  function set(item, field, value) {
    const e = edit(item);
    if (value === '' || value === null || value === undefined || value === false) delete e[field];
    else e[field] = value;
    apply(item);
    save();
  }

  // Moves a part so its box lands at (x, y) on screen.
  function moveTo(item, x, y) {
    const rect = item.el.getBoundingClientRect(), e = edit(item);
    const dx = Math.round((e.dx || 0) + x - rect.left), dy = Math.round((e.dy || 0) + y - rect.top);
    if (dx) e.dx = dx; else delete e.dx;
    if (dy) e.dy = dy; else delete e.dy;
    apply(item);
  }

  // ---- alignment: to the Alt+clicked key part, otherwise to the main screen ----
  const alignTargets = () => selection.filter(item => movable(item) && item !== keyItem);

  function align(mode) {
    const ref = (keyItem ? keyItem.el : screen).getBoundingClientRect();
    for (const item of alignTargets()) {
      const rect = item.el.getBoundingClientRect();
      let x = rect.left, y = rect.top;
      if (mode === 'left') x = ref.left;
      if (mode === 'hcenter') x = ref.left + (ref.width - rect.width) / 2;
      if (mode === 'right') x = ref.right - rect.width;
      if (mode === 'top') y = ref.top;
      if (mode === 'vcenter') y = ref.top + (ref.height - rect.height) / 2;
      if (mode === 'bottom') y = ref.bottom - rect.height;
      moveTo(item, x, y);
    }
    save();
    syncPanelNumbers();
  }

  function renderAlign() {
    const ready = alignTargets().length > 0;
    alignButtons.forEach(button => { button.disabled = !ready; });
    alignRef.textContent = !selection.length
      ? '요소를 선택하세요 · Shift+클릭/드래그로 여러 개 · Alt+클릭으로 기준 지정'
      : keyItem ? `기준: ${nameOf(keyItem)}` : '기준: 메인 화면 (Alt+클릭으로 기준 요소 지정)';
  }

  // ---- inspector ----
  function renderPanel() {
    panel.replaceChildren();
    panel.hidden = !selection.length;
    if (!selection.length) return;
    const close = h('button', { type: 'button', class: 'uie-close', 'aria-label': '선택 해제', onclick: () => setSelection([]) }, '×');
    if (selection.length > 1) {
      panel.append(
        h('header', {}, h('div', {}, h('strong', {}, `${selection.length}개 선택`), h('small', {}, keyItem ? `기준: ${nameOf(keyItem)}` : '기준: 메인 화면')), close),
        h('ul', { class: 'uie-list' }, ...selection.map(item => h('li', { class: item === keyItem ? 'is-key' : '' }, item === keyItem ? `★ ${nameOf(item)}` : nameOf(item)))),
        h('p', { class: 'uie-hint' }, '끌면 함께 움직여요. 위쪽 정렬 버튼으로 맞추고, Alt+클릭한 요소가 기준이 돼요(다시 Alt+클릭하면 해제).'));
      return;
    }
    const item = selection[0], e = edit(item);
    const where = item.selector ? ` · ${item.selector.replace('#title-screen ', '')}` : '';
    const number = (label, field, step = 1) => h('label', { class: 'uie-num' }, label,
      h('input', { type: 'number', step, value: e[field] ?? '', placeholder: '원래',
        oninput: event => set(item, field, event.target.value === '' ? '' : Number(event.target.value)) }));

    panel.append(
      h('header', {}, h('div', {}, h('strong', {}, nameOf(item)), h('small', {}, item.kind + where)), close),
      h('label', {}, '이름 · 이 부분이 무엇인지',
        h('input', { type: 'text', value: nameOf(item), oninput: event => { set(item, 'name', event.target.value.trim() === item.defaultName ? '' : event.target.value); panel.querySelector('header strong').textContent = nameOf(item); } })));
    if (item.slot) {
      panel.append(h('label', {}, '글자',
        h('textarea', { rows: 2, value: typeof e.text === 'string' ? e.text : item.originalText,
          oninput: event => set(item, 'text', event.target.value === item.originalText ? '' : event.target.value) })));
    }
    panel.append(
      h('label', {}, '요청 메모 · 어떻게 바꾸고 싶은지',
        h('textarea', { rows: 3, value: e.memo || '', placeholder: '예: 더 크게, 금색으로. 누르면 랭킹 화면이 열리게.',
          oninput: event => set(item, 'memo', event.target.value) })),
      h('div', { class: 'uie-grid' },
        number('가로 이동', 'dx'), number('세로 이동', 'dy'), number('글자 크기', 'fs'),
        number('너비', 'w'), number('높이', 'h')),
      h('div', { class: 'uie-actions' }, ...[
        item.added && h('button', { type: 'button', class: 'uie-danger', onclick: () => remove(item) }, '삭제'),
        !item.added && !item.fixed && h('button', { type: 'button', onclick: () => { set(item, 'hidden', !e.hidden); renderPanel(); } }, e.hidden ? '보이기' : '숨기기'),
        h('button', { type: 'button', onclick: () => resetPart(item) }, '원래대로'),
      ].filter(Boolean)),
      h('p', { class: 'uie-hint' }, item.fixed
        ? '배경 영역은 이름과 메모만 남길 수 있어요. 여기서 끌면 여러 요소를 한 번에 선택해요.'
        : '끌어서 옮기고, 오른쪽 아래 점으로 크기를 바꿔요(Shift: 같은 비율). 방향키로 1px(Shift 10px) 이동.'));
  }

  function syncPanelNumbers() {
    const item = single();
    if (!item || panel.hidden) return;
    const e = edit(item);
    const inputs = panel.querySelectorAll('.uie-num input');
    ['dx', 'dy', 'fs', 'w', 'h'].forEach((field, index) => {
      if (inputs[index] && document.activeElement !== inputs[index]) inputs[index].value = e[field] ?? '';
    });
  }

  // ---- overlay: name tags, selection frames and resize handle, kept in place every frame while editing ----
  function frame() {
    if (!editing) {
      layer.hidden = true;
      return;
    }
    layer.hidden = screen.hidden;
    for (const item of items) {
      let tag = tags.get(item);
      if (!tag) {
        tag = h('button', { type: 'button', class: 'uie-tag', tabIndex: -1, onpointerdown: event => { event.preventDefault(); event.stopPropagation(); pick(item, event, false); } });
        tags.set(item, tag);
        layer.append(tag);
      }
      const rect = item.el.getBoundingClientRect();
      const visible = showTags && !screen.hidden && rect.width + rect.height > 0;
      tag.hidden = !visible;
      if (!visible) continue;
      const label = item === keyItem ? `★ ${nameOf(item)}` : nameOf(item);
      if (tag.textContent !== label) tag.textContent = label;
      tag.classList.toggle('is-selected', selection.includes(item));
      tag.classList.toggle('is-added', Boolean(item.added));
      const right = item.container || item.fixed;
      tag.style.left = `${Math.max(2, right ? rect.right - tag.offsetWidth - 2 : rect.left)}px`;
      tag.style.top = `${Math.max(item.fixed ? 80 : 2, right ? rect.top + 2 : rect.top - tag.offsetHeight - 1)}px`;
    }
    const framed = selection.filter(movable);
    framed.forEach((item, index) => {
      const box = frames[index] || (frames[index] = layer.appendChild(h('div', { class: 'uie-frame' })));
      const rect = item.el.getBoundingClientRect();
      box.hidden = false;
      box.classList.toggle('is-key', item === keyItem);
      Object.assign(box.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    });
    frames.slice(framed.length).forEach(box => { box.hidden = true; });
    const one = single();
    handle.hidden = !one || !movable(one);
    if (!handle.hidden) {
      const rect = one.el.getBoundingClientRect();
      Object.assign(handle.style, { left: `${rect.right - 4}px`, top: `${rect.bottom - 4}px` });
    }
    requestAnimationFrame(frame);
  }

  // ---- pointer: select, Shift/Alt modifiers, drag to move, marquee to select many, handle to resize ----
  const itemFrom = target => {
    const el = target.closest && target.closest('[data-uie]');
    return el && screen.contains(el) ? items.find(item => item.el === el) : null;
  };

  // fromScreen: pressed on the part itself (may start a drag); tags only select.
  function pick(item, event, fromScreen) {
    if (event.altKey) {
      if (!movable(item)) return;
      const next = selection.includes(item) ? selection : [...selection, item];
      setSelection(next, keyItem === item ? null : item);
      return;
    }
    const area = item.fixed || (item.container && !selection.includes(item));
    if (fromScreen && area) {
      drag = { mode: 'marquee', item, add: event.shiftKey, x: event.clientX, y: event.clientY, moved: false };
      return;
    }
    if (event.shiftKey) {
      if (movable(item)) setSelection(selection.includes(item) ? selection.filter(other => other !== item) : [...selection, item]);
      return;
    }
    if (!selection.includes(item)) select(item);
    if (!fromScreen) return;
    const moving = selection.filter(movable);
    drag = { mode: 'move', x: event.clientX, y: event.clientY, moved: false,
      start: moving.map(part => [part, edit(part).dx || 0, edit(part).dy || 0]) };
  }

  screen.addEventListener('pointerdown', event => {
    if (!editing || event.button !== 0) return;
    const item = itemFrom(event.target);
    if (!item) return;
    event.preventDefault();
    pick(item, event, true);
  }, true);

  handle.addEventListener('pointerdown', event => {
    const item = single();
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = item.el.getBoundingClientRect();
    drag = { mode: 'size', item, x: event.clientX, y: event.clientY, w: rect.width, h: rect.height, moved: false, shift: event.shiftKey,
      fs: item.slot ? parseFloat(getComputedStyle(item.el).fontSize) : 0 };
  });

  // Shift state from the keyboard too, so pressing it in the middle of a resize locks the ratio.
  let shiftHeld = false;
  window.addEventListener('keydown', event => { if (event.key === 'Shift') shiftHeld = true; }, true);
  window.addEventListener('keyup', event => { if (event.key === 'Shift') shiftHeld = false; }, true);
  window.addEventListener('blur', () => { shiftHeld = false; });

  const marqueeRect = event => ({
    left: Math.min(drag.x, event.clientX), top: Math.min(drag.y, event.clientY),
    right: Math.max(drag.x, event.clientX), bottom: Math.max(drag.y, event.clientY),
  });

  window.addEventListener('pointermove', event => {
    if (editing && !drag) {
      const item = itemFrom(event.target);
      if (item !== hovered) {
        hovered?.el.classList.remove('uie-hover');
        hovered = item;
        hovered?.el.classList.add('uie-hover');
      }
    }
    if (!drag) return;
    const mx = event.clientX - drag.x, my = event.clientY - drag.y;
    if (!drag.moved && Math.abs(mx) + Math.abs(my) < 3) return;
    drag.moved = true;
    if (drag.mode === 'move') {
      for (const [item, dx, dy] of drag.start) {
        const e = edit(item);
        e.dx = Math.round(dx + mx);
        e.dy = Math.round(dy + my);
        apply(item);
      }
    } else if (drag.mode === 'size') {
      const e = edit(drag.item);
      let w = drag.w + mx, height = drag.h + my;
      if (event.shiftKey || shiftHeld || drag.shift) {
        // Same ratio: the box (and its lettering) scale together.
        const k = Math.max(0.05, Math.abs(mx / drag.w) > Math.abs(my / drag.h) ? w / drag.w : height / drag.h);
        w = drag.w * k;
        height = drag.h * k;
        if (drag.fs) e.fs = Math.max(6, Math.round(drag.fs * k * 10) / 10);
      }
      e.w = Math.max(16, Math.round(w));
      e.h = Math.max(12, Math.round(height));
      apply(drag.item);
    } else {
      const rect = marqueeRect(event);
      marquee.hidden = false;
      Object.assign(marquee.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.right - rect.left}px`, height: `${rect.bottom - rect.top}px` });
    }
    syncPanelNumbers();
  });

  window.addEventListener('pointerup', event => {
    if (drag?.mode === 'marquee') {
      marquee.hidden = true;
      if (!drag.moved) {
        // A plain click on an area selects that area.
        if (!drag.add) select(drag.item);
        else if (movable(drag.item)) setSelection(selection.includes(drag.item) ? selection.filter(other => other !== drag.item) : [...selection, drag.item]);
      } else {
        const area = marqueeRect(event);
        const hits = items.filter(item => {
          if (!movable(item)) return false;
          const rect = item.el.getBoundingClientRect();
          return rect.width + rect.height > 0 && rect.left >= area.left && rect.right <= area.right && rect.top >= area.top && rect.bottom <= area.bottom;
        });
        setSelection(drag.add ? [...new Set([...selection, ...hits])] : hits);
      }
    } else if (drag?.moved) save();
    drag = null;
  });

  // In edit mode the page's own buttons and images must not react.
  document.addEventListener('click', event => {
    if (editing && screen.contains(event.target)) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  screen.addEventListener('dragstart', event => { if (editing) event.preventDefault(); });

  // Arrow keys nudge the selection; nothing happens while typing in a field.
  const typing = target => target.closest?.('input, textarea, select, [contenteditable], .uie-panel, .uie-modal, .uie-bar');
  window.addEventListener('keydown', event => {
    if (!editing || screen.hidden || !selection.length || typing(event.target)) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); setSelection([]); return; }
    const step = event.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!move) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    for (const item of selection.filter(movable)) {
      const e = edit(item);
      set(item, 'dx', (e.dx || 0) + move[0] || '');
      set(item, 'dy', (e.dy || 0) + move[1] || '');
    }
    syncPanelNumbers();
  }, true);

  // The tool belongs to the main screen only.
  const syncVisibility = () => { bar.hidden = screen.hidden; if (screen.hidden) setSelection([]); };
  new MutationObserver(syncVisibility).observe(screen, { attributes: true, attributeFilter: ['hidden'] });
  syncVisibility();
  setEditing(false);

  // ---- change request ----
  function describe(item) {
    const e = edit(item), lines = [];
    if (e.name) lines.push(`이름표: "${e.name}"`);
    if (typeof e.text === 'string') lines.push(item.added ? `글자: "${e.text}"` : `글자: "${item.originalText}" → "${e.text}"`);
    if (e.dx || e.dy) {
      const parts = [];
      if (e.dx) parts.push(`${e.dx > 0 ? '오른쪽' : '왼쪽'} ${Math.abs(e.dx)}px`);
      if (e.dy) parts.push(`${e.dy > 0 ? '아래' : '위'} ${Math.abs(e.dy)}px`);
      lines.push(`위치: ${parts.join(', ')} 이동`);
    }
    if (e.w || e.h) lines.push(`크기: ${e.w ? `너비 ${e.w}px` : ''}${e.w && e.h ? ', ' : ''}${e.h ? `높이 ${e.h}px` : ''}`);
    if (e.fs) lines.push(`글자 크기: ${e.fs}px`);
    if (e.hidden) lines.push('숨김(없애기)');
    if (e.memo) lines.push(`요청: ${e.memo}`);
    return lines;
  }

  function requestText() {
    const rect = screen.getBoundingClientRect();
    const out = ['[천종지자 메인 화면 수정 요청]', `기준 화면: ${Math.round(rect.width)}×${window.innerHeight}px`, ''];
    const changed = items.filter(item => !item.added && describe(item).length);
    const added = items.filter(item => item.added);
    if (changed.length) {
      out.push('■ 기존 부분 변경');
      for (const item of changed) {
        out.push(`- ${item.defaultName} (${item.selector})`);
        describe(item).forEach(line => out.push(`    ${line}`));
      }
      out.push('');
    }
    if (added.length) {
      out.push('■ 새로 추가');
      for (const item of added) {
        const box = item.el.getBoundingClientRect();
        const left = Math.round(box.left - rect.left), top = Math.round(box.top - rect.top);
        out.push(`- ${ADD_KIND[item.added.type]} "${nameOf(item)}"`);
        out.push(`    위치: 메인 화면 왼쪽에서 ${left}px(${Math.round(left / rect.width * 100)}%), 위에서 ${top}px · 크기 ${Math.round(box.width)}×${Math.round(box.height)}px`);
        describe(item).filter(line => !line.startsWith('이름표') && !line.startsWith('위치')).forEach(line => out.push(`    ${line}`));
      }
      out.push('');
    }
    if (!changed.length && !added.length) out.push('(아직 바꾼 것이 없습니다)', '');
    out.push('■ 원본 데이터', JSON.stringify(state));
    return out.join('\n');
  }

  function openRequest() {
    const text = requestText();
    const status = h('span', { class: 'uie-status' });
    const area = h('textarea', { readOnly: true, rows: 14, value: text });
    const copy = async () => {
      try { await navigator.clipboard.writeText(text); status.textContent = '복사했어요. 대화창에 붙여넣으세요.'; }
      catch { area.select(); status.textContent = '자동 복사가 막혔어요. 글을 선택해서 복사하세요.'; }
    };
    const dialog = h('div', { class: 'uie-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': '수정 요청서',
      onclick: event => { if (event.target === dialog) dialog.remove(); } },
      h('div', { class: 'uie-modal-card' },
        h('strong', {}, '수정 요청서'), area,
        h('div', { class: 'uie-actions' }, status,
          h('button', { type: 'button', onclick: copy }, '다시 복사'),
          h('button', { type: 'button', onclick: () => dialog.remove() }, '닫기'))));
    dialog.addEventListener('keydown', event => { event.stopPropagation(); if (event.key === 'Escape') dialog.remove(); });
    document.body.append(dialog);
    copy();
  }
})();
