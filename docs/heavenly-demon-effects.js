/* Deterministic rehearsal model and two-screen-pixel ink. No combat coefficients. */
(() => {
  'use strict';
  const TAU = Math.PI * 2, CAST = .75, DASH = .24;
  const palette = { dark: '#211b28', ink: '#403044', body: '#69466e', light: '#b18cae', flame: '#9f454b', ember: '#d09178', ground: '#45333f' };
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, Number(n) || 0));
  const hash = (x, y, seed = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return n - Math.floor(n); };
  const point = (x, y, a, r) => ({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
  const SWORD_INTERVAL = 2.8, CROSS_DELAY = .3, RETURN_REACH = 250, SWORD_SPEED = 370, RETURN_SPEED = 312.5;
  // game-core rank 7 radius: (58 + 5 * 15) * 1.5 * 2; renderer flower silhouette uses .93.
  const FUSED_RING_RADIUS = (58 + 5 * 15) * 1.5 * 2 * .93, RING_BURST = 2.2;
  function swordRays(rank, angle) {
    if (rank === 1 || rank === 4) return [];
    if (rank === 2) return [{ angle, delay: 0 }];
    if (rank === 3) return [-.32, 0, .32].map(offset => ({ angle: angle + offset, delay: 0 }));
    return Array.from({ length: rank >= 6 ? 8 : 4 }, (_, i) => ({ angle: (i % 4) * TAU / 4 + (i >= 4 ? Math.PI / 4 : 0), delay: i >= 4 ? CROSS_DELAY : 0, wave: i >= 4 ? 'diagonal' : 'cross' }));
  }
  function swordHits({ rank = 1, time = 0, angle = 0, origin = { x: 0, y: 0 }, targets = [], range = 880 }) {
    const result = [], center = { x: origin.x, y: origin.y - 36 };
    for (let n = 0; CAST + n * SWORD_INTERVAL <= time; n++) {
      const at = CAST + n * SWORD_INTERVAL;
      for (const target of targets) {
        const dx = target.x - center.x, dy = target.y - center.y;
        if (rank === 1 || rank === 4) {
          const distance = Math.hypot(dx, dy / .68), bearing = Math.atan2(dy / .68, dx);
          const radius = rank === 1 ? 100 : 145, span = rank === 1 ? 2.6 : TAU;
          const offset = ((bearing - (angle - (rank === 1 ? 1.3 : Math.PI))) % TAU + TAU) % TAU;
          if (distance <= radius && offset <= span) result.push({ type: 'direct-hit', source: 'sword', targetId: target.id, at: at + offset / span * .5 });
          continue;
        }
        for (const ray of swordRays(rank, angle)) {
          const along = dx * Math.cos(ray.angle) + dy * Math.sin(ray.angle), across = Math.abs(dx * Math.sin(ray.angle) - dy * Math.cos(ray.angle));
          const reach = rank === 7 ? RETURN_REACH : range, size = rank >= 5 ? 32 + 40 * clamp(along / 320) : 32;
          if (along < 0 || along > reach) continue;
          const speed = rank === 7 ? RETURN_SPEED : SWORD_SPEED;
          if (across <= size * .85) result.push({ type: 'direct-hit', source: 'sword', targetId: target.id, at: at + ray.delay + along / speed, phase: 'outbound' });
          if (rank === 7 && across <= (32 + 40 * RETURN_REACH / 320) * .85) result.push({ type: 'direct-hit', source: 'sword', targetId: target.id, at: at + ray.delay + .8 + (RETURN_REACH - along) / speed, phase: 'returning' });
        }
      }
    }
    return result.filter(hit => hit.at <= time);
  }
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
        if (path === 'ring' && mind >= 5) state.blockBursts.push({ ...e, consumed });
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
    const directHits = path === 'sword' ? swordHits({ rank, time, angle, origin, targets: enemies, range: options.range }) : [];
    if (mind >= 5) events.push(...directHits);
    if (path === 'dash' && rank === 7) events.push({ type: 'ultimate-dash', at: landAt, ...landing });
    if (path === 'dash' && mind >= 6) for (const enemy of enemies.filter(e => Math.hypot(e.x - landing.x, e.y + 30 - landing.y) <= 90)) events.push({ type: 'stomp-hit', at: landAt, x: enemy.x, y: enemy.y + 30, source: 'direct', targetId: enemy.id });
    const qi = resources({ path, rank, mind, initialQi: options.heldQi || 0, qiCapacity: options.qiCapacity, events, time });
    const f = { path, rank, mind, time, angle, origin, hero, landing, landAt, qi, directHits, projectiles: [], sweeps: [], rings: [], waves: [], fields: [], cracks: [], silhouettes: [], bursts: [], marks: [], drops: [], hitAccents: [], targetOffsets: [], apparition: null,
      semantics: { invulnerable: false, crowdControl: false, pullsEnemies: false, coefficients: null } };
    const addField = (x, y, radius, born, source) => { if (time >= born && time < born + 3) f.fields.push({ x, y, radius, born, expires: born + 3, source, damages: true }); };
    if (path === 'sword') {
      for (let n = 0; CAST + n * SWORD_INTERVAL <= time; n++) {
        const at = CAST + n * SWORD_INTERVAL, age = time - at;
        if (age > 5.5) continue;
        const center = { x: origin.x, y: origin.y - 36 };
        if (rank === 1 || rank === 4) {
          if (age < .7) f.sweeps.push({ ...center, radius: rank === 1 ? 100 : 145, angle, age, progress: clamp(age / .5), fullCircle: rank === 4, alpha: clamp((.7 - age) / .2) });
          if (rank === 4) addField(origin.x, origin.y, 145, at + .5, 'sword');
          continue;
        }
        for (const ray of swordRays(rank, angle)) {
          const flightAge = age - ray.delay; if (flightAge < 0) continue;
          const returning = rank === 7 && flightAge >= .8, speed = rank === 7 ? RETURN_SPEED : SWORD_SPEED;
          const limit = rank === 7 ? RETURN_REACH : options.range || 880;
          const reach = rank === 7 ? RETURN_REACH * (returning ? 1 - clamp((flightAge - .8) / .8) : clamp(flightAge / .8)) : Math.min(flightAge * speed, limit);
          const active = rank === 7 ? flightAge < 1.6 : flightAge * speed < limit;
          const p = point(center.x, center.y, ray.angle, reach);
          const growthReach = rank === 7 ? Math.min(flightAge * speed, limit) : reach;
          if (active) f.projectiles.push({ ...p, angle: ray.angle + (returning ? Math.PI : 0), launchAngle: ray.angle, size: rank >= 5 ? Math.round((32 + 40 * clamp(growthReach / 320)) / 2) * 2 : 32, at: at + ray.delay, age: flightAge, seed: n, wave: ray.wave, phase: returning ? 'returning' : 'outbound', distance: reach, pierce: true, hitsPerEnemy: rank === 7 ? 2 : 1, tint: mind >= 4 && qi.held > 0 });
          if (rank === 5 || rank === 6) for (let r = 25; r < reach; r += 32) { const loc = point(center.x, origin.y, ray.angle, r); addField(loc.x, loc.y, 18, at + ray.delay + r / speed, 'sword'); }
        }
      }
    }
    if (path === 'ring') {
      const cycle = time % (rank === 7 ? 7 : 5), burstAt = RING_BURST;
      if (rank === 7) {
        if (cycle < burstAt) {
          const gather = clamp(cycle / .75), growth = clamp((cycle - .55) / 1.1), descent = clamp((cycle - 1.5) / .7);
          if (gather < 1) for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + time * 2, orbit = 105 * (1 - gather); f.rings.push({ x: hero.x + Math.cos(a) * orbit, y: hero.y - 38 - gather * 72 + Math.sin(a) * orbit * .65, radius: 20, alpha: 1 - gather * .5, seed: i }); }
          if (cycle >= .55) f.fusedRing = { x: hero.x, y: hero.y - 110 * (1 - descent), radius: 20 + (FUSED_RING_RADIUS - 20) * growth, alpha: .95, seed: 3, growth, descent };
        }
        if (cycle >= burstAt) {
          const age = cycle - burstAt;
          if (age < .65) f.bursts.push({ x: hero.x, y: hero.y, age, radius: FUSED_RING_RADIUS, kind: 'ring' });
          if (age < 1.1) { const edge = Math.max(FUSED_RING_RADIUS + 80, options.waveRadius || 620), progress = clamp(age / 1.1); f.waves.push({ x: hero.x, y: hero.y, radius: FUSED_RING_RADIUS + (edge - FUSED_RING_RADIUS) * progress, edgeRadius: edge, progress, alpha: 1 - progress * .65 }); }
          addField(hero.x, hero.y, 195, time - cycle + burstAt, 'ring');
        }
      } else {
        const base = rank === 1 ? 1 : rank <= 3 ? 3 : 5, pulse = rank >= 5 ? Math.sin(clamp((cycle - .5) / 2.6) * Math.PI) : 0;
        const radius = (rank >= 3 ? 105 : 70) + Math.max(0, pulse) * 145;
        for (let i = 0; i < base + qi.extraRings; i++) { const a = time * (mind >= 4 ? 3.5 : 2.1) + i * TAU / (base + qi.extraRings); f.rings.push({ x: hero.x + Math.cos(a) * radius, y: hero.y - 30 + Math.sin(a) * radius * .65, radius: mind >= 2 ? 23 : 20, seed: i, alpha: .95, extra: i >= base }); }
        if (rank >= 6) for (let t = Math.max(0, time - 3); t < time; t += .16) { const c = t % 5, pulseAt = Math.sin(clamp((c - .5) / 2.6) * Math.PI); if (pulseAt <= .1) continue; for (let i = 0; i < 5; i++) { const a = t * (mind >= 4 ? 3.5 : 2.1) + i * TAU / 5, r = 105 + pulseAt * 145; addField(hero.x + Math.cos(a) * r, hero.y + Math.sin(a) * r * .65, 18, t, 'ring'); } }
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
      f.bursts.push({ x, y, age, radius: 110, kind: 'block' });
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
    if (r > 48) {
      // Scanline bands keep the enlarged original hollow ring inexpensive at two-pixel resolution.
      const inner = r * .65;
      for (let y = -Math.ceil(r / 2) * 2; y <= r; y += 2) {
        const outerX = Math.sqrt(Math.max(0, r * r - y * y)), innerX = Math.abs(y) < inner ? Math.sqrt(inner * inner - y * y) : 0;
        c.fillStyle = palette.dark;
        c.fillRect(Math.round((p.x - outerX) / 2) * 2, Math.round((p.y + y) / 2) * 2, Math.max(2, Math.round((outerX - innerX) / 2) * 2), 2);
        c.fillRect(Math.round((p.x + innerX) / 2) * 2, Math.round((p.y + y) / 2) * 2, Math.max(2, Math.round((outerX - innerX) / 2) * 2), 2);
      }
      const steps = Math.ceil(r * Math.PI);
      for (let i = 0; i < steps; i++) {
        const a = i / steps * TAU, rough = Math.sin(a * 17 + p.seed) * 4 + Math.sin(a * 43) * 2;
        const outer = point(p.x, p.y, a, r + rough), inside = point(p.x, p.y, a, inner + rough);
        square(c, outer.x, outer.y, 4, i % 7 === 0 ? palette.flame : palette.body);
        if (i % 3 === 0) square(c, inside.x, inside.y, 4, palette.ink);
        if (i % 13 === 0) { const grain = point(p.x, p.y, a, r * (.72 + hash(i, p.seed) * .2)); square(c, grain.x, grain.y, 6, palette.ink); }
      }
      c.restore(); return;
    }
    for (let y = -r - 5; y <= r + 5; y += 2) for (let x = -r - 5; x <= r + 5; x += 2) { const d = Math.hypot(x, y), a = Math.atan2(y, x), edge = r + Math.sin(a * 7 + p.seed) * 3; if (d < edge && d > r * .65) square(c, p.x + x, p.y + y, 2, d > edge - 3 ? palette.light : hash(x, y, p.seed) > .7 ? palette.flame : palette.ink); }
    c.restore();
  }
  function sweep(c, s) {
    c.save(); c.globalAlpha *= s.alpha;
    const span = s.fullCircle ? TAU : 2.6, start = s.angle - (s.fullCircle ? Math.PI : 1.3), end = span * s.progress;
    for (let y = -s.radius; y <= s.radius; y += 2) for (let x = -s.radius; x <= s.radius; x += 2) {
      const distance = Math.hypot(x, y), theta = Math.atan2(y, x), offset = ((theta - start) % TAU + TAU) % TAU;
      if (offset > end) continue;
      const edge = s.radius + Math.sin(theta * 11) * 2, taper = s.fullCircle ? 1 : Math.max(.12, Math.sin(offset / span * Math.PI));
      const width = (s.fullCircle ? 19 : 28) * taper;
      if (distance <= edge && distance >= edge - width) square(c, s.x + x, s.y + y * .68, 2, distance > edge - 3 ? palette.light : distance < edge - width * .7 ? palette.body : palette.dark);
    }
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
      for (const s of f.sweeps) sweep(c, s);
      for (const p of f.projectiles) crescent(c, p);
      for (const p of f.rings) ring(c, p);
      if (f.fusedRing) ring(c, f.fusedRing);
      for (const wave of f.waves) {
        c.globalAlpha = wave.alpha;
        const steps = Math.ceil(TAU * wave.radius / 4);
        for (let i = 0; i < steps; i++) {
          if (i % 11 === 0) continue;
          const a = i / steps * TAU, p = point(wave.x, wave.y, a, wave.radius + Math.sin(a * 37) * 3);
          square(c, p.x, p.y, i % 4 === 0 ? 6 : 4, i % 9 === 0 ? palette.light : palette.body);
        }
        c.globalAlpha = 1;
      }
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
  window.CheonHeavenlyDemonEffects = Object.freeze({ frame, resources, capacity, swordHits, draw, drawQi, palette, clamp, hash, timing: { cast: CAST, dash: DASH, swordInterval: SWORD_INTERVAL, crossDelay: CROSS_DELAY, ringBurst: RING_BURST }, fusedRingRadius: FUSED_RING_RADIUS });
})();
