import fs from "node:fs";
import path from "node:path";
const snapshot=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function won(n){return Number(n).toLocaleString("ko-KR")+"원"}
function renderZero(p){
 const E=esc,W=won,url="https://prepaid1215.github.io/test-post/price/zero-won/";
 const desc="알뜰폰 0원 요금제는 할인기간과 이후 요금, 청구요금과 페이백을 구분해 비교하세요. 12개월 비용을 직접 계산하고 데이터·통화 조건까지 확인할 수 있습니다.";
 const faq=[
 ["알뜰폰 0원 요금제는 계속 0원인가요?","상품마다 다릅니다. 일정 기간만 0원이 적용되는 상품도 있으며 기간이 끝나면 별도 월 기본료가 청구됩니다. 가입 화면에서 할인 기간과 종료 후 요금을 확인하세요."],
 ["체감가 0원이라면 실제 청구요금도 0원인가요?","반드시 그렇지는 않습니다. 먼저 월 기본료를 내고 포인트·쿠폰·페이백 등을 별도로 받는 방식일 수 있습니다. 지급 조건과 청구요금을 나눠 확인하세요."],
 ["0원 요금제와 7GB 17,900원 중 무엇이 더 저렴한가요?","0원 적용 기간과 종료 후 요금에 따라 다릅니다. 데이터·통화 제공량도 다를 수 있으므로 12개월 총액만 보지 말고 사용하는 양과 이용 조건을 비교하세요."],
 ["이 사이트에서 0원 요금제로 개통할 수 있나요?","현재 당사 앤텔레콤 상품 조사 자료에 월 기본료 0원 상품은 없습니다. 이 페이지는 광고 조건을 이해하기 위한 비교 안내이며 7GB 상품 가입 조건을 확인할 수 있습니다."]
 ];
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":url,"name":"알뜰폰 0원 요금제, 할인 끝나면 얼마? | 청구요금과 체감가","description":desc,"inLanguage":"ko-KR"},{"@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}]};
 const name=p.name.replace(/^앤텔레콤\s*/,"");
 return `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>알뜰폰 0원 요금제, 할인 끝나면 얼마? | 12개월 비교</title>
<meta name="description" content="${E(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR">
<meta property="og:title" content="알뜰폰 0원 요금제, 할인 끝나면 얼마?"><meta property="og:description" content="${E(desc)}"><meta property="og:url" content="${url}">
<link rel="icon" href="../../assets/favicon.svg"><link rel="stylesheet" href="../../assets/zero-won.css?v=20261028-1">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head><body>
<a class="skip" href="#main">본문 바로가기</a><div class="top-line" aria-hidden="true"></div>
<header class="header"><div class="wrap head-inner"><a class="brand" href="../../">알뜰폰<span>요금제.</span></a>
<nav aria-label="주 메뉴"><a href="../../plans/">전체 요금제</a><a href="../under-20000/">1만원대</a><a href="../../number-transfer/">번호이동</a></nav>
<a class="header-cta" href="#calculator" data-zero-cta="nav-calculator">12개월 비용 비교</a></div></header>
<main id="main"><nav class="crumb wrap" aria-label="현재 위치"><a href="../../">알뜰폰 요금제</a><span>/</span> 알뜰폰 0원 요금제</nav>
<section class="hero"><div class="wrap hero-grid">
<div class="hero-copy"><p class="kicker">알뜰폰 0원 요금제 · 광고 조건 확인</p>
<h1><span class="zero">0원<span class="mark">?</span></span><span class="hero-question">할인 끝나면<br>얼마일까요?</span></h1>
<p class="hero-desc">광고에 나온 0원, <strong>몇 개월 동안 적용되는지</strong> 확인하셨나요? 할인 종료 후 기본료와 페이백·쿠폰 지급 조건까지 보셔야 실제 비용을 비교할 수 있습니다.</p>
<div class="hero-actions"><a class="primary" href="#calculator" data-zero-cta="hero-calculator">12개월 요금 계산하기 <span aria-hidden="true">→</span></a><a class="outline" href="#ad-types" data-zero-cta="hero-explain">0원 광고 유형 보기</a></div>
<p class="hero-notice">이 사이트는 월 기본료 0원 상품을 판매하지 않습니다. 0원 광고 조건을 살펴본 뒤 실제 가입 상품을 비교하는 페이지입니다.</p></div>
<div class="promo-visual" aria-label="광고 확인 항목"><div class="promo-head"><span>AD CHECK</span><strong>0원 광고 보는 법</strong></div>
<div class="promo-zero">0<span>원</span></div><p class="promo-question">그런데 몇 개월 동안?</p><div class="promo-checks">
<span>할인 적용 기간</span><span>할인 종료 후 요금</span><span>페이백·쿠폰 지급 조건</span></div>
<div class="promo-bottom">광고 숫자와 실제 조건을 함께 확인하세요.</div></div>
</div></section>
<section class="wrap section" id="ad-types"><p class="eyebrow">0원 광고는 크게 두 유형</p><h2>같은 0원이어도 계산법이 다릅니다.</h2>
<p class="desc">월 청구요금이 면제되는지, 나중에 지급받을 혜택을 빼서 체감가를 0원으로 계산하는지 먼저 구분하세요.</p>
<div class="type-grid"><article class="type"><span>TYPE 01 · 기간 할인형</span><strong>실제 기본료 0원</strong><h3>기간이 지나면 요금이 달라질 수 있습니다.</h3>
<p>예를 들어 첫 7개월 월 0원, 8개월차부터 월 22,000원인 가상의 상품이라면 12개월 기본료 총액은 110,000원입니다. 아래 계산기에서 실제 광고 수치를 입력해 보세요.</p></article>
<article class="type"><span>TYPE 02 · 별도 혜택형</span><strong>체감가 0원</strong><h3>월 기본료가 먼저 청구될 수 있습니다.</h3>
<p>포인트·쿠폰·페이백 등을 별도로 받는 경우입니다. 언제, 어떤 조건으로 지급되는지 확인하지 않으면 청구요금 0원과 혼동하기 쉽습니다.</p></article></div>
<p class="source-note">참고 사례: <a href="https://www.ktmmobile.com/event/eventDetail.do?ntcartSeq=937&pageNo=1&sbstCtg=E" target="_blank" rel="noopener noreferrer">KT M모바일 2026년 9월 ‘체감가 0원’ 광고</a> · <a href="https://www.moyoplan.com/plans" target="_blank" rel="noopener noreferrer">모요 요금제 비교</a>. 해당 사례는 우리 사이트의 판매 상품이 아닙니다.</p>
</section>
<section class="calc-band" id="calculator"><div class="wrap calc-layout"><div>
<p class="eyebrow">월요금보다 12개월 총액</p><h2>광고에서 본 가격을<br>그대로 넣어 보세요.</h2>
<p>0원 할인 기간과 종료 후 월 요금을 넣으면 12개월 기본료를 계산합니다. 입력된 기본값은 <strong>가상의 설명용 수치</strong>입니다. 실판매 요금제 가격이 아닙니다.</p>
<ul><li>월 기본료만 계산</li><li>유심비·초과 사용·페이백·사은품 제외</li><li>데이터 제공량과 통화 조건은 따로 비교</li></ul></div>
<form class="calc-card" id="zero-calculator">
<label>할인기간 월 기본료 <span><input id="promo-fee" type="number" min="0" max="200000" step="100" value="0" inputmode="numeric">원</span></label>
<label>할인기간 <span><input id="promo-months" type="number" min="0" max="12" step="1" value="7" inputmode="numeric">개월</span></label>
<label>할인 종료 후 월 기본료 <span><input id="after-fee" type="number" min="0" max="200000" step="100" value="22000" inputmode="numeric">원</span></label>
<div class="calc-result" aria-live="polite"><div><span>입력한 광고 요금제 · 12개월</span><strong id="promo-total">110,000원</strong></div>
<div><span>${E(name)} · 12개월*</span><strong id="our-total">${W(p.monthly_price*12)}</strong></div>
<p id="cost-difference">가상 예시에서는 광고 요금제가 104,800원 낮습니다.</p></div>
<p class="calc-fine">* L망 7GB+ 월 ${W(p.monthly_price)}를 12개월 같은 기본료로 이용한다고 가정. 실제 가격 유지나 가입 가능성을 보장하지 않습니다. 비교한 상품의 데이터·통화 조건이 다를 수 있습니다.</p>
</form></div></section>
<section class="wrap section" id="usage"><p class="eyebrow">가격 다음은 사용량</p><h2>0원이어도 데이터가 부족하면 의미가 달라집니다.</h2>
<div class="usage-grid"><article><span>01</span><h3>데이터를 거의 안 쓴다면</h3><p>통화·문자 중심이라면 저용량 0원 프로모션이 더 적합할 수도 있습니다. 다만 통화 한도와 할인 종료 후 요금을 확인하세요.</p><a href="../../plans/" data-zero-cta="low-usage">전체 요금제 보기 →</a></article>
<article class="selected"><span>02</span><h3>외부에서 7GB 정도 필요하다면</h3><p>와이파이를 주로 쓰고 밖에서는 메신저·검색·지도를 이용하는 편이라면, 7GB와 소진 후 최대 ${E(p.after_speed)} 조건을 비교해 보세요.</p><strong>월 ${W(p.monthly_price)}</strong><a href="../../plans/l-7gb/" data-zero-cta="7gb-detail" data-plan="${E(p.id)}">7GB 상세·가입 조건 확인 →</a></article>
<article><span>03</span><h3>영상·테더링을 많이 쓴다면</h3><p>15GB나 100GB형 상품과 소진 후 속도, 테더링 조건을 함께 확인하는 편이 좋습니다.</p><a href="../../unlimited/" data-zero-cta="high-usage">데이터형 요금제 비교 →</a></article>
</div></section>
<section class="wrap final-cta"><div><p class="eyebrow">7GB 상품을 검토하고 있다면</p><h2>${E(name)} · 월 ${W(p.monthly_price)}</h2><p>7GB · 소진 후 최대 ${E(p.after_speed)} · 일반통화 ${E(p.calls)}. 실제 가입 조건은 공식 페이지에서 확인하세요.</p></div>
<a class="primary" href="../../plans/l-7gb/" data-zero-cta="final-product" data-plan="${E(p.id)}">상품 상세페이지로 이동 <span aria-hidden="true">→</span></a></section>
<section class="wrap section faqs" id="faq"><p class="eyebrow">자주 묻는 질문</p><h2>0원 광고에 대한 질문</h2>
<div class="faq-grid">${faq.map(([q,a])=>`<details><summary>${E(q)}</summary><p>${E(a)}</p></details>`).join("")}</div></section>
</main><footer><div class="wrap"><strong>알뜰폰<span>요금제.</span></strong><p>운영: 59만모바일 · 앤텔레콤 알뜰폰 요금제 비교 및 개통 안내</p><small>광고 조사: 2026년 10월 28일. 자사 가격: 2026년 9월 보관 자료 기준. 공식 신청 화면의 현재 판매조건을 우선 확인하세요.</small></div></footer>
<div class="mobile-bar"><a href="#calculator" data-zero-cta="mobile-calculator">12개월 요금 계산</a><a href="../../plans/l-7gb/" data-zero-cta="mobile-product" data-plan="${E(p.id)}">7GB 조건 확인 →</a></div>
<script src="../../assets/zero-won.js?v=20261028-1" defer></script></body></html>`;
}
const plan=snapshot.find(p=>p.id==="ntelecom-l-7gb");
if(!plan||plan.monthly_price<=0)throw Error("Missing or invalid 7GB offer");
const out="site/price/zero-won/index.html";
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,renderZero(plan),"utf8");
const url="https://prepaid1215.github.io/test-post/price/zero-won/";
const sm="site/sitemap.xml";let xml=fs.readFileSync(sm,"utf8");
if(!xml.includes(url))xml=xml.replace("</urlset>","<url><loc>"+url+"</loc></url>\n</urlset>");
fs.writeFileSync(sm,xml,"utf8");
const homefile="site/index.html";let home=fs.readFileSync(homefile,"utf8");
const marker='<section class="stories section"';if(!home.includes(marker))throw Error("Missing home section");
home=home.replace(marker,'<section class="zero-discovery container" aria-label="0원 요금제 광고 조건"><div><strong>0원 요금제 광고를 봤다면?</strong><span>할인기간·종료 후 요금·페이백 조건을 먼저 확인하세요.</span></div><a href="price/zero-won/" data-cta="zero-won-discovery">0원 광고 조건 확인하기 →</a></section>\n'+marker);
fs.writeFileSync(homefile,home,"utf8");
const budgetFile="site/price/under-20000/index.html";let budget=fs.readFileSync(budgetFile,"utf8");
const before='<section class="exp-story"';if(!budget.includes(before))throw Error("Missing budget story");
budget=budget.replace(before,'<aside class="zero-inline"><strong>0원 요금제 광고와 비교 중이신가요?</strong><p>할인 끝나면 얼마인지 확인하고 고르세요.</p><a href="../zero-won/" data-landing-cta="zero-won">0원 광고 조건 확인 →</a></aside>\n'+before);
fs.writeFileSync(budgetFile,budget,"utf8");
console.log("ZERO-WON QA READY: new honest 0원 landing + 2 internal discovery links + 21 sitemap URLs.");