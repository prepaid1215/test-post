# 후불 번호이동 설득 실험 A–D (2026-10-28)

목적: SKT·KT·LG U+ 약정 종료 또는 통신비 부담 고객을 앤텔레콤 후불 번호이동으로 전환하는 설득 구조 실험. 기존 선불폰 사업과 구분.

## 페이지
- A 약정 종료: /switch/contract-ended/
- B 통신비 비교: /switch/cost-comparison/
- C 번호 유지 안심: /switch/keep-number/
- D 손실회피: /switch/savings-opportunity/

기존 21개 검색 URL은 유지. 신규 URL 4개 추가, 총 sitemap 25개.
새 페이지는 site/switch/*/index.html 정적 HTML이고, 공통 디자인과 행동은 site/assets/switch-landings.css 및 .js에서 관리.
scripts/register-switch-landings.mjs은 배포 시 홈페이지 진입 링크 및 sitemap 항목 추가와 페이지 내부 경로 검사를 담당. .github/workflows/deploy.yml에서 기존 21개 페이지 검증을 마친 후 실행함.

## 설득 원칙
- 첫 화면: 상품 가격표 대신 소비자의 이동 시점·절약 차이·번호 유지 문제를 중심으로 접근.
- 가격 정보는 무조건 숨기지 않음. 구매 선택과 공식 가입 전 월 기본료, 제공량, 주요 조건 공개.
- D 예시: 100,000 - 17,900 = 82,100원/월, 연 985,200원. L망 7GB+가 적합한 경우의 단순 기본료 비교. 결합할인 손실, 단말 할부, 보험료·기타 비용 제외.
- 데이터를 많이 쓰는 고객에게 7GB 절약액을 그대로 약속하지 않고 상품 선택에 따라 계산 변경.
- 거짓 희소성/마감·무조건 최저가·가입승인 보장 주장 금지.
- K망 추가 데이터 프로모션/제휴 혜택은 대상 및 기간 확인 전 확정적 표현 금지.
- 상품 가격은 2026-09-28 저장소 스냅샷 및 2026-10월 공개 목록과 대조함. 실시간 동기화는 아님.

## 실제 전환
- 공식 신청 화면: https://www.n-telecom.co.kr/59man/view/main/main.aspx
- 상담: https://pf.kakao.com/_akxmKn/chat
- 현재 상품별 직결 딥링크는 검증되지 않아 공식 화면에서 다시 상품을 찾아야 할 수 있음.
- dataLayer: switch_landing_view / switch_cta_click / switch_plan_selected / switch_savings_calculated / switch_contract_selected / switch_check_progress.
- GA4/GTM 실수집 활성화 및 본사 개통 실적 연동은 별도. 클릭은 개통 완료가 아님.
- 성공 판단: 페이지별 유입→선택→공식 이동/상담→후불 번호이동 완료→59만모바일 판매 수익 인정.

## 다음 개선
약정 상태/현재 통신사별 문구 변형, 실제 가입 가능 조건, 상품별 신청 링크 확인, A/B 광고 소스별 유입 분석, 완료된 개통의 유입 귀속 순서로 검증.
