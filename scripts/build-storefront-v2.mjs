import fs from "node:fs";
import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const benefits=JSON.parse(fs.readFileSync("data/benefits-snapshot.json","utf8"));
const enrich=JSON.parse(fs.readFileSync("data/consumer-enrichment.json","utf8"));
const BASE="https://prepaid1215.github.io/test-post/";
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function relPath(page,dest){return "../".repeat(page.split("/").filter(Boolean).length)+dest.replace(/^\/+/,"")}
function won(n){return new Intl.NumberFormat("ko-KR").format(n)+"원"}
function productPool(s,arr){
 let list=arr.filter(p=>{
  switch(s.mode){
  case "under20":return p.monthly_price<20000;
  case "20range":return p.monthly_price>=20000&&p.monthly_price<30000;
  case "under30":return p.monthly_price<30000;
  case "7gb":return p.data_gb===7;
  case "10gb":return p.data_gb===10;
  case "15gb":return p.data_gb===15;
  case "11daily":return p.data_gb===11&&p.daily_data_gb===2;
  case "100gb":return p.data_gb===100;
  case "3mbps":return p.after_speed==="3Mbps";
  case "naver":return p.benefit_ids.includes("benefit-naverpay");
  case "coupang":return p.benefit_ids.includes("benefit-coupang-cash");
  default:return true;
  }
 }).sort((a,b)=>a.monthly_price-b.monthly_price||a.name.localeCompare(b.name,"ko"));
 if(s.mode==="port")list=list.filter(p=>p.port_available===true);
 if(s.mode==="new")list=list.filter(p=>p.new_available===true);
 return list;
}
function getHighlights(s,all){
 const pool=productPool(s,all),selected=[],seen=new Set();
 const curated=s.path==="/"
 ?["ntelecom-l-7gb","ntelecom-k-10gb-millie","ntelecom-k-15gb-millie","ntelecom-l-11gb-daily2gb"]
 :s.path==="/unlimited/"
 ?["ntelecom-l-7gb","ntelecom-l-100min-15gb","ntelecom-l-11gb-daily2gb","ntelecom-k-100gb-millie"]
 :[];
 if(curated.length)for(const id of curated){const p=pool.find(x=>x.id===id);if(p){selected.push(p);seen.add(p.id);}}
 for(const p of pool){
  if(selected.length>=4)break;
  if(seen.has(p.id))continue;
  const profile=[p.network,p.data_gb,p.daily_data_gb,p.after_speed,p.calls.startsWith("기본제공")?"basic":p.calls.slice(0,5)].join("|");
  if(selected.some(x=>[x.network,x.data_gb,x.daily_data_gb,x.after_speed,x.calls.startsWith("기본제공")?"basic":x.calls.slice(0,5)].join("|")===profile))continue;
  selected.push(p);seen.add(p.id);
 }
 return {pool,featured:selected.length?selected:pool.slice(0,4)};
}
function describe(p){
 return (p.data_gb!==null&&p.data_gb!==undefined?p.data_gb+"GB":"")+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":"")||"별도 확인";
}
function cards(s,items){
 const E=esc,official="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx";
 return items.map((p,i)=>`<article class="plan-card">
 <div class="plan-head"><span class="network ${p.network==="K"?"network-kt":"network-lg"}">${p.network==="K"?"KT망":"LG U+망"}</span>${i===0?'<span class="meta-tag">낮은 기본료 예시</span>':""}</div>
 <h3>${E(p.name.replace(/^앤텔레콤\s*/,""))}</h3>
 <div class="plan-price"><span>월</span><strong>${won(p.monthly_price)}</strong></div>
 <div class="plan-facts"><div><span>데이터</span><b>${E(describe(p))}</b></div><div><span>데이터 소진 후</span><b>최대 ${E(p.after_speed)}</b></div><div><span>일반통화</span><b>${E(p.calls.startsWith("기본제공")?"기본제공":p.calls.split(" ")[0])}</b></div></div>
 <a class="plan-action" href="${official}" target="_blank" rel="noopener noreferrer" data-action="official-plan" data-plan="${E(p.id)}">공식 요금제 확인 <span aria-hidden="true">↗</span></a>
 </article>`).join("");
}
function finder(s,items,bs){
 if(s.path!=="/")return "";
 const e=esc;
 const json=JSON.stringify({plans:items.map(p=>({id:p.id,name:p.name,network:p.network,monthly_price:p.monthly_price,data_gb:p.data_gb,daily_data_gb:p.daily_data_gb,after_speed:p.after_speed,calls:p.calls,benefit_ids:p.benefit_ids,new_available:p.new_available,port_available:p.port_available})),benefits:bs.map(b=>({id:b.id,name:b.name}))}).replace(/</g,"\\u003c");
 return `<section class="finder" id="postpaid-finder">
  <div class="finder-intro"><div><span class="eyebrow">맞춤 비교</span><h2>어떤 알뜰폰 요금제가 맞을까요?</h2><p>내 예산과 데이터·통화 사용량을 선택하면 조건에 맞는 상품을 비교합니다.</p></div><span class="finder-numeral">01 — 03</span></div>
  <form id="postpaid-finder-form" class="finder-form">
   <label>월 요금 예산<select name="budget"><option value="19999">2만원 미만</option><option value="29999" selected>3만원 미만</option><option value="39999">4만원 미만</option><option value="999999">가격 상관없음</option></select></label>
   <label>필요한 데이터<select name="data"><option value="0">상관없음</option><option value="7" selected>7GB 이상</option><option value="10">10GB 이상</option><option value="15">15GB 이상</option><option value="50">50GB 이상</option></select></label>
   <label>일반통화<select name="calls"><option value="any">100분·300분형도 보기</option><option value="basic" selected>기본제공형</option></select></label>
   <label>통신망<select name="network"><option value="any">KT망·LG U+망 모두</option><option value="K">KT망</option><option value="L">LG U+망</option></select></label>
   <label>가입 방식<select name="join"><option value="port">기존 번호 유지</option><option value="new">새 회선 신규가입</option><option value="unsure">아직 결정하지 않음</option></select></label>
   <button type="submit" class="finder-submit">조건에 맞는 요금제 비교 <span>→</span></button>
  </form>
  <div id="postpaid-finder-results" class="finder-results" aria-live="polite"><p>조건을 선택하면 가격을 비교할 수 있습니다.</p></div>
  <p class="fineprint">* 비교 자료: 2026년 9월 조사. 가입 가능 여부는 통신사 심사와 최신 판매조건에 따릅니다.</p>
  <script type="application/json" id="postpaid-finder-data">${json}</script>
 </section>`;
}
function guide(s,enrichData,items,allSpecs){
 const addon=enrichData.pages[s.path], E=esc, R=relPath;
 if(!addon)throw Error("missing content "+s.path);
 let content=addon.groups.map((g,i)=>`<article class="guide-block"><div class="guide-index">${String(i+1).padStart(2,"0")}</div><div class="guide-text"><h3>${E(g.title)}</h3>${g.paragraphs.map(p=>`<p>${E(p)}</p>`).join("")}${g.links?.length?`<div class="guide-links">${g.links.filter(l=>allSpecs.some(x=>x.path===l.path)).map(l=>`<a href="${R(s.path,l.path)}">${E(l.label)} →</a>`).join("")}</div>`:""}</div></article>`).join("");
 const faqs=s.faqs.map(([q,a])=>`<details><summary>${E(q)}</summary><p>${E(a)}</p></details>`).join("");
 const tableRows=items.slice(0,10).map(p=>`<tr><th scope="row">${E(p.name.replace(/^앤텔레콤\s*/,""))}</th><td>${won(p.monthly_price)}</td><td>${E(describe(p))}</td><td>${E(p.after_speed)}</td></tr>`).join("");
 const moreLinks=["/price/under-20000/","/data/15gb/","/unlimited/","/number-transfer/","/benefits/","/sim-only/"].filter(p=>p!==s.path).map(p=>allSpecs.find(x=>x.path===p)).filter(Boolean);
 return `<div class="below-grid">
   <div class="longform">
    <section class="article-summary"><span class="eyebrow">선택 가이드</span><h2>${E(addon.headline)}</h2><p>${E(addon.intro)}</p></section>
    <section class="article-guide" id="consumer-guide">${content}</section>
    <section class="comparison" id="compare-all"><div class="section-title"><span class="eyebrow">가격표로 한 번 더 비교</span><h2>알뜰폰 요금제 비교표</h2></div><p>조건에 해당하는 ${items.length}개 상품 중 기본료가 낮은 순서로 최대 10개를 표시합니다.</p><div class="table-overflow"><table><thead><tr><th>요금제</th><th>월 기본료</th><th>데이터</th><th>이후 최대 속도</th></tr></thead><tbody>${tableRows}</tbody></table></div><p class="fineprint">2026년 9월 조사 자료 기준 · 현재 판매 여부와 혜택 적용 여부는 가입 시 확인하세요.</p></section>
    <section class="faq" id="faq"><div class="section-title"><span class="eyebrow">자주 묻는 질문</span><h2>${E(s.term)} FAQ</h2></div>${faqs}</section>
   </div>
   <aside class="side-rail"><div class="rail-card"><span class="eyebrow">가입 전 확인</span><h3>내게 맞는 요금제를 찾았다면</h3><p>월 기본료와 데이터·통화 제공량을 확인한 후 공식 상품 조건을 확인하세요.</p><a class="rail-primary" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">공식 요금제 확인 ↗</a><a class="rail-secondary" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">알뜰폰 가입 상담</a><small>가입 가능 여부·상품 판매조건은 실제 신청 화면을 기준으로 합니다.</small></div>
   <div class="rail-links"><h3>함께 보면 좋은 정보</h3>${moreLinks.map(x=>`<a href="${R(s.path,x.path)}">${E(x.term)} <span>→</span></a>`).join("")}</div></aside>
  </div>`;
}
function render(s,specs,items,bs,enrichData){
 const E=esc,R=relPath,HOME="https://prepaid1215.github.io/test-post/",canon=HOME+s.path.replace(/^\/+/,""),
 official="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx",kakao="https://pf.kakao.com/_akxmKn/chat",hero=getHighlights(s,items),sample=hero.featured[0]??items[0],home=s.path==="/";
 const title=s.title.replace(/후불\s*알뜰폰/g,"알뜰폰").replace(/후불\s*요금제/g,"알뜰폰 요금제");
 const description=s.description.replace(/후불\s*알뜰폰/g,"알뜰폰").replace(/후불\s*요금제/g,"알뜰폰 요금제");
 const heading=home?"알뜰폰 요금제 비교, 내 사용량에 맞게":s.h1;
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"알뜰폰 요금제 비교","url":HOME,"inLanguage":"ko-KR"},{"@type":"WebPage","name":title,"url":canon,"description":description,"inLanguage":"ko-KR"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":HOME},...(home?[]:[{"@type":"ListItem","position":2,"name":s.term,"item":canon}])]}]};
 const nav=[["1만원대","/price/under-20000/"],["데이터 무제한","/unlimited/"],["15GB","/data/15gb/"],["번호이동","/number-transfer/"],["가입 혜택","/benefits/"]];
 const cardsHTML=cards(s,hero.featured);
 const pickLinks=[["2만원 미만","/price/under-20000/"],["15GB 비교","/data/15gb/"],["데이터 무제한형","/unlimited/"],["번호 유지","/number-transfer/"]].map(([label,p])=>`<a href="${R(s.path,p)}">${label}<span>↗</span></a>`).join("");
 const script=home?`<script defer src="${R(s.path,"/assets/postpaid-finder.js")}?v=20261028-3"></script>`:"";
 return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${E(title)}</title><meta name="description" content="${E(description)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canon}"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${E(title)}"><meta property="og:description" content="${E(description)}"><meta property="og:url" content="${canon}">
<link rel="icon" href="${R(s.path,"/assets/favicon.svg")}"><link rel="stylesheet" href="${R(s.path,"/assets/storefront.css")}?v=20261028-3">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head>
<body class="storefront"><a href="#main" class="skip">본문 바로가기</a>
<header class="topbar"><div class="width topbar-content"><a class="site-logo" href="${R(s.path,"/")}"><span class="logo-symbol">a.</span><span>알뜰폰 요금제<small>월 통신비, 비교하고 선택하기</small></span></a>
<nav class="topnav" aria-label="주 메뉴">${nav.map(([txt,p])=>`<a ${s.path===p?'aria-current="page"':""} href="${R(s.path,p)}">${txt}</a>`).join("")}</nav>
<a class="header-apply" href="${official}" target="_blank" rel="noopener noreferrer">요금제 확인 <span>↗</span></a></div></header>
<main id="main">
<section class="hero"><div class="width hero-layout"><div class="hero-copy"><div class="hero-kicker"><span class="live-dot"></span> KT망·LG U+망 알뜰폰 요금제</div>
<h1>${E(heading)}</h1><p class="hero-sub">${home?"가격부터 데이터, 통화까지. 실제 상품 조건을 한눈에 비교하고 내게 맞는 요금제를 찾아보세요.":s.answer}</p>
<div class="hero-actions"><a href="#plans" class="primary-button">요금제 비교하기 <span>→</span></a><a href="${home?"#postpaid-finder":"#consumer-guide"}" class="secondary-button">${home?"내 조건으로 찾기":"가입 조건 알아보기"}</a></div>
<p class="hero-caption">자료 기준: 2026.09.28 · 실제 판매가격·가입 가능 여부는 공식 안내 확인</p>
</div><div class="hero-panel"><div class="panel-top"><span>요금제 예시</span><span class="network ${sample.network==="K"?"network-kt":"network-lg"}">${sample.network==="K"?"KT망":"LG U+망"}</span></div>
<div class="panel-title">월 기본료</div><div class="panel-price">${won(sample.monthly_price)}</div>
<p class="panel-plan">${E(sample.name.replace(/^앤텔레콤\s*/,""))}</p>
<div class="panel-data"><div><span>기본 데이터</span><b>${E(describe(sample))}</b></div><div><span>소진 후 속도</span><b>최대 ${E(sample.after_speed)}</b></div></div>
<a href="${official}" target="_blank" rel="noopener noreferrer" class="panel-cta">상품 조건 확인하기 <span>↗</span></a></div></div></section>
<section class="width quicknav" aria-label="빠른 검색"><span class="quick-label">자주 찾는 요금제</span>${pickLinks}</section>
<section class="width products-section" id="plans"><div class="section-header"><div><span class="eyebrow">요금제 한눈에 보기</span><h2>${home?"많이 비교하는 알뜰폰 요금제":E(s.term+" 상품 비교")}</h2></div><p>월 기본료는 부가세 포함 · 상품별 혜택 별도 확인</p></div>
<div class="cards">${cardsHTML}</div><p class="fineprint">* 아래 금액은 앤텔레콤 상품의 2026년 9월 조사값입니다. 현재 진행 중인 이벤트나 가입 가능 여부는 공식 판매 화면에서 확인해야 합니다.</p></section>
${finder(s,items,bs)}
<section class="width joining" id="how-to-join"><div class="joining-title"><span class="eyebrow">가입 진행 순서</span><h2>요금제 선택부터 가입까지</h2></div>
<div class="joining-steps"><div><span>01</span><b>요금제 선택</b><p>월 요금과 데이터 확인</p></div><div><span>02</span><b>가입 유형 선택</b><p>번호이동 또는 신규가입</p></div><div><span>03</span><b>공식 가입 진행</b><p>본인확인과 가입심사</p></div></div>
<a href="${official}" target="_blank" rel="noopener noreferrer">공식 요금제 목록 보기 <span>→</span></a></section>
<section class="width guide-layout">${guide(s,enrichData,hero.pool,specs)}</section>
<section class="width end-cta"><div><span class="eyebrow">이제 실제 조건을 확인하세요</span><h2>마음에 드는 알뜰폰 요금제를 찾으셨나요?</h2><p>월 기본료·데이터·가입 방식은 공식 화면에서 마지막으로 확인하세요.</p></div><div><a href="${official}" class="primary-button" target="_blank" rel="noopener noreferrer">공식 요금제 확인 ↗</a><a href="${kakao}" class="secondary-button" target="_blank" rel="noopener noreferrer">가입 상담하기</a></div></section>
</main><footer class="site-footer"><div class="width"><strong>알뜰폰 요금제</strong><span>운영: 59만모바일 · 앤텔레콤 알뜰폰 요금제 비교 안내</span><small>2026년 9월 상품 조사 자료를 기준으로 작성했습니다. 실제 판매·개통 조건은 공식 안내를 따릅니다.</small></div></footer>
<nav class="mobile-cta" aria-label="빠른 요금제 이동"><a href="#plans">요금제 비교</a><a href="${official}" target="_blank" rel="noopener noreferrer">가입 조건 확인 ↗</a></nav>
${script}</body></html>`;
}
if(specs.length!==19||plans.length!==47)throw Error("Unexpected SEO page or plan count");
for(const s of specs){const dir="site"+s.path;fs.mkdirSync(dir,{recursive:true});const html=render(s,specs,plans,benefits,enrich);if((html.match(/<h1\b/g)||[]).length!==1)throw Error("H1 invalid "+s.path);fs.writeFileSync(path.join(dir,"index.html"),html,"utf8");}
fs.writeFileSync("site/sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+specs.map(s=>'<url><loc>'+BASE+s.path.replace(/^\/+/,"")+'</loc></url>').join("\n")+'\n</urlset>\n');
fs.writeFileSync("site/robots.txt","User-agent: *\nAllow: /\nSitemap: "+BASE+"sitemap.xml\n");
console.log("Storefront v2: generated "+specs.length+" unique SEO pages with one stylesheet and consumer-first product cards");