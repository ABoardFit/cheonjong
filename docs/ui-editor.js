// Page edit tool (every screen). "✎ 수정" turns edit mode on: parts get name tags and can be selected,
// dragged, resized, renamed, re-worded, reordered or hidden, and buttons/text/boxes can be added.
// Layout changes are the site's layout: turning edit mode off offers to save them to docs/layout.json
// in the GitHub repo (with the owner's key kept in this browser), which every visitor then gets.
// Request memos stay in this browser and go out only through "요청서 복사".
(() => {
  const SCREENS = ['title-screen', 'martial-screen', 'game-screen', 'dojo-screen'];
  const SCREEN_NAMES = { 'title-screen': '메인', 'martial-screen': '무공록', 'game-screen': '전투', 'dojo-screen': '동작 비교' };
  const DRAFT = 'cheonjong-ui-draft-v3', MEMOS = 'cheonjong-ui-memo-v3', TOKEN = 'cheonjong-ui-token';
  const REPO = 'ABoardFit/cheonjong', LAYOUT_PATH = 'docs/layout.json';
  // Phone layout (the hub's own breakpoint) keeps its own edits.
  const NARROW = 960;
  // Curated parts of the main screen: [selector, name, kind, options]; dynamic = the game fills its text.
  const TITLE_PARTS = [
    ['#title-screen .hub-brand', '제목 묶음', '영역', { container: true }],
    ['#title-screen .eyebrow', '윗줄 문구', '글'],
    ['#game-title', '게임 제목', '글'],
    ['#title-screen .title-description', '소개 문구', '글'],
    ['#title-screen .hub-factions', '세력 칸(정파·사파·세외)', '영역', { dynamic: true }],
    ['#open-dojo', '동작 비교 링크', '버튼'],
    ['#title-screen .hub-side', '재화·시설 묶음', '영역', { container: true }],
    ['#hub-wallet', '은자 · 비급', '글', { dynamic: true }],
    ['[data-facility="alchemy"]', '연단방 버튼', '버튼'],
    ['[data-facility="forge"]', '대장간 버튼', '버튼'],
    ['[data-facility="hall"]', '연무장 버튼', '버튼'],
    ['[data-facility="seclusion"]', '폐관동 버튼', '버튼'],
    ['#title-screen .hub-portrait', '캐릭터 영역', '영역', { container: true }],
    ['#title-screen .ink-circle', '먹 원', '장식'],
    ['#title-screen .hub-emblem', '세력 문양', '그림'],
    ['#hub-character', '캐릭터(누르면 무공록)', '버튼'],
    ['#title-screen .title-seal', '도장', '글', { dynamic: true }],
    ['#hub-nameplate', '별호 · 이름', '버튼', { dynamic: true }],
    ['#open-martial', '무공록 버튼', '버튼'],
    ['#start-battle', '출전 버튼', '버튼'],
    ['#hub-stage-caption', '현재 시련 설명', '글', { dynamic: true }],
    ['#hub-stats', '능력치 판', '영역', { container: true, dynamic: true }],
    ['#title-screen .title-bottom', '하단 줄', '영역', { container: true }],
  ];
  // Other screens: these elements become parts automatically.
  const AUTO = 'button, h1, h2, h3, header, footer, aside, nav, img, canvas, section, p, kbd, [id]';
  const AUTO_LIMIT = 150;
  const ADD_KIND = { button: '버튼', text: '글', box: '영역' };

  // ---- storage ----
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
    del(key) { try { localStorage.removeItem(key); } catch {} },
  };
  const parse = text => { try { return JSON.parse(text); } catch { return null; } };
  const emptyMode = () => ({ parts: {}, added: [], seq: 0 });
  const normalize = data => ({
    version: 3,
    wide: { ...emptyMode(), ...(data && data.wide) },
    narrow: { ...emptyMode(), ...(data && data.narrow) },
  });
  // Drop empty part entries so equal layouts compare equal.
  function clean(data) {
    const out = normalize(JSON.parse(JSON.stringify(data)));
    for (const key of ['wide', 'narrow']) {
      for (const [part, value] of Object.entries(out[key].parts)) if (!Object.keys(value).length) delete out[key].parts[part];
    }
    return out;
  }
  const same = (a, b) => JSON.stringify(clean(a)) === JSON.stringify(clean(b));

  let published = normalize(null);
  const draft = parse(store.get(DRAFT));
  let doc = draft && draft.version === 3 ? normalize(draft) : normalize(null);
  const memos = parse(store.get(MEMOS)) || {};
  let mode = innerWidth > NARROW ? 'wide' : 'narrow';
  const layout = () => doc[mode];
  const dirty = () => !same(doc, published);

  // ---- undo / redo ----
  const undoStack = [], redoStack = [];
  let lastMark = { key: '', at: 0 };
  // Snapshot before a change; repeated typing into one field within a second counts as one step.
  function mark(key = '') {
    const now = Date.now();
    if (key && key === lastMark.key && now - lastMark.at < 1000) { lastMark.at = now; return; }
    lastMark = { key, at: now };
    undoStack.push(JSON.stringify(doc));
    if (undoStack.length > 200) undoStack.shift();
    redoStack.length = 0;
  }
  function commit() {
    if (dirty()) store.set(DRAFT, JSON.stringify(clean(doc))); else store.del(DRAFT);
    rebuild();
  }
  function travel(from, to) {
    if (!from.length) return;
    to.push(JSON.stringify(doc));
    doc = normalize(JSON.parse(from.pop()));
    lastMark = { key: '', at: 0 };
    commit();
  }

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

  // ---- parts ----
  let items = [];
  let editing = false, showTags = true, hovered = null, drag = null;
  // selection: chosen parts; keyItem: the part others are aligned to (Alt+click), else the screen.
  let selection = [], keyItem = null;
  const originals = new WeakMap(); // element → wording before any edit
  const styled = new Set();        // elements this tool has styled
  const forcedPosition = new WeakSet();
  const carriers = new Map();      // part → the box its stacking order is set on

  const screenEl = id => document.getElementById(id);
  const activeScreen = () => SCREENS.map(screenEl).find(el => el && !el.hidden) || null;
  const movable = item => !item.fixed;
  const single = () => (selection.length === 1 ? selection[0] : null);
  const edit = item => item.added || layout().parts[item.key] || (layout().parts[item.key] = {});
  const nameOf = item => edit(item).name || item.defaultName;
  const ungrouped = item => Boolean(item.container && edit(item).ungrouped);
  const memoOf = item => (memos[mode] && memos[mode][item.key] && memos[mode][item.key].text) || '';
  const memoCount = () => Object.values(memos).reduce((sum, list) => sum + Object.keys(list).length, 0);

  // Where the wording of a part lives: the whole element, lines split by <br>, or its first text node.
  function textSlot(el) {
    if (el.tagName === 'IMG' || el.tagName === 'CANVAS') return null;
    const kids = [...el.children];
    if (!kids.length) return { get: () => el.textContent.trim(), set: value => { el.textContent = value; } };
    if (kids.every(kid => kid.tagName === 'BR')) {
      return { get: () => el.innerText.trim(), set: value => { el.style.whiteSpace = 'pre-line'; el.textContent = value; } };
    }
    const node = [...el.childNodes].find(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
    if (!node) return null;
    return { get: () => node.textContent.trim(), set: value => { node.textContent = value + ' '; } };
  }

  // A selector that finds this element again: nearest id, then child steps.
  function pathOf(el) {
    const steps = [];
    let node = el;
    while (node && node !== document.body) {
      if (node.id) { steps.unshift(`#${CSS.escape(node.id)}`); return steps.join(' > '); }
      const parent = node.parentElement;
      const sameTag = [...parent.children].filter(child => child.tagName === node.tagName);
      steps.unshift(node.tagName.toLowerCase() + (sameTag.length > 1 ? `:nth-of-type(${sameTag.indexOf(node) + 1})` : ''));
      node = parent;
    }
    return steps.join(' > ');
  }
  function autoName(el) {
    const label = el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('alt') || '';
    const text = (label || el.textContent || '').replace(/\s+/g, ' ').trim();
    const kind = { BUTTON: '버튼', H1: '제목', H2: '제목', H3: '제목', IMG: '그림', CANVAS: '화면', P: '글', KBD: '키' }[el.tagName] || '영역';
    const name = text ? text.slice(0, 16) + (text.length > 16 ? '…' : '') : `${kind}${el.id ? ` #${el.id}` : ''}`;
    return { name, kind };
  }
  const visibleBox = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  function register(props) {
    if (items.some(item => item.el === props.el)) return null;
    const item = { ...props };
    item.el.dataset.uie = item.key;
    if (!item.dynamic && !item.auto && (item.added || item.el.textContent.trim())) {
      item.slot = textSlot(item.el);
      if (item.slot && !originals.has(item.el)) originals.set(item.el, item.slot.get());
    }
    items.push(item);
    return item;
  }
  const screenOf = el => SCREENS.find(id => screenEl(id)?.contains(el)) || null;

  function createAdded(added) {
    const root = screenEl(added.screen || 'title-screen');
    if (!root) return;
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
    const el = h(added.type === 'button' ? 'button' : 'div', { class: `uie-added uie-added-${added.type}` });
    if (added.type === 'button') el.type = 'button';
    el.style.left = `${added.x}px`;
    el.style.top = `${added.y}px`;
    el.textContent = { button: '새 버튼', text: '새 글', box: '' }[added.type];
    root.append(el);
    register({ key: added.id, el, defaultName: `추가한 ${ADD_KIND[added.type]} ${added.id.slice(4)}`, kind: `새 ${ADD_KIND[added.type]}`, added, screen: root.id });
  }

  function apply(item) {
    const e = edit(item), el = item.el, style = el.style;
    styled.add(el);
    style.translate = e.dx || e.dy ? `${e.dx || 0}px ${e.dy || 0}px` : '';
    style.width = e.w ? `${e.w}px` : '';
    style.height = e.h ? `${e.h}px` : '';
    style.fontSize = e.fs ? `${e.fs}px` : '';
    // Stacking order goes on the box that actually competes with the rest of the screen (see stackCarrier).
    const carrier = Number.isFinite(e.z) ? stackCarrier(el) : null, previous = carriers.get(el);
    if (previous && previous !== carrier) setZ(previous, null);
    if (!carrier) { setZ(el, null); carriers.delete(el); }
    else if (carrier === el) { setZ(el, e.z); carriers.set(el, el); }
    else {
      // Several trapped parts share their group's box: a group with its own order keeps it,
      // otherwise the frontmost of them counts.
      const owner = items.find(other => other.el === carrier);
      const own = owner && Number.isFinite(edit(owner).z);
      const current = carrier.style.zIndex === '' ? -Infinity : Number(carrier.style.zIndex);
      if (!own) setZ(carrier, Math.max(current, e.z));
      carriers.set(el, carrier);
    }
    el.classList.toggle('uie-gone', Boolean(e.hidden));
    if (item.slot) item.slot.set(typeof e.text === 'string' ? e.text : originals.get(el) ?? '');
  }

  // z-index only orders boxes inside one stacking layer. If an ancestor (below the screen) opens its own
  // layer - moved, faded, or given an order itself - the part cannot leave it, so the order goes on the
  // outermost such ancestor and the whole group moves in front of / behind the rest.
  function opensLayer(node) {
    const cs = getComputedStyle(node), parentDisplay = node.parentElement ? getComputedStyle(node.parentElement).display : '';
    return (cs.zIndex !== 'auto' && (cs.position !== 'static' || /flex|grid/.test(parentDisplay)))
      || cs.translate !== 'none' || cs.transform !== 'none' || cs.scale !== 'none' || cs.rotate !== 'none'
      || Number(cs.opacity) < 1 || cs.isolation === 'isolate' || cs.filter !== 'none' || cs.mixBlendMode !== 'normal'
      || /paint|strict|content/.test(cs.contain) || /transform|opacity|filter/.test(cs.willChange);
  }
  function stackCarrier(el) {
    const root = SCREENS.map(screenEl).find(screen => screen && screen.contains(el));
    let carrier = el;
    for (let node = el.parentElement; node && node !== root; node = node.parentElement) {
      if (opensLayer(node)) carrier = node;
    }
    return carrier;
  }
  // z-index needs a positioned box, so a static one becomes relative (no visual shift).
  function setZ(node, z) {
    styled.add(node);
    node.style.zIndex = z === null ? '' : String(z);
    if (forcedPosition.has(node)) { node.style.position = ''; forcedPosition.delete(node); }
    if (z !== null && getComputedStyle(node).position === 'static') { node.style.position = 'relative'; forcedPosition.add(node); }
  }

  function unstyle(el) {
    const style = el.style;
    style.translate = style.width = style.height = style.fontSize = style.zIndex = '';
    if (forcedPosition.has(el)) { style.position = ''; forcedPosition.delete(el); }
    el.classList.remove('uie-gone', 'uie-selected', 'uie-hover');
    delete el.dataset.uie;
  }

  // Rebuild the part list for the current layout and screen, then apply every edit.
  function rebuild() {
    const keep = new Set(selection.map(item => item.key)), keepKey = keyItem?.key;
    for (const item of items) {
      if (item.slot && originals.has(item.el)) item.slot.set(originals.get(item.el));
      if (item.added) item.el.remove();
    }
    styled.forEach(unstyle);
    styled.clear();
    carriers.clear();
    items = [];
    const title = screenEl('title-screen');
    for (const [selector, defaultName, kind, options = {}] of TITLE_PARTS) {
      const el = document.querySelector(selector);
      if (el) register({ key: selector, el, defaultName, kind: `메인 · ${kind}`, selector, screen: 'title-screen', ...options });
    }
    for (const id of SCREENS) {
      const root = screenEl(id);
      if (root) register({ key: `#${id}`, el: root, defaultName: `${SCREEN_NAMES[id]} 화면 전체`, kind: '배경 영역', selector: `#${id}`, screen: id, fixed: true });
    }
    // Saved parts on other screens, found again by their selector.
    for (const key of Object.keys(layout().parts)) {
      if (items.some(item => item.key === key)) continue;
      let el = null;
      try { el = document.querySelector(key); } catch {}
      if (!el) continue;
      const { name, kind } = autoName(el);
      register({ key, el, defaultName: name, kind: `${SCREEN_NAMES[screenOf(el)] || ''} · ${kind}`, selector: key, screen: screenOf(el), auto: true });
    }
    layout().added.forEach(createAdded);
    const active = activeScreen();
    if (editing && active && active !== title) collectAuto(active);
    markContainers();
    items.forEach(apply);
    selection = items.filter(item => keep.has(item.key));
    keyItem = items.find(item => item.key === keepKey && selection.includes(item)) || null;
    for (const item of items) item.el.classList.toggle('uie-selected', selection.includes(item));
    renderPanel();
    renderBar();
  }

  function collectAuto(root) {
    let count = 0;
    for (const el of root.querySelectorAll(AUTO)) {
      if (count >= AUTO_LIMIT) break;
      if (el.closest('.uie-added') || !visibleBox(el)) continue;
      const key = pathOf(el);
      if (items.some(item => item.key === key || item.el === el)) continue;
      const { name, kind } = autoName(el);
      register({ key, el, defaultName: name, kind: `${SCREEN_NAMES[root.id]} · ${kind}`, selector: key, screen: root.id, auto: true });
      count++;
    }
  }
  // An automatic part holding other parts acts as a grouping area.
  function markContainers() {
    for (const item of items) {
      if (!item.auto) continue;
      item.container = items.some(other => other !== item && !other.fixed && item.el.contains(other.el));
    }
  }

  // ---- toolbar, overlay and inspector ----
  const tab = h('button', { type: 'button', class: 'uie-tab', title: '화면 수정 도구', onclick: () => setEditing(true) }, '✎ 수정');
  const toggle = h('button', { type: 'button', class: 'uie-toggle', 'aria-pressed': 'true', onclick: () => setEditing(false) }, '✎ 수정 ON');
  const tagToggle = h('input', { type: 'checkbox', checked: true, onchange: () => { showTags = tagToggle.checked; } });
  const undoButton = h('button', { type: 'button', title: 'Ctrl+Z', onclick: () => travel(undoStack, redoStack) }, '↶ 취소');
  const redoButton = h('button', { type: 'button', title: 'Ctrl+Shift+Z', onclick: () => travel(redoStack, undoStack) }, '↷ 다시');
  const requestButton = h('button', { type: 'button', onclick: openRequest });
  const regroupButton = h('button', { type: 'button', hidden: true, title: '해제한 묶음을 모두 다시 묶음 (안의 요소 위치는 그대로)', onclick: regroupAll });
  const tools = h('div', { class: 'uie-tools' },
    undoButton, redoButton,
    h('button', { type: 'button', onclick: () => add('button') }, '+ 버튼'),
    h('button', { type: 'button', onclick: () => add('text') }, '+ 글'),
    h('button', { type: 'button', onclick: () => add('box') }, '+ 영역'),
    h('label', { class: 'uie-check' }, tagToggle, '이름표'),
    requestButton, regroupButton,
    h('button', { type: 'button', class: 'uie-danger', onclick: resetLayout }, '이 배치 초기화'));
  const ALIGN = [
    ['left', '⇤ 좌측'], ['hcenter', '↔ 가로 중앙'], ['right', '⇥ 우측'],
    ['top', '⤒ 상단'], ['vcenter', '↕ 세로 중앙'], ['bottom', '⤓ 하단'],
  ];
  const alignButtons = ALIGN.map(([how, label]) => h('button', { type: 'button', onclick: () => align(how) }, label));
  const ORDER = [['front', '맨 앞으로'], ['forward', '앞으로'], ['backward', '뒤로'], ['back', '맨 뒤로']];
  const orderButtons = ORDER.map(([how, label]) => h('button', { type: 'button', onclick: () => restack(how) }, label));
  const alignRef = h('span', { class: 'uie-ref' });
  const alignRow = h('div', { class: 'uie-align' }, h('strong', {}, '정렬'), ...alignButtons,
    h('strong', { class: 'uie-gap' }, '순서'), ...orderButtons, alignRef);
  const bar = h('div', { class: 'uie-bar', role: 'toolbar', 'aria-label': '화면 수정 도구', hidden: true },
    h('div', { class: 'uie-row' }, toggle, tools), alignRow);
  const layer = h('div', { class: 'uie-layer', 'aria-hidden': 'true', hidden: true });
  const handle = h('div', { class: 'uie-handle', title: '끌어서 크기 조절 · Shift: 같은 비율' });
  const marquee = h('div', { class: 'uie-marquee', hidden: true });
  layer.append(marquee, handle);
  const frames = [];
  const tags = new Map();
  const panel = h('aside', { class: 'uie-panel', 'aria-label': '선택한 부분 수정', hidden: true });
  document.body.append(tab, bar, layer, panel);
  // Keep typing in the tool away from the game's own keyboard shortcuts.
  for (const host of [bar, panel]) host.addEventListener('keydown', event => event.stopPropagation());

  function setEditing(on) {
    if (on === editing) return;
    editing = on;
    document.documentElement.classList.toggle('uie-on', on);
    tab.hidden = on;
    bar.hidden = !on;
    if (on) {
      if (activeScreen()?.id === 'game-screen') window.CheonBattle?.pause?.();
      rebuild();
      requestAnimationFrame(frame);
    } else {
      setSelection([]);
      rebuild();
      if (dirty()) openSaveDialog();
    }
  }

  function setSelection(next, nextKey = keyItem) {
    selection = next;
    keyItem = nextKey && selection.includes(nextKey) ? nextKey : null;
    for (const item of items) item.el.classList.toggle('uie-selected', selection.includes(item));
    renderPanel();
    renderBar();
  }
  const select = item => setSelection(item ? [item] : []);
  const toggleIn = item => setSelection(selection.includes(item) ? selection.filter(other => other !== item) : [...selection, item]);

  function add(type) {
    const root = activeScreen();
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const size = { button: [160, 46], text: [120, 30], box: [220, 140] }[type];
    mark();
    const added = {
      id: `add-${++layout().seq}`, type, screen: root.id,
      x: Math.round(Math.min(rect.width, innerWidth) / 2 - size[0] / 2),
      y: Math.round(Math.max(0, -rect.top) + Math.min(innerHeight, rect.height) / 2 - size[1] / 2),
    };
    layout().added.push(added);
    selection = [];
    commit();
    select(items.find(item => item.key === added.id));
  }

  function remove(item) {
    mark();
    layout().added = layout().added.filter(added => added.id !== item.key);
    if (memos[mode]) delete memos[mode][item.key];
    store.set(MEMOS, JSON.stringify(memos));
    selection = selection.filter(other => other !== item);
    commit();
  }

  function resetPart(item) {
    mark();
    if (item.added) {
      const { id, type, screen, x, y } = item.added;
      for (const key of Object.keys(item.added)) delete item.added[key];
      Object.assign(item.added, { id, type, screen, x, y });
    } else delete layout().parts[item.key];
    commit();
  }

  function resetLayout() {
    if (!confirm(`${mode === 'wide' ? '넓은 화면' : '휴대폰'} 배치의 수정(추가한 것 포함)을 모두 원래대로 돌릴까요? 저장하기 전까지는 Ctrl+Z로 되돌릴 수 있습니다.`)) return;
    mark();
    doc[mode] = emptyMode();
    selection = [];
    commit();
  }

  function set(item, field, value) {
    mark(`${item.key}:${field}`);
    const e = edit(item);
    if (value === '' || value === null || value === undefined || value === false) delete e[field];
    else e[field] = value;
    apply(item);
    if (dirty()) store.set(DRAFT, JSON.stringify(clean(doc))); else store.del(DRAFT);
    renderBar();
  }

  function setMemo(item, text) {
    memos[mode] ||= {};
    if (text.trim()) memos[mode][item.key] = { text, name: nameOf(item), screen: item.screen, selector: item.selector || item.key };
    else delete memos[mode][item.key];
    store.set(MEMOS, JSON.stringify(memos));
    renderBar();
  }

  // Parts to move together: a part inside another chosen area already moves with it.
  const topLevel = list => list.filter(item => movable(item) && !list.some(other => other !== item && movable(other) && !ungrouped(other) && other.el.contains(item.el)));

  // Moves a part so its box lands at (x, y) on screen.
  function moveTo(item, x, y) {
    const rect = item.el.getBoundingClientRect(), e = edit(item);
    const dx = Math.round((e.dx || 0) + x - rect.left), dy = Math.round((e.dy || 0) + y - rect.top);
    if (dx) e.dx = dx; else delete e.dx;
    if (dy) e.dy = dy; else delete e.dy;
    apply(item);
  }

  // ---- alignment: to the Alt+clicked key part, otherwise to the screen ----
  const alignTargets = () => topLevel(selection).filter(item => item !== keyItem);

  function align(how) {
    const targets = alignTargets();
    if (!targets.length) return;
    mark();
    const ref = (keyItem ? keyItem.el : activeScreen()).getBoundingClientRect();
    for (const item of targets) {
      const rect = item.el.getBoundingClientRect();
      let x = rect.left, y = rect.top;
      if (how === 'left') x = ref.left;
      if (how === 'hcenter') x = ref.left + (ref.width - rect.width) / 2;
      if (how === 'right') x = ref.right - rect.width;
      if (how === 'top') y = ref.top;
      if (how === 'vcenter') y = ref.top + (ref.height - rect.height) / 2;
      if (how === 'bottom') y = ref.bottom - rect.height;
      moveTo(item, x, y);
    }
    commit();
  }

  // ---- stacking order: a higher number draws over lower ones; below 0 goes behind ordinary parts ----
  function restack(how) {
    // A part trapped in a moved group (see stackCarrier) reorders that whole group.
    const unitOf = item => {
      const carrier = stackCarrier(item.el);
      return carrier === item.el ? item : items.find(other => other.el === carrier) || item;
    };
    const chosen = [...new Set(selection.filter(movable).map(unitOf))];
    if (!chosen.length) return;
    mark();
    const zOf = item => (Number.isFinite(edit(item).z) ? edit(item).z : 0);
    const others = items.filter(item => movable(item) && !chosen.includes(item) && !ungrouped(item));
    const related = (a, b) => a.el.contains(b.el) || b.el.contains(a.el);
    const overlaps = (a, b) => {
      const p = a.el.getBoundingClientRect(), q = b.el.getBoundingClientRect();
      return p.left < q.right && p.right > q.left && p.top < q.bottom && p.bottom > q.top;
    };
    // Orders stay 1 or more: below 0 a part would sink under the page's plain (transparent) boxes and could
    // no longer be clicked. To go behind something, the parts it overlaps are lifted above it instead.
    // A part trapped in a moved group goes back as that whole group (see stackCarrier).
    const sendBack = item => {
      const unit = { el: stackCarrier(item.el) };
      const covering = others.filter(other => !related(unit, other) && overlaps(unit, other) && stackCarrier(other.el) !== unit.el);
      const lowest = Math.min(...covering.map(zOf));
      const lift = covering.length && lowest < 2 ? 2 - lowest : 0;
      for (const other of covering) edit(other).z = zOf(other) + lift;
      edit(item).z = 1;
    };
    for (const item of chosen) {
      const z = zOf(item);
      if (how === 'front') edit(item).z = Math.max(0, ...others.map(zOf)) + 1;
      else if (how === 'forward') edit(item).z = Math.max(1, z + 1);
      else if (how === 'back' || z <= 1) sendBack(item);
      else edit(item).z = z - 1;
    }
    commit();
  }

  // ---- grouping areas: 묶음 해제 lets the parts inside stand on their own ----
  // Parts whose nearest registered holder is this area.
  function members(group) {
    return items.filter(item => {
      if (item === group || item.fixed || !group.el.contains(item.el)) return false;
      for (let el = item.el.parentElement; el && el !== group.el; el = el.parentElement) {
        if (items.some(other => other.el === el)) return false;
      }
      return true;
    });
  }
  function ungroup(group) {
    const parts = members(group);
    mark();
    const g = edit(group);
    // The area's own move goes to each part, so nothing jumps when the area stops counting.
    for (const part of parts) {
      const e = edit(part);
      if (g.dx) e.dx = (e.dx || 0) + g.dx;
      if (g.dy) e.dy = (e.dy || 0) + g.dy;
    }
    delete g.dx; delete g.dy; delete g.z;
    g.ungrouped = true;
    selection = parts.filter(movable);
    commit();
  }
  function regroupAll() {
    mark();
    for (const item of items) if (ungrouped(item)) delete edit(item).ungrouped;
    commit();
  }

  function renderBar() {
    const targets = alignTargets();
    alignButtons.forEach(button => { button.disabled = !targets.length; });
    orderButtons.forEach(button => { button.disabled = !selection.some(movable); });
    undoButton.disabled = !undoStack.length;
    redoButton.disabled = !redoStack.length;
    requestButton.textContent = `요청서 복사 (${memoCount()})`;
    const loose = items.filter(ungrouped).length;
    regroupButton.hidden = !loose;
    regroupButton.textContent = `묶음 다시 묶기 (${loose})`;
    toggle.textContent = dirty() ? '✎ 수정 ON · 저장 안 됨' : '✎ 수정 ON';
    alignRef.textContent = !selection.length
      ? '요소를 선택하세요 · Shift+클릭/드래그로 여러 개 · Alt+클릭으로 기준 지정'
      : keyItem ? `기준: ${nameOf(keyItem)}` : '기준: 화면 (Alt+클릭으로 기준 요소 지정)';
  }

  // ---- inspector ----
  function renderPanel() {
    panel.replaceChildren();
    panel.hidden = !selection.length || !editing;
    if (panel.hidden) return;
    const close = h('button', { type: 'button', class: 'uie-close', 'aria-label': '선택 해제', onclick: () => setSelection([]) }, '×');
    if (selection.length > 1) {
      panel.append(
        h('header', {}, h('div', {}, h('strong', {}, `${selection.length}개 선택`), h('small', {}, keyItem ? `기준: ${nameOf(keyItem)}` : '기준: 화면')), close),
        h('ul', { class: 'uie-list' }, ...selection.map(item => h('li', { class: item === keyItem ? 'is-key' : '' }, item === keyItem ? `★ ${nameOf(item)}` : nameOf(item)))),
        h('p', { class: 'uie-hint' }, '선택한 것 안에서 끌면 함께 움직여요(묶음 안의 요소는 묶음과 한 번만 움직임). 다른 요소를 눌러도 선택은 그대로이고, 바꾸려면 이름표를 누르세요.'));
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
        h('textarea', { rows: 2, value: typeof e.text === 'string' ? e.text : originals.get(item.el) ?? '',
          oninput: event => set(item, 'text', event.target.value === originals.get(item.el) ? '' : event.target.value) })));
    }
    panel.append(
      h('label', {}, '요청 메모 · 저에게 부탁할 내용 (사이트에는 안 올라감)',
        h('textarea', { rows: 3, value: memoOf(item), placeholder: '예: 누르면 랭킹 화면이 열리게. 금색 테두리로.',
          oninput: event => setMemo(item, event.target.value) })),
      h('div', { class: 'uie-grid' },
        number('가로 이동', 'dx'), number('세로 이동', 'dy'), number('글자 크기', 'fs'),
        number('너비', 'w'), number('높이', 'h'), number('겹침 순서', 'z')),
      h('div', { class: 'uie-actions' }, ...[
        item.added && h('button', { type: 'button', class: 'uie-danger', onclick: () => remove(item) }, '삭제'),
        !item.added && !item.fixed && h('button', { type: 'button', onclick: () => { set(item, 'hidden', !e.hidden); renderPanel(); } }, e.hidden ? '보이기' : '숨기기'),
        item.container && members(item).length > 0 && h('button', { type: 'button', title: 'Ctrl+Shift+G', onclick: () => ungroup(item) }, '묶음 해제'),
        h('button', { type: 'button', onclick: () => resetPart(item) }, '원래대로'),
      ].filter(Boolean)),
      h('p', { class: 'uie-hint' }, item.fixed
        ? '배경 영역은 이름과 메모만 남길 수 있어요. 빈 곳을 끌면 여러 요소를 한 번에 골라요.'
        : '끌어서 옮기고, 오른쪽 아래 점으로 크기를 바꿔요(Shift: 같은 비율). 방향키로 1px(Shift 10px) 이동.'));
  }

  function syncPanelNumbers() {
    const item = single();
    if (!item || panel.hidden) return;
    const e = edit(item);
    const inputs = panel.querySelectorAll('.uie-num input');
    ['dx', 'dy', 'fs', 'w', 'h', 'z'].forEach((field, index) => {
      if (inputs[index] && document.activeElement !== inputs[index]) inputs[index].value = e[field] ?? '';
    });
  }

  // ---- overlay: name tags, selection frames and resize handle, kept in place every frame while editing ----
  function frame() {
    if (!editing) { layer.hidden = true; return; }
    const active = activeScreen();
    layer.hidden = !active;
    const shown = new Set();
    for (const item of items) {
      if (!active || !active.contains(item.el) || ungrouped(item) || !showTags) continue;
      const rect = item.el.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0)) continue;
      let tag = tags.get(item.key);
      if (!tag) {
        tag = h('button', { type: 'button', class: 'uie-tag', tabIndex: -1 });
        tag.addEventListener('pointerdown', event => {
          event.preventDefault();
          event.stopPropagation();
          const target = items.find(other => other.key === tag.dataset.key);
          if (target) pick(target, event, false);
        });
        tags.set(item.key, tag);
        layer.append(tag);
      }
      shown.add(tag);
      tag.dataset.key = item.key;
      const label = item === keyItem ? `★ ${nameOf(item)}` : nameOf(item);
      if (tag.textContent !== label) tag.textContent = label;
      tag.classList.toggle('is-selected', selection.includes(item));
      tag.classList.toggle('is-added', Boolean(item.added));
      const right = item.container || item.fixed;
      tag.style.left = `${Math.max(2, right ? rect.right - tag.offsetWidth - 2 : rect.left)}px`;
      tag.style.top = `${Math.max(item.fixed ? 84 : 2, right ? rect.top + 2 : rect.top - tag.offsetHeight - 1)}px`;
    }
    for (const tag of tags.values()) tag.hidden = !shown.has(tag);
    const framed = selection.filter(item => movable(item) && item.el.isConnected);
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
  // The part under the pointer; an ungrouped area is skipped so the press falls to what holds it.
  const itemFrom = target => {
    let el = target.closest && target.closest('[data-uie]');
    while (el) {
      const item = items.find(other => other.el === el);
      if (item && !ungrouped(item)) return item;
      el = el.parentElement && el.parentElement.closest('[data-uie]');
    }
    return null;
  };
  const inside = (rect, event) => event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

  function startMove(event) {
    const moving = topLevel(selection);
    if (!moving.length) return;
    drag = { mode: 'move', x: event.clientX, y: event.clientY, moved: false,
      start: moving.map(part => [part, edit(part).dx || 0, edit(part).dy || 0]) };
  }

  // fromScreen: pressed on the page itself (may start a drag); tags only select.
  function pick(item, event, fromScreen) {
    if (event.altKey) {
      if (!movable(item)) return;
      setSelection(selection.includes(item) ? selection : [...selection, item], keyItem === item ? null : item);
      return;
    }
    if (!fromScreen) {
      if (event.shiftKey) { if (movable(item)) toggleIn(item); } else select(item);
      return;
    }
    const area = item.fixed || (item.container && !selection.includes(item));
    if (event.shiftKey) {
      if (area) drag = { mode: 'marquee', item, add: true, x: event.clientX, y: event.clientY, moved: false };
      else toggleIn(item);
      return;
    }
    if (selection.length) {
      // Once something is chosen, a press never changes the choice: inside it, it moves;
      // elsewhere a drag draws a selection box and a plain click does nothing.
      if (selection.some(chosen => movable(chosen) && inside(chosen.el.getBoundingClientRect(), event))) startMove(event);
      else drag = { mode: 'marquee', item, add: false, keep: true, x: event.clientX, y: event.clientY, moved: false };
      return;
    }
    if (area) { drag = { mode: 'marquee', item, add: false, x: event.clientX, y: event.clientY, moved: false }; return; }
    select(item);
    startMove(event);
  }

  document.addEventListener('pointerdown', event => {
    if (!editing || event.button !== 0) return;
    const active = activeScreen();
    if (!active || !active.contains(event.target)) return;
    const item = itemFrom(event.target);
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
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
    if (!drag.moved && drag.mode !== 'marquee') mark();
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
        // A plain click on an area selects that area, unless something is already chosen.
        if (drag.keep) { /* keep the current choice */ }
        else if (!drag.add) select(drag.item);
        else if (movable(drag.item)) toggleIn(drag.item);
      } else {
        const box = marqueeRect(event), active = activeScreen();
        // Parts touched by the box are picked; grouping areas only when the box covers them whole.
        const hits = items.filter(item => {
          if (!movable(item) || ungrouped(item) || !active?.contains(item.el)) return false;
          const rect = item.el.getBoundingClientRect();
          if (!(rect.width > 0 && rect.height > 0)) return false;
          if (item.container) return rect.left >= box.left && rect.right <= box.right && rect.top >= box.top && rect.bottom <= box.bottom;
          return rect.left < box.right && rect.right > box.left && rect.top < box.bottom && rect.bottom > box.top;
        });
        setSelection(drag.add ? [...new Set([...selection, ...hits])] : hits);
      }
    } else if (drag?.moved) commit();
    drag = null;
  });

  // In edit mode the page's own buttons, canvas and images must not react.
  for (const type of ['click', 'dblclick', 'contextmenu']) {
    document.addEventListener(type, event => {
      if (editing && activeScreen()?.contains(event.target)) { event.preventDefault(); event.stopPropagation(); }
    }, true);
  }
  document.addEventListener('dragstart', event => { if (editing && activeScreen()?.contains(event.target)) event.preventDefault(); }, true);

  const typing = target => target.closest?.('input, textarea, select, [contenteditable], .uie-modal');
  window.addEventListener('keydown', event => {
    // Undo / redo work with the tool on or off.
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !typing(event.target) && (event.code === 'KeyZ' || event.code === 'KeyY')) {
      const redo = event.code === 'KeyY' || event.shiftKey;
      if (redo ? redoStack.length : undoStack.length) {
        event.preventDefault();
        event.stopImmediatePropagation();
        redo ? travel(redoStack, undoStack) : travel(undoStack, redoStack);
      }
      return;
    }
    if (!editing || !selection.length || typing(event.target) || event.target.closest?.('.uie-panel, .uie-bar')) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); setSelection([]); return; }
    const group = single();
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyG' && group?.container && members(group).length) {
      event.preventDefault();
      event.stopImmediatePropagation();
      ungroup(group);
      return;
    }
    const step = event.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!move) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    mark('nudge');
    for (const item of topLevel(selection)) {
      const e = edit(item);
      e.dx = (e.dx || 0) + move[0];
      e.dy = (e.dy || 0) + move[1];
      if (!e.dx) delete e.dx;
      if (!e.dy) delete e.dy;
      apply(item);
    }
    if (dirty()) store.set(DRAFT, JSON.stringify(clean(doc))); else store.del(DRAFT);
    syncPanelNumbers();
    renderBar();
  }, true);

  // Screen changes, phone/wide switches and parts the game re-renders.
  for (const id of SCREENS) {
    const root = screenEl(id);
    if (root) new MutationObserver(() => {
      setSelection([]);
      if (editing && id === 'game-screen' && !root.hidden) window.CheonBattle?.pause?.();
      rebuild();
    }).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  }
  addEventListener('resize', () => {
    const next = innerWidth > NARROW ? 'wide' : 'narrow';
    if (next === mode) return;
    mode = next;
    selection = [];
    rebuild();
  });
  let rescanTimer = 0;
  const app = document.getElementById('app') || document.body;
  new MutationObserver(records => {
    if (records.every(record => [...record.addedNodes, ...record.removedNodes].every(node => node.nodeType !== 1 || node.closest?.('.uie-added') || node.classList?.contains('uie-added')))) return;
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(() => {
      const stale = items.some(item => !item.el.isConnected) || Object.keys(layout().parts).some(key => {
        let el = null;
        try { el = document.querySelector(key); } catch {}
        return el && !items.some(item => item.el === el);
      });
      if (stale || editing) rebuild();
    }, 300);
  }).observe(app, { childList: true, subtree: true });

  // ---- saving to the site ----
  const toBase64 = text => {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binary);
  };
  async function publish(token) {
    const api = `https://api.github.com/repos/${REPO}/contents/${LAYOUT_PATH}`;
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    const body = { ...clean(doc), savedAt: new Date().toISOString() };
    for (let attempt = 0; attempt < 2; attempt++) {
      const current = await fetch(`${api}?ref=main`, { headers, cache: 'no-store' });
      if (current.status === 401 || current.status === 403) throw new Error('key');
      const sha = current.ok ? (await current.json()).sha : undefined;
      const saved = await fetch(api, { method: 'PUT', headers, body: JSON.stringify({
        message: '화면 배치 저장 (수정 도구)', branch: 'main',
        content: toBase64(`${JSON.stringify(body, null, 2)}\n`), ...(sha ? { sha } : {}) }) });
      if (saved.ok) return;
      if (saved.status === 401 || saved.status === 403) throw new Error('key');
      if (saved.status !== 409) throw new Error(String(saved.status));
    }
    throw new Error('conflict');
  }

  function dialogShell(title, ...content) {
    const card = h('div', { class: 'uie-modal-card' }, h('strong', {}, title), ...content);
    const dialog = h('div', { class: 'uie-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, card);
    dialog.addEventListener('keydown', event => { event.stopPropagation(); if (event.key === 'Escape') dialog.remove(); });
    document.body.append(dialog);
    return dialog;
  }

  function openSaveDialog() {
    const status = h('p', { class: 'uie-status' });
    const tokenInput = h('input', { type: 'password', placeholder: 'github_pat_…', autocomplete: 'off', spellcheck: false });
    const hasToken = Boolean(store.get(TOKEN));
    const keyBox = h('div', { class: 'uie-key', hidden: hasToken },
      h('label', {}, '사이트 저장 열쇠 (처음 한 번만)', tokenInput),
      h('p', { class: 'uie-hint' },
        'GitHub의 ', h('a', { href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener' }, 'Fine-grained token 만들기'),
        '에서 저장소는 ABoardFit/cheonjong 하나만, 권한은 Contents: Read and write 로 만든 열쇠를 넣으세요. 이 브라우저에만 기억됩니다.'));
    const saveButton = h('button', { type: 'button', class: 'uie-primary' }, '사이트에 저장');
    const changes = Object.keys(clean(doc).wide.parts).length + Object.keys(clean(doc).narrow.parts).length + doc.wide.added.length + doc.narrow.added.length;
    const dialog = dialogShell('바뀐 배치를 저장할까요?',
      h('p', { class: 'uie-lead' }, `바꾼 부분 ${changes}곳이 있습니다. 사이트에 저장하면 1~2분 뒤 모든 사람에게 그대로 보입니다.`),
      keyBox, status,
      h('div', { class: 'uie-actions' },
        h('button', { type: 'button', class: 'uie-danger', onclick: () => { mark(); doc = normalize(JSON.parse(JSON.stringify(published))); commit(); dialog.remove(); } }, '변경 버리기'),
        h('button', { type: 'button', onclick: () => dialog.remove() }, '이 브라우저에만 두기'),
        saveButton),
      hasToken ? h('button', { type: 'button', class: 'uie-link', onclick: () => { store.del(TOKEN); keyBox.hidden = false; } }, '저장 열쇠 바꾸기/지우기') : null,
      memoCount() ? h('p', { class: 'uie-hint' }, `요청 메모 ${memoCount()}개는 저장과 따로, 상단의 "요청서 복사"로 보내 주세요.`) : null);
    saveButton.addEventListener('click', async () => {
      const typed = tokenInput.value.trim();
      const token = typed || store.get(TOKEN);
      if (!token) { keyBox.hidden = false; status.textContent = '저장 열쇠를 넣어 주세요.'; tokenInput.focus(); return; }
      saveButton.disabled = true;
      status.textContent = '저장하는 중…';
      try {
        await publish(token);
        if (typed) store.set(TOKEN, typed);
        published = clean(doc);
        store.del(DRAFT);
        renderBar();
        status.textContent = '저장했습니다. 1~2분 뒤 모두에게 보입니다.';
        setTimeout(() => dialog.remove(), 1600);
      } catch (error) {
        saveButton.disabled = false;
        status.textContent = error.message === 'key'
          ? '열쇠가 맞지 않거나 이 저장소에 쓸 권한이 없습니다.'
          : `저장하지 못했습니다(${error.message}). 잠시 뒤 다시 시도하세요. 바꾼 내용은 이 브라우저에 남아 있습니다.`;
        if (error.message === 'key') { store.del(TOKEN); keyBox.hidden = false; }
      }
    });
  }

  // ---- change request: only parts that carry a request memo ----
  function describe(item) {
    const e = edit(item), lines = [];
    if (e.name) lines.push(`이름표: "${e.name}"`);
    if (typeof e.text === 'string') lines.push(item.added ? `글자: "${e.text}"` : `글자: "${originals.get(item.el) ?? ''}" → "${e.text}"`);
    if (e.dx || e.dy) {
      const parts = [];
      if (e.dx) parts.push(`${e.dx > 0 ? '오른쪽' : '왼쪽'} ${Math.abs(e.dx)}px`);
      if (e.dy) parts.push(`${e.dy > 0 ? '아래' : '위'} ${Math.abs(e.dy)}px`);
      lines.push(`위치: ${parts.join(', ')} 이동`);
    }
    if (e.w || e.h) lines.push(`크기: ${e.w ? `너비 ${e.w}px` : ''}${e.w && e.h ? ', ' : ''}${e.h ? `높이 ${e.h}px` : ''}`);
    if (e.fs) lines.push(`글자 크기: ${e.fs}px`);
    if (Number.isFinite(e.z)) lines.push(`겹침 순서: ${e.z}`);
    if (e.ungrouped) lines.push('묶음 해제');
    if (e.hidden) lines.push('숨김');
    return lines;
  }

  function requestText() {
    const out = ['[천종지자 화면 수정 요청]', `기준 화면: ${innerWidth}×${innerHeight}px (${mode === 'wide' ? '넓은 화면' : '휴대폰'} 배치)`, ''];
    let count = 0;
    for (const [layoutName, list] of Object.entries(memos)) {
      for (const [key, memo] of Object.entries(list)) {
        count++;
        const item = layoutName === mode ? items.find(other => other.key === key) : null;
        out.push(`- [${SCREEN_NAMES[memo.screen] || '화면'}${layoutName === mode ? '' : ` · ${layoutName === 'wide' ? '넓은 화면' : '휴대폰'}`}] ${memo.name} (${memo.selector})`);
        out.push(`    요청: ${memo.text}`);
        if (item) {
          if (item.added) {
            const box = item.el.getBoundingClientRect(), root = screenEl(item.screen).getBoundingClientRect();
            out.push(`    새 ${ADD_KIND[item.added.type]} · 화면 왼쪽에서 ${Math.round(box.left - root.left)}px, 위에서 ${Math.round(box.top - root.top)}px · 크기 ${Math.round(box.width)}×${Math.round(box.height)}px`);
          }
          describe(item).forEach(line => out.push(`    현재 ${line}`));
        }
      }
    }
    if (!count) out.push('(요청 메모가 없습니다. 이동·크기·추가 같은 바꿈은 수정 OFF 때 사이트에 바로 저장됩니다.)');
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
    const dialog = dialogShell('수정 요청서', area,
      h('div', { class: 'uie-actions' }, status,
        h('button', { type: 'button', onclick: copy }, '다시 복사'),
        h('button', { type: 'button', onclick: () => dialog.remove() }, '닫기')));
    copy();
  }

  // ---- start: show the published layout (or this browser's unsaved draft) ----
  const ready = () => document.documentElement.classList.remove('uie-loading');
  setTimeout(ready, 1500);
  rebuild();
  fetch(`layout.json?t=${Date.now()}`, { cache: 'no-store' })
    .then(response => (response.ok ? response.json() : null))
    .catch(() => null)
    .then(data => {
      published = clean(normalize(data));
      if (!draft || draft.version !== 3) doc = normalize(JSON.parse(JSON.stringify(published)));
      rebuild();
      ready();
    });
})();
