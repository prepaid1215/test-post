# 7단계: 후불 알뜰폰 개통 성과 측정 설계
기준 2026-10-28. 실제 추적 ID·CRM/본사 연동은 **아직 없음**. 따라서 이벤트 발생 가능 구조를 만들었을 뿐 GA4 집계가 된다는 주장은 하지 않는다.

## 퍼널 정의
1. **검색 노출**: Google Search Console / Naver 서치어드바이저의 query, URL, impressions, clicks, device, date.
2. **방문**: GA4 page_view + 랜딩 URL / referrer / UTM. 신규 가입자 개인정보는 전송하지 않는다.
3. **상품 탐색**: postpaid_finder_submit(budget_band, data_min_gb, network, call_mode, join_type, match_count).
4. **선택**: postpaid_finder_plan_click(plan_id).
5. **외부 이동**: postpaid_official_click(destination) 및 postpaid_chat_click(destination).
6. **실제 후불 개통**: 공식 판매 실적 / 승인 상태 / 가입 채널을 별도 수집한 뒤 캠페인·랜딩 URL과 **개인정보 없이** 대조해야 확인 가능. 외부 클릭만으로 개통 확정 불가.

## 웹 계측 준비
- assets/postpaid-finder.js는 데이터레이어에 이벤트를 push한다. 현재 GTM/GA4 태그가 없으므로 **관리 화면에 이벤트가 수집되지는 않는다**.
- 외부 신청까지 이어지는 공식 통신사 페이지에 클릭 ID를 임의로 붙이지 않는다. 운영자 동의·공식 추적 규격이 확인되면 반영한다.
- 개인정보·인증수단·전화번호·주소는 이 사이트에서 수집하거나 전송하지 않는다.
- 사이트맵과 검색 등록 정보는 등록 후 Search Console 실측으로 검증한다.

## 전환 효과 판정
- 방문 대비 후불 가입 CTA 클릭률: 공식/상담 링크 클릭 ÷ 랜딩 세션
- 요금제 탐색 참여율: finder_submit ÷ 랜딩 세션
- 후불 실제 개통률: 승인 개통 ÷ 식별 가능한 유입 (공식 연동이 있을 경우에만 산출)
- 주 1회 검색어별 노출 URL·CTR·CTA·실제 개통을 대조해 수정한다.
