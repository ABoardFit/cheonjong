/* 천종지자 남궁 시연 데이터. 초식명은 게임 창작이며 계수는 밸런스 조정 전이다. */
(function (root) {
  'use strict';

  const level = (rank, title, description, mechanics = {}, hanja = '') => ({ rank, title, description, mechanics, hanja });
  const unlearned = () => level(0, '미습득', '심법 효과 없이 초식 본래의 연출을 확인한다.');
  const sharedSource = { schoolId: 'hwasan', skillId: 'liuhe', ranks: [1, 2, 3, 4, 5, 6], path: 'CHEONJONG_DATA.schools.hwasan.skills[id=liuhe].levels' };
  const sharedRules = [
    '호신 검기 보유 한계 증가.',
    '호신 검기 한 개가 상쇄하는 고정 피해량 증가.',
    '호신 검기 보유 한계 추가 증가.',
    '한 번의 피격에서 소모할 수 있는 호신 검기 한계 증가.',
    '피격 방어로 호신 검기를 실제 소모하면 주변 적을 밀어낸다. 한 피격당 한 번만 발동한다.',
    '실제로 호신 검기를 획득하여 보유량이 증가했을 때만 주변에 검기 폭발 피해를 준다. 보유 한계 또는 획득 금지 중에는 발동하지 않는다.'
  ];
  function sharedDescription(rank) {
    const original = root.CHEONJONG_DATA?.schools?.hwasan?.skills?.find(skill => skill.id === 'liuhe')?.levels?.find(item => item.rank === rank);
    // Runtime mechanics remain canonical. Only the faction's resource and color words change.
    return original ? original.description.replaceAll('꽃잎 갑옷', '호신 검기').replaceAll('꽃잎', '호신 검기').replaceAll('분홍 폭발', '푸른 검기 폭발') : sharedRules[rank - 1];
  }
  const liuheLevels = [unlearned(), ...sharedSource.ranks.map(rank => ({
    rank, title: `${rank}성`, get description() { return sharedDescription(rank); },
    mechanics: { canonicalSkillId: 'liuhe', canonicalRank: rank }
  }))];

  root.CHEON_NAMGUNG = {
    id: 'namgung', name: '남궁', version: 1,
    summary: '창궁의 검로와 천뢰, 여덟 검의 군림을 잇는 남궁 무학.',
    authorship: { activeNames: '천종지자 창작 초식명', activeProgression: '사용자 지정', mindProgression: '이번 제작에서 제안한 설계', coefficients: '미확정' },
    palette: { ink: '#65a9cb', mid: '#8ccde8', light: '#d8f5ef', lightning: '#e5faff', gold: '#e4bc72', shadow: '#244758', ground: '#679eb5' },
    rules: {
      basicAttackIntervalSeconds: 1, activeCooldownSeconds: 5, groundDurationSeconds: 3,
      groundStacking: 'same_skill_union_different_skills_stack',
      evolution: { activeRank: 6, partnerRank: 6, resultRank: 7, retainsMindEffects: true, consumesSharedMind: false },
      resource: { id: 'protective_qi', name: '호신 검기', baseCapacity: 1, baseConsumptionPerHit: 1, reductionOrder: ['flat', 'percent'], attacksConsumeResource: false, sharedMechanicsId: 'hwasan_petal', sources: ['cangqiong_dayan_1_kill', 'thunder_qi_6_direct_dash_hit'], initialAmount: null },
      procs: { damageOverTimeCountsAsDirectHit: false, secondaryLightningCanRetrigger: false, pickupBurstRequiresActualIncrease: true, blockKnockbackOncePerHit: true },
      namgungDashInvulnerable: false,
      coefficients: null
    },
    paths: {
      sword: {
        id: 'cangqiong_sword', name: '창궁무애검법', hanja: '蒼穹無涯劍法', type: '초식', partnerId: 'cangqiong_dayan', evolutionName: '뇌제개천',
        levels: [
          level(1, '일검청천', '몸과 검을 함께 전진시켜 전방의 적을 찌른 뒤 검을 회수한다. 위아래·양옆·대각선 여덟 방향의 전신 동작을 사용하며 별도의 붓 검기는 그리지 않는다.', { attack: 'stab', target: 'nearest_in_facing', brushEffect: false, fullBodyAction: 'stab' }, '一劍靑天'),
          level(2, '검개창궁', '몸 중심에서 전방으로 부채꼴 검격을 펼친다. 찌르기 연출은 횡베기로 대체한다.', { attack: 'fan', fanSize: 'normal' }, '劍開蒼穹'),
          level(3, '창궁만리', '부채꼴 검격의 범위가 넓어진다. 이전 단계의 작은 부채꼴을 따로 겹쳐 그리지 않는다.', { attack: 'fan', fanSize: 'large' }, '蒼穹萬里'),
          level(4, '천뢰관공', '넓은 부채꼴 검격과 끝이 날카로운 번개 한 줄기가 전방을 관통한다. 적의 앞, 캐릭터의 뒤에 검기를 그린다.', { attack: 'fan_lightning', fanSize: 'large', lightningLines: 1, pointedLightning: true }, '天雷貫空'),
          level(5, '삼뢰분천', '넓은 부채꼴 검격과 함께 끝이 날카로운 번개 세 갈래가 각각 직선으로 뻗는다. 한 줄기 번개를 세 줄기로 강화한다.', { attack: 'fan_lightning', fanSize: 'large', lightningLines: 3, pointedLightning: true }, '三雷分天'),
          level(6, '창궁단악', '공격 반경 내 가장 먼 적을 향해 이전보다 세 배 굵고 두 배 긴 검격을 뻗는다. 부채꼴은 사라지며 검격은 적의 앞, 캐릭터의 뒤로 지나간다.', { attack: 'long_slash', target: 'farthest_in_radius', fan: false, widthMultiplier: 3, lengthMultiplier: 2 }, '蒼穹斷岳'),
          level(7, '뇌제개천', '창궁대연신공 6성과 조합. 주변에서 적이 가장 많이 모인 무리의 중심을 가로지르는 거대한 검격을 그리고, 그 검로를 따라 휘어진 흰 천뢰와 지면의 불꽃이 차례로 내려친다. 심법의 강화 효과를 모두 유지한다.', { attack: 'long_slash_sequential_sky_lightning', target: 'densest_cluster_in_radius', targetRadius: 335, clusterRadius: 120, frozenCluster: true, fan: false, lightningCollinear: true, lightningFromSky: true, sequentialStrikes: true, delaySeconds: null }, '雷帝開天')
        ]
      },
      formation: {
        id: 'emperor_sword', name: '제왕검형', hanja: '帝王劍形', type: '초식', partnerId: 'liuhe', evolutionName: '제왕천림',
        levels: [
          level(1, '일검진압', '가장 가까운 적 한 명에게 작은 검 한 자루가 부착되어 몸을 반복해서 찌른다. 지속 피해를 주며, 대상이 사망하면 해당 검은 사라진다.', { attack: 'attached_swords', maxSwords: 1, distinctTargets: true, expiresOnTargetDeath: true, swordScale: .5 }, '一劍鎭壓'),
          level(2, '삼검분위', '서로 다른 가까운 적 최대 세 명의 몸을 작은 검이 하나씩 반복해서 찌른다. 적이 한 명이면 검도 하나만 생긴다.', { attack: 'attached_swords', maxSwords: 3, distinctTargets: true, swordScale: .5 }, '三劍分威'),
          level(3, '제왕검위', '최대 세 자루의 작은 부착 검이 몸을 반복해서 찌르며 각 검의 지속 피해가 증가한다.', { attack: 'attached_swords', maxSwords: 3, distinctTargets: true, increasedDamage: true, swordScale: .5 }, '帝王劍威'),
          level(4, '팔검군림', '강화된 작은 검이 최대 여덟 자루로 증가해 서로 다른 적의 몸을 반복해서 찌른다. 적 수를 초과해 생성하지 않는다.', { attack: 'attached_swords', maxSwords: 8, distinctTargets: true, increasedDamage: true, swordScale: .5 }, '八劍君臨'),
          level(5, '검위진역', '커진 검 최대 여덟 자루가 각 적의 뒤에서 휘둘러져 몸을 통과해 앞으로 나온다. 대상과 주변 적에게 지속 피해를 주며 별도의 파문은 그리지 않는다.', { attack: 'sweeping_swords', maxSwords: 8, distinctTargets: true, increasedDamage: true, areaDamage: true, swordScale: 1, areaRipple: false }, '劍威震域'),
          level(6, '팔검회천', '적 수와 무관하게 검 여덟 자루가 상하좌우와 네 대각선의 고정된 여덟 방향으로 반경 끝까지 날아갔다 돌아온다. 왕복 중 직접 피해와 주변 피해를 준다.', { attack: 'out_return_swords', maxSwords: 8, fixedSwords: 8, distinctTargets: false, fixedDirections: 'cardinal_and_diagonal', increasedDamage: true, areaDamage: true, attached: false, endpoint: 'radius_edge' }, '八劍廻天'),
          level(7, '제왕천림', '육합공 6성과 조합. 길어진 거대한 검이 원거리 적을 우선 겨냥해 연속해서 지면을 관통하고 손잡이가 드러난 상태에서 멈춘다. 코등이는 지면 위에 남기며, 눈에 보이는 검날의 아래쪽부터 푸른 구슬로 풀려 사라진다. 주변 피해와 육합공 1~6성은 유지하며 충격 파문과 번개는 그리지 않는다.', { attack: 'giant_meteor_sword', maxSwords: 1, target: 'ranged_priority', increasedDamage: true, areaDamage: true, attached: false, returns: false, sizeReference: 'hwasan_great_flower', bladeLengthMultiplier: 1.5, stopAtExposedHilt: true, guardAboveGround: true, dissolution: 'blue_orbs_from_visible_cut_edge', impactRipple: false, impactLightning: false }, '帝王天臨'),
        ]
      },
      dash: {
        id: 'infinite_step', name: '무한보', hanja: '無限步', type: '경공', partnerId: 'thunder_qi', evolutionName: '천뢰무극보',
        levels: [
          level(1, '천풍보', '이동속도가 증가한다. 기존 도주기를 함께 사용하며 별도의 도주기를 만들지 않는다.', { moveSpeedUp: true, invulnerable: false }, '天風步'),
          level(2, '축지보', '이동속도 강화를 유지하고 도주기 이동 거리가 증가한다.', { moveSpeedUp: true, dashDistanceUp: true, invulnerable: false }, '縮地步'),
          level(3, '천뢰잔흔', '도주 경로에 3초간 감전 지대를 남긴다. 그 위의 적은 받는 피해가 증가한다. 감전 지대 자체는 별도 명중이나 지속 피해를 발생시키지 않는다.', { moveSpeedUp: true, dashDistanceUp: true, groundSeconds: 3, groundEffect: 'increased_damage_taken', invulnerable: false }, '天雷殘痕'),
          level(4, '축지일검', '감전 지대를 유지하며 도주기 사용 시 가까운 적 한 명에게 강력한 단일 직접 피해를 준다.', { groundSeconds: 3, groundEffect: 'increased_damage_taken', singleTargetDirectHit: true, invulnerable: false }, '縮地一劍'),
          level(5, '천뢰진역', '도주 경로의 감전 지대가 넓어진다. 가까운 적 한 명을 공격하는 축지일검도 유지한다.', { groundSeconds: 3, groundEffect: 'increased_damage_taken', wideGround: true, singleTargetDirectHit: true, invulnerable: false }, '天雷震域'),
          level(6, '일섬관뢰', '넓은 감전 지대를 유지하고 단일 대상 공격을 더욱 강화한다.', { groundSeconds: 3, groundEffect: 'increased_damage_taken', wideGround: true, singleTargetDirectHit: true, increasedSingleDamage: true, invulnerable: false }, '一閃貫雷'),
          level(7, '천뢰무극보', '천뢰기 6성과 조합. 넓은 감전 지대를 남기며 근처 적 한 명에게 여러 갈래가 휘어져 모이는 거대한 천뢰를 내리친다. 지면에서 흰 불꽃이 터지는 흰 중심·푸른 가장자리의 도트 낙뢰이며 모든 강화와 호신 검기 드랍을 유지한다. 무적은 부여하지 않는다.', { groundSeconds: 3, groundEffect: 'increased_damage_taken', wideGround: true, singleTargetDirectHit: true, increasedSingleDamage: true, singleLightningBurst: true, lightningFromSky: true, lightningShape: 'branching_flame', invulnerable: false }, '天雷無極步')
        ]
      }
    },
    minds: {
      cangqiong_dayan: {
        id: 'cangqiong_dayan', name: '창궁대연신공', hanja: '蒼穹大衍神功', type: '심법', partnerId: 'cangqiong_sword', evolutionName: '뇌제개천', proposed: true,
        levels: [unlearned(),
          level(1, '1성', '적 처치 시 획득용 호신 검기를 드랍한다. 보유 검기는 피격 시 고정 피해를 먼저 상쇄한다.', { killDropsQi: true }),
          level(2, '2성', '호신 검기 보유 한계가 증가한다.', { capacityUp: true }),
          level(3, '3성', '한 번의 피격에서 추가로 호신 검기 한 개를 더 소모할 수 있다.', { perHitConsumptionCapAdd: 1 }),
          level(4, '4성', '보유한 호신 검기 개수에 비례하여 피해가 증가한다. 검기를 공격 비용으로 소모하지 않는다.', { damagePerHeldQi: true }),
          level(5, '5성', '검의 직접 공격이 적에게 감전 표식을 남긴다. 표식이 있는 적은 받는 피해가 증가한다. 표식 자체는 별도 지속 피해나 명중을 발생시키지 않는다.', { directSwordHitsElectrify: true, electrifyIsDamageOverTime: false, markDurationSeconds: null }),
          level(6, '6성', '감전된 적에게 직접 공격이 명중하면 해당 적에게만 추가 낙뢰를 한 번 준다. 광역 피해가 아니며 지속 피해와 추가 낙뢰는 이를 다시 발동하지 않는다.', { directHitOnElectrifiedTarget: 'single_lightning', aoe: false, dotTriggers: false, recursive: false })
        ]
      },
      liuhe: { id: 'liuhe', name: '육합공', hanja: '六合功', type: '심법', partnerId: 'emperor_sword', evolutionName: '제왕천림', shared: true, source: sharedSource, presentation: { resourceName: '호신 검기', color: 'blue' }, levels: liuheLevels },
      thunder_qi: {
        id: 'thunder_qi', name: '천뢰기', hanja: '天雷氣', type: '심법', partnerId: 'infinite_step', evolutionName: '천뢰무극보', proposed: true,
        levels: [unlearned(),
          level(1, '1성', '이동속도가 증가한다.', { moveSpeedUp: true }),
          level(2, '2성', '도주기 이동 거리가 증가한다.', { dashDistanceUp: true }),
          level(3, '3성', '이동속도가 추가로 증가한다.', { moveSpeedUp: true }),
          level(4, '4성', '도주기의 단일 대상 직접 공격이 강화된다. 단일 공격이 해금되기 전에는 피해를 새로 만들지 않는다.', { singleDashAttackUp: true }),
          level(5, '5성', '도주기가 남긴 감전 지대 안에서 적이 받는 추가 피해가 증가한다. 감전 지대가 없는 단계에서는 지대를 새로 생성하지 않는다.', { zoneVulnerabilityUp: true }),
          level(6, '6성', '도주기의 직접 공격에 맞은 적이 호신 검기를 드랍한다. 감전 지대와 지속 피해는 드랍을 발동하지 않는다.', { directDashHitDropsQi: true, dotTriggers: false })
        ]
      }
    },
    pending: ['공격 계수와 강화 증가량', '부채꼴 각도와 공격 반경', '감전 표식 지속시간 및 피해 증가율', '검격 뒤 낙뢰 지연', '같은 표적의 왕복 타격 간격', '호신 검기 시작 보유량과 드랍 잔존시간', '사건 반응형 추가 낙뢰·획득 폭발의 재발동 간격']
  };
})(typeof window !== 'undefined' ? window : globalThis);
