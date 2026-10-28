# test-post — 소비자 검색 의도 기반 후불 알뜰폰 실험

이 저장소의 GitHub Pages 배포는 **19개 고유 콘텐츠 페이지**를 빌드할 때 생성합니다.

- 핵심 콘텐츠: `data/consumer-spec-a.json` + `data/consumer-spec-b.json` (19개 검색 질문별 답변·가이드·FAQ)
- 상품 근거: `data/plans-snapshot.json` (후불 47개, 2026-09-28 조사)
- 제휴 근거: `data/benefits-snapshot.json` (6개, 2026-10-14 조사)
- 생성기: `scripts/build-consumer-pages.mjs`
- 스타일: `site/assets/consumer.css`
- 결과 주소: https://prepaid1215.github.io/test-post/

## 작업 흐름

1. 후불 알뜰폰을 검색하는 소비자의 질문별 핵심 답변을 작성합니다.
2. 상품 데이터에서 각 질문과 맞는 후보를 선별해 보여줍니다.
3. 고유 H1·title·description·self-canonical·FAQ/Breadcrumb 구조화 데이터와 sitemap을 만듭니다.
4. GitHub Actions가 `node scripts/build-consumer-pages.mjs`를 실행하여 `site/`를 다시 생성하고 GitHub Pages에 배포합니다.

**중요:** 기존에 커밋된 `site/**/index.html`은 이전 실험 버전이며, 실제 서비스 페이지는 **배포 과정에서 생성한 결과물**입니다. 새 원고는 JSON 스펙과 생성기를 수정해야 반영됩니다. 네이버의 실제 검색량·키워드별 순위·노출 URL 분포는 아직 검증되지 않았습니다. 가격·프로모션·후불 가입 자격은 신청 전 공식 확인이 필요합니다.

기존 500페이지 원본 사이트는 수정하지 않습니다. 검색 엔진별 이용자에 따라 다른 사이트로 강제 이동하는 코드는 포함하지 않았습니다.
