import fs from "node:fs";
import path from "node:path";
const BASE_URL=(process.env.SITE_URL||"https://prepaid1215.github.io/test-post/").replace(/\/+$/,"")+"/";
function escapeHTML(x){return String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function pick(mode,plans){
 const arr=plans.filter(p=>{
  if(mode==="under20")return p.monthly_price<20000;
  if(mode==="20range")return p.monthly_price>=20000&&p.monthly_price<30000;
  if(mode==="under30")return p.monthly_price<30000;
  if(mode==="7gb")return p.data_gb===7;
  if(mode==="10gb")return p.data_gb===10;
  if(mode==="15gb")return p.data_gb===15;
  if(mode==="11daily")return p.data_gb===11&&p.daily_data_gb===2;
  if(mode==="100gb")return p.data_gb===100;
  if(mode==="3mbps")return p.after_speed==="3Mbps";
  if(mode==="naver")return p.benefit_ids.includes("benefit-naverpay");
  if(mode==="coupang")return p.benefit_ids.includes("benefit-coupang-cash");
  if(mode==="port")return p.port_available===true;
  if(mode==="new")return p.new_available===true;
  return true;
 }).sort((a,b)=>a.monthly_price-b.monthly_price||a.name.localeCompare(b.name,"ko"));
 let selected=arr;
 if(["home","mix","unlimited","sim","device","port","new"].includes(mode)){
  const ids=["ntelecom-l-7gb","ntelecom-k-7gb-cu","ntelecom-k-10gb-millie","ntelecom-k-15gb-millie","ntelecom-l-100min-15gb","ntelecom-l-11gb-daily2gb","ntelecom-k-100gb-millie","ntelecom-l-daily5gb"];
  selected=ids.map(id=>arr.find(x=>x.id===id)).filter(Boolean);
 }
 if(mode==="benefits"){
  selected=["coupang-cash","naverpay","daiso","millie","oliveyoung","cu"].map(n=>arr.find(p=>p.id==="ntelecom-k-7gb-"+n)).filter(Boolean);
 }
 if(["15gb","3mbps","under30","20range"].includes(mode)){
  const seen=new Set();selected=arr.filter(p=>{let k=[p.network,p.data_gb,p.daily_data_gb,p.after_speed,p.calls.startsWith("기본제공")?"basic":p.calls.split(" ")[0]].join("|");if(seen.has(k))return false;seen.add(k);return true;});
 }
 return {count:arr.length,items:selected.slice(0,8)};
}
function renderPage(s,specs,plans,benefits){
 const E=escapeHTML,root=BASE_URL.replace(/\/+$/,"")+"/",url=root+s.path.replace(/^\/+/,""),level=s.path.split("/").filter(Boolean).length,relative=p=>"../".repeat(level)+p.replace(/^\/+/,""),money=n=>n.toLocaleString("ko-KR")+"원";
 const image=s.group==="가입"?"quick-transfer.webp":s.group==="혜택"?"quick-benefits.webp":s.mode==="home"?"hero-mobile.webp":"quick-plans.webp";
 const choose=pick(s.mode,plans),linkspecs=specs.filter(x=>x.path!==s.path);
 const groups=s.mode==="home"?["/price/under-20000/","/price/20000-range/","/data/15gb/","/unlimited/","/number-transfer/","/benefits/"]:s.mode==="naver"?["/benefits/coupang/","/benefits/","/data/7gb/"]:s.mode==="coupang"?["/benefits/naverpay/","/benefits/","/data/10gb/"]:s.group==="가입"?["/number-transfer/","/sim-only/","/new-number/","/plans/"]:s.group==="가격"?["/price/under-20000/","/price/20000-range/","/price/under-30000/","/data/15gb/"]:["/data/7gb/","/data/10gb/","/data/15gb/","/unlimited/","/data/100gb/","/speed/3mbps/"];
 let related=groups.map(p=>linkspecs.find(s=>s.path===p)).filter(Boolean).slice(0,s.path==="/"?6:3);
 const benefitLookup=Object.fromEntries(benefits.map(b=>[b.id,b]));
 const cards=related.map(x=>{let img=x.group==="가입"?"quick-transfer.webp":x.group==="혜택"?"quick-benefits.webp":"quick-plans.webp";return `<article class="offer"><img src="${relative("/assets/"+img)}" alt="" loading="lazy" width="120" height="120"><div class="offer-desc"><h3>${E(x.term)}</h3><p>${E(x.description)}</p></div><a href="${relative(x.path)}">조건 보기 →</a></article>`}).join("");
 const rows=choose.items.map(p=>{let label=p.name.replace(/^앤텔레콤\s+/,""),b=(p.benefit_ids||[]).map(n=>benefitLookup[n]?.name).filter(Boolean).join(" · ")||"별도 제휴혜택 없음",data=(p.data_gb?p.data_gb+"GB":"")+(p.daily_data_gb?" + 매일"+p.daily_data_gb+"GB":"")+" / 이후 "+p.after_speed;return `<tr><th scope="row">${E(label)}<small>${p.network==="K"?"KT망":"LG U+망"} · ${E(p.calls.startsWith("기본제공")?"일반통화 기본제공":p.calls.split(" ")[0])}</small></th><td class="money">${money(p.monthly_price)}</td><td>${E(data)}</td><td>${E(b)}</td></tr>`}).join("");
 const fact=choose.count+"개 상품 중 "+choose.items.length+"개를 표시했습니다. 가격은 2026년 9월 28일 조사 기준이며, 가입 당시 판매 여부는 다시 확인해야 합니다.";
 const snippets=s.sections.map(([t,d])=>`<section class="explain"><h3>${E(t)}</h3><p>${E(d)}</p></section>`).join("");
 const faq=s.faqs.map(([q,a])=>`<details><summary>Q. ${E(q)}</summary><p>A. ${E(a)}</p></details>`).join("");
 const relatedBlock=`<section class="segment" id="related"><h2>함께 검색하는 알뜰폰 정보</h2><div class="offer-list">${cards}</div></section>`;
 const bonus=(s.group==="혜택")?`<section class="segment"><h2>제휴혜택 지급 조건</h2><div class="benefit-list">${benefits.filter(b=>s.mode==="naver"?b.id==="benefit-naverpay":s.mode==="coupang"?b.id==="benefit-coupang-cash":true).map(b=>`<article><h3>${E(b.name)} — ${E(b.value)}</h3><p>${E(b.conditions)}</p><p>${E(b.delivery_method)} · ${E(b.delivery_timing)}</p></article>`).join("")}</div></section>`:"";
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":root+"#website","url":root,"name":"59만모바일 후불 알뜰폰 비교","inLanguage":"ko-KR"},{"@type":"WebPage","name":s.title,"url":url,"description":s.description,"inLanguage":"ko-KR","isPartOf":{"@id":root+"#website"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":root},...(s.path==="/"?[]:[{"@type":"ListItem","position":2,"name":s.h1,"item":url}])]},{"@type":"FAQPage","mainEntity":s.faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}]};
 const nav=[["전체 비교","/plans/"],["1만원대","/price/under-20000/"],["무제한형","/unlimited/"],["번호이동","/number-transfer/"],["혜택","/benefits/"]].map(([n,p])=>`<a href="${relative(p)}">${n}</a>`).join("");
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(s.title)}</title><meta name="description" content="${E(s.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${E(s.title)}"><meta property="og:description" content="${E(s.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${root+"assets/"+image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${relative("/assets/favicon.svg")}"><link rel="stylesheet" href="${relative("/assets/consumer.css")}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script></head><body><a href="#main" class="skip">본문으로 이동</a><header class="site-header"><div class="container"><a class="brand" href="${relative("/")}">59만모바일 <small>후불 알뜰폰 비교</small></a><nav>${nav}</nav><a class="header-cta" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">후불 상담</a></div></header><main class="container" id="main"><div class="crumb"><a href="${relative("/")}">홈</a>${s.path==="/"?"":" / "+E(s.term)}</div><section class="hero"><div class="owner"><img src="${relative("/assets/favicon.svg")}" alt="" width="70" height="70"><div><span class="eyebrow">${E(s.group)} · ${E(s.term)}</span><h1>${E(s.h1)}</h1><p>59만모바일 · 후불요금제 직접 비교 안내</p></div></div><img class="hero-image" src="${relative("/assets/"+image)}" width="1000" height="750" alt="${E(s.term)} 안내 이미지" decoding="async" fetchpriority="high"><div class="answer"><strong>먼저 답하면</strong><p>${E(s.answer)}</p></div><p class="date">후불요금제 조사: 2026년 9월 28일 · 혜택 조사: 2026년 10월 14일 · 현재 가입 조건은 재확인</p><div class="ctas"><a class="button" href="#plans">요금제 비교 바로가기 ↓</a><a class="button secondary" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">후불 가입 상담 ↗</a></div></section>${s.path==="/"?relatedBlock:""}<section class="segment"><h2>${E(s.term)}, 어떤 분에게 적합할까?</h2><p>${E(s.for)}</p><ul class="checks">${s.tips.map(t=>`<li>${E(t)}</li>`).join("")}</ul></section><section class="segment"><h2>${E(s.term)} 선택할 때 확인할 내용</h2>${snippets}</section><section class="segment" id="plans"><h2>${E(s.term)} 요금제 실제 비교</h2><p>${E(fact)}</p><div class="table-box"><table class="plan-table"><caption>월 기본료는 부가세 포함 · 자료 기준 2026년 9월 28일</caption><thead><tr><th>요금제·통화</th><th>월 기본료</th><th>데이터</th><th>혜택</th></tr></thead><tbody>${rows}</tbody></table></div><p class="notice">일부 K망 상품의 매월 데이터 10GB 추가(24개월)는 개통 시점과 대상 조건을 확인해야 합니다. 상품 혜택을 청구요금에서 임의로 빼지 않았습니다.</p><div class="ctas"><a class="button" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">공식 후불요금제 확인 ↗</a><a class="button secondary" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">59만모바일 상담 ↗</a></div></section>${bonus}${s.path==="/"? "":relatedBlock}<section class="segment" id="faq"><h2>${E(s.term)} 자주 묻는 질문</h2><div class="faq-list">${faq}</div></section><section class="closing"><h2>요금제와 가입 조건을 확인하세요</h2><p>후불은 가입자 명의, 회선 상태, 유심·단말 호환, 신청 시점에 따라 가입 가능 여부가 달라집니다. 요금과 혜택은 공식 화면에서 확인한 뒤 진행하세요.</p><div class="ctas"><a class="button" href="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx" target="_blank" rel="noopener noreferrer">요금제 확인 ↗</a><a class="button secondary" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">카카오톡 상담 ↗</a></div></section></main><footer class="footer"><div class="container"><b>59만모바일 · 도니통신</b><p>앤텔레콤 후불 알뜰폰 검색·비교 실험 사이트. 2026년 9월 상품자료 기준.</p></div></footer></body></html>`;
}
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const benefits=JSON.parse(fs.readFileSync("data/benefits-snapshot.json","utf8"));
if(specs.length!==19||new Set(specs.map(x=>x.path)).size!==19||plans.length!==47)throw Error("Invalid snapshot or specs");
for(const s of specs){const html=renderPage(s,specs,plans,benefits),dir="site"+s.path;fs.mkdirSync(dir,{recursive:true});if((html.match(/<h1\b/g)||[]).length!==1||!html.includes('rel="canonical" href="'+BASE_URL+s.path.replace(/^\/+/, "")+'"'))throw Error("SEO validation failed: "+s.path);fs.writeFileSync(path.join(dir,"index.html"),html);}
fs.writeFileSync("site/sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+specs.map(s=>'<url><loc>'+BASE_URL+s.path.replace(/^\/+/, "")+'</loc></url>').join("\n")+'\n</urlset>\n');
fs.writeFileSync("site/robots.txt","User-agent: *\nAllow: /\nSitemap: "+BASE_URL+"sitemap.xml\n");
fs.mkdirSync("docs",{recursive:true});fs.writeFileSync("docs/intent-map.json",JSON.stringify({researchLevel:"검색 의도 가설. 네이버 실제 검색량·순위·노출 URL은 확인되지 않음.",pages:specs.map(s=>({path:s.path,keyword:s.term,title:s.title,canonical:BASE_URL+s.path.replace(/^\/+/, ""),planCount:pick(s.mode,plans).count}))},null,2));
console.log("Generated 19 unique consumer-intent landing pages from 47 plans.");