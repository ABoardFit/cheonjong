/* DOM/Canvas에 의존하지 않는 화산 전투 코어. 수치는 game-balance.js의 검증용 값. */
(function (root) {
  'use strict';
  const B = root.CHEONJONG_BALANCE;
  if (!B) throw new Error('game-balance.js must load before game-core.js');
  const TAU = Math.PI * 2;
  const skillIds = ['plum_sword', 'zixia', 'plum_rain', 'liuhe', 'dark_fragrance', 'five_elements'];
  const fallbackNames = ['이십사수매화검법', '자하신공', '매화검우', '육합공', '암향표', '오행매화보'];
  const pairs = [['plum_sword', 'zixia', '매화만리향'], ['plum_rain', 'liuhe', '매향침골'], ['dark_fragrance', 'five_elements', '매인설한']];
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function rng(s) { let x = s.rng | 0; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; s.rng = x | 0; return (x >>> 0) / 4294967296; }
  function id(s) { return ++s.serial; }
  function vector(x, y) { const n = Math.hypot(x, y); return n > 0 ? { x: x / n, y: y / n } : { x: 1, y: 0 }; }
  // Actors retain their grounded world position for movement. Sword geometry uses
  // the visible body's centre, shared by aiming, damage, effects and rehearsal.
  function getCombatCenter(actor) {
    if (!actor.type) return { x: actor.x, y: actor.y - B.player.bodyCenterOffset };
    const scale = actor.type === 'boss' ? actor.radius / 13 : Math.max(0.9, actor.radius / 11);
    return { x: actor.x, y: actor.y - 16 * scale };
  }
  function onScreen(s, e, margin = 0) { return Math.abs(e.x - s.camera.x) <= s.width / 2 + margin && Math.abs(e.y - s.camera.y) <= s.height / 2 + margin; }
  function effect(s, type, x, y, radius, duration, extras) {
    s.effects.push(Object.assign({ id: id(s), type, x, y, radius, age: 0, duration }, extras));
    if (s.effects.length > B.limits.effects) s.effects.splice(0, s.effects.length - B.limits.effects);
  }
  function floatText(s, x, y, text, color) {
    s.damageTexts.push({ id: id(s), x, y, text: String(text), age: 0, duration: 0.65, color: color || '#fff2cc' });
    if (s.damageTexts.length > B.limits.damageTexts) s.damageTexts.shift();
  }
  function getStats(s) {
    const k = s.skills, d = B.dash, p = B.petal;
    const speedUps = Number(k.dark_fragrance >= 1) + Number(k.dark_fragrance >= 2) + Number(k.five_elements >= 1) + Number(k.five_elements >= 3);
    const rank = k.plum_sword;
    let attackRadius = B.player.attackRadius + Math.max(0, Math.min(6, rank) - 1) * B.player.attackRankRadius;
    if (rank === 3 || rank === 4) attackRadius += B.player.circleCenterCorrection;
    if (rank >= 5) attackRadius *= B.player.flowerRadiusMultiplier;
    if (rank === 7) attackRadius *= B.player.fusedRadiusMultiplier;
    const bloomRadius = attackRadius * (rank >= 5 && rank < 7 ? B.player.bloomScatterMultiplier : 1);
    return {
      maxHp: s.player.maxHp, hp: s.player.hp,
      attackSpeed: B.player.attackSpeed, attackDamage: B.player.attackDamage * (1 + Math.max(0, k.plum_sword - 1) * B.player.attackRankDamage) * (k.zixia >= 4 ? 1 + s.player.petals * p.damagePerHeld : 1),
      attackRadius, bloomRadius, fieldRadius: rank === 6 ? bloomRadius : attackRadius,
      swordSectorHalfAngle: B.player.swordSectorHalfAngle,
      maxPetals: p.baseCapacity + p.capacityPerUpgrade * (Number(k.zixia >= 2) + Number(k.liuhe >= 1) + Number(k.liuhe >= 3)),
      petalConsumption: p.baseConsumption + p.consumptionPerUpgrade * (Number(k.zixia >= 3) + Number(k.liuhe >= 4)),
      petalFlatReduction: p.flatReduction + (k.liuhe >= 2 ? p.liuheFlatBonus : 0),
      damageReduction: k.dark_fragrance >= 4 && (s.player.dashRemaining > 0 || s.time < s.player.reductionUntil) ? d.reduction : 0,
      moveSpeed: B.player.speed * (1 + speedUps * d.speedPerUpgrade),
      rainCooldown: B.rain.cooldown, dashCooldown: d.cooldown,
      dashDistance: d.distance + (k.five_elements >= 2 ? d.distanceBonus : 0),
      critChance: B.player.critChance, critMultiplier: B.player.critMultiplier,
      fieldDuration: B.field.duration, auraRadius: s.player.radius * 5,
      flowerRainDamageRadius: rank === 7 ? attackRadius : 0
    };
  }
  function createRun(options = {}) {
    const s = {
      version: 1, mode: options.mode || 'normal', rng: options.seed || 247617,
      width: options.width || 1000, height: options.height || 650, serial: 0,
      status: 'running', time: 0, level: 1, xp: 0, nextXp: B.progression.firstXp,
      kills: 0, bossSpawned: false, bossDefeated: false,
      skills: Object.fromEntries(skillIds.map(k => [k, 0])),
      enemies: [], pickups: [], fields: [], projectiles: [], effects: [], damageTexts: [], events: [],
      camera: { x: 0, y: 0 }, attackTimer: 0.35, rainTimer: 1.5,
      spawnTimer: 0.4, dotTimer: B.field.tick, choiceList: null,
      player: { x: 0, y: 0, radius: B.player.radius, hp: B.player.hp, maxHp: B.player.hp,
        petals: B.petal.start, faceX: 1, faceY: 0, dashCooldown: 0, dashRemaining: 0,
        dashX: 1, dashY: 0, dashSerial: 0, dashHitIds: [], dashDropIds: [],
        invulnerableUntil: 0, hurtUntil: 0, pickupLockedUntil: 0, reductionUntil: 0,
        trailDistance: 0 },
      metrics: { damageDealt: 0, damageTaken: 0, petalPickups: 0, pickupBursts: 0,
        armorKnockbacks: 0, landingKnockbacks: 0, dashes: 0, fusions: 0 }
    };
    s.skills.plum_sword = 1; s.skills.zixia = 1;
    return s;
  }
  // Independent, testable mitigation: fixed reduction is applied BEFORE percentage.
  function mitigateDamage(options) {
    const incoming = Math.max(0, options.damage || 0);
    const used = incoming > 0 ? Math.min(Math.max(0, options.petals || 0), Math.max(0, options.consumption == null ? 1 : options.consumption)) : 0;
    const flat = used * Math.max(0, options.flatReduction || 0);
    const damage = Math.max(0, incoming - flat) * (1 - clamp(options.percentReduction || 0, 0, 1));
    return { damage, consumed: used, flatPrevented: Math.min(incoming, flat) };
  }
  function syncAttachments(s) {
    const max = s.skills.zixia >= 5 ? s.player.petals : 0;
    const alive = s.enemies.filter(e => e.hp > 0);
    let attached = alive.filter(e => e.petalAttached).sort((a, b) => distance(a, s.player) - distance(b, s.player));
    for (let i = max; i < attached.length; i++) attached[i].petalAttached = false;
    attached = attached.slice(0, max);
    const candidates = alive.filter(e => !e.petalAttached && onScreen(s, e)).sort((a, b) => distance(a, s.player) - distance(b, s.player));
    for (const e of candidates.slice(0, Math.max(0, max - attached.length))) e.petalAttached = true;
  }
  function pickup(s, type, x, y, value = 1) {
    if (s.pickups.length >= B.limits.pickups) {
      // Coalesce XP instead of silently losing progression under the entity cap.
      if (type === 'xp') { const q = s.pickups.find(p => p.type === 'xp'); if (q) q.value += value; }
      return;
    }
    s.pickups.push({ id: id(s), type, x, y, value, bornAt: s.time, expiresAt: s.time + (type === 'petal' ? B.petal.lifetime : 120) });
  }
  function knockback(s, x, y, radius, amount, kind, visual = {}) {
    for (const e of s.enemies) {
      if (e.hp <= 0 || distance(e, { x, y }) > radius + e.radius) continue;
      const v = vector(e.x - x, e.y - y), scale = e.type === 'boss' ? 0.18 : 1;
      e.x += v.x * amount * scale; e.y += v.y * amount * scale;
      e.stunnedUntil = Math.max(e.stunnedUntil || 0, s.time + 0.16);
    }
    effect(s, 'knockback', x, y, radius, 0.32, { source: kind, color: '#f3bbd5', ...visual });
  }
  function damagePlayer(s, incoming, source) {
    if (s.status !== 'running' || s.time < s.player.invulnerableUntil || s.time < s.player.hurtUntil) return { damage: 0, consumed: 0, ignored: true };
    const st = getStats(s), p = s.player;
    const hit = mitigateDamage({ damage: incoming, petals: p.petals, consumption: st.petalConsumption, flatReduction: st.petalFlatReduction, percentReduction: st.damageReduction });
    p.petals -= hit.consumed;
    syncAttachments(s);
    p.hp = Math.max(0, p.hp - hit.damage); s.metrics.damageTaken += hit.damage;
    p.hurtUntil = s.time + B.player.hurtGrace;
    floatText(s, p.x, p.y - 20, hit.damage > 0 ? '-' + Math.ceil(hit.damage) : '방어', '#ff9c99');
    if (hit.consumed > 0) effect(s, 'burst', p.x, p.y, 42, 0.3, { color: '#f7b6df', source: 'petal_armor' });
    if (hit.consumed > 0 && s.skills.liuhe >= 5) {
      s.metrics.armorKnockbacks++;
      knockback(s, p.x, p.y, B.petal.armorKnockbackRadius, B.petal.armorKnockbackDistance, 'armor');
    }
    if (p.hp <= 0) { s.status = 'lost'; s.resultReason = source || '강호의 공세'; }
    return hit;
  }
  function damageEnemy(s, enemy, amount, source = 'sword', options = {}) {
    if (!enemy || enemy.hp <= 0) return 0;
    const direct = ['sword', 'rain', 'dash', 'landing'].includes(source);
    const crit = options.crit !== false && direct && rng(s) < B.player.critChance;
    const heldMultiplier = s.skills.zixia >= 4 ? 1 + s.player.petals * B.petal.damagePerHeld : 1;
    const dealt = Math.max(0, amount * (options.scaled ? 1 : heldMultiplier) * (crit ? B.player.critMultiplier : 1));
    enemy.hp -= dealt;
    if (direct) enemy.flashUntil = s.time + 0.1;
    s.metrics.damageDealt += dealt;
    if (options.text !== false) floatText(s, enemy.x, enemy.y - enemy.radius, Math.ceil(dealt) + (crit ? '!' : ''), crit ? '#ffe28e' : '#f6e7e9');
    if (enemy.hp > 0 && direct && enemy.petalAttached && s.skills.zixia >= 6) {
      // Explicit source separation prevents any recursive proc or unintended AoE.
      enemy.petalHitFlashFrom = s.time;
      enemy.petalHitFlashUntil = s.time + 0.24;
      effect(s, 'burst', enemy.x, enemy.y, 24, 0.25, { color: '#f8a6cf', source: 'attached_bonus', targetId: enemy.id });
      damageEnemy(s, enemy, B.petal.extraHitDamage, 'attached_bonus', { crit: false, text: false });
    }
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true; enemy.petalAttached = false; s.kills++;
      pickup(s, 'xp', enemy.x, enemy.y, enemy.type === 'boss' ? 30 : enemy.type === 'melee' ? B.enemy.xp : B.enemy.rangedXp);
      if (s.skills.zixia >= 1) pickup(s, 'petal', enemy.x + 7, enemy.y + 5);
      effect(s, 'burst', enemy.x, enemy.y, enemy.radius + 8, 0.22, { color: enemy.type === 'boss' ? '#fcdd9e' : '#947b8b', source: 'death' });
      if (enemy.type === 'boss') { s.bossDefeated = true; s.status = 'won'; s.resultReason = '매화곡의 주인 격파'; }
    }
    return dealt;
  }
  function radialDamage(s, x, y, radius, amount, source, options) {
    for (const e of s.enemies) if (e.hp > 0 && distance(options?.bodyCentered ? getCombatCenter(e) : e, { x, y }) <= radius + e.radius) damageEnemy(s, e, amount, source, options);
  }
  function pickupPetal(s, amount = 1) {
    const p = s.player, capacity = getStats(s).maxPetals;
    if (s.time < p.pickupLockedUntil || p.petals >= capacity || amount <= 0) return 0;
    const gained = Math.min(Math.floor(amount), capacity - p.petals);
    if (gained <= 0) return 0;
    p.petals += gained; s.metrics.petalPickups += gained;
    syncAttachments(s);
    if (s.skills.liuhe >= 6) {
      for (let i = 0; i < gained; i++) {
        s.metrics.pickupBursts++;
        effect(s, 'burst', p.x, p.y, B.petal.pickupBurstRadius, 0.33, { color: '#f69fd0', source: 'pickup' });
        radialDamage(s, p.x, p.y, B.petal.pickupBurstRadius, B.petal.pickupBurstDamage, 'pickup_burst');
      }
    }
    return gained;
  }
  function addField(s, field) {
    const f = Object.assign({ id: id(s), skillId: 'plum_sword', x: 0, y: 0, radius: 50, expiresAt: s.time + B.field.duration, bornAt: s.time }, field);
    // Same skill overlaps are resolved once per enemy/tick, not per field.
    s.fields.push(f);
    if (s.fields.length > B.limits.fields) s.fields.shift();
    return f;
  }
  function schedule(s, delay, type, details) {
    if (s.events.length < B.limits.events) s.events.push(Object.assign({ at: s.time + delay, type }, details));
  }
  function swordAttack(s) {
    const rank = s.skills.plum_sword; if (!rank) return;
    const p = s.player, st = getStats(s), radius = st.attackRadius, center = getCombatCenter(p);
    const targets = s.enemies.filter(e => e.hp > 0 && distance(getCombatCenter(e), center) <= radius + e.radius)
      .sort((a, b) => distance(getCombatCenter(a), center) - distance(getCombatCenter(b), center));
    const nearest = targets[0];
    if (nearest) { const targetCenter = getCombatCenter(nearest); const v = vector(targetCenter.x - center.x, targetCenter.y - center.y); p.faceX = v.x; p.faceY = v.y; }
    const angle = Math.atan2(p.faceY, p.faceX);
    effect(s, rank >= 4 ? 'flower' : 'slash', center.x, center.y, radius, rank >= 5 ? 0.7 : 0.35,
      { angle, rank, bodyCentered: true, bloomRadius: st.bloomRadius, sectorHalfAngle: st.swordSectorHalfAngle,
        color: s.skills.zixia >= 4 ? '#bd91ee' : '#ffc0d7', fused: rank === 7 });
    const base = st.attackDamage;
    for (const e of targets) {
      if (rank === 1 && e !== nearest) continue;
      const targetCenter = getCombatCenter(e), v = vector(targetCenter.x - center.x, targetCenter.y - center.y);
      if (rank === 2 && v.x * p.faceX + v.y * p.faceY < Math.cos(st.swordSectorHalfAngle) - 1e-10) continue;
      damageEnemy(s, e, base * (rank === 7 ? 1.8 : 1), 'sword', { scaled: true });
    }
    if (rank >= 5 && rank < 7) schedule(s, B.player.bloomDelay, 'sword_bloom',
      { x: center.x, y: center.y, radius: st.bloomRadius, flowerRadius: radius, rank, damage: base * 0.8, field: rank >= 6 });
    if (rank === 7) addField(s, { skillId: 'plum_sword', x: center.x, y: center.y, radius: st.fieldRadius, damage: B.field.swordDamage, bodyCentered: true });
  }
  function rainAttack(s) {
    const rank = s.skills.plum_rain; if (!rank) return;
    const targets = s.enemies.filter(e => !e.dead && e.hp > 0 && onScreen(s, e))
      .sort((a, b) => distance(a, s.player) - distance(b, s.player));
    if (!targets.length) return;
    const count = Math.min(B.rain.counts[rank], targets.length);
    for (let i = 0; i < count; i++) {
      const kind = rank === 7 ? (rng(s) < 0.5 ? 'sword' : 'petal') : rank < 5 ? 'sword' : 'petal';
      // Each enemy receives at most one projectile. Swords prefer a remaining
      // ranged enemy; a petal chooses the nearest remaining eligible enemy.
      const ranged = kind === 'sword' && rank === 7 ? targets.findIndex(e => e.type === 'ranged') : -1;
      const target = targets.splice(ranged >= 0 ? ranged : 0, 1)[0];
      const visual = getCombatCenter(target);
      const delay = rank === 4 ? 0 : i * B.rain.sequentialDelay;
      const strike = { x: target.x, y: target.y, visualX: visual.x, visualY: visual.y, targetId: target.id, rank, kind };
      schedule(s, delay, 'rain_visual', strike);
      schedule(s, delay + 0.3, 'rain_hit', strike);
    }
  }
  function dashDrop(s, enemy) {
    if (s.skills.five_elements < 6 || s.player.dashDropIds.includes(enemy.id)) return;
    s.player.dashDropIds.push(enemy.id); pickup(s, 'petal', enemy.x, enemy.y);
  }
  function landing(s) {
    const p = s.player;
    const visual = { dashSerial: p.dashSerial, landedAt: s.time,
      activeRank: s.skills.dark_fragrance, partnerRank: s.skills.five_elements,
      hasLandingDamage: s.skills.dark_fragrance >= 3 };
    // Both skills modify this same dodge. One presentation event belongs to
    // its actual landing point, regardless of which skill enabled the wave.
    if (s.skills.dark_fragrance >= 3 || s.skills.five_elements >= 1) {
      effect(s, 'burst', p.x, p.y, B.dash.landingRadius, 0.42,
        { color: '#f9a3cc', source: 'landing', ...visual });
    }
    if (s.skills.dark_fragrance >= 3) {
      for (const e of s.enemies) if (e.hp > 0 && distance(e, p) <= B.dash.landingRadius + e.radius) {
        damageEnemy(s, e, B.dash.landingDamage, 'landing'); dashDrop(s, e);
      }
    }
    // Damage above is resolved before this separate landing knockback.
    if (s.skills.five_elements >= 5) {
      s.metrics.landingKnockbacks++;
      knockback(s, p.x, p.y, B.dash.landingRadius, B.dash.knockbackDistance, 'landing', visual);
    }
    p.reductionUntil = s.time + B.dash.reductionAfter;
  }
  function startDash(s, input) {
    const p = s.player; if (p.dashCooldown > 0 || p.dashRemaining > 0) return false;
    const fused = s.skills.dark_fragrance === 7 && s.skills.five_elements === 7;
    if (fused && p.petals < 1) { floatText(s, p.x, p.y - 26, '꽃잎 필요', '#efb6d4'); return false; }
    const moving = Math.hypot(input.moveX || 0, input.moveY || 0) > 0;
    const v = moving ? vector(input.moveX || 0, input.moveY || 0) : vector(p.faceX, p.faceY);
    p.dashX = v.x; p.dashY = v.y; p.faceX = v.x; p.faceY = v.y;
    p.dashCooldown = B.dash.cooldown; p.dashRemaining = B.dash.duration;
    p.dashHitIds = []; p.dashDropIds = []; p.dashSerial++;
    s.metrics.dashes++;
    if (fused) {
      // A cost event never passes through the armor damage/knockback handler.
      p.petals = 0; syncAttachments(s);
      p.invulnerableUntil = s.time + B.dash.invulnerability;
      p.pickupLockedUntil = s.time + B.dash.pickupLock;
      effect(s, 'aura', p.x, p.y, 60, 0.3, { color: '#fce1f3' });
    }
    effect(s, 'dash', p.x, p.y, 24, B.dash.duration + 0.15,
      { angle: Math.atan2(v.y, v.x), color: '#e0a5d8', source: 'dash_start', phase: 'travel', dashSerial: p.dashSerial });
    return true;
  }
  function spawnEnemy(s, type) {
    const a = rng(s) * TAU;
    // Spawn outside the visible rectangle, using a ray intersection with its edge.
    const c = Math.cos(a), sn = Math.sin(a), halfW = s.width / 2 + 45, halfH = s.height / 2 + 45;
    const r = Math.min(halfW / Math.max(0.01, Math.abs(c)), halfH / Math.max(0.01, Math.abs(sn)));
    const hp = type === 'boss' ? B.progression.bossHp : (B.enemy.hp + s.time * B.enemy.hpPerSecond) * (type === 'charger' ? 1.5 : type === 'ranged' ? 0.8 : 1);
    const e = { id: id(s), type, x: s.player.x + c * r, y: s.player.y + sn * r,
      radius: type === 'boss' ? 30 : type === 'charger' ? 16 : 12, hp, maxHp: hp,
      petalAttached: false, flashUntil: 0, petalHitFlashFrom: 0, petalHitFlashUntil: 0,
      stunnedUntil: 0, attackTimer: 1 + rng(s),
      chargeTimer: 2 + rng(s), charging: 0, chargeX: 0, chargeY: 0, phase: 0 };
    s.enemies.push(e);
    return e;
  }
  function bossAttack(s, e) {
    const phase = e.phase++ % 3, p = s.player;
    if (phase === 0) {
      effect(s, 'telegraph', e.x, e.y, 180, 0.95, { pattern: 'circle', color: '#ec6767' });
      schedule(s, 0.95, 'boss_area', { x: e.x, y: e.y, radius: 180 });
    } else if (phase === 1) {
      const angle = Math.atan2(p.y - e.y, p.x - e.x);
      effect(s, 'telegraph', e.x, e.y, 32, 0.85, { pattern: 'line', angle, length: 540, color: '#ec6767' });
      schedule(s, 0.85, 'boss_line', { x: e.x, y: e.y, angle, length: 540, radius: 32 });
    } else {
      for (let i = 0; i < 3; i++) {
        const x = p.x + (i - 1) * 92, y = p.y + (i % 2 ? -45 : 45);
        effect(s, 'telegraph', x, y, 64, 1.1, { pattern: 'circle', color: '#ec6767' });
        schedule(s, 1.1, 'boss_area', { x, y, radius: 64 });
      }
    }
  }
  function processEvent(s, ev) {
    if (ev.type === 'sword_bloom') {
      effect(s, 'burst', ev.x, ev.y, ev.radius, 0.55, { color: '#f9b0da', source: 'bloom', bodyCentered: true, flowerRadius: ev.flowerRadius, rank: ev.rank });
      radialDamage(s, ev.x, ev.y, ev.radius, ev.damage, 'sword', { scaled: true, bodyCentered: true });
      if (ev.field) addField(s, { skillId: 'plum_sword', x: ev.x, y: ev.y, radius: ev.radius, damage: B.field.swordDamage, bodyCentered: true });
    } else if (ev.type === 'rain_visual') {
      const target = s.enemies.find(e => e.id === ev.targetId && e.hp > 0);
      const center = target ? getCombatCenter(target) : { x: ev.visualX ?? ev.x, y: ev.visualY ?? ev.y };
      const kind = ev.kind || (ev.rank < 5 ? 'sword' : 'petal');
      effect(s, 'rain', center.x, center.y, B.rain.radius, 0.3, { rank: ev.rank, kind, targetId: ev.targetId,
        groundX: target ? target.x : ev.x, groundY: target ? target.y : ev.y,
        bodyCentered: true, color: kind === 'petal' ? '#f1a5cb' : '#d0b2f7', sword: kind === 'sword' });
    } else if (ev.type === 'rain_hit') {
      const target = s.enemies.find(e => e.id === ev.targetId && e.hp > 0);
      const x = target ? target.x : ev.x, y = target ? target.y : ev.y;
      const visual = target ? getCombatCenter(target) : { x: ev.visualX ?? ev.x, y: ev.visualY ?? ev.y };
      const kind = ev.kind || (ev.rank < 5 ? 'sword' : 'petal');
      effect(s, 'burst', visual.x, visual.y, B.rain.radius, 0.25, { color: '#f1b4d6', source: 'rain', kind,
        targetId: ev.targetId, groundX: x, groundY: y, bodyCentered: true });
      radialDamage(s, x, y, B.rain.radius, B.rain.damage * (ev.rank === 7 ? 1.65 : 1), 'rain');
      if (kind === 'petal') pickup(s, 'petal', x, y);
      if (ev.rank >= 6) addField(s, { skillId: 'plum_rain', x, y, radius: 35, damage: B.field.rainDamage });
    } else if (ev.type === 'boss_area') {
      effect(s, 'burst', ev.x, ev.y, ev.radius, 0.4, { color: '#d94f60', enemy: true });
      if (distance(s.player, ev) <= ev.radius + s.player.radius) damagePlayer(s, B.progression.bossDamage, '보스의 혈기 폭발');
    } else if (ev.type === 'boss_line') {
      const dx = s.player.x - ev.x, dy = s.player.y - ev.y;
      const forward = dx * Math.cos(ev.angle) + dy * Math.sin(ev.angle);
      const side = Math.abs(-dx * Math.sin(ev.angle) + dy * Math.cos(ev.angle));
      effect(s, 'slash', ev.x, ev.y, ev.length, 0.35, { angle: ev.angle, enemy: true, color: '#ed6565' });
      if (forward >= 0 && forward <= ev.length && side <= ev.radius + s.player.radius) damagePlayer(s, B.progression.bossDamage, '보스의 일섬');
    } else if (ev.type === 'charger_start') {
      const e = s.enemies.find(q => q.id === ev.enemyId && q.hp > 0);
      if (e) { e.charging = 0.65; e.chargeX = ev.dx; e.chargeY = ev.dy; }
    }
  }
  function fieldTick(s) {
    if (s.status !== 'running' || s.player.hp <= 0) return;
    const rainRadius = getStats(s).flowerRainDamageRadius;
    const rainCenter = rainRadius > 0 ? getCombatCenter(s.player) : null;
    for (const e of s.enemies) {
      if (e.hp <= 0) continue;
      const perSkill = new Map();
      for (const f of s.fields) {
        if (f.expiresAt <= s.time || distance(f.bodyCentered ? getCombatCenter(e) : e, f) > f.radius + e.radius) continue;
        perSkill.set(f.skillId, Math.max(perSkill.get(f.skillId) || 0, f.damage || B.field.swordDamage));
      }
      // Falling petals cover the viewport visually; only the player's current
      // large-flower circle deals damage. Share the sword lineage's one tick
      // with inherited stationary fields instead of creating moving fields.
      if (rainCenter && distance(getCombatCenter(e), rainCenter) <= rainRadius) {
        perSkill.set('plum_sword', Math.max(perSkill.get('plum_sword') || 0, B.field.swordDamage));
      }
      for (const damage of perSkill.values()) damageEnemy(s, e, damage, 'field', { crit: false, text: rng(s) < 0.2 });
      if (e.hp > 0 && e.petalAttached) damageEnemy(s, e, B.petal.attachedDamage * B.field.tick, 'attachment', { crit: false, text: false });
    }
  }
  function skillData(skillId) { return root.CHEONJONG_DATA?.schools?.hwasan?.skills?.find(k => k.id === skillId); }
  function getChoices(s) {
    if (s.status !== 'levelup') return [];
    if (s.choiceList) return s.choiceList;
    const available = skillIds.filter(k => s.skills[k] < 6);
    const choices = [];
    for (const [a, b, title] of pairs) if (s.skills[a] === 6 && s.skills[b] === 6) choices.push({ id: 'fusion:' + a, type: 'fusion', title, description: '두 무공의 모든 성장을 계승하고 절세신공을 완성합니다.', skillId: a, partnerId: b, rank: 7 });
    // Offer the existing path and its partner, then rotate a third branch.
    const order = available.slice().sort((a, b) => {
      const pa = pairs.find(p => p.includes(a)), pb = pairs.find(p => p.includes(b));
      const priority = (key, pair) => (s.skills[key] > 0 ? 3 : 0) + (pair && s.skills[pair[0] === key ? pair[1] : pair[0]] >= 3 ? 2 : 0);
      return priority(b, pb) - priority(a, pa) || skillIds.indexOf(a) - skillIds.indexOf(b);
    });
    const chosen = [];
    if (order.length) chosen.push(order[0]);
    if (order.length > 1) chosen.push(order[1]);
    const rest = order.filter(k => !chosen.includes(k));
    if (rest.length) chosen.push(rest[(s.level - 2 + rest.length) % rest.length]);
    // Once a fusion is offered, keep one exploration slot and one existing path.
    for (const key of chosen) {
      if (choices.length >= 3) break;
      const rank = s.skills[key] + 1, data = skillData(key), stage = data?.levels?.find(l => l.rank === rank);
      choices.push({ id: 'upgrade:' + key, type: 'upgrade', skillId: key, rank,
        title: (data?.name || fallbackNames[skillIds.indexOf(key)]) + ' · ' + rank + (data?.type === '심법' || key === 'five_elements' ? '성' : '단계'),
        formTitle: stage?.title || '', description: stage?.description || '이 무공의 이전 효과를 유지하며 다음 단계를 습득합니다.' });
    }
    if (!choices.length) choices.push({ id: 'heal', type: 'heal', title: '운기조식', description: '체력을 45 회복합니다.' });
    s.choiceList = choices;
    return choices;
  }
  function checkLevel(s) {
    if (s.status !== 'running' || s.xp < s.nextXp) return;
    s.xp -= s.nextXp; s.level++;
    s.nextXp = B.progression.firstXp + (s.level - 1) * B.progression.xpPerLevel;
    s.status = 'levelup'; s.choiceList = null; getChoices(s);
  }
  function choose(s, choiceId) {
    if (s.status !== 'levelup') return false;
    const choice = getChoices(s).find(c => c.id === choiceId);
    if (!choice) return false;
    if (choice.type === 'upgrade') {
      s.skills[choice.skillId] = choice.rank;
      effect(s, 'aura', s.player.x, s.player.y, 70, 0.6, { color: '#dec0f0' });
    } else if (choice.type === 'fusion') {
      s.skills[choice.skillId] = 7; s.skills[choice.partnerId] = 7; s.metrics.fusions++;
      floatText(s, s.player.x, s.player.y - 40, choice.title, '#ffe6a7');
      effect(s, 'flower', s.player.x, s.player.y, 160, 1.1, { rank: 7, fused: true, color: '#f5acd5' });
    } else s.player.hp = Math.min(s.player.maxHp, s.player.hp + 45);
    s.player.hp = Math.min(s.player.maxHp, s.player.hp + 3);
    s.status = 'running'; s.choiceList = null; syncAttachments(s); checkLevel(s);
    return true;
  }
  function step(s, dt, input = {}) {
    if (s.status !== 'running') return s;
    const amount = clamp(Number(dt) || 0, 0, 0.25);
    // Small internal steps prevent dash tunnelling and keep headless simulations useful.
    let left = amount, first = true;
    while (left > 0.000001 && s.status === 'running') {
      const slice = Math.min(left, 1 / 60);
      tick(s, slice, Object.assign({}, input, { dash: first && !!input.dash }));
      left -= slice; first = false;
    }
    return s;
  }
  function tick(s, dt, input) {
    s.time += dt;
    const p = s.player, st = getStats(s);
    const previousX = p.x, previousY = p.y;
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    if (input.dash) startDash(s, input);
    if (p.dashRemaining > 0) {
      const travelDt = Math.min(dt, p.dashRemaining), travel = st.dashDistance / B.dash.duration * travelDt;
      p.x += p.dashX * travel; p.y += p.dashY * travel;
      if (s.skills.five_elements >= 4) for (const e of s.enemies) {
        if (e.hp <= 0 || p.dashHitIds.includes(e.id) || distance(e, p) > e.radius + p.radius + 10) continue;
        p.dashHitIds.push(e.id); damageEnemy(s, e, B.dash.rushDamage, 'dash'); dashDrop(s, e);
      }
      p.dashRemaining = Math.max(0, p.dashRemaining - dt);
      if (!p.dashRemaining) landing(s);
    } else {
      const mx = Number(input.moveX) || 0, my = Number(input.moveY) || 0, length = Math.hypot(mx, my);
      if (length > 0) { p.faceX = mx / length; p.faceY = my / length; p.x += mx / Math.max(1, length) * st.moveSpeed * dt; p.y += my / Math.max(1, length) * st.moveSpeed * dt; }
    }
    // Ordinary movement and 경공 share one distance-spaced trail source.
    // Interpolation preserves spacing across different frame rates and dash speeds.
    const moved = Math.hypot(p.x - previousX, p.y - previousY);
    if (s.skills.dark_fragrance >= 5 && moved > 0) {
      const spacing = B.dash.trailSpacing, carried = p.trailDistance;
      for (let at = spacing - carried; at <= moved; at += spacing) {
        const fraction = at / moved;
        addField(s, { skillId: 'dark_fragrance',
          x: previousX + (p.x - previousX) * fraction,
          y: previousY + (p.y - previousY) * fraction,
          radius: s.skills.dark_fragrance >= 6 ? B.field.wideTrailRadius : B.field.trailRadius,
          damage: B.field.trailDamage });
      }
      p.trailDistance = (carried + moved) % spacing;
    }
    s.camera.x = p.x; s.camera.y = p.y;
    p.hp = Math.min(p.maxHp, p.hp + B.player.regeneration * dt);
    s.attackTimer -= dt;
    if (s.attackTimer <= 0) { s.attackTimer += 1 / st.attackSpeed; swordAttack(s); }
    s.rainTimer -= dt;
    if (s.rainTimer <= 0) { s.rainTimer += B.rain.cooldown; rainAttack(s); }
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      s.spawnTimer += B.enemy.spawnStart + (B.enemy.spawnEnd - B.enemy.spawnStart) * clamp(s.time / B.progression.bossAt, 0, 1);
      if (s.enemies.filter(e => e.hp > 0).length < B.enemy.maximum) {
        const r = rng(s), type = s.time > 45 && r < 0.16 ? 'charger' : s.time > 24 && r < 0.31 ? 'ranged' : 'melee';
        spawnEnemy(s, type);
      }
    }
    if (!s.bossSpawned && s.time >= B.progression.bossAt) {
      s.bossSpawned = true; spawnEnemy(s, 'boss');
      floatText(s, p.x, p.y - 90, '매화곡의 주인 · 혈영객', '#ffc399');
    }
    for (const e of s.enemies) {
      if (e.hp <= 0) continue;
      const v = vector(p.x - e.x, p.y - e.y), dist = distance(p, e);
      let speed = (B.enemy.speed + s.time * B.enemy.speedPerSecond) * (e.type === 'boss' ? 0.7 : e.type === 'charger' ? 0.8 : 1);
      if (e.type === 'ranged' && dist < 230) speed = dist < 155 ? -speed * 0.55 : 0;
      if (e.charging > 0) { e.charging -= dt; e.x += e.chargeX * 340 * dt; e.y += e.chargeY * 340 * dt; }
      else if (s.time >= e.stunnedUntil) { e.x += v.x * speed * dt; e.y += v.y * speed * dt; }
      if (e.type === 'charger' && e.charging <= 0) {
        e.chargeTimer -= dt;
        if (e.chargeTimer <= 0 && dist < 430) {
          e.chargeTimer = 4; e.stunnedUntil = s.time + 0.65;
          effect(s, 'telegraph', e.x, e.y, 18, 0.65, { pattern: 'line', angle: Math.atan2(v.y, v.x), length: 230, color: '#ea9a65' });
          schedule(s, 0.65, 'charger_start', { enemyId: e.id, dx: v.x, dy: v.y });
        }
      }
      e.attackTimer -= dt;
      if (e.type === 'ranged' && e.attackTimer <= 0 && dist < Math.max(s.width, s.height) * 0.7) {
        e.attackTimer = 2.7;
        if (s.projectiles.length < B.limits.projectiles) s.projectiles.push({ id: id(s), x: e.x, y: e.y, vx: v.x * B.enemy.projectileSpeed, vy: v.y * B.enemy.projectileSpeed, radius: 5, enemy: true, expiresAt: s.time + 6 });
      }
      if (e.type === 'boss' && e.attackTimer <= 0) { e.attackTimer = 3.2; bossAttack(s, e); }
      if (dist < e.radius + p.radius) damagePlayer(s, e.type === 'boss' ? B.progression.bossDamage : B.enemy.contactDamage, '강호 무인의 공격');
      // Prevent ordinary mobs walking forever offscreen from exhausting the cap.
      if (e.type !== 'boss' && distance(e, p) > Math.max(s.width, s.height) * 1.4) {
        const a = rng(s) * TAU, r = Math.max(s.width, s.height) * 0.62;
        e.x = p.x + Math.cos(a) * r; e.y = p.y + Math.sin(a) * r;
      }
    }
    for (const q of s.projectiles) {
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (!q.dead && distance(q, p) <= q.radius + p.radius) { damagePlayer(s, B.enemy.rangedDamage, '비도'); q.dead = true; }
    }
    const due = s.events.filter(e => e.at <= s.time); s.events = s.events.filter(e => e.at > s.time);
    for (const ev of due) { if (s.status !== 'running') break; processEvent(s, ev); }
    syncAttachments(s);
    s.dotTimer -= dt;
    if (s.dotTimer <= 0 && s.status === 'running') { s.dotTimer += B.field.tick; fieldTick(s); }
    // Snapshot ensures newly generated pickup-burst drops cannot recurse this tick.
    const existingPickups = s.pickups.slice();
    for (const q of existingPickups) {
      if (q.dead || q.expiresAt <= s.time) continue;
      const dist = distance(q, p);
      if (q.type === 'xp' && dist < B.player.xpMagnetRadius) {
        const v = vector(p.x - q.x, p.y - q.y); q.x += v.x * Math.min(dist, 420 * dt); q.y += v.y * Math.min(dist, 420 * dt);
      }
      if (distance(q, p) < B.player.pickupRadius) {
        if (q.type === 'xp') { s.xp += q.value; q.dead = true; }
        else if (pickupPetal(s, q.value) > 0) q.dead = true;
      }
    }
    s.enemies = s.enemies.filter(e => !e.dead && e.hp > 0);
    s.pickups = s.pickups.filter(q => !q.dead && q.expiresAt > s.time);
    s.projectiles = s.projectiles.filter(q => !q.dead && q.expiresAt > s.time);
    s.fields = s.fields.filter(f => f.expiresAt > s.time);
    for (const f of s.effects) f.age += dt;
    s.effects = s.effects.filter(f => f.age < f.duration);
    for (const t of s.damageTexts) t.age += dt;
    s.damageTexts = s.damageTexts.filter(t => t.age < t.duration);
    checkLevel(s);
    if (s.time >= B.progression.maxTime && s.status === 'running') { s.status = 'lost'; s.resultReason = '해 뜨기 전 혈영객을 쓰러뜨리지 못했습니다.'; }
  }
  root.CheonGameCore = { createRun, step, getChoices, choose, getStats, getCombatCenter,
    mitigateDamage, pickupPetal, damagePlayer, damageEnemy, addField,
    syncAttachments, startDash, spawnEnemy, fieldTick, skillIds, balance: B };
})(typeof window !== 'undefined' ? window : globalThis);
