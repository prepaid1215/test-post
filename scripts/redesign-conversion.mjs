import fs from "node:fs";
import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
function clean(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function pathrel(p,relative){return "../".repeat(p.split("/").filter(Boolean).length)+relative.replace(/^\/+/,"")}
function asPrice(n){return new Intl.NumberFormat("ko-KR").format(n)+"원"}
function pickFeature(p,plans){
 const ids={
 "/":["ntelecom-l-7gb","ntelecom-k-15gb-millie","ntelecom-l-11gb-daily2gb","ntelecom-k-100gb-millie"],
 "/price/under-20000/":["ntelecom-l-7gb","ntelecom-k-7gb-cu","ntelecom-k-7gb-millie"],
 "/unlimited/":["ntelecom-l-7gb","ntelecom-l-100min-15gb","ntelecom-l-11gb-daily2gb","ntelecom-k-100gb-millie"],
 "/data/15gb/":["ntelecom-k-15gb-millie","ntelecom-l-100min-15gb","ntelecom-l-300min-15gb"],
 "/number-transfer/":["ntelecom-k-7gb-millie","ntelecom-k-15gb-millie","ntelecom-k-100gb-millie"],
 "/price/20000-range/":["ntelecom-k-10gb-millie","ntelecom-k-15gb-millie","ntelecom-l-100min-15gb"],
 "/data/7gb/":["ntelecom-l-7gb","ntelecom-k-7gb-cu","ntelecom-k-7gb-millie"],
 "/data/10gb/":["ntelecom-k-10gb-millie","ntelecom-k-10gb-cu","ntelecom-k-10gb-naverpay"],
 "/data/100gb/":["ntelecom-k-100gb-millie","ntelecom-k-100gb-cu","ntelecom-k-100gb-naverpay"]
 };
 const list=ids[p]||ids["/"];return list.map(id=>plans.find(y=>y.id===id)).filter(Boolean);
}
function heroBlock(s,plans){
 const e=clean, select=pickFeature(s.path,plans),p=select[0],home=s.path==="/", money=asPrice;
 const name=s.h1,heroDesc=home?"가격만 낮은 요금제가 아니라, 내 데이터 사용량과 통화 조건에 맞는 알뜰폰 요금제를 비교하세요.":s.answer;
 const data=p.data_gb?(p.data_gb+"GB"):(p.daily_data_gb?"매일 "+p.daily_data_gb+"GB":"제공량 확인");
 const planText=p.name.replace(/^앤텔레콤\s*/,"");
 const monthly=p.monthly_price;
 return `<section class="hero conversion-hero" aria-label="알뜰폰 요금제 안내">
  <div class="hero-main">
   <p class="hero-overline"><span class="hero-dot"></span> KT망 · LG U+망 <span class="hero-overline-divider">/</span> 앤텔레콤 알뜰폰 요금제</p>
   <h1>${e(name)}</h1>
   <p class="hero-description">${e(heroDesc)}</p>
   <div class="hero-checks"><span>월 기본료 비교</span><span>데이터·통화 확인</span><span>번호이동·신규가입</span></div>
   <div class="hero-actions">
    <a class="button hero-primary" href="${home?"#postpaid-finder":"#plans"}">${home?"내 요금제 찾아보기":"요금제 가격 비교하기"} <span aria-hidden="true">→</span></a>
    <a class="button hero-outline" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">공식 요금제 목록 <span aria-hidden="true">↗</span></a>
   </div>
   <p class="hero-disclaimer">부가세 포함 월 기본료 · 2026.09.28 조사 자료 · 실제 가입 조건은 공식 페이지에서 확인</p>
  </div>
  <aside class="hero-featured" aria-label="요금제 예시">
   <div class="feature-top"><span class="feature-network">${p.network==="K"?"KT망":"LG U+망"}</span><span class="feature-tag">요금제 예시</span></div>
   <p class="feature-kicker">${home?"부담 없는 기본료부터 비교":"이 검색 조건과 관련된 상품"}</p>
   <strong class="feature-title">${e(planText)}</strong>
   <div class="feature-price"><span>월</span> <strong>${money(monthly)}</strong></div>
   <div class="feature-specs"><div><span>기본 데이터</span><b>${e(data)}</b></div><div><span>소진 후 최대</span><b>${e(p.after_speed)}</b></div><div><span>일반통화</span><b>${p.calls.startsWith("기본제공")?"기본제공":e(p.calls.split(" ")[0])}</b></div></div>
   <a href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer" class="feature-link">공식 판매 조건 확인 <span aria-hidden="true">↗</span></a>
   <p class="feature-note">상품은 예시이며 현재 판매·가입 가능 여부는 별도 확인이 필요합니다.</p>
  </aside>
 </section>`;
}
function cardsBlock(s,plans){
 const e=clean, list=pickFeature(s.path,plans),title=s.path==="/"
 ? "가격과 데이터로 먼저 비교해 보세요"
 : s.term+" 관련 요금제 예시";
 const cards=list.map((p,i)=>{
 const n=p.name.replace(/^앤텔레콤\s*/,""),str=p.data_gb!==null?(p.data_gb+"GB"+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":"")):p.daily_data_gb?"매일 "+p.daily_data_gb+"GB":"상세 확인";
 const isBasic=p.calls.startsWith("기본제공");return `<article class="product-tile">
 <div class="tile-top"><span class="tile-network ${p.network==="K"?"kt":"lg"}">${p.network==="K"?"KT망":"LG U+망"}</span>${i===0?'<span class="tile-label">가격순 예시</span>':""}</div>
 <h3>${e(n)}</h3><div class="tile-price"><small>월</small><strong>${asPrice(p.monthly_price)}</strong></div>
 <dl><div><dt>기본 데이터</dt><dd>${e(str)}</dd></div><div><dt>소진 후</dt><dd>최대 ${e(p.after_speed)}</dd></div><div><dt>일반통화</dt><dd>${isBasic?"기본제공":e(p.calls.split(" ")[0])}</dd></div></dl>
 <a class="tile-cta" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">공식 요금제 확인 <span aria-hidden="true">↗</span></a>
 </article>`}).join("");
 return `<section class="conversion-products" aria-label="알뜰폰 요금제 상품 예시">
 <div class="section-heading"><div><p class="section-eyebrow">알뜰폰 요금제 비교</p><h2>${e(title)}</h2></div><p>2026년 9월 조사 자료 기준 · 현재 판매가와 다를 수 있습니다.</p></div>
 <div class="product-grid">${cards}</div>
 </section>`;
}
function stepsBlock(s){
 const p=pathrel;return `<section class="activation-strip" aria-label="알뜰폰 가입 방법">
 <h2>알뜰폰 가입은 이렇게 진행하세요</h2>
 <div class="activation-strip-grid"><div><b>01</b><strong>요금제 선택</strong><span>가격·데이터·통화 조건 확인</span></div><div><b>02</b><strong>가입 유형 확인</strong><span>번호이동 또는 신규가입 선택</span></div><div><b>03</b><strong>공식 가입 진행</strong><span>본인확인·가입 조건 심사</span></div></div>
 <p>실제 개통 가능 여부와 시간, 유심 필요 여부는 공식 신청 단계에서 확인하세요.</p>
 </section>`;
}
function transform(html,s,plans){
 const hero=html.match(/<section class="hero">[\s\S]*?<\/section>/);
 if(!hero)throw Error("hero not found: "+s.path);
 const h=heroBlock(s,plans);
 html=html.replace(hero[0],h);
 let finder="";
 if(s.path==="/"){
 const fm=html.match(/<section class="segment finder-section"[\s\S]*?<\/section>/);
 if(!fm)throw Error("finder missing");
 finder=fm[0];html=html.replace(finder,"");
 const related=html.match(/<section class="segment" id="related">[\s\S]*?<\/section>/);
 if(!related)throw Error("related missing");html=html.replace(related[0],"");
 // Product comparison is visible before the long content. User can jump directly into chooser.
 const first=finder.replace('59만모바일 후불요금제 탐색','59만모바일 알뜰폰 요금제 찾기').replace('후불 요금제','알뜰폰 요금제');
 html=html.replace(h,()=>h+cardsBlock(s,plans)+first+stepsBlock(s)+related[0]);
 }else{
 html=html.replace(h,()=>h+cardsBlock(s,plans)+stepsBlock(s));
 }
 // Update the visible product name throughout but preserve factual distinction in specific explanations.
 html=html.replace(/후불\s*요금제/g,"알뜰폰 요금제").replace(/후불요금제/g,"알뜰폰 요금제")
 .replace(/후불 알뜰폰/g,"알뜰폰")
 .replace(/후불 가입 상담/g,"알뜰폰 가입 상담")
 .replace(/후불 개통 상담/g,"알뜰폰 개통 상담")
 .replace(/후불 상담/g,"가입 상담")
 .replace(/후불 가입/g,"알뜰폰 가입")
 .replace(/후불 상품/g,"알뜰폰 상품")
 .replace(/앤텔레콤 알뜰폰 검색·비교 실험 사이트/g,"앤텔레콤 알뜰폰 요금제 비교 및 가입 안내")
 .replace(/앤텔레콤 알뜰폰 검색·비교 실험 사이트\./g,"앤텔레콤 알뜰폰 요금제 비교 및 가입 안내.");
 // CTA labels should lead to confirmed official plan listing, not falsely imply a deep-link checkout.
 html=html.replace(/공식 알뜰폰 요금제 확인/g,"공식 요금제 확인");
 const style='<link rel="stylesheet" href="'+pathrel(s.path,"/assets/conversion-design.css")+'">';
 html=html.replace("</head>",style+"</head>");
 const sticky=`<nav class="mobile-action-bar" aria-label="알뜰폰 요금제 빠른 메뉴"><a href="${s.path==="/"?"#postpaid-finder":"#plans"}">요금제 비교</a><a href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">가입 조건 확인 ↗</a></nav>`;
 html=html.replace("</body>",sticky+"</body>");
 if((html.match(/<h1\b/g)||[]).length!==1)throw Error("bad H1 count: "+s.path);
 return html;
}
for(const spec of specs){
 const file=path.join("site",spec.path,"index.html");
 let html=fs.readFileSync(file,"utf8");
 html=transform(html,spec,plans);
 fs.writeFileSync(file,html);
}
console.log("Conversion redesign applied to "+specs.length+" pages.");
