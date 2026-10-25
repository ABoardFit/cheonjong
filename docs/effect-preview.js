/* Standalone choreography study. These drawings apply no combat damage or balance values. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const W = 480, H = 300, DURATION = 4200;
  const PINK = '#b8426d', PALE = '#713b55', PURPLE = '#785b9f';
  const rules = () => window.CHEONJONG_DATA?.rules || {};
  const groundSeconds = () => {
    const id = family() === 'sword' ? 'plum_sword' : family() === 'rain' ? 'plum_rain' : 'dark_fragrance';
    const levels = window.CHEONJONG_DATA?.schools?.hwasan?.skills?.find(item => item.id === id)?.levels || [];
    return [...levels].reverse().find(level => Number(level.rank) <= rank && level.mechanics?.groundDurationSeconds != null)?.mechanics.groundDurationSeconds ?? rules().combat?.defaultGroundDurationSeconds ?? 3;
  };
  const samplePetals = () => rules().petals?.baseCapacity ?? 1;
  const aliases = {
    sword: 'sword', meihua_sword: 'sword', plum_sword: 'sword', sword24: 'sword', plum: 'sword',
    '이십사수매화검법': 'sword',
    rain: 'rain', meihua_rain: 'rain', plum_rain: 'rain', sword_rain: 'rain', '매화검우': 'rain',
    dodge: 'dodge', hidden_fragrance: 'dodge', dark_fragrance: 'dodge', amhyang: 'dodge', '암향표': 'dodge',
    zixia: 'zixia', purple: 'zixia', '자하신공': 'zixia',
    liuhe: 'liuhe', six_harmony: 'liuhe', '육합공': 'liuhe',
    five_elements: 'steps', five_steps: 'steps', oheng: 'steps', '오행매화보': 'steps'
  };
  const enemyPositions = Array.from({length: 20}, (_, i) => ({
    x: 240 + Math.cos(i * 2.39996) * (65 + (i % 4) * 19),
    y: 150 + Math.sin(i * 2.39996) * (36 + (i % 4) * 13),
    ranged: i % 4 === 0
  }));
  const descriptions = {
    sword: ['종베기', '75도 부채꼴 · 두껍고 거친 분홍 검로', '바라보는 방향부터 시계방향으로 펼쳐지는 원형 검로', '바라보는 방향부터 피어나는 다섯 먹빛 꽃잎', '거친 먹빛 꽃·긴 검격 · 이어서 퍼지는 원형 폭발', '폭발과 함께 커지는 옅은 분홍빛 지속 영역', '큰 먹빛 꽃과 원 · 시계방향 꽃잎 분해 · 굵은 검격 · 화면 전체 낙화'],
    rain: ['가까운 적 최대 하나 · 한 명당 외날 도 하나', '서로 다른 적 최대 셋', '최대 열 대상에게 외날 도 순차 낙하', '최대 열 대상에게 외날 도 동시 낙하', '최대 스무 대상에게 꽃잎 하나씩 낙하', '낙하 지점에 지속 영역', '최대 스무 대상 · 도 또는 꽃잎 하나 · 도는 원거리 우선'],
    dodge: ['이동속도 증가', '이동속도 증가', '착지 먹빛 파문 · 피해 판정 후 넉백', '경공 중 · 종료 후 1초 피해 30% 감소', '이동 경로에 지속 영역', '더 넓은 경로에 지속 영역', '꽃잎 ≥1 · 전부 소모 → 0.3초 무적 · 3초 획득 불가'],
    zixia: ['처치 시 방어 꽃잎 생성', '꽃잎 보유 한계 증가', '한 번의 피격에 꽃잎 최대 1개 추가 소모', '보유 꽃잎에 따른 공격 증가 · 보라 검', '꽃잎 부착 · 분홍 외곽선 · 지속 피해', '직접 명중 추가 피해 · 몸 전체 점멸 · 지속 피해 제외', '매화만리향 · 초식 6단계 + 심법 6성'],
    liuhe: ['꽃잎 보유 한계 증가', '꽃잎 1개의 피해 감소 한계 증가', '꽃잎 보유 한계 증가', '꽃잎 갑옷 한계 증가', '피격 방어 소모당 넉백 1회', '실제 획득 시 폭발 · 획득 전 가득 참/획득 금지 중 미발동', '매향침골 · 초식 6단계 + 심법 6성'],
    steps: ['이동속도 증가 · 같은 도주기의 착지 먹빛 파문', '경공 이동 거리 증가', '이동속도 증가', '경공에 돌진 피해 추가', '같은 착지 파문과 함께 적 넉백', '경공 피격 적 꽃잎 생성 · 암향표 3단계 피해도 적용', '매인설한 · 꽃잎 ≥1 · 전부 소모 → 0.3초 무적 · 3초 획득 불가']
  };
  let canvas, ctx, skill = 'sword', rank = 1, frame = 0, start = 0, progress = 0;
  let observer, visible = true, attached = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const family = () => ['sword', 'zixia'].includes(skill) ? 'sword' : ['rain', 'liuhe'].includes(skill) ? 'rain' : 'dodge';
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const ease = t => 1 - Math.pow(1 - clamp(t), 3);
  function line(x1, y1, x2, y2, color, width = 2, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
  }
  function ring(x, y, radius, color, alpha = 1, width = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.ellipse(x, y, radius, radius * 0.58, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
  function petal(x, y, angle = 0, size = 4, alpha = 1) {
    diagramRenderer().petal(x, y, angle, size, PINK, alpha);
  }
  function collectiblePetal(x,y,id=1) {
    diagramRenderer().drawPickup({id,type:'petal',x,y});
  }
  function sword(x, y, color = PALE, scale = 1) {
    line(x, y - 17 * scale, x, y + 3 * scale, color, 3);
    line(x - 5 * scale, y - 1 * scale, x + 5 * scale, y - 1 * scale, PINK, 2);
    line(x, y + 3 * scale, x, y + 8 * scale, '#c09c5b', 3);
  }
  function burst(x, y, t, radius = 48) {
    const a = clamp(1 - t); ring(x, y, 6 + t * radius, PINK, a, 2);
    for (let i = 0; i < 10; i++) {
      const angle = TAU * i / 10;
      petal(x + Math.cos(angle) * t * radius, y + Math.sin(angle) * t * radius * 0.58, angle + t, 3, a);
    }
  }
  function field(x, y, radius, phase, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha * 0.10; ctx.fillStyle = PINK;
    ctx.beginPath(); ctx.ellipse(x, y, radius, radius * 0.58, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  function hero(x = 240, y = 150, ghost = false, armor = null) {
    if (window.CheonCombatAnimation?.poseFor) {
      const painter = diagramRenderer(), elapsed = progress * DURATION / 1000, body = { x, y: y + 38, faceX: 1, faceY: 0, radius: 10, petals: armor?.count || 0 };
      const strokeDuration = window.CheonCombatAnimation.physicalStrokeDuration?.(rank) || .18;
      const age = family() === 'sword' && rank <= 4 ? clamp(progress / .48) * strokeDuration : elapsed < 1 ? elapsed : elapsed - 1;
      const attack = family() === 'sword' && age < .7 ? { id: 1, type: 'slash', x, y, angle: 0, age, rank, radius: rank >= 7 ? 140 : 76, duration: rank >= 7 ? .7 : .35 } : null;
      const state = { time: elapsed, player: body, skills: { plum_sword: family() === 'sword' ? rank : 0, zixia: skill === 'zixia' ? rank : 0 },
        effects: attack ? [attack] : [], enemies: [], attackTimer: 1 };
      painter.state = state; painter.time = elapsed;
      const pose = window.CheonCombatAnimation.poseFor(state, elapsed, { attack, moving: false, walkDistance: 0, reducedMotion: false });
      painter.pose = pose;
      const sourceReady=painter.heroFrameReady(pose);
      ctx.save(); ctx.globalAlpha *= ghost ? .24 : 1;
      if (armor) painter.drawPetals(body,'back');
      if (sourceReady && !pose.bakedWeapon && pose.bladeBehind) painter.drawHeldBlade(pose);
      ctx.save(); ctx.translate(body.x,body.y); painter.drawHeroFrame(pose); ctx.restore();
      if (sourceReady && !pose.bakedWeapon && !pose.bladeBehind) painter.drawHeldBlade(pose);
      if (armor) painter.drawPetals(body,'front');
      ctx.restore(); return;
    }
    const painter = diagramRenderer();
    if (painter.hero.complete && painter.hero.naturalWidth > 0) {
      ctx.save(); ctx.globalAlpha *= ghost ? .24 : 1;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(painter.hero,x-37,y-38,74,82); ctx.restore();
    }
  }
  function foes(offset = 0, t = 0) {
    const painter=diagramRenderer(); painter.time=t*DURATION/1000;
    enemyPositions.slice(0, family() === 'rain' ? 20 : 12).forEach((e, i) => {
      const a = Math.atan2(e.y - 150, e.x - 240), x = e.x + Math.cos(a) * offset, y = e.y + Math.sin(a) * offset;
      const marked=((skill === 'zixia'&&rank>=5)||(family()==='sword'&&rank===7))&&i<samplePetals();
      const directBonus=marked&&((skill==='zixia'&&rank>=6)||(family()==='sword'&&rank===7));
      const flashFrom=directBonus ? .32*DURATION/1000 : 0;
      ctx.save(); ctx.translate(x,y+5); ctx.scale(.45,.45);
      painter.drawEnemyMarked({id:i+1,x,y:y+5,radius:11,type:e.ranged?'ranged':'melee',face:x>240?-1:1,
        petalAttached:marked,petalHitFlashFrom:flashFrom,petalHitFlashUntil:directBonus?flashFrom+.24:0});
      ctx.restore();
      if(marked) petal(x,y-16,0,3);
    });
  }
  const diagramBloom = new Image();
  diagramBloom.src = window.CHEON_HERO_ATLAS?.effects?.bloomAtlas?.src || 'assets/plum-bloom-pixel-v1.png';
  let diagramBloomSource;
  function diagramRenderer() {
    if (!diagramBloomSource) {
      const heroAtlas=new Image(), heroImage=new Image(); heroAtlas.src=window.CHEON_HERO_ATLAS?.src||'assets/hero-atlas.png'; heroImage.src='assets/hero.png';
      diagramBloomSource = Object.assign(Object.create(window.CheonGameRenderer.prototype), {
      bloomAtlas: diagramBloom, pose: { attack: { id: 1 } }, reduced: false,
      width: W, height: H, state: { skills: { plum_sword: 0 } }, time: 0, heroAtlas, hero:heroImage, heroImages:new Map(), walkPhase:0
      });
      diagramBloomSource.preloadHeroImages();
    }
    diagramBloomSource.ctx = ctx;
    return diagramBloomSource;
  }
  function swordTintField(radius) {
    diagramRenderer().pixelDisc(240,147,radius,PINK,.10);
  }
  function swordScene(t) {
    const sweep=clamp(t/.48), fade=clamp(1-t/.85);
    const stroke=sweep;
    const presentation = diagramRenderer();
    presentation.time = t * DURATION / 1000;
    presentation.state.skills.plum_sword = rank === 7 ? 7 : 0;
    if(rank===7) presentation.drawPetalRain('back');
    if(rank===1) {
      // The held blade in hero() is the attack. No remote connecting line.
      if(t<.3) petal(272,147,0,3,fade);
    } else if(rank===2) {
      ctx.save(); ctx.translate(240,147); presentation.drawBodyFan(64,0,sweep,fade,'#ffc1dc'); ctx.restore();
    } else if(rank===3||rank===4) {
      ctx.save(); ctx.translate(240,147);
      if(rank===4) presentation.drawFilledPlumMotif(76,sweep,fade,{angle:0,circleProgress:stroke});
      else presentation.drawCircleCut(76,stroke,fade,'#ffc1dc',0);
      ctx.restore();
    } else {
      const elapsed = t * DURATION / 1000;
      if(rank>=6&&elapsed>.35) swordTintField(rank===6?88+44*clamp((elapsed-.35)/.34):140);
      // Replay two attacks a second apart. Each release keeps its own age and
      // seed, so the first flight continues after the next flower appears.
      for(let cast=0;cast<2;cast++) {
        const age=elapsed-cast, seed=cast+1;
        if(age<0) continue;
        if(rank<7) {
          if(age<.35) {
            ctx.save(); ctx.translate(240,147);
            const physical=clamp(age/(window.CheonCombatAnimation?.physicalStrokeDuration?.(rank)||.28));
            presentation.drawFilledPlumMotif(88,clamp(age/.24),1,{angle:0,circleProgress:physical});
            presentation.drawScatteredCuts(88,age/.35,1,seed,rank); ctx.restore();
          }
          if(age>=.35&&age<.69) {
            const phase=(age-.35)/.34;
            ctx.save(); ctx.translate(240,147);
            if(age<.51) presentation.drawFilledPlumMotif(88,1,1-(age-.35)/.16,{circle:false,angle:0});
            presentation.drawPlumExplosion(88,132,phase,1,0);
            presentation.drawScatteredCuts(132,phase,1,seed+41,rank); ctx.restore();
          }
        } else {
          if(age<.7) {
            ctx.save(); ctx.translate(240,147); presentation.drawPerfectedCut(140,age/.7,1,seed,{sourceOnly:true,angle:0}); ctx.restore();
          }
          if(age>=.28) presentation.drawInkBloomReleasedPetals(240,147,140,age-.28,seed,{sourceDuration:.42,angle:0});
        }
      }
    }
    hero(240,150,false,rank===7?{count:samplePetals(),time:t}:null);
    if(rank===7) presentation.drawPetalRain('front');
  }
  function rainScene(t, layer) {
    const limit = rank === 1 ? 1 : rank === 2 ? 3 : rank <= 4 ? 10 : 20;
    const targets = [...enemyPositions].sort((a,b)=>Math.hypot(a.x-240,a.y-150)-Math.hypot(b.x-240,b.y-150));
    const count = Math.min(limit,targets.length), painter=diagramRenderer();
    let seed=240624;
    for (let i = 0; i < count; i++) {
      seed^=seed<<13; seed^=seed>>>17; seed^=seed<<5;
      const kind=rank===7?((seed>>>0)/4294967296<.5?'sword':'petal'):rank<5?'sword':'petal';
      const ranged=rank===7&&kind==='sword'?targets.findIndex(e=>e.ranged):-1;
      const e = targets.splice(ranged>=0?ranged:0,1)[0], delay = rank === 4 ? 0.16 : i * (rank <= 3 ? 0.045 : 0.022);
      const age = (t - delay) * DURATION / 1000;
      if (age < 0) continue;
      if (layer==='back'&&rank >= 6 && age >= .3) field(e.x, e.y, 15, t * 4, 0.75);
      if ((layer==='back'&&kind==='sword')||(layer==='front'&&kind==='petal')) {
        painter.drawRainStrike({ id:i+1,kind,rank,x:e.x,y:e.y-3,groundX:e.x,groundY:e.y+5 },age);
      }
      if (layer==='front'&&kind==='petal'&&age>=.3) collectiblePetal(e.x,e.y+5,i+1);
    }
  }
  function dodgeTimeline(t, passive = skill === 'steps') {
    const balance=window.CHEONJONG_BALANCE.dash, elapsed=t*DURATION/1000, startAt=.65;
    const combined=rank===7, activeRank=combined?7:passive?0:rank, partnerRank=combined?7:passive?rank:0;
    const length=balance.distance+(partnerRank>=2?balance.distanceBonus:0), from=240-length/2;
    const landingAt=startAt+balance.duration, shift=clamp((elapsed-startAt)/balance.duration);
    return {combined,activeRank,partnerRank,elapsed,startAt,landingAt,shift,length,from,x:from+length*shift,y:150,
      landingX:from+length,waveProgress:(elapsed-landingAt)/.42,waveEnabled:activeRank>=3||partnerRank>=1};
  }
  function dodgeScene(t, passive = false) {
    const timing=dodgeTimeline(t,passive), {combined,elapsed,startAt,landingAt,shift,length,from,x,y}=timing;
    const trail = (!passive && rank >= 5) || combined;
    if (trail && shift > 0) {
      for (let i = 0; i < 9; i++) {
        const px = from + length * i / 8;
        if (px <= x) field(px, y, rank >= 6 ? 26 : 15, t * 3, 0.8);
      }
    }
    line(from, y + 18, from + length, y + 18, '#6b8d7b', 1, 0.5);
    for (let i = 1; i <= 3; i++) if (shift > i * 0.14 && shift < 1) hero(x - 20 * i, y, true);
    const activated = elapsed>=startAt;
    const invulnerable = rank === 7 && activated && elapsed<startAt+.3;
    const pickupLocked = rank === 7 && activated && elapsed<startAt+3;
    if (invulnerable) { ring(x, y, 27, PALE, 0.9, 3); field(x, y, 25, t); }
    else if (((!passive && rank >= 4) || combined) && shift > 0 && elapsed<landingAt+1) ring(x, y, 24, PURPLE, 0.65, 2);
    hero(x, y);
    if (((passive && rank >= 4) || combined) && shift > 0 && shift < 1) line(x - 20, y, x + 23, y, PALE, 6, 0.7);
    if (((passive && rank >= 6) || combined) && elapsed>=landingAt) for (let i = 0; i < 5; i++) collectiblePetal(from + length - 30 + i * 15, y + 26, i+1);
    if (rank === 7 && !activated) for (let i = 0; i < samplePetals(); i++) petal(from + Math.cos(i * TAU / samplePetals()) * 22, y + Math.sin(i * TAU / samplePetals()) * 18, i, 3);
    if (rank === 7 && activated) {
      ctx.fillStyle = PALE; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(pickupLocked ? '꽃잎 전부 소모 · 획득 잠금 중 (3초)' : '꽃잎 획득 잠금 종료', 240, 230);
      if (invulnerable) ctx.fillText('무적 0.3초', x, y - 40);
      else if (elapsed<landingAt+1) ctx.fillText('받는 피해 30% 감소', x, y - 40);
      ctx.fillText('비용 소모는 방어 넉백 없음 · 오행매화보 착지 넉백은 유지', 240, 42, W - 20);
    }
  }
  function passiveScene(t) {
    if (rank === 7) {
      if (skill === 'zixia') swordScene(t);
      else {
        rainScene(t,'back'); hero(240,150,false,{count:samplePetals(),time:t}); rainScene(t,'front');
      }
      return;
    }
    const count = skill === 'zixia' && rank === 1 && t < 0.3 ? 0 : samplePetals();
    hero(240,150,false,{count,time:t});
    if (skill === 'zixia') {
      if (rank >= 4) line(254, 149, 274, 117, PURPLE, 4);
      if (rank >= 6 && t > 0.3 && t < 0.36) {
        const e = enemyPositions[0]; line(260, 140, e.x, e.y, PURPLE, 2, 1 - t);
      }
      if (rank === 1 && t > 0.3) collectiblePetal(312,148);
    } else {
      if (rank >= 5 && t > 0.6 && t < 0.9) ring(240, 150, 20 + ease((t - 0.6) / 0.3) * 40, PALE, 1 - t);
      if (rank === 6 && t > 0.35 && t < 0.55) burst(240, 150, (t - 0.35) / 0.2, 75);
      if (rank === 6 && t < 0.35) collectiblePetal(300-ease(t/.35)*60,150);
    }
  }
  function combinedPassives(t) {
    if (rank !== 7 || family() === 'dodge') return;
    // The one-petal sample is depth-sorted around the torso in hero().
    if (family() === 'sword') {
      if (t > 0.3) collectiblePetal(312,148);
      if (t > 0.3 && t < 0.36) {
        const e = enemyPositions[0]; line(260, 140, e.x, e.y, PURPLE, 2, 1 - t);
        ctx.save(); ctx.fillStyle = PALE; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('자하신공 · 직접 명중 추가 피해 · 지속 피해 제외', 18, 42); ctx.restore();
      }
    } else {
      if (t < 0.35) collectiblePetal(300-ease(t/.35)*60,150);
      if (t > 0.35 && t < 0.55) burst(240, 150, (t - 0.35) / 0.2, 75);
      if (t > 0.6 && t < 0.9) ring(240, 150, 20 + ease((t - 0.6) / 0.3) * 40, PALE, 1 - t);
    }
  }
  function paint(t) {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#e3e4d9'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#d2d6ca'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ring(240, 150, 134, '#526e5b', 0.28); ring(240, 150, 114, '#526e5b', 0.16);
    const dashTiming=family()==='dodge'?dodgeTimeline(t):null;
    const dashKnockback=dashTiming&&dashTiming.partnerRank>=5&&dashTiming.elapsed>=dashTiming.landingAt;
    const knockedBack = (skill === 'liuhe' && rank >= 5 && t > 0.5) || (family() === 'rain' && rank === 7 && t > 0.5) || dashKnockback;
    const rainPreview = skill === 'rain' || (skill === 'liuhe' && rank === 7);
    if(rainPreview) rainScene(t,'back');
    if(dashTiming?.waveEnabled&&dashTiming.waveProgress>=0&&dashTiming.waveProgress<1) {
      ctx.save(); ctx.translate(dashTiming.landingX,dashTiming.y+18);
      diagramRenderer().drawDashRipple(window.CHEONJONG_BALANCE.dash.landingRadius,dashTiming.waveProgress,1); ctx.restore();
    }
    const knockbackPhase=dashKnockback?(dashTiming.elapsed-dashTiming.landingAt)/.16:(t-.6)/.25;
    foes(knockedBack ? ease(knockbackPhase)*12 : 0,t);
    if(rainPreview) {
      hero(240,150,false,rank===7?{count:samplePetals(),time:t}:null);
      rainScene(t,'front');
    }
    else if (skill === 'sword') swordScene(t);
    else if (skill === 'dodge' || skill === 'steps') dodgeScene(t, skill === 'steps');
    else passiveScene(t);
    combinedPassives(t);
    ctx.textAlign = 'left'; ctx.fillStyle = '#536459'; ctx.font = '11px sans-serif';
    ctx.fillText('동작 시안 · 피해량 미적용', 14, 21);
    ctx.fillStyle = '#785e32'; ctx.textAlign = 'right';
    ctx.fillText(['zixia', 'liuhe', 'steps'].includes(skill) && rank < 7 ? `${rank}성 · 효과 도식` : `${rank}단계`, W - 14, 21);
    ctx.fillStyle = PALE; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText(descriptions[skill][rank - 1], W / 2, H - 17, W - 20);
    if (family() === 'rain' && rank === 7) { ctx.fillStyle = '#785e32'; ctx.fillText('금색 적 = 원거리 적 · 외날 도 우선 낙하', W / 2, 245, W - 20); }
    if (((family() === 'sword' || family() === 'rain') && rank >= 6) || (skill === 'dodge' && rank >= 5) || (skill === 'steps' && rank === 7)) { ctx.fillStyle = '#536459'; ctx.fillText(`장판 ${groundSeconds()}초 · 같은 무공 피해 중첩 없음 / 다른 무공 중첩 · 압축 재생`, W / 2, 245, W - 20); }
    if (rank === 7) { ctx.fillStyle = '#536459'; ctx.fillText(family() === 'sword' ? '화면 전체 꽃잎 연출 · 지속 피해는 몸 중심 큰 꽃 반경 · 검법 장판과 중첩 없음' : '초식·심법 성장 효과 계승 · 꽃잎 수는 시연용', W / 2, 264, W - 20); }
    if (['zixia', 'liuhe'].includes(skill) && rank < 7) { ctx.fillStyle = '#536459'; ctx.fillText('부착은 적당 최대 1개 · 보유 N개면 최대 N마리 · 보유 0개면 해제', W / 2, 264, W - 20); }
    if (motion.matches) { ctx.textAlign = 'left'; ctx.fillStyle = '#536459'; ctx.fillText('동작 줄이기 · 정지 장면', 14, 40); }
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; }
  function stillTime() {
    if ((skill === 'dodge' || skill === 'steps') && rank === 7) return 0.19;
    if (family()==='dodge') return (.65+window.CHEONJONG_BALANCE.dash.duration+.42*.35)/(DURATION/1000);
    return skill === 'sword' && rank <= 2 ? 0.25 : skill === 'rain' && rank <= 4 ? 0.15 : 0.65;
  }
  function tick(now) {
    if (document.hidden || !visible || !canvas?.isConnected) { stop(); return; }
    if (!start) start = now;
    progress = clamp((now - start) / DURATION); paint(progress);
    if (progress < 1) frame = requestAnimationFrame(tick); else frame = 0;
  }
  function replay() {
    stop(); start = 0; progress = 0;
    if (!canvas) return;
    if (motion.matches) { progress = stillTime(); paint(progress); return; }
    paint(0);
    if (!document.hidden && visible) frame = requestAnimationFrame(tick);
  }
  function resize() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false; paint(progress);
  }
  function onVisibility() { if (document.hidden) stop(); }
  function onMotion() { stop(); progress = motion.matches ? stillTime() : progress; paint(progress); }
  function destroy() {
    stop(); observer?.disconnect(); observer = null;
    if (attached) { window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); motion.removeEventListener('change', onMotion); }
    attached = false; canvas = null; ctx = null;
  }
  function mount(target = 'effect-preview') {
    const next = typeof target === 'string' ? document.getElementById(target) : target;
    if (!next || typeof next.getContext !== 'function') return false;
    destroy(); canvas = next; ctx = canvas.getContext('2d');
    if (!ctx) { canvas = null; return false; }
    canvas.setAttribute('role', 'img'); canvas.style.maxWidth = '100%'; canvas.style.height = 'auto';
    canvas.style.aspectRatio = '8 / 5';
    canvas.setAttribute('aria-label', descriptions[skill][rank - 1] + '. 동작 시안이며 피해량을 적용하지 않습니다.');
    visible = true; resize();
    window.addEventListener('resize', resize); document.addEventListener('visibilitychange', onVisibility); motion.addEventListener('change', onMotion); attached = true;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        const wasVisible = visible; visible = entries[0].isIntersecting;
        if (!visible) stop();
        else if (!wasVisible && progress < 1 && !document.hidden) replay();
      }); observer.observe(canvas);
    }
    replay(); return true;
  }
  function setSkill(id, nextRank = 1) {
    skill = aliases[id] || (descriptions[id] ? id : 'sword'); rank = clamp(Math.floor(Number(nextRank) || 1), 1, 7);
    if (!canvas) mount();
    canvas?.setAttribute('aria-label', descriptions[skill][rank - 1] + '. 동작 시안이며 피해량을 적용하지 않습니다.');
    replay();
  }
  window.MartialPreview = Object.freeze({mount, setSkill, replay, destroy});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { if (!canvas) mount(); }, {once: true});
  else mount();
})();
