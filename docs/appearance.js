/* 외형은 저장된 주세력이 아니라 실제 트리 투자와 해금된 선택 별호로 결정한다. */
(() => {
  'use strict';
  const outfits = Object.freeze({
    baekui: { name: '백의', src: 'assets/outfits-v5/baekui.png' },
    hwasan: { name: '화산', src: 'assets/outfits-v5/hwasan.png' },
    shaolin: { name: '소림', src: 'assets/outfits-v5/shaolin.png' },
    wudang: { name: '무당', src: 'assets/outfits-v5/wudang.png' },
    sichuan: { name: '사천당가', src: 'assets/outfits-v5/sichuan.png' },
    namgung: { name: '남궁', src: 'assets/outfits-v5/namgung.png' },
    zhuge: { name: '제갈', src: 'assets/outfits-v5/zhuge.png' },
    murong: { name: '모용', src: 'assets/outfits-v5/murong.png' },
    hebei: { name: '하북팽가', src: 'assets/outfits-v5/hebei.png' },
    beggars: { name: '개방', src: 'assets/outfits-v5/beggars.png' },
    heavenly_demon: { name: '천마신교', src: 'assets/outfits-v5/heavenly_demon.png' },
    blood_cult: { name: '혈교', src: 'assets/outfits-v5/blood_cult.png' },
    green_forest: { name: '녹림', src: 'assets/outfits-v5/green_forest.png' },
    river_bandits: { name: '장강수로채', src: 'assets/outfits-v5/river_bandits.png' },
    assassins: { name: '살막', src: 'assets/outfits-v5/assassins.png' },
    hao: { name: '하오문', src: 'assets/outfits-v5/hao.png' },
    haedong: { name: '해동', src: 'assets/outfits-v5/haedong.png' },
    north_sea: { name: '북해', src: 'assets/outfits-v5/north_sea.png' },
    southern_tribes: { name: '남만', src: 'assets/outfits-v5/southern_tribes.png' },
  });
  const kinds = new Set(['minor', 'entry', 'skill', 'fusion', 'notable']);
  const isAllocatable = node => Boolean(node && kinds.has(node.kind) && node.locked !== true);

  function resolve({ allocated = [], nodes, factions = [], selectedTitle } = {}) {
    const factionIds = new Set(factions.map(faction => typeof faction === 'string' ? faction : faction.id)
      .filter(id => id !== 'baekui' && Object.hasOwn(outfits, id)));
    const counts = {}, categoryCounts = { righteous: 0, heterodox: 0, outer: 0 };
    for (const id of new Set(Array.isArray(allocated) ? allocated : [])) {
      if (typeof id !== 'string') continue;
      const node = nodes?.get?.(id);
      if (!isAllocatable(node) || node.id !== id) continue;
      if (Object.hasOwn(categoryCounts, node.category)) categoryCounts[node.category]++;
      if (factionIds.has(node.faction)) counts[node.faction] = (counts[node.faction] || 0) + 1;
    }
    const max = Math.max(0, ...Object.values(counts));
    const tied = Object.keys(counts).filter(id => counts[id] === max).sort();
    let id = 'baekui', reason = max ? 'unresolved-tie' : 'no-investment';
    if (tied.length === 1) { id = tied[0]; reason = 'most-invested'; }
    else if (max && selectedTitle?.unlocked === true && tied.includes(selectedTitle.faction)) {
      id = selectedTitle.faction;
      reason = 'selected-title';
    }
    return Object.freeze({ id, ...outfits[id], faction: id === 'baekui' ? null : id,
      counts: Object.freeze(counts), categoryCounts: Object.freeze(categoryCounts),
      tied: Object.freeze(tied), reason });
  }
  window.CheonAppearance = Object.freeze({ resolve, isAllocatable, outfits });
})();
