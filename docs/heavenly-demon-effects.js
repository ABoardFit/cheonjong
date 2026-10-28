/* Deterministic rehearsal model and two-screen-pixel ink. No combat coefficients. */
(() => {
  'use strict';
  const TAU = Math.PI * 2, CAST = .75, DASH = .24;
  const palette = { dark: '#211b28', ink: '#403044', body: '#69466e', light: '#b18cae', flame: '#9f454b', ember: '#d09178', ground: '#45333f' };
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, Number(n) || 0));
  const hash = (x, y, seed = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return n - Math.floor(n); };
  const point = (x, y, a, r) => ({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
  const angleDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  function capacity(path, mind) { return 1 + Number(path === 'sword' && mind >= 2 || path === 'ring' && mind >= 1); }
  function resources({ path, rank = 1, mind, initialQi = 0, qiCapacity = 0, events = [], time = 0 }) {
    // Optional capacity belongs to the isolated demonstration, never to skill balance.
    const cap = qiCapacity ? clamp(Math.round(qiCapacity), 1, 3) : capacity(path, mind), state = { held: clamp(initialQi, 0, cap), capacity: cap, pickupBursts: [], blockBursts: [], drops: [], marks: new Set(), deathBursts: [], heals: [], ultimateCasts: [], evasionUntil: -1, extraRingUntil: -1 };
    for (const e of events.filter(e => e.at <= time).slice().sort((a, b) => a.at - b.at)) {
      if (e.type === 'clear') state.held = 0;
      if (e.type === 'pickup' && !e.blocked && state.held < cap) {
        state.held++;
        state.pickupBursts.push(e);
        if (path === 'ring' && mind >= 6) state.extraRingUntil = e.at + 2;
      }
      if (e.type === 'block' && state.held > 0) {
        const consumed = Math.min(state.held, path === 'sword' && mind >= 3 ? 2 : 1);
        state.held -= consumed;
        if (path === 'ring' && mind >= 5) state.blockBursts.push({ ...e, consumed, outward: true });
      }
      if (e.type === 'direct-hit' && path === 'sword' && mind >= 5 && e.source !== 'dot' && e.source !== 'death-burst') state.marks.add(e.targetId);
      if (e.type === 'stomp-hit' && path === 'dash' && mind >= 6 && e.source !== 'dot') state.drops.push({ ...e, source: 'stomp' });
      if (e.type === 'kill') {
        if (path === 'sword' && mind >= 1 || path === 'ring' && mind >= 3 && e.source === 'ring') state.drops.push(e);
        if (path === 'sword' && mind >= 5 && state.marks.has(e.targetId)) {
          state.deathBursts.push({ ...e, appliesMark: false });
          if (mind >= 6) state.heals.push(e);
        }
        state.marks.delete(e.targetId);
      }
      if (e.type === 'ultimate-dash' && path === 'dash' && rank === 7 && state.held >= 1) {
        state.ultimateCasts.push({ ...e, consumed: state.held, invulnerable: false, crowdControl: false });
        state.held = 0; state.evasionUntil = e.at + 1;
      }
    }
    state.evasionRating = time < state.evasionUntil ? 30 : 0;
    state.extraRings = time < state.extraRingUntil ? 1 : 0;
    state.marks = [...state.marks];
    return state;
  }
  function frame(options = {}) {
    const path = ['sword', 'ring', 'dash'].includes(options.path) ? options.path : 'sword';
    const rank = clamp(options.rank ?? 1, 1, 7), mind = clamp(options.mind ?? 0, 0, 6), time = Math.max(0, options.time || 0), angle = options.angle || 0;
    const origin = options.origin || { x: 0, y: 0 }, enemies = options.targets || [];
    const distance = (rank >= 2 ? 170 : 110) + (mind >= 2 && path === 'dash' ? 45 : 0);
    const dashProgress = path === 'dash' ? clamp((time - CAST) / DASH) : 0;
    const hero = point(origin.x, origin.y, angle, distance * dashProgress);
    hero.faceX = Math.cos(angle); hero.faceY = Math.sin(angle); hero.dashRemaining = path === 'dash' && time >= CAST && time < CAST + DASH ? CAST + DASH - time : 0;
    const landing = point(origin.x, origin.y, angle, distance), landAt = CAST + DASH;
    const events = [...(options.events || [])];
    if (path === 'dash' && rank === 7) events.push({ type: 'ultimate-dash', at: landAt, ...landing });
    if (path === 'dash' && mind >= 6) for (const enemy of enemies.filter(e => Math.hypot(e.x - landing.x, e.y + 30 - landing.y) <= 90)) events.push({ type: 'stomp-hit', at: landAt, x: enemy.x, y: enemy.y + 30, source: 'direct', targetId: enemy.id });
    const qi = resources({ path, rank, mind, initialQi: options.heldQi || 0, qiCapacity: options.qiCapacity, events, time });
    const f = { path, rank, mind, time, angle, origin, hero, landing, landAt, qi, projectiles: [], rings: [], fields: [], cracks: [], silhouettes: [], bursts: [], marks: [], drops: [], hitAccents: [], targetOffsets: [], apparition: null,
      semantics: { invulnerable: false, crowdControl: false, pullsEnemies: false, coefficients: null } };
    const addField = (x, y, radius, born, source) => { if (time >= born && time < born + 3) f.fields.push({ x, y, radius, born, expires: born + 3, source, damages: true }); };
    if (path === 'sword') {
      for (let n = 0; n < 7; n++) {
        const at = CAST + n, age = time - at;
        if (age < 0 || age > 4.5) continue;
        const center = { x: origin.x, y: origin.y - 36 };
        let aim = angle;
        if (rank <= 2 && enemies.length) { const nearest = enemies.slice().sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y))[0]; aim = Math.atan2(nearest.y - center.y, nearest.x - center.x); }
        if (rank === 6 && enemies.length) {
          const candidates = enemies.map(e => Math.atan2(e.y - center.y, e.x - center.x));
          aim = candidates.sort((a, b) => enemies.filter(e => angleDistance(Math.atan2(e.y - center.y, e.x - center.x), b) < .3).length - enemies.filter(e => angleDistance(Math.atan2(e.y - center.y, e.x - center.x), a) < .3).length)[0];
        }
        const angles = rank === 5 || rank === 7 ? Array.from({ length: 8 }, (_, i) => aim + i * TAU / 8) : rank === 3 || rank === 4 ? [aim - .27, aim, aim + .27] : [aim];
        const speed = rank >= 6 ? 520 : 370, range = options.range || 880;
        const firstRange = rank === 1 && enemies.length ? Math.min(...enemies.map(e => Math.hypot(e.x - center.x, e.y - center.y))) : range;
        for (const a of angles) {
          const reach = Math.min(age * speed, firstRange);
          const p = point(center.x, rank === 7 ? origin.y : center.y, a, reach);
          if (age * speed < firstRange) f.projectiles.push({ ...p, angle: a, size: rank >= 6 ? rank === 7 ? 85 : 125 : rank >= 4 ? 53 : 32, at, age, seed: n, ground: rank === 7, pierce: rank >= 2, hitsPerEnemy: 1, tint: mind >= 4 && qi.held > 0 });
          if (rank >= 4 && rank <= 6) for (let r = 25; r < reach; r += 24) { const loc = point(center.x, origin.y, a, r); addField(loc.x, loc.y, rank === 6 ? 27 : 18, at + r / speed, 'sword'); }
          if (rank === 7 && age < 1.45) f.cracks.push({ x: center.x, y: origin.y, angle: a, length: reach, alpha: (1 - age / 1.45) * .65, damages: false, seed: n });
        }
      }
    }
    if (path === 'ring') {
      const cycle = time % 5, burstAt = 1.45;
      if (rank === 7) {
        if (cycle < burstAt) {
          const progress = clamp((cycle - .4) / .8), orbit = 92 * (1 - progress);
          for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + time * 2; f.rings.push({ x: hero.x + Math.cos(a) * orbit, y: hero.y - 38 - progress * 72 + Math.sin(a) * orbit * .45, radius: 19 * (1 - progress), alpha: .85, seed: i }); }
          if (progress > .45) f.sun = { x: hero.x, y: hero.y - 110, radius: 32 * progress, alpha: .9 };
        }
        if (cycle >= burstAt) { const age = cycle - burstAt; if (age < .65) {
          f.bursts.push({ x: hero.x, y: hero.y - 30, age, radius: 245, outward: true, kind: 'sun' });
          for (const e of enemies.filter(e => Math.hypot(e.x - hero.x, e.y + 30 - hero.y) <= 245)) { const a = Math.atan2(e.y + 30 - hero.y, e.x - hero.x), push = 38 * Math.sin(age / .65 * Math.PI); f.targetOffsets.push({ id: e.id, x: Math.cos(a) * push, y: Math.sin(a) * push }); }
        } addField(hero.x, hero.y, 195, time - cycle + burstAt, 'ring'); }
      } else {
        const base = rank === 1 ? 1 : rank <= 3 ? 3 : 5, pulse = rank >= 5 ? Math.sin(clamp((cycle - .5) / 2.6) * Math.PI) : 0;
        const radius = (rank >= 3 ? 105 : 70) + Math.max(0, pulse) * 145;
        for (let i = 0; i < base + qi.extraRings; i++) { const a = time * (mind >= 4 ? 3.5 : 2.1) + i * TAU / (base + qi.extraRings); f.rings.push({ x: hero.x + Math.cos(a) * radius, y: hero.y - 30 + Math.sin(a) * radius * .65, radius: mind >= 2 ? 23 : 20, seed: i, alpha: .95, extra: i >= base }); }
        if (rank >= 6) for (let t = Math.max(0, time - 3); t < time; t += .16) { const c = t % 5, pulseAt = Math.sin(clamp((c - .5) / 2.6) * Math.PI); if (pulseAt <= .1) continue; for (let i = 0; i < 5; i++) { const a = t * (mind >= 4 ? 3.5 : 2.1) + i * TAU / 5, r = 105 + pulseAt * 145; addField(hero.x + Math.cos(a) * r, hero.y + Math.sin(a) * r * .65, 18, t, 'ring'); } }
        if (rank >= 4 && cycle > 1 && cycle < 1.45) for (const e of enemies) { const a = Math.atan2(e.y - hero.y, e.x - hero.x); f.targetOffsets.push({ id: e.id, x: Math.cos(a) * Math.sin((cycle - 1) / .45 * Math.PI) * 18, y: Math.sin(a) * Math.sin((cycle - 1) / .45 * Math.PI) * 18 }); }
      }
      if (rank === 7 && qi.extraRings) { const a = time * 3.5; f.rings.push({ x: hero.x + Math.cos(a) * 95, y: hero.y - 30 + Math.sin(a) * 60, radius: 22, seed: 9, extra: true, alpha: .9 }); }
    }
    if (path === 'dash') {
      if (rank >= 3 && rank <= 6) for (const fraction of rank >= 4 ? [0, .5] : [0]) {
        const at = CAST + fraction * DASH, pos = point(origin.x, origin.y, angle, distance * fraction), age = time - at;
        if (age >= 0 && age < 1) f.silhouettes.push({ ...pos, at, alpha: .55 * (1 - age * .35), scale: 1 });
        if (age >= 1 && age < 1.65) f.bursts.push({ ...pos, age: age - 1, radius: rank >= 5 ? 108 : 72, kind: 'shadow' });
        if (rank === 6) addField(pos.x, pos.y, 90, at + 1, 'dash');
      }
      if (mind >= 1) for (let n = 0; n < 4; n++) { const at = CAST + n * DASH / 4, age = time - at; if (age >= 0 && age < .5) f.bursts.push({ ...point(origin.x, origin.y, angle, distance * n / 4), age, radius: 24, kind: 'step', decorative: true }); }
      if (mind >= 4 && time >= landAt && time < landAt + .65) { f.bursts.push({ ...landing, age: time - landAt, radius: 90, kind: 'stomp', outward: mind >= 5 }); if (mind >= 5) for (const e of enemies.filter(e => Math.hypot(e.x - landing.x, e.y + 30 - landing.y) < 135)) { const a = Math.atan2(e.y + 30 - landing.y, e.x - landing.x); f.targetOffsets.push({ id: e.id, x: Math.cos(a) * 22 * Math.sin((time - landAt) / .65 * Math.PI), y: Math.sin(a) * 22 * Math.sin((time - landAt) / .65 * Math.PI) }); } }
      const ultimate = qi.ultimateCasts.at(-1);
      if (ultimate) { const age = time - ultimate.at; if (age < .8) {
        // Bounded visual emphasis shows spent qi without assigning damage coefficients.
        const emphasis = Math.min(3, ultimate.consumed);
        f.apparition = { ...landing, y: landing.y - 42 - age * 15, alpha: (.34 + emphasis * .06) * (1 - age / .8), scale: 1.55 + emphasis * .18, consumed: ultimate.consumed, at: CAST };
        for (const e of enemies) f.hitAccents.push({ ...e, alpha: 1 - age / .8, size: 3 + emphasis, reach: 11 + emphasis * 3 });
      } }
    }
    for (const e of qi.blockBursts) if (time - e.at < .65) {
      const x = e.x ?? hero.x, y = e.y ?? hero.y, age = time - e.at;
      f.bursts.push({ x, y, age, radius: 110, outward: true, kind: 'block' });
      for (const enemy of enemies.filter(target => Math.hypot(target.x - x, target.y + 30 - y) <= 110)) {
        const a = Math.atan2(enemy.y + 30 - y, enemy.x - x), push = Math.sin(age / .65 * Math.PI) * 24;
        f.targetOffsets.push({ id: enemy.id, x: Math.cos(a) * push, y: Math.sin(a) * push });
      }
    }
    for (const e of qi.deathBursts) if (time - e.at < .65) f.bursts.push({ x: e.x ?? hero.x + 90, y: e.y ?? hero.y, age: time - e.at, radius: 85, kind: 'mark' });
    f.marks = qi.marks.map(id => enemies.find(e => e.id === id)).filter(Boolean);
    f.drops = qi.drops.filter(e => time - e.at < 3);
    return f;
  }
  function square(c, x, y, size, color) { c.fillStyle = color; c.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, Math.max(2, Math.round(size / 2) * 2), Math.max(2, Math.round(size / 2) * 2)); }
  function line(c, a, b, color, size = 2) { const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2)); for (let i = 0; i <= steps; i++) square(c, a.x + (b.x - a.x) * i / steps, a.y + (b.y - a.y) * i / steps, size, color); }
  function flame(c, x, y, size, seed, alpha = 1) {
    c.save(); c.globalAlpha *= alpha;
    for (let yy = -size; yy <= size * .5; yy += 2) for (let xx = -size * .55; xx <= size * .55; xx += 2) { const w = size * .48 * Math.sin((yy / size + 1) / 1.5 * Math.PI), sway = Math.sin(yy / size * 5 + seed) * size * .16; if (Math.abs(xx - sway) < w) square(c, x + xx, y + yy, 2, Math.abs(xx - sway) < w * .35 ? palette.light : hash(xx, yy, seed) < .25 ? palette.flame : palette.body); }
    c.restore();
  }
  function ring(c, p) {
    c.save(); c.globalAlpha *= p.alpha ?? 1;
    const r = p.radius; if (r < 2) { c.restore(); return; }
    for (let y = -r - 5; y <= r + 5; y += 2) for (let x = -r - 5; x <= r + 5; x += 2) { const d = Math.hypot(x, y), a = Math.atan2(y, x), edge = r + Math.sin(a * 7 + p.seed) * 3; if (d < edge && d > r * .65) square(c, p.x + x, p.y + y, 2, d > edge - 3 ? palette.light : hash(x, y, p.seed) > .7 ? palette.flame : palette.ink); }
    c.restore();
  }
  const crescentCache = new Map();
  function crescent(c, p, uncached = false) {
    if (!uncached && typeof document !== 'undefined') {
      const quantized = Math.round(p.angle * 32 / Math.PI) * Math.PI / 32, key = `${p.size}:${quantized}:${Boolean(p.tint)}`;
      let mask = crescentCache.get(key);
      if (!mask) {
        mask = document.createElement('canvas'); mask.width = mask.height = Math.ceil(p.size * 2 + 8);
        crescent(mask.getContext('2d'), { ...p, x: mask.width / 2, y: mask.height / 2, angle: quantized }, true);
        if (crescentCache.size >= 128) crescentCache.delete(crescentCache.keys().next().value);
        crescentCache.set(key, mask);
      }
      c.drawImage(mask, Math.round((p.x - mask.width / 2) / 2) * 2, Math.round((p.y - mask.height / 2) / 2) * 2);
      return;
    }
    c.save(); c.globalAlpha *= .95;
    const ca = Math.cos(p.angle), sa = Math.sin(p.angle), r = p.size;
    for (let y = -r; y <= r; y += 2) for (let x = -r * .55; x <= r * .55; x += 2) {
      const outer = x * x / (r * r * .3) + y * y / (r * r), inner = (x + r * .32) ** 2 / (r * r * .38) + y * y / (r * r * .84);
      if (outer < 1 && inner > 1) square(c, p.x + ca * x - sa * y, p.y + sa * x + ca * y, 2, outer > .88 ? palette.light : inner < 1.16 ? palette.flame : p.tint ? palette.body : palette.dark);
    }
    c.restore();
  }
  function draw(c, f, { layer = 'front', drawSilhouette } = {}) {
    c.save();
    if (layer === 'back') {
      const cells = new Map();
      for (const field of f.fields) for (let y = -field.radius; y <= field.radius; y += 8) for (let x = -field.radius; x <= field.radius; x += 8) {
        if ((x / field.radius) ** 2 + (y / (field.radius * .6)) ** 2 > 1) continue;
        const px = Math.round((field.x + x) / 8) * 8, py = Math.round((field.y + y) / 8) * 8;
        if (hash(px, py, 4) < .46) continue;
        cells.set(`${px}:${py}`, { x: px, y: py, alpha: .4 * clamp((field.expires - f.time) / .5) });
      }
      for (const cell of cells.values()) { c.globalAlpha = cell.alpha; square(c, cell.x, cell.y, 6, palette.ground); if (hash(cell.x, cell.y, 8) > .88) flame(c, cell.x, cell.y, 8, 2, .55); } c.globalAlpha = 1;
      for (const crack of f.cracks) { c.globalAlpha = crack.alpha; let prior = { x: crack.x, y: crack.y }; for (let r = 12; r < crack.length; r += 12) { const p = point(crack.x, crack.y, crack.angle, r), wobble = (hash(r, crack.seed, 4) - .5) * 12; p.x += Math.cos(crack.angle + Math.PI / 2) * wobble; p.y += Math.sin(crack.angle + Math.PI / 2) * wobble; line(c, prior, p, palette.dark, 4); if (r % 36 === 0) line(c, p, point(p.x, p.y, crack.angle + .7, 17), palette.ink, 2); prior = p; } } c.globalAlpha = 1;
      for (const s of f.silhouettes) drawSilhouette?.(s);
      if (f.apparition) drawSilhouette?.(f.apparition);
    } else {
      for (const p of f.projectiles) crescent(c, p);
      for (const p of f.rings) ring(c, p);
      if (f.sun) { const s = f.sun; c.globalAlpha = s.alpha; for (let y = -s.radius; y < s.radius; y += 2) for (let x = -s.radius; x < s.radius; x += 2) if (x * x + y * y < s.radius ** 2) square(c, s.x + x, s.y + y, 2, hash(x, y, 7) > .91 ? palette.flame : palette.dark); ring(c, { ...s, seed: 3 }); c.globalAlpha = 1; }
      for (const b of f.bursts) {
        const progress = clamp(b.age / .65), r = b.radius * Math.sin(progress * Math.PI / 2), count = b.kind === 'step' ? 12 : 26;
        c.globalAlpha = (1 - progress) * (b.decorative ? .45 : .9);
        for (let i = 0; i < count; i++) { const a = i * TAU / count, p = point(b.x, b.y, a, r); p.y = b.y + (p.y - b.y) * .62; if (b.decorative) square(c, p.x, p.y, 3, palette.body); else flame(c, p.x, p.y, 10 + 16 * (1 - progress), i, .85); }
        c.globalAlpha = 1;
      }
      for (const m of f.marks) { line(c, { x: m.x, y: m.y - 25 }, { x: m.x - 6, y: m.y - 16 }, palette.flame, 3); line(c, { x: m.x - 6, y: m.y - 16 }, { x: m.x + 7, y: m.y - 12 }, palette.light, 2); }
      for (const d of f.drops) flame(c, d.x ?? f.hero.x + 40, (d.y ?? f.hero.y) + Math.sin(f.time * 4) * 3, 12, 2);
      for (const a of f.hitAccents) { const reach = a.reach || 14; c.globalAlpha = a.alpha; line(c, { x: a.x - reach, y: a.y + reach }, { x: a.x + reach, y: a.y - reach }, palette.light, a.size || 4); line(c, { x: a.x - 8, y: a.y - reach }, { x: a.x + 8, y: a.y + 8 }, palette.flame, 2); } c.globalAlpha = 1;
      for (const h of f.qi.heals) { const age = f.time - h.at; if (age < 0 || age >= .8) continue; for (let i = 0; i < 5; i++) { const p = clamp(age / .8 + i * .04); square(c, (h.x ?? f.hero.x + 90) * (1 - p) + f.hero.x * p, (h.y ?? f.hero.y) * (1 - p) + (f.hero.y - 45) * p - Math.sin(p * Math.PI) * 30, 4, palette.ember); } }
      if (f.qi.evasionRating) for (let i = 0; i < 3; i++) line(c, { x: f.hero.x - 25 - i * 5, y: f.hero.y - 28 + i * 9 }, { x: f.hero.x - 18 - i * 5, y: f.hero.y - 41 + i * 9 }, palette.light, 2);
    }
    c.restore();
  }
  function drawQi(c, hero, time, held, layer) { for (let i = 0; i < held; i++) { const a = time * 2 + i * TAU / Math.max(1, held), front = Math.sin(a) >= 0; if ((layer === 'front') !== front) continue; flame(c, hero.x + Math.cos(a) * 33, hero.y - 34 + Math.sin(a) * 17, 12, i, .9); } }
  window.CheonHeavenlyDemonEffects = Object.freeze({ frame, resources, capacity, draw, drawQi, palette, clamp, hash, timing: { cast: CAST, dash: DASH } });
})();
