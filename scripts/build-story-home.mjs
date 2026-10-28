import fs from "node:fs";
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
function escapeHtml(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function won(n){return Number(n).toLocaleString("ko-KR")+"원"}
function renderHome(plans){
 const e=escapeHtml,m=won,ids=["ntelecom-l-7gb","ntelecom-k-15gb-millie","ntelecom-k-100gb-millie"];
 const picked=ids.map(id=>plans.find(p=>p.id===id));if(picked.some(x=>!x))throw Error("Missing featured product data");
 const [low,mid,high]=picked;
 const data=[
 {p:low,type:"01 · 통신비가 부담될 때",story:"와이파이를 많이 쓰는데, 데이터는 매달 남는다면",detail:"집과 회사에서는 와이파이를 쓰고, 밖에서는 카카오톡과 지도·검색 정도를 이용한다면 먼저 비교해 볼 만합니다.",link:"plans/l-7gb/",action:"이 요금제가 맞는지 알아보기",tone:"low"},
 {p:mid,type:"02 · 적당한 데이터가 필요할 때",story:"7GB는 좀 부족하고, 큰 요금제는 부담된다면",detail:"밖에서도 데이터를 쓰지만 100GB까지 필요하지는 않을 때. 15GB와 소진 후 속도·제휴조건을 함께 확인하세요.",link:"data/15gb/",action:"15GB 요금제 비교하기",tone:"mid"},
 {p:high,type:"03 · 외부 데이터 사용이 많을 때",story:"영상도 자주 보고, 와이파이 없이 쓰는 날이 많다면",detail:"외부에서 영상·앱 업데이트처럼 데이터를 많이 쓴다면 100GB 상품과 소진 후 속도·테더링 조건을 살펴보세요.",link:"data/100gb/",action:"100GB 요금제 비교하기",tone:"high"}
 ];
 const card=d=>`<article class="story-card ${d.tone}">
 <div class="story-number">${d.type}</div>
 <div class="story-visual" aria-hidden="true"><span>${d.p.network==="K"?"KT망":"LG U+망"}</span><strong>${d.p.data_gb}<small>GB</small></strong><em>소진 후 최대 ${e(d.p.after_speed)}</em></div>
 <div class="story-info"><h3>${d.story}</h3><p>${d.detail}</p>
 <div class="product-meta"><span>${e(d.p.name.replace(/^앤텔레콤\s*/,""))}</span><strong>월 ${m(d.p.monthly_price)}</strong></div>
 <a class="story-link" href="${d.link}" data-cta="featured" data-plan="${e(d.p.id)}">${d.action}<span aria-hidden="true">→</span></a></div>
 </article>`;
 const faq=[
 ["알뜰폰으로 바꾸면 기존 번호가 없어지나요?","번호이동 조건을 충족하고 정상적으로 처리되면 기존 번호를 유지할 수 있습니다. 번호이동 전 기존 회선을 직접 해지하지 마세요."],
 ["휴대폰도 새로 사야 하나요?","현재 휴대폰을 계속 사용할 수 있는지는 단말의 통신망 지원 여부와 유심·eSIM 및 개통 경로별 지원 조건에 따라 다릅니다. 가입 전 호환 여부를 확인하세요."],
 ["데이터 무제한이라고 하면 속도도 무제한인가요?","기본 데이터 소진 후 최대 1·3·5Mbps 등으로 속도가 제한되는 상품이 있습니다. 요금제마다 테더링과 추가 이용 조건도 다를 수 있습니다."],
 ["홈에 나온 요금으로 지금 개통할 수 있나요?","상품가격은 2026년 9월 조사 자료입니다. 현재 판매 여부와 기본료, 프로모션, 번호이동·신규가입 가능 여부는 공식 판매 페이지에서 확인해야 합니다."]
 ];
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"알뜰폰요금제","url":"https://prepaid1215.github.io/test-post/","inLanguage":"ko-KR"},{"@type":"WebPage","name":"알뜰폰 요금제 비교 | 통신비·데이터·번호이동","url":"https://prepaid1215.github.io/test-post/","description":"통신비가 부담되거나 데이터가 부족할 때, 내 사용량에 맞는 알뜰폰 요금제를 찾아보세요. 7GB·15GB·100GB 상품과 가입 방법을 비교합니다.","inLanguage":"ko-KR"}]};
 return `<!doctype html><html lang="ko"><head>
 <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
 <title>알뜰폰 요금제 비교 | 통신비·데이터·번호이동</title>
 <meta name="description" content="통신비가 부담되거나 데이터가 부족할 때, 내 사용량에 맞는 알뜰폰 요금제를 찾아보세요. 7GB·15GB·100GB 상품과 가입 방법을 비교합니다.">
 <meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="https://prepaid1215.github.io/test-post/">
 <meta property="og:type" content="website"><meta property="og:locale" content="ko_KR">
 <meta property="og:title" content="알뜰폰 요금제 비교 | 통신비·데이터·번호이동">
 <meta property="og:description" content="쓰는 데이터와 통화량에 맞춰 알뜰폰 요금제를 선택해 보세요.">
 <meta property="og:url" content="https://prepaid1215.github.io/test-post/">
 <link rel="icon" href="assets/favicon.svg"><link rel="stylesheet" href="assets/home.css?v=20261028-story1">
 <script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head>
 <body><a class="skip-link" href="#main">본문 바로가기</a>
 <div class="top-line" aria-hidden="true"></div>
 <header class="site-header"><div class="container head-inner">
 <a class="brand" href="./">알뜰폰<span>요금제.</span></a>
 <nav aria-label="주 메뉴"><a href="#stories">추천 비교</a><a href="plans/">전체 요금제</a><a href="number-transfer/">번호이동</a><a href="benefits/">가입 혜택</a></nav>
 <a class="head-link" href="plans/">요금제 찾기 <span aria-hidden="true">→</span></a>
 </div></header>
 <main id="main">
 <section class="hero"><div class="container hero-layout">
 <div class="hero-copy">
 <p class="eyebrow">내 생활에 맞는 알뜰폰 요금제</p>
 <h1>휴대폰은 그대로.<br><em>통신비는 내 사용량에 맞게.</em></h1>
 <p class="hero-desc">집에서는 와이파이를 쓰고, 밖에서는 데이터를 얼마나 사용하시나요? 지금 쓰는 방식에 맞춰 요금제부터 비교해 보세요.</p>
 <div class="hero-actions">
  <a class="btn-primary" href="#situations" data-cta="hero-situation">내 상황에 맞는 요금제 찾기 <span aria-hidden="true">→</span></a>
  <a class="btn-secondary" href="plans/" data-cta="hero-all">전체 요금제 보기</a>
 </div>
 <div class="hero-trust"><span>KT망 · LG U+망</span><span>데이터·통화 비교</span><span>번호이동·신규가입 안내</span></div>
 </div>
 <div class="hero-offer"><div class="offer-top"><span>이런 분께 먼저 보여드릴 요금제</span><b>LG U+망</b></div>
 <p>매달 데이터가 남는다면?</p><div class="offer-gb">7<span>GB</span><small>기본 데이터</small></div>
 <div class="offer-spec"><span>일반통화 기본제공</span><span>소진 후 최대 1Mbps</span></div>
 <div class="offer-bottom"><div><small>월 기본료 · 조사 기준</small><strong>${m(low.monthly_price)}</strong></div><a href="plans/l-7gb/" data-cta="hero-product">상품 상세 보기 <span aria-hidden="true">↗</span></a></div>
 </div>
 </div></section>
 <section class="container situations section" id="situations" aria-labelledby="situations-heading">
  <div class="section-head"><p class="eyebrow">먼저 한 가지만 골라보세요</p><h2 id="situations-heading">지금 어떤 게 가장 고민인가요?</h2><p>복잡하게 고르지 않아도 됩니다. 필요한 것부터 보면 됩니다.</p></div>
  <div class="situation-grid">
   <a href="price/under-20000/" data-cta="situation" data-intent="save"><span class="situation-index">01</span><b>통신비가 부담돼요</b><small>월 2만원 미만 요금제부터 확인</small><span class="situ-arrow" aria-hidden="true">→</span></a>
   <a href="unlimited/" data-cta="situation" data-intent="data"><span class="situation-index">02</span><b>데이터가 자주 부족해요</b><small>대용량·속도제어형 비교</small><span class="situ-arrow" aria-hidden="true">→</span></a>
   <a href="number-transfer/" data-cta="situation" data-intent="port"><span class="situation-index">03</span><b>번호는 그대로 쓰고 싶어요</b><small>번호이동 조건과 준비사항</small><span class="situ-arrow" aria-hidden="true">→</span></a>
   <a href="benefits/" data-cta="situation" data-intent="benefits"><span class="situation-index">04</span><b>가입 혜택도 따져볼래요</b><small>제휴 조건·지급 방식 확인</small><span class="situ-arrow" aria-hidden="true">→</span></a>
  </div>
 </section>
 <section class="stories section" id="stories" aria-labelledby="stories-heading"><div class="container">
  <div class="section-head stories-head"><div><p class="eyebrow">사용하는 방식이 다르면 필요한 요금제도 달라집니다</p><h2 id="stories-heading">내 생활에 가까운 요금제부터</h2><p>무조건 비싸거나 싼 상품보다, 실제로 쓰는 만큼 맞추는 게 중요합니다.</p></div><a href="plans/" class="text-link">전체 47개 조사 상품 비교 <span aria-hidden="true">→</span></a></div>
  <div class="story-grid">${data.map(card).join("")}</div>
  <p class="price-footnote">* 위 상품은 앤텔레콤 2026년 9월 조사 자료 기준입니다. 현재 판매 여부와 월 기본료, 제휴혜택은 공식 안내에서 확인해야 합니다.</p>
 </div></section>
 <section class="savings section" id="compare-cost" aria-labelledby="savings-heading"><div class="container savings-layout">
  <div class="savings-text"><p class="eyebrow">통신비를 비교해 보는 가장 쉬운 방법</p><h2 id="savings-heading">현재 내 요금,<br>얼마나 차이가 날까요?</h2>
   <p>지금 내고 있는 월 통신요금을 입력해 보세요. 선택한 상품의 기본료와 얼마나 다른지 계산할 수 있습니다.</p>
   <p class="fineprint">요금 차이를 보여주는 계산기입니다. 할인·유심비·초과요금·가입 조건은 반영하지 않으며 실제 절감액을 보장하지 않습니다.</p>
  </div>
  <div class="calc-card">
   <label for="current-bill">현재 한 달 통신요금</label><div class="bill-entry"><input id="current-bill" type="number" inputmode="numeric" min="0" max="200000" step="1000" value="45000"><span>원</span></div>
   <label for="compare-plan">비교할 요금제</label><select id="compare-plan">
    ${data.map(d=>`<option value="${e(d.p.id)}" data-price="${d.p.monthly_price}">${e(d.p.name.replace(/^앤텔레콤\s*/,""))} · ${m(d.p.monthly_price)}</option>`).join("")}
   </select>
   <div class="difference"><span id="difference-label">월 기본료 차이</span><strong id="difference-value">27,100원</strong><small id="difference-year">12개월 단순 비교: 325,200원 차이</small></div>
   <a href="plans/l-7gb/" id="calculator-target" data-cta="calculator-product">비교한 요금제 살펴보기 <span aria-hidden="true">→</span></a>
  </div>
 </div></section>
 <section class="container process section" id="join-guide" aria-labelledby="process-heading"><div class="section-head"><p class="eyebrow">가입 전 꼭 알아야 할 것</p><h2 id="process-heading">요금제를 고른 다음에는?</h2><p>가입 방식과 휴대폰 사용 조건을 확인하면 됩니다.</p></div>
  <div class="process-grid">
   <article><span>01</span><h3>요금제 선택</h3><p>기본료·데이터·통화·소진 후 속도를 확인합니다.</p></article>
   <article><span>02</span><h3>가입 방식 확인</h3><p>기존 번호를 유지하면 번호이동, 별도 회선이면 신규가입을 검토합니다.</p></article>
   <article><span>03</span><h3>공식 신청 진행</h3><p>유심·휴대폰 호환 여부와 본인확인·가입 심사 조건을 확인합니다.</p></article>
  </div>
  <div class="process-links"><a href="number-transfer/">번호이동 안내 보기 <span aria-hidden="true">→</span></a><a href="sim-only/">휴대폰 그대로 가입하기 <span aria-hidden="true">→</span></a></div>
 </section>
 <section class="container faqs section" id="faq" aria-labelledby="faq-heading"><div class="section-head"><p class="eyebrow">가입 전 많이 궁금한 점</p><h2 id="faq-heading">이것만은 확인하세요</h2></div>
  <div class="faq-list">${faq.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</div>
 </section>
 <section class="container final-cta" aria-labelledby="final-cta-title"><div><p class="eyebrow">요금제가 정해졌다면</p><h2 id="final-cta-title">이제 가입 조건을 확인해 보세요.</h2><p>공식 신청 화면에서 판매가격과 가입 가능 여부를 확인할 수 있습니다.</p></div>
 <div class="final-actions"><a class="btn-primary" href="plans/" data-cta="final-plans">전체 요금제 비교하기 <span aria-hidden="true">→</span></a><a class="btn-secondary" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer" data-cta="final-chat">가입 조건 상담하기</a></div>
 </section>
 </main>
 <footer class="footer"><div class="container"><strong>알뜰폰<span>요금제.</span></strong><p>운영: 59만모바일 · 앤텔레콤 알뜰폰 요금제 비교 및 가입 안내</p><small>본 사이트의 가격은 2026년 9월 조사 기준입니다. 공식 신청 화면의 현재 가격·판매 조건을 우선 확인하세요.</small></div></footer>
 <nav class="mobile-cta" aria-label="빠른 메뉴"><a href="#situations">내게 맞는 요금제</a><a href="plans/">전체 요금제 보기 <span aria-hidden="true">→</span></a></nav>
 <script src="assets/home.js?v=20261028-story1" defer></script></body></html>`;
}
const html=renderHome(plans);
if((html.match(/<h1\b/g)||[]).length!==1)throw Error("Home must have one H1");
fs.writeFileSync("site/index.html",html,"utf8");
console.log("Story-based shopping homepage generated: 3 featured plans, 4 intent paths, savings calculator.");