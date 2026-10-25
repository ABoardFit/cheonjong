/* 천종지자 무공록: 사용자 제안 원문을 바탕으로 한 설계 데이터. 수치는 미확정. */
window.CHEONJONG_DATA = {
  categories: [
    {
      id: 'righteous', name: '정파', color: '#d5aa6d',
      factions: [
        { id: 'hwasan', name: '화산', planned: true, detailsReady: true },
        { id: 'shaolin', name: '소림', planned: false, detailsReady: false },
        { id: 'wudang', name: '무당', planned: false, detailsReady: false },
        { id: 'sichuan', name: '사천', planned: false, detailsReady: false },
        { id: 'namgung', name: '남궁', planned: true, detailsReady: false },
        { id: 'zhuge', name: '제갈', planned: false, detailsReady: false },
        { id: 'murong', name: '모용', planned: false, detailsReady: false },
        { id: 'hebei', name: '하북', planned: false, detailsReady: false },
        { id: 'beggars', name: '개방', planned: false, detailsReady: false }
      ]
    },
    {
      id: 'heterodox', name: '사파', color: '#d77a79',
      factions: [
        { id: 'heavenly_demon', name: '천마신교', planned: true, detailsReady: false },
        { id: 'blood_cult', name: '혈교', planned: true, detailsReady: false },
        { id: 'green_forest', name: '녹림', planned: false, detailsReady: false },
        { id: 'river_bandits', name: '장강수로채', planned: false, detailsReady: false },
        { id: 'assassins', name: '살막', planned: false, detailsReady: false },
        { id: 'hao', name: '하오문', planned: false, detailsReady: false }
      ]
    },
    {
      id: 'outer', name: '새외무림', color: '#76bac7',
      factions: [
        { id: 'haedong', name: '해동', planned: false, detailsReady: false },
        { id: 'north_sea', name: '북해', planned: true, detailsReady: false },
        { id: 'southern_tribes', name: '남만', planned: true, detailsReady: false }
      ]
    }
  ],
  schools: {
    hwasan: {
      name: '화산',
      summary: '매화검 · 검우 · 경공을 꽃잎으로 잇는 무학. 세 갈래의 무공과 짝이 되는 심법·보법을 살펴본다.',
      inheritanceSummary: '기능적 성장은 계승하고, 검격 연출은 현재 단계의 완성된 형태로 대체한다. 종베기 → 거친 분홍 검로 → 속이 채워진 다섯 꽃잎 → 원형 폭발과 긴 검격 → 절세신공의 큰 꽃으로 발전하며, 이전 검격 이펙트를 겹쳐 재생하지 않는다. 매화만리향은 5·6단계의 두 직접 피해를 한 번에 통합하고 6단계 검격의 2배 반경으로 펼친다. 3초 장판과 심법을 유지하며 화면 전체에 꽃잎이 천천히 내린다. 꽃잎은 캐릭터를 따라 끌려가지 않고 바람과 중력을 따라 흐른다. 지속 피해는 이동하는 캐릭터 몸 중심의 큰 꽃 반경 안에만 적용한다.',
      skills: [
        {
          id: 'plum_sword', name: '이십사수매화검법', type: '초식', partnerId: 'zixia', evolutionName: '매화만리향',
          levels: [
            { rank: 1, form: 1, title: '매화노방', meaning: '매화가 길가에 있다.', description: '바로 앞의 적 한 명을 8방향으로 내려찍는다. 먼 적까지 선을 연결하지 않는다.' },
            { rank: 2, form: 3, title: '매화토염', meaning: '매화가 염기를 뱉어낸다.', description: '몸 중심에서 적이 있는 방향으로 가로로 벤다. 두껍고 거친 무광 분홍색 도트 검로를 그리며, 몸을 꼭짓점으로 한 75도 부채꼴과 실제 피해 범위가 일치한다.' },
            { rank: 3, form: 8, title: '매화구변', meaning: '매화가 아홉 번 변화한다.', description: '바라보는 방향에서 시작해 몸 중심으로 검을 시계방향 360도 휘두른다. 실제 검 끝의 회전과 함께 두껍고 거친 무광 분홍색 도트 검로가 원을 이루며 이전 종·횡베기 연출을 대체한다.' },
            { rank: 4, form: 12, title: '매화점점', meaning: '매화가 점점 피어난다.', description: '바라보는 방향부터 시계방향으로 원형 검로와 다섯 꽃잎을 그린다. 몸 중심의 꽃잎 안쪽에도 같은 분홍 먹의 거친 붓결이 남는다.' },
            { rank: 5, form: 21, title: '매향취접', meaning: '매화 향기가 나비를 취하게 한다.', description: '완성된 원과 속이 채워진 다섯 꽃잎 위에 길고 두꺼운 검격을 흩뿌린다. 1차 타격에 이어 원형 폭발이 기본 검격 반경의 1.5배까지 커지며 사라지고 해당 영역에 2차 충격 피해를 준다.' },
            { rank: 6, form: 23, title: '매향성류', meaning: '매화 향기가 흐름을 이룬다.', description: '5단계의 꽃·긴 검격·원형 폭발과 1·2차 충격 피해를 유지한다. 원형 폭발이 퍼지는 범위에 맞춰 옅은 반투명 분홍빛의 3초 지속 피해 영역이 커진다. 같은 무공이 같은 구역을 덮으면 장판 피해와 이펙트를 중첩하지 않는다.', mechanics: { groundDurationSeconds: 3 } },
            { rank: 7, form: 24, title: '매화만리향', meaning: '매화의 향은 만리를 간다.', description: '자하신공과 조합. 4·5·6단계에서 쓰는 단색 분홍 먹의 꽃 모양과 질감을 그대로 큰 크기로 펼치고, 몸 중심에 같은 질감의 큰 원을 함께 그린다. 꽃과 원은 바라보는 방향부터 시계방향으로 나타난 뒤, 같은 방향으로 작은 도트 꽃잎으로 풀려 사라진다. 아직 풀리지 않은 꽃과 원은 원래 색과 불투명도를 유지한다. 흩어진 꽃잎은 큰 꽃의 원 주변에서 빠르게 사라지며, 공격마다 움직임을 독립적으로 유지한다. 반경 안에 길고 두꺼운 검격을 하나씩 흩뿌리며 기존 1·2차 직접 피해의 합계를 한 번에 준다. 추가 상향 계수는 추후 조정한다. 기초 검격을 겹쳐 재생하지 않는다. 옅은 반투명 분홍빛의 3초 장판과 양쪽 무공의 효과를 계승하되 같은 구역의 장판 이펙트는 중첩하지 않고, 화면 전체에 꽃잎이 천천히 내린다. 꽃잎은 캐릭터를 따라 끌려가지 않고 바람과 중력을 따라 흐른다. 지속 피해 범위는 캐릭터 몸 중심의 큰 꽃 반경이며 이동을 따라간다. 화면 전체에 피해를 주지는 않고 기존 검법 장판과 같은 무공의 피해로 처리해 중첩하지 않는다.', mechanics: { directDamageEvents: 1, combinesDirectPhases: true, preservesGroundEffect: true, groundDurationSeconds: 3, radiusMultiplierFromRank6: 2, flowerRain: { visualScope: 'viewport', damageScope: 'player_body_circle', damageRadius: 'current_plum_sword_attack_radius', followsPlayer: true, stacksWithSwordFields: false } } }
          ]
        },
        {
          id: 'zixia', name: '자하신공', type: '심법', partnerId: 'plum_sword', evolutionName: '매화만리향',
          levels: [
            { rank: 1, form: null, title: '1성', meaning: '', description: '적 처치 시 꽃잎 드랍. 보유 꽃잎은 캐릭터 몸통 주위를 앞뒤로 돌며 받는 데미지를 상쇄시켜 준다.' },
            { rank: 2, form: null, title: '2성', meaning: '', description: '꽃잎 한계치 상승.' },
            { rank: 3, form: null, title: '3성', meaning: '', description: '꽃잎 갑옷 한계치 상승. 한 번의 데미지에 꽃잎 최대 1개 더 소모 가능.' },
            { rank: 4, form: null, title: '4성', meaning: '', description: '보유한 꽃잎 개수당 데미지 증가. 검이 보라색이 된다.' },
            { rank: 5, form: null, title: '5성', meaning: '', description: '보유 꽃잎 N개로 서로 다른 주변 적 최대 N명에게 한 개씩 부착해 지속 데미지. 한 적에게 여러 꽃잎은 붙지 않으며, 부착 비용과 시간 만료는 없다. 적 머리 위의 꽃잎과 몸 전체를 두르는 분홍 외곽선으로 부착을 표시한다. 피격으로 보유량이 줄면 그에 맞춰 부착 수가 줄고, 보유량 0개에서는 모든 부착이 사라진다.' },
            { rank: 6, form: null, title: '6성', meaning: '', description: '꽃잎 부착 적에게 검·검우·경공·착지 직접 공격이 명중하면 단일 대상 추가 피해를 주고 적의 몸 전체가 잠깐 분홍빛으로 점멸한다. 장판·꽃잎 부착·매화향의 지속 피해는 이 명중 효과를 발동하지 않는다.' },
            { rank: 7, form: null, title: '매화만리향', meaning: '매화의 향은 만리를 간다.', description: '이십사수매화검법과 조합. 6단계 검격의 2배 반경에 4·5·6단계와 같은 단색 먹빛 꽃과 큰 원이 나타난다. 꽃과 원은 바라보는 방향부터 시계방향으로 작은 도트 꽃잎으로 풀려 사라진다. 흩어진 꽃잎은 큰 꽃의 원 주변에서 빠르게 사라지며, 공격마다 움직임을 독립적으로 유지한다. 길고 두꺼운 검격을 반경 안에 흩뿌리며 기존 1·2차 직접 피해의 합계를 한 번에 준다. 이전 검격 연출을 대체하며, 옅은 반투명 분홍빛의 3초 장판과 양쪽 무공의 효과를 계승한다. 화면 전체에 천천히 내리는 꽃잎으로 매화향을 표현한다. 지속 피해는 이동하는 캐릭터 몸 중심의 큰 꽃 반경에만 적용하고 기존 검법 장판과 중첩하지 않는다.', mechanics: { directDamageEvents: 1, combinesDirectPhases: true, preservesGroundEffect: true, groundDurationSeconds: 3, radiusMultiplierFromRank6: 2, flowerRain: { visualScope: 'viewport', damageScope: 'player_body_circle', damageRadius: 'current_plum_sword_attack_radius', followsPlayer: true, stacksWithSwordFields: false } } }
          ]
        },
        {
          id: 'plum_rain', name: '매화검우', type: '초식', partnerId: 'liuhe', evolutionName: '매향침골',
          levels: [
            { rank: 1, form: 4, title: '매개이도', meaning: '매화가 피어나 날카롭게 이끈다.', description: '주변의 가까운 적 최대 한 명에게 한쪽에만 날이 선 휘어진 외날 도가 하나 떨어진다. 도는 적 뒤로 내려와 땅에 절반쯤 박혔다가 사라진다. 적이 없으면 떨어지지 않는다.' },
            { rank: 2, form: 6, title: '매화낙락', meaning: '매화가 떨어지고 떨어진다.', description: '주변의 서로 다른 적 최대 세 명에게 외날 도가 하나씩 떨어진다. 적이 한 명이면 도도 하나만 떨어진다.' },
            { rank: 3, form: 8, title: '매화혈우', meaning: '매화가 피의 비와 같다.', description: '주변의 서로 다른 적 최대 열 명에게 외날 도가 하나씩 순차적으로 떨어진다.' },
            { rank: 4, form: 14, title: '매화난만', meaning: '매화가 흐드러졌다.', description: '주변의 서로 다른 적 최대 열 명에게 외날 도가 하나씩 동시에 떨어져 데미지를 준다.' },
            { rank: 5, form: 16, title: '낙매성우', meaning: '떨어지는 매화가 비를 이룬다.', description: '주변의 서로 다른 적 최대 스무 명에게 도 대신 매화 꽃잎이 하나씩 순차적으로 떨어진다. 처치하지 않아도 실제로 꽃잎이 떨어진 곳에 획득할 꽃잎이 생성된다.' },
            { rank: 6, form: 19, title: '매향성류', meaning: '매화 향기가 물결을 이룬다.', description: '꽃잎이 떨어진 곳에 3초간 지속 데미지를 주는 장판을 남긴다.', mechanics: { groundDurationSeconds: 3 } },
            { rank: 7, form: 20, title: '매향침골', meaning: '매화 향기가 뼈에 스민다.', description: '육합공과 조합. 주변의 서로 다른 적 최대 스무 명에게 도 또는 꽃잎 중 하나가 무작위로 떨어진다. 도는 남아 있는 원거리 적을 우선 타게팅한다. 실제 꽃잎 낙하만 획득할 꽃잎을 생성하며, 도와 꽃잎 모두 지속 피해 영역을 남긴다.' }
          ]
        },
        {
          id: 'liuhe', name: '육합공', type: '심법', partnerId: 'plum_rain', evolutionName: '매향침골',
          levels: [
            { rank: 1, form: null, title: '1성', meaning: '', description: '꽃잎 한계치 상승.' },
            { rank: 2, form: null, title: '2성', meaning: '', description: '꽃잎 갑옷 1개가 감소시킬 수 있는 데미지 한계치 증가.' },
            { rank: 3, form: null, title: '3성', meaning: '', description: '꽃잎 한계치 상승.' },
            { rank: 4, form: null, title: '4성', meaning: '', description: '꽃잎 갑옷 한계치 상승.' },
            { rank: 5, form: null, title: '5성', meaning: '', description: '피격 방어로 꽃잎 갑옷을 실제 소모하면 주변에 넉백. 여러 꽃잎을 소모해도 피격 한 번당 최대 한 번만 발동하며, 매인설한 발동 비용으로 소모한 꽃잎에는 발동하지 않는다.' },
            { rank: 6, form: null, title: '6성', meaning: '', description: '실제로 꽃잎을 획득해 보유량이 증가했을 때 주변 적에게 분홍 폭발 데미지. 보유 한계에 차 있거나 획득 금지 중이면 발동하지 않는다.' },
            { rank: 7, form: null, title: '매향침골', meaning: '매화 향기가 뼈에 스민다.', description: '매화검우와 조합. 주변의 서로 다른 적 최대 스무 명에게 도 또는 꽃잎 하나를 무작위로 내린다. 도는 남아 있는 원거리 적을 우선하고 실제 꽃잎 낙하만 획득할 꽃잎을 생성한다. 도와 꽃잎 모두 지속 피해 영역을 남긴다.' }
          ]
        },
        {
          id: 'dark_fragrance', name: '암향표', type: '경공', partnerId: 'five_elements', evolutionName: '매인설한',
          levels: [
            { rank: 1, form: 2, title: '매화 접무', meaning: '매화가 나비처럼 춤춘다.', description: '이동속도 증가.' },
            { rank: 2, form: 4, title: '매개이도', meaning: '매화가 피어나 날카롭게 이끈다.', description: '이동속도 증가.' },
            { rank: 3, form: 5, title: '매화낙섬', meaning: '매화가 햇살을 떨어뜨린다.', description: '도주기 착지 자리에 단순한 먹빛 파문이 한 번 퍼진다. 바깥으로 장식 꽃잎을 뿌리지 않으며 넉백 이전에 데미지를 판정한다.' },
            { rank: 4, form: 11, title: '매화인동', meaning: '매화가 겨울을 버텨낸다.', description: '도주기 사용 도중 + 사용 후 1초 동안 받는 데미지 30% 감소.' },
            { rank: 5, form: 15, title: '매화분분', meaning: '떨어지는 매화가 어지러이 날린다.', description: '이동하는 경로에 3초간 지속 데미지를 주는 장판 생성.', mechanics: { groundDurationSeconds: 3 } },
            { rank: 6, form: 17, title: '매영조하', meaning: '매화 그림자가 강을 만든다.', description: '넓은 경로에 3초간 지속 데미지를 주는 장판 생성.', mechanics: { groundDurationSeconds: 3 } },
            { rank: 7, form: 18, title: '매인설한', meaning: '매화가 눈의 차가움을 견딘다.', description: '오행매화보와 조합. 꽃잎이 1개 이상일 때 도주기 사용 시 보유 꽃잎을 모두 소모하고 0.3초간 무적. 동시에 3초간 꽃잎 획득 불가(생성은 가능).' }
          ]
        },
        {
          id: 'five_elements', name: '오행매화보', type: '보법', partnerId: 'dark_fragrance', evolutionName: '매인설한',
          levels: [
            { rank: 1, form: null, title: '1성', meaning: '', description: '이동속도 증가. 암향표와 같은 도주기를 강화하며, 착지 지점에서 매화낙섬과 같은 먹빛 파문을 한 번 펼친다. 이 파문 자체는 추가 피해를 주지 않는다.' },
            { rank: 2, form: null, title: '2성', meaning: '', description: '도주기 이동 거리 증가.' },
            { rank: 3, form: null, title: '3성', meaning: '', description: '이동속도 증가.' },
            { rank: 4, form: null, title: '4성', meaning: '', description: '도주기에 돌진 데미지 계수 추가.' },
            { rank: 5, form: null, title: '5성', meaning: '', description: '도주기 착지 지점에서 몹들 넉백.' },
            { rank: 6, form: null, title: '6성', meaning: '', description: '도주기 데미지에 피격받은 적들이 꽃잎을 떨어뜨린다. 암향표 3단계를 보유하면 해당 폭발 데미지도 적용.' },
            { rank: 7, form: 18, title: '매인설한', meaning: '매화가 눈의 차가움을 견딘다.', description: '암향표와 조합. 꽃잎이 1개 이상일 때 도주기 사용 시 보유 꽃잎을 모두 소모하고 0.3초간 무적. 동시에 3초간 꽃잎 획득 불가(생성은 가능).' }
          ]
        }
      ],
      petalRules: [
        '기본 꽃잎 보유 한계는 1개, 피격 소모량은 1개다. 시작 시 실제 보유 개수와 강화 증가량은 미정이다.',
        '꽃잎의 고정 수치 피해 감소를 먼저 적용하고, 남은 피해에 퍼센트 피해 감소를 적용한다. 꽃잎 1개당 감소 수치는 미정이다.',
        '자하신공 1성은 처치 드랍, 매화검우 5단계는 낙하지점 생성, 오행매화보 6성은 도주기 피격 적의 꽃잎 드랍을 제안한다.',
        '적 부착 비용과 시간 만료는 없다. 피격으로 보유 꽃잎이 줄면 해당 수만큼 부착 효과도 줄거나 제거되며, 보유량 0개에서는 모든 부착이 사라진다.',
        '한 적에게 꽃잎은 최대 1개만 부착된다. 보유 꽃잎 N개일 때 서로 다른 적 최대 N명까지 부착할 수 있다.',
        '획득 폭발은 실제 보유량 증가가 있을 때만 발동한다. 보유 한계에 차 있거나 획득 금지 중이면 발동하지 않는다.',
        '소모 넉백은 피격 방어로 꽃잎 갑옷을 실제 소모한 피격당 최대 1회다. 매인설한의 전량 소모는 넉백을 발동하지 않는다.',
        '육합공 6성의 획득 폭발 → 처치 → 꽃잎 드랍 → 재획득 연쇄는 발생 간격·범위·재발동 기준을 결정해야 한다.',
        '매인설한의 3초 획득 금지 중에도 꽃잎 생성은 가능하다. 생성물의 잔존 시간과 획득 재개 방식은 미확정이다.'
      ],
      pending: [
        '“6번 강화하면 화경”의 횟수: 습득 포함 6단계인지, 습득 후 여섯 번 강화인지 확인 필요.',
        '조합 후 무공·심법이 차지하는 슬롯 수와 표시 방식.',
        '꽃잎 시작 보유량, 강화 증가량·합산 방식, 꽃잎 1개당 고정 피해 감소 수치, 부착 대상 선정과 재배치 방식.',
        '육합공 4성의 갑옷 한계가 1회 피격 소모 한계인지, 서로 다른 출처 넉백의 동시 적용 방식.',
        '획득 성공 시 다수 꽃잎의 개별·묶음 처리, 폭발의 연쇄 처치 드랍·재발동 간격. 발동형 기본 5초가 사건 반응형 효과에도 적용되는지는 별도 결정.',
        '경공 돌진·착지 폭발이 같은 적에게 맞을 때 꽃잎 드랍 횟수, 자하신공 추가 피해가 발동하는 피해 출처와 재귀 제한.',
        '공격 계수는 추후 밸런스 조정. 범위의 좌표 변환·표적 선정 세부·강화 수치 합산은 미정. 장판은 모두 3초이며 동일 스킬 피해는 중첩되지 않고 다른 스킬 피해는 중첩된다.',
        '화산 외 남궁·천마신교·혈교·북해·남만의 상세 무공은 다음 설계 대상.'
      ]
    }
  },
  rules: {
    inheritance: { mode: 'cumulative', visualMode: 'replace_with_current_evolution', fusionPreservesBothSkills: true, explicitDirectDamageConsolidation: 'plum_sword_rank_7' },
    petals: {
      baseCapacity: 1,
      baseConsumptionPerHit: 1,
      flatReductionPerPetal: null,
      mitigationOrder: ['flat', 'percent'],
      attachment: { cost: 0, durationSeconds: null, durationMode: 'no_expiry', linkToHeldPetals: true, clearsWhenHeldZero: true, maxPerEnemy: 1, maxAttachedEnemies: 'held_petal_count' },
      procs: {
        pickupExplosion: { requiresActualGain: true, atCapacity: false, whilePickupLocked: false },
        armorKnockback: { trigger: 'damage_mitigation_consumption', maxPerHit: 1, onDodgeCost: false }
      }
    },
    combat: {
      triggeredSkillCooldownSeconds: 5,
      basicAttack: { attacksPerSecond: 1, usesCooldown: false },
      damageCoefficients: null,
      defaultGroundDurationSeconds: 3,
      groundStacking: { withinSameSkill: false, betweenDifferentSkills: true, identity: 'canonical_skill_id', meaning: 'damage_and_visual_overlap_by_skill_union', visualOverlapWithinSameSkill: false },
      auraHitboxLinearScale: 5,
      swordEvolutionRain: { visualScope: 'viewport', damageScope: 'player_body_circle', damageRadius: 'current_plum_sword_attack_radius', followsPlayer: true, canonicalSkillId: 'plum_sword', stacksWithSwordFields: false },
      range: {
        scope: 'one_visible_screen',
        reference: '강호생존기 기본 무공',
        sourceValues: { basicSlashRange: 58, rainImpactRadius: 22, rainTargetArea: 110 },
        sourceUnits: 'reference_game_coordinates',
        convertedWorldScale: null
      }
    },
    fusionRequirement: { activeRank: 6, partnerRank: 6 },
    dodgeEvolution: { minimumPetals: 1, consume: 'all', invulnerabilitySeconds: 0.3, pickupLockSeconds: 3, canGenerateDuringLock: true }
  }
};
