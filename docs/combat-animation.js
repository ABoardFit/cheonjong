/* Render-only choreography: calibrated sprite, grip, blade and tip share one pose. */
(() => {
  'use strict';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, Number.isFinite(v) ? v : 0));
  const profiles = [null,
    { action: 'cleave', petals: 2, trailWidth: 8, flower: false, bloom: false },
    { action: 'sweep', petals: 4, trailWidth: 11, flower: false, bloom: false },
    { action: 'sweep', petals: 8, trailWidth: 15, flower: false, bloom: false },
    { action: 'sweep', petals: 13, trailWidth: 17, flower: true, bloom: false },
    { action: 'sweep', petals: 20, trailWidth: 20, flower: true, bloom: true },
    { action: 'sweep', petals: 28, trailWidth: 23, flower: true, bloom: true },
    { action: 'sweep', petals: 42, trailWidth: 28, flower: true, bloom: false, fused: true }
  ];
  function profileFor(rank) { return { ...profiles[clamp(Math.round(rank), 1, 7)] }; }
  function attackFor(state) {
    return (state.effects || []).filter(e => !e.enemy && (e.type === 'slash' || e.type === 'flower') && e.duration <= 0.7 && e.age < e.duration).sort((a, b) => a.age - b.age)[0] || null;
  }
  // Core contact stays authoritative. Its public timer anticipates preparation, and a retained
  // visual contact can finish its recovery after the short core effect has expired.
  function attackTimeline(state, options = {}) {
    const attack = options.attack === undefined ? attackFor(state) : options.attack;
    const rank = clamp(Math.round(attack?.rank || state.skills?.plum_sword || 1), 1, 7);
    const windup = rank === 7 ? 0.16 : 0.20, strike = physicalStrokeDuration(rank), recovery = rank >= 3 ? (rank === 7 ? 0.18 : 0.30) : 0.40;
    const age = attack ? Math.max(0, (attack.age || 0) + (options.ageOffset || 0)) : 0;
    if (attack && age < strike + recovery) {
      const phase = age < strike ? 'active' : 'recovery';
      return { phase, elapsed: age, windup, strike, recovery,
        phaseProgress: phase === 'active' ? clamp(age / strike) : clamp((age - strike) / recovery),
        trailActive: phase === 'active', attackKey: attack.id, attack, rank };
    }
    const timer = state.attackTimer;
    if ((state.skills?.plum_sword || 0) > 0 && Number.isFinite(timer) && timer > 0 && timer <= windup) {
      return { phase: 'anticipation', elapsed: -timer, windup, strike, recovery,
        phaseProgress: clamp(1 - timer / windup), trailActive: false, attackKey: null, attack: null, rank };
    }
    return { phase: 'idle', elapsed: 0, windup, strike, recovery, phaseProgress: 0, trailActive: false, attackKey: null, attack: null, rank };
  }
  function actionFrame(animation, timeline) {
    const n = Math.max(1, animation.frames || 4);
    const indices = animation.phaseIndices?.[timeline.phase] || (timeline.phase === 'active' ? animation.activeIndices : null);
    if (indices?.length) {
      return indices[Math.min(indices.length - 1, Math.floor(timeline.phaseProgress * indices.length))];
    }
    const phaseFrames = animation.phaseFrames || (n >= 8 ? { anticipation: [0, 2], active: [3, 4], recovery: [5, n - 1] } : { anticipation: [0, 1], active: [1, 2], recovery: [3, 3] });
    const range = phaseFrames[timeline.phase] || [0, 0];
    const first = clamp(range[0], 0, n - 1), last = clamp(range[1], first, n - 1);
    return Math.min(last, first + Math.floor(timeline.phaseProgress * (last - first + 1)));
  }
  function aimFor(state, timeline) {
    const p = state.player, core = window.CheonGameCore;
    if (timeline.attack) return timeline.attack.angle || 0;
    if (timeline.phase === 'anticipation') {
      // Match the core's public nearest-in-range targeting without changing its eventual hit.
      const radius = core?.getStats(state).attackRadius;
      if (Number.isFinite(radius)) {
        const center = core.getCombatCenter?.(p) || p;
        const targetCenter = e => core.getCombatCenter?.(e) || e;
        const separation = e => { const point = targetCenter(e); return Math.hypot(point.x - center.x, point.y - center.y); };
        const nearest = (state.enemies || []).filter(e => e.hp > 0 && separation(e) <= radius + e.radius)
          .sort((a, b) => separation(a) - separation(b))[0];
        if (nearest) { const point = targetCenter(nearest); return Math.atan2(point.y - center.y, point.x - center.x); }
      }
    }
    return Math.atan2(p.faceY || 0, Number.isFinite(p.faceX) ? p.faceX : 1);
  }
  const directions = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'];
  function directionFor(angle) {
    return directions[(Math.round(angle / (Math.PI / 4)) % 8 + 8) % 8];
  }
  function directionalEntry(atlas, action, direction) {
    const entries = atlas.directionalAnimations?.[action];
    const entry = entries?.[direction];
    if (!entry) return null;
    if (entry.mirrorOf) {
      const source = entries[entry.mirrorOf];
      return source && !source.mirrorOf ? { entry: source, face: -1, sourceDirection: entry.mirrorOf } : null;
    }
    return { entry, face: 1, sourceDirection: direction };
  }
  function physicalStrokeDuration(rank) { return rank >= 3 ? (rank === 7 ? .24 : .28) : .18; }
  const modulo = (value, count) => (value % count + count) % count;
  function sourceContacts(animation, frame, face, player, fallbackAtlas = {}) {
    const points = animation.contactPoints?.[frame];
    if (!points?.length) return [];
    const height = animation.frameHeight || fallbackAtlas.frameHeight || 128;
    const foot = animation.footAnchors?.[frame] || animation.foot || fallbackAtlas.foot || { x: 64, y: 118 };
    const scale = (animation.displayHeight || fallbackAtlas.displayHeight || 88) / height * (animation.frameScales?.[frame] || 1);
    return points.map(point => ({ x: player.x + (point.x - foot.x) * scale * face, y: player.y + (point.y - foot.y) * scale }));
  }
  // Select only the incoming whole-frame loop phase, once at the handoff.
  // Authored frames, their order and subsequent distance cadence stay intact.
  function walkPhaseOffsetFor(previousPose, options = {}) {
    const atlas = window.CHEON_HERO_ATLAS || {};
    const directional = options.direction ? directionalEntry(atlas, 'walk', options.direction) : null;
    const animation = directional?.entry || atlas.animations?.walk;
    const currentOffset = Number.isFinite(options.currentOffset) ? Math.round(options.currentOffset) : 0;
    if (!animation?.contactPoints || !previousPose?.contactPoints?.length) return currentOffset;
    const count = Math.max(1, animation.frames || 8), stride = atlas.walkStride || 120;
    const base = Math.floor((Number.isFinite(options.walkDistance) ? options.walkDistance : 0) / stride * count);
    const currentFrame = modulo(base + currentOffset, count), face = directional ? directional.face : options.face < 0 ? -1 : 1;
    const player = options.player || previousPose.bodyOrigin || { x: 0, y: 0 };
    const squared = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    const nearestSum = (from, to) => from.reduce((sum, point) => sum + Math.min(...to.map(other => squared(point, other))), 0) / from.length;
    let bestFrame = currentFrame, bestScore = Infinity, bestPhaseDistance = Infinity;
    for (let frame = 0; frame < count; frame++) {
      const candidate = sourceContacts(animation, frame, face, player, atlas);
      if (!candidate.length) continue;
      const score = nearestSum(previousPose.contactPoints, candidate) + nearestSum(candidate, previousPose.contactPoints)
        + Math.abs(candidate.length - previousPose.contactPoints.length) * 16;
      const phaseDistance = Math.min(modulo(frame - currentFrame, count), modulo(currentFrame - frame, count));
      if (score < bestScore - 0.001 || Math.abs(score - bestScore) <= 0.001 && phaseDistance < bestPhaseDistance) {
        bestFrame = frame; bestScore = score; bestPhaseDistance = phaseDistance;
      }
    }
    return modulo(bestFrame - base, count);
  }
  function poseFor(state, time = state.time || 0, options = {}) {
    const p = state.player, atlas = window.CHEON_HERO_ATLAS || {};
    const timeline = attackTimeline(state, options), attack = timeline.attack, rank = timeline.rank;
    const profile = profileFor(rank), attacking = timeline.phase !== 'idle';
    const dashing = (p.dashRemaining || 0) > 0;
    // Locomotion faces actual travel; an enemy-facing attack must not make the
    // independent walking cycle run backwards when the player retreats.
    const travel = !attacking && (dashing || options.moving) && Number.isFinite(options.locomotionX) && Number.isFinite(options.locomotionY)
      && Math.hypot(options.locomotionX, options.locomotionY) > 0.001;
    const aim = travel ? Math.atan2(options.locomotionY, options.locomotionX) : aimFor(state, timeline);
    const direction = directionFor(aim);
    // An authored action applies to preparation, contact and recovery alike.
    // Namgung's thrust must never borrow Hwasan's downward cleave or turn cycle.
    const authoredAction = options.action || attack?.action;
    const action = attacking ? (authoredAction || (rank >= 3 && timeline.phase === 'active' && atlas.animations?.spin ? 'spin' : profile.action)) : dashing || options.moving ? 'walk' : 'idle';
    const directional = directionalEntry(atlas, action, direction);
    const entry = directional?.entry;
    const animation = entry || atlas.animations?.[action] || { row: ['idle', 'walk', 'cleave', 'sweep'].indexOf(action), frames: 4, fps: action === 'walk' ? 10 : 6 };
    const face = animation.turnCycle ? 1 : directional ? directional.face : Math.cos(aim) < -0.05 ? -1 : 1;
    const frames = Math.max(1, animation.frames || 4);
    let frame;
    const cycleStartFrame = animation.turnCycle ? directions.indexOf(direction) : 0;
    const cycleFrameOffset = animation.turnCycle ? Math.min(frames - 1, Math.floor(timeline.phaseProgress * frames)) : 0;
    if (attacking) frame = animation.turnCycle ? (cycleStartFrame + cycleFrameOffset) % frames : actionFrame(animation, timeline);
    else if (options.reducedMotion) frame = 0;
    else if (action === 'walk' && Number.isFinite(options.walkDistance)) frame = modulo(Math.floor(options.walkDistance / (atlas.walkStride || 120) * frames) + (Number.isFinite(options.walkFrameOffset) ? Math.round(options.walkFrameOffset) : 0), frames);
    else frame = Math.floor(time * (animation.fps || 6)) % frames;
    const fw = animation.frameWidth || atlas.frameWidth || 256, fh = animation.frameHeight || atlas.frameHeight || 256;
    // The atlas fitter can shrink a raised-arm row. Measured body calibration scales the
    // image and every socket together about the same foot; it never rotates a painted wrist.
    const frameScale = animation.frameScales?.[frame] ?? (!entry ? atlas.frameScales?.[action]?.[frame] : undefined);
    const scale = (animation.displayHeight || atlas.displayHeight || 88) / fh * (Number.isFinite(frameScale) && frameScale > 0 ? frameScale : 1);
    const foot = animation.footAnchors?.[frame] || animation.foot || atlas.footAnchors?.[action]?.[frame] || atlas.foot || { x: fw * 0.5, y: fh * 0.94 };
    const handLocal = animation.handAnchors?.[frame] || atlas.handAnchors?.[action]?.[frame] || { x: fw * 0.66, y: fh * 0.56 };
    // Frames already contain the gait; an extra sine bob makes planted feet skate.
    const bob = 0;
    const hand = { x: p.x + (handLocal.x - foot.x) * scale * face, y: p.y + (handLocal.y - foot.y) * scale };
    const originLocal = animation.bladeOrigins?.[frame] || atlas.bladeOrigins?.[action]?.[frame] || { x: handLocal.x + 8, y: handLocal.y - 4 };
    const bladeOrigin = { x: p.x + (originLocal.x - foot.x) * scale * face, y: p.y + (originLocal.y - foot.y) * scale };
    const sourceBladeAngle = animation.bladeAngles?.[frame] ?? atlas.bladeAngles?.[action]?.[frame] ?? Math.atan2(originLocal.y - handLocal.y, originLocal.x - handLocal.x);
    const bladeAngle = Math.atan2(Math.sin(sourceBladeAngle), Math.cos(sourceBladeAngle) * face);
    const bladeLength = animation.bladeLengths?.[frame] ?? Math.min(56, 38 + rank * 2);
    const tipLocal = animation.tipAnchors?.[frame];
    const socketOccluded = Array.isArray(animation.socketOccluded) ? Boolean(animation.socketOccluded[frame]) : Boolean(animation.socketOccluded);
    const hasCalibratedTip = Boolean(tipLocal && Number.isFinite(tipLocal.x) && Number.isFinite(tipLocal.y));
    const tip = tipLocal ? { x: p.x + (tipLocal.x - foot.x) * scale * face, y: p.y + (tipLocal.y - foot.y) * scale } : { x: bladeOrigin.x + Math.cos(bladeAngle) * bladeLength, y: bladeOrigin.y + Math.sin(bladeAngle) * bladeLength };
    const frameRect = animation.frameLayout?.[frame] || atlas.frameLayout?.[action]?.[frame] || { x: frame * fw, y: (animation.row || 0) * fh, w: fw, h: fh };
    const activeRange = animation.phaseFrames?.active || (frames >= 8 ? [3, 4] : [1, 2]);
    const activeFrameCount = animation.turnCycle ? frames : animation.phaseIndices?.active?.length || animation.activeIndices?.length || activeRange[1] - activeRange[0] + 1;
    const pose = { action, frame, row: animation.row || 0, face, hand, bladeOrigin, tip, sourceBladeAngle, bladeAngle, bladeLength, activeFrameCount,
      imageSrc: animation.src || atlas.src, direction, sourceDirection: animation.frameDirections?.[frame] || directional?.sourceDirection || 'e',
      bakedWeapon: Boolean(animation.bakedWeapon), fullBodyGait: Boolean(animation.fullBodyGait), contactSmear: Boolean(animation.contactSmearFrames?.includes(frame)), cycleStartFrame, cycleFrameOffset,
      socketOccluded, hasCalibratedTip, tipVisible: animation.bakedWeapon ? hasCalibratedTip : !socketOccluded,
      bodyOrigin: { x: p.x, y: p.y }, contactPoints: sourceContacts(animation, frame, face, p, atlas),
      bladeBehind: Boolean(entry?.bladeBehind?.[frame] ?? atlas.bladeBehind?.[action]?.[frame]),
      phase: timeline.phase, trailActive: timeline.trailActive, timeline, strokeProgress: timeline.phase === 'active' ? timeline.phaseProgress : timeline.phase === 'recovery' ? 1 : 0,
      attackProgress: attack ? clamp(timeline.elapsed / Math.max(0.01, attack.duration || 0.52)) : 0,
      swingProgress: clamp(timeline.elapsed / timeline.strike), attack, rank, profile, scale, foot, bob,
      frameWidth: fw, frameHeight: fh, frameRect };
    return pose;
  }
  window.CheonCombatAnimation = Object.freeze({ poseFor, profileFor, attackFor, attackTimeline, actionFrame, aimFor, directionFor,
    physicalStrokeDuration, sourceContacts, walkPhaseOffsetFor });
})();
