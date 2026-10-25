# 천종지자 — 화산의 시련

브라우저에서 바로 하는 화산 전투 시제품. **[게임 열기](https://aboardfit.github.io/cheonjong/)**

WASD/방향키 이동, 자동 검격, Space 경공, Esc 일시정지, Tab 능력치. 휴대폰은 전장을 누른 채 끌어 이동한다.

## 갱신

`docs/`는 GitHub Pages(main 브랜치 `/docs`)가 그대로 서비스한다. 직접 고치지 말고 게임 저장소의 커밋에서 다시 내보낸다.

```bash
node publish.mjs <게임 저장소 경로>
git add -A
git commit -m "deploy: 게임 <커밋>"
git push
```

`publish.mjs`는 게임 저장소 HEAD의 `prototype/dist`만 복사하며(QA 비교 페이지·이미지 프롬프트 제외), 커밋하지 않은 작업은 올라가지 않는다. 푸시 후 1~2분 안에 반영된다.
