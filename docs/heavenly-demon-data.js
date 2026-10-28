/* 천종지자 천마신교 설계 데이터. 초식명은 게임 창작이며 계수는 밸런스 조정 전이다. */
(function (root) {
  'use strict';

  const level = (rank, title, description, mechanics = {}, hanja = '') => ({ rank, title, description, mechanics, hanja });
  const unlearned = () => level(0, '미습득', '심법 효과 없이 초식 본래의 연출을 확인한다.');

  // Ratings convert with diminishing returns: chance = rating / (rating + 100), cooldown = base / (1 + reduction / 100).
  const EVASION_CAP = 0.75, MIN_COOLDOWN_SECONDS = 0.1;
  const evasionChance = rating => { const r = Math.max(0, Number(rating) || 0); return Math.min(EVASION_CAP, r / (r + 100)); };
  const cooldownSeconds = (base, reductionPercent) => Math.max(MIN_COOLDOWN_SECONDS, base / (1 + Math.max(0, Number(reductionPercent) || 0) / 100));

  root.CHEON_HEAVENLY_DEMON = {
    id: 'heavenly_demon', name: '천마신교', version: 1,
    summary: '흑월 검기와 흑염의 고리, 천마의 걸음으로 군림하는 천마신교 무학.',
    authorship: { activeNames: '천종지자 창작 초식명', activeProgression: '사용자 지정', mindProgression: '사용자와 함께 정한 설계', coefficients: '미확정' },
    palette: { ink: '#3a2140', mid: '#6b3a78', light: '#c9a3d6', flame: '#b8343f', gold: '#d9a85a', shadow: '#1c1020', ground: '#4a2a52' },
    rules: {
      basicAttackIntervalSeconds: 1, activeCooldownSeconds: 5, groundDurationSeconds: 3,
      groundStacking: 'same_skill_union_different_skills_stack',
      evolution: { activeRank: 6, partnerRank: 6, resultRank: 7, retainsMindEffects: true },
      // 육합공 stays with the orthodox schools.
      usesSharedLiuhe: false,
      resource: { id: 'demonic_qi', name: '마기', baseCapacity: 1, baseConsumptionPerHit: 1, reductionOrder: ['flat', 'percent'], attacksConsumeResource: false, sharedMechanicsId: 'hwasan_petal', sources: ['black_flame_art_3_ring_kill', 'heavenly_demon_art_1_kill', 'sovereign_step_6_stomp_hit'], initialAmount: null },
      // No crowd control: nothing in this school stuns, roots, slows or pulls enemies. Contact damages the player, so effects only push out, linger or burst.
      crowdControl: false, pullsEnemies: false,
      evasion: { formula: 'rating / (rating + 100)', capChance: EVASION_CAP, sumRatingsBeforeConversion: true, directHitsOnly: true, onEvade: { damage: 0, consumesResource: false } },
      cooldown: { formula: 'base / (1 + reduction / 100)', minSeconds: MIN_COOLDOWN_SECONDS },
      procs: { damageOverTimeCountsAsDirectHit: false, markExplosionAppliesMark: false, pickupBurstRequiresActualIncrease: true, blockKnockbackOncePerHit: true },
      heavenlyDashInvulnerable: false,
      coefficients: null
    },
    formulas: { evasionChance, cooldownSeconds },
    paths: {
      sword: {
        id: 'heavenly_sword', name: '천마멸천검', hanja: '天魔滅天劍', type: '초식', partnerId: 'heavenly_demon_art', evolutionName: '천마강림',
        levels: [
          level(1, '흑월일섬', '가장 가까운 적을 향해 검은 초승달 검기 하나를 날린다.', { attack: 'crescent_projectile', projectiles: 1, target: 'nearest', pierce: false }, '黑月一閃'),
          level(2, '흑월관혼', '검기가 적을 관통하며 화면 끝까지 날아간다. 한 검기는 같은 적에게 한 번만 명중한다.', { attack: 'crescent_projectile', projectiles: 1, pierce: true, range: 'screen_edge', hitsPerEnemy: 1 }, '黑月貫魂'),
          level(3, '삼월분천', '세 갈래 부채꼴로 관통 검기 세 줄기를 날린다.', { attack: 'crescent_projectile', projectiles: 3, spread: 'fan', pierce: true, range: 'screen_edge' }, '三月分天'),
          level(4, '마염잔월', '검기가 커지고, 지나간 길에 3초간 지속 피해를 주는 흑염 장판을 남긴다.', { attack: 'crescent_projectile', projectiles: 3, spread: 'fan', pierce: true, large: true, trailGroundSeconds: 3 }, '魔焰殘月'),
          level(5, '팔방흑월', '몸을 중심으로 여덟 방향에 큰 관통 검기를 동시에 날린다. 흑염 장판을 유지한다.', { attack: 'crescent_projectile', projectiles: 8, spread: 'radial', pierce: true, large: true, trailGroundSeconds: 3 }, '八方黑月'),
          level(6, '멸천흑강', '여덟 검기를 대체하여 화면을 가로지르는 거대한 검은 검강 하나를 가장 적이 많은 방향으로 날린다. 흑염 장판을 유지한다.', { attack: 'giant_crescent', projectiles: 1, target: 'densest_direction', pierce: true, range: 'offscreen', trailGroundSeconds: 3 }, '滅天黑罡'),
          level(7, '천마강림', '천마신공 6성과 조합. 땅을 가르는 거대한 검은 검기 여덟 줄기가 8방향으로 지면을 따라 화면 밖까지 뻗어 나간다. 각 검기는 관통하며 같은 적에게 한 번만 명중한다. 지나간 땅의 갈라진 흔적은 연출일 뿐 피해가 없다. 부가 효과 없이 순수한 강한 피해이며 천마신공 1~6성은 유지한다.', { attack: 'ground_splitting_crescents', projectiles: 8, spread: 'radial', pierce: true, range: 'offscreen', hitsPerEnemy: 1, crackTrailDamages: false, extraEffects: false }, '天魔降臨')
        ]
      },
      ring: {
        id: 'soul_ring', name: '천마멸혼륜', hanja: '天魔滅魂輪', type: '초식', partnerId: 'black_flame_art', evolutionName: '흑일멸겁',
        levels: [
          level(1, '일륜흑염', '흑염 고리 하나가 몸 주위를 돌며 닿는 적에게 피해를 준다.', { attack: 'orbit_rings', rings: 1 }, '一輪黑焰'),
          level(2, '삼륜회천', '몸 주위를 도는 흑염 고리가 세 개가 된다.', { attack: 'orbit_rings', rings: 3 }, '三輪回天'),
          level(3, '마륜확염', '고리의 회전 반경과 피해가 증가한다.', { attack: 'orbit_rings', rings: 3, radiusUp: true, increasedDamage: true }, '魔輪擴焰'),
          level(4, '오륜척마', '고리가 다섯 개가 되고, 닿은 적을 바깥으로 밀쳐 낸다.', { attack: 'orbit_rings', rings: 5, radiusUp: true, increasedDamage: true, knockback: 'outward' }, '五輪斥魔'),
          level(5, '혼륜파동', '고리가 주기적으로 반경 끝까지 퍼졌다가 몸 주위로 돌아온다. 밀쳐 내기를 유지한다.', { attack: 'pulsing_rings', rings: 5, increasedDamage: true, knockback: 'outward' }, '魂輪波動'),
          level(6, '멸혼잔염', '퍼진 고리가 지나간 자리에 3초간 지속 피해를 주는 흑염 장판을 남긴다.', { attack: 'pulsing_rings', rings: 5, increasedDamage: true, knockback: 'outward', groundSeconds: 3 }, '滅魂殘焰'),
          level(7, '흑일멸겁', '흑염마공 6성과 조합. 고리들이 머리 위에서 검은 태양 하나로 뭉쳤다가 바깥으로 터지며 주변 적을 밀어내는 큰 폭발을 일으키고, 폭발 자리에 넓은 흑염 장판을 남긴다. 적을 끌어당기지 않는다. 흑염마공 1~6성은 유지한다.', { attack: 'black_sun_burst', knockback: 'outward', pull: false, wideGround: true, groundSeconds: 3 }, '黑日滅劫')
        ]
      },
      dash: {
        id: 'demon_shadow', name: '마영신법', hanja: '魔影身法', type: '경공', partnerId: 'sovereign_step', evolutionName: '천마군림',
        levels: [
          level(1, '마영보', '이동속도가 증가한다. 기존 도주기를 함께 사용하며 별도의 도주기를 만들지 않는다.', { moveSpeedUp: true, invulnerable: false }, '魔影步'),
          level(2, '마영축지', '이동속도 강화를 유지하고 도주기 이동 거리가 증가한다.', { moveSpeedUp: true, dashDistanceUp: true, invulnerable: false }, '魔影縮地'),
          level(3, '마영잔신', '도주기 출발 자리에 잔상이 남았다가 1초 뒤 흑염 폭발을 일으킨다. 잔상은 적을 끌어들이지 않는다.', { afterimages: ['start'], explodeAfterSeconds: 1, taunts: false, invulnerable: false }, '魔影殘身'),
          level(4, '쌍영폭', '도주 경로 중간에도 잔상이 생겨 두 잔상이 각각 폭발한다.', { afterimages: ['start', 'midpoint'], explodeAfterSeconds: 1, taunts: false, invulnerable: false }, '雙影爆'),
          level(5, '마영확폭', '잔상 폭발 범위가 넓어진다.', { afterimages: ['start', 'midpoint'], explodeAfterSeconds: 1, wideExplosion: true, taunts: false, invulnerable: false }, '魔影擴爆'),
          level(6, '마영잔염', '잔상이 폭발한 자리에 3초간 지속 피해를 주는 흑염 장판을 남긴다.', { afterimages: ['start', 'midpoint'], explodeAfterSeconds: 1, wideExplosion: true, groundSeconds: 3, taunts: false, invulnerable: false }, '魔影殘焰'),
          level(7, '천마군림', '천마군림보 6성과 조합. 마기가 한 개 이상일 때 도주기를 쓰면 보유 마기를 모두 소모하고 착지 지점에 천마의 형상이 강림하여 화면 전체의 적에게 피해를 준다. 피해는 소모한 마기 수에 비례한다. 이후 1초간 회피 수치 +30을 얻으며, 지속 중 다시 발동하면 중첩 없이 지속시간만 갱신한다. 적을 경직시키지 않는다.', { minimumQi: 1, consume: 'all', screenWideDamage: true, damageScalesWithConsumed: true, buff: { evasionRating: 30, durationSeconds: 1, reapply: 'refresh' }, crowdControl: false, invulnerable: false }, '天魔君臨')
        ]
      }
    },
    minds: {
      heavenly_demon_art: {
        id: 'heavenly_demon_art', name: '천마신공', hanja: '天魔神功', type: '심법', partnerId: 'heavenly_sword', evolutionName: '천마강림',
        levels: [unlearned(),
          level(1, '1성', '적 처치 시 획득용 마기를 드랍한다. 보유 마기는 몸 주위를 도는 흑자색 불꽃으로 보이며 피격 시 고정 피해를 먼저 상쇄한다.', { killDropsQi: true }),
          level(2, '2성', '마기 보유 한계가 증가한다.', { capacityUp: true }),
          level(3, '3성', '한 번의 피격에서 추가로 마기 한 개를 더 소모할 수 있다.', { perHitConsumptionCapAdd: 1 }),
          level(4, '4성', '보유한 마기 개수에 비례하여 피해가 증가하고 검이 흑자색으로 물든다. 마기를 공격 비용으로 소모하지 않는다.', { damagePerHeldQi: true }),
          level(5, '5성', '검기의 직접 공격이 적에게 마인을 남긴다. 마인이 찍힌 적이 죽으면 흑염 폭발로 주변에 피해를 준다. 폭발은 마인을 새로 남기지 않으며, 마인 자체는 둔화나 지속 피해가 없다.', { directSwordHitsMark: true, markedDeathExplodes: true, explosionAppliesMark: false, crowdControl: false, markDurationSeconds: null }),
          level(6, '6성', '마인이 찍힌 적을 처치하면 체력을 소량 흡수한다.', { markedKillHeals: true, healAmount: null })
        ]
      },
      black_flame_art: {
        id: 'black_flame_art', name: '흑염마공', hanja: '黑焰魔功', type: '심법', partnerId: 'soul_ring', evolutionName: '흑일멸겁',
        levels: [unlearned(),
          level(1, '1성', '마기 보유 한계가 증가한다.', { capacityUp: true }),
          level(2, '2성', '흑염 고리의 피해가 증가한다.', { ringDamageUp: true }),
          level(3, '3성', '흑염 고리에 맞아 죽은 적이 마기를 드랍한다.', { ringKillDropsQi: true }),
          level(4, '4성', '흑염 고리가 도는 속도가 빨라진다.', { ringSpinUp: true }),
          level(5, '5성', '피격 방어로 마기를 실제 소모하면 주변에 흑염 폭발이 일어나 적을 밀어낸다. 한 피격당 한 번만 발동한다.', { blockBurstKnockback: true, oncePerHit: true }),
          level(6, '6성', '마기를 실제로 획득하면 2초간 흑염 고리 하나가 더 돈다. 보유 한계 또는 획득 금지 중에는 발동하지 않는다.', { pickupExtraRingSeconds: 2, requiresActualIncrease: true })
        ]
      },
      sovereign_step: {
        id: 'sovereign_step', name: '천마군림보', hanja: '天魔君臨步', type: '보법', partnerId: 'demon_shadow', evolutionName: '천마군림',
        levels: [unlearned(),
          level(1, '1성', '이동속도가 증가하고 걸음마다 발밑에 흑염 파문이 인다. 파문은 연출이며 피해가 없다.', { moveSpeedUp: true, footstepRipple: 'decorative' }),
          level(2, '2성', '도주기 이동 거리가 증가한다.', { dashDistanceUp: true }),
          level(3, '3성', '이동속도가 추가로 증가한다.', { moveSpeedUp: true }),
          level(4, '4성', '도주기 착지 지점에 진각 피해를 준다.', { landingStomp: true }),
          level(5, '5성', '진각이 주변 적을 바깥으로 밀쳐 낸다.', { stompKnockback: 'outward' }),
          level(6, '6성', '진각에 직접 맞은 적이 마기를 드랍한다. 흑염 장판과 지속 피해는 드랍을 발동하지 않는다.', { stompHitDropsQi: true, dotTriggers: false })
        ]
      }
    },
    pending: ['공격 계수와 강화 증가량', '검기 속도와 크기', '고리 회전 반경과 파동 주기', '마인 지속시간과 폭발 반경', '흡정 회복량(체력 회복 시스템 신규)', '회피 수치·재사용 대기시간 감소를 주는 다른 출처', '마기 시작 보유량과 드랍 잔존시간', '흑일멸겁 밀쳐 내기 거리']
  };
})(typeof window !== 'undefined' ? window : globalThis);
