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
  function fan(ctx, x, y, a, radius, progress, alpha, seed) {
    const span = 75 * Math.PI / 180, start = a - span / 2, end = start + span * clamp(progress);
    for (let yy = -radius; yy <= radius; yy += 2) for (let xx = -radius; xx <= radius; xx += 2) {
      const r = Math.hypot(xx, yy), angle = delta(Math.atan2(yy, xx) - start);
      if (r > radius || r < radius * .79 || angle < 0 || angle > end - start) continue;
      const n = hash(xx, yy, seed), outer = r / radius, leading = end - start - angle;
      if (outer < .83 && n < .65 || outer > .94 && n < .28) continue;
      const color = leading < .035 || outer > .91 && n > .45 ? P.white : outer > .78 ? P.light : outer > .64 ? P.body : P.dark;
      cell(ctx, x + xx, y + yy, color, alpha * (outer < .65 ? .22 : .8 + n * .2));
    }
  }
  const lightningWidthAt = (width, progress) => width * Math.min(1, Math.max(0, (1 - progress) / .22));
  function lightning(ctx, x, y, a, length, age, seed, width = 13) {
    if (age < 0 || age > .52) return;
    const reveal = clamp(age / .10), fade = clamp((.52 - age) / .25), ca = Math.cos(a), sa = Math.sin(a);
    const points = [{ x, y }];
    for (let n = 1; n <= 12; n++) { const t = n / 12 * length, q = n === 12 ? 0 : (hash(n, 3, seed) - .5) * 24; points.push({ x: x + ca * t - sa * q, y: y + sa * t + ca * q }); }
    for (let i = 1; i < points.length && i / 12 <= reveal + .1; i++) {
      const from = points[i - 1], to = points[i], angle = Math.atan2(to.y - from.y, to.x - from.x), len = Math.hypot(to.x - from.x, to.y - from.y);
      // Rasterize the final segments as one taper. Every fork ends in a point,
      // rather than exposing the rectangular cap of a thick line segment.
      for (let d = 0; d < len; d += 2) {
        const u = (i - 1 + d / len) / 12, localWidth = lightningWidthAt(width, u);
        for (let q = -localWidth / 2; q <= localWidth / 2; q += 2) cell(ctx, from.x + Math.cos(angle) * d - Math.sin(angle) * q, from.y + Math.sin(angle) * d + Math.cos(angle) * q, Math.abs(q) < Math.max(1, localWidth * .15) ? P.white : q < 0 ? P.light : P.body, fade);
      }
      if (i % 4 === 2) {
        const branchAngle = a + (i % 2 ? -.6 : .6);
        for (let d = 0; d < 35; d += 2) {
          const branchWidth = lightningWidthAt(6, d / 35);
          for (let q = -branchWidth / 2; q <= branchWidth / 2; q += 2) cell(ctx, from.x + Math.cos(branchAngle) * d - Math.sin(branchAngle) * q, from.y + Math.sin(branchAngle) * d + Math.cos(branchAngle) * q, Math.abs(q) < 1 ? P.white : P.light, fade * .65);
        }
      }
    }
  }
  function skyLightning(ctx, x, groundY, age, seed = 1, width = 28, height = 460) {
    if (age < 0 || age > .62) return;
    lightning(ctx, x, groundY - height, Math.PI / 2, height, age, seed, width);
  }
  function ribbon(ctx, x, y, a, length, width, progress, alpha, seed) {
    const reach = length * clamp(progress), ca = Math.cos(a), sa = Math.sin(a);
    for (let d = 0; d < reach; d += 2) {
      const u = d / length, half = width * .5 * Math.sin(Math.PI * u) ** .7;
      for (let q = -half; q <= half; q += 2) {
        const n = hash(d, q, seed), edge = Math.abs(q) / Math.max(1, half);
        if (edge > .74 && n < .4) continue;
        cell(ctx, x + ca * d - sa * q, y + sa * d + ca * q, Math.abs(q) < width * .09 ? P.white : q < 0 ? P.light : P.body, alpha * (.72 + n * .28));
      }
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
  function castDuration(path, rank) { return path === 'formation' ? rank < 6 ? 4.5 : rank === 6 ? 1.8 : 1.9 : path === 'dash' ? 3.5 : rank === 7 ? 1.65 : .78; }
  function swordGeometry(cast) {
    return { radius: cast.rank === 2 ? 122 : 186, length: (cast.length || 330) * 2, width: cast.rank === 7 ? 128 : 96 };
  }
  function sword(ctx, cast, age, options) {
    const { x, y, angle: a, rank, seed = 1 } = cast;
    if (age < 0 || age > castDuration('sword', rank)) return;
    const fade = clamp((.6 - age) / .28), sweep = clamp(age / .13), geometry = swordGeometry(cast);
    if (rank === 1) return; // The hero's steel blade carries the close thrust.
    if (rank <= 5) {
      (options.fan || fan)(ctx, x, y, a, geometry.radius, sweep, fade, seed);
      if (rank === 4) lightning(ctx, x, y, a, 252, age - .16, seed);
      if (rank === 5) for (const offset of [-.34, 0, .34]) lightning(ctx, x, y, a + offset, 274, age - .16, seed + offset * 30);
    } else {
      (options.ribbon || ribbon)(ctx, x + Math.cos(a) * 12, y + Math.sin(a) * 12, a, geometry.length, geometry.width, clamp(age / .15), clamp((.68 - age) / .3), seed);
      if (rank === 7) for (let i = 0; i < 7; i++) {
        const p = point(x, y, a, 24 + (geometry.length - 24) * i / 6);
        skyLightning(ctx, p.x, p.y, age - .28 - i * .10, seed + i, 30, 480);
      }
    }
    ctx.globalAlpha = 1;
  }
  function allocateTargets(cast, targets) {
    const rank = cast.rank, count = rank === 7 ? 1 : rank === 1 ? 1 : rank < 4 ? 3 : 8;
    const living = targets.filter(t => t.hp == null || t.hp > 0);
    living.sort((a, b) => rank === 7 && a.ranged !== b.ranged ? Number(b.ranged) - Number(a.ranged) : Math.hypot(a.x - cast.x, a.y - cast.y) - Math.hypot(b.x - cast.x, b.y - cast.y));
    return living.slice(0, count).map(t => t.id);
  }
  function attachedSwordPose(cast, age, target, index = 0) {
    const phase = (age * 2.6 + index * .17) % 1;
    const length = cast.rank === 5 ? 60 : cast.rank >= 3 ? 30 : 24.5;
    const alpha = clamp(age / .15) * clamp((4.5 - age) / .45);
    if (cast.rank === 5) {
      // Each cut travels through the torso: its first half is occluded by the
      // enemy; the blade emerges in front during the follow-through.
      const sweep = phase * phase * (3 - 2 * phase), a = -1.8 + sweep * 2.65;
      return { x: target.x - Math.cos(a) * 23 + sweep * 12 - 6, y: target.y + 14 - Math.sin(a) * 23 + sweep * 12 - 6, angle: a, length, alpha, layer: phase < .48 ? 'back' : 'front' };
    }
    const penetration = Math.sin(phase * Math.PI) * 26, a = .22;
    return { x: target.x - length - 13 + penetration, y: target.y + 14 - Math.sin(a) * length, angle: a, length, alpha, layer: phase < .23 || phase > .82 ? 'back' : 'front' };
  }
  function returningSwordPoses(cast, age) {
    const t = clamp(age / 1.55), radius = Math.sin(t * Math.PI) * 285;
    return Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4, p = point(cast.x, cast.y, a, radius);
      return { ...p, angle: t < .5 ? a : a + Math.PI, length: 75, alpha: clamp((1.8 - age) / .25) };
    });
  }
  function giantSwordPose(cast, age, target) {
    const contact = .73, angle = .24, approach = clamp(age / contact), groundY = target.y + 33;
    const burial = clamp((age - contact) / .78) * (giantSwordGeometry.height + 100);
    return { x: target.x + 115 * (1 - approach) ** 2 - Math.sin(angle) * burial,
      y: groundY - 600 * (1 - approach) ** 2 + Math.cos(angle) * burial,
      angle, height: giantSwordGeometry.height, groundY, burial, contact, alpha: 1 };
  }
  function formation(ctx, cast, age, targets, layer, giant) {
    const { rank } = cast;
    if (age < 0 || age > castDuration('formation', rank)) return;
    const ids = cast.targetIds || allocateTargets(cast, targets);
    const assigned = ids.map(id => targets.find(t => t.id === id)).filter(t => t && (t.hp == null || t.hp > 0));
    if (rank < 6) {
      assigned.forEach((target, i) => {
        const p = attachedSwordPose(cast, age, target, i);
        if (layer === p.layer) jian(ctx, p.x, p.y, p.angle, p.length, p.alpha);
      });
    } else if (rank === 6 && layer === 'front') {
      for (const p of returningSwordPoses(cast, age)) jian(ctx, p.x, p.y, p.angle, p.length, p.alpha);
    } else if (rank === 7 && layer === 'back') {
      const target = assigned[0]; if (!target) return;
      const p = giantSwordPose(cast, age, target);
      if (giant) giant(ctx, p.x, p.y, p.angle, p.height, p.alpha, { groundY: p.groundY });
      else {
        ctx.save(); ctx.beginPath(); ctx.rect(-10000, -10000, 20000, 10000 + p.groundY); ctx.clip();
        ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.scale(giantSwordGeometry.bladeWidth / 12, giantSwordGeometry.height / 68);
        jian(ctx, 0, -68, Math.PI / 2, 68, 1); ctx.restore();
      }
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
    if (cast.rank >= 4) { const target = targets.filter(t => t.hp == null || t.hp > 0).sort((a, b) => Math.hypot(a.x - end.x, a.y - end.y) - Math.hypot(b.x - end.x, b.y - end.y))[0]; if (target) skyLightning(ctx, target.x, target.y + 25, age - .15, cast.seed, cast.rank === 7 ? 36 : 28, cast.rank === 7 ? 520 : 460); }
  }
  function draw(ctx, cast, time, options = {}) {
    const age = time - cast.at, layer = options.layer || 'front'; ctx.save();
    if (cast.path === 'sword' && layer === 'between') sword(ctx, cast, age, options);
    if (cast.path === 'formation') formation(ctx, cast, age, options.targets || [], layer, options.giant);
    if (cast.path === 'dash') dash(ctx, cast, age, layer, options.targets || []);
    ctx.restore();
  }
  function drawQi(ctx, hero, time, rank, layer) {
    if (rank <= 0) return;
    const count = Math.min(8, rank);
    for (let i = 0; i < count; i++) { const a = time * 1.3 + i / count * TAU, front = Math.sin(a) >= 0; if (front !== (layer === 'front')) continue; const x = hero.x + Math.cos(a) * 35, y = hero.y - 29 + Math.sin(a) * 12; jian(ctx, x, y, a + Math.PI / 2, 25, .8); }
  }
  window.CheonNamgungEffects = Object.freeze({ palette: P, giantSwordGeometry, castDuration, swordGeometry, attachedSwordPose, returningSwordPoses, giantSwordPose, lightningWidthAt, allocateTargets, fieldCells, draw, drawQi, field, jian, lightning, skyLightning, ring, hash, clamp });
})();

