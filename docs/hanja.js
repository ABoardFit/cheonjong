// 한자 글꼴 나누기: 한 글자만 단독으로 쓴 한자(무공록 노드, 장비 칸 등)는 .hj1(부티크 비트맵 굵은체),
// 그 밖에 글 속이나 여러 글자로 쓴 한자는 <span class="hj"> 로 감싸 Unifont 에 1도트 굵게를 건다(styles.css).
// 화면이 다시 그려져도 따라가도록 DOM 변화를 지켜본다.
(() => {
  'use strict';
  const HAN = /[㐀-鿿豈-﫿]/;
  const RUNS = /([㐀-鿿豈-﫿]+)/;
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'TITLE', 'NOSCRIPT']);
  const SVG = 'http://www.w3.org/2000/svg';

  function single(el) {
    return el.childElementCount === 0 && [...el.textContent.trim()].length === 1 && HAN.test(el.textContent);
  }
  function wrap(text) {
    const parent = text.parentElement;
    if (!parent || SKIP.has(parent.tagName) || parent.isContentEditable || parent.closest('.hj')) return;
    if (!HAN.test(text.nodeValue)) return;
    if (single(parent)) { parent.classList.add('hj1'); return; }
    if (parent.namespaceURI === SVG) return; // SVG 글은 감싸지 않음(글꼴 목록의 Unifont 로 그려짐)
    const parts = text.nodeValue.split(RUNS).map((part, i) => {
      if (i % 2 === 0) return document.createTextNode(part);
      const span = document.createElement('span');
      span.className = 'hj';
      span.textContent = part;
      return span;
    });
    text.replaceWith(...parts);
  }
  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) { wrap(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || SKIP.has(root.tagName)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node);
    texts.forEach(wrap);
  }
  function start() {
    scan(document.body);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') {
          // 글이 바뀐 요소는 한 글자 여부를 다시 본다
          const parent = record.target.parentElement;
          if (parent?.classList.contains('hj1') && !single(parent)) parent.classList.remove('hj1');
          wrap(record.target);
        } else record.addedNodes.forEach(scan);
        if (record.type === 'childList' && record.target.nodeType === Node.ELEMENT_NODE && record.target.classList.contains('hj1') && !single(record.target)) record.target.classList.remove('hj1');
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
