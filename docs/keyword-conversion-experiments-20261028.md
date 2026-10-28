# 검색키워드별 전환형 랜딩 실험 — 2026-10-28

## 검증할 가설
유입 수가 아니라 **키워드에 맞춘 설득 → 상품 선택 → 가입 안내 → 공식 신청 → 실제 개통 실적**의 흐름이 중요하다. 네 개 기존 검색 URL을 각각 설득 방식이 다른 랜딩으로 바꾸어 어떤 검색 의도와 외부 채널이 실제 가입 행동을 만드는지 비교한다.

| 랜딩 | 기존 URL | 검증할 구매 동기 | 첫 화면에서 제시하는 내용 |
|---|---|---|---|
| 가격 절약형 | /price/under-20000/ | 월 기본료 부담 | L망후불 7GB+ 17,900원, 사용자 월 요금 비교 |
| 번호이동형 | /number-transfer/ | 현재 전화번호 유지 | K망 15GB+(밀리의서재) 23,500원, 미납·최근 이동 이력·유심 확인 |
| 데이터형 | /unlimited/ | 데이터 부족 | 1Mbps/3Mbps/5Mbps 선택, 각 상품 정보와 통화 제공량 |
| 혜택형 | /benefits/naverpay/ | 포인트 부가혜택 | K망 7GB+(네이버페이) 21,100원, 5,000P 별도 지급 조건 |

상품과 요금은 로컬 2026-09 조사 자료 및 2026-10-14 혜택 자료 기반. **현재 판매 가능 또는 가입 승인 보장 아님**. 네이버페이 5,000P를 월 기본료에서 차감하지 않는다.

## 각 페이지의 설계
- 검색 의도에 대한 핵심 답과 대표 상품/요금/가입 버튼을 첫 화면에 둔다.
- 상품 선택은 기존 `data-action=choose-plan`으로 가입 안내 대화상자를 바로 연다. 이 대화상자는 가입 방식(신규가입·번호이동)을 고르게 하고 상품명 복사, 공식 목록, 카카오 상담을 제공한다.
- 이어서 구매 망설임 3가지에 직접 답하는 사례형 설명과 각 유형별 인터랙션을 배치한다.
- 나머지 비교 상품과 검색용 정보·FAQ는 아래에 보존한다.
- 외부에서 검색 URL로 유입하기에 새 URL이나 동일 문서의 별도 복사본을 만들지 않았다. canonical/sitemap 20개 유지.

## 외부 채널별 UTM 링크 예시
다음 링크를 SNS·블로그에 게재할 때 `utm_source`, `utm_medium`, `utm_campaign`을 구분해서 사용한다. `utm_source` 예: instagram, naver_blog, threads, community. 단축 URL을 사용하더라도 최종 UTM을 유지해야 한다.

- 가격형: https://prepaid1215.github.io/test-post/price/under-20000/?utm_source=instagram&utm_medium=social&utm_campaign=budget_first
- 번호이동형: https://prepaid1215.github.io/test-post/number-transfer/?utm_source=naver_blog&utm_medium=content&utm_campaign=port_first
- 데이터형: https://prepaid1215.github.io/test-post/unlimited/?utm_source=threads&utm_medium=social&utm_campaign=unlimited_first
- 혜택형: https://prepaid1215.github.io/test-post/benefits/naverpay/?utm_source=instagram&utm_medium=social&utm_campaign=benefit_first

## 페이지 이벤트 스키마
- `landing_view`: 페이지 노출(유입원·캠페인)
- `landing_cta_click`: 주요 상품 선택, 안내, 모바일/보조 CTA
- `landing_price_calculate`: 비용 차이 계산
- `landing_port_checklist`: 번호이동 조건 확인
- `landing_speed_choice`: 속도/상품 선택
- `landing_official_handoff`: 가입 안내 창에서 공식 페이지 링크 클릭
- `landing_chat_click`: 상담 클릭
- 기존 이벤트 `catalog_plan_selected`, `catalog_official_click`도 발생할 수 있음. **dataLayer에 이벤트를 넣는 것만으로 GA4 수집이나 개통 실적 귀속이 자동 활성화되는 것은 아니다.**

## 검증 및 한계
- 첫 단계: UTM별 랜딩 유입, 대표 상품 CTA 클릭, 공식 페이지 이동, 상담 클릭을 비교.
- 두 번째: 수기로라도 문의·신청·실제 개통 완료 건수 및 인정 수익을 캠페인·랜딩 URL별 기록.
- 공식 페이지의 상품별 딥링크는 확인되지 않아 **선택 상품 그대로 신청 완료되지는 않고 공식 목록에서 다시 찾아야 한다**. 대화상자에 이를 명시함.
- 전환율/승인율은 실제 데이터가 쌓이기 전에는 알 수 없다. 동일한 시점·유입원·수준의 조건을 최대한 맞춰 비교하고 유입의 질 차이를 고려해야 한다.
- 실측 전환을 확보하기 전에는 19개 전부 확대하지 않는다. 4개 실험 결과로 구조를 결정한다.
