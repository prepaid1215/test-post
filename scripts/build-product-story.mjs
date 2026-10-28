import fs from "node:fs";
import path from "node:path";
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
function esc(x){return String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function money(x){return Number(x).toLocaleString("ko-KR")+"원"}
function render(p, alternatives){
 const E=esc,M=money,canonical="https://prepaid1215.github.io/test-post/plans/l-7gb/",official="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx",consult="https://pf.kakao.com/_akxmKn/chat";
 const other=alternatives.map(a=>`<article class="other-plan">
    <span class="other-network">${a.network==="K"?"KT망":"LG U+망"}</span>
    <h3>${E(a.name.replace(/^앤텔레콤\s*/,""))}</h3>
    <strong>${M(a.monthly_price)} <small>/ 월</small></strong>
    <p>기본 데이터 ${a.data_gb}GB · 소진 후 최대 ${E(a.after_speed)}</p>
    <a href="${a.data_gb===10?"../../data/10gb/":"../../data/15gb/"}">조건 비교하기 →</a>
  </article>`).join("");
 const faq=[
 ["7GB를 다 쓰면 인터넷이 끊기나요?","기본 데이터 7GB를 사용한 뒤에는 최대 1Mbps 속도제어 조건으로 이어집니다. 실제 체감 속도는 장소와 사용 환경에 따라 달라집니다."],
 ["통화가 많아도 이용할 수 있나요?","일반통화와 문자는 기본제공으로 안내되어 있습니다. 부가·영상통화는 300분이며, 요금제 약관의 제공조건과 이용 제한을 확인해야 합니다."],
 ["기존 번호를 유지하면서 가입할 수 있나요?","번호이동으로 신청할 수 있는지 공식 화면에서 확인해야 합니다. 기존 회선을 먼저 해지하지 마세요. 미납·정지 등 상태에 따라 번호이동이 제한될 수 있습니다."],
 ["사용 중인 휴대폰을 그대로 사용할 수 있나요?","단말의 LG U+망 지원과 유심 호환 여부, 개통 경로별 지원 여부를 확인해야 합니다. 유심이나 eSIM 사용 가능 여부는 실제 신청 화면에서 확인하세요."]
 ];
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebPage","name":"L망 7GB+ 알뜰폰 요금제 상세 | 월 17,900원 · 7GB · 1Mbps","description":"데이터가 늘 남는 사용자를 위한 L망 7GB+ 구매상세페이지. 월 기본료 17,900원, 데이터 7GB, 소진 후 최대 1Mbps, 통화 조건과 가입 방법을 확인하세요.","url":canonical,"inLanguage":"ko-KR"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"알뜰폰 요금제","item":"https://prepaid1215.github.io/test-post/"},{"@type":"ListItem","position":2,"name":"L망 7GB+ 상세","item":canonical}]}]};
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
 <title>L망 7GB+ 알뜰폰 요금제 상세 | 월 ${M(p.monthly_price)} · 7GB · 1Mbps</title>
 <meta name="description" content="데이터가 늘 남는 사용자를 위한 L망 7GB+ 요금제 상세 안내. 월 ${M(p.monthly_price)}, 7GB·소진 후 최대 1Mbps, 통화·문자 조건과 가입 방법을 확인하세요.">
 <meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}">
 <meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="L망 7GB+ 알뜰폰 요금제 · ${M(p.monthly_price)}">
 <meta property="og:description" content="매달 데이터가 남는다면? 7GB·1Mbps·통화 조건을 비교하고 가입 방법까지 확인하세요."><meta property="og:url" content="${canonical}">
 <link rel="icon" href="../../assets/favicon.svg"><link rel="stylesheet" href="../../assets/product-story.css?v=20261028-1">
 <script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head><body>
 <a class="skip" href="#main">본문으로 이동</a>
 <div class="brand-line" aria-hidden="true"></div>
 <header class="header"><div class="container header-main"><a class="logo" href="../../">알뜰폰<span>요금제.</span></a>
  <nav aria-label="주 메뉴"><a href="../../">전체 요금제</a><a href="../../price/under-20000/">1만원대 요금제</a><a href="../../number-transfer/">번호이동 안내</a></nav>
  <a class="header-action" href="#purchase">가입 방법 확인</a></div></header>
 <main id="main"><div class="container">
  <nav class="breadcrumb" aria-label="현재 위치"><a href="../../">전체 요금제</a><span>›</span><a href="../../data/7gb/">7GB 요금제</a><span>›</span><span>L망 7GB+</span></nav>
  <section class="product-top" aria-labelledby="product-heading">
   <div class="product-visual">
    <div class="visual-top"><span>LG U+망 · 앤텔레콤</span><span>LTE</span></div>
    <div class="visual-center"><span>기본 데이터</span><strong>7<span>GB</span></strong><p>데이터 소진 후에도<br>최대 1Mbps로 이용</p></div>
    <div class="visual-bottom"><span>통화 기본제공</span><span>문자 기본제공</span></div>
   </div>
   <div class="product-purchase"><p class="product-kind">알뜰폰 요금제 상세</p>
    <h1 id="product-heading">L망 7GB+<small>데이터가 남는 사람을 위한 통신비 선택</small></h1>
    <p class="purchase-desc">집이나 회사에서 와이파이를 자주 쓰고, 밖에서는 통화·메신저·지도 정도를 이용한다면 살펴볼 만한 요금제입니다.</p>
    <div class="plan-price"><span>월 기본료 · 부가세 포함</span><strong>${M(p.monthly_price)}</strong><small>2026년 9월 조사 기준</small></div>
    <div class="spec-list"><div><span>데이터</span><b>7GB</b></div><div><span>소진 후 속도</span><b>최대 1Mbps</b></div><div><span>일반통화</span><b>기본제공</b></div><div><span>문자</span><b>기본제공</b></div><div><span>부가·영상통화</span><b>300분</b></div></div>
    <a class="main-cta" href="#purchase">이 요금제로 가입 준비하기 <span>→</span></a>
    <a class="text-cta" href="#story">이 요금제가 잘 맞는 이유 읽어보기 ↓</a>
    <p class="small-note">현재 판매 조건과 가입 자격은 공식 신청 화면이 우선합니다.</p>
   </div>
  </section>
 </div>
 <div class="story-opening" id="story"><div class="container narrow">
  <p class="eyebrow">선택의 시작</p>
  <h2>데이터는 매달 남는데,<br><em>통신비는 왜 그대로일까요?</em></h2>
  <p>아침에는 집 와이파이로 뉴스를 읽고, 이동 중에는 지도를 켭니다. 점심에는 메신저를 확인하고, 저녁에는 다시 와이파이에 연결합니다. 이렇게 쓰는데도 매달 데이터가 많이 남는다면, 지금보다 큰 데이터 요금제가 꼭 필요한 것은 아닐 수 있습니다.</p>
  <p>통신비를 줄이려고 통화나 문자를 포기할 필요도 없습니다. <strong>L망 7GB+는 기본 데이터 7GB에 일반통화와 문자를 기본제공</strong>하는 구성입니다. 기본 데이터를 다 쓴 뒤에도 최대 1Mbps로 이어서 이용할 수 있습니다.</p>
  <p class="story-caveat">이 이야기는 특정 고객의 후기나 실제 개통 사례가 아니라, 요금제 선택을 돕기 위한 생활 사용 예시입니다.</p>
 </div></div>
 <section class="container section routine" aria-labelledby="routine-title">
  <div class="section-heading"><p class="eyebrow">하루 사용 장면으로 보기</p><h2 id="routine-title">평소 쓰는 데이터, 어디에서 필요할까요?</h2><p>다음 장면이 내 생활과 비슷하다면 7GB를 비교할 이유가 있습니다.</p></div>
  <div class="routine-grid">
   <article><span class="routine-number">01</span><h3>출퇴근길</h3><p>카카오톡으로 연락하고 지도와 버스 도착 정보를 확인합니다. 짧은 검색 중심이라면 대용량 고속 데이터가 항상 필요한 것은 아닙니다.</p></article>
   <article><span class="routine-number">02</span><h3>근무 시간</h3><p>직장 와이파이를 이용하면서 전화와 문자를 자주 씁니다. 일반통화 기본제공 여부가 데이터 용량만큼 중요한 선택 기준입니다.</p></article>
   <article><span class="routine-number">03</span><h3>집에서 쉬는 저녁</h3><p>동영상이나 앱 업데이트는 와이파이로 이용하고, 외부 모바일 데이터는 필요한 때만 사용합니다.</p></article>
  </div>
 </section>
 <section class="savings"><div class="container savings-grid">
  <div><p class="eyebrow">매달 지출을 다시 생각해 보기</p><h2>지금 쓰는 요금과<br>비교하면 차이가 보입니다.</h2>
   <p>현재 통신요금이 얼마인지 직접 입력해 보세요. 월 기본료 ${M(p.monthly_price)}와의 단순 차액을 계산합니다.</p>
   <p class="small-note">계산은 현재 입력한 요금과 조사 기본료가 12개월 동안 같다는 가정입니다. 가입비·유심비·초과요금·혜택 변경은 포함하지 않습니다.</p></div>
  <div class="savings-calc"><label for="current-fee">현재 한 달 통신요금</label><div class="fee-input"><input id="current-fee" type="number" inputmode="numeric" min="0" max="200000" step="1000" value="45000"><span>원</span></div>
   <div class="calc-line"><span>L망 7GB+ 월 기본료</span><strong>${M(p.monthly_price)}</strong></div>
   <div class="calc-result"><span id="savings-label">월 요금 차이</span><strong id="monthly-difference">27,100원</strong><small id="yearly-difference">12개월 기준 325,200원 차이</small></div>
   <p class="calc-note">기본료만 비교한 예시이며 실제 절감액을 보장하지 않습니다.</p></div>
 </div></section>
 <section class="container section choice"><div class="section-heading"><p class="eyebrow">잘 맞는 경우와 아쉬운 경우</p><h2>이런 분에게는 추천 후보, 이런 분은 다른 요금제를 보세요.</h2></div>
  <div class="choice-grid"><article class="good"><h3>7GB+를 먼저 비교해 볼 만한 경우</h3><ul><li>집·회사 와이파이를 자주 이용하는 분</li><li>외부에서는 메신저·지도·간단한 검색을 주로 하는 분</li><li>일반통화·문자는 필요하지만 고속 데이터가 매번 남는 분</li><li>제휴 쿠폰보다 월 기본료가 중요한 분</li></ul></article>
  <article class="not-for"><h3>7GB가 부족할 수 있는 경우</h3><ul><li>와이파이 없이 외부에서 동영상을 자주 보는 분</li><li>노트북 핫스팟·대용량 다운로드를 많이 하는 분</li><li>데이터 소진 후 최대 1Mbps보다 빠른 속도가 필요한 분</li><li>매달 7GB를 크게 초과하는 분</li></ul></article></div>
 </section>
 <section class="container section compare"><div class="section-heading"><p class="eyebrow">다른 요금제와 비교</p><h2>조금 더 데이터가 필요하다면?</h2><p>가격뿐 아니라 통신망과 소진 후 속도도 함께 확인하세요.</p></div>
  <div class="compare-grid"><article class="other-plan selected"><span class="other-network">LG U+망</span><h3>L망 7GB+</h3><strong>${M(p.monthly_price)} <small>/ 월</small></strong><p>7GB · 최대 1Mbps</p><span class="current-plan">현재 보는 상품</span></article>${other}</div>
 </section>
 <section class="container section join" id="purchase"><div class="join-grid"><div class="join-explain"><p class="eyebrow">가입하기 전 마지막 확인</p><h2>이 요금제로 사용해 보고 싶다면</h2><p>현재 번호를 유지할지, 별도의 회선을 만들지 먼저 선택하세요. 아래 안내는 가입 자격을 판정하지 않으며, 실제 신청·심사는 공식 화면에서 진행됩니다.</p>
  <div class="join-steps"><div><b>01</b><span>요금제명 확인</span></div><div><b>02</b><span>번호이동 또는 신규가입 선택</span></div><div><b>03</b><span>공식 화면에서 가입 조건 확인</span></div></div>
 </div><div class="join-card">
 <strong class="join-title">L망 7GB+ <span>${M(p.monthly_price)} / 월</span></strong>
 <fieldset><legend>가입 방식 선택</legend><div class="join-methods"><label><input type="radio" name="join-method" value="port" checked><span>번호이동<small>기존 번호 유지</small></span></label><label><input type="radio" name="join-method" value="new"><span>신규가입<small>별도 회선 개설</small></span></label></div></fieldset>
 <p class="join-method-note" id="join-method-note">번호를 유지하려면 기존 회선을 먼저 해지하지 마세요. 번호이동 가능 여부는 공식 화면에서 확인합니다.</p>
 <label class="copy-label" for="plan-to-copy">공식 화면에서 찾을 상품명</label>
 <div class="copy-row"><input id="plan-to-copy" type="text" readonly value="${E(p.name)}"><button type="button" id="copy-name">복사</button></div>
 <p id="copy-result" class="copy-result" role="status"></p>
 <a href="${official}" class="main-cta" data-action="story-official" target="_blank" rel="noopener noreferrer">공식 요금제 확인하기 <span>↗</span></a>
 <a href="${consult}" class="help-cta" data-action="story-chat" target="_blank" rel="noopener noreferrer">가입 조건 상담하기</a>
 <p class="join-footnote">현재 개별 상품의 공식 직접 신청 주소는 확인되지 않았습니다. 공식 목록에서 동일 상품명을 찾아 가입 조건을 확인해 주세요.</p>
 </div></div></section>
 <section class="container section faq"><div class="section-heading"><p class="eyebrow">가입 전 질문</p><h2>L망 7GB+ 자주 묻는 질문</h2></div>
 ${faq.map(([q,a])=>`<details><summary>${E(q)}</summary><p>${E(a)}</p></details>`).join("")}
 </section>
 </main><footer><div class="container footer-inner"><strong>알뜰폰요금제.</strong><span>운영: 59만모바일 · 앤텔레콤 알뜰폰 요금제 안내</span><small>가격: 2026년 9월 조사 자료. 실제 판매·개통 조건은 공식 안내를 따릅니다.</small></div></footer>
 <div class="mobile-sticky"><div><small>L망 7GB+</small><strong>월 ${M(p.monthly_price)}</strong></div><a href="#purchase">가입 방법 확인 →</a></div>
 <script src="../../assets/product-story.js?v=20261028-1" defer></script></body></html>`;
}
const plan=plans.find(p=>p.id==="ntelecom-l-7gb");
const alt=["ntelecom-k-10gb-millie","ntelecom-k-15gb-millie"].map(id=>plans.find(x=>x.id===id));
if(!plan||alt.some(x=>!x))throw Error("Plan missing in current data snapshot");
const output="site/plans/l-7gb/index.html";
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,render(plan,alt),"utf8");
const url="https://prepaid1215.github.io/test-post/plans/l-7gb/";
const sitemap="site/sitemap.xml";let xml=fs.readFileSync(sitemap,"utf8");
if(!xml.includes(url))xml=xml.replace("</urlset>","<url><loc>"+url+"</loc></url>\n</urlset>");
fs.writeFileSync(sitemap,xml);
let changed=0;
for(const spec of specs){
 const file=path.join("site",spec.path,"index.html");let html=fs.readFileSync(file,"utf8");
 const link="../".repeat(spec.path.split("/").filter(Boolean).length)+"plans/l-7gb/";
 const pattern=/<a\b(?=[^>]*class="apply-link")(?=[^>]*data-action="choose-plan")(?=[^>]*data-plan="ntelecom-l-7gb")[^>]*>[\s\S]*?<\/a>/g;
 let count=0;
 html=html.replace(pattern,()=>{count++;return '<a href="'+link+'" class="apply-link" data-action="product-detail" data-plan="ntelecom-l-7gb">상세 보고 가입하기 →</a>'});
 if(count){changed+=count;fs.writeFileSync(file,html,"utf8")}
}
if(changed<1)throw Error("No L7GB cards linked to story page");
console.log("Built L7GB narrative product detail + "+changed+" catalog links; 20 sitemap URLs.");