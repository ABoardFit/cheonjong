/* Namgung visual vocabulary. All coordinates are world pixels, resolved on a 2px grid. */
(() => {
  'use strict';
  const giantSwordGeometry = Object.freeze({ referenceFlowerDiameter: 798, bladeWidth: 399, height: 1320, bladeLength: 990, handleLength: 270, guardLength: 60, pixelStep: 2, sourceBladeRow: .6, sourceHandleEnd: .20, sourceGuardEnd: 4 / 15 });
  const TAU = Math.PI * 2, P = Object.freeze({ ink: '#264c66', dark: '#345d85', body: '#6797bd', light: '#a7cfdf', white: '#f3f2dc', gold: '#d2b77a' });
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const hash = (x, y, s = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 17.7) * 43758.5453; return n - Math.floor(n); };
  const point = (x, y, a, r) => ({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
  const delta = a => Math.atan2(Math.sin(a), Math.cos(a));
  function cell(ctx, x, y, color, alpha = 1, size = 2) { ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, size, size); }
  function fan(ctx, x, y, a, radius, progress, alpha, seed) {
    const span = 75 * Math.PI / 180, reveal = span * clamp(progress);
    const direction = ((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8;
    const start = direction >= 3 && direction <= 5 ? a + span / 2 - reveal : a - span / 2, end = start + reveal;
    for (let yy = -radius; yy <= radius; yy += 2) for (let xx = -radius; xx <= radius; xx += 2) {
      const r = Math.hypot(xx, yy), angle = delta(Math.atan2(yy, xx) - start);
      const taper = Math.min(1, angle / .12, (end - start - angle) / .12);
      if (r > radius || r < radius * (1 - .21 * Math.max(0, taper)) || angle < 0 || angle > end - start) continue;
      const n = hash(xx, yy, seed), outer = r / radius, leading = end - start - angle;
      if (outer < .83 && n < .65 || outer > .94 && n < .28) continue;
      const color = leading < .035 || outer > .91 && n > .45 ? P.white : outer > .78 ? P.light : outer > .64 ? P.body : P.dark;
      cell(ctx, x + xx, y + yy, color, alpha * (outer < .65 ? .22 : .8 + n * .2));
    }
    // A thin radial leading edge makes the sector readable without filling it.
    const leadingAngle = direction >= 3 && direction <= 5 ? start : end;
    if (reveal > 0) for (let r = 0; r < radius; r += 2) cell(ctx, x + Math.cos(leadingAngle) * r, y + Math.sin(leadingAngle) * r, P.body, alpha * .6);
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
  function flameLightningBranches(x, groundY, height = 550, spread = 150, seed = 1) {
    // An asymmetric central tongue with fine secondary forks: each has its own
    // height, bow and thickness. Both ends taper to a single sharp point.
    const shapes = [
      { reach: 1, offset: -.09, curl: .42, turns: 2.15, phase: .1, width: 19 },
      { reach: .79, offset: -.41, curl: -.39, turns: 1.8, phase: .2, width: 8 },
      { reach: .68, offset: .60, curl: -.44, turns: 1.65, phase: -.2, width: 11 },
      { reach: .48, offset: -.83, curl: .37, turns: 1.4, phase: .1, width: 5 },
      { reach: .42, offset: .88, curl: .27, turns: 1.6, phase: .35, width: 7 },
      { reach: .30, offset: -.62, curl: -.24, turns: 1.35, phase: .3, width: 4 },
      { reach: .25, offset: .56, curl: -.21, turns: 1.2, phase: -.3, width: 3 }
    ];
    return shapes.map((shape, index) => {
      const reach = shape.reach * (index === 0 ? 1 : .97 + hash(index, 4, seed) * .06);
      return Array.from({ length: 81 }, (_, i) => {
        const t = i / 80, sway = Math.sin(t * Math.PI * shape.turns + shape.phase) * Math.sin(t * Math.PI);
        return { x: x + spread * (shape.offset * (1 - t) ** .87 + sway * shape.curl),
          y: groundY - height * reach * (1 - t),
          width: i === 0 || i === 80 ? 0 : shape.width * Math.sin(Math.PI * t) ** .85 * (.35 + .65 * t) };
      });
    });
  }
  function flameSkyLightning(ctx, x, groundY, age, seed = 1) {
    if (age < 0 || age > .8) return;
    const reveal = clamp(age / .08), alpha = clamp((.8 - age) / .34);
    for (const branch of flameLightningBranches(x, groundY, 550, 150, seed)) {
      for (let i = 1; i < branch.length; i++) {
        if ((i - 1) / (branch.length - 1) > reveal) break;
        const from = branch[i - 1], to = branch[i], dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy), nx = -dy / length, ny = dx / length;
        for (let d = 0; d <= length; d += 1) {
          const f = d / length, progress = (i - 1 + f) / (branch.length - 1);
          if (progress > reveal) break;
          const leadingTaper = reveal < 1 ? clamp((reveal - progress) / .06) : 1;
          const half = (from.width + (to.width - from.width) * f) * leadingTaper;
          if (half < .05) continue;
          for (let q = -Math.floor(half); q <= Math.floor(half); q += 1) {
            if (Math.abs(q) > half * .85 && hash(i, q, seed) < .12) continue;
            cell(ctx, from.x + dx * f + nx * q, from.y + dy * f + ny * q,
              Math.abs(q) < half * .52 ? '#f6fbff' : Math.abs(q) < half * .8 ? '#b7ddec' : P.body, alpha);
          }
        }
      }
    }
    flameGroundImpact(ctx, x, groundY, age - .08, seed);
  }
  function flameImpactBranches(x, groundY, seed = 1) {
    return Array.from({ length: 9 }, (_, index) => {
      const side = index % 2 ? -1 : 1, reach = 38 + Math.floor(index / 2) * 19;
      const height = 40 + hash(index, 18, seed) * 66;
      return Array.from({ length: 33 }, (_, i) => {
        const t = i / 32;
        return { x: x + side * (reach * Math.sin(t * Math.PI / 2) + Math.sin(t * Math.PI * 2) * 12),
          y: groundY - height * t + Math.sin(t * Math.PI) * 12,
          width: i === 32 ? 0 : (5 + index % 3 * 2) * (1 - t) ** .7 };
      });
    });
  }
  function flameGroundImpact(ctx, x, groundY, age, seed = 1) {
    if (age < 0 || age > .64) return;
    const reveal = clamp(age / .055), alpha = clamp((.64 - age) / .3);
    // The white impact root connects the descending tongues to the ground.
    // Its pointed, rising forks are intentionally not a circle or shock ring.
    for (let dx = -35; dx <= 35; dx += 2) for (let dy = 0; dy < 9 - Math.abs(dx) / 5; dy += 2)
      cell(ctx, x + dx, groundY - dy, Math.abs(dx) < 23 ? '#f6fbff' : P.light, alpha);
    for (const branch of flameImpactBranches(x, groundY, seed)) for (let i = 0; i < branch.length * reveal; i++) {
      const p = branch[i];
      for (let q = -Math.floor(p.width); q <= Math.floor(p.width); q += 2)
        cell(ctx, p.x + q, p.y, Math.abs(q) < p.width * .55 ? '#f6fbff' : Math.abs(q) < p.width * .82 ? '#b7ddec' : P.body, alpha);
    }
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
  function castDuration(path, rank) { return path === 'formation' ? rank < 6 ? 4.5 : rank === 6 ? 1.8 : 3.9 : path === 'dash' ? 3.5 : rank === 7 ? 1.72 : .78; }
  function swordGeometry(cast) {
    return { radius: cast.rank === 2 ? 122 : 186, length: (cast.length || 330) * 2, width: cast.rank === 7 ? 128 : 96 };
  }
  function swordCluster(cast, targets, radius = 335, neighborRadius = 120) {
    const living = targets.filter(t => (t.hp == null || t.hp > 0) && Math.hypot(t.x - cast.x, t.y - cast.y) <= radius)
      .sort((a, b) => typeof a.id === 'number' && typeof b.id === 'number' ? a.id - b.id || a.x - b.x || a.y - b.y : String(a.id ?? '').localeCompare(String(b.id ?? '')) || a.x - b.x || a.y - b.y);
    if (!living.length) return Object.freeze({ x: cast.x + Math.cos(cast.angle) * radius * .55, y: cast.y + Math.sin(cast.angle) * radius * .55, angle: hash(1, 9, cast.seed || 1) * Math.PI, ids: Object.freeze([]) });
    let chosen = [], distance = Infinity;
    for (const candidate of living) {
      const nearby = living.filter(t => Math.hypot(t.x - candidate.x, t.y - candidate.y) <= neighborRadius);
      const d = Math.hypot(candidate.x - cast.x, candidate.y - cast.y);
      if (nearby.length > chosen.length || nearby.length === chosen.length && d < distance) { chosen = nearby; distance = d; }
    }
    const x = chosen.reduce((n, t) => n + t.x, 0) / chosen.length, y = chosen.reduce((n, t) => n + t.y, 0) / chosen.length;
    const xx = chosen.reduce((n, t) => n + (t.x - x) ** 2, 0), yy = chosen.reduce((n, t) => n + (t.y - y) ** 2, 0), xy = chosen.reduce((n, t) => n + (t.x - x) * (t.y - y), 0);
    const angle = xx + yy > 1 ? Math.atan2(2 * xy, xx - yy) / 2 : hash(1, 9, cast.seed || 1) * Math.PI;
    return Object.freeze({ x, y, angle, ids: Object.freeze(chosen.map(t => t.id)) });
  }
  function swordSlashPose(cast) {
    const geometry = swordGeometry(cast), center = cast.cluster || { x: cast.x, y: cast.y, angle: cast.angle };
    const angle = center.angle;
    return { x: center.x - Math.cos(angle) * geometry.length / 2, y: center.y - Math.sin(angle) * geometry.length / 2, angle, ...geometry, center };
  }
  function sword(ctx, cast, age, options) {
    const { x, y, angle: a, rank, seed = 1 } = cast;
    if (age < 0 || age > castDuration('sword', rank)) return;
    const fade = clamp((.6 - age) / .28), sweep = clamp(age / (window.CheonCombatAnimation?.physicalStrokeDuration?.(2) || .18)), geometry = swordGeometry(cast);
    if (rank === 1) return; // The hero's steel blade carries the close thrust.
    if (rank <= 5) {
      (options.fan || fan)(ctx, x, y, a, geometry.radius, sweep, fade, seed);
      if (rank === 4) lightning(ctx, x, y, a, 252, age - .16, seed);
      if (rank === 5) for (const offset of [-.34, 0, .34]) lightning(ctx, x, y, a + offset, 274, age - .16, seed + offset * 30);
    } else {
      const slash = rank === 7 ? swordSlashPose(cast) : { x: x + Math.cos(a) * 12, y: y + Math.sin(a) * 12, angle: a, ...geometry };
      (options.ribbon || ribbon)(ctx, slash.x, slash.y, slash.angle, slash.length, slash.width, clamp(age / .15), clamp((.68 - age) / .3), seed);
      if (rank === 7) for (let i = 0; i < 7; i++) {
        const p = point(slash.x, slash.y, slash.angle, slash.length * (.08 + .84 * i / 6));
        flameSkyLightning(ctx, p.x, p.y, age - .28 - i * .10, seed + i);
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
    const contact = .73, angle = .24, groundY = target.y + 33, accelerateUntil = .92, stopAt = 1.48;
    const depth = Number.isFinite(cast.giantStopDepth) ? cast.giantStopDepth : giantSwordGeometry.bladeLength - giantSwordGeometry.bladeWidth * Math.tan(angle) - 18 / Math.cos(angle);
    const acceleration = 2 * depth / (accelerateUntil * stopAt - contact * contact);
    const gap = acceleration * contact * contact / 2, t = Math.min(stopAt, Math.max(0, age));
    const speed = acceleration * accelerateUntil, decelerate = speed / (stopAt - accelerateUntil), after = Math.max(0, t - accelerateUntil);
    const travel = t <= accelerateUntil ? -gap + acceleration * t * t / 2 : -gap + speed * accelerateUntil / 2 + speed * after - decelerate * after * after / 2;
    const velocity = age >= stopAt ? 0 : t <= accelerateUntil ? acceleration * t : speed - decelerate * after;
    const dissolveAt = 1.9, dissolveDuration = 1.35, dissolve = clamp((age - dissolveAt) / dissolveDuration);
    return { x: target.x - Math.sin(angle) * travel, y: groundY + Math.cos(angle) * travel,
      angle, height: giantSwordGeometry.height, groundY, burial: Math.max(0, travel), travel, velocity, contact, accelerateUntil, stopAt,
      dissolve, dissolveAt, dissolveDuration, dissolveElapsed: Math.max(0, age - dissolveAt), phase: age < contact ? 'falling' : age < stopAt ? 'penetrating' : age < dissolveAt ? 'handle-hold' : 'dissolving', alpha: 1 };
  }
  function giantErosionThreshold(x, y, width, height) {
    return clamp((height - y - .5) / height + (hash(Math.floor(x / 3), Math.floor(y / 3), 73) - .5) * .022, .001, 1);
  }
  function giantVisibleErosionThreshold(worldY, groundY, topY, noise = 0) {
    if (worldY > groundY) return Infinity;
    return clamp((groundY - worldY) / Math.max(1, groundY - topY) + noise * .022, .001, 1);
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
      if (giant) giant(ctx, p.x, p.y, p.angle, p.height, p.alpha, { groundY: p.groundY, dissolve: p.dissolve, dissolveDuration: p.dissolveDuration, dissolveElapsed: p.dissolveElapsed, seed: cast.seed || 1 });
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
    if (cast.rank >= 4) { const target = targets.filter(t => t.hp == null || t.hp > 0).sort((a, b) => Math.hypot(a.x - end.x, a.y - end.y) - Math.hypot(b.x - end.x, b.y - end.y))[0]; if (target) { if (cast.rank === 7) flameSkyLightning(ctx, target.x, target.y + 25, age - .15, cast.seed); else skyLightning(ctx, target.x, target.y + 25, age - .15, cast.seed, 28, 460); } }
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
  window.CheonNamgungEffects = Object.freeze({ palette: P, giantSwordGeometry, castDuration, swordGeometry, swordCluster, swordSlashPose, attachedSwordPose, returningSwordPoses, giantSwordPose, giantErosionThreshold, giantVisibleErosionThreshold, lightningWidthAt, flameLightningBranches, flameImpactBranches, flameGroundImpact, flameSkyLightning, allocateTargets, fieldCells, draw, drawQi, field, jian, lightning, skyLightning, ring, hash, clamp });
})();

