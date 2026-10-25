/* Namgung visual vocabulary. All coordinates are world pixels, resolved on a 2px grid. */
(() => {
  'use strict';
  const giantSwordGeometry = Object.freeze({ referenceFlowerDiameter: 798, bladeWidth: 399, height: 900, pixelStep: 2, sourceBladeRow: .6 });
  const TAU = Math.PI * 2, P = Object.freeze({ ink: '#264c66', dark: '#345d85', body: '#6797bd', light: '#a7cfdf', white: '#f3f2dc', gold: '#d2b77a' });
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const hash = (x, y, s = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 17.7) * 43758.5453; return n - Math.floor(n); };
  const point = (x, y, a, r) => ({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
  const delta = a => Math.atan2(Math.sin(a), Math.cos(a));
  function cell(ctx, x, y, color, alpha = 1, size = 2) { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, size, size); }
  function line(ctx, x, y, a, length, width, alpha = 1, seed = 0, progress = 1) {
    const end = length * clamp(progress), ca = Math.cos(a), sa = Math.sin(a);
    for (let t = 0; t < end; t += 2) for (let q = -width / 2; q <= width / 2; q += 2) {
      const edge = Math.abs(q) / (width / 2), n = hash(t / 2, q / 2, seed);
      if (edge > .75 && n < .34 || t > end - 10 && n < .28) continue;
      const color = Math.abs(q) < width * .13 ? P.white : q < 0 ? P.light : edge > .74 ? P.dark : P.body;
      cell(ctx, x + ca * t - sa * q, y + sa * t + ca * q, color, alpha * (.7 + n * .3));
    }
  }
  function fan(ctx, x, y, a, radius, progress, alpha, seed) {
    const span = 75 * Math.PI / 180, start = a - span / 2, end = start + span * clamp(progress);
    for (let yy = -radius; yy <= radius; yy += 2) for (let xx = -radius; xx <= radius; xx += 2) {
      const r = Math.hypot(xx, yy), angle = delta(Math.atan2(yy, xx) - start);
      if (r > radius || r < 16 || angle < 0 || angle > end - start) continue;
      const n = hash(xx, yy, seed), outer = r / radius, leading = end - start - angle;
      if (outer < .56 && n > .13 || outer > .94 && n < .28) continue;
      const color = leading < .035 || outer > .91 && n > .45 ? P.white : outer > .78 ? P.light : outer > .64 ? P.body : P.dark;
      cell(ctx, x + xx, y + yy, color, alpha * (outer < .65 ? .22 : .8 + n * .2));
    }
  }
  function lightning(ctx, x, y, a, length, age, seed, width = 13) {
    if (age < 0 || age > .52) return;
    const reveal = clamp(age / .10), fade = clamp((.52 - age) / .25), ca = Math.cos(a), sa = Math.sin(a);
    const points = [{ x, y }];
    for (let n = 1; n <= 12; n++) { const t = n / 12 * length, q = n === 12 ? 0 : (hash(n, 3, seed) - .5) * 24; points.push({ x: x + ca * t - sa * q, y: y + sa * t + ca * q }); }
    for (let i = 1; i < points.length && i / 12 <= reveal + .1; i++) {
      const from = points[i - 1], to = points[i], angle = Math.atan2(to.y - from.y, to.x - from.x), len = Math.hypot(to.x - from.x, to.y - from.y);
      line(ctx, from.x, from.y, angle, len, width, fade, seed + i);
      if (i % 4 === 2) line(ctx, from.x, from.y, a + (i % 2 ? -.6 : .6), 35, 4, fade * .65, seed);
    }
  }
  function ring(ctx, x, y, radius, alpha, seed = 0, width = 8) {
    for (let a = 0; a < TAU; a += 2 / radius) for (let q = 0; q < width; q += 2) {
      if (hash(Math.round(a * radius), q, seed) < .18) continue;
      cell(ctx, x + Math.cos(a) * (radius - q), y + Math.sin(a) * (radius - q) * .58, q < 2 ? P.light : P.body, alpha);
    }
  }
  function jian(ctx, x, y, angle, length = 68, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(Math.round(x / 2) * 2, Math.round(y / 2) * 2); ctx.rotate(angle);
    const scale = length / 68; ctx.scale(scale, scale);
    ctx.fillStyle = P.ink; ctx.fillRect(-15, -4, 18, 8); ctx.fillStyle = P.gold; ctx.fillRect(-15, -3, 15, 6);
    ctx.fillStyle = P.dark; for (let n = -12; n < 0; n += 4) ctx.fillRect(n, -3, 2, 6);
    ctx.fillStyle = P.ink; ctx.fillRect(-2, -13, 7, 26); ctx.fillStyle = P.gold; ctx.fillRect(0, -11, 3, 22);
    ctx.fillStyle = P.dark; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(57, -5); ctx.lineTo(68, 0); ctx.lineTo(57, 5); ctx.lineTo(4, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.white; ctx.beginPath(); ctx.moveTo(4, -5); ctx.lineTo(56, -4); ctx.lineTo(68, 0); ctx.lineTo(4, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.body; ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(68, 0); ctx.lineTo(56, 4); ctx.lineTo(4, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.light; ctx.fillRect(6, 0, 49, 2); ctx.restore();
  }
  function motes(ctx, x, y, age, seed, radius = 72, count = 23) {
    if (age < 0 || age > .65) return;
    for (let i = 0; i < count; i++) { const a = hash(i, 1, seed) * TAU, r = age * radius * (1 + hash(i, 3, seed)); cell(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .65, i % 3 ? P.light : P.white, clamp((.65 - age) / .4), i % 5 ? 2 : 4); }
  }
  function castDuration(path, rank) { return path === 'formation' ? rank < 6 ? 4.5 : rank === 6 ? 1.8 : 1.65 : path === 'dash' ? 3.5 : rank === 7 ? 1.05 : .78; }
  function sword(ctx, cast, age) {
    const { x, y, angle: a, rank, seed = 1 } = cast;
    if (age < 0 || age > castDuration('sword', rank)) return;
    const fade = clamp((.6 - age) / .28), sweep = clamp(age / .22);
    if (rank === 1) { const reach = 68 * Math.sin(clamp(age / .22) * Math.PI / 2); line(ctx, x + Math.cos(a) * 20, y + Math.sin(a) * 20, a, reach, 9, fade, seed); }
    else if (rank <= 5) { fan(ctx, x, y, a, rank === 2 ? 122 : 186, sweep, fade, seed); if (rank === 4) lightning(ctx, x, y, a, 252, age - .16, seed); if (rank === 5) for (const offset of [-.34, 0, .34]) lightning(ctx, x, y, a + offset, 274, age - .16, seed + offset * 30); }
    else { line(ctx, x + Math.cos(a) * 12, y + Math.sin(a) * 12, a, cast.length || 330, rank === 7 ? 42 : 32, clamp((.64 - age) / .3), seed, clamp(age / .15)); if (rank === 7) lightning(ctx, x, y, a, cast.length || 330, age - .38, seed, 28); }
    ctx.globalAlpha = 1;
  }
  function allocateTargets(cast, targets) {
    const rank = cast.rank, count = rank === 7 ? 1 : rank === 1 ? 1 : rank < 4 ? 3 : 8;
    const living = targets.filter(t => t.hp == null || t.hp > 0);
    living.sort((a, b) => rank === 7 && a.ranged !== b.ranged ? Number(b.ranged) - Number(a.ranged) : Math.hypot(a.x - cast.x, a.y - cast.y) - Math.hypot(b.x - cast.x, b.y - cast.y));
    return living.slice(0, count).map(t => t.id);
  }
  function formation(ctx, cast, age, targets, layer, giant) {
    const { rank, x, y, angle, seed = 1 } = cast;
    if (age < 0 || age > castDuration('formation', rank)) return;
    const ids = cast.targetIds || allocateTargets(cast, targets);
    const assigned = ids.map(id => targets.find(t => t.id === id)).filter(t => t && (t.hp == null || t.hp > 0));
    if (rank < 6) {
      assigned.forEach((target, i) => {
        const t = (age * 2.6 + i * .17) % 1, a = -.85 + .35 * Math.sin(age * 5 + i), jab = Math.sin(t * Math.PI) * 16;
        if (layer === 'back' && rank >= 5) ring(ctx, target.x, target.y + 28, 40 + t * 13, (1 - t) * .45, i, 5);
        if (layer === 'front') { jian(ctx, target.x - 27 + jab, target.y - 18 - jab, a, rank >= 3 ? 60 : 49, clamp(age / .15) * clamp((4.5 - age) / .45)); if (t < .22) motes(ctx, target.x, target.y, t, i, 70, 7); }
      });
    } else if (rank === 6 && layer === 'front') {
      const t = clamp(age / 1.55), r = Math.sin(t * Math.PI) * 285;
      for (let i = 0; i < assigned.length; i++) { const a = Math.atan2(assigned[i].y - y, assigned[i].x - x), p = point(x, y, a, r); line(ctx, p.x - Math.cos(a) * 25, p.y - Math.sin(a) * 25, a, 25, 7, .5, i); jian(ctx, p.x, p.y, t < .5 ? a : a + Math.PI, 75, clamp((1.8 - age) / .25)); }
    } else if (rank === 7 && layer === 'back') {
      const target = assigned[0]; if (!target) return;
      const contact = .73, t = clamp(age / contact), bx = target.x + 115 * (1 - t) ** 2, by = target.y + 33 - 600 * (1 - t) ** 2;
      if (age < contact + .18) { line(ctx, bx + Math.sin(.24) * (giantSwordGeometry.height - 40), by - Math.cos(.24) * (giantSwordGeometry.height - 40), -Math.PI / 2 + .24, 190, 24, .22, seed); if (giant) giant(ctx, bx, by, .24, giantSwordGeometry.height, clamp((.94 - age) / .2)); else { ctx.save(); ctx.translate(bx, by); ctx.rotate(.24); ctx.scale(giantSwordGeometry.bladeWidth / 12, giantSwordGeometry.height / 68); jian(ctx, 0, -68, Math.PI / 2, 68, clamp((.94 - age) / .2)); ctx.restore(); } }
      if (age >= contact) { const after = age - contact; ring(ctx, target.x, target.y + 30, 25 + after * 260, clamp((.8 - after) / .65), seed, 17); motes(ctx, target.x, target.y + 20, after, seed, 180, 55); for (let i = 0; i < 6; i++) lightning(ctx, target.x, target.y + 15, i / 6 * TAU, 90, after, seed + i, 8); }
    }
    ctx.globalAlpha = 1;
  }
  function fieldCells(casts, time) {
    // Union by grid cell: overlapping casts from this path never accumulate opacity.
    const occupied = new Map();
    for (const cast of casts) {
      if (cast.path !== 'dash' || cast.rank < 3) continue;
      const age = time - cast.at - .12; if (age < 0 || age >= 3) continue;
      const alpha = Math.min(.24, (3 - age) * .28), halfWidth = cast.rank >= 5 ? 49 : 30;
      for (let t = 0; t < 180; t += 4) for (let q = -halfWidth; q <= halfWidth; q += 4) {
        const xx = Math.round((cast.x + Math.cos(cast.angle) * t - Math.sin(cast.angle) * q) / 4) * 4;
        const yy = Math.round((cast.y + 38 + Math.sin(cast.angle) * t + Math.cos(cast.angle) * q) / 4) * 4;
        const key = `${xx},${yy}`; occupied.set(key, { x: xx, y: yy, alpha: Math.max(alpha, occupied.get(key)?.alpha || 0) });
      }
    }
    return [...occupied.values()];
  }
  function field(ctx, casts, time) {
    for (const p of fieldCells(casts, time)) cell(ctx, p.x, p.y, hash(p.x, p.y) > .85 ? P.light : P.body, p.alpha, 4);
    ctx.globalAlpha = 1;
  }
  function dash(ctx, cast, age, layer, targets) {
    if (age < 0 || age > 3.5 || layer !== 'back') return;
    const end = point(cast.x, cast.y, cast.angle, 180);
    if (age < .55) { ring(ctx, end.x, end.y + 34, 18 + age * 145, clamp((.55 - age) / .4), cast.seed, 10); }
    if (cast.rank >= 4) { const target = targets.filter(t => t.hp == null || t.hp > 0).sort((a, b) => Math.hypot(a.x - end.x, a.y - end.y) - Math.hypot(b.x - end.x, b.y - end.y))[0]; if (target) lightning(ctx, end.x, end.y, Math.atan2(target.y - end.y, target.x - end.x), Math.hypot(target.x - end.x, target.y - end.y), age - .15, cast.seed, cast.rank === 7 ? 22 : 12); }
  }
  function draw(ctx, cast, time, options = {}) {
    const age = time - cast.at, layer = options.layer || 'front'; ctx.save();
    if (cast.path === 'sword' && layer === 'front') sword(ctx, cast, age);
    if (cast.path === 'formation') formation(ctx, cast, age, options.targets || [], layer, options.giant);
    if (cast.path === 'dash') dash(ctx, cast, age, layer, options.targets || []);
    ctx.restore();
  }
  function drawQi(ctx, hero, time, rank, layer) {
    if (rank <= 0) return;
    const count = Math.min(8, rank);
    for (let i = 0; i < count; i++) { const a = time * 1.3 + i / count * TAU, front = Math.sin(a) >= 0; if (front !== (layer === 'front')) continue; const x = hero.x + Math.cos(a) * 35, y = hero.y - 29 + Math.sin(a) * 12; jian(ctx, x, y, a + Math.PI / 2, 25, .8); }
  }
  window.CheonNamgungEffects = Object.freeze({ palette: P, giantSwordGeometry, castDuration, allocateTargets, fieldCells, draw, drawQi, field, jian, lightning, ring, hash, clamp });
})();

