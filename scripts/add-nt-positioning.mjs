import fs from "node:fs";
import path from "node:path";
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const seed=[{"id":"ntelecom-l-7gb","label":"요금부터 줄이고 싶다면","hook":"한 달 17,900원부터","detail":"7GB · 소진 후 최대 1Mbps · 일반통화·문자 기본제공","note":"기본료가 보관 자료상 0원 프로모션이 아닌 상품입니다. 장래 요금 동일 유지는 보장하지 않습니다.","cta":"L망 7GB 상세보기","url":"/plans/l-7gb/"},{"id":"ntelecom-k-7gb-millie","label":"데이터와 독서를 함께 쓴다면","hook":"7GB에 조건부 +10GB","detail":"7GB+1Mbps · 밀리의서재 구독권 · 2026년 추가 데이터 행사","note":"매월 10GB 추가는 대상 요금제·가입 시점·유지 조건을 충족할 때 24개월 제공 안내입니다. 실제 적용 여부를 확인하세요.","cta":"K망 밀리 상품 확인","url":"/data/7gb/?plan=ntelecom-k-7gb-millie"},{"id":"ntelecom-k-7gb-naverpay","label":"네이버페이를 자주 쓴다면","hook":"별도 5,000P 쿠폰 조건","detail":"7GB+1Mbps · 조건 충족 시 네이버페이 5,000P 쿠폰","note":"월 기본료에서 5,000원을 차감하는 혜택이 아닙니다. 30일 사용·31일차 유지 등 조건과 최신 진행 여부를 확인하세요.","cta":"K망 네이버페이 상품 확인","url":"/benefits/naverpay/?plan=ntelecom-k-7gb-naverpay"}];
const variants={"budget":{"label":"1만원대만 찾기 전에","heading":"앤텔레콤에는 가격형과 혜택형 선택지가 있습니다.","copy":"월 기본료를 낮추는 L망 7GB와, 추가 데이터·제휴 혜택을 함께 보는 K망 상품의 선택 이유가 다릅니다.","selected":["ntelecom-l-7gb","ntelecom-k-7gb-millie"]},"port":{"label":"번호를 그대로 바꾸고 싶다면","heading":"번호 유지, 데이터, 가입 조건을 한 번에 확인하세요.","copy":"앤텔레콤은 KT망·LG U+망 요금제를 선택할 수 있습니다. 번호이동은 미납·정지·최근 이동 이력과 단말 호환 여부를 먼저 확인한 뒤 접수해야 합니다.","selected":["ntelecom-k-7gb-millie","ntelecom-l-7gb"]},"unlimited":{"label":"무제한이라는 말보다","heading":"기본 데이터가 몇 GB인지가 구매 이유입니다.","copy":"저용량 0원 행사 대신 큰 데이터를 원한다면, 앤텔레콤의 K망 100GB+와 K망 제휴형 추가 데이터 조건을 비교해 보세요.","selected":["ntelecom-k-7gb-millie","ntelecom-l-7gb"]},"naverpay":{"label":"혜택을 실제로 쓰는 사람에게","heading":"네이버페이 쿠폰이 필요할 때 선택할 이유가 생깁니다.","copy":"K망 네이버페이형은 기본료를 할인하는 상품이 아니라 조건부 쿠폰을 별도로 주는 상품입니다. 포인트를 활용하지 않는다면 다른 유형이 더 나을 수 있습니다.","selected":["ntelecom-k-7gb-naverpay","ntelecom-k-7gb-millie"]}};
function E(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function money(n){return Number(n).toLocaleString("ko-KR")+"원"}
function relative(path,to){return "../".repeat(path.split("/").filter(Boolean).length)+to.replace(/^\/+/,"")}
function renderBrand(p,variant,path){
 const isZero=variant==="zero",conf=variants[variant],ids=isZero?seed.map(x=>x.id):conf.selected;
 const content=isZero?{label:"0원 이후에도 따져볼 이유",heading:"그렇다면 왜 앤텔레콤을 선택할까요?",copy:"0원에 가입할 수 있어서가 아닙니다. 필요한 데이터·통화량에 맞는 기본료와 평소 사용하는 제휴 혜택을 함께 고를 수 있기 때문입니다. 내 사용 방식에 맞지 않는다면 다른 통신사 상품이 더 유리할 수 있습니다."}:conf;
 const cards=ids.map(id=>{
  const s=seed.find(x=>x.id===id),plan=p.find(x=>x.id===id);
  if(!plan||!s)throw Error("Missing brand plan "+id);
  const href=relative(path,s.url);
  return `<article class="nt-offer" data-plan-id="${E(plan.id)}">
    <p class="nt-reason">${E(s.label)}</p>
    <h3>${E(s.hook)}</h3>
    <p class="nt-plan-name">${E(plan.name.replace(/^앤텔레콤\s*/,""))}</p>
    <div class="nt-price"><strong>월 ${money(plan.monthly_price)}</strong><span>2026년 9월 조사</span></div>
    <p class="nt-spec">${E(s.detail)}</p>
    <p class="nt-caution">${E(s.note)}</p>
    <a href="${href}" data-nt-cta="${variant}" data-nt-plan="${E(plan.id)}">${E(s.cta)} <span aria-hidden="true">→</span></a>
   </article>`;
 }).join("");
 let addition="";
 if(variant==="unlimited"){
  const plan=p.find(x=>x.id==="ntelecom-k-100gb-millie");if(!plan)throw Error("100GB missing");
  addition=`<div class="nt-special"><strong>대용량 이용자에게는 K망 100GB+도 있습니다.</strong><span>월 ${money(plan.monthly_price)} · 100GB · 소진 후 최대 ${E(plan.after_speed)} · 밀리의서재 제휴 조건</span><a href="${relative(path,"/data/100gb/?plan=ntelecom-k-100gb-millie")}" data-nt-cta="unlimited-100gb" data-nt-plan="${E(plan.id)}">100GB 상품 살펴보기 →</a></div>`;
 }
 return `<section class="nt-why ${isZero?"nt-zero":""}" id="why-ntelecom" aria-labelledby="why-ntelecom-title">
  <div class="nt-heading"><p class="nt-eyebrow">${E(content.label)}</p><h2 id="why-ntelecom-title">${E(content.heading)}</h2>
   <p>${E(content.copy)}</p></div>
  <div class="nt-offer-grid">${cards}</div>${addition}
  <div class="nt-helper"><div><strong>내 상황에 맞는 조건이 헷갈린다면</strong><p>59만모바일에서 상품·유심·신규가입·번호이동 준비사항을 안내합니다. 가입 승인이나 특정 혜택 적용은 보장하지 않습니다.</p></div>
  <a href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer" data-nt-cta="consult">59만모바일 상담하기 →</a></div>
  <p class="nt-source">상품 기본료·데이터는 앤텔레콤 2026년 9월 보관 자료, 제휴 혜택은 2026년 10월 자료 기준입니다. K망 추가 데이터는 2026년 행사 안내에 근거하며 실제 가입시점 적용 여부를 확인해야 합니다. <a href="https://www.nteleshop.com/plans/kt-postpaid" target="_blank" rel="noopener noreferrer">K망 프로모션·상품 안내 확인</a></p>
  </section>`;
}
function addPositioning(html,variant,path,plans){
 if(html.includes('id="why-ntelecom"'))throw Error("Duplicate brand section at "+path);
 if(variant==="zero"){
  const target='<section class="wrap section" id="ad-types">';
  if(!html.includes(target))throw Error("Zero insertion target missing");
  html=html.replace(target,renderBrand(plans,variant,path)+target);
  const old='<a class="outline" href="#ad-types" data-zero-cta="hero-explain">0원 광고 유형 보기</a>';
  if(!html.includes(old))throw Error("Zero top CTA missing");
  html=html.replace(old,'<a class="outline" href="#why-ntelecom" data-zero-cta="hero-why">왜 앤텔레콤일까요?</a>');
  const line='이 사이트는 월 기본료 0원 상품을 판매하지 않습니다. 0원 광고 조건을 살펴본 뒤 실제 가입 상품을 비교하는 페이지입니다.';
  if(!html.includes(line))throw Error("Zero hero line missing");
  html=html.replace(line,'앤텔레콤의 L망 7GB+는 월 17,900원, K망 7GB+ 밀리의서재형은 월 19,500원(조사 기준)입니다. 월 기본료 0원 상품을 판매하지 않습니다. 대신 데이터·혜택과 실청구요금을 비교할 수 있습니다.');
  return html;
 }
 const target='<section class="exp-story"';
 if(!html.includes(target))throw Error("Experiment insertion target missing "+path);
 return html.replace(target,renderBrand(plans,variant,path)+target);
}
const pages=[["zero","/price/zero-won/"],["budget","/price/under-20000/"],["port","/number-transfer/"],["unlimited","/unlimited/"],["naverpay","/benefits/naverpay/"]];
for(const [kind,slug] of pages){const file=path.join("site",slug,"index.html");fs.writeFileSync(file,addPositioning(fs.readFileSync(file,"utf8"),kind,slug,plans),"utf8");}
console.log("Added audience-specific why-Ntelecom value proposition to five conversion landing pages.");