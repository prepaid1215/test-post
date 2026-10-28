import fs from 'node:fs';

import path from 'node:path';

const specs=[...JSON.parse(fs.readFileSync('data/consumer-spec-a.json','utf8')),...JSON.parse(fs.readFileSync('data/consumer-spec-b.json','utf8'))];

const plans=JSON.parse(fs.readFileSync('data/plans-snapshot.json','utf8'));

const benefits=JSON.parse(fs.readFileSync('data/benefits-snapshot.json','utf8'));

const content=JSON.parse(fs.readFileSync('data/consumer-enrichment.json','utf8'));

function E(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}

function won(n){return Number(n).toLocaleString("ko-KR")+"원"}

function pathTo(from,to){return "../".repeat(from.split("/").filter(Boolean).length)+to.replace(/^\/+/,"")}

function selectPlans(s,plans){
 const list=plans.filter(p=>{
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
   case "port":return p.port_available===true;
   case "new":return p.new_available===true;
   default:return true;
  }
 });
 return list.sort((a,b)=>a.monthly_price-b.monthly_price||a.name.localeCompare(b.name,"ko"));
}

function summary(p){return (p.data_gb!=null?p.data_gb+"GB":"")+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":"")||"요금제 조건 확인"}

function makeCard(p,benefitMap){
 const network=p.network==="K"?"KT망":"LG U+망";
 const b=p.benefit_ids.map(x=>benefitMap.get(x)).filter(Boolean);
 const extra=b.length?b.map(x=>x.name).join(" · ")+" 혜택 (조건 확인)":p.promotion?"데이터 추가 제공 프로모션 조건 확인":"";
 const details=[
  ["기본 데이터",summary(p)],
  ["소진 후 속도",p.after_speed?"최대 "+p.after_speed:"별도 확인"],
  ["일반 통화",p.calls],
  ["문자",p.sms],
  ["신규가입",p.new_available===true?"자료상 가능":p.new_available===false?"불가":"공식 조건 확인"],
  ["번호이동",p.port_available===true?"자료상 가능":p.port_available===false?"불가":"공식 조건 확인"]
 ].map(([k,v])=>`<div><dt>${E(k)}</dt><dd>${E(v)}</dd></div>`).join("");
 const benefits=b.length?b.map(x=>`<p class="promotion-note"><strong>${E(x.name)}</strong> · ${E(x.value)}. ${E(x.conditions)}</p>`).join(""):"";
 const promo=p.promotion?`<p class="promotion-note">추가 데이터 안내: ${E(p.promotion.description)}. 조사 당시 종료 예정일 ${E(p.promotion.end_date||"미확인")}, 실제 적용 여부는 가입 시 확인.</p>`:"";
 return `<article class="plan-item" data-id="${E(p.id)}" data-price="${p.monthly_price}" data-gb="${p.data_gb??0}" data-network="${E(p.network)}" data-speed="${E(p.after_speed)}" data-basic="${p.calls.startsWith("기본제공")?"yes":"no"}" data-benefits="${E(p.benefit_ids.join(" "))}" data-name="${E(p.name)}">
 <div class="plan-primary">
  <div class="plan-copy">
   <div class="plan-minor"><span class="network ${p.network==="L"?"l":""}">${network}</span><span class="plan-category">앤텔레콤 알뜰폰</span></div>
   <h3>${E(p.name.replace(/^앤텔레콤\s*/,""))}</h3>
   <p class="plan-highlights"><span>${E(summary(p))}</span><span>소진 후 최대 ${E(p.after_speed)}</span><span>${E(p.calls.startsWith("기본제공")?"통화 기본제공":p.calls.split(" ")[0])}</span></p>
   ${extra?`<p class="plan-extra">${E(extra)}</p>`:""}
  </div>
  <div class="price-area"><div class="price-label">월 기본료</div><div class="price"><small>월</small>${won(p.monthly_price)}</div><a href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" class="apply-link" target="_blank" rel="noopener noreferrer" data-action="official" data-plan="${E(p.id)}">가입 조건 확인 ↗</a></div>
 </div>
 <div class="plan-tools"><details class="plan-detail"><summary>상세 조건</summary><div class="plan-details"><dl class="details-grid">${details}</dl>${benefits}${promo}<p class="promotion-note">상품명·가격·혜택은 2026년 9~10월 보관 자료 기준입니다. 실제 판매 화면에서 확인하세요.</p></div></details><label class="compare-check"><input type="checkbox" class="compare-pick" value="${E(p.id)}"> 비교함에 담기</label></div>
 </article>`;
}

function makeGuide(s,content,specs){
 const E0=E;
 let g=content.pages[s.path];if(!g)throw Error("Missing guide "+s.path);
 let groups=g.groups.map(x=>`<section class="article-block"><h3>${E0(x.title)}</h3>${x.paragraphs.map(t=>`<p>${E0(t)}</p>`).join("")}${x.links?.length?x.links.filter(l=>specs.some(z=>z.path===l.path)).map(l=>`<a href="${pathTo(s.path,l.path)}">${E0(l.label)} →</a>`).join(""):""}</section>`).join("");
 return `<section class="article-section" id="guide"><p class="section-label">요금제 선택 가이드</p><h2>${E0(g.headline)}</h2><p class="article-intro">${E0(g.intro)}</p><div class="article-grid">${groups}</div></section><section class="faq-section" id="faq"><h2>자주 묻는 질문</h2>${s.faqs.map(([q,a])=>`<details><summary>${E0(q)}</summary><p>${E0(a)}</p></details>`).join("")}</section>`;
}

function filterMarkup(){
 return `<details class="filter-drawer" id="filter-drawer" open><summary>조건별 필터 설정</summary><div class="filter-inner"><div class="filters-head"><strong>필터</strong><button class="reset-btn" id="reset-filters" type="button">초기화</button></div>
  <form id="catalog-filters">
   <fieldset class="field-block"><legend>통신망</legend><div class="radio-stack">
    <label><input type="radio" name="network" value="all" checked> 전체</label>
    <label><input type="radio" name="network" value="K"> KT망</label>
    <label><input type="radio" name="network" value="L"> LG U+망</label>
   </div></fieldset>
   <fieldset class="field-block"><legend>월 기본료</legend><select name="price"><option value="all">전체 가격</option><option value="under20">2만원 미만</option><option value="under30">3만원 미만</option><option value="under40">4만원 미만</option><option value="over40">4만원 이상</option></select></fieldset>
   <fieldset class="field-block"><legend>데이터</legend><select name="data"><option value="all">전체 용량</option><option value="under10">10GB 미만</option><option value="from10">10GB 이상</option><option value="from15">15GB 이상</option><option value="from100">100GB 이상</option><option value="daily">매일 추가 제공</option></select></fieldset>
   <fieldset class="field-block"><legend>소진 후 속도</legend><select name="speed"><option value="all">전체</option><option value="1Mbps">최대 1Mbps</option><option value="3Mbps">최대 3Mbps</option><option value="5Mbps">최대 5Mbps</option></select></fieldset>
   <fieldset class="field-block"><legend>일반통화</legend><select name="calls"><option value="all">전체</option><option value="basic">기본제공</option><option value="limited">100분·300분 등 제한형</option></select></fieldset>
   <fieldset class="field-block"><legend>제휴 혜택</legend><select name="benefit"><option value="all">전체</option><option value="benefit-naverpay">네이버페이</option><option value="benefit-coupang-cash">쿠팡캐쉬</option><option value="benefit-millie">밀리의서재</option><option value="benefit-cu">CU</option></select><p class="filters-small">혜택 조건은 요금제 상세에서 확인할 수 있습니다.</p></fieldset>
   <button type="button" id="reset-filters-bottom" class="more-btn">필터 초기화</button>
  </form></div></details>`;
}

function render(s,specs,plans,benefits,content){
 const base="https://prepaid1215.github.io/test-post/",canonical=base+s.path.replace(/^\/+/,""),list=selectPlans(s,plans);
 const title=s.title.replace(/후불\s*알뜰폰/g,"알뜰폰").replace(/후불\s*요금제/g,"알뜰폰 요금제");
 const desc=s.description.replace(/후불\s*알뜰폰/g,"알뜰폰").replace(/후불\s*요금제/g,"알뜰폰 요금제");
 const h1=s.path==="/"?"알뜰폰 요금제 비교":s.h1;
 const lead=s.path==="/"
 ?"월 요금과 데이터, 통화 조건을 함께 비교하세요. 원하는 조건으로 좁힌 뒤 상품별 상세 정보를 확인할 수 있습니다."
 :s.answer.replace(/후불\s*알뜰폰/g,"알뜰폰");
 const categories=[["전체 요금제","/"],["1만원대","/price/under-20000/"],["2만원대","/price/20000-range/"],["데이터 무제한","/unlimited/"],["15GB","/data/15gb/"],["100GB","/data/100gb/"],["번호이동","/number-transfer/"],["가입 혜택","/benefits/"]];
 const nav=categories.map(([t,p])=>`<a ${s.path===p?'aria-current="page"':""} href="${pathTo(s.path,p)}">${t}</a>`).join("");
 const benefitMap=new Map(benefits.map(b=>[b.id,b]));
 const pjson=JSON.stringify(list).replace(/</g,"\\u003c");
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebPage","name":title,"url":canonical,"description":desc,"inLanguage":"ko-KR"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"알뜰폰 요금제","item":base},...(s.path==="/"?[]:[{"@type":"ListItem","position":2,"name":s.term,"item":canonical}])]}]};
 const depthpath=pathTo(s.path,"/assets/catalog.css");
 const jsp=pathTo(s.path,"/assets/catalog.js");
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(title)}</title><meta name="description" content="${E(desc)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:locale" content="ko_KR"><meta property="og:type" content="website"><meta property="og:title" content="${E(title)}"><meta property="og:description" content="${E(desc)}"><meta property="og:url" content="${canonical}"><link rel="icon" href="${pathTo(s.path,"/assets/favicon.svg")}"><link rel="stylesheet" href="${depthpath}?v=20261028-5"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head>
 <body data-mode="${E(s.mode)}"><a class="skip" href="#main">본문 바로가기</a>
 <div class="top-accent" aria-hidden="true"></div><header class="header"><div class="wrap header-inner"><a class="logo" href="${pathTo(s.path,"/")}">알뜰폰<span class="logo-point">요금제.</span></a><nav class="desktop-nav" aria-label="주 메뉴"><a href="${pathTo(s.path,"/")}">전체 요금제</a><a href="${pathTo(s.path,"/price/under-20000/")}">1만원대</a><a href="${pathTo(s.path,"/unlimited/")}">데이터 무제한</a><a href="${pathTo(s.path,"/number-transfer/")}">번호이동</a></nav><a class="header-link" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">요금제 신청 안내 <span aria-hidden="true">↗</span></a></div></header>
 <main class="wrap" id="main"><nav class="breadcrumbs" aria-label="현재 위치"><a href="${pathTo(s.path,"/")}">알뜰폰 요금제</a>${s.path!=="/"?"  /  "+E(s.term):""}</nav>
 <section class="page-intro ${s.path==="/"?"page-intro-home":"page-intro-detail"}">
  <div class="intro-copy">
    <p class="intro-kicker"><span class="kicker-dot"></span> 알뜰폰 요금제 비교 · KT망 / LG U+망</p>
    <h1>${E(h1)}</h1>
    <p class="lead">${E(lead)}</p>
    <div class="intro-actions"><a href="#plans" class="intro-primary">요금제 찾아보기 <span aria-hidden="true">→</span></a><a href="#guide" class="intro-secondary">요금제 선택 가이드</a></div>
    <p class="source-note">2026년 9월 조사 자료 · 가격과 혜택은 가입 시 다시 확인해 주세요.</p>
  </div>
  <div class="intro-summary" aria-label="요금제 비교 자료">
    <span class="summary-eyebrow">알뜰폰 요금제 비교</span>
    <strong>${list.length}<span>개 상품</span></strong>
    <div class="summary-line"></div>
    <p>월 기본료 <b>${won(list.length?Math.min(...list.map(p=>p.monthly_price)):0)}부터</b></p>
    <small>앤텔레콤 조사 자료 기준<br>현재 판매가격은 공식 화면 확인</small>
  </div>
</section>
 <nav class="tag-nav" aria-label="요금제 주제">${nav}</nav>
 <section class="catalog" id="plans">${filterMarkup()}
  <div class="catalog-content"><div class="list-top"><div class="list-title"><h2>요금제 목록</h2><strong id="result-count">${list.length}개</strong></div><div class="sort-area"><span>정렬</span><select id="sort-by" aria-label="요금제 정렬"><option value="price-asc">낮은 요금순</option><option value="price-desc">높은 요금순</option><option value="data-desc">데이터 많은순</option></select></div></div>
  <label class="search-label" for="plan-search"><span>요금제 검색</span><input id="plan-search" class="search-input" type="search" placeholder="예: 15GB, 네이버페이, 밀리의서재" autocomplete="off"></label>\n  <p class="catalog-alert">앤텔레콤 알뜰폰 요금제 ${list.length}개를 정리했습니다. 다른 사업자 상품은 포함하지 않으며, 표시된 가격은 조사 당시 기본료입니다.</p>
  <div class="plan-list" id="plan-list">${list.map(p=>makeCard(p,benefitMap)).join("")}</div>
  <div class="empty" id="empty-results" hidden><b>조건에 맞는 상품이 없습니다.</b>다른 조건을 선택하거나 필터를 초기화해 보세요.</div>
  <button class="more-btn" id="load-more" type="button" hidden>요금제 더 보기</button>
  <p class="purchase-note">월 기본료는 보관된 상품 자료를 기준으로 표기했습니다. 제휴 포인트·상품권을 통신요금에서 임의로 차감하지 않았습니다.</p>
  </div></section>
 ${makeGuide(s,content,specs)}
 <section class="join-help"><div><h2>요금제는 골랐는데 가입 방법이 궁금하다면?</h2><p>번호이동·신규가입, 유심 호환 및 신청 가능 여부를 확인하세요.</p></div><a href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer" data-action="chat">가입 상담하기 ↗</a></section></main>
 <footer class="site-footer"><div class="wrap"><strong>알뜰폰요금제</strong><small>운영: 59만모바일 · 앤텔레콤 알뜰폰 요금제 안내 · 판매조건과 가입 심사 결과는 공식 가입 화면을 기준으로 합니다.</small></div></footer>
 <div class="compare-tray" id="compare-tray" hidden><div class="wrap tray-inner"><span class="tray-text">비교할 요금제 <b id="compare-count">0</b>개 선택됨 (최대 3개)</span><div class="tray-actions"><button id="compare-clear" type="button">초기화</button><button id="compare-open" type="button" class="primary">비교하기</button></div></div></div>
 <dialog id="compare-dialog" aria-labelledby="compare-heading"><div class="dialog-head"><h2 id="compare-heading">요금제 비교</h2><button id="compare-close" type="button" aria-label="닫기">×</button></div><div class="dialog-body"><div class="dialog-scroller" id="compare-output"></div><p class="source-note">가격 및 혜택은 조사 시점 기준이며 가입 심사 결과를 보장하지 않습니다.</p></div></dialog>
 <nav class="mobile-bottom" aria-label="빠른 이동"><a href="#plans">요금제 찾기</a><a href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">가입 조건 확인 ↗</a></nav>
 <script id="plan-json" type="application/json">${pjson}</script><script src="${jsp}?v=20261028-5" defer></script></body></html>`;
}

if(specs.length!==19||plans.length!==47)throw Error('Expected 19 pages and 47 plans');

for(const s of specs){const dir='site'+s.path;fs.mkdirSync(dir,{recursive:true});const html=render(s,specs,plans,benefits,content);if((html.match(/<h1\b/g)||[]).length!==1)throw Error('bad H1 '+s.path);fs.writeFileSync(path.join(dir,'index.html'),html,'utf8');}

const root='https://prepaid1215.github.io/test-post/';

fs.writeFileSync('site/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+specs.map(s=>'<url><loc>'+root+s.path.replace(/^\/+/, '')+'</loc></url>').join('\n')+'\n</urlset>\n');

fs.writeFileSync('site/robots.txt','User-agent: *\nAllow: /\nSitemap: '+root+'sitemap.xml\n');

console.log('Catalog generated for '+specs.length+' search URLs from '+plans.length+' plan records');