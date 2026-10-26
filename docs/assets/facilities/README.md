# 시설 화면 배경 (임시)

메인 허브 네 시설(연단방 · 대장간 · 연무장 · 폐관동) 전체 화면 뒤에 까는 그림. 2026-10-26, 이 PC에서 로컬로 생성.

- 도구: ComfyUI v0.42.1(Windows portable, NVIDIA)
- 모델: Stable Diffusion XL base 1.0 (`stabilityai/stable-diffusion-xl-base-1.0`, 라이선스 CreativeML OpenRAIL++-M — 상업 사용 가능, 금지된 용도만 제외)
- LoRA: pixel-art-xl (`nerijs/pixel-art-xl`, 라이선스 CreativeML OpenRAIL-M), 강도 1.0
- 설정: 1344×832, 30 steps, CFG 7, dpmpp_2m / karras. WebP(품질 88)로 변환.

| 파일 | 시드 | 장면 |
|---|---|---|
| `alchemy.webp` | 167514 | 무협 약방(약장 서랍 · 계산대 · 약단지) |
| `forge.webp` | 1000 | 돌 화로가 타오르는 대장간 |
| `hall.webp` | 1000 | 산문 아래 아침 수련장 |
| `seclusion.webp` | 16838 | 촛불과 물웅덩이가 있는 동굴 |

공통 프롬프트:

```
pixel art, 16-bit detailed pixel art game background, limited muted earthy palette, warm candle and fire light, ink charcoal shadows, aged wood brown, atmospheric lighting, wuxia, ancient china, no people, empty scene
```

부정 프롬프트:

```
people, person, character, face, text, letters, calligraphy, watermark, signature, logo, ui, frame, border, blank canvas, white rectangle, empty sign, purple, magenta, blurry, photo, 3d render, low quality, deformed
```

장면 프롬프트:

- alchemy: interior of an ancient chinese traditional medicine shop, a huge wooden apothecary cabinet covering the back wall made of hundreds of small square drawers with brass ring pulls, a long wooden counter in front with a brass hanging scale, ceramic pill jars, gourds and paper-wrapped medicine packets, dried herbs and ginseng roots hanging from the ceiling beam, calm warm lantern light, orderly and quiet
- forge: interior of an ancient chinese sword forge, massive stone furnace with roaring orange fire, leather bellows, iron anvil with a glowing red-hot sword blade and a hammer, sparks, wooden quenching tub with steam, soot dark brick walls, warm firelight on the left, dark brick wall on the right
- hall: outdoor martial arts training courtyard of a mountain sect at early morning, grey stone tiled ground, wooden wing chun training dummies, wooden weapon rack with spears and a staff, red pillar and curved tiled pavilion roof on the left, plum blossom branch, misty mountains in the distance, soft mist on the right
- seclusion: secluded meditation cave, rough dark rock walls and stalactites, single shaft of pale light from a crack in the ceiling onto a round straw meditation cushion on a flat stone, small candle, still shallow pool reflecting light, scroll and gourd on a rock ledge, deep shadow on the right

생성 스크립트: `C:\Users\admin\ComfyUI-work\generate-facilities.mjs`(로컬 ComfyUI API), 변환: `export.py`.
