(() => {
  'use strict';
  const data = window.CHEONJONG_DATA;
  const screen = document.querySelector('#martial-screen');
  const titleScreen = document.querySelector('#title-screen');
  const panel = document.querySelector('#school-panel');
  if (!data) {
    document.querySelector('#open-martial').disabled = true;
    document.querySelector('.prototype-caption').textContent = '무공 정보를 불러오지 못했습니다. data.js 파일을 확인해 주세요.';
    return;
  }
  const pairs = [
    { active: 'plum_sword', partner: 'zixia', label: '검 · 꽃이 피어나는 검로', evolution: '매화만리향' },
    { active: 'plum_rain', partner: 'liuhe', label: '우 · 하늘에서 내리는 매화', evolution: '매향침골' },
    { active: 'dark_fragrance', partner: 'five_elements', label: '보 · 향기를 남기는 발걸음', evolution: '매인설한' }
  ];
  const state = { category: 'righteous', faction: 'hwasan', pair: 0, ranks: {}, previewSkill: 'plum_sword' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const noteText = value => typeof value === 'string' ? value : [value?.title, value?.description || value?.detail || value?.text].filter(Boolean).join(' — ');
  const factionInfo = id => {
    for (const category of data.categories) {
      const faction = category.factions.find(item => item.id === id);
      if (faction) return { faction, category };
    }
    return null;
  };
  const getSkill = id => data.schools.hwasan.skills.find(skill => skill.id === id);
  function inheritedEffects(skill, rank) {
    if (rank <= 1 || data.rules.inheritance?.mode !== 'cumulative') return '';
    const pair = pairs.find(item => item.active === skill.id || item.partner === skill.id);
    const inheritedSkills = rank === 7 && data.rules.inheritance.fusionPreservesBothSkills
      ? [getSkill(pair.active), getSkill(pair.partner)]
      : [skill];
    const consolidated = rank === 7 && pair.active === 'plum_sword';
    return `<details class="inherited-effects"><summary>성장 이력과 계승 효과 보기</summary>${rank === 7 ? `<p class="inheritance-explanation">두 무공의 1~6단계 성장 이력입니다. ${consolidated ? '매화만리향에서는 기존 1·2차 직접 피해를 한 번에 합산합니다. 이전 단계의 기초 검로를 다시 재생하지 않습니다. 6단계 검격의 2배 반경에 처음부터 큰 꽃잎을 시계방향으로 펼친 뒤 작은 도트 꽃잎으로 분해합니다. 흩어진 꽃잎은 큰 꽃의 원 주변에서 빠르게 사라지며, 공격마다 움직임을 독립적으로 유지합니다. 길고 두꺼운 검격, 겹치지 않는 옅은 분홍빛 장판과 심법 기능을 유지합니다. 화면 전체에 꽃잎이 천천히 내리며, 지속 피해는 캐릭터 몸 중심의 큰 꽃 반경 안에서만 발생하고 이동을 따라갑니다. 기존 검법 장판과 피해를 중첩하지 않습니다.' : '양쪽의 완성 효과와 새로운 조합 효과를 함께 얻습니다.'} 반대쪽의 현재 열람 단계와 관계없이 완성 시의 효과를 표시합니다.</p>` : '<p class="inheritance-explanation">아래는 이전 단계의 성장 이력입니다. 기능은 계승하지만 공격 표현은 현재 단계의 완성 형태로 바뀝니다. 이전 공격 이펙트를 겹쳐 재생하지 않습니다.</p>'}${inheritedSkills.map(source => `<section class="inherited-source"><h6>${escape(source.name)} · 1~${rank === 7 ? 6 : rank - 1}${['zixia', 'liuhe', 'five_elements'].includes(source.id) ? '성' : '단계'}${consolidated && source.id === 'plum_sword' ? ' · 진화 전 성장 이력' : ''}</h6><ol>${source.levels.filter(level => Number(level.rank) < (rank === 7 ? 7 : rank)).map(level => `<li><strong>${level.rank}${['zixia', 'liuhe', 'five_elements'].includes(source.id) ? '성' : '단계'}${level.form ? ` · ${escape(level.form)}초식` : ''} · ${escape(level.title)}</strong><span>${escape(level.description)}${consolidated && source.id === 'plum_sword' ? ' (진화 시 직접 타격은 단일 베기로 통합)' : ''}</span></li>`).join('')}</ol></section>`).join('')}</details>`;
  }
  function renderMap() {
    document.querySelector('#category-clusters').innerHTML = data.categories.map((category, index) => `
      <section class="category-cluster ${escape(category.id)} ${state.category === category.id ? 'is-selected' : ''}" aria-label="${escape(category.name)} 세력">
        <button class="category-heading" data-category="${escape(category.id)}" aria-pressed="${state.category === category.id}">
          <span class="category-number">0${index + 1}</span><strong>${escape(category.name)}</strong><small>${category.factions.length}개 세력</small>
        </button>
        <div class="faction-list">${category.factions.map(faction => `
          <button class="faction-button ${faction.planned ? 'is-planned' : ''} ${state.faction === faction.id ? 'is-selected' : ''}" data-faction="${escape(faction.id)}" aria-pressed="${state.faction === faction.id}">
            <span class="faction-name">${escape(faction.name)}</span><span class="faction-status">${faction.planned ? '우선 개발' : '확장 예정'}</span>
          </button>`).join('')}</div>
      </section>`).join('');
    document.querySelectorAll('[data-line]').forEach(path => path.classList.toggle('is-selected', path.dataset.line === state.category));
  }
  function renderSkill(skill) {
    if (!skill) return '<p>무공 설계 예정</p>';
    const currentRank = state.ranks[skill.id] || 1;
    const level = skill.levels.find(item => Number(item.rank) === currentRank) || skill.levels[currentRank - 1];
    const support = ['zixia', 'liuhe', 'five_elements'].includes(skill.id);
    return `<section class="skill-column" aria-label="${escape(skill.name)} 단계 열람">
      <span class="skill-type">${support ? '조합 심법 · 보법' : '주 무공'}</span><h4>${escape(skill.name)}</h4>
      <div class="stage-tabs" role="group" aria-label="${escape(skill.name)} 단계 선택">${skill.levels.map(item => `
        <button class="stage-button ${Number(item.rank) === 7 ? 'fusion-stage' : ''}" data-skill="${escape(skill.id)}" data-rank="${item.rank}" aria-pressed="${Number(item.rank) === currentRank}" aria-label="${escape(skill.name)} ${item.rank}${support ? '성' : '단계'}${Number(item.rank) === 7 ? ', 절세신공' : ''}">${item.rank}<small>${Number(item.rank) === 7 ? '조합' : Number(item.rank) === 6 ? '화경' : support ? '성' : '단계'}</small></button>`).join('')}</div>
      <div class="stage-detail ${currentRank === 7 ? 'is-fusion' : ''}">
        <p class="stage-form">${level.form ? `${escape(level.form)}초식 · ` : ''}${currentRank === 7 ? '절세신공' : `${currentRank}${support ? '성' : '단계'}`}</p>
        <h5>${escape(level.title || skill.name)}</h5>
        ${level.meaning ? `<p class="stage-meaning">${escape(level.meaning)}</p>` : ''}
        <p class="new-effect-label">새로 얻는 효과</p>
        <p class="stage-description">${escape(level.description)}</p>
        ${inheritedEffects(skill, currentRank)}
      </div>
    </section>`;
  }
  function fusionText(pair) {
    const active = getSkill(pair.active);
    const partner = getSkill(pair.partner);
    const requirement = data.rules.fusionRequirement;
    const dodge = data.rules.dodgeEvolution;
    return `<strong>절세신공 · ${escape(pair.evolution)}</strong><br>${escape(active.name)} ${requirement?.activeRank || 6}단계(화경)와 ${escape(partner.name)} ${requirement?.partnerRank || 6}성을 모두 완성하면 조합할 수 있습니다.${data.rules.inheritance?.fusionPreservesBothSkills ? `<br>${escape(active.name)} + ${escape(partner.name)}: 양쪽의 기능적 성장을 계승하며, 공격 연출은 조합의 완성 형태로 대체합니다.` : ''}${pair.active === 'plum_sword' ? '<br>매화만리향의 직접 피해는 기존 1·2차 피해를 합쳐 한 번에 줍니다. 이전 검격과 2차 개화 폭발을 별도로 재생하지 않으며 장판·꽃잎·심법 효과는 유지합니다. 화면 전체에 꽃잎이 천천히 내리지만 지속 피해는 캐릭터 몸 중심의 큰 꽃 반경 안에만 적용하며, 기존 검법 장판과 중첩하지 않습니다. 자하신공의 직접 명중 추가 피해는 단일 대상에 적용하며 적의 몸 전체가 잠깐 점멸합니다. 장판·부착·매화향의 지속 피해는 이 명중 효과를 발동하지 않습니다.' : ''}${pair.active === 'dark_fragrance' && dodge ? `<br>매인설한: 꽃잎을 ${dodge.minimumPetals}개 이상 보유했을 때 전량 소모합니다. 사용 시점부터 총 ${dodge.invulnerabilitySeconds}초간 무적이며, 동시에 ${dodge.pickupLockSeconds}초간 꽃잎 획득이 금지됩니다. 꽃잎 생성은 가능합니다.` : ''}`;
  }
  function baseRules() {
    const petals = data.rules.petals, combat = data.rules.combat;
    if (!petals || !combat) return '';
    return `<details class="reference-notes" open><summary>기본 전투 규칙 · 수치 미정 항목은 추후 조율</summary><ul><li>꽃잎 기본 보유 한도 ${escape(petals.baseCapacity)}개 · 피격 소모 ${escape(petals.baseConsumptionPerHit)}개. 시작 보유량을 뜻하지 않습니다.</li><li>피해 감소 순서: 꽃잎의 고정 수치 감소 → 비율 감소. 감소량·공격 계수는 밸런스 조율 예정입니다.</li><li>적에게 꽃잎 부착: 비용 ${escape(petals.attachment.cost)} · 시간 제한 없음. 적 한 마리당 최대 ${escape(petals.attachment.maxPerEnemy ?? 1)}개, 보유 꽃잎 수만큼 서로 다른 적에게 부착합니다. 피격으로 보유 꽃잎이 줄면 부착도 줄거나 사라지고, 보유량이 0개가 되면 모두 제거됩니다.</li><li>기본 공격: 공격 속도 초당 ${escape(combat.basicAttack.attacksPerSecond)}회 · 재사용 대기시간과 별도 분류.</li><li>발동형 스킬 기본 재사용 대기시간 ${escape(combat.triggeredSkillCooldownSeconds)}초. 추가 재발동 간격과 연쇄 범위는 추후 조율합니다.</li>${petals.procs ? `<li>획득 폭발: 실제 꽃잎 보유량이 늘어날 때만 발동합니다. 획득 전부터 보유 한도가 가득 찼거나 획득 금지 중이면 발동하지 않습니다. 이번 획득으로 한도에 도달한 경우는 정상 발동합니다.</li><li>방어 넉백: 한 번의 피격에 꽃잎을 여러 개 소모해도 최대 ${escape(petals.procs.armorKnockback.maxPerHit)}회. 매인설한의 비용 소모로는 발동하지 않습니다. 오행매화보의 착지 넉백은 유지합니다.</li>` : ''}<li>장판·부착·매화향의 지속 피해는 명중 추가 효과나 피격 점멸을 발동하지 않습니다.</li><li>장판 기본 지속시간 ${escape(combat.defaultGroundDurationSeconds)}초. 옅은 반투명 분홍빛으로 표시하며, 실제 꽃잎 생성·획득은 처치·낙검 등 기존 규칙을 따릅니다.</li><li>장판 피해 중첩: 같은 무공의 장판끼리는 중첩하지 않고, 서로 다른 무공의 장판끼리는 중첩합니다. 같은 무공을 여러 번 사용하거나 진화해도 같은 출처로 판정합니다. 장판 개수 자체의 제한은 아닙니다.</li><li>범위 기준: ${escape(combat.range.reference)} · 한 화면 기준. 실제 전투 좌표로의 배율은 미정입니다.</li><li>매화만리향: 화면 전체에 천천히 내리는 꽃잎은 연출입니다. 지속 피해는 캐릭터 몸 중심의 큰 꽃 반경을 따라가며, 기존 이십사수매화검법 장판과 중첩하지 않습니다.</li></ul></details>`;
  }
  function renderPanel() {
    window.MartialPreview?.destroy();
    const info = factionInfo(state.faction);
    if (!info) return;
    const { faction, category } = info;
    const school = data.schools[state.faction];
    const ready = faction.detailsReady && school;
    panel.innerHTML = `<div class="school-heading"><div><p class="school-eyebrow">${escape(category.name)} / ${faction.planned ? '우선 개발' : '확장 예정'}</p><h2>${escape(faction.name)}${state.faction === 'hwasan' ? ' · 매화의 길' : ''}</h2><p class="school-summary">${ready ? escape(school.summary) : '이 세력의 무공과 성장 경로를 차례로 설계합니다.'}</p></div><span class="school-seal">${state.faction === 'hwasan' ? '梅花' : '武學'}</span></div>`;
    if (!ready || state.faction !== 'hwasan') {
      panel.innerHTML += `<div class="empty-school"><span class="empty-number" aria-hidden="true">未</span><h3>무공 설계 예정</h3><p>${faction.planned ? '화산, 남궁, 천마신교, 혈교, 북해, 남만을 우선 개발합니다. 현재 화산의 무공 3쌍을 먼저 살펴볼 수 있습니다.' : '무학의 계보에 자리를 마련했습니다. 각 세력의 무공은 이후 확장할 예정입니다.'}</p><p>상단의 화산을 선택하면 단계별 무공과 조합을 확인할 수 있습니다.</p></div>`;
      return;
    }
    panel.innerHTML += `<div class="pair-selector" role="group" aria-label="화산 무공 조합 선택">${pairs.map((pair, index) => `<button class="pair-button" data-pair="${index}" aria-pressed="${state.pair === index}"><small>${escape(pair.label)}</small><span class="pair-title">${escape(getSkill(pair.active).name)}</span><span class="pair-subtitle">+ ${escape(getSkill(pair.partner).name)}</span><span class="pair-result"><span aria-hidden="true">↳</span>${escape(pair.evolution)}</span></button>`).join('')}</div>`;
    const pair = pairs[state.pair];
    panel.innerHTML += `<div class="pair-intro"><h3>절세신공 · ${escape(pair.evolution)}</h3><p>각 무공의 단계를 따로 선택하여 열람할 수 있습니다.</p></div>${data.rules.inheritance?.mode === 'cumulative' ? '<p class="inheritance-banner">기능은 계승 · 검격은 완성된 형태로 진화<span>단계 버튼은 열람용입니다. 이전 공격 이펙트를 반복하지 않습니다. 매화만리향은 큰 꽃잎의 시계방향 등장·도트 꽃잎 분해·길고 두꺼운 검격·겹치지 않는 옅은 분홍빛 장판·화면 전체에 내리는 꽃잎으로 완성됩니다. 지속 피해는 이동하는 캐릭터 몸 중심의 큰 꽃 반경에만 적용됩니다.</span></p>' : ''}<div class="preview-layout"><div class="preview-heading"><p class="school-eyebrow">動 · 초식의 형상</p><h4 id="preview-title">${escape(getSkill(state.previewSkill).name)}</h4><p id="preview-stage-label">${state.ranks[state.previewSkill] || 1}단계 동작 시안</p><button class="preview-replay" data-replay>동작 다시 보기 <span aria-hidden="true">↻</span></button><small>동작 시안 · 피해량 미적용<br>아래 단계 선택에 따라 바뀝니다.</small></div><canvas id="effect-preview" width="720" height="340" aria-label="무공의 동작과 효과를 보여주는 시안">무공의 동작 시안입니다. 상세 효과는 아래 단계별 설명에서 확인할 수 있습니다.</canvas></div><div class="skill-columns">${renderSkill(getSkill(pair.active))}${renderSkill(getSkill(pair.partner))}</div><p class="fusion-note">${fusionText(pair)}</p>`;
    panel.innerHTML += baseRules();
    if (school.petalRules?.length) {
      panel.innerHTML += `<details class="reference-notes"><summary>꽃잎의 생성 · 갑옷 · 부착 규칙 살펴보기</summary><ul>${school.petalRules.map(rule => `<li>${escape(noteText(rule))}</li>`).join('')}</ul></details>`;
    }
    if (school.pending?.length) {
      panel.innerHTML += `<details class="reference-notes pending-notes"><summary>아직 조율 중인 세부 수치</summary><ul>${school.pending.map(item => `<li>${escape(noteText(item))}</li>`).join('')}</ul></details>`;
    }
    if (window.MartialPreview) {
      window.MartialPreview.mount(document.querySelector('#effect-preview'));
      window.MartialPreview.setSkill(state.previewSkill, state.ranks[state.previewSkill] || 1);
    }
  }
  function showMartial() {
    titleScreen.hidden = true;
    screen.hidden = false;
    renderMap();
    renderPanel();
    window.scrollTo(0, 0);
    document.querySelector('#back-main').focus({ preventScroll: true });
  }
  function showMain() {
    window.MartialPreview?.destroy();
    screen.hidden = true;
    titleScreen.hidden = false;
    window.scrollTo(0, 0);
    document.querySelector('#open-martial').focus({ preventScroll: true });
  }
  // 무공록 버튼은 이제 스킬 트리(tree.js)를 연다. 이 세력 계보 화면은 보류 중이며 MartialLineage.show()로만 연다.
  window.MartialLineage = { show: showMartial };
  document.querySelector('#back-main').addEventListener('click', showMain);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !screen.hidden) showMain(); });
  document.querySelector('#category-clusters').addEventListener('click', event => {
    const factionButton = event.target.closest('[data-faction]');
    const categoryButton = event.target.closest('[data-category]');
    if (factionButton) {
      state.faction = factionButton.dataset.faction;
      state.category = factionInfo(state.faction).category.id;
      renderMap(); renderPanel();
      document.querySelector(`[data-faction="${state.faction}"]`).focus({ preventScroll: true });
    } else if (categoryButton) {
      state.category = categoryButton.dataset.category;
      const category = data.categories.find(item => item.id === state.category);
      if (!category.factions.some(faction => faction.id === state.faction)) state.faction = category.factions[0].id;
      renderMap(); renderPanel();
      document.querySelector(`[data-category="${state.category}"]`).focus({ preventScroll: true });
    }
  });
  panel.addEventListener('click', event => {
    const pairButton = event.target.closest('[data-pair]');
    const rankButton = event.target.closest('[data-rank]');
    if (pairButton) {
      state.pair = Number(pairButton.dataset.pair);
      state.previewSkill = pairs[state.pair].active;
      renderPanel();
      panel.querySelector(`[data-pair="${state.pair}"]`).focus({ preventScroll: true });
    } else if (rankButton) {
      const id = rankButton.dataset.skill;
      const rank = Number(rankButton.dataset.rank);
      state.ranks[id] = rank;
      state.previewSkill = id;
      renderPanel();
      panel.querySelector(`[data-skill="${id}"][data-rank="${rank}"]`).focus({ preventScroll: true });
    } else if (event.target.closest('[data-replay]')) {
      window.MartialPreview?.replay();
    }
  });
})();

