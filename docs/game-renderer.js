/* Canvas presentation for the playable Hwasan trial. Combat authority stays in game-core.js. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const isBloomBurst = effect => effect.type === 'burst' && effect.source === 'bloom';
  const PINK = '#f5aac4', PLUM = '#d86197', PURPLE = '#b79aec';
  const INK = { outline: '#6e294a', body: '#b4577b', highlight: '#d181a0', dry: '#8f3b60' };
  // Internal paint guides in the approved 64px artwork coordinate system.
  // They never replace or deform the five original whole-petal alpha masks.
  const PLUM_FACES = [
    { blade: [[27,22.5],[30.5,24],[34,26.5],[37,30.5],[37.5,35],[36.5,39]] },
    { blade: [[50,27],[50.5,32],[48.5,37],[45,40.5],[41.5,42.5],[37,42.5]] },
    { blade: [[32.5,44],[34.5,48],[38.5,51],[43,52.5],[48,53],[53,52]] },
    { blade: [[30.5,40.5],[27,43.5],[25,47.5],[24.5,52],[26,56],[28.5,58.5]] },
    { blade: [[32,37],[29,34],[25,32.5],[21,33.5],[18,36],[16,40]] }
  ];
  const PAINTED_INNER_GUIDES = [[[645.5,612.5],[683.5,560.5],[699.5,495.5],[697.5,426.5],[675.5,360.5],[642.5,303.5],[580.5,263.5],[544.5,208.5]],[[616.5,646.5],[690.5,673.5],[780.5,658.5],[868.5,617.5],[936.5,560.5],[984.5,495.5],[1010.5,446.5],[1033.5,418.5]],[[565.5,668.5],[586.5,723.5],[633.5,779.5],[699.5,836.5],[759.5,883.5],[822.5,921.5],[889.5,944.5],[933.5,912.5]],[[581.5,595.5],[528.5,620.5],[477.5,677.5],[433.5,747.5],[411.5,824.5],[410.5,901.5],[420.5,975.5],[448.5,1039.5]],[[623.5,586.5],[573.5,537.5],[514.5,498.5],[443.5,475.5],[360.5,480.5],[290.5,499.5],[231.5,537.5],[197.5,577.5]]];
  const DAMAGE_DIGITS = {
    '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'],
    '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
    '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
    '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
    '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'],
    '!': ['010', '010', '010', '000', '010'], '+': ['000', '010', '111', '010', '000'],
    '-': ['000', '000', '111', '000', '000'], '.': ['000', '000', '000', '000', '010']
  };
  const finite = (n, fallback = 0) => Number.isFinite(n) ? n : fallback;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, finite(n)));
  const noise = (x, y, seed = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };

  const pointDistance = (p, a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1));
    return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
  };
  function simplifyLine(points, tolerance) {
    if (points.length <= 2) return points;
    let distance = 0, split = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const next = pointDistance(points[i], points[0], points.at(-1));
      if (next > distance) { distance = next; split = i; }
    }
    if (distance <= tolerance) return [points[0], points.at(-1)];
    return [...simplifyLine(points.slice(0, split + 1), tolerance).slice(0, -1), ...simplifyLine(points.slice(split), tolerance)];
  }
  function paletteContours(indices, size, threshold) {
    const edges = new Map(), inside = (x, y) => x >= 0 && y >= 0 && x < size && y < size && indices[y * size + x] >= threshold;
    const add = (x, y, xx, yy) => {
      const key = y * (size + 1) + x;
      if (!edges.has(key)) edges.set(key, []);
      edges.get(key).push({ x: xx, y: yy });
    };
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (inside(x, y)) {
      if (!inside(x, y - 1)) add(x, y, x + 1, y);
      if (!inside(x + 1, y)) add(x + 1, y, x + 1, y + 1);
      if (!inside(x, y + 1)) add(x + 1, y + 1, x, y + 1);
      if (!inside(x - 1, y)) add(x, y + 1, x, y);
    }
    const loops = [];
    while (edges.size) {
      const first = edges.keys().next().value, start = { x: first % (size + 1), y: Math.floor(first / (size + 1)) };
      const points = [start]; let point = start;
      for (let guard = 0; guard < size * size * 8; guard++) {
        const key = point.y * (size + 1) + point.x, outgoing = edges.get(key);
        if (!outgoing?.length) break;
        point = outgoing.pop(); if (!outgoing.length) edges.delete(key);
        if (point.x === start.x && point.y === start.y) break;
        points.push(point);
      }
      if (points.length < 3) continue;
      let farthest = 1;
      for (let i = 2; i < points.length; i++) if (Math.hypot(points[i].x - start.x, points[i].y - start.y) >
        Math.hypot(points[farthest].x - start.x, points[farthest].y - start.y)) farthest = i;
      const coarse = [...simplifyLine(points.slice(0, farthest + 1), 0.65).slice(0, -1),
        ...simplifyLine([...points.slice(farthest), start], 0.65).slice(0, -1)];
      const smooth = [];
      for (let i = 0; i < coarse.length; i++) {
        const a = coarse[(i + coarse.length - 1) % coarse.length], b = coarse[i], c = coarse[(i + 1) % coarse.length];
        const from = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, to = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
        const steps = Math.max(2, Math.ceil((Math.hypot(b.x - from.x, b.y - from.y) + Math.hypot(to.x - b.x, to.y - b.y)) * 2));
        for (let j = 0; j < steps; j++) {
          const t = j / steps, u = 1 - t;
          smooth.push({ x: u * u * from.x + 2 * u * t * b.x + t * t * to.x,
            y: u * u * from.y + 2 * u * t * b.y + t * t * to.y });
        }
      }
      if (smooth.length >= 3) loops.push(smooth);
    }
    return loops;
  }
  function fillPaletteContours(data, width, height, scale, loops, rgb) {
    const rows = Array.from({ length: height }, () => []);
    for (const loop of loops) for (let i = 0; i < loop.length; i++) {
      const a = loop[i], b = loop[(i + 1) % loop.length]; if (a.y === b.y) continue;
      const first = Math.max(0, Math.ceil(Math.min(a.y, b.y) * scale - 0.5));
      const last = Math.min(height - 1, Math.ceil(Math.max(a.y, b.y) * scale - 0.5) - 1);
      for (let row = first; row <= last; row++) {
        const y = (row + 0.5) / scale;
        rows[row].push((a.x + (y - a.y) * (b.x - a.x) / (b.y - a.y)) * scale);
      }
    }
    for (let y = 0; y < height; y++) {
      const intersections = rows[y].sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const left = Math.max(0, Math.ceil(intersections[i] - 0.5)), right = Math.min(width - 1, Math.ceil(intersections[i + 1] - 0.5) - 1);
        for (let x = left; x <= right; x++) {
          const at = (y * width + x) * 4;
          data[at] = rgb[0]; data[at + 1] = rgb[1]; data[at + 2] = rgb[2]; data[at + 3] = 255;
        }
      }
    }
  }

  class CheonGameRenderer {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.displayCtx = canvas.getContext('2d', { alpha: false });
      this.worldCanvas = document.createElement('canvas');
      this.ctx = this.worldCanvas.getContext('2d', { alpha: false });
      this.pixelSize = 2;
      if (!this.ctx || !this.displayCtx) throw new Error('Canvas 2D is unavailable.');
      this.width = 960;
      this.height = 600;
      this.dpr = Math.min(2, finite(window.devicePixelRatio, 1));
      this.hero = new Image();
      this.hero.src = options.heroSrc || 'assets/hero.png';
      this.heroAtlas = new Image();
      this.heroAtlas.src = window.CHEON_HERO_ATLAS?.src || 'assets/hero-atlas.png';
      this.heroImages = new Map();
      this.lastHeroSourceFrame = null;
      this.lastRenderedHeroPose = null;
      this.preloadHeroImages();
      this.bloomAtlas = new Image();
      this.bloomAtlas.src = window.CHEON_HERO_ATLAS?.effects?.bloomAtlas?.src || 'assets/plum-bloom-pixel-v1.png';
      this.tile = this.makeTile();
      this.spriteCache = new Map();
      this.lastPlayer = null;
      this.walkPhase = 0;
      this.walkDistance = 0;
      this.walkFrameOffset = 0;
      this.visualAttack = null;
      this.tipHistory = [];
      this.trailKey = null;
      this.trailFace = null;
      this.trailDirection = null;
      this.windupTip = null;
      this.lastTime = 0;
      this.bloomCasts = new Map();
      this.seenBloomIds = new Set();
      this.rainCasts = new Map();
      this.seenRainIds = new Set();
      this.resize(options.width || canvas.clientWidth || 960, options.height || canvas.clientHeight || 600);
      this.bloomAtlas.addEventListener?.('load', () => this.warmBloomRasters(), { once: true });
    }

    warmBloomRasters() {
      if (typeof window.requestIdleCallback !== 'function' || this.destroyed) return;
      const work = [{ radius: 177 * 0.93 }, { radius: 199.5 * 0.93 }, { radius: 399, unravel: true }];
      const next = () => {
        this.bloomWarmupId = null;
        if (this.destroyed || !work.length) return;
        const item = work.shift();
        if (item.unravel) this.inkBloomUnravelSource(item.radius); else this.flatPlumRaster(item.radius);
        if (work.length) this.bloomWarmupId = window.requestIdleCallback(next, { timeout: 1000 });
      };
      this.bloomWarmupId = window.requestIdleCallback(next, { timeout: 1000 });
    }

    preloadHeroImages() {
      if (!this.heroImages) this.heroImages = new Map();
      const atlas = window.CHEON_HERO_ATLAS || {};
      const entries = [...Object.values(atlas.animations || {}), ...Object.values(atlas.directionalAnimations || {}).flatMap(views => Object.values(views))];
      for (const entry of entries) {
        if (!entry?.src || this.heroImages.has(entry.src)) continue;
        const image = new Image(); image.src = entry.src; this.heroImages.set(entry.src, image);
      }
    }

    resize(width, height) {
      this.width = Math.max(1, Math.round(finite(width, 960)));
      this.height = Math.max(1, Math.round(finite(height, 600)));
      this.dpr = Math.min(2, Math.max(1, finite(window.devicePixelRatio, 1)));
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.worldCanvas.width = Math.ceil(this.width / this.pixelSize);
      this.worldCanvas.height = Math.ceil(this.height / this.pixelSize);
      this.ctx.imageSmoothingEnabled = false;
      this.displayCtx.imageSmoothingEnabled = false;
      this.ctx.setTransform(1 / this.pixelSize, 0, 0, 1 / this.pixelSize, 0, 0);
    }

    makeTile() {
      const tile = document.createElement('canvas'); tile.width = tile.height = 512;
      const ctx = tile.getContext('2d'); ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#263c35'; ctx.fillRect(0, 0, 512, 512);
      const palette = ['#30463a', '#354b3d', '#20362f', '#40523e', '#263c35'];
      for (let i = 0; i < 700; i++) {
        const x = Math.floor(noise(i, 1) * 128) * 4, y = Math.floor(noise(i, 2) * 128) * 4;
        ctx.fillStyle = palette[i % palette.length];
        ctx.fillRect(x, y, 4 + Math.floor(noise(i, 4) * 3) * 4, 4);
        if (i % 3 === 0) ctx.fillRect(x + 4, y - 4, 4, 4);
        if (i % 7 === 0) {
          ctx.fillStyle = '#52634a'; ctx.fillRect(x, y - 4, 2, 4); ctx.fillRect(x + 4, y - 8, 2, 6);
          ctx.fillStyle = '#192e27'; ctx.fillRect(x - 2, y + 4, 10, 2);
        }
      }
      return tile;
    }

    draw(state, options = {}) {
      if (!state || !state.player || !this.ctx) return;
      const ctx = this.ctx, player = state.player;
      const w = this.width, h = this.height;
      const time = finite(state.time);
      const reduced = Boolean(options.reducedMotion);
      const dt = clamp(time - this.lastTime, 0, 0.1);
      const sameRun = this.state === state;
      const moved = sameRun && this.lastPlayer ? Math.hypot(player.x - this.lastPlayer.x, player.y - this.lastPlayer.y) : 0;
      if (sameRun && this.lastPlayer && moved > 0.1) this.locomotion = { x: (player.x - this.lastPlayer.x) / moved, y: (player.y - this.lastPlayer.y) / moved };
      const teleported = moved > Math.max(96, dt * 1800);
      const frozenPose = options.paused && sameRun && time === this.lastTime && moved <= 0.1;
      if (!sameRun || time < this.lastTime) {
        this.bloomCasts.clear(); this.seenBloomIds.clear();
        this.rainCasts.clear(); this.seenRainIds.clear();
      }
      if (!sameRun || teleported || time < this.lastTime) {
        this.lastHeroSourceFrame = null;
        this.lastRenderedHeroPose = null;
        this.locomotion = null;
        this.walkDistance = 0;
        this.walkFrameOffset = 0;
        this.pose = null;
        this.visualAttack = null;
        this.tipHistory = [];
        this.trailKey = null;
        this.trailFace = null;
        this.trailDirection = null;
        this.windupTip = null;
      }
      if (!frozenPose) this.frameMoving = sameRun && !teleported && moved > 0.1;
      if (sameRun && !teleported && moved > 0.1 && !reduced) this.walkPhase += Math.min(moved, 20) * 0.15;
      if (sameRun && !teleported && moved > 0.1 && !((player.dashRemaining || 0) > 0)) this.walkDistance += moved;
      this.lastTime = time;
      this.lastPlayer = { x: player.x, y: player.y };
      const camera = state.camera || player;
      this.ox = w / 2 - finite(camera.x);
      this.oy = h / 2 - finite(camera.y);
      this.state = state;
      this.time = time;
      this.reduced = reduced;
      this.syncBloomCasts(state);
      this.syncRainCasts(state);
      const liveAttack = window.CheonCombatAnimation.attackFor(state);
      if (liveAttack && liveAttack.id !== this.visualAttack?.id) this.visualAttack = { ...liveAttack, contactAt: time - liveAttack.age };
      const retained = this.visualAttack ? { ...this.visualAttack, age: time - this.visualAttack.contactAt } : null;
      const timeline = window.CheonCombatAnimation.attackTimeline(state, { attack: retained });
      if (retained && timeline.attack !== retained) this.visualAttack = null;
      const previousPose = this.pose;
      const poseOptions = { attack: this.visualAttack ? retained : null,
        reducedMotion: reduced, moving: this.frameMoving, walkDistance: this.walkDistance,
        walkFrameOffset: this.walkFrameOffset, locomotionX: this.locomotion?.x, locomotionY: this.locomotion?.y };
      this.pose = window.CheonCombatAnimation.poseFor(state, time, poseOptions);
      if (previousPose && previousPose.phase !== 'idle' && previousPose.action !== 'walk' && this.pose.action === 'walk' &&
          typeof window.CheonCombatAnimation.walkPhaseOffsetFor === 'function') {
        const offset = window.CheonCombatAnimation.walkPhaseOffsetFor(this.lastRenderedHeroPose || previousPose, {
          walkDistance: this.walkDistance, currentOffset: this.walkFrameOffset, face: this.pose.face, direction: this.pose.direction, player });
        if (Number.isInteger(offset)) {
          this.walkFrameOffset = offset;
          this.pose = window.CheonCombatAnimation.poseFor(state, time, { ...poseOptions, walkFrameOffset: offset });
        }
      }
      this.sampleSwordTip(this.pose, time);
      ctx.setTransform(1 / this.pixelSize, 0, 0, 1 / this.pixelSize, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      this.drawGround();
      this.drawPetalRain('back');
      ctx.save();
      ctx.translate(this.ox, this.oy);
      this.drawLandmarks(false);
      this.drawFields(state.fields || []);
      this.drawLandingWaves(state.effects || []);
      for (const effect of (state.effects || [])) {
        if (effect.type === 'telegraph') this.drawTelegraph(effect);
      }
      this.drawAura(player);
      this.drawDashGhosts(player);
      for (const item of (state.pickups || [])) if (this.inView(item, 25)) this.drawPickup(item);
      // A large opening flower belongs to the battlefield plane. Fighters and the
      // calibrated steel blade must remain visible in front of its opaque impact.
      this.drawBloomCasts();
      this.drawRainCasts('back');
      const actors = (state.enemies || []).filter(e => this.inView(e, 100));
      const heroMarker = { ...player, isPlayer: true };
      actors.push(heroMarker);
      actors.sort((a, b) => finite(a.y) - finite(b.y));
      for (const actor of actors) actor.isPlayer ? this.drawHero(player) : this.drawEnemy(actor);
      this.drawRainCasts('front');
      for (const projectile of (state.projectiles || [])) if (this.inView(projectile, 40)) this.drawProjectile(projectile);
      for (const effect of (state.effects || [])) {
        if (effect.type !== 'telegraph' && effect.type !== 'rain' && !isBloomBurst(effect) && this.inView(effect, finite(effect.radius, 160) + 160)) this.drawEffect(effect);
      }
      for (const item of (state.damageTexts || []).slice(-85)) this.drawDamage(item);
      this.drawLandmarks(true);
      ctx.restore();
      this.drawPetalRain('front');
      this.drawAtmosphere();
      this.drawOffscreenWarnings();
      if (finite(player.hurtUntil) > time && !reduced) {
        ctx.fillStyle = '#bd5164'; ctx.globalAlpha = 0.35;
        ctx.fillRect(0, 0, w, 4); ctx.fillRect(0, h - 4, w, 4);
        ctx.fillRect(0, 0, 4, h); ctx.fillRect(w - 4, 0, 4, h);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      // Keep the variable useful when step and paint use a paused clock.
      this.frameDelta = dt;
      // Scene pixels are physical art units. Keep gameplay/CSS coordinates unchanged.
      const display = this.displayCtx;
      display.setTransform(1, 0, 0, 1, 0, 0);
      display.imageSmoothingEnabled = false;
      display.drawImage(this.worldCanvas, 0, 0, this.worldCanvas.width, this.worldCanvas.height,
        0, 0, this.canvas.width, this.canvas.height);
    }

    inView(item, extra = 0) {
      if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) return false;
      const x = item.x + this.ox, y = item.y + this.oy;
      return x > -extra && y > -extra && x < this.width + extra && y < this.height + extra;
    }

    syncRainCasts(state) {
      if (!this.rainCasts) this.rainCasts = new Map();
      if (!this.seenRainIds) this.seenRainIds = new Set();
      const time = finite(state.time), enemies = state.enemies || [];
      for (const effect of state.effects || []) {
        if (effect.type !== 'rain' || effect.enemy || this.seenRainIds.has(effect.id)) continue;
        this.seenRainIds.add(effect.id);
        const rank = finite(effect.rank, 1), kind = effect.kind || (effect.sword === false || rank >= 5 && effect.sword !== true ? 'petal' : 'sword');
        this.rainCasts.set(effect.id, { id: effect.id, rank, kind, targetId: effect.targetId,
          x: finite(effect.x), y: finite(effect.y), groundX: finite(effect.groundX, effect.x), groundY: finite(effect.groundY, finite(effect.y) + 38),
          bodyOffsetX: finite(effect.groundX, effect.x) - finite(effect.x), bodyOffsetY: finite(effect.groundY, finite(effect.y) + 38) - finite(effect.y),
          contactAt: time - finite(effect.age), fallDuration: Math.max(0.02, finite(effect.duration, 0.3)), grounded: false });
      }
      for (const effect of state.effects || []) if (effect.type === 'burst' && effect.source === 'rain' && Number.isFinite(effect.groundY)) {
        const impactAt = time - finite(effect.age);
        const cast = [...this.rainCasts.values()].find(item => item.targetId === effect.targetId && Math.abs(item.contactAt + item.fallDuration - impactAt) < 0.10);
        if (cast) { cast.groundX = finite(effect.groundX, cast.groundX); cast.groundY = effect.groundY; cast.grounded = true; }
      }
      for (const [id, cast] of this.rainCasts) {
        const age = time - cast.contactAt;
        if (!cast.grounded) {
          const target = enemies.find(enemy => enemy.id === cast.targetId);
          if (target) { cast.groundX = target.x; cast.groundY = target.y; }
          if (age >= cast.fallDuration) cast.grounded = true;
        }
        if (age >= cast.fallDuration + (cast.kind === 'petal' ? 0.22 : 0.62)) this.rainCasts.delete(id);
      }
      while (this.rainCasts.size > 128) this.rainCasts.delete(this.rainCasts.keys().next().value);
      while (this.seenRainIds.size > 512) this.seenRainIds.delete(this.seenRainIds.values().next().value);
    }

    drawRainCasts(layer = 'back') {
      for (const cast of this.rainCasts.values()) if ((cast.kind === 'petal') === (layer === 'front') && this.inView({ x: cast.groundX, y: cast.groundY }, 360)) this.drawRainStrike(cast, this.time - cast.contactAt);
    }

    drawRainStrike(cast, age) {
      const fallDuration = Math.max(0.02, finite(cast.fallDuration, 0.3)), after = age - fallDuration;
      if (age < 0 || after >= (cast.kind === 'petal' ? 0.22 : 0.62)) return;
      const x = finite(cast.groundX, cast.x), groundY = finite(cast.groundY, finite(cast.y) + 38);
      const alpha = age < fallDuration ? clamp(age / 0.025) : clamp((0.62 - after) / 0.30);
      if (cast.kind === 'petal') {
        const offsetX = finite(cast.bodyOffsetX, x - finite(cast.x, x)), offsetY = finite(cast.bodyOffsetY, groundY - finite(cast.y, groundY - 38));
        const t = clamp(age / fallDuration), y = groundY - offsetY - 210 * (1 - t) * (1 - t);
        this.ctx.save(); this.ctx.globalAlpha *= after < 0 ? alpha : clamp(1 - after / 0.22);
        this.drawRainPetal(x - offsetX + Math.sin(t * Math.PI) * 6, y, finite(cast.id) * 0.3 + t * 2, '#ffd0df');
        this.ctx.restore();
      } else if (after < 0) {
        const t = clamp(age / fallDuration);
        this.ctx.save(); this.ctx.globalAlpha *= alpha;
        this.sword(x, groundY - 210 * (1 - t) * (1 - t), '#e9c6dc', finite(cast.rank, 1) >= 7 ? 1.1 : 1);
        this.ctx.restore();
      } else this.drawEmbeddedRainSword(x, groundY, clamp(after / 0.14), alpha, finite(cast.rank, 1));
    }

    drawEmbeddedRainSword(x, groundY, penetration, alpha = 1, rank = 1) {
      const stamp = this.plumSwordRaster('#e9c6dc', rank >= 7 ? 1.1 : 1);
      const visibleRows = Math.max(1, Math.round(stamp.height * (1 - clamp(penetration) * 0.5)));
      const ctx = this.ctx, matrix = ctx.getTransform?.();
      const left = x - stamp.tip.x * 2, top = groundY - visibleRows * 2;
      ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.imageSmoothingEnabled = false;
      if (matrix && Math.abs(matrix.b) < 1e-8 && Math.abs(matrix.c) < 1e-8) {
        const xx = Math.round(matrix.a * left + matrix.e), yy = Math.round(matrix.d * top + matrix.f);
        const width = Math.round(stamp.width * 2 * matrix.a), height = Math.round(visibleRows * 2 * matrix.d);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(stamp.canvas, 0, 0, stamp.width, visibleRows, xx, yy, width, height);
      } else ctx.drawImage(stamp.canvas, 0, 0, stamp.width, visibleRows, left, top, stamp.width * 2, visibleRows * 2);
      ctx.restore();
    }

    syncBloomCasts(state) {
      const time = finite(state.time), effects = state.effects || [];
      const remember = key => { this.seenBloomIds.add(key); while (this.seenBloomIds.size > 512) this.seenBloomIds.delete(this.seenBloomIds.values().next().value); };
      for (const effect of effects) {
        if (effect.enemy || !['flower', 'slash'].includes(effect.type) || finite(effect.rank) < 5 || finite(effect.duration, 0.7) > 0.700001) continue;
        const key = `attack:${effect.id}`; if (this.seenBloomIds.has(key)) continue;
        remember(key);
        const rank = finite(effect.rank), contactAt = time - finite(effect.age), radius = finite(effect.radius, 177);
        this.bloomCasts.set(key, { id: key, attackId: effect.id, rank, contactAt, x: effect.x, y: effect.y, radius,
          angle: finite(effect.angle, Math.atan2(finite(state.player?.faceY), finite(state.player?.faceX, 1))),
          strokeDuration: finite(window.CheonCombatAnimation?.physicalStrokeDuration?.(rank), rank >= 7 ? 0.12 : 0.18),
          outerRadius: rank >= 7 ? radius : finite(effect.bloomRadius, radius * 1.5),
          sourceAt: contactAt + (rank >= 7 ? 0.28 : 0.35), sourceDuration: rank >= 7 ? 0.42 : 0.55, seed: finite(effect.id) });
      }
      for (const effect of effects) {
        if (!isBloomBurst(effect)) continue;
        const key = `burst:${effect.id}`; if (this.seenBloomIds.has(key)) continue;
        remember(key); const sourceAt = time - finite(effect.age);
        let cast = [...this.bloomCasts.values()].find(item => item.rank < 7 && !item.burstId &&
          Math.hypot(item.x - effect.x, item.y - effect.y) < 0.01 && Math.abs(item.sourceAt - sourceAt) < 0.12);
        if (!cast) {
          cast = { id: key, rank: finite(effect.rank, 5), contactAt: sourceAt - 0.35,
            x: effect.x, y: effect.y, radius: finite(effect.flowerRadius, effect.radius / 1.5), seed: finite(effect.id), angle: finite(effect.angle, Math.atan2(finite(state.player?.faceY), finite(state.player?.faceX, 1))) };
          this.bloomCasts.set(key, cast);
        }
        Object.assign(cast, { burstId: effect.id, sourceAt, sourceDuration: finite(effect.duration, 0.55), outerRadius: effect.radius });
      }
      for (const [key, cast] of this.bloomCasts) if (time >= cast.sourceAt + (cast.rank >= 7 ? cast.sourceDuration + 0.85 : 0.34)) this.bloomCasts.delete(key);
      // The core's minimum attack interval needs fewer than 64 simultaneous
      // visual casts; the guard also bounds hostile/imported state snapshots.
      while (this.bloomCasts.size > 64) this.bloomCasts.delete(this.bloomCasts.keys().next().value);
    }

    drawBloomCasts() {
      for (const cast of this.bloomCasts.values()) {
        const age = this.time - cast.contactAt; if (age < 0) continue;
        const ctx = this.ctx; ctx.save(); ctx.translate(cast.x, cast.y);
        if (cast.rank < 7) {
          if (this.time < cast.sourceAt) {
            const stroke = clamp(age / finite(cast.strokeDuration, 0.18));
            this.drawFilledPlumMotif(cast.radius, clamp(age / Math.max(0.01, cast.sourceAt - cast.contactAt)), 1, { angle: cast.angle, circleProgress: stroke });
            this.drawScatteredCuts(cast.radius, clamp(age / 0.35), 1, cast.seed, cast.rank);
          } else {
            const p = (this.time - cast.sourceAt) / 0.34;
            this.drawFilledPlumMotif(cast.radius, 1, clamp(1 - p * 2), { circle: false, angle: cast.angle });
            this.drawPlumExplosion(cast.radius, cast.outerRadius, p, 1, cast.angle);
            this.drawScatteredCuts(cast.outerRadius, p, 1, cast.seed + 101, cast.rank);
          }
          ctx.restore(); continue;
        }
        if (this.time < cast.sourceAt) this.drawInkBloom(0, 0, cast.radius, clamp(age / finite(cast.strokeDuration, 0.24)), 0.95, { angle: cast.angle });
        else this.drawInkBloomDisintegration(0, 0, cast.radius,
          (this.time - cast.sourceAt) / cast.sourceDuration, cast.rank >= 7 ? 0.95 : 1, cast.seed, { sourceDuration: cast.sourceDuration, angle: cast.angle });
        if (cast.rank >= 7 && age < 0.7) this.drawPerfectedCut(cast.radius, age / 0.7, Math.pow(1 - clamp(age / 0.7), 0.55), cast.seed, { flower: false });
        ctx.restore();
      }
    }

    sampleSwordTip(pose, time) {
      const key = pose.attack?.id;
      if (pose.socketOccluded || (pose.bakedWeapon && pose.tipVisible === false) || (pose.imageSrc && this.heroImages && !this.heroFrameReady(pose))) {
        this.tipHistory = []; this.windupTip = null; this.trailKey = null; return;
      }
      if (!pose.trailActive || key == null) {
        this.tipHistory = [];
        this.trailKey = null;
        // Preserve the actual observed backswing silently. It becomes light only
        // when the next contact begins, so preparation never looks like a hit.
        this.windupTip = pose.phase === 'anticipation' && pose.rank <= 2
          ? { time, tip: { ...pose.tip }, bladeOrigin: { ...pose.bladeOrigin },
            face: pose.face, direction: pose.direction, rank: pose.rank, windup: true }
          : null;
        return;
      }
      if (this.trailKey !== key || this.trailFace !== pose.face || this.trailDirection !== pose.direction) {
        this.tipHistory = [];
        const windup = this.windupTip;
        if (windup && pose.rank <= 2 && windup.rank === pose.rank && windup.face === pose.face &&
            windup.direction === pose.direction && time >= windup.time && time - windup.time <= 0.23) {
          this.tipHistory.push(windup);
        }
        // Consume once; a subsequent attack cannot borrow an older backswing.
        this.windupTip = null;
      }
      this.trailKey = key;
      this.trailFace = pose.face;
      this.trailDirection = pose.direction;
      const last = this.tipHistory.at(-1);
      // Samples are real world-space positions at their own simulation timestamps. Paused
      // paints leave them intact; translating the character never drags old light with it.
      if (!last || time > last.time) this.tipHistory.push({ time, tip: { ...pose.tip }, bladeOrigin: { ...pose.bladeOrigin } });
      const seed = pose.rank <= 2 ? this.tipHistory.find(point => point.windup) : null;
      const recent = this.tipHistory.filter(point => !point.windup && time - point.time <= (this.reduced ? 0.055 : 0.115));
      // The fan must remain readable until the active swing ends. Keep only its
      // real opening boundary; ordinary samples still expire at their old rate.
      this.tipHistory = seed ? [seed, ...recent.slice(-11)] : recent.slice(-12);
    }

    drawGround() {
      const ctx = this.ctx;
      const tx = ((this.ox % 512) + 512) % 512 - 512;
      const ty = ((this.oy % 512) + 512) % 512 - 512;
      for (let y = ty; y < this.height; y += 512) {
        for (let x = tx; x < this.width; x += 512) ctx.drawImage(this.tile, x, y);
      }
      // A broken old mountain path anchors the unbounded forest without a debug grid.
      ctx.save(); ctx.translate(this.ox, this.oy);
      const minY = Math.floor(-this.oy / 110) * 110 - 220;
      for (let y = minY; y < this.height - this.oy + 220; y += 110) {
        const center = Math.sin(y / 640) * 135;
        for (let col = -1; col <= 1; col++) {
          const n = noise(y, col);
          if (n < 0.12) continue;
          const x = center + col * 67 + n * 18;
          ctx.fillStyle = ['#596253', '#5e6558', '#535f50'][col + 1];
          ctx.globalAlpha = 0.40;
          ctx.beginPath();
          ctx.moveTo(x - 29, y - 42); ctx.lineTo(x + 27, y - 38);
          ctx.lineTo(x + 31, y + 40); ctx.lineTo(x - 23, y + 42); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#74806a'; ctx.globalAlpha = 0.17; ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 0.14; ctx.strokeStyle = '#172e26';
          ctx.beginPath(); ctx.moveTo(x - 26, y + 6); ctx.lineTo(x - 5, y - 4); ctx.lineTo(x + 14, y + 9); ctx.stroke();
        }
      }
      ctx.restore();
    }

    drawLandmarks(foreground) {
      const ctx = this.ctx, size = 320;
      const x0 = Math.floor(-this.ox / size) - 1, y0 = Math.floor(-this.oy / size) - 1;
      const x1 = Math.ceil((this.width - this.ox) / size) + 1;
      const y1 = Math.ceil((this.height - this.oy) / size) + 1;
      for (let cy = y0; cy <= y1; cy++) {
        for (let cx = x0; cx <= x1; cx++) {
          const seed = noise(cx, cy, 8);
          const x = cx * size + noise(cx, cy, 4) * 240;
          const y = cy * size + noise(cx, cy, 7) * 240;
          // Place decoration away from the central path and keep it non-obstructive.
          if (Math.abs(x - Math.sin(y / 640) * 135) < 145) continue;
          const inFront = y + this.oy > this.height * 0.88;
          if (foreground !== inFront) continue;
          ctx.save();
          ctx.globalAlpha = foreground ? 0.32 : 0.68;
          ctx.drawImage(this.landmarkSprite(cx, cy, seed), x - 100, y - 165);
          ctx.restore();
        }
      }
    }

    landmarkSprite(cx, cy, seed) {
      const key = `${cx}:${cy}`;
      if (this.spriteCache.has(key)) return this.spriteCache.get(key);
      const sprite = document.createElement('canvas');
      sprite.width = 220; sprite.height = 210;
      const mainCtx = this.ctx;
      this.ctx = sprite.getContext('2d');
      try {
        if (seed < 0.58) this.drawBamboo(100, 165, seed);
        else if (seed < 0.83) this.drawRock(100, 165, seed);
        else this.drawPlumBranch(100, 165, seed);
      } finally {
        this.ctx = mainCtx;
      }
      this.spriteCache.set(key, sprite);
      if (this.spriteCache.size > 128) this.spriteCache.delete(this.spriteCache.keys().next().value);
      return sprite;
    }

    drawBamboo(x, y, seed) {
      const ctx = this.ctx;
      for (let i = 0; i < 4; i++) {
        const sx = Math.round((x + i * 14 - 18) / 2) * 2, height = 64 + Math.floor(noise(i, seed) * 16) * 4;
        ctx.fillStyle = '#203c31'; ctx.fillRect(sx - 2, y - height, 8, height);
        ctx.fillStyle = i % 2 ? '#4e7352' : '#42664c'; ctx.fillRect(sx, y - height, 4, height);
        ctx.fillStyle = '#789568'; ctx.fillRect(sx, y - height, 2, height);
        for (let j = 1; j < 5; j++) {
          const sy = Math.round((y - height * j / 5) / 2) * 2, dir = j % 2 ? 1 : -1;
          ctx.fillStyle = '#9da77b'; ctx.fillRect(sx - 2, sy, 8, 2);
          for (let k = 0; k < 5; k++) {
            ctx.fillStyle = k < 2 ? '#3e6548' : '#5a7d54';
            ctx.fillRect(sx + dir * (4 + k * 6) - (dir < 0 ? 8 : 0), sy - 4 - k * 2, 8, 4);
            if (k < 3) ctx.fillRect(sx - dir * (8 + k * 6), sy - 10 - k * 2, 8, 4);
          }
        }
      }
    }

    drawRock(x, y, seed) {
      const ctx = this.ctx, s = 0.7 + seed;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = '#182f2a'; ctx.beginPath(); ctx.ellipse(0, 3, 31, 11, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#59665a';
      ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(-20, -21); ctx.lineTo(-4, -33); ctx.lineTo(20, -25); ctx.lineTo(29, -2); ctx.lineTo(10, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#6b7664';
      ctx.beginPath(); ctx.moveTo(-20, -21); ctx.lineTo(-4, -33); ctx.lineTo(20, -25); ctx.lineTo(3, -16); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#3b4e40'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(3, -16); ctx.lineTo(0, 1); ctx.stroke();
      ctx.fillStyle = '#53704c'; ctx.fillRect(-18, -11, 10, 3); ctx.fillRect(-14, -7, 7, 3);
      ctx.restore();
    }

    drawPlumBranch(x, y, seed) {
      const ctx = this.ctx;
      ctx.strokeStyle = '#283a31'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x - 5, y - 42); ctx.lineTo(x + 13, y - 85); ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 4, y - 35); ctx.lineTo(x - 35, y - 62); ctx.moveTo(x + 3, y - 60); ctx.lineTo(x + 42, y - 79); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i * 2.4, r = 12 + noise(i, seed) * 26;
        this.blossom(x + 7 + Math.cos(a) * r, y - 73 + Math.sin(a) * r * 0.65, 4, '#b77583', 0.75);
      }
      for (let i = 0; i < 5; i++) this.petal(x + (noise(i, seed, 2) - 0.5) * 80, y + noise(i, seed, 3) * 20, i, 2, '#b17a89', 0.5);
    }

    combatCenter(actor = this.state.player) {
      return window.CheonGameCore?.getCombatCenter?.(actor) || { x: actor.x, y: actor.y - 38 };
    }

    drawFields(fields) {
      const ctx = this.ctx;
      const matrix = ctx.getTransform?.(), valid = matrix && [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].every(Number.isFinite);
      ctx.save(); if (valid) ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (const [skill, rows] of this.fieldSpans(fields)) {
        ctx.fillStyle = skill === 'dark_fragrance' ? '#bd8bc9' : '#e996bc';
        for (const [row, spans] of rows) for (const span of spans) {
          const y = row * 2; ctx.globalAlpha = span.alpha;
          if (valid) {
            const x = Math.round(matrix.a * span.left + matrix.c * y + matrix.e), yy = Math.round(matrix.b * span.left + matrix.d * y + matrix.f);
            const right = Math.round(matrix.a * span.right + matrix.c * y + matrix.e);
            ctx.fillRect(x, yy, Math.max(1, right - x), Math.max(1, Math.round(Math.hypot(matrix.c, matrix.d) * 2)));
          } else ctx.fillRect(span.left, y, span.right - span.left, 2);
        }
      }
      ctx.restore();
    }

    fieldSpans(fields) {
      const groups = new Map(), ox = finite(this.ox), oy = finite(this.oy), time = finite(this.time);
      for (const field of fields) {
        const remain = finite(field.expiresAt, time + 3) - time; if (remain <= 0) continue;
        const r = this.fieldVisualRadius(field), skill = field.skillId || 'plum_sword', alpha = 0.085 * clamp(remain / 0.45);
        if (!groups.has(skill)) groups.set(skill, new Map()); const rows = groups.get(skill);
        const first = Math.floor(Math.max(field.y - r, -oy - 2) / 2), last = Math.ceil(Math.min(field.y + r, finite(this.height, 600) - oy + 2) / 2);
        for (let row = first; row <= last; row++) {
          const dy = row * 2 + 1 - field.y; if (Math.abs(dy) > r) continue;
          const edge = Math.sqrt(r * r - dy * dy);
          const left = Math.max(Math.ceil((field.x - edge - 1) / 2), Math.floor(-ox / 2) - 1);
          const right = Math.min(Math.floor((field.x + edge - 1) / 2) + 1, Math.ceil((finite(this.width, 960) - ox) / 2) + 1);
          if (left >= right) continue;
          if (!rows.has(row)) rows.set(row, []); rows.get(row).push({ x: left, alpha, delta: 1 }, { x: right, alpha, delta: -1 });
        }
      }
      for (const rows of groups.values()) for (const [row, events] of rows) {
        events.sort((a, b) => a.x - b.x); const active = new Map(), spans = []; let previous = events[0].x, i = 0;
        while (i < events.length) {
          const x = events[i].x, alpha = active.size ? Math.max(...active.keys()) : 0;
          if (x > previous && alpha > 0) spans.push({ left: previous * 2, right: x * 2, alpha });
          while (i < events.length && events[i].x === x) {
            const event = events[i++], count = (active.get(event.alpha) || 0) + event.delta;
            if (count > 0) active.set(event.alpha, count); else active.delete(event.alpha);
          }
          previous = x;
        }
        rows.set(row, spans);
      }
      return groups;
    }

    fieldVisualRadius(field) {
      const radius = Math.max(1, finite(field.radius, 40));
      if ((field.skillId || 'plum_sword') !== 'plum_sword' || !Number.isFinite(field.bornAt)) return radius;
      const cast = this.bloomCasts ? [...this.bloomCasts.values()].find(item => item.rank === 6 &&
        Math.hypot(item.x - field.x, item.y - field.y) < 0.01 && Math.abs(item.sourceAt - field.bornAt) < 0.12) : null;
      if (!cast && finite(this.state?.skills?.plum_sword) !== 6) return radius;
      const inner = cast ? cast.radius : radius / 1.5, progress = clamp((finite(this.time) - field.bornAt) / 0.34);
      return inner + (radius - inner) * progress;
    }

    drawField(field) { this.drawFields([field]); }

    drawPickup(item) {
      const ctx = this.ctx;
      const bob = this.reduced ? 0 : Math.sin(this.time * 3 + finite(item.id)) * 1.5;
      ctx.save(); ctx.translate(item.x, item.y + bob);
      if (item.type === 'petal') {
        const stamp = this.collectiblePetalRaster(0, '#ffd0df');
        this.drawPixelStamp(stamp.canvas, -stamp.center.x * 2, -stamp.center.y * 2, 1);
      } else {
        ctx.shadowColor = '#7bbfba'; ctx.shadowBlur = 0;
        ctx.fillStyle = '#b1e7d1'; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(4, 0); ctx.lineTo(0, 5); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = '#e1f4d9'; ctx.fillRect(-1, -2, 2, 3);
      }
      ctx.restore();
    }

    drawAura(player) {
      const invincible = finite(player.invulnerableUntil) > this.time;
      if (!invincible) return;
      const ctx = this.ctx, r = Math.max(1, finite(player.radius, 12)) * 5;
      const centre = this.combatCenter(player);
      ctx.save(); ctx.translate(centre.x, centre.y);
      this.pixelRing(0, 0, r * 0.72, '#fff0ed', 0.9, 3);
      ctx.restore();
    }

    petalRainParticles(layer = 'back') {
      if (finite(this.state?.skills?.plum_sword) < 7) return [];
      const width = Math.max(1, finite(this.width, 960)), height = Math.max(1, finite(this.height, 600));
      const reduced = Boolean(this.reduced);
      const time = reduced ? 0 : Math.max(0, finite(this.time, finite(this.state?.time)));
      const camera = this.state?.camera || this.state?.player || { x: 0, y: 0 }, particles = [];
      const depths = layer === 'front' ? [2] : [0, 1];
      for (const depth of depths) {
        if (reduced && depth === 2) continue;
        const tile = [130, 165, 275][depth], parallax = [0.75, 0.95, 1.10][depth], margin = 36;
        const speedX = 8 + depth * 7, speedY = 24 + depth * 10, driftX = time * speedX, driftY = time * speedY;
        const cx = finite(camera.x) * parallax, cy = finite(camera.y) * parallax;
        const decimation = reduced ? 5 : Math.max(1, Math.ceil(width * height / (tile * tile * [90, 60, 24][depth])));
        const minX = Math.floor((cx - width / 2 - margin - driftX - 20) / tile), maxX = Math.ceil((cx + width / 2 + margin - driftX + 20) / tile);
        const minY = Math.floor((cy - height / 2 - margin - driftY - 10) / tile), maxY = Math.ceil((cy + height / 2 + margin - driftY + 10) / tile);
        for (let row = minY; row <= maxY; row++) for (let col = minX; col <= maxX; col++) {
          const seed = depth + 101;
          if (Math.floor(noise(col, row, seed + 9) * 65536) % decimation) continue;
          const phase = noise(col, row, seed + 2) * TAU;
          const sway = Math.sin(time * (0.55 + depth * 0.12) + phase) * (8 + depth * 5);
          const worldX = (col + noise(col, row, seed + 6)) * tile + driftX + sway;
          const worldY = (row + noise(col, row, seed + 5)) * tile + driftY + Math.sin(time * 0.6 + phase) * 4;
          const x = worldX - cx + width / 2, y = worldY - cy + height / 2;
          if (x < -margin || y < -margin || x > width + margin || y > height + margin) continue;
          const angle = phase + time * (0.10 + depth * 0.055) + Math.sin(time * 0.8 + phase) * 0.5;
          particles.push({ id: `${depth}:${col}:${row}`, depth, x, y, worldX, worldY, parallax, angle,
            direction: ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8,
            large: depth === 2, color: ['#c98ba5', '#efa6c3', '#ffd0e0'][depth], alpha: 1,
            speedY, tileX: col, tileY: row });
        }
      }
      return particles;
    }

    rainPetalRaster(direction, color) {
      if (!this.rainPetalRasters) this.rainPetalRasters = new Map();
      const key = `${direction}:${color}`;
      if (this.rainPetalRasters.has(key)) return this.rainPetalRasters.get(key);
      const original = this.smallPetalRaster(direction, color);
      const width = original.width === 5 ? 7 : 9, height = original.height === 5 ? 7 : 9;
      const data = new Uint8ClampedArray(width * height * 4);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const from = (Math.min(original.height - 1, Math.floor((y + 0.5) * original.height / height)) * original.width +
          Math.min(original.width - 1, Math.floor((x + 0.5) * original.width / width))) * 4;
        data.set(original.data.subarray(from, from + 4), (y * width + x) * 4);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, width, height, pixelStep: 2,
        center: { x: width / 2, y: height / 2 }, direction, palette: original.palette };
      this.rainPetalRasters.set(key, entry);
      while (this.rainPetalRasters.size > 16) this.rainPetalRasters.delete(this.rainPetalRasters.keys().next().value);
      return entry;
    }

    drawPetalRain(layer = 'back') {
      const particles = this.petalRainParticles(layer); if (!particles.length) return;
      const ctx = this.ctx, matrix = ctx.getTransform?.();
      const scaleX = this.worldCanvas ? this.worldCanvas.width / Math.max(1, this.width) : Math.hypot(finite(matrix?.a, 1), finite(matrix?.b));
      const scaleY = this.worldCanvas ? this.worldCanvas.height / Math.max(1, this.height) : Math.hypot(finite(matrix?.c), finite(matrix?.d, 1));
      ctx.save(); ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0); ctx.imageSmoothingEnabled = false;
      for (const particle of particles) {
        const stamp = particle.large ? this.rainPetalRaster(particle.direction, particle.color) : this.smallPetalRaster(particle.direction, particle.color);
        this.drawPixelStamp(stamp.canvas, particle.x - stamp.center.x * 2, particle.y - stamp.center.y * 2, particle.alpha);
      }
      ctx.restore();
    }

    drawHero(player) {
      const ctx = this.ctx;
      const pose = this.pose;
      const invincible = finite(player.invulnerableUntil) > this.time;
      ctx.save(); ctx.translate(player.x, player.y);
      ctx.fillStyle = 'rgba(4,17,16,.40)'; ctx.beginPath(); ctx.ellipse(0, 5, 20, 8, 0, 0, TAU); ctx.fill();
      ctx.restore();
      if (pose.rank < 5) this.drawSwordChoreography(pose);
      this.drawPetals(player, 'back');
      const sourceReady = this.heroFrameReady(pose);
      if (sourceReady && !pose.bakedWeapon && pose.bladeBehind) this.drawHeldBlade(pose);
      ctx.save(); ctx.translate(player.x, player.y);
      if (finite(player.hurtUntil) > this.time && Math.floor(this.time * 24) % 2 === 0) ctx.globalAlpha = 0.55;
      if (invincible) { ctx.shadowColor = '#f4b7d7'; ctx.shadowBlur = 0; }
      this.drawHeroFrame(pose);
      ctx.shadowBlur = 0;
      ctx.restore();
      if (sourceReady && !pose.bakedWeapon && !pose.bladeBehind) this.drawHeldBlade(pose);
      this.drawPetals(player, 'front');
      ctx.save(); ctx.translate(player.x, player.y);
      const locked = finite(player.pickupLockedUntil) > this.time;
      if (locked) {
        ctx.strokeStyle = '#d0a3b5'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(0, 5, 25, -Math.PI / 2, -Math.PI / 2 + TAU * clamp((player.pickupLockedUntil - this.time) / 3)); ctx.stroke();
      }
      if (this.state.showHitbox) {
        ctx.fillStyle = '#fff5dc'; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    heroFrameReady(pose) {
      if (!pose.imageSrc) return Boolean(this.heroAtlas?.complete && this.heroAtlas.naturalWidth > 0);
      if (!this.heroImages) this.heroImages = new Map();
      if (!this.heroImages.has(pose.imageSrc)) { const image = new Image(); image.src = pose.imageSrc; this.heroImages.set(pose.imageSrc, image); }
      const image = this.heroImages.get(pose.imageSrc);
      return Boolean(image.complete && image.naturalWidth > 0);
    }

    drawHeroFrame(pose) {
      const ctx = this.ctx;
      let framePose = pose, image = null;
      if (this.heroFrameReady(pose)) {
        image = pose.imageSrc ? this.heroImages.get(pose.imageSrc) : this.heroAtlas;
        this.lastHeroSourceFrame = { image, pose: { ...pose, foot: { ...pose.foot }, frameRect: { ...pose.frameRect } } };
      } else if (this.lastHeroSourceFrame?.image.complete && this.lastHeroSourceFrame.image.naturalWidth > 0) {
        ({ image, pose: framePose } = this.lastHeroSourceFrame);
      }
      ctx.save(); ctx.scale(framePose.face, 1); ctx.imageSmoothingEnabled = false;
      if (image) {
        const crop = framePose.frameRect;
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h,
          -framePose.foot.x * framePose.scale, -framePose.foot.y * framePose.scale + framePose.bob, framePose.frameWidth * framePose.scale, framePose.frameHeight * framePose.scale);
        const player = this.state?.player || framePose.bodyOrigin;
        const dx = player && framePose.bodyOrigin ? player.x - framePose.bodyOrigin.x : 0, dy = player && framePose.bodyOrigin ? player.y - framePose.bodyOrigin.y : 0;
        this.lastRenderedHeroPose = { ...framePose, bodyOrigin: player ? { x: player.x, y: player.y } : undefined,
          contactPoints: (framePose.contactPoints || []).map(point => ({ x: point.x + dx, y: point.y + dy })) };
      } else if (this.hero.complete && this.hero.naturalWidth > 0) {
        this.lastRenderedHeroPose = null;
        ctx.drawImage(this.hero, -37, -76 + pose.bob, 74, 82);
      } else this.drawFigure(0, pose.bob, 'hero', 1.4, Math.sin(this.walkPhase), 1);
      ctx.restore();
    }

    drawHeldBlade(pose) {
      if (pose.bakedWeapon) return;
      const ctx = this.ctx, purple = finite(this.state.skills?.zixia) >= 4;
      ctx.save(); ctx.translate(pose.bladeOrigin.x, pose.bladeOrigin.y); ctx.rotate(pose.bladeAngle);
      ctx.fillStyle = '#4c4357'; ctx.fillRect(0, -3, pose.bladeLength - 4, 6);
      ctx.fillStyle = purple ? '#a993dc' : '#a9b5c1'; ctx.fillRect(0, -2, pose.bladeLength - 3, 4);
      ctx.fillStyle = purple ? '#ede0ff' : '#fcf5de'; ctx.fillRect(0, -2, pose.bladeLength - 2, 2);
      ctx.beginPath(); ctx.moveTo(pose.bladeLength - 4, -2); ctx.lineTo(pose.bladeLength, 0); ctx.lineTo(pose.bladeLength - 4, 2); ctx.fill();
      ctx.restore();
    }

    drawDashGhosts(player) {
      if (this.reduced || !((player.dashRemaining || 0) > 0)) return;
      const ctx = this.ctx, dx = finite(player.dashX, player.faceX), dy = finite(player.dashY, player.faceY);
      const rank = finite(this.state.skills?.dark_fragrance, 1), count = rank >= 7 ? 6 : rank >= 3 ? 4 : 2;
      for (let i = count; i >= 1; i--) {
        ctx.save(); ctx.translate(player.x - dx * i * 13, player.y - dy * i * 13);
        ctx.globalAlpha = (1 - i / (count + 1)) * 0.25;
        this.drawHeroFrame(this.pose); ctx.restore();
      }
    }

    drawSwordChoreography(pose) {
      if (!pose.attack) return;
      const ctx = this.ctx, rank = pose.rank, age = Math.max(0, finite(pose.attack.age));
      const life = rank >= 7 ? 0.70 : 0.35;
      if (age >= life || rank === 1) return;
      const alpha = Math.pow(1 - clamp(age / life), 0.55);
      const color = rank === 3 || rank === 4 ? '#ffc1dc'
        : finite(this.state.skills?.zixia) >= 4 ? '#d3b0f4' : '#ffc1dc';
      const body = this.combatCenter(), centre = { x: finite(pose.attack.x, body.x), y: finite(pose.attack.y, body.y) };
      const radius = Math.max(1, finite(pose.attack.radius, 58));
      ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'bevel'; ctx.translate(centre.x, centre.y);
      switch (rank) {
        case 2: this.drawBodyFan(radius, finite(pose.attack.angle), clamp(age / 0.13), alpha, color); break;
        case 3: this.drawCircleCut(radius, finite(pose.strokeProgress, clamp(age / finite(pose.timeline?.strike, 0.18))), alpha, color, finite(pose.attack.angle)); break;
        case 4:
          this.drawFilledPlumMotif(radius, clamp(age / 0.24), age < 0.26 ? 1 : clamp((0.35 - age) / 0.09), { angle: finite(pose.attack.angle), circleProgress: finite(pose.strokeProgress, clamp(age / finite(pose.timeline?.strike, 0.18))) });
          break;
        case 5: case 6:
          this.drawFilledPlumMotif(radius, age / life, 1, { angle: finite(pose.attack.angle) });
          this.drawScatteredCuts(radius, age / life, alpha, finite(pose.attack.id), rank); break;
        default: this.drawPerfectedCut(radius, age / life, alpha, finite(pose.attack.id), { angle: finite(pose.attack.angle) }); break;
      }
      ctx.restore();
    }

    drawBodyFan(radius, angle, progress, alpha, color) {
      const span = 75 * Math.PI / 180;
      this.drawInkCut(radius, angle - span / 2, span * clamp(progress), alpha);
    }

    drawFilledPlumMotif(radius, progress, alpha = 1, options = {}) {
      if (alpha <= 0) return;
      const stamp = this.flatPlumRaster(radius * 0.93, options.angle);
      if (stamp) {
        const p = clamp(progress), anchor = stamp.displayCenter, left = -anchor.x * 2, top = -anchor.y * 2;
        if (p >= 1) this.drawPixelStamp(stamp.canvas, left, top, alpha);
        else for (let part = 0; part < 5; part++) {
          const reveal = clamp(p * 5 - part); if (reveal <= 0) continue;
          this.drawPixelStamp(stamp.parts[part], left, top, alpha * Math.min(1, reveal * 3));
        }
      }
      if (options.circle !== false) this.drawCircleCut(radius, finite(options.circleProgress, clamp(progress * 1.25)), alpha * 0.9, INK.body, finite(options.angle, -Math.PI / 2));
    }

    flatPlumRaster(radius, angle = -Math.PI / 2) {
      if (!this.flatPlumRasters) this.flatPlumRasters = new Map();
      const key = `${radius.toFixed(3)}:${this.bloomDirection(angle)}`; if (this.flatPlumRasters.has(key)) return this.flatPlumRasters.get(key);
      const source = this.orientedBloomRaster(radius, angle, true); if (!source) return null;
      const colors = Object.values(INK).map(color => { const n = parseInt(color.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; });
      const tint = original => {
        const data = new Uint8ClampedArray(original.length);
        for (let at = 0; at < data.length; at += 4) if (original[at + 3]) {
          const pixel = at / 4, x = pixel % source.canvas.width, y = Math.floor(pixel / source.canvas.width), grain = noise(x, y, 107);
          const tone = grain > 0.94 ? 2 : grain > 0.78 ? 3 : 1;
          data.set([...colors[tone], original[at + 3]], at);
        }
        return data;
      };
      const data = tint(source.data), partData = source.partData.map(tint), width = source.canvas.width, height = source.canvas.height;
      const primary = this.bloomPrimaryGeometry(), rotation = finite(source.rotation), scale = radius / primary.extent / 2;
      const dx = (primary.spiralHub.x - primary.center.x) * scale, dy = (primary.spiralHub.y - primary.center.y) * scale;
      const displayCenter = { x: source.center.x + dx * Math.cos(rotation) - dy * Math.sin(rotation),
        y: source.center.y + dx * Math.sin(rotation) + dy * Math.cos(rotation) };
      const entry = { ...source, source, data, partData, color: INK.body, palette: colors,
        displayCenter,
        canvas: this.rasterCanvas(data, width, height), parts: partData.map(part => this.rasterCanvas(part, width, height)) };
      this.flatPlumRasters.set(key, entry);
      while (this.flatPlumRasters.size > 12) this.flatPlumRasters.delete(this.flatPlumRasters.keys().next().value);
      return entry;
    }

    drawPlumExplosion(innerRadius, outerRadius, progress, alpha = 1, angle = -Math.PI / 2) {
      if (progress < 0 || progress >= 1) return;
      const radius = innerRadius + (outerRadius - innerRadius) * progress, fade = Math.pow(1 - progress, 0.75) * alpha;
      this.drawInkCut(radius, angle, TAU, fade * 0.9);
    }

    drawBladeTrace() {
      // Body and held steel communicate the basic cut; never a guard-to-target tether.
    }

    drawCircleCut(radius, progress, alpha, color, angle = -Math.PI / 2) {
      this.drawInkCut(radius, angle, TAU * clamp(progress), alpha);
    }

    drawDashRipple(radius, progress, alpha = 1) {
      const p = clamp(progress);
      if (p >= 1) return;
      const stamp = this.dashRippleRaster(radius, p);
      this.drawPixelStamp(stamp.canvas, stamp.left, stamp.top, alpha * Math.pow(1 - p, 0.65));
    }

    dashRippleRaster(radius, progress) {
      if (!this.dashRippleRasters) this.dashRippleRasters = new Map();
      const phase = Math.round(clamp(progress) * 24), key = `${radius}:${phase}`;
      if (this.dashRippleRasters.has(key)) return this.dashRippleRasters.get(key);
      const r = Math.max(12, radius * (0.20 + 0.80 * phase / 24)), flatten = 0.46;
      const halfX = Math.ceil(r / 2) + 1, halfY = Math.ceil(r * flatten / 2) + 1, width = halfX * 2 + 1, height = halfY * 2 + 1;
      const data = new Uint8ClampedArray(width * height * 4), palette = Object.values(INK).map(hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; });
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const xx = (x - halfX) * 2 + 1, yy = ((y - halfY) * 2 + 1) / flatten, rr = Math.hypot(xx, yy), a = Math.atan2(yy, xx);
        const band = (r - rr) / (17 + Math.sin(a * 9) * 2 + Math.sin(a * 17) * 1.5), grain = noise(x, y, 107);
        if (band < 0 || band > 1 || band > 0.83 && grain > 0.68) continue;
        const tone = band < 0.12 ? 0 : band > 0.78 ? 3 : band > 0.24 && band < 0.56 && grain > 0.58 ? 2 : 1;
        data.set([...palette[tone], 255], (y * width + x) * 4);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, width, height, left: -halfX * 2, top: -halfY * 2, radius: r, flatten, palette, pixelStep: 2 };
      this.dashRippleRasters.set(key, entry);
      while (this.dashRippleRasters.size > 96) this.dashRippleRasters.delete(this.dashRippleRasters.keys().next().value);
      return entry;
    }

    drawLandingWaves(effects) {
      const landed = effects.filter(effect => effect.source === 'landing' && ['burst', 'knockback'].includes(effect.type));
      const serials = new Set();
      for (const effect of [...landed.filter(item => item.type === 'burst'), ...landed.filter(item => item.type === 'knockback')]) {
        if (Number.isFinite(effect.dashSerial)) {
          if (serials.has(effect.dashSerial)) continue;
          serials.add(effect.dashSerial);
        }
        if (effect.type === 'knockback' && effects.some(item => item.type === 'burst' && item.source === 'landing' && Math.hypot(item.x - effect.x, item.y - effect.y) < 1)) continue;
        const p = finite(effect.age) / Math.max(0.02, finite(effect.duration, 0.42));
        if (p < 0 || p >= 1) continue;
        this.ctx.save(); this.ctx.translate(effect.x, effect.y); this.drawDashRipple(effect.radius, p); this.ctx.restore();
      }
    }

    inkCutRaster(radius, start, span) {
      if (!this.inkCutRasters) this.inkCutRasters = new Map();
      const key = `${radius}:${start.toFixed(5)}:${span.toFixed(5)}`; let stamp = this.inkCutRasters.get(key);
      if (!stamp) {
        const half = Math.ceil(radius / 2) + 1, width = half * 2 + 1, data = new Uint8ClampedArray(width * width * 4);
        const palette = Object.values(INK).map(hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; });
        for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
          const xx = (x - half) * 2 + 1, yy = (y - half) * 2 + 1, r = Math.hypot(xx, yy), a = Math.atan2(yy, xx);
          const offset = ((a - start) % TAU + TAU) % TAU;
          if (r > radius || offset > span + 1e-8) continue;
          const grain = noise(x, y, 107), thickness = 17 + Math.sin(a * 9) * 2 + Math.sin(a * 17) * 1.5;
          const band = (radius - r) / thickness;
          if (band > 1 || (band > 0.83 && grain > 0.68)) continue;
          const color = band < 0.12 ? 0 : band > 0.78 ? 3 : band > 0.24 && band < 0.56 && grain > 0.58 ? 2 : 1;
          const at = (y * width + x) * 4; data.set([...palette[color], 255], at);
        }
        stamp = { canvas: this.rasterCanvas(data, width, width), data, pixelStep: 2, center: half, radius, start, span, palette };
        this.inkCutRasters.set(key, stamp);
        while (this.inkCutRasters.size > 64) this.inkCutRasters.delete(this.inkCutRasters.keys().next().value);
      }
      return stamp;
    }

    drawInkCut(radius, start, span, alpha = 1) {
      if (span <= 0 || alpha <= 0) return;
      const stamp = this.inkCutRaster(radius, start, span);
      this.drawPixelStamp(stamp.canvas, -stamp.center * 2, -stamp.center * 2, alpha);
    }

    // R7 uses the same native ink material and original five masks as R4–6.
    // All coordinates below are on one hub-centred, two-world-pixel grid.
    inkBloomSource(radius, angle = -Math.PI / 2) {
      if (!this.inkBloomSources) this.inkBloomSources = new Map();
      const key = `${radius.toFixed(3)}:${finite(angle, -Math.PI / 2).toFixed(5)}`;
      if (this.inkBloomSources.has(key)) return this.inkBloomSources.get(key);
      const flower = this.flatPlumRaster(radius * 0.93, angle); if (!flower) return null;
      const circle = this.inkCutRaster(radius, angle, TAU), half = circle.center, width = circle.canvas.width;
      const flowerOffset = { x: Math.round(half - flower.displayCenter.x), y: Math.round(half - flower.displayCenter.y) };
      const place = original => {
        const data = new Uint8ClampedArray(width * width * 4);
        for (let y = 0; y < flower.canvas.height; y++) for (let x = 0; x < flower.canvas.width; x++) {
          const xx = x + flowerOffset.x, yy = y + flowerOffset.y, from = (y * flower.canvas.width + x) * 4;
          if (xx < 0 || yy < 0 || xx >= width || yy >= width || !original[from + 3]) continue;
          data.set(original.subarray(from, from + 4), (yy * width + xx) * 4);
        }
        return data;
      };
      const flowerData = place(flower.data), flowerPartData = flower.partData.map(place), circleData = circle.data;
      const data = new Uint8ClampedArray(circleData);
      for (let at = 0; at < data.length; at += 4) if (flowerData[at + 3]) data.set(flowerData.subarray(at, at + 4), at);
      const angles = new Float32Array(width * width);
      for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
        const a = Math.atan2(y + 0.5 - half, x + 0.5 - half);
        angles[y * width + x] = ((a - angle) % TAU + TAU) % TAU / TAU;
      }
      const entry = { radius, flowerRadius: radius * 0.93, angle, flower, flowerOffset, flowerData, flowerPartData,
        circle, circleData, data, angles, width, height: width, center: { x: half, y: half }, displayCenter: { x: half, y: half },
        pixelStep: 2, palette: circle.palette, canvas: this.rasterCanvas(data, width, width),
        parts: flowerPartData.map(part => this.rasterCanvas(part, width, width)) };
      this.inkBloomSources.set(key, entry);
      while (this.inkBloomSources.size > 3) this.inkBloomSources.delete(this.inkBloomSources.keys().next().value);
      return entry;
    }

    drawInkBloom(x, y, radius, progress, alpha = 1, options = {}) {
      const source = this.inkBloomSource(radius, options.angle); if (!source || progress <= 0) return;
      let stamp = source;
      if (progress < 1) {
        if (!this.inkBloomRevealRasters) this.inkBloomRevealRasters = new Map();
        const stage = Math.max(1, Math.ceil(clamp(progress) * 32)), key = `${radius}:${finite(options.angle, -Math.PI / 2).toFixed(5)}:${stage}`;
        stamp = this.inkBloomRevealRasters.get(key);
        if (!stamp) {
          const data = new Uint8ClampedArray(source.circleData);
          for (let at = 0; at < source.angles.length; at++) if (source.angles[at] > stage / 32) data.fill(0, at * 4, at * 4 + 4);
          // Each authored petal appears whole, exactly like R4–6. Only the
          // surrounding ring is traced angularly; no fan slices cut the flower.
          for (let part = 0; part < 5; part++) {
            const reveal = Math.min(1, clamp(stage / 32 * 5 - part) * 3); if (!reveal) continue;
            const pixels = source.flowerPartData[part];
            for (let at = 0; at < pixels.length; at += 4) if (pixels[at + 3]) {
              data.set(pixels.subarray(at, at + 4), at); data[at + 3] = Math.round(pixels[at + 3] * reveal);
            }
          }
          stamp = { data, canvas: this.rasterCanvas(data, source.width, source.height) };
          this.inkBloomRevealRasters.set(key, stamp);
          while (this.inkBloomRevealRasters.size > 8) this.inkBloomRevealRasters.delete(this.inkBloomRevealRasters.keys().next().value);
        }
      }
      this.drawPixelStamp(stamp.canvas, x - source.center.x * 2, y - source.center.y * 2, alpha);
    }

    inkBloomUnravelSource(radius, angle = -Math.PI / 2) {
      if (!this.inkBloomUnravelSources) this.inkBloomUnravelSources = new Map();
      const key = `${radius.toFixed(3)}:${finite(angle, -Math.PI / 2).toFixed(5)}`;
      if (this.inkBloomUnravelSources.has(key)) return this.inkBloomUnravelSources.get(key);
      const source = this.inkBloomSource(radius, angle); if (!source) return null;
      const { width, height } = source, releaseRanks = new Uint8Array(width * height), releaseValues = new Float32Array(width * height);
      const occupied = new Uint8Array(width * height), births = [];
      const materialOrders = new Float32Array(width * height), localOrders = new Float32Array(width * height);
      const primary = this.bloomPrimaryGeometry(), scale = source.flowerRadius / primary.extent / 2;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const at = y * width + x; if (!source.data[at * 4 + 3]) continue;
        let part = -1;
        for (let p = 0; p < 5; p++) if (source.flowerPartData[p][at * 4 + 3]) { part = p; break; }
        if (part >= 0) {
          const fx = x - source.flowerOffset.x, fy = y - source.flowerOffset.y, flower = source.flower;
          const fine = fy * flower.canvas.width + fx, mapped = flower.source.sourceMap ? flower.source.sourceMap[fine] : fine;
          const sx = (mapped % flower.canvas.width + 0.5) / scale - 0.5;
          const sy = (Math.floor(mapped / flower.canvas.width) + 0.5) / scale - 0.5;
          const ix = Math.floor(sx), iy = Math.floor(sy), dx = sx - ix, dy = sy - iy, field = primary.components[part].releaseField;
          let value = 0, weight = 0;
          for (const [ox, oy, w] of [[0, 0, (1-dx)*(1-dy)], [1, 0, dx*(1-dy)], [0, 1, (1-dx)*dy], [1, 1, dx*dy]]) {
            const xx = ix + ox, yy = iy + oy;
            if (xx < 0 || yy < 0 || xx >= 64 || yy >= 64 || !Number.isFinite(field[yy * 64 + xx])) continue;
            value += field[yy * 64 + xx] * w; weight += w;
          }
          if (!weight) {
            let best = Infinity;
            for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) {
              const xx = ix + ox, yy = iy + oy;
              if (xx < 0 || yy < 0 || xx >= 64 || yy >= 64 || !Number.isFinite(field[yy * 64 + xx])) continue;
              const distance = Math.hypot(xx-sx, yy-sy);
              if (distance < best) { best = distance; value = field[yy*64+xx]; weight = 1; }
            }
          }
          const local = clamp(value / (weight || 1) + Math.sin(x*.73+y*.91)*.012);
          localOrders[at] = local;
          materialOrders[at] = clamp(part*.17 + local*.32);
          releaseRanks[at] = Math.max(1, Math.min(24, Math.ceil((part*.17 + Math.max(0,local-.10)*.32)*24)));
        } else {
          // A tiny wrapped disturbance breaks both ends of the circular front;
          // the flower itself never receives a straight angular slice.
          const order = ((source.angles[at] + Math.sin(x*.43+y*.57)*.012) % 1 + 1) % 1;
          localOrders[at] = order; materialOrders[at] = order;
          releaseRanks[at] = Math.max(1, Math.min(24, Math.ceil(Math.max(0,order-.035)*24)));
        }
      }
      for (let part = 0; part < 6; part++) {
        const mask = part < 5 ? source.flowerPartData[part] : source.circleData, candidates = [];
        for (let row = 4; row < height - 4; row += 7) for (let col = 4; col < width - 4; col += 7) {
          const fineX = col + Math.round((noise(col, row, part + 171) - 0.5) * 6);
          const fineY = row + Math.round((noise(col, row, part + 179) - 0.5) * 6), anchor = fineY * width + fineX;
          if (!mask[anchor * 4 + 3] || (part === 5 && source.flowerData[anchor * 4 + 3])) continue;
          const origin = { x: (fineX + 0.5 - source.center.x) * 2, y: (fineY + 0.5 - source.center.y) * 2 };
          const turn = Math.floor(noise(col, row, part + 183) * 3) - 1;
          const direction = ((Math.round(Math.atan2(origin.y, origin.x) / (Math.PI / 4)) + turn) % 8 + 8) % 8;
          const leaf = this.smallPetalRaster(direction), indices = []; let valid = true, low = 1, high = 0;
          for (let y = 0; y < leaf.height && valid; y++) for (let x = 0; x < leaf.width; x++) if (leaf.rows[y][x] !== '0') {
            const xx = fineX - Math.floor(leaf.width / 2) + x, yy = fineY - Math.floor(leaf.height / 2) + y, at = yy * width + xx;
            if (xx < 0 || yy < 0 || xx >= width || yy >= height || occupied[at] || !mask[at * 4 + 3] || (part === 5 && source.flowerData[at * 4 + 3])) { valid = false; break; }
            indices.push(at); low = Math.min(low, materialOrders[at]); high = Math.max(high, materialOrders[at]);
          }
          if (!valid || !indices.length || high - low > 0.15) continue;
          const releaseFrame = Math.max(1, Math.min(24, Math.ceil((high + (part < 5 ? 0.020 : 0.035)) * 24)));
          for (const at of indices) occupied[at] = 1;
          candidates.push({ origin, sourceOrigin: origin, releaseTime: releaseFrame / 24, releaseFrame, part, kind: part === 5 ? 'circle' : 'flower',
            sourceIndex: anchor, fineX, fineY, direction, maskRows: leaf.rows, sourceIndices: new Uint32Array(indices) });
        }
        candidates.sort((a, b) => a.releaseFrame - b.releaseFrame || a.sourceIndex - b.sourceIndex);
        const count = Math.min(candidates.length, part === 5 ? 72 : radius > 300 ? 44 : 18);
        for (let n = 0; n < count; n++) {
          const birth = candidates[Math.floor((n + 0.5) / count * candidates.length)];
          for (const at of birth.sourceIndices) releaseRanks[at] = birth.releaseFrame;
          births.push(birth);
        }
      }
      for (let at = 0; at < releaseRanks.length; at++) releaseValues[at] = releaseRanks[at] / 24;
      const entry = { source, releaseRanks, releaseValues, materialOrders, localOrders, births, budPatches: births, direction: this.bloomDirection(angle), phaseCount: 24 };
      this.inkBloomUnravelSources.set(key, entry);
      while (this.inkBloomUnravelSources.size > 3) this.inkBloomUnravelSources.delete(this.inkBloomUnravelSources.keys().next().value);
      return entry;
    }

    inkBloomUnravelRaster(radius, progress, angle = -Math.PI / 2) {
      const plan = this.inkBloomUnravelSource(radius, angle); if (!plan) return null;
      const stage = Math.max(0, Math.min(24, Math.floor(clamp(progress) * 24 + 1e-8)));
      if (!stage) return { ...plan, stage, canvas: plan.source.canvas, data: plan.source.data };
      if (!this.inkBloomUnravelRasters) this.inkBloomUnravelRasters = new Map();
      const key = `${radius}:${finite(angle, -Math.PI / 2).toFixed(5)}:${stage}`;
      if (this.inkBloomUnravelRasters.has(key)) return this.inkBloomUnravelRasters.get(key);
      const data = new Uint8ClampedArray(plan.source.data);
      for (let at = 0; at < plan.releaseRanks.length; at++) if (plan.releaseRanks[at] && plan.releaseRanks[at] <= stage) data.fill(0, at * 4, at * 4 + 4);
      const entry = { ...plan, stage, data, canvas: this.rasterCanvas(data, plan.source.width, plan.source.height) };
      this.inkBloomUnravelRasters.set(key, entry);
      while (this.inkBloomUnravelRasters.size > 8) this.inkBloomUnravelRasters.delete(this.inkBloomUnravelRasters.keys().next().value);
      return entry;
    }

    inkBloomReleasedParticles(radius, ageSeconds, seed = 0, options = {}) {
      const plan = this.inkBloomUnravelSource(radius, options.angle); if (!plan) return [];
      const duration = finite(options.sourceDuration, 0.42), lifetime = finite(options.lifetime, 0.85), particles = [];
      for (let i = 0; i < plan.births.length; i++) {
        if (this.reduced && i % 2) continue;
        const birth = plan.births[i], birthTime = birth.releaseTime * duration, age = ageSeconds - birthTime;
        if (age < -1e-9 || age >= lifetime || ageSeconds <= 0) continue;
        const a = Math.atan2(birth.origin.y, birth.origin.x), flightAge = Math.max(0, age - 0.03), speed = 150 + noise(i, seed, 33) * 140;
        const phase = noise(i, seed, 34) * TAU, flutter = this.reduced ? 0 : (Math.sin(phase + flightAge * 2.5) - Math.sin(phase)) * 10;
        const x = birth.origin.x + Math.cos(a) * speed * flightAge - Math.sin(a) * flutter;
        const y = birth.origin.y + Math.sin(a) * speed * flightAge + Math.cos(a) * flutter + 10 * flightAge * flightAge;
        const distanceFade = clamp((radius * 1.20 - Math.hypot(x, y)) / (radius * 0.24));
        particles.push({ id: i, birth, birthTime, age: Math.max(0, age), lifetime, x, y,
          angle: birth.direction * Math.PI / 4 + flightAge * (0.8 + noise(i, seed, 36)),
          alpha: clamp((lifetime - age) / Math.max(0.01, lifetime - 0.15)) * distanceFade, color: i % 5 ? INK.body : INK.highlight });
      }
      return particles;
    }

    drawInkBloomReleasedPetals(x, y, radius, ageSeconds, seed = 0, options = {}) {
      for (const petal of this.inkBloomReleasedParticles(radius, ageSeconds, seed, options))
        this.petal(x + petal.x, y + petal.y, petal.angle, 4 + petal.id % 2, petal.color, petal.alpha * finite(options.alpha, 1));
    }

    drawInkBloomDisintegration(x, y, radius, progress, alpha = 1, seed = 0, options = {}) {
      const t = Math.max(0, finite(progress)), unravel = this.inkBloomUnravelRaster(radius, clamp(t), options.angle); if (!unravel) return;
      if (t < 1) this.drawPixelStamp(unravel.canvas, x - unravel.source.center.x * 2, y - unravel.source.center.y * 2, alpha);
      if (!options.sourceOnly) this.drawInkBloomReleasedPetals(x, y, radius, t * finite(options.sourceDuration, 0.42), seed, { ...options, alpha });
    }

    drawOpeningCut(radius, progress, color) {
      const ctx = this.ctx, r = radius * (0.09 + progress * 0.44);
      if (progress > 0.72) return;
      const end = -Math.PI / 2 + progress * TAU;
      for (const [width, tone] of [[6, '#b25d9c'], [3, color], [2, '#fff3e7']]) {
        ctx.strokeStyle = this.alphaColor(tone, 1 - progress * 0.4); ctx.lineWidth = width;
        ctx.beginPath(); ctx.arc(0, 0, r, end - 0.45, end); ctx.stroke();
      }
    }

    drawPerfectedCut(radius, progress, alpha, seed = finite(this.pose?.attack?.id), options = {}) {
      const dissolve = (progress - 0.40) / 0.60;
      if (options.flower !== false) {
        if (progress <= 0.40) this.drawInkBloom(0, 0, radius, clamp(progress * 0.7 / 0.24), 0.95, options);
        else this.drawInkBloomDisintegration(0, 0, radius, dissolve, 0.95, seed, { ...options, sourceDuration: 0.42 });
      }
      this.drawScatteredCuts(radius, progress, alpha, seed, finite(options.rank, 7));
    }

    drawScatteredCuts(radius, progress, alpha = 1, seed = 0, rank = 7) {
      if (progress < 0 || progress >= 1) return;
      // Broad, long blade ribbons share the one authoritative fused hit. Their
      // paths are clipped to the real radius and are not additional attacks.
      const count = this.reduced ? (rank >= 7 ? 7 : rank >= 6 ? 5 : 3) : (rank >= 7 ? 11 : rank >= 6 ? 8 : 5);
      for (let i = 0; i < count; i++) {
        const delay = rank < 7 && i === 0 ? 0 : noise(i, seed, 14) * 0.53, local = clamp((progress - delay) / 0.40);
        if (local <= 0 || local >= 1) continue;
        const a = noise(i, seed, 15) * TAU, distance = Math.sqrt(noise(i, seed, 16)) * radius * 0.63;
        const x = Math.cos(a) * distance, y = Math.sin(a) * distance;
        const heading = noise(i, seed, 17) * TAU;
        const length = radius * (0.60 + noise(i, seed, 19) * 0.40);
        const thickness = 14 + noise(i, seed, 18) * 14;
        const visible = Math.sin(local * Math.PI) * alpha;
        const reach = Math.min(1, local * 5);
        this.drawPixelRibbon(x, y, heading, length, thickness, reach, i % 3 ? 0.02 : 0.13, visible, radius);
      }
    }

    drawPixelRibbon(x, y, heading, length, thickness, reach, curve, alpha, radius) {
      if (!this.ribbonRasters) this.ribbonRasters = new Map();
      const phase = Math.max(1, Math.round(reach * 8)), clippedReach = phase / 8;
      const key = [heading.toFixed(4), Math.round(length), Math.round(thickness), phase, curve, Math.round(radius), Math.round(x), Math.round(y)].join(':');
      let stamp = this.ribbonRasters.get(key);
      if (!stamp) {
        const cos = Math.cos(heading), sin = Math.sin(heading), span = length * clippedReach;
        const pad = thickness + length * curve, halfX = Math.abs(cos) * span / 2 + Math.abs(sin) * pad;
        const halfY = Math.abs(sin) * span / 2 + Math.abs(cos) * pad;
        const left = Math.floor((x - halfX) / 2) * 2, top = Math.floor((y - halfY) / 2) * 2;
        const width = Math.max(1, Math.ceil(halfX)), height = Math.max(1, Math.ceil(halfY));
        const data = new Uint8ClampedArray(width * height * 4), palette = [[169, 71, 136], [250, 155, 200], [255, 240, 232]];
        const bands = new Float32Array(257), bends = new Float32Array(257);
        for (let i = 1; i < 256; i++) {
          const wave = Math.sin(i / 256 * Math.PI);
          bands[i] = Math.pow(wave, 0.72) * thickness / 2; bends[i] = wave * length * curve;
        }
        for (let row = 0; row < height; row++) for (let col = 0; col < width; col++) {
          const xx = left + col * 2 + 1, yy = top + row * 2 + 1;
          if (xx * xx + yy * yy > radius * radius) continue;
          const dx = xx - x, dy = yy - y, t = (dx * cos + dy * sin) / span + 0.5;
          if (t <= 0 || t >= 1) continue;
          const sample = Math.round(t * 256), band = bands[sample];
          const distance = Math.abs(-dx * sin + dy * cos - bends[sample]);
          if (distance > band) continue;
          const rgb = palette[distance <= band * 0.50 ? 2 : distance <= band * 0.78 ? 1 : 0], at = (row * width + col) * 4;
          data[at] = rgb[0]; data[at + 1] = rgb[1]; data[at + 2] = rgb[2]; data[at + 3] = 255;
        }
        stamp = { canvas: this.rasterCanvas(data, width, height), data, pixelStep: 2, left, top, length, thickness, palette, radius };
        this.ribbonRasters.set(key, stamp);
        while (this.ribbonRasters.size > 128) this.ribbonRasters.delete(this.ribbonRasters.keys().next().value);
      }
      this.drawPixelStamp(stamp.canvas, stamp.left, stamp.top, Math.ceil(clamp(alpha) * 4) / 4);
      return stamp;
    }

    drawEnemy(enemy) {
      const ctx = this.ctx, type = enemy.type || 'melee';
      const radius = Math.max(4, finite(enemy.radius, 12));
      const boss = type === 'boss';
      const scale = boss ? radius / 13 : Math.max(0.9, radius / 11);
      ctx.save(); ctx.translate(enemy.x, enemy.y);
      ctx.fillStyle = boss ? 'rgba(7,14,12,.48)' : 'rgba(7,20,16,.35)';
      ctx.beginPath(); ctx.ellipse(0, 3, radius * 1.15, radius * 0.42, 0, 0, TAU); ctx.fill();
      this.drawEnemyMarked(enemy);
      if (enemy.petalAttached) this.petal(0, -39 * scale - (this.reduced ? 0 : Math.sin(this.time * 3) * 2), 0.2, 4.3, '#ffc2dc');
      if (finite(enemy.hp) < finite(enemy.maxHp, 1) || boss) {
        const barW = boss ? 62 : 29;
        const barY = -35 * scale - (enemy.petalAttached ? 13 : 0);
        ctx.fillStyle = 'rgba(13,24,22,.8)'; ctx.fillRect(-barW / 2 - 1, barY - 1, barW + 2, 5);
        ctx.fillStyle = boss ? '#e69870' : '#d4ba91';
        ctx.fillRect(-barW / 2, barY, barW * clamp(enemy.hp / Math.max(1, finite(enemy.maxHp, 1))), 3);
      }
      ctx.restore();
    }

    drawEnemyMarked(enemy) {
      const type = enemy.type || 'melee', radius = Math.max(4, finite(enemy.radius, 12)), boss = type === 'boss';
      const scale = boss ? radius / 13 : Math.max(0.9, radius / 11);
      const face = enemy.face === -1 || enemy.face === 1 ? enemy.face : finite(this.state?.player?.x) < finite(enemy.x) ? -1 : 1;
      const walk = this.reduced ? 0 : Math.sin(finite(this.time) * (boss ? 5 : 9) + finite(enemy.id) * 1.7);
      const stamp = this.enemyFigureRaster(type, scale, walk, face);
      this.drawPixelStamp(stamp.canvas, stamp.left, stamp.top);
      const time = finite(this.time), markedFlash = finite(enemy.petalHitFlashUntil) > time;
      if (markedFlash) {
        const age = Math.max(0, time - finite(enemy.petalHitFlashFrom, time));
        const ivory = !this.reduced && Math.floor(age / 0.055) % 2 === 0;
        this.drawPixelStamp(ivory ? stamp.ivory : stamp.pink, stamp.left, stamp.top, this.reduced ? 0.28 : 0.82);
      } else if (finite(enemy.flashUntil) > time) this.drawPixelStamp(stamp.ivory, stamp.left, stamp.top, this.reduced ? 0.24 : 0.72);
      if (enemy.petalAttached) this.drawPixelStamp(stamp.outline, stamp.left, stamp.top, 0.95);
      return stamp;
    }

    enemyFigureRaster(type, scale, walk, face) {
      if (!this.enemyFigureRasters) this.enemyFigureRasters = new Map();
      const stride = Math.round(walk * 1.6), key = `${type}:${scale.toFixed(4)}:${stride}:${face}`;
      if (this.enemyFigureRasters.has(key)) return this.enemyFigureRasters.get(key);
      const left = -Math.ceil((32 * scale + 4) / 2) * 2, top = -Math.ceil((42 * scale + 4) / 2) * 2;
      const width = Math.ceil((-left + 32 * scale + 4) / 2), height = Math.ceil((-top + 10 * scale + 4) / 2);
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d'), saved = this.ctx;
      ctx.imageSmoothingEnabled = false; ctx.setTransform(0.5, 0, 0, 0.5, -left / 2, -top / 2);
      try { this.ctx = ctx; this.drawFigure(0, 0, type, scale, stride / 1.6, face); } finally { this.ctx = saved; }
      const data = ctx.getImageData(0, 0, width, height).data;
      for (let at = 0; at < data.length; at += 4) {
        if (data[at + 3] < 96) data.fill(0, at, at + 4); else data[at + 3] = 255;
      }
      const outlineData = new Uint8ClampedArray(data.length), pinkData = new Uint8ClampedArray(data.length), ivoryData = new Uint8ClampedArray(data.length);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const at = (y * width + x) * 4;
        if (data[at + 3]) { pinkData.set([250, 146, 190, 255], at); ivoryData.set([255, 240, 221, 255], at); continue; }
        let adjacent = false;
        for (let dy = -1; dy <= 1 && !adjacent; dy++) for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < width && yy < height && data[(yy * width + xx) * 4 + 3]) { adjacent = true; break; }
        }
        if (adjacent) outlineData.set([241, 128, 179, 255], at);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, outlineData, pinkData, ivoryData,
        outline: this.rasterCanvas(outlineData, width, height), pink: this.rasterCanvas(pinkData, width, height), ivory: this.rasterCanvas(ivoryData, width, height),
        left, top, width, height, type, scale, stride, face, pixelStep: 2 };
      this.enemyFigureRasters.set(key, entry);
      while (this.enemyFigureRasters.size > 96) this.enemyFigureRasters.delete(this.enemyFigureRasters.keys().next().value);
      return entry;
    }

    drawFigure(x, y, type, scale, walk, face) {
      const ctx = this.ctx;
      const boss = type === 'boss', ranged = type === 'ranged', charger = type === 'charger';
      const hero = type === 'hero';
      const palette = hero ? ['#d5dfce', '#51685b', '#95627f'] : boss ? ['#713e3f', '#d29161', '#e5bb8d'] : ranged ? ['#8c8d66', '#53684d', '#c6b788'] : charger ? ['#8c5f48', '#5c4c3f', '#bb9670'] : ['#576b60', '#344b44', '#a38f74'];
      ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(scale * face, scale);
      const stride = Math.round(walk * 1.6);
      ctx.fillStyle = '#222e2b'; ctx.fillRect(-7, -7, 5, 9 + stride); ctx.fillRect(3, -7, 5, 9 - stride);
      ctx.fillStyle = '#1b2724'; ctx.fillRect(-9, 0 + stride, 7, 3); ctx.fillRect(3, 0 - stride, 8, 3);
      ctx.fillStyle = palette[1]; ctx.fillRect(-9, -24, 18, 19); ctx.fillRect(-12, -21, 5, 13); ctx.fillRect(8, -20, 5, 12);
      ctx.fillStyle = palette[0]; ctx.fillRect(-7, -25, 13, 14); ctx.fillRect(-9, -13, 17, 7);
      ctx.fillStyle = palette[2]; ctx.fillRect(-9, -10, 18, 3); ctx.fillRect(-1, -23, 3, 13);
      ctx.fillStyle = '#c3a27e'; ctx.fillRect(-5, -32, 10, 9); ctx.fillRect(10, -12, 4, 4);
      ctx.fillStyle = '#202c29'; ctx.fillRect(-6, -35, 12, 5); ctx.fillRect(-6, -32, 3, 5);
      if (boss) {
        ctx.fillStyle = '#bd985e'; ctx.fillRect(-7, -37, 14, 3); ctx.fillRect(-9, -25, 5, 5); ctx.fillRect(5, -25, 5, 5);
        ctx.fillStyle = '#dad5bd'; ctx.fillRect(13, -31, 4, 28); ctx.fillRect(10, -6, 10, 3);
        ctx.fillStyle = '#532d32'; ctx.fillRect(-13, -24, 5, 23);
      } else if (ranged) {
        ctx.strokeStyle = '#d6bc7a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, -27); ctx.quadraticCurveTo(27, -16, 14, -5); ctx.stroke();
        ctx.strokeStyle = '#aaaf8d'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(14, -27); ctx.lineTo(14, -5); ctx.stroke();
        ctx.fillStyle = '#4b4e36'; ctx.fillRect(-11, -31, 21, 3);
      } else if (charger) {
        ctx.fillStyle = '#ab987a'; ctx.fillRect(14, -28, 5, 16); ctx.fillRect(11, -28, 7, 5);
        ctx.fillStyle = '#77513b'; ctx.fillRect(14, -13, 3, 13);
        ctx.fillStyle = '#b68b62'; ctx.fillRect(-8, -27, 4, 6); ctx.fillRect(6, -27, 4, 6);
      } else {
        ctx.fillStyle = '#c3cebb'; ctx.fillRect(16, -27, 2, 22); ctx.fillRect(12, -8, 10, 2);
        ctx.fillStyle = '#9e8062'; ctx.fillRect(16, -5, 2, 6);
        ctx.fillStyle = palette[2]; ctx.fillRect(-6, -32, 13, 2); ctx.fillRect(-10, -32, 5, 3);
      }
      ctx.restore();
    }

    armorPetals(player) {
      const count = Math.max(0, Math.min(24, Math.floor(finite(player.petals))));
      const centre = this.combatCenter(player), petals = [];
      for (let i = 0; i < count; i++) {
        const a = TAU * i / count + (this.reduced ? 0 : this.time * 0.9);
        petals.push({ id: i, x: centre.x + Math.cos(a) * 26, y: centre.y + Math.sin(a) * 12,
          angle: a + 0.7, front: Math.sin(a) >= 0 });
      }
      return petals;
    }

    drawPetals(player, layer = 'front') {
      for (const petal of this.armorPetals(player)) if (petal.front === (layer !== 'back')) this.petal(petal.x, petal.y, petal.angle, 4, '#ffc4de', 0.95);
    }

    drawProjectile(projectile) {
      const ctx = this.ctx;
      const radius = Math.max(2, finite(projectile.radius, 4));
      const angle = Math.atan2(finite(projectile.vy), finite(projectile.vx));
      ctx.save(); ctx.translate(projectile.x, projectile.y); ctx.rotate(angle);
      const color = projectile.enemy ? '#f5b56d' : '#d2b6ff';
      ctx.strokeStyle = this.alphaColor(color, 0.3); ctx.lineWidth = radius;
      ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(0, 0); ctx.stroke();
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(radius + 4, 0); ctx.lineTo(-radius, -radius * 0.6); ctx.lineTo(-radius, radius * 0.6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    drawTelegraph(effect) {
      if (effect.friendly && (effect.source === 'rain' || effect.skillId === 'plum_rain' || effect.rain)) return;
      const t = clamp(finite(effect.age) / Math.max(0.01, finite(effect.duration, 1)));
      const ctx = this.ctx, r = Math.max(2, finite(effect.radius, 70));
      const pattern = effect.pattern || 'circle';
      const friendly = Boolean(effect.friendly);
      ctx.save(); ctx.translate(finite(effect.x), finite(effect.y));
      ctx.strokeStyle = friendly ? '#d6b8ef' : '#ffc287';
      ctx.fillStyle = friendly ? 'rgba(198,156,226,.065)' : 'rgba(225,106,62,.15)';
      ctx.lineWidth = friendly ? 1 : 2;
      if (pattern === 'line') {
        const length = Math.max(1, finite(effect.length, r * 3));
        // Core line radius is a half-width, matching circle radius semantics.
        const width = Math.max(10, finite(effect.width, r * 2));
        ctx.rotate(finite(effect.angle));
        ctx.fillRect(0, -width / 2, length, width);
        ctx.strokeRect(0, -width / 2, length, width);
        ctx.fillStyle = `rgba(255,168,88,${0.1 + t * 0.25})`;
        ctx.fillRect(0, -width / 2, length * t, width);
        for (let x = 24; x < length; x += 35) {
          ctx.beginPath(); ctx.moveTo(x - 6, -5); ctx.lineTo(x, 0); ctx.lineTo(x - 6, 5); ctx.stroke();
        }
      } else {
        this.pixelDisc(0, 0, r, friendly ? '#805c95' : '#b95637', friendly ? 0.16 : 0.28);
        this.pixelRing(0, 0, r, friendly ? '#d6b8ef' : '#ffc287', 0.95, 3);
        ctx.strokeStyle = friendly ? '#f5d0ed' : '#ffdd9c'; ctx.lineWidth = friendly ? 1.5 : 3;
        this.pixelRing(0, 0, r - 3, friendly ? '#f5d0ed' : '#ffdd9c', 1, 4, t);
        ctx.globalAlpha = 0.22 + t * 0.22;
        this.pixelDisc(0, 0, r * t, friendly ? '#c996e3' : '#ee8156', 0.28);
        ctx.globalAlpha = 0.9;
        if (!friendly) {
          ctx.fillStyle = '#ffe1ad'; ctx.font = 'bold 18px serif'; ctx.textAlign = 'center'; ctx.fillText('!', 0, 6);
        }
      }
      ctx.restore();
    }

    drawEffect(effect) {
      if (!effect.enemy && (effect.type === 'slash' || effect.type === 'flower') && effect.duration <= 0.7) return;
      const duration = Math.max(0.02, finite(effect.duration, 0.5));
      const t = clamp(finite(effect.age) / duration);
      if (t >= 1) return;
      const ctx = this.ctx, x = finite(effect.x), y = finite(effect.y), r = Math.max(1, finite(effect.radius, 70));
      const alpha = Math.pow(1 - t, 0.65);
      const color = effect.color || PINK;
      ctx.save(); ctx.translate(x, y);
      switch (effect.type) {
        case 'slash': {
          if (effect.enemy) {
            ctx.rotate(finite(effect.angle));
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#e97865'; ctx.lineWidth = 17 * (1 - t) + 2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0); ctx.stroke();
            ctx.strokeStyle = '#ffdeaa'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0); ctx.stroke();
            break;
          }
          break;
        }
        case 'flower': break; // The rank-specific actor choreography owns friendly cuts.
        case 'burst': {
          if (effect.source === 'rain') break;
          if (effect.source === 'landing') break; // Painted once on the floor, beneath actors.
          if (effect.source === 'attached_bonus') {
            // The target's full sprite mask owns this direct-hit flash.
            break;
          }
          if (effect.source === 'death') {
            for (let i = 0; i < 6; i++) {
              const a = i * 2.4;
              ctx.fillStyle = this.alphaColor(color, alpha * 0.5);
              ctx.fillRect(Math.cos(a) * t * r, Math.sin(a) * t * r * 0.65 - t * 6, 3, 3);
            }
            break;
          }
          const rr = r * (0.12 + Math.sin(t * Math.PI / 2) * 0.88);
          if (effect.source === 'bloom') {
            if (finite(effect.rank, 5) < 7) {
              const inner = finite(effect.flowerRadius, r / 1.5), p = finite(effect.age) / 0.34;
              this.drawFilledPlumMotif(inner, 1, clamp(1 - p * 2), { circle: false });
              this.drawPlumExplosion(inner, r, p, 1);
              this.drawScatteredCuts(r, p, alpha, finite(effect.id), finite(effect.rank, 5)); break;
            }
            this.drawInkBloomDisintegration(0, 0, finite(effect.flowerRadius, r), t, 1, finite(effect.id), { angle: effect.angle, sourceDuration: 0.42 });
            break;
          } else {
            this.pixelDisc(0, 0, rr * 0.55, '#f3b9c6', alpha * 0.20);
            this.pixelRing(0, 0, rr * 0.9, color, alpha * 0.85, 3);
          }
          for (let i = 0; i < 9; i++) {
            const a = TAU * i / 9 + finite(effect.id) * 0.2;
            this.petal(Math.cos(a) * rr, Math.sin(a) * rr, a + t * 3, 3.3 * (1 - t * 0.5), color, alpha);
          }
          break;
        }
        case 'rain': {
          // Main draw uses the independent pre-actor registry. This direct path
          // remains useful to isolated previews without painting a second copy.
          ctx.translate(-x, -y);
          const rank = finite(effect.rank, finite(this.state?.skills?.plum_rain, 1));
          this.drawRainStrike({ ...effect, rank, kind: effect.kind || (effect.sword === false || rank >= 5 && effect.sword !== true ? 'petal' : 'sword'), fallDuration: duration }, finite(effect.age));
          break;
        }
        case 'dash': {
          // Moving actor ghosts own travel. A fixed launch flare would look
          // like a second dodge pulse, separate from the one landing wave.
          break;
        }
        case 'knockback': {
          if (effect.source === 'landing') {
            break;
          }
          ctx.strokeStyle = this.alphaColor('#e5d4f8', alpha * 0.65); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, r * (0.1 + t), 0, TAU); ctx.stroke();
          for (let i = 0; i < 8; i++) {
            const a = i * TAU / 8;
            ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * t, Math.sin(a) * r * t);
            ctx.lineTo(Math.cos(a) * r * (t + 0.1), Math.sin(a) * r * (t + 0.1)); ctx.stroke();
          }
          break;
        }
        case 'death': {
          for (let i = 0; i < 6; i++) {
            const a = i * 2.4;
            ctx.fillStyle = this.alphaColor(effect.color || '#d3b88e', alpha * 0.5);
            ctx.fillRect(Math.cos(a) * t * 23, Math.sin(a) * t * 16 - t * 6, 3, 3);
          }
          break;
        }
        case 'aura': {
          this.pixelRing(0, 0, r * (0.55 + t * 0.4), color, alpha * 0.45, 2);
          break;
        }
        default: break;
      }
      ctx.restore();
    }

    bloomGeometry() {
      if (this.bloomShape) return this.bloomShape;
      const atlas = window.CHEON_HERO_ATLAS?.effects?.bloomAtlas;
      if (!this.bloomAtlas.complete || !this.bloomAtlas.naturalWidth || !atlas?.frames?.length) return null;
      const frame = atlas.frames[1] || atlas.frames[0], size = 64;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (typeof ctx.getImageData !== 'function') return null;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.bloomAtlas, frame.x, frame.y, frame.w, frame.h, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size)?.data;
      if (!data || data.length !== size * size * 4) return null;
      const solid = i => i >= 0 && i < size * size && data[i * 4 + 3] >= 128;
      const creamAt = i => solid(i) && data[i * 4] > 225 && data[i * 4 + 1] > 185 && data[i * 4 + 2] > 170;
      const bounds = { minX: size, minY: size, maxX: -1, maxY: -1 };
      for (let i = 0; i < size * size; i++) if (solid(i)) {
        const x = i % size, y = Math.floor(i / size);
        bounds.minX = Math.min(bounds.minX, x); bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y); bounds.maxY = Math.max(bounds.maxY, y);
      }
      if (bounds.maxX < 0) return null;
      const center = { x: (bounds.minX + bounds.maxX + 1) / 2, y: (bounds.minY + bounds.maxY + 1) / 2 };
      const labels = new Int16Array(size * size).fill(-1), components = [];
      for (let first = 0; first < labels.length; first++) {
        if (!solid(first) || labels[first] >= 0) continue;
        const label = components.length, stack = [first], pixels = []; labels[first] = label;
        while (stack.length) {
          const i = stack.pop(), x = i % size, y = Math.floor(i / size); pixels.push(i);
          for (const n of [x > 0 ? i - 1 : -1, x < size - 1 ? i + 1 : -1, y > 0 ? i - size : -1, y < size - 1 ? i + size : -1]) {
            if (solid(n) && labels[n] < 0) { labels[n] = label; stack.push(n); }
          }
        }
        components.push({ label, pixels });
      }
      const petals = components.filter(c => c.pixels.length > 12).sort((a, b) => b.pixels.length - a.pixels.length).slice(0, 5);
      for (const part of petals) {
        const sums = part.pixels.reduce((acc, i) => [acc[0] + i % size + 0.5 - center.x,
          acc[1] + Math.floor(i / size) + 0.5 - center.y], [0, 0]);
        part.angle = (Math.atan2(sums[1], sums[0]) + Math.PI / 2 + TAU) % TAU;
      }
      // The approved atlas has five separated curved petals; do not invent new lobes.
      petals.sort((a, b) => a.angle - b.angle);
      if (petals.length === 5 && petals[0].angle > Math.PI / 5) petals.unshift(petals.pop());
      const parts = Array.from({ length: 5 }, () => []);
      let extent = 1;
      for (let i = 0; i < labels.length; i++) {
        if (!solid(i)) continue;
        const px = i % size, py = Math.floor(i / size), x = px + 0.5 - center.x, y = py + 0.5 - center.y;
        extent = Math.max(extent, Math.hypot(x, y) + 0.5);
        const boundary = px === 0 || py === 0 || px === size - 1 || py === size - 1 || !solid(i - 1) || !solid(i + 1) || !solid(i - size) || !solid(i + size);
        const cream = creamAt(i) && (!creamAt(i - 1) || !creamAt(i + 1) || !creamAt(i - size) || !creamAt(i + size));
        if (!boundary && !cream) continue;
        let part = petals.findIndex(c => c.label === labels[i]);
        if (part < 0) part = Math.floor(((Math.atan2(y, x) + Math.PI / 2 + Math.PI / 5 + TAU) % TAU) / (TAU / 5));
        parts[part].push({ x, y, cream });
      }
      const petalCanvases = petals.map(part => {
        const layer = document.createElement('canvas'); layer.width = layer.height = size;
        const painter = layer.getContext('2d'); painter.imageSmoothingEnabled = false;
        for (const i of part.pixels) {
          painter.fillStyle = `rgba(${data[i * 4]},${data[i * 4 + 1]},${data[i * 4 + 2]},${data[i * 4 + 3] / 255})`;
          painter.fillRect(i % size, Math.floor(i / size), 1, 1);
        }
        return layer;
      });
      const fragmentOrigins = petals.flatMap(part => {
        const samples = [];
        for (let n = 0; n < 7; n++) {
          const i = part.pixels[Math.floor((n + 0.5) / 7 * part.pixels.length)];
          samples.push({ x: i % size + 0.5 - center.x, y: Math.floor(i / size) + 0.5 - center.y });
        }
        return samples;
      });
      this.bloomShape = { canvas, parts, petals, labels, petalCanvases, fragmentOrigins, extent, size, center, bounds, sourceFrame: 1 };
      return this.bloomShape;
    }

    drawBloomTexture(x, y, radius, alpha) {
      const shape = this.bloomGeometry();
      if (!shape) return;
      const ctx = this.ctx, scale = radius / shape.extent, size = shape.size * scale;
      ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.imageSmoothingEnabled = false;
      ctx.drawImage(shape.canvas, Math.round(x - shape.center.x * scale), Math.round(y - shape.center.y * scale), Math.round(size), Math.round(size));
      ctx.restore();
    }

    bloomDirection(angle = -Math.PI / 2) {
      return ((Math.round(finite(angle, -Math.PI / 2) / (Math.PI / 4)) % 8) + 8) % 8;
    }

    orientedBloomRaster(radius, angle = -Math.PI / 2, includeOutline = false) {
      const source = this.bloomRaster(radius, 1, includeOutline); if (!source) return null;
      const direction = this.bloomDirection(angle); if (direction === 6) return source;
      if (!this.orientedBloomRasters) this.orientedBloomRasters = new Map();
      const key = `${radius}:${direction}:${includeOutline}`; if (this.orientedBloomRasters.has(key)) return this.orientedBloomRasters.get(key);
      const rotation = direction * Math.PI / 4 + Math.PI / 2, cos = Math.cos(rotation), sin = Math.sin(rotation);
      const width = source.canvas.width, height = source.canvas.height, data = new Uint8ClampedArray(source.data.length);
      const partData = source.partData.map(part => new Uint8ClampedArray(part.length)), sourceMap = new Int32Array(width * height).fill(-1);
      const faceLabels = new Uint8Array(width * height), partFaces = source.partFaces.map(() => new Uint8Array(width * height));
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const dx = x + 0.5 - source.center.x, dy = y + 0.5 - source.center.y;
        const xx = Math.floor(source.center.x + dx * cos + dy * sin), yy = Math.floor(source.center.y - dx * sin + dy * cos);
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        const at = y * width + x, from = yy * width + xx; sourceMap[at] = from;
        data.set(source.data.subarray(from * 4, from * 4 + 4), at * 4); faceLabels[at] = source.faceLabels[from];
        for (let part = 0; part < 5; part++) if (source.partData[part][from * 4 + 3]) {
          partData[part].set(source.partData[part].subarray(from * 4, from * 4 + 4), at * 4);
          partFaces[part][at] = source.partFaces[part][from];
        }
      }
      if (!includeOutline) {
        this.texturePetalFaces(data, faceLabels, width, source.palette);
        for (let part = 0; part < partData.length; part++) this.texturePetalFaces(partData[part], partFaces[part], width, source.palette);
      }
      const dx = source.displayCenter.x - source.center.x, dy = source.displayCenter.y - source.center.y;
      const displayCenter = { x: source.center.x + dx * cos - dy * sin, y: source.center.y + dx * sin + dy * cos };
      const rotatePoint = point => {
        const x = point.x - source.center.x, y = point.y - source.center.y;
        return { ...point, x: source.center.x + x * cos - y * sin, y: source.center.y + x * sin + y * cos };
      };
      const crossSections = source.crossSections.map(part => part.map(section => ({ ...section,
        inner: rotatePoint(section.inner), outer: rotatePoint(section.outer) })));
      const entry = { ...source, source, data, partData, faceLabels, partFaces, crossSections, sourceMap, direction, rotation, displayCenter,
        canvas: this.rasterCanvas(data, width, height), parts: partData.map(part => this.rasterCanvas(part, width, height)) };
      this.orientedBloomRasters.set(key, entry);
      while (this.orientedBloomRasters.size > 4) this.orientedBloomRasters.delete(this.orientedBloomRasters.keys().next().value);
      return entry;
    }

    orientedUnravelSource(radius, angle = -Math.PI / 2) {
      const canonical = this.petalUnravelSource(radius); if (!canonical) return null;
      const direction = this.bloomDirection(angle); if (direction === 6) return canonical;
      if (!this.orientedUnravelSources) this.orientedUnravelSources = new Map();
      const key = `${radius}:${direction}`; if (this.orientedUnravelSources.has(key)) return this.orientedUnravelSources.get(key);
      const source = this.orientedBloomRaster(radius, angle), size = source.sourceMap.length, width = source.canvas.width;
      const releaseRanks = new Uint8Array(size), partRanks = canonical.partRanks.map(() => new Uint8Array(size));
      const ownership = new Int16Array(size).fill(-1), mapped = canonical.births.map(() => []);
      canonical.births.forEach((birth, index) => { for (const at of birth.sourceIndices) ownership[at] = index; });
      for (let at = 0; at < size; at++) {
        const from = source.sourceMap[at]; if (from < 0) continue;
        releaseRanks[at] = canonical.releaseRanks[from];
        for (let part = 0; part < 5; part++) partRanks[part][at] = canonical.partRanks[part][from];
        if (ownership[from] >= 0) mapped[ownership[from]].push(at);
      }
      const cos = Math.cos(source.rotation), sin = Math.sin(source.rotation), births = [];
      canonical.births.forEach((birth, index) => {
        const indices = mapped[index]; if (!indices.length) return;
        const rx = birth.sourceOrigin.x * cos - birth.sourceOrigin.y * sin, ry = birth.sourceOrigin.x * sin + birth.sourceOrigin.y * cos;
        let anchor = indices[0], best = Infinity;
        for (const at of indices) {
          const dx = (at % width + 0.5 - source.center.x) * 2 - rx, dy = (Math.floor(at / width) + 0.5 - source.center.y) * 2 - ry;
          const distance = dx * dx + dy * dy; if (distance < best) { best = distance; anchor = at; }
        }
        births.push({ ...birth, canonicalBirth: birth, sourceIndices: new Uint32Array(indices), sourceIndex: anchor,
          fineX: anchor % width, fineY: Math.floor(anchor / width),
          sourceOrigin: { x: (anchor % width + 0.5 - source.center.x) * 2, y: (Math.floor(anchor / width) + 0.5 - source.center.y) * 2 },
          origin: { x: (anchor % width + 0.5 - source.displayCenter.x) * 2, y: (Math.floor(anchor / width) + 0.5 - source.displayCenter.y) * 2 },
          direction: (birth.direction + direction + 2) % 8 });
      });
      const entry = { source, releaseRanks, partRanks, births, budPatches: births, canonical, direction };
      this.orientedUnravelSources.set(key, entry);
      while (this.orientedUnravelSources.size > 3) this.orientedUnravelSources.delete(this.orientedUnravelSources.keys().next().value);
      return entry;
    }

    drawBloomPetals(x, y, radius, progress, alpha = 1, options = {}) {
      const stamp = this.orientedBloomRaster(radius, options.angle);
      if (!stamp) return;
      if (progress >= 1) { this.drawPixelStamp(stamp.canvas, x - stamp.displayCenter.x * 2, y - stamp.displayCenter.y * 2, alpha); return; }
      for (let part = 0; part < stamp.parts.length; part++) {
        const reveal = clamp(progress * 5 - part);
        if (!reveal) continue;
        this.drawPixelStamp(stamp.parts[part], x - stamp.displayCenter.x * 2, y - stamp.displayCenter.y * 2, alpha * Math.min(1, reveal * 3));
      }
    }

    drawBloomDisintegration(x, y, flowerRadius, outerRadius, progress, alpha = 1, seed = 0, options = {}) {
      const ctx = this.ctx, t = Math.max(0, finite(progress)), unravel = this.petalUnravelRaster(flowerRadius, clamp(t), options.angle);
      if (!unravel) return;
      ctx.save(); ctx.imageSmoothingEnabled = false;
      const stamp = unravel.source;
      if (t < 1) this.drawPixelStamp(unravel.canvas, x - stamp.displayCenter.x * 2, y - stamp.displayCenter.y * 2, alpha);
      if (!options.sourceOnly) this.drawReleasedPetals(x, y, flowerRadius, outerRadius, t * finite(options.sourceDuration, 0.55), seed, { ...options, alpha });
      ctx.restore();
    }

    releasedPetalParticles(flowerRadius, ageSeconds, seed = 0, options = {}) {
      const plan = this.orientedUnravelSource(flowerRadius, options.angle); if (!plan) return [];
      const duration = finite(options.sourceDuration, 0.55), lifetime = finite(options.lifetime, 0.85), particles = [];
      for (let i = 0; i < plan.births.length; i++) {
        if (this.reduced && i % 2) continue;
        const birth = plan.births[i], birthTime = birth.releaseTime * duration, age = ageSeconds - birthTime;
        if (age < -1e-9 || age >= lifetime || ageSeconds <= 0) continue;
        const sx = birth.origin.x, sy = birth.origin.y, a = Math.atan2(birth.sourceOrigin.y, birth.sourceOrigin.x);
        const flightAge = Math.max(0, age - 0.03), speed = 150 + noise(i, seed, 33) * 140, phase = noise(i, seed, 34) * TAU;
        const flutter = this.reduced ? 0 : (Math.sin(phase + flightAge * 2.5) - Math.sin(phase)) * 10;
        const x = sx + Math.cos(a) * speed * flightAge - Math.sin(a) * flutter + (noise(i, seed, 35) - 0.5) * 12 * flightAge;
        const y = sy + Math.sin(a) * speed * flightAge + Math.cos(a) * flutter + 10 * flightAge * flightAge;
        const distanceFade = clamp((flowerRadius * 1.20 - Math.hypot(x, y)) / (flowerRadius * 0.24));
        particles.push({ id: i, birth, birthTime, age: Math.max(0, age), lifetime, x, y,
          angle: birth.direction * Math.PI / 4 + flightAge * (0.8 + noise(i, seed, 36)),
          alpha: clamp((lifetime - age) / Math.max(0.01, lifetime - 0.15)) * distanceFade, color: i % 5 ? '#f5aacb' : '#ffe4e3' });
      }
      return particles;
    }

    drawReleasedPetals(x, y, flowerRadius, outerRadius, ageSeconds, seed = 0, options = {}) {
      for (const petal of this.releasedPetalParticles(flowerRadius, ageSeconds, seed, options)) {
        this.petal(x + petal.x, y + petal.y, petal.angle, 4 + petal.id % 2, petal.color, petal.alpha * finite(options.alpha, 1));
      }
    }

    petalUnravelSource(radius) {
      if (!this.petalUnravelSources) this.petalUnravelSources = new Map();
      if (this.petalUnravelSources.has(radius)) return this.petalUnravelSources.get(radius);
      const source = this.bloomRaster(radius, 1), primary = this.bloomPrimaryGeometry();
      if (!source || !primary) return null;
      const width = source.canvas.width, height = source.canvas.height, scale = radius / primary.extent / 2;
      const releaseRanks = new Uint8Array(width * height), births = [], partRanks = [], budPatches = [];
      for (let part = 0; part < 5; part++) {
        const component = primary.components[part], field = component.releaseField;
        const ranks = new Uint8Array(width * height), orders = new Float32Array(width * height);
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
          const at = y * width + x; if (!source.partData[part][at * 4 + 3]) continue;
          const sx = (x + 0.5) / scale - 0.5, sy = (y + 0.5) / scale - 0.5;
          const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
          let value = 0, total = 0;
          for (const [dx, dy, weight] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
            const xx = ix + dx, yy = iy + dy;
            if (xx < 0 || yy < 0 || xx >= 64 || yy >= 64 || !Number.isFinite(field[yy * 64 + xx])) continue;
            value += field[yy * 64 + xx] * weight; total += weight;
          }
          if (!total) {
            let best = Infinity;
            for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
              const xx = ix + dx, yy = iy + dy;
              if (xx < 0 || yy < 0 || xx >= 64 || yy >= 64 || !Number.isFinite(field[yy * 64 + xx])) continue;
              const distance = Math.hypot(xx - sx, yy - sy);
              if (distance < best) { best = distance; value = field[yy * 64 + xx]; total = 1; }
            }
          }
          // Fine, bounded notches perturb only the current travelling front;
          // they never scatter holes through still-intact inner material.
          const order = clamp(value / (total || 1) + Math.sin(x * 0.73 + y * 0.91) * 0.012);
          const rank = Math.max(1, Math.min(22, Math.ceil(Math.max(0, order - 0.10) * 21 + part * 0.15)));
          orders[at] = order; ranks[at] = rank;
        }
        // Within the travelling front, complete small-leaf silhouettes remain
        // as source-coloured buds. Material between them loosens first; each
        // exact bud then releases as one leaf, instead of a guillotine section.
        const occupied = new Uint8Array(width * height), patches = [];
        for (let row = 4; row < height - 4; row += 8) for (let col = 4; col < width - 4; col += 8) {
          const fineX = col + Math.round((noise(col, row, part + 71) - 0.5) * 6);
          const fineY = row + Math.round((noise(col, row, part + 79) - 0.5) * 6), anchor = fineY * width + fineX;
          if (!source.partData[part][anchor * 4 + 3]) continue;
          const sourceOrigin = { x: (fineX + 0.5 - source.center.x) * 2, y: (fineY + 0.5 - source.center.y) * 2 };
          const origin = { x: (fineX + 0.5 - source.displayCenter.x) * 2, y: (fineY + 0.5 - source.displayCenter.y) * 2 };
          const turn = Math.floor(noise(col, row, part + 83) * 3) - 1;
          const direction = ((Math.round(Math.atan2(sourceOrigin.y, sourceOrigin.x) / (Math.PI / 4)) + turn) % 8 + 8) % 8;
          const leaf = this.smallPetalRaster(direction), indices = []; let valid = true, lastOrder = 0;
          for (let y = 0; y < leaf.height && valid; y++) for (let x = 0; x < leaf.width; x++) if (leaf.rows[y][x] !== '0') {
            const xx = fineX - Math.floor(leaf.width / 2) + x, yy = fineY - Math.floor(leaf.height / 2) + y, at = yy * width + xx;
            if (xx < 0 || yy < 0 || xx >= width || yy >= height || occupied[at] || !source.partData[part][at * 4 + 3]) { valid = false; break; }
            indices.push(at); lastOrder = Math.max(lastOrder, orders[at]);
          }
          if (!valid || !indices.length) continue;
          const releaseFrame = Math.max(1, Math.min(22, Math.ceil((lastOrder + 0.06) * 21 + part * 0.15)));
          for (const at of indices) occupied[at] = 1;
          const patch = { origin, sourceOrigin, releaseTime: releaseFrame / 24, releaseFrame, part, sourceIndex: anchor, fineX, fineY,
            direction, maskRows: leaf.rows, sourceIndices: new Uint32Array(indices) };
          patches.push(patch);
        }
        patches.sort((a, b) => a.releaseFrame - b.releaseFrame || a.sourceIndex - b.sourceIndex);
        const count = Math.min(patches.length, radius > 300 ? 44 : 18);
        for (let n = 0; n < count; n++) {
          const patch = patches[Math.floor((n + 0.5) / count * patches.length)];
          for (const at of patch.sourceIndices) ranks[at] = patch.releaseFrame;
          births.push(patch); budPatches.push(patch);
        }
        for (let at = 0; at < ranks.length; at++) if (ranks[at]) releaseRanks[at] = ranks[at];
        partRanks.push(ranks);
      }
      const entry = { source, releaseRanks, partRanks, births, budPatches };
      this.petalUnravelSources.set(radius, entry);
      while (this.petalUnravelSources.size > 3) this.petalUnravelSources.delete(this.petalUnravelSources.keys().next().value);
      return entry;
    }

    petalUnravelRaster(radius, progress, angle = -Math.PI / 2) {
      const plan = this.orientedUnravelSource(radius, angle); if (!plan) return null;
      const stage = Math.max(0, Math.min(24, Math.floor(clamp(progress) * 24 + 1e-8)));
      if (!stage) return { ...plan, stage, canvas: plan.source.canvas, data: plan.source.data };
      if (!this.petalUnravelRasters) this.petalUnravelRasters = new Map();
      const key = `${radius}:${this.bloomDirection(angle)}:${stage}`;
      if (this.petalUnravelRasters.has(key)) {
        const entry = this.petalUnravelRasters.get(key); this.petalUnravelRasters.delete(key); this.petalUnravelRasters.set(key, entry); return entry;
      }
      const data = new Uint8ClampedArray(plan.source.data);
      for (let i = 0; i < plan.releaseRanks.length; i++) if (plan.releaseRanks[i] && plan.releaseRanks[i] <= stage) data.fill(0, i * 4, i * 4 + 4);
      const entry = { ...plan, stage, data, canvas: this.rasterCanvas(data, plan.source.canvas.width, plan.source.canvas.height) };
      this.petalUnravelRasters.set(key, entry);
      while (this.petalUnravelRasters.size > 8) this.petalUnravelRasters.delete(this.petalUnravelRasters.keys().next().value);
      return entry;
    }

    drawPixelStamp(canvas, x, y, alpha = 1) {
      const ctx = this.ctx, transform = ctx.getTransform?.();
      ctx.save(); ctx.imageSmoothingEnabled = false; ctx.globalAlpha *= clamp(alpha);
      if (transform && [transform.a, transform.b, transform.c, transform.d, transform.e, transform.f].every(Number.isFinite) &&
          Math.abs(transform.b) < 1e-8 && Math.abs(transform.c) < 1e-8) {
        const left = Math.round(transform.a * x + transform.e), top = Math.round(transform.d * y + transform.f);
        const width = Math.round(canvas.width * 2 * transform.a), height = Math.round(canvas.height * 2 * transform.d);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(canvas, left, top, width, height);
      } else ctx.drawImage(canvas, Math.round(x / 2) * 2, Math.round(y / 2) * 2, canvas.width * 2, canvas.height * 2);
      ctx.restore();
    }

    bloomFrameSource(index) {
      if (!this.bloomFrameSources) this.bloomFrameSources = new Map();
      if (this.bloomFrameSources.has(index)) return this.bloomFrameSources.get(index);
      const frame = window.CHEON_HERO_ATLAS?.effects?.bloomAtlas?.frames?.[index];
      if (!frame || !this.bloomAtlas.complete || !this.bloomAtlas.naturalWidth) return null;
      const canvas = document.createElement('canvas'); canvas.width = frame.w; canvas.height = frame.h;
      const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
      if (typeof ctx.getImageData !== 'function') return null;
      ctx.drawImage(this.bloomAtlas, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
      const raw = ctx.getImageData(0, 0, frame.w, frame.h)?.data;
      if (!raw || raw.length !== frame.w * frame.h * 4) return null;
      const size = 64, data = new Uint8ClampedArray(size * size * 4), colors = new Map();
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const at = (y * size + x) * 4, from = (Math.floor((y + 0.5) * frame.h / size) * frame.w + Math.floor((x + 0.5) * frame.w / size)) * 4;
        if (raw[from + 3] < 128) continue;
        data.set([raw[from], raw[from + 1], raw[from + 2], 255], at);
        const key = `${raw[from]},${raw[from + 1]},${raw[from + 2]}`;
        if (!colors.has(key)) colors.set(key, [raw[from], raw[from + 1], raw[from + 2]]);
      }
      const palette = [...colors.values()].sort((a, b) => (a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722) - (b[0] * 0.2126 + b[1] * 0.7152 + b[2] * 0.0722));
      const ranks = new Map(palette.map((rgb, rank) => [rgb.join(','), rank])), indices = new Int16Array(size * size).fill(-1);
      for (let i = 0; i < indices.length; i++) if (data[i * 4 + 3]) indices[i] = ranks.get([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]].join(','));
      const contours = palette.map((_, rank) => paletteContours(indices, size, rank));
      const entry = { sourceFrame: index, size, data, palette, indices, contours };
      this.bloomFrameSources.set(index, entry); return entry;
    }

    bloomPrimaryGeometry() {
      if (this.bloomPrimaryShape) return this.bloomPrimaryShape;
      const source = this.bloomFrameSource(1), reference = this.bloomGeometry();
      if (!source || !reference?.petals || reference.petals.length !== 5) return null;
      const center = reference.center, extent = reference.extent, size = source.size;
      const components = reference.petals.map(petal => {
        const indices = new Int16Array(size * size).fill(-1);
        for (const at of petal.pixels) indices[at] = source.indices[at];
        const allowed = new Uint8Array(size * size), distance = new Float32Array(size * size).fill(Infinity);
        for (const at of petal.pixels) allowed[at] = 1;
        const byRadius = [...petal.pixels].sort((a, b) => Math.hypot(a % size + 0.5 - center.x, Math.floor(a / size) + 0.5 - center.y) -
          Math.hypot(b % size + 0.5 - center.x, Math.floor(b / size) + 0.5 - center.y));
        const outer = new Set(byRadius.slice(Math.floor(byRadius.length * 0.90)));
        const roots = byRadius.slice(0, Math.max(1, Math.floor(byRadius.length * 0.05)));
        const rootHub = { x: roots.reduce((sum, at) => sum + at % size + 0.5, 0) / roots.length,
          y: roots.reduce((sum, at) => sum + Math.floor(at / size) + 0.5, 0) / roots.length };
        const tips = [...outer].filter(at => {
          const x = at % size, y = Math.floor(at / size);
          return !x || !y || x === size - 1 || y === size - 1 || !allowed[at - 1] || !allowed[at + 1] || !allowed[at - size] || !allowed[at + size];
        });
        if (!tips.length) tips.push(byRadius.at(-1));
        const queue = [...tips]; for (const at of tips) distance[at] = 0;
        for (let q = 0; q < queue.length; q++) {
          const at = queue[q], x = at % size, y = Math.floor(at / size);
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if ((!dx && !dy) || x + dx < 0 || x + dx >= size || y + dy < 0 || y + dy >= size) continue;
            const next = at + dy * size + dx, value = distance[at] + (dx && dy ? Math.SQRT2 : 1);
            if (allowed[next] && value + 0.0001 < distance[next]) { distance[next] = value; queue.push(next); }
          }
        }
        let longest = 1; for (const at of petal.pixels) longest = Math.max(longest, distance[at]);
        for (const at of petal.pixels) distance[at] /= longest;
        return { sourceLabel: petal.label, pixels: petal.pixels,
          releaseField: distance, tipPixels: tips, rootHub,
          contours: source.palette.map((_, rank) => paletteContours(indices, size, rank)) };
      });
      const fragmentOrigins = [];
      for (let part = 0; part < 5; part++) {
        const pixels = components[part].pixels;
        for (let n = 0; n < 20; n++) {
          const at = pixels[Math.floor((n + 0.5) / 20 * pixels.length)];
          fragmentOrigins.push({ x: at % size + 0.5 - center.x, y: Math.floor(at / size) + 0.5 - center.y, part });
        }
      }
      // These are five genuinely separate source components, each with its own
      // full contour and colour bands. No ownership, sector or image partition.
      const spiralHub = { x: components.reduce((sum, part) => sum + part.rootHub.x, 0) / 5,
        y: components.reduce((sum, part) => sum + part.rootHub.y, 0) / 5 };
      this.bloomPrimaryShape = { ...source, center, extent, spiralHub, components, fragmentOrigins };
      return this.bloomPrimaryShape;
    }

    rasterCanvas(data, width, height) {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
      const image = ctx.createImageData?.(width, height);
      if (image?.data?.length === data.length && typeof ctx.putImageData === 'function') {
        image.data.set(data); ctx.putImageData(image, 0, 0); return canvas;
      }
      for (let y = 0; y < height; y++) for (let x = 0; x < width;) {
        const at = (y * width + x) * 4;
        if (!data[at + 3]) { x++; continue; }
        const r = data[at], g = data[at + 1], b = data[at + 2]; let end = x + 1;
        while (end < width) {
          const next = (y * width + end) * 4;
          if (!data[next + 3] || data[next] !== r || data[next + 1] !== g || data[next + 2] !== b) break;
          end++;
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(x, y, end - x, 1); x = end;
      }
      return canvas;
    }

    ensurePaintedBloomImage() {
      if (this.paintedBloomImage) return this.paintedBloomImage;
      const image = new Image(); this.paintedBloomImage = image;
      const previousLoad = image.onload;
      image.onload = (...args) => {
        if (typeof previousLoad === 'function') previousLoad.apply(image, args);
        if (this.destroyed) return;
        this.paintedBloomMaterial = null;
        for (const cache of [this.bloomRasters, this.orientedBloomRasters]) {
          if (cache) for (const key of cache.keys()) if (key.endsWith(':false')) cache.delete(key);
        }
        this.petalUnravelSources?.clear(); this.orientedUnravelSources?.clear(); this.petalUnravelRasters?.clear();
        if (this.bloomWarmupId != null) window.cancelIdleCallback?.(this.bloomWarmupId);
        this.warmBloomRasters();
      };
      image.src = 'assets/plum-blossom-painted-faces-v4.png';
      return image;
    }

    paintedFaceAt(data, index) {
      const at = index * 4, r = data[at], g = data[at + 1], b = data[at + 2];
      if (data[at + 3] < 240 || r - b > 140 || r + b - 2 * g > 240) return 0;
      if (g > 175 && r > 210 && b > 150) return 3;
      const middle = (r - 180) ** 2 + (g - 87) ** 2 + (b - 123) ** 2;
      const bright = (r - 223) ** 2 + (g - 145) ** 2 + (b - 176) ** 2;
      return bright < middle ? 2 : 1;
    }

    paintedAxis(pixels, size, hub) {
      const sorted = [...pixels].sort((a, b) => Math.hypot(a % size + 0.5 - hub.x, Math.floor(a / size) + 0.5 - hub.y) -
        Math.hypot(b % size + 0.5 - hub.x, Math.floor(b / size) + 0.5 - hub.y));
      const mean = indices => ({ x: indices.reduce((sum, at) => sum + at % size + 0.5, 0) / indices.length,
        y: indices.reduce((sum, at) => sum + Math.floor(at / size) + 0.5, 0) / indices.length });
      const root = mean(sorted.slice(0, Math.max(1, Math.floor(sorted.length * 0.015))));
      const outer = [...pixels].sort((a, b) => Math.hypot(a % size + 0.5 - root.x, Math.floor(a / size) + 0.5 - root.y) -
        Math.hypot(b % size + 0.5 - root.x, Math.floor(b / size) + 0.5 - root.y));
      return { root, tip: mean(outer.slice(Math.floor(outer.length * 0.9))) };
    }

    paintedProfile(pixels, size, axis) {
      const dx = axis.tip.x - axis.root.x, dy = axis.tip.y - axis.root.y, length = Math.hypot(dx, dy) || 1;
      const ux = dx / length, uy = dy / length, bins = 192;
      let minT = Infinity, maxT = -Infinity;
      const values = pixels.map(at => {
        const x = at % size + 0.5 - axis.root.x, y = Math.floor(at / size) + 0.5 - axis.root.y;
        const t = (x * ux + y * uy) / length, q = -x * uy + y * ux;
        minT = Math.min(minT, t); maxT = Math.max(maxT, t); return { t, q, at };
      });
      const low = new Float32Array(bins).fill(Infinity), high = new Float32Array(bins).fill(-Infinity);
      const row = t => Math.max(0, Math.min(bins - 1, Math.round((t - minT) / (maxT - minT || 1) * (bins - 1))));
      for (const point of values) { const bin = row(point.t); low[bin] = Math.min(low[bin], point.q); high[bin] = Math.max(high[bin], point.q); }
      for (let bin = 0; bin < bins; bin++) if (!Number.isFinite(low[bin])) {
        for (let offset = 1; offset < bins; offset++) {
          const candidate = [bin - offset, bin + offset].find(next => next >= 0 && next < bins && Number.isFinite(low[next]));
          if (candidate !== undefined) { low[bin] = low[candidate]; high[bin] = high[candidate]; break; }
        }
      }
      return { ...axis, ux, uy, length, bins, minT, maxT, low, high, values };
    }

    paintedBloomSource() {
      if (this.paintedBloomMaterial) return this.paintedBloomMaterial;
      const image = this.ensurePaintedBloomImage();
      if (!image.complete || !image.naturalWidth) return null;
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d'); if (typeof ctx.getImageData !== 'function') return null;
      ctx.drawImage(image, 0, 0); const raw = ctx.getImageData(0, 0, canvas.width, canvas.height)?.data;
      if (!raw || raw.length !== canvas.width * canvas.height * 4) return null;
      const size = 320, faces = new Uint8Array(size * size), labels = new Int32Array(size * size).fill(-1), components = [];
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const source = Math.floor((y + 0.5) * canvas.height / size) * canvas.width + Math.floor((x + 0.5) * canvas.width / size);
        faces[y * size + x] = this.paintedFaceAt(raw, source);
      }
      for (let at = 0; at < labels.length; at++) {
        if (!faces[at] || labels[at] >= 0) continue;
        const id = components.length, pixels = [at]; labels[at] = id;
        for (let n = 0; n < pixels.length; n++) {
          const point = pixels[n], x = point % size, y = Math.floor(point / size);
          for (const [xx, yy] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
            const next = yy * size + xx;
            if (xx < 0 || yy < 0 || xx >= size || yy >= size || !faces[next] || labels[next] >= 0) continue;
            labels[next] = id; pixels.push(next);
          }
        }
        components.push({ id, pixels });
      }
      const hub = { x: size * 0.5, y: size * 0.53 };
      const petals = components.filter(component => component.pixels.length > 1000).sort((a, b) => b.pixels.length - a.pixels.length).slice(0, 5);
      if (petals.length !== 5) return null;
      const angle = component => {
        const x = component.pixels.reduce((sum, at) => sum + at % size + 0.5, 0) / component.pixels.length;
        const y = component.pixels.reduce((sum, at) => sum + Math.floor(at / size) + 0.5, 0) / component.pixels.length;
        return (Math.atan2(y - hub.y, x - hub.x) + Math.PI / 2 + TAU) % TAU;
      };
      petals.sort((a, b) => angle(a) - angle(b));
      const rawFaces = faces.slice();
      for (const component of petals) {
        const kept = new Uint8Array(size * size), cleanupQueue = new Int32Array(size * size);
        component.sourceRegions = [];
        for (let face = 1; face <= 3; face++) {
          const seen = new Uint8Array(size * size); let largest = [];
          for (const seed of component.pixels) {
            if (faces[seed] !== face || seen[seed]) continue;
            const region = [seed]; seen[seed] = 1;
            for (let n = 0; n < region.length; n++) {
              const at = region[n], x = at % size, y = Math.floor(at / size);
              for (const [xx, yy] of [[x - 1,y],[x + 1,y],[x,y - 1],[x,y + 1],[x - 1,y - 1],[x + 1,y - 1],[x - 1,y + 1],[x + 1,y + 1]]) {
                const next = yy * size + xx;
                if (xx < 0 || yy < 0 || xx >= size || yy >= size || seen[next] || labels[next] !== component.id || faces[next] !== face) continue;
                seen[next] = 1; region.push(next);
              }
            }
            if (region.length > largest.length) largest = region;
          }
          for (const at of largest) kept[at] = face;
          component.sourceRegions.push({ face, retained: largest.length });
        }
        let cleanupEnd = 0;
        for (const at of component.pixels) if (kept[at]) cleanupQueue[cleanupEnd++] = at;
        for (let n = 0; n < cleanupEnd; n++) {
          const at = cleanupQueue[n], x = at % size, y = Math.floor(at / size);
          for (const [xx, yy] of [[x - 1,y],[x + 1,y],[x,y - 1],[x,y + 1]]) {
            const next = yy * size + xx;
            if (xx < 0 || yy < 0 || xx >= size || yy >= size || labels[next] !== component.id || kept[next]) continue;
            kept[next] = kept[at]; cleanupQueue[cleanupEnd++] = next;
          }
        }
        for (const at of component.pixels) faces[at] = kept[at];
        const axis = this.paintedAxis(component.pixels, size, hub), profile = this.paintedProfile(component.pixels, size, axis);
        let whiteSide = 0;
        for (const point of profile.values) if (faces[point.at] === 3) {
          const bin = Math.max(0, Math.min(profile.bins - 1, Math.round((point.t - profile.minT) / (profile.maxT - profile.minT) * (profile.bins - 1))));
          whiteSide += point.q - (profile.low[bin] + profile.high[bin]) / 2;
        }
        component.profile = profile; component.innerSide = whiteSide < 0 ? -1 : 1;
        const nearest = new Int32Array(size * size).fill(-1), queue = new Int32Array(size * size); let end = 0;
        for (const at of component.pixels) { nearest[at] = at; queue[end++] = at; }
        for (let n = 0; n < end; n++) {
          const at = queue[n], x = at % size, y = Math.floor(at / size);
          for (const [xx, yy] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
            const next = yy * size + xx;
            if (xx < 0 || yy < 0 || xx >= size || yy >= size || nearest[next] >= 0) continue;
            nearest[next] = nearest[at]; queue[end++] = next;
          }
        }
        component.nearest = nearest;
      }
      this.paintedBloomMaterial = { image, raw, width: canvas.width, height: canvas.height, size, faces, rawFaces, labels, components: petals };
      return this.paintedBloomMaterial;
    }

    resamplePaintCurve(points, count = 65) {
      const distances = [0];
      for (let n = 1; n < points.length; n++) distances[n] = distances[n - 1] + Math.hypot(points[n].x - points[n - 1].x, points[n].y - points[n - 1].y);
      const result = []; let segment = 1;
      for (let n = 0; n < count; n++) {
        const distance = distances.at(-1) * n / (count - 1);
        while (segment < points.length - 1 && distances[segment] < distance) segment++;
        const a = points[segment - 1], b = points[segment], t = (distance - distances[segment - 1]) / (distances[segment] - distances[segment - 1] || 1);
        result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
      return result;
    }

    paintedBoundaryArcs(pixels, size, root, tip) {
      const mask = new Int16Array(size * size).fill(-1); for (const at of pixels) mask[at] = 0;
      const loops = paletteContours(mask, size, 0), perimeter = loop => loop.reduce((sum, point, n) => {
        const next = loop[(n + 1) % loop.length]; return sum + Math.hypot(next.x - point.x, next.y - point.y);
      }, 0);
      const loop = loops.sort((a, b) => perimeter(b) - perimeter(a))[0]; if (!loop) return null;
      const nearest = point => loop.reduce((best, candidate, index) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < best.distance ?
        { index, distance: Math.hypot(candidate.x - point.x, candidate.y - point.y) } : best, { index: 0, distance: Infinity }).index;
      const start = nearest(root), end = nearest(tip), forwards = [], backwards = [];
      for (let n = start, guard = 0; guard < loop.length; n = (n + 1) % loop.length, guard++) { forwards.push(loop[n]); if (n === end) break; }
      for (let n = start, guard = 0; guard < loop.length; n = (n + loop.length - 1) % loop.length, guard++) { backwards.push(loop[n]); if (n === end) break; }
      const length = path => path.reduce((sum, point, n) => n ? sum + Math.hypot(point.x - path[n - 1].x, point.y - path[n - 1].y) : 0, 0);
      const inner = length(forwards) < length(backwards) ? forwards : backwards, outer = inner === forwards ? backwards : forwards;
      return { inner: this.resamplePaintCurve(inner), outer: this.resamplePaintCurve(outer) };
    }

    registeredPaintedPetal(data, width, height, scale, part, material, palette) {
      // The lower-left generated leaf has a bright flank inconsistent with the
      // other four. Register the accepted top leaf's actual paint into only
      // that original mask; do not reproduce the AI's erroneous long rim.
      const sourcePart = part === 3 ? 0 : part, component = material.components[sourcePart], pixels = [];
      for (let at = 0; at < width * height; at++) if (data[at * 4 + 3]) pixels.push(at);
      const guide = part < 2 ? [...PLUM_FACES[part].blade].reverse() : PLUM_FACES[part].blade;
      const target = this.paintedBoundaryArcs(pixels, width,
        { x: guide[0][0] * scale, y: guide[0][1] * scale }, { x: guide.at(-1)[0] * scale, y: guide.at(-1)[1] * scale });
      const sourceGuide = PAINTED_INNER_GUIDES[sourcePart].map(point => ({ x: point[0] / material.width * material.size, y: point[1] / material.height * material.size }));
      const source = this.paintedBoundaryArcs(component.pixels, material.size, sourceGuide[0], sourceGuide.at(-1));
      source.inner = this.resamplePaintCurve(sourceGuide);
      source.outer[0] = { ...source.inner[0] }; source.outer[source.outer.length - 1] = { ...source.inner.at(-1) };
      const labels = new Uint8Array(width * height), samples = new Int32Array(width * height).fill(-1);
      const sampleAt = (x, y) => {
        let gx = Math.max(0, Math.min(material.size - 1, Math.floor(x))), gy = Math.max(0, Math.min(material.size - 1, Math.floor(y)));
        let owner = gy * material.size + gx;
        if (material.labels[owner] !== component.id) owner = component.nearest[owner];
        gx = owner % material.size; gy = Math.floor(owner / material.size);
        const rawX = Math.min(material.width - 1, Math.floor((gx + 0.5) / material.size * material.width));
        const rawY = Math.min(material.height - 1, Math.floor((gy + 0.5) / material.size * material.height));
        return { face: material.faces[owner], index: rawY * material.width + rawX, owner };
      };
      // Inner arc is anchored inside the real white surface. Only head sections
      // with an actual adjacent bright surface crop their outer AA/middle lip.
      for (let n = 0; n < source.inner.length; n++) {
        const a = source.inner[n], b = source.outer[n];
        if (sampleAt(a.x, a.y).face !== 3) {
          let best = null;
          for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
            const candidate = sampleAt(a.x + dx, a.y + dy);
            if (candidate.face === 3 && (!best || dx * dx + dy * dy < best.distance)) best = { x: a.x + dx, y: a.y + dy, distance: dx * dx + dy * dy };
          }
          if (best) source.inner[n] = { x: best.x, y: best.y };
        }
        for (let u = 0.98; u >= 0.78; u -= 0.02) {
          const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u;
          if (sampleAt(x, y).face === 2) { source.outer[n] = { x, y }; break; }
        }
        if (part === 3 && n > 0 && n < source.inner.length - 1) {
          const inner = source.inner[n], outer = source.outer[n], dx = outer.x - inner.x, dy = outer.y - inner.y;
          const length = Math.hypot(dx, dy) || 1, ux = dx / length, uy = dy / length;
          let x = inner.x, y = inner.y;
          for (let step = 0; step < 16; step += 0.2) {
            const xx = x - ux * 0.2, yy = y - uy * 0.2, gx = Math.floor(xx), gy = Math.floor(yy), at = gy * material.size + gx;
            if (gx < 0 || gy < 0 || gx >= material.size || gy >= material.size || material.labels[at] !== component.id || material.faces[at] !== 3) break;
            x = xx; y = yy;
          }
          source.inner[n] = { x: x + ux * 0.1, y: y + uy * 0.1 };
        }
      }
      const write = (pixel, x, y) => { const sample = sampleAt(x, y); labels[pixel] = sample.face; samples[pixel] = sample.index; };
      const mapTriangle = (a, b, c, aa, bb, cc) => {
        const determinant = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y); if (Math.abs(determinant) < 0.001) return;
        const left = Math.max(0, Math.floor(Math.min(a.x,b.x,c.x))), right = Math.min(width - 1, Math.ceil(Math.max(a.x,b.x,c.x)));
        const top = Math.max(0, Math.floor(Math.min(a.y,b.y,c.y))), bottom = Math.min(height - 1, Math.ceil(Math.max(a.y,b.y,c.y)));
        for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
          const pixel = y * width + x; if (!data[pixel * 4 + 3] || labels[pixel]) continue;
          const u = ((b.y - c.y) * (x + 0.5 - c.x) + (c.x - b.x) * (y + 0.5 - c.y)) / determinant;
          const v = ((c.y - a.y) * (x + 0.5 - c.x) + (a.x - c.x) * (y + 0.5 - c.y)) / determinant, w = 1 - u - v;
          if (u < -0.001 || v < -0.001 || w < -0.001) continue;
          write(pixel, aa.x * u + bb.x * v + cc.x * w, aa.y * u + bb.y * v + cc.y * w);
        }
      };
      for (let n = 1; n < target.inner.length; n++) {
        mapTriangle(target.inner[n - 1], target.outer[n - 1], target.outer[n], source.inner[n - 1], source.outer[n - 1], source.outer[n]);
        mapTriangle(target.inner[n - 1], target.outer[n], target.inner[n], source.inner[n - 1], source.outer[n], source.inner[n]);
      }
      let fallback = 0;
      for (const pixel of pixels) if (!labels[pixel]) {
        const x = pixel % width + 0.5, y = Math.floor(pixel / width) + 0.5; let best = null;
        for (let n = 0; n < target.inner.length; n++) {
          const a = target.inner[n], b = target.outer[n], dx = b.x - a.x, dy = b.y - a.y;
          const u = clamp(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1));
          const distance = (x - a.x - dx * u) ** 2 + (y - a.y - dy * u) ** 2;
          if (!best || distance < best.distance) best = { n, u, distance };
        }
        const a = source.inner[best.n], b = source.outer[best.n]; write(pixel, a.x + (b.x - a.x) * best.u, a.y + (b.y - a.y) * best.u); fallback++;
      }
      this.texturePetalFaces(data, labels, width, palette);
      return { labels, samples, registration: { sourcePart, targetPart: part, componentId: component.id, method: 'paired-curved-boundary-arcs', source, target, fallback } };
    }

    texturePetalFaces(data, labels, width, palette) {
      for (let at = 0; at < labels.length; at++) {
        if (!labels[at]) continue;
        const grain = noise(at % width, Math.floor(at / width), 107);
        const delta = grain > 0.94 ? [29, 42, 37] : grain > 0.78 ? [-37, -28, -27] : [0, 0, 0];
        const base = palette[labels[at] - 1], pixel = at * 4;
        for (let channel = 0; channel < 3; channel++) data[pixel + channel] = Math.max(0, Math.min(255, base[channel] + delta[channel]));
      }
    }

    paintPetalFaces(data, width, height, scale, part, palette, crossSections = []) {
      const guide = PLUM_FACES[part], labels = new Uint8Array(width * height);
      for (let at = 0; at < labels.length; at++) if (data[at * 4 + 3]) labels[at] = 1;
      const points = part < 2 ? guide.blade : [...guide.blade].reverse(), curve = [];
      for (let segment = 0; segment < points.length - 1; segment++) {
        const a = points[Math.max(0, segment - 1)], b = points[segment], c = points[segment + 1], d = points[Math.min(points.length - 1, segment + 2)];
        for (let sample = 0; sample < 8; sample++) {
          const t = sample / 8, t2 = t * t, t3 = t2 * t;
          const coordinate = axis => 0.5 * (2 * b[axis] + (-a[axis] + c[axis]) * t +
            (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * t2 + (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * t3);
          const phase = (segment + t) / (points.length - 1);
          curve.push({ x: coordinate(0) * scale, y: coordinate(1) * scale, phase,
            radius: (1.1 + Math.sin(Math.PI * phase) * 0.9) * scale });
        }
      }
      curve.push({ x: points.at(-1)[0] * scale, y: points.at(-1)[1] * scale, phase: 1, radius: 0.8 * scale });
      const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height && data[(Math.floor(y) * width + Math.floor(x)) * 4 + 3];
      const projectBlade = side => {
        const blade = [];
        for (let n = 0; n < curve.length; n++) {
          const point = curve[n], before = curve[Math.max(0, n - 1)], after = curve[Math.min(curve.length - 1, n + 1)];
          const length = Math.hypot(after.x - before.x, after.y - before.y) || 1;
          const nx = -(after.y - before.y) / length * side, ny = (after.x - before.x) / length * side;
          let x = point.x, y = point.y, found = inside(x, y);
          for (let step = 0; !found && step < 8 * scale; step += 0.5) {
            x -= nx * 0.5; y -= ny * 0.5; found = inside(x, y);
          }
          if (!found) continue;
          for (let step = 0; step < 24 * scale && inside(x + nx * 0.5, y + ny * 0.5); step += 0.5) {
            x += nx * 0.5; y += ny * 0.5;
          }
          const taper = Math.pow(Math.max(0, Math.sin(Math.PI * point.phase)), 0.45);
          blade.push({ x, y, phase: point.phase, sample: n, radius: side > 0 ? point.radius : (0.35 + 3.0 * taper) * scale });
        }
        return blade;
      };
      const paintBlade = (blade, face, onlyFace = 0) => {
        for (let n = 1; n < blade.length; n++) {
          const a = blade[n - 1], b = blade[n], dx = b.x - a.x, dy = b.y - a.y, length2 = dx * dx + dy * dy || 1;
          if (length2 > (5 * scale) ** 2) continue;
          const radius = Math.max(a.radius, b.radius) + 0.35;
          const left = Math.max(0, Math.floor(Math.min(a.x, b.x) - radius)), right = Math.min(width - 1, Math.ceil(Math.max(a.x, b.x) + radius));
          const top = Math.max(0, Math.floor(Math.min(a.y, b.y) - radius)), bottom = Math.min(height - 1, Math.ceil(Math.max(a.y, b.y) + radius));
          for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
            const pixel = y * width + x; if (!data[pixel * 4 + 3] || onlyFace && labels[pixel] !== onlyFace) continue;
            const t = clamp(((x + 0.5 - a.x) * dx + (y + 0.5 - a.y) * dy) / length2);
            const brush = a.radius + (b.radius - a.radius) * t + (noise(x, y, 41 + part) - 0.5) * 0.65;
            if ((x + 0.5 - a.x - dx * t) ** 2 + (y + 0.5 - a.y - dy * t) ** 2 <= brush * brush) labels[pixel] = face;
          }
        }
      };
      const innerBlade = projectBlade(1), outerBlade = projectBlade(-1);
      const innerSamples = new Map(innerBlade.map(point => [point.sample, point]));
      let maximumDepth = 0;
      for (const outer of outerBlade) {
        const inner = innerSamples.get(outer.sample); if (!inner) continue;
        const depth = Math.max(0, Math.hypot(outer.x - inner.x, outer.y - inner.y) - inner.radius);
        crossSections.push({ sample: outer.sample, phase: outer.phase, inner: { ...inner }, outer: { x: outer.x, y: outer.y }, depth });
        maximumDepth = Math.max(maximumDepth, depth);
      }
      const sections = new Map(crossSections.map(section => [section.sample, section]));
      for (const outer of outerBlade) {
        const section = sections.get(outer.sample);
        if (!section) { outer.radius = 0; continue; }
        const bulge = clamp((section.depth / (maximumDepth || 1) - 0.35) / 0.45);
        const coverage = 0.28 + 0.55 * bulge;
        const taper = 0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(Math.PI * outer.phase)), 0.35);
        outer.radius = Math.max(0, Math.min(section.depth - scale, section.depth * coverage * taper));
      }
      // The bright face follows the long convex edge and broadens with the
      // actual leaf thickness. A thin middle-colour bridge beside white keeps
      // the three surfaces connected without a detached round highlight.
      paintBlade(outerBlade, 2);
      paintBlade(innerBlade.map(point => ({ ...point, radius: point.radius + scale })), 1, 2);
      paintBlade(innerBlade, 3);
      const fillWhitePolygon = polygon => {
        const left = Math.max(0, Math.floor(Math.min(...polygon.map(point => point.x)))), right = Math.min(width - 1, Math.ceil(Math.max(...polygon.map(point => point.x))));
        const top = Math.max(0, Math.floor(Math.min(...polygon.map(point => point.y)))), bottom = Math.min(height - 1, Math.ceil(Math.max(...polygon.map(point => point.y))));
        for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
          const pixel = y * width + x; if (!data[pixel * 4 + 3]) continue;
          let within = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[i], b = polygon[j];
            if ((a.y > y + 0.5) !== (b.y > y + 0.5) && x + 0.5 < (b.x - a.x) * (y + 0.5 - a.y) / (b.y - a.y) + a.x) within = !within;
          }
          if (within) labels[pixel] = 3;
        }
      };
      // Whiten only the actual narrow tail cross-sections, never a large round
      // brush centred at the root that would spill back over the broad leaf.
      const tail = crossSections.filter(section => section.phase >= 0.72).map(section => {
        const dx = section.outer.x - section.inner.x, dy = section.outer.y - section.inner.y;
        const thickness = Math.hypot(dx, dy) || 1, maximum = maximumDepth + 2 * scale;
        const phase = clamp((section.phase - 0.76) / 0.18), flow = phase * phase * (3 - 2 * phase);
        const narrow = clamp((0.55 - thickness / maximum) / 0.22), blend = flow * narrow;
        const whiteDepth = Math.min(thickness, section.inner.radius + (thickness - section.inner.radius) * blend);
        return { ...section, whiteEdge: { x: section.inner.x + dx / thickness * whiteDepth,
          y: section.inner.y + dy / thickness * whiteDepth } };
      });
      for (let n = 1; n < tail.length; n++) if (tail[n].phase - tail[n - 1].phase < 0.06) {
        fillWhitePolygon([tail[n - 1].inner, tail[n - 1].whiteEdge, tail[n].whiteEdge, tail[n].inner]);
      }
      if (tail.length) {
        const primary = this.bloomPrimaryGeometry(), hub = primary.spiralHub;
        const closest = primary.components[part].pixels.reduce((best, at) => {
          const distance = Math.hypot(at % 64 + 0.5 - hub.x, Math.floor(at / 64) + 0.5 - hub.y);
          return distance < best.distance ? { at, distance } : best;
        }, { at: 0, distance: Infinity }).at;
        fillWhitePolygon([tail.at(-1).inner, tail.at(-1).whiteEdge,
          { x: (closest % 64 + 0.5) * scale, y: (Math.floor(closest / 64) + 0.5) * scale }]);
      }
      // A few deliberate attached feather points follow the inner blade's flow.
      // They are paint inside the unchanged whole-petal mask, never loose chips.
      for (const [detail, phase] of [0.25, 0.48, 0.66].entries()) {
        const inner = innerBlade.reduce((best, point) => Math.abs(point.phase - phase) < Math.abs(best.phase - phase) ? point : best, innerBlade[0]);
        const section = inner && sections.get(inner.sample); if (!section) continue;
        const dx = section.outer.x - inner.x, dy = section.outer.y - inner.y, length = Math.hypot(dx, dy) || 1;
        const ux = dx / length, uy = dy / length, tx = -uy, ty = ux;
        const base = inner.radius - 0.25 * scale, extension = (0.65 + detail * 0.08) * scale;
        const lean = (detail % 2 ? -0.35 : 0.55) * scale;
        const triangle = [
          { x: inner.x + ux * base - tx * 0.65 * scale, y: inner.y + uy * base - ty * 0.65 * scale },
          { x: inner.x + ux * base + tx * 0.65 * scale, y: inner.y + uy * base + ty * 0.65 * scale },
          { x: inner.x + ux * (inner.radius + extension) + tx * lean, y: inner.y + uy * (inner.radius + extension) + ty * lean }
        ];
        const left = Math.max(0, Math.floor(Math.min(...triangle.map(point => point.x)))), right = Math.min(width - 1, Math.ceil(Math.max(...triangle.map(point => point.x))));
        const top = Math.max(0, Math.floor(Math.min(...triangle.map(point => point.y)))), bottom = Math.min(height - 1, Math.ceil(Math.max(...triangle.map(point => point.y))));
        for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
          const pixel = y * width + x; if (!data[pixel * 4 + 3]) continue;
          const sides = triangle.map((point, n) => {
            const next = triangle[(n + 1) % 3];
            return (next.x - point.x) * (y + 0.5 - point.y) - (next.y - point.y) * (x + 0.5 - point.x);
          });
          if (sides.every(side => side >= 0) || sides.every(side => side <= 0)) labels[pixel] = 3;
        }
      }
      this.texturePetalFaces(data, labels, width, palette);
      return labels;
    }

    bloomRaster(radius, index = 1, includeOutline = false) {
      if (!this.bloomRasters) this.bloomRasters = new Map();
      const key = `${radius}:${index}:${includeOutline}`;
      if (this.bloomRasters.has(key)) { const value = this.bloomRasters.get(key); this.bloomRasters.delete(key); this.bloomRasters.set(key, value); return value; }
      const source = this.bloomFrameSource(index), primary = this.bloomPrimaryGeometry();
      if (!source || !primary) return null;
      const scale = radius / primary.extent / 2, width = Math.ceil(source.size * scale), height = width;
      const data = new Uint8ClampedArray(width * height * 4);
      const palette = [[180, 87, 123], [223, 145, 176], source.palette.at(-1)];
      const parts = [], partData = index === 1 ? Array.from({ length: 5 }, () => new Uint8ClampedArray(data.length)) : [];
      const faceLabels = new Uint8Array(width * height), partFaces = [], crossSections = [], materialSamples = [], registration = [];
      const paintedMaterial = includeOutline ? null : this.paintedBloomSource();
      const shade = (pixels, contours, part) => {
        for (const band of contours) fillPaletteContours(pixels, width, height, scale, band, palette[0]);
        if (paintedMaterial && part !== undefined) {
          const result = this.registeredPaintedPetal(pixels, width, height, scale, part, paintedMaterial, palette);
          materialSamples[part] = result.samples; registration[part] = result.registration;
          return result.labels;
        }
        if (!includeOutline && part !== undefined) {
          crossSections[part] = [];
          return this.paintPetalFaces(pixels, width, height, scale, part, palette, crossSections[part]);
        }
        return new Uint8Array(width * height);
      };
      if (index === 1) {
        for (let part = 0; part < 5; part++) {
          const component = primary.components[part];
          partFaces[part] = shade(partData[part], component.contours, part);
          for (let at = 0; at < data.length; at += 4) if (partData[part][at + 3]) {
            data.set(partData[part].subarray(at, at + 4), at); faceLabels[at / 4] = partFaces[part][at / 4];
          }
        }
      } else shade(data, source.contours);
      for (const pixels of partData) parts.push(this.rasterCanvas(pixels, width, height));
      const entry = { sourceFrame: index, pixelStep: 2, center: { x: primary.center.x * scale, y: primary.center.y * scale },
        extent: primary.extent, radius, canvas: this.rasterCanvas(data, width, height), data, partData, parts, palette, faceLabels, partFaces, crossSections, materialSamples, registration,
        paintedAsset: paintedMaterial ? 'assets/plum-blossom-painted-faces-v4.png' : null,
        grainSeed: 107, grainThresholds: [0.78, 0.94], grainLight: [29, 42, 37], grainDry: [-37, -28, -27],
        bodySourceRank: Math.min(3, source.palette.length - 1), includeOutline, strokeFill: 'continuous-authored-faces', faceGuides: PLUM_FACES,
        brightSourceRank: Math.min(9, source.palette.length - 1), whiteSourceRank: source.palette.length - 1,
        displayCenter: { x: primary.spiralHub.x * scale, y: primary.spiralHub.y * scale } };
      this.bloomRasters.set(key, entry);
      // Four frames across three normal radii, with room for martial-book sizes.
      while (this.bloomRasters.size > 16) this.bloomRasters.delete(this.bloomRasters.keys().next().value);
      return entry;
    }

    bloomDissolveGeometry() {
      if (this.bloomDissolveShape) return this.bloomDissolveShape;
      const shape = this.bloomGeometry(); if (!shape) return null;
      this.bloomDissolveShape = { center: { x: shape.center.x * 2, y: shape.center.y * 2 }, extent: shape.extent * 2,
        bounds: shape.bounds, sourceFrame: 1 };
      return this.bloomDissolveShape;
    }

    pixelDisc(x, y, radius, color, alpha = 1) {
      const ctx = this.ctx, step = 4, r = Math.max(1, radius);
      ctx.save(); ctx.fillStyle = color; ctx.globalAlpha *= clamp(alpha);
      for (let row = -Math.floor(r / step); row <= Math.floor(r / step); row++) {
        const yy = row * step, edge = Math.floor(Math.sqrt(Math.max(0, r * r - yy * yy)) / step) * step;
        ctx.fillRect(Math.round((x - edge) / 2) * 2, Math.round((y + yy) / 2) * 2, edge * 2, step);
      }
      ctx.restore();
    }

    pixelRing(x, y, radius, color, alpha = 1, width = 2, progress = 1) {
      const ctx = this.ctx, count = Math.max(16, Math.ceil(radius * Math.PI / 2));
      const transform = ctx.getTransform?.(), valid = transform && [transform.a, transform.b, transform.c, transform.d, transform.e, transform.f].every(Number.isFinite);
      ctx.save(); ctx.fillStyle = color; ctx.globalAlpha *= clamp(alpha);
      if (valid) ctx.setTransform(1, 0, 0, 1, 0, 0);
      const pixel = valid ? Math.max(1, Math.round(Math.hypot(transform.a, transform.b) * width)) : width;
      for (let i = 0; i <= count * clamp(progress); i++) {
        const angle = -Math.PI / 2 + i / count * TAU;
        const px = x + Math.cos(angle) * radius, py = y + Math.sin(angle) * radius;
        const left = valid ? Math.round(transform.a * px + transform.c * py + transform.e - pixel / 2) : Math.round(px / 2) * 2 - width / 2;
        const top = valid ? Math.round(transform.b * px + transform.d * py + transform.f - pixel / 2) : Math.round(py / 2) * 2 - width / 2;
        ctx.fillRect(left, top, pixel, pixel);
      }
      ctx.restore();
    }

    flowerOutline(radius, progress, alpha, color) {
      if (progress <= 0) return;
      const shape = this.bloomGeometry();
      if (!shape) return;
      if (!this.flowerOutlineRasters) this.flowerOutlineRasters = new Map();
      const phase = Math.ceil(clamp(progress) * 60), key = `${radius}:${phase}`;
      if (this.flowerOutlineRasters.has(key)) {
        const stamp = this.flowerOutlineRasters.get(key); this.drawPixelStamp(stamp.canvas, -stamp.half * 2, -stamp.half * 2, alpha); return;
      }
      const scale = radius / shape.extent / 2, half = Math.ceil(radius / 2) + 2, width = half * 2 + 1;
      const data = new Uint8ClampedArray(width * width * 4);
      const line = (x0, y0, x1, y1, rgb) => {
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let error = dx + dy;
        for (;;) {
          if (x0 >= 0 && y0 >= 0 && x0 < width && y0 < width) data.set([...rgb, 255], (y0 * width + x0) * 4);
          if (x0 === x1 && y0 === y1) break;
          const next = error * 2; if (next >= dy) { error += dy; x0 += sx; } if (next <= dx) { error += dx; y0 += sy; }
        }
      };
      for (let part = 0; part < 5; part++) {
        const reveal = clamp(phase / 60 * 5 - part);
        if (reveal <= 0) continue;
        const points = shape.parts[part].slice(0, Math.ceil(shape.parts[part].length * reveal));
        const lookup = new Map(points.map(point => [`${point.x},${point.y}`, point]));
        for (const point of points) {
          const hex = point.cream ? INK.highlight : INK.body, n = parseInt(hex.slice(1), 16), rgb = [n >> 16, (n >> 8) & 255, n & 255];
          const x = Math.round(point.x * scale) + half, y = Math.round(point.y * scale) + half;
          line(x, y, x, y, rgb);
          for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [-1, 1]]) {
            const next = lookup.get(`${point.x + dx},${point.y + dy}`);
            if (!next || next.cream !== point.cream) continue;
            line(x, y, Math.round(next.x * scale) + half, Math.round(next.y * scale) + half, rgb);
          }
        }
      }
      const stamp = { canvas: this.rasterCanvas(data, width, width), data, half, pixelStep: 2 };
      this.flowerOutlineRasters.set(key, stamp);
      while (this.flowerOutlineRasters.size > 32) this.flowerOutlineRasters.delete(this.flowerOutlineRasters.keys().next().value);
      this.drawPixelStamp(stamp.canvas, -half * 2, -half * 2, alpha);
    }

    sword(x, y, color, scale = 1) {
      const stamp = this.plumSwordRaster(color, scale);
      this.drawPixelStamp(stamp.canvas, x - stamp.tip.x * 2, y - stamp.tip.y * 2, 1);
    }

    drawRainPetal(x, y, angle = 0, color = '#ffd0df') {
      const direction = ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8, stamp = this.fallingPetalRaster(direction, color);
      this.drawPixelStamp(stamp.canvas, x - stamp.center.x * 2, y - stamp.center.y * 2, 1);
    }

    fallingPetalRaster(direction = 0, color = '#ffd0df') {
      return this.rainPetalRaster(direction, color);
    }

    collectiblePetalRaster(direction = 0, color = '#ffd0df') {
      if (!this.collectiblePetalRasters) this.collectiblePetalRasters = new Map();
      const facing = ((Math.round(direction) % 8) + 8) % 8, key = `${facing}:${color}`;
      if (this.collectiblePetalRasters.has(key)) return this.collectiblePetalRasters.get(key);
      // Recover the earlier large falling leaf exactly, now reserved for loot.
      // The modest airborne skill leaf continues to use the detailed small glyph.
      const width = 27, height = 27, center = { x: 13.5, y: 13.5 }, data = new Uint8ClampedArray(width * height * 4);
      const angle = facing * Math.PI / 4, cos = Math.cos(angle), sin = Math.sin(angle), value = parseInt(color.slice(1), 16);
      const palette = [[111, 40, 79], [value >> 16, (value >> 8) & 255, value & 255], [255, 226, 230]];
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const dx = x + 0.5 - center.x, dy = y + 0.5 - center.y;
        const u = dx * cos + dy * sin, v = -dx * sin + dy * cos, yy = v / 10.5;
        if (Math.abs(yy) >= 1) continue;
        const bend = Math.sin((yy + 1) * Math.PI) * 1.6;
        const half = 9.5 * Math.sqrt(Math.max(0, 1 - yy * yy)) * (0.77 - yy * 0.19), distance = Math.abs(u - bend);
        if (distance > half) continue;
        const tone = half - distance < 1.25 || Math.abs(yy) > 0.94 ? 0 : u - bend < -half * 0.20 && yy < 0.25 ? 2 : 1;
        data.set([...palette[tone], 255], (y * width + x) * 4);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, width, height, center, pixelStep: 2, direction: facing, palette };
      this.collectiblePetalRasters.set(key, entry);
      while (this.collectiblePetalRasters.size > 16) this.collectiblePetalRasters.delete(this.collectiblePetalRasters.keys().next().value);
      return entry;
    }

    plumSwordRaster(color = '#e9c6dc', scale = 1) {
      if (!this.plumSwordRasters) this.plumSwordRasters = new Map();
      const key = `${color}:${scale}`; if (this.plumSwordRasters.has(key)) return this.plumSwordRasters.get(key);
      const baseWidth = 17, baseHeight = 61, base = new Uint8ClampedArray(baseWidth * baseHeight * 4);
      const palette = [[72, 40, 82], [148, 67, 117], [233, 198, 220], [255, 240, 221], [211, 158, 154]];
      const pixel = (x, y, tone) => { if (x >= 0 && y >= 0 && x < baseWidth && y < baseHeight) base.set([...palette[tone], 255], (y * baseWidth + x) * 4); };
      for (let y = 2; y < 14; y++) for (let x = 6; x <= 10; x++) pixel(x, y, x === 6 || x === 10 ? 0 : y % 3 === 0 ? 4 : 1);
      for (let y = 0; y <= 3; y++) for (let x = 5; x <= 11; x++) if (Math.abs(x - 8) + Math.abs(y - 1) < 5) pixel(x, y, x === 8 ? 3 : 0);
      for (let y = 13; y <= 16; y++) for (let x = 0; x < 17; x++) {
        if ((x < 2 || x > 14) && y === 13) continue;
        pixel(x, y, y === 13 || y === 16 || x === 0 || x === 16 ? 0 : x === 8 ? 3 : 4);
      }
      for (let y = 17; y <= 60; y++) {
        const half = y < 54 ? 4 : Math.max(0, Math.floor((60 - y) * 0.65));
        for (let x = 8 - half; x <= 8 + half; x++) pixel(x, y,
          x === 8 - half || x === 8 + half ? 0 : x === 8 ? 3 : x < 8 ? 2 : (y % 9 === 0 && x === 9 ? 1 : 2));
      }
      const width = Math.round(baseWidth * scale), height = Math.round(baseHeight * scale), data = new Uint8ClampedArray(width * height * 4);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const from = (Math.min(baseHeight - 1, Math.floor(y / scale)) * baseWidth + Math.min(baseWidth - 1, Math.floor(x / scale))) * 4;
        data.set(base.subarray(from, from + 4), (y * width + x) * 4);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, width, height, pixelStep: 2,
        tip: { x: (8.5 / baseWidth) * width, y: height - 0.5 }, palette };
      this.plumSwordRasters.set(key, entry);
      while (this.plumSwordRasters.size > 16) this.plumSwordRasters.delete(this.plumSwordRasters.keys().next().value);
      return entry;
    }

    smallPetalRaster(direction = 0, color = PINK) {
      if (!this.smallPetalRasters) this.smallPetalRasters = new Map();
      const facing = ((Math.round(direction) % 8) + 8) % 8, key = `${facing}:${color}`;
      if (this.smallPetalRasters.has(key)) return this.smallPetalRasters.get(key);
      // Two hand-authored complete leaves, plus exact quarter turns, provide
      // eight hole-free views. No cell rounding of a rotated bitmap or plus glyph.
      let rows = facing % 2 ? ['0011000', '0122100', '1232210', '0122210', '0012210', '0001210', '0000100']
        : ['01110', '12321', '12321', '12221', '01210', '01210', '00100'];
      for (let turn = 0; turn < Math.floor(facing / 2); turn++) {
        rows = Array.from({ length: rows[0].length }, (_, y) => Array.from({ length: rows.length }, (_, x) => rows[rows.length - 1 - x][y]).join(''));
      }
      const rgb = /^#([a-f\d]{6})$/i.exec(color), value = rgb ? parseInt(rgb[1], 16) : 0xf5aac4;
      const palette = [[111, 40, 79], [value >> 16, (value >> 8) & 255, value & 255], [255, 226, 230]];
      const width = rows[0].length, height = rows.length, data = new Uint8ClampedArray(width * height * 4);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (rows[y][x] !== '0') {
        const rgb = palette[Number(rows[y][x]) - 1], at = (y * width + x) * 4;
        data.set([...rgb, 255], at);
      }
      const entry = { canvas: this.rasterCanvas(data, width, height), data, width, height, center: { x: width / 2, y: height / 2 },
        pixelStep: 2, direction: facing, palette, rows };
      this.smallPetalRasters.set(key, entry);
      while (this.smallPetalRasters.size > 64) this.smallPetalRasters.delete(this.smallPetalRasters.keys().next().value);
      return entry;
    }

    petal(x, y, angle = 0, size = 4, color = PINK, alpha = 1) {
      if (alpha <= 0) return;
      const ctx = this.ctx, transform = ctx.getTransform?.();
      const valid = transform && [transform.a, transform.b, transform.c, transform.d, transform.e, transform.f].every(Number.isFinite);
      const direction = Math.round((angle + (valid ? Math.atan2(transform.b, transform.a) : 0)) / (Math.PI / 4));
      const stamp = this.smallPetalRaster(direction, color);
      ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.imageSmoothingEnabled = false;
      if (valid) {
        const px = transform.a * x + transform.c * y + transform.e, py = transform.b * x + transform.d * y + transform.f;
        const pixel = Math.max(1, Math.round(Math.hypot(transform.a, transform.b) * 2));
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(stamp.canvas, Math.round(px - stamp.width * pixel / 2), Math.round(py - stamp.height * pixel / 2), stamp.width * pixel, stamp.height * pixel);
      } else this.drawPixelStamp(stamp.canvas, x - stamp.center.x * 2, y - stamp.center.y * 2, 1);
      ctx.restore();
    }

    blossom(x, y, size, color = PINK, alpha = 1) {
      for (let i = 0; i < 5; i++) {
        const a = i * TAU / 5;
        this.petal(x + Math.cos(a) * size * 0.55, y + Math.sin(a) * size * 0.55, a + Math.PI / 2, size, color, alpha);
      }
      const ctx = this.ctx;
      ctx.save(); ctx.fillStyle = '#d8bc8c'; ctx.globalAlpha = alpha; ctx.fillRect(x - 1, y - 1, 2, 2); ctx.restore();
    }

    drawDamage(item) {
      if (!this.inView(item, 70)) return;
      const t = clamp(finite(item.age) / Math.max(0.01, finite(item.duration, 0.8)));
      if (t >= 1) return;
      const ctx = this.ctx, text = String(item.text ?? '');
      ctx.save(); ctx.globalAlpha = clamp((1 - t) * 2.4);
      const color = item.color || (item.critical ? '#ffe7a8' : '#fff2d5');
      const y = item.y - 15 - (this.reduced ? 0 : t * 24);
      if (/^[0-9!+.\-]+$/.test(text)) {
        // Browser font anti-aliasing collapses at half resolution. Deliberate
        // three-by-five bitmap digits retain counters and a single-pixel shadow.
        const step = item.critical ? 4 : 2, width = (text.length * 4 - 1) * step;
        const left = Math.round((item.x - width / 2) / 2) * 2;
        const top = Math.round((y - step * 2.5) / 2) * 2;
        for (const [shadow, tone] of [[true, '#16251f'], [false, color]]) {
          ctx.fillStyle = tone;
          for (let i = 0; i < text.length; i++) {
            const glyph = DAMAGE_DIGITS[text[i]];
            for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
              if (glyph[row][col] !== '1') continue;
              const offset = shadow ? 2 : 0;
              ctx.fillRect(left + i * step * 4 + col * step + offset, top + row * step + offset, step, step);
            }
          }
        }
      } else {
        ctx.font = `${item.critical ? '700 20px' : '700 18px'} monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineWidth = 2; ctx.strokeStyle = '#16251f'; ctx.strokeText(text, item.x, y);
        ctx.fillStyle = color; ctx.fillText(text, item.x, y);
      }
      ctx.restore();
    }

    drawAtmosphere() {
      // Palette terraces, never continuous fog/glow: retain clear enemies and projectiles.
      const ctx = this.ctx, w = this.width, h = this.height;
      ctx.save(); ctx.fillStyle = '#132e28'; ctx.globalAlpha = 0.16;
      ctx.fillRect(0, 0, w, 8); ctx.fillRect(0, h - 12, w, 12);
      ctx.globalAlpha = 0.12; ctx.fillRect(0, 8, 10, h - 20); ctx.fillRect(w - 10, 8, 10, h - 20);
      ctx.restore();
      if (!this.reduced && finite(this.state?.skills?.plum_sword) < 7) for (let i = 0; i < 7; i++) {
        const x = ((noise(i, 4, 2) * w + this.time * (4 + i % 3) - this.ox * 0.1) % (w + 80) + w + 80) % (w + 80) - 40;
        const y = ((noise(i, 7, 3) * h + this.time * (7 + i % 2) - this.oy * 0.1) % (h + 80) + h + 80) % (h + 80) - 40;
        this.petal(x, y, i, 2, '#a67187', 0.35);
      }
    }

    drawOffscreenWarnings() {
      const ctx = this.ctx, w = this.width, h = this.height;
      for (const enemy of (this.state.enemies || [])) {
        if (enemy.type !== 'boss' || this.inView(enemy, 10)) continue;
        const px = finite(this.state.player.x), py = finite(this.state.player.y);
        const angle = Math.atan2(enemy.y - py, enemy.x - px);
        const dx = Math.cos(angle), dy = Math.sin(angle);
        const distance = Math.min((w / 2 - 25) / Math.max(0.001, Math.abs(dx)), (h / 2 - 25) / Math.max(0.001, Math.abs(dy)));
        const x = w / 2 + dx * distance, y = h / 2 + dy * distance;
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.fillStyle = '#f0b27b'; ctx.shadowColor = '#dc845b'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-6, -7); ctx.lineTo(-3, 0); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    alphaColor(color, alpha) {
      if (typeof color !== 'string') return `rgba(245,170,196,${clamp(alpha)})`;
      const m = /^#([a-f\d]{6})$/i.exec(color);
      if (!m) return color;
      const n = parseInt(m[1], 16);
      return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${clamp(alpha)})`;
    }

    destroy() {
      this.destroyed = true;
      if (this.bloomWarmupId != null) window.cancelIdleCallback?.(this.bloomWarmupId);
      this.bloomWarmupId = null;
      this.hero.onload = null;
      this.hero.onerror = null;
      this.heroAtlas.onload = null;
      this.heroAtlas.onerror = null;
      this.bloomAtlas.onload = null;
      this.bloomAtlas.onerror = null;
      if (this.paintedBloomImage) { this.paintedBloomImage.onload = null; this.paintedBloomImage.onerror = null; }
      this.paintedBloomMaterial = null;
      for (const image of this.heroImages.values()) { image.onload = null; image.onerror = null; }
      this.heroImages.clear();
      this.spriteCache.clear();
      this.lastPlayer = null;
      this.lastHeroSourceFrame = null;
      this.lastRenderedHeroPose = null;
      this.walkFrameOffset = 0;
      this.tipHistory = [];
      this.windupTip = null;
      this.visualAttack = null;
      this.bloomShape = null;
      this.bloomPrimaryShape = null;
      this.bloomDissolveShape = null;
      this.bloomFrameSources?.clear();
      this.bloomRasters?.clear();
      this.flatPlumRasters?.clear();
      this.inkBloomSources?.clear();
      this.inkBloomRevealRasters?.clear();
      this.inkBloomUnravelSources?.clear();
      this.inkBloomUnravelRasters?.clear();
      this.orientedBloomRasters?.clear();
      this.orientedUnravelSources?.clear();
      this.ribbonRasters?.clear();
      this.smallPetalRasters?.clear();
      this.rainPetalRasters?.clear();
      this.fallingPetalRasters?.clear();
      this.collectiblePetalRasters?.clear();
      this.dashRippleRasters?.clear();
      this.enemyFigureRasters?.clear();

      this.locomotion = null;
      this.inkCutRasters?.clear();
      this.flowerOutlineRasters?.clear();
      this.plumSwordRasters?.clear();
      this.petalUnravelSources?.clear();
      this.petalUnravelRasters?.clear();
      this.bloomCasts.clear();
      this.seenBloomIds.clear();
      this.rainCasts.clear();
      this.seenRainIds.clear();
      this.state = null;
    }
  }

  window.CheonGameRenderer = CheonGameRenderer;
})();
