/* Approved skill artwork. Rank, not a learned partner, determines evolution. */
(() => {
  'use strict';
  const basic = {
    plum_sword: ['assets/skill-icons/hwasan-plum-sword.png', '이십사수매화검법'],
    plum_rain: ['assets/skill-icons/hwasan-plum-rain.png', '매화검우'],
    dark_fragrance: ['assets/skill-icons/hwasan-dark-fragrance.png', '암향표'],
    zixia: ['assets/skill-icons/hwasan-zixia.png', '자하신공'],
    five_elements: ['assets/skill-icons/hwasan-five-elements.png', '오행매화보'],
    cangqiong_sword: ['assets/skill-icons/namgung-sky-sword.png', '창궁무애검법'],
    emperor_sword: ['assets/skill-icons/namgung-emperor-swords.png', '제왕검형'],
    infinite_step: ['assets/skill-icons/namgung-infinite-step.png', '무한보'],
    cangqiong_dayan: ['assets/skill-icons/namgung-dayan.png', '창궁대연신공'],
    thunder_qi: ['assets/skill-icons/namgung-heavenly-thunder.png', '천뢰기'],
    liuhe: ['assets/skill-icons/shared-liuhe.png', '육합공']
  };
  const pairs = {
    hwasan: [
      ['plum_sword', 'zixia', 'assets/skill-icons/ultimate-plum-fragrance.png', '매화만리향'],
      ['plum_rain', 'liuhe', 'assets/skill-icons/ultimate-plum-piercing.png', '매향침골'],
      ['dark_fragrance', 'five_elements', 'assets/skill-icons/ultimate-plum-snow.png', '매인설한']
    ],
    namgung: [
      ['cangqiong_sword', 'cangqiong_dayan', 'assets/skill-icons/ultimate-thunder-emperor.png', '뇌제개천'],
      ['emperor_sword', 'liuhe', 'assets/skill-icons/ultimate-emperor-descent.png', '제왕천림'],
      ['infinite_step', 'thunder_qi', 'assets/skill-icons/ultimate-infinite-thunder-step.png', '천뢰무극보']
    ]
  };
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  function resolve(id, rank = 1, faction = 'hwasan') {
    if (!Object.hasOwn(basic, id)) return null;
    const pair = pairs[faction]?.find(([active, partner]) => active === id || partner === id);
    const evolved = Number(rank) === 7 && Boolean(pair);
    const [file, name] = evolved ? pair.slice(2) : basic[id];
    return { id, name, evolved, src: file };
  }
  function markup(id, rank = 1, faction = 'hwasan') {
    const icon = resolve(id, rank, faction);
    return icon ? `<img class="martial-icon" src="${icon.src}" alt="" aria-hidden="true" width="48" height="48" decoding="async">` : '';
  }
  // Add artwork to a text label without erasing nested controls or installing observers.
  function label(element, id, rank = 1, faction = 'hwasan') {
    if (!element) return;
    const icon = resolve(id, rank, faction);
    let image = element.querySelector('img.martial-icon');
    if (!icon) { image?.remove(); return; }
    if (!image) { image = document.createElement('img'); image.className = 'martial-icon'; image.alt = ''; image.setAttribute('aria-hidden', 'true'); image.width = image.height = 48; element.prepend(image); }
    if (image.getAttribute('src') !== icon.src) image.setAttribute('src', icon.src);
    element.classList.add('has-martial-icon');
  }
  function byName(name) {
    const entry = Object.entries(basic).find(([, item]) => item[1] === name);
    if (entry) return resolve(entry[0]);
    for (const [faction, entries] of Object.entries(pairs)) {
      const pair = entries.find(item => item[3] === name);
      if (pair) return resolve(pair[0], 7, faction);
    }
    return null;
  }
  window.CheonSkillIcons = Object.freeze({ resolve, markup, label, byName });
})();

