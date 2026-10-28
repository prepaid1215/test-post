# 12개 소비자 전환 랜딩 운영 명세 (2026-10-28)

## 대상
SKT·KT·LG U+ 기존 휴대폰에서 앤텔레콤 후불로 번호이동하려는 고객과 배달·퀵·대리운전 업무용 회선을 **추가 신규가입**하려는 고객을 분리.

A–D는 이전에 제작 완료.
- A /switch/contract-ended/ — 약정 종료
- B /switch/cost-comparison/ — 현재 요금 vs 새로운 요금
- C /switch/keep-number/ — 번호·기기 유지 불안 해소
- D /switch/savings-opportunity/ — 1년간 통신비 차이에 대한 손실회피

이번에 추가된 페이지:
- E /switch/partner-card/ — 제휴카드 사용 실적과 연회비를 가정한 할인 계산. **앤텔레콤에 적용 가능한 카드 및 할인액은 아직 검증되지 않음.** 카드사에서 납부처·자동납부 혜택 확인 전 0원/할인 확정 광고 금지.
- F /switch/coupang-cash/ — 쿠팡·쿠팡이츠 실제 이용과 쿠팡캐시 월 5천원 별도 지급 조건
- G /switch/naverpay/ — 네이버페이 5,000P 별도 포인트쿠폰 조건
- H /switch/oliveyoung/ — 올리브영 월 5천원 모바일상품권 실제 사용 여부
- I /switch/cu/ — 쿠폰이 아닌 포켓CU 인증 후 결제액 20%, 월 최대 5천원 할인
- J /switch/delivery-rider/ — 배차 앱·지도 중심, 업무폰 추가 회선 신규가입
- K /switch/quick-service/ — 콜 접수·지도·알림 우선, 퀵서비스 업무폰 신규가입
- L /switch/designated-driver/ — 야간 호출 앱·업무 연락 분리, 대리운전 업무폰 신규가입

## 제품 근거
- data/plans-snapshot.json: 2026-09-28에 조사한 월 기본료·데이터·소진 후 속도
- data/benefits-snapshot.json: 2026-10-14에 확인한 제휴 혜택의 지급·이용 조건
- 공개 자료 보조 검증: https://buddymobile.co.kr/앤텔레콤-k망-요금제/ 및 https://dajjitelecom.com/faq/
- 쿠폰형은 사용일수 30일 및 31일차 유지 조건, 발행 후 30일 내 등록·사용. 모두 통신요금에서 차감되는 할인 아님.
- CU는 결제액 20%·월 최대 5천원. 월 대상 결제액 2만5천원에서 상한 도달하는 단순 계산이며 제외 상품, 동일 명의 인증, QR 조건 적용.
- 카드 할인은 독점 상품을 꾸며내지 않음. 임의의 전월 실적·통신요금 카드 할인을 확정치로 제시하지 않음.
- 업무 데이터 계산: 근무시간 × 하루 × 20~40MB/h + 월 2GB 여유 **계획용 임의 가정**. 직업별 공식 평균/실측이 아니며 영상 사용량 제외. 수치가 정확하다고 암시 금지. LTE/5G 신호품질이나 배차 앱 수신 안정성은 보장하지 않음.

## 전환
E-I: 기존 번호 유지 번호이동, J-L: 기존 개인 번호는 유지하고 추가 회선 신규가입.
기본료·통화·데이터 및 주된 혜택 조건은 공식 신청 화면 이전에 표시.
선택 요금제는 공식 사이트에 자동 전달되지 않으므로 사용자가 다시 찾도록 안내. 공식 신청 주소: https://www.n-telecom.co.kr/59man/view/main/main.aspx, 상담: https://pf.kakao.com/_akxmKn/chat

## 배포 및 구조
- 8개 정적 페이지: site/switch/{slug}/index.html
- 공통 디자인: site/assets/switch-landings.css + site/assets/segment-landings.css
- 계산·상품선택·이벤트: site/assets/segment-landings.js
- 배포 등록 스크립트: scripts/register-segment-landings.mjs
- 원래 21개 사이트맵 + A-D 네 개 + 신규 E-L 여덟 개 = 33 URL
- 홈페이지 A-D 섹션과 E-L 섹션 분리
- GA4 실제 태그/전환실적 연동은 여전히 없음. dataLayer 이벤트는 실적 확정이 아님.

## 다음 수정 시 우선순위
1. E-I 제휴 조건 공식 상품 상세와 다시 대조 및 품절/프로모션 갱신.
2. 카드 제휴 대상 납부처와 실제 할인 가능 카드 확인; 확인되지 않으면 계산 가정만 제공.
3. J-L 실제 라이더·기사 데이터 사용량 5~10건 수집해 가정 수정.
4. 공식 개통 단계의 상품별 연결 가능 여부 검증.
5. 유입 채널별 광고 → 랜딩 CTA → 승인·수익 실적 대조하여 소구점 교체.
