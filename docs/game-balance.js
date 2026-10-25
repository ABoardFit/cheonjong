/* 실제 전투 검증을 위한 임시 수치. 무공 설계 원문의 확정 수치가 아니다.
 * 확정 규칙: 기본 공격 초당 1회, 발동형 5초, 장판 3초,
 * 꽃잎 기본 한도/피격 소모 1, 고정 감소 후 비율 감소, 적당 부착 1.
 * 검증용 선택: 시작 보유 0, 한 번의 실제 꽃잎 획득마다 폭발 1회,
 * 폭발 처치도 꽃잎을 생성하되 다음 프레임부터 획득(동기 재귀 없음).
 * 경공 적중 꽃잎은 적당 경공 1회에 1개. 자하 6성은 검/검우/경공/
 * 착지의 직접 피해만 발동하며 장판·부착·획득 폭발·추가 피해는 제외.
 * 같은 스킬 장판은 영역만 넓어지고 같은 적의 피해는 중복하지 않는다.
 */
(function (root) {
  'use strict';
  root.CHEONJONG_BALANCE = {
    version: 'hwasan-playtest-1', provisional: true,
    player: { hp: 160, radius: 12, speed: 180, regeneration: 0.16,
      attackSpeed: 1, attackDamage: 26, attackRadius: 58, attackRankRadius: 15, fusedRadiusMultiplier: 2,
      bodyCenterOffset: 38, swordFanRadius: 122, circleCenterCorrection: 26, flowerRadiusMultiplier: 1.5,
      bloomScatterMultiplier: 1.5, swordSectorHalfAngle: Math.PI * 5 / 24, bloomDelay: 0.35,
      attackRankDamage: 0.24, critChance: 0.08, critMultiplier: 1.7,
      hurtGrace: 0.48, pickupRadius: 35, xpMagnetRadius: 115 },
    petal: { start: 0, baseCapacity: 1, capacityPerUpgrade: 2,
      baseConsumption: 1, consumptionPerUpgrade: 1, flatReduction: 10,
      liuheFlatBonus: 8, damagePerHeld: 0.055, attachedDamage: 8,
      extraHitDamage: 13, pickupBurstDamage: 25, pickupBurstRadius: 88,
      armorKnockbackRadius: 115, armorKnockbackDistance: 72, lifetime: 25 },
    rain: { cooldown: 5, damage: 29, radius: 31, sequentialDelay: 0.065,
      counts: [0, 1, 3, 10, 10, 20, 20, 20] },
    dash: { cooldown: 5, duration: 0.23, distance: 135, distanceBonus: 65,
      speedPerUpgrade: 0.08, rushDamage: 27, landingDamage: 38,
      landingRadius: 85, knockbackDistance: 80, invulnerability: 0.3,
      pickupLock: 3, reduction: 0.3, reductionAfter: 1, trailSpacing: 26 },
    // 내력(마나): 초식 발동에 쓰고 초당 regen 씩 찬다. 비용 = 기본 + 단계가 하나 오를 때마다 perRank.
    // 검법(1~7단계)은 내력이 들지 않는다. 검우·경공만 쓴다.
    mana: { max: 100, regen: 12, rain: 10, dash: 20, perRank: 1 },
    // 연무장 고난도 맹약(출전 전에 거는 조건). reward 는 은자 보상에 더해지는 비율(시설 쪽에서 정산).
    pacts: {
      blood: { name: '혈맹', taken: 1.2, dealt: 1.1, reward: 0.15 },
      solo: { name: '단신', noHealing: true, reward: 0.25 },
      swift: { name: '속전', maxTime: 180, bossAt: 110, reward: 0.2 },
    },
    revive: { hp: 0.5, invulnerable: 2 },
    field: { duration: 3, tick: 0.3, swordDamage: 11, rainDamage: 9,
      trailDamage: 10, trailRadius: 25, wideTrailRadius: 43 },
    enemy: { spawnStart: 0.7, spawnEnd: 0.22, maximum: 115,
      hp: 18, hpPerSecond: 0.21, speed: 49, speedPerSecond: 0.17,
      contactDamage: 16, rangedDamage: 18, projectileSpeed: 135,
      xp: 3, rangedXp: 5, chargerXp: 5 },
    progression: { firstXp: 10, xpPerLevel: 0.8, bossAt: 150,
      bossHp: 2300, bossDamage: 29, maxTime: 240 },
    limits: { fields: 135, effects: 180, pickups: 360, damageTexts: 85,
      projectiles: 180, events: 160 }
  };
})(typeof window !== 'undefined' ? window : globalThis);
