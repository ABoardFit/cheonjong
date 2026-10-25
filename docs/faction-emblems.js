/* 천종지자 · 세력 문양. Original canvas silhouettes, stamped in the main flower's ink grain. */
(() => {
  'use strict';
  const rows = [
    ['hwasan','화산','righteous','나선으로 피어난 매화',['#6e294a','#b4577b','#d181a0','#8f3b60']],
    ['shaolin','소림','righteous','다섯 잎의 금련',['#63502d','#aa8550','#c7a873','#89673c']],
    ['wudang','무당','righteous','태극을 감싼 팔괘',['#202020','#666666','#bdbdbd','#f2f2f2']],
    ['sichuan','사천','righteous','세 날의 독표',['#3c4d37','#738a57','#9eac77','#596c42']],
    ['namgung','남궁','righteous','뇌광을 가르는 제왕검',['#354d68','#607eab','#91a9cb','#47638d']],
    ['zhuge','제갈','righteous','칠우선과 삼효',['#3d5855','#6f9690','#9db8ab','#537870']],
    ['murong','모용','righteous','시위를 당겨 겨눈 활',['#514367','#8a75a6','#b5a1c8','#6c598b']],
    ['hebei','하북','righteous','세 줄기 호조 위의 검',['#604130','#a7754d','#c99b6e','#855839']],
    ['beggars','개방','righteous','술호리병과 대나무 장봉',['#4a5431','#8b9560','#b4b780','#6b7646']],
    ['heavenly_demon','천마신교','heterodox','거슬러 타오르는 마염',['#482e55','#86527f','#ad7c9f','#673d68']],
    ['blood_cult','혈교','heterodox','핏방울과 혈륜',['#632d37','#ad5260','#cf7d85','#873b4b']],
    ['green_forest','녹림','heterodox','비스듬히 눌러쓴 삿갓과 안대',['#304b3c','#5d8263','#8ea488','#45644b']],
    ['river_bandits','장강수로채','heterodox','큰 돛을 펼친 범선',['#294f59','#578d9a','#89b2b6','#3c6e7d']],
    ['assassins','살막','heterodox','긴 초승달을 겨눈 비수',['#3a3b50','#74758f','#a1a0b5','#555770']],
    ['hao','하오문','heterodox','밤을 읽는 눈등롱',['#604635','#ad8762','#d0ae84','#896747']],
    ['haedong','해동','outer','태극과 건곤감리',['#333437','#525154','#777477','#414044','#6b3438','#b15b63','#cf888b','#90454e','#314b66','#5c80a2','#8ca8bf','#456681']],
    ['north_sea','북해','outer','여섯 갈래의 빙정',['#3b5969','#78a4b5','#accbd1','#587f96']],
    ['southern_tribes','남만','outer','송곳니를 드러낸 맹호의 옆얼굴',['#585035','#a09659','#c7bc7d','#7e7443']]
  ];
  const manifest = rows.map(([id,name,group,motif,palette]) => Object.freeze({id,name,group,motif,palette:Object.freeze(palette)}));
  const cache = new Map();
  const make = (size = 160) => { const c = document.createElement('canvas'); c.width = c.height = size; return c; };
  const path = (q, commands) => {
    q.beginPath();
    for (const [op,...v] of commands) ({M:()=>q.moveTo(...v),L:()=>q.lineTo(...v),C:()=>q.bezierCurveTo(...v),Q:()=>q.quadraticCurveTo(...v),Z:()=>q.closePath()})[op]();
    q.fill();
  };
  const poly = (q, points) => path(q, points.map((p,i)=>[i?'L':'M',...p]).concat([['Z']]));
  const disc = (q,x,y,r) => {q.beginPath();q.arc(x,y,r,0,Math.PI*2);q.fill();};
  const cut = (q, fn) => {q.save();q.globalCompositeOperation='destination-out';fn();q.restore();};
  const rotate = (q, angle, fn) => {q.save();q.translate(80,80);q.rotate(angle);q.translate(-80,-80);fn();q.restore();};
  const ring = (q,x,y,r,width) => {q.beginPath();q.arc(x,y,r,0,Math.PI*2);q.arc(x,y,r-width,0,Math.PI*2,true);q.fill();};
  const leaf = (q,x,y,w,h,angle=0) => {q.save();q.translate(x,y);q.rotate(angle);path(q,[['M',0,-h],['C',w,-h*.55,w,h*.3,0,h],['C',-w,h*.3,-w,-h*.55,0,-h],['Z']]);q.restore();};
  const blade = q => poly(q,[[80,13],[93,44],[85,101],[75,101],[68,44]]);
  const silhouettes = {
    shaolin(q) {
      leaf(q,80,62,22,48);
      for (const s of [-1,1]) {leaf(q,80+s*28,78,19,43,s*.66);leaf(q,80+s*43,97,16,36,s*1.03);}
      cut(q,()=>{for(const s of [-1,1])path(q,[['M',80,121],['C',80+s*4,93,80+s*17,69,80+s*30,49],['C',80+s*20,83,80+s*13,106,80,121],['Z']]);});
      path(q,[['M',29,125],['Q',80,144,131,125],['L',119,137],['Q',80,150,41,137],['Z']]);
    },
    wudang(q) {
      disc(q,80,80,45);cut(q,()=>{q.beginPath();q.arc(80,80,39,-Math.PI/2,Math.PI/2);q.arc(80,99.5,19.5,Math.PI/2,Math.PI*1.5,true);q.arc(80,60.5,19.5,Math.PI/2,-Math.PI/2);q.fill();disc(q,80,100,7);});disc(q,80,60,7);
      for(let i=0;i<8;i++)rotate(q,i*Math.PI/4,()=>{for(let j=0;j<3;j++){q.fillRect(67,10+j*8,26,5);if((i>>j)&1)cut(q,()=>q.fillRect(77,9+j*8,6,7));}});
    },
    sichuan(q) {
      for(let i=0;i<3;i++)rotate(q,i*Math.PI*2/3,()=>path(q,[['M',80,13],['C',112,26,123,48,111,70],['L',91,92],['L',71,81],['L',94,58],['Q',100,43,80,13],['Z']]));
      disc(q,80,80,17);cut(q,()=>disc(q,80,80,8));
    },
    namgung(q) {
      blade(q);poly(q,[[53,99],[107,99],[100,109],[85,106],[85,135],[80,144],[75,135],[75,106],[60,109]]);
      poly(q,[[61,24],[29,81],[51,76],[27,128],[64,78],[44,81]]);poly(q,[[107,30],[132,71],[112,68],[136,116],[101,77],[120,81]]);
      cut(q,()=>poly(q,[[80,29],[83,47],[80,91],[78,47]]));
    },
    zhuge(q) {
      for(let i=-3;i<=3;i++){q.save();q.translate(80,116);q.rotate(i*.21);leaf(q,0,-42,11,50);q.restore();}
      cut(q,()=>{for(let i=-2;i<=2;i++){q.save();q.translate(80,116);q.rotate((i+.5)*.21);poly(q,[[-1,0],[-2,-72],[2,-70],[1,0]]);q.restore();}});
      poly(q,[[75,105],[85,105],[83,138],[78,145],[74,136]]);
      for(let j=0;j<3;j++){q.fillRect(27,122+j*8,28,5);q.fillRect(105,122+j*8,28,5);}cut(q,()=>q.fillRect(38,130,6,5));
    },
    murong(q) {
      path(q,[['M',97,14],['C',87,14,85,31,73,42],['C',51,55,37,60,40,80],['C',37,100,51,105,73,118],['C',85,129,87,146,97,146],['L',85,146],['C',72,145,75,132,60,124],['C',31,109,23,100,29,80],['C',23,60,31,51,60,36],['C',75,28,72,15,85,14],['Z']]);
      poly(q,[[91,19],[117,80],[91,141],[88,140],[113,80],[88,20]]);
      poly(q,[[8,80],[24,69],[24,77],[117,77],[117,83],[24,83],[24,91]]);
      poly(q,[[93,77],[98,70],[108,70],[105,77]]);poly(q,[[93,83],[98,90],[108,90],[105,83]]);
      q.fillRect(28,72,14,16);
    },
    hebei(q) {
      for(let i=0;i<3;i++){const x=65+i*34;path(q,[['M',x,13],['C',x+10,43,x-11,92,x-39,142],['L',x-48,121],['C',x-23,79,x-11,43,x,13],['Z']]);}
      rotate(q,-.61,()=>{
        const outline=[[80,13],[90,37],[87,99],[109,101],[103,111],[87,109],[86,138],[80,146],[74,138],[73,109],[57,111],[51,101],[73,99],[70,37]];
        cut(q,()=>{poly(q,outline);q.lineJoin='round';q.lineWidth=8;q.stroke();});
        poly(q,outline);cut(q,()=>poly(q,[[80,29],[82,42],[80,92],[78,42]]));
      });
    },
    beggars(q) {
      rotate(q,.43,()=>{q.fillRect(107,15,9,126);for(const y of [28,56,85,114])q.fillRect(103,y,17,5);});
      path(q,[['M',63,29],['L',82,29],['L',80,42],['C',103,54,100,72,88,81],['C',117,107,100,139,72,140],['C',37,139,28,107,55,81],['C',39,66,45,49,65,42],['Z']]);
      cut(q,()=>{path(q,[['M',49,102],['Q',40,128,67,131],['Q',49,124,49,102],['Z']]);q.fillRect(55,78,37,5);});q.fillRect(60,21,26,6);
    },
    heavenly_demon(q) {
      path(q,[['M',80,12],['C',77,47,115,48,111,80],['Q',129,69,128,47],['C',158,105,125,143,81,145],['C',31,145,7,104,32,69],['Q',30,91,48,94],['C',28,57,67,47,80,12],['Z']]);
      cut(q,()=>path(q,[['M',80,65],['C',88,87,108,96,101,115],['Q',95,132,80,135],['C',55,131,50,112,65,95],['Q',60,114,76,116],['C',86,107,68,93,80,65],['Z']]));
    },
    blood_cult(q) {
      path(q,[['M',80,13],['C',75,46,47,58,47,83],['C',47,126,113,126,113,83],['C',113,58,87,42,80,13],['Z']]);
      cut(q,()=>path(q,[['M',63,74],['C',55,92,67,104,83,104],['C',64,113,49,90,63,74],['Z']]));
      path(q,[['M',33,88],['C',2,116,34,144,80,146],['C',128,144,158,117,127,88],['C',144,122,111,131,80,132],['C',47,132,15,120,33,88],['Z']]);
    },
    green_forest(q) {
      q.save();q.translate(0,8);
      rotate(q,-.24,()=>{
        path(q,[['M',80,17],['Q',110,48,145,78],['Q',80,104,15,78],['Q',50,48,80,17],['Z']]);
        cut(q,()=>{
          path(q,[['M',30,76],['Q',80,90,130,76],['L',124,81],['Q',80,95,36,81],['Z']]);
          for(const s of [-1,1])path(q,[['M',80+s*5,30],['Q',80+s*16,53,80+s*37,72],['L',80+s*30,72],['Q',80+s*13,52,80+s*5,30],['Z']]);
        });
      });
      poly(q,[[55,98],[74,94],[77,97],[61,102]]);
      poly(q,[[74,94],[101,88],[102,94],[77,100]]);
      poly(q,[[126,84],[134,78],[136,70],[141,69],[139,83],[127,91]]);
      path(q,[['M',96,86],['Q',113,79,129,84],['L',127,105],['Q',113,125,98,106],['Z']]);
      cut(q,()=>path(q,[['M',103,93],['L',105,105],['Q',112,113,119,109],['Q',109,120,103,107],['Z']]));
      q.restore();
    },
    river_bandits(q) {
      q.fillRect(78,14,6,108);poly(q,[[87,16],[108,22],[87,29]]);
      path(q,[['M',72,25],['C',47,37,37,65,29,101],['Q',48,95,72,102],['Z']]);
      path(q,[['M',90,34],['C',111,45,124,69,134,99],['Q',111,92,90,102],['Z']]);
      cut(q,()=>{for(const y of [56,79]){path(q,[['M',37,y],['Q',54,y-7,73,y-1],['L',73,y+3],['Q',54,y-3,35,y+4],['Z']]);path(q,[['M',89,y-1],['Q',109,y-5,128,y+3],['L',130,y+7],['Q',109,y-1,89,y+3],['Z']]);}});
      path(q,[['M',15,110],['Q',80,120,145,110],['L',128,135],['Q',80,150,34,135],['Z']]);
      cut(q,()=>path(q,[['M',32,119],['Q',80,127,128,119],['L',124,123],['Q',80,132,36,123],['Z']]));
    },
    assassins(q) {
      path(q,[['M',122,29],['C',94,4,52,10,25,40],['C',-3,72,9,115,40,139],['C',67,158,105,151,125,128],['C',94,145,58,133,47,106],['C',30,67,54,29,89,26],['Q',108,24,122,29],['Z']]);
      poly(q,[[63,80],[97,69],[118,74],[118,86],[97,91]]);
      poly(q,[[117,61],[125,65],[123,75],[143,75],[149,80],[143,85],[123,85],[125,95],[117,99]]);
      cut(q,()=>poly(q,[[78,80],[111,78],[111,81]]));
    },
    hao(q) {
      path(q,[['M',80,13],['Q',97,15,97,30],['L',89,30],['Q',89,21,80,21],['Q',71,21,71,30],['L',63,30],['Q',63,15,80,13],['Z']]);q.fillRect(52,32,56,9);
      path(q,[['M',49,46],['Q',26,79,49,112],['L',111,112],['Q',134,79,111,46],['Z']]);
      cut(q,()=>path(q,[['M',46,79],['Q',80,43,114,79],['Q',80,114,46,79],['Z']]));disc(q,80,79,15);cut(q,()=>disc(q,84,74,5));q.fillRect(52,117,56,8);
      for(let i=-1;i<=1;i++)poly(q,[[76+i*13,129],[83+i*13,129],[82+i*13,145-Math.abs(i)*5],[77+i*13,149-Math.abs(i)*5]]);
    },
    haedong(q) {
      const slope=Math.atan(2/3);
      // Color masks select muted ink bands during the shared pixel pass.
      rotate(q,slope,()=>{
        q.fillStyle='#0000ff';disc(q,80,80,34);
        q.fillStyle='#ff0000';q.beginPath();q.arc(80,80,34,Math.PI,Math.PI*2);q.closePath();q.fill();disc(q,63,80,17);
        q.fillStyle='#0000ff';disc(q,97,80,17);
      });
      q.fillStyle='#000';
      // Upper left 건 ☰, upper right 감 ☵, lower left 리 ☲, lower right 곤 ☷.
      const angle=Math.PI/2-slope;
      for(const [x,y,rotation,broken] of [[32,47,-angle,[false,false,false]],[128,47,angle,[true,false,true]],[32,113,angle,[false,true,false]],[128,113,-angle,[true,true,true]]]){
        q.save();q.translate(x,y);q.rotate(rotation);
        for(let row=0;row<3;row++){const top=-11+row*9;if(broken[row]){q.fillRect(-17,top,14,5);q.fillRect(3,top,14,5);}else q.fillRect(-17,top,34,5);}
        q.restore();
      }
    },
    north_sea(q) {
      for(let i=0;i<6;i++)rotate(q,i*Math.PI/3,()=>{poly(q,[[80,12],[87,28],[84,73],[76,73],[73,28]]);poly(q,[[77,46],[59,29],[59,42],[77,61]]);poly(q,[[83,46],[101,29],[101,42],[83,61]]);});
      disc(q,80,80,16);cut(q,()=>poly(q,[[80,70],[90,80],[80,90],[70,80]]));
    }
  };
  function noise(x,y,seed=107) {const n=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return n-Math.floor(n);}
  function drawInk(entry,image=null) {
    const source=make(),q=source.getContext('2d');
    if(image){q.imageSmoothingEnabled=true;q.imageSmoothingQuality='high';q.drawImage(image,0,0,160,160);}
    else{q.fillStyle='#000';silhouettes[entry.id](q);}
    const pixels=q.getImageData(0,0,160,160), colors=entry.palette.map(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
    for(let at=0;at<pixels.data.length;at+=4) {
      // Binary edges keep the same hard native dots at every display size.
      if(pixels.data[at+3]<128){pixels.data[at+3]=0;continue;}
      const p=at/4,grain=noise(p%160,Math.floor(p/160)),tone=grain>.94?2:grain>.78?3:1;
      // Haedong's palette has three four-tone bands: ink, red, blue.
      const band=entry.id==='haedong'&&(pixels.data[at]||pixels.data[at+2])?(pixels.data[at]>=pixels.data[at+2]?4:8):0;
      pixels.data.set([...colors[band+tone],255],at);
    }
    q.putImageData(pixels,0,0);const result=make(320),ctx=result.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(source,0,0,320,320);return result;
  }
  async function hwasan() {
    const renderer=new window.CheonGameRenderer(make(),{appearanceProvider:()=>window.CheonAppearance?.resolve({})});
    try {
      if(!renderer.flatPlumRaster(140,-Math.PI/2))await new Promise((resolve,reject)=>{
        renderer.bloomAtlas.addEventListener('load',resolve,{once:true});renderer.bloomAtlas.addEventListener('error',()=>reject(new Error('화산 매화 원본을 불러올 수 없습니다.')),{once:true});
      });
      const stamp=renderer.flatPlumRaster(140,-Math.PI/2);if(!stamp)throw new Error('화산 매화 원본이 준비되지 않았습니다.');
      const source=stamp.canvas,hub=stamp.displayCenter,alpha=source.getContext('2d').getImageData(0,0,source.width,source.height).data;let reach=0;
      for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(alpha[(y*source.width+x)*4+3])reach=Math.max(reach,Math.abs(x+.5-hub.x),Math.abs(y+.5-hub.y));
      const half=Math.ceil(reach)+2,canvas=make(half*4),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
      ctx.drawImage(source,Math.round((half-hub.x)*2),Math.round((half-hub.y)*2),source.width*2,source.height*2);return canvas;
    } finally {renderer.destroy?.();}
  }
  async function southernTiger(entry) {
    const image=await new Promise((resolve,reject)=>{
      const asset=new Image();asset.onload=()=>resolve(asset);
      asset.onerror=()=>reject(new Error('남만 맹호 문양 원본을 불러올 수 없습니다.'));
      asset.src='assets/southern-tiger-source-v4.png';
    });
    return drawInk(entry,image);
  }
  function get(id){return manifest.find(item=>item.id===id);}
  async function raster(id){const entry=get(id);if(!entry)throw new Error(`알 수 없는 세력: ${id}`);if(!cache.has(id))cache.set(id,id==='hwasan'?hwasan():id==='southern_tribes'?southernTiger(entry):Promise.resolve(drawInk(entry)));return cache.get(id);}
  async function draw(canvas,id){const source=await raster(id);canvas.width=source.width;canvas.height=source.height;const q=canvas.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(source,0,0);if(canvas.dataset)canvas.dataset.emblem=id;return canvas;}
  window.CheonFactionEmblems=Object.freeze({manifest:Object.freeze(manifest),get,raster,draw});

  // Standalone gallery using the same renderer, without game state.
  if(document.querySelector?.('[data-emblem-gallery]')) {
    const root=document.querySelector('[data-emblem-gallery]'),dialog=document.querySelector('#emblem-preview'),preview=document.querySelector('#preview-canvas');
    let active='hwasan';
    for(const [group,label,subtitle] of [['righteous','정파','正派 · 아홉 문중의 기개'],['heterodox','사파','邪派 · 여섯 갈래의 그림자'],['outer','새외무림','塞外武林 · 경계 너머의 세 기치']]) {
      const section=document.createElement('section');section.className='emblem-section';section.innerHTML=`<header><h2>${label}</h2><p>${subtitle}</p></header><div class="emblem-grid"></div>`;root.append(section);
      for(const entry of manifest.filter(item=>item.group===group)) {
        const button=document.createElement('button');button.className='emblem-card';button.type='button';button.innerHTML=`<span class="emblem-index">${String(manifest.indexOf(entry)+1).padStart(2,'0')}</span><canvas aria-label="${entry.name} 문양"></canvas><strong>${entry.name}</strong><small>${entry.motif}</small>`;
        section.querySelector('.emblem-grid').append(button);draw(button.querySelector('canvas'),entry.id).catch(reportError);
        button.addEventListener('click',async()=>{active=entry.id;document.querySelector('#preview-name').textContent=entry.name;document.querySelector('#preview-motif').textContent=entry.motif;await draw(preview,active);dialog.showModal();});
      }
    }
    function reportError(error){document.querySelector('#gallery-status').textContent=error.message;}
    document.querySelector('#preview-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    document.querySelector('#download-emblem').addEventListener('click',()=>{const a=document.createElement('a');a.download=`cheon-${active}.png`;a.href=preview.toDataURL('image/png');a.click();});
    document.querySelector('#preview-paper').addEventListener('click',()=>{preview.classList.toggle('on-dark');});
  }
})();
