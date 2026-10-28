import fs from "node:fs";
import path from "node:path";
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const configs=[{"id":"budget","path":"/price/under-20000/","theme":"saving","keyword":"알뜰폰 1만원대","product":"ntelecom-l-7gb","eyebrow":"월 2만원 미만 알뜰폰 요금제","heading":"통신비는 줄이고 싶은데,<br>7GB로 충분할지 고민된다면","lead":"매달 데이터가 남는다면 쓰는 양부터 확인해 보세요. 1만원대 상품도 기본 데이터와 소진 후 속도를 확인하면 선택이 쉬워집니다.","hook":"지금 내는 통신비와 월 기본료를 직접 비교","summary":"집·회사에서 와이파이를 자주 이용하고 외부에서는 메신저·지도 중심이라면 먼저 비교해 볼 만합니다.","ribbon":"가격 때문에 찾아온 분에게","button":"17,900원 상품 가입 조건 확인","secondary":"1만원대 상품 더 비교","above":"2026년 9월 조사 기준 · 카드 할인 전 월 기본료","points":[["01","요금을 얼마나 내고 있나요?","통신비 절약의 출발점은 광고 문구보다 실제 내고 있는 금액입니다."],["02","매달 데이터가 남나요?","남는 데이터가 많으면 7GB 상품부터 살펴볼 수 있습니다. 영상·테더링이 잦다면 부족할 수 있습니다."],["03","가격보다 조건을 마지막에 확인","통화 제공, 소진 후 속도, 유심·가입 가능 여부를 확인하고 신청하세요."]],"asideTitle":"7GB가 안 맞는 경우도 있습니다","aside":"밖에서 고화질 영상을 오래 보거나 모바일 핫스팟을 자주 사용한다면 더 큰 상품을 비교하세요."},{"id":"port","path":"/number-transfer/","theme":"trust","keyword":"알뜰폰 번호이동","product":"ntelecom-k-15gb-millie","eyebrow":"쓰던 번호 그대로 알뜰폰","heading":"번호는 그대로 두고,<br>요금제만 바꾸고 싶다면","lead":"새 번호가 필요하지 않다면 신규가입이 아니라 번호이동입니다. 지금 쓰는 번호를 유지할 수 있는지 먼저 확인한 다음 요금제를 고르세요.","hook":"개통하기 전에 확인할 조건을 먼저 정리","summary":"기존 번호를 유지하면서 K망 15GB 상품을 살펴보는 예시입니다. 자료상 번호이동 가능 표시가 있어도 실제 접수·심사는 별개입니다.","ribbon":"번호이동이 걱정되는 분에게","button":"이 상품으로 번호이동 조건 확인","secondary":"번호이동 전 확인할 사항","above":"2026년 9월 조사 기본료 · 실제 접수 가능 여부 공식 확인","points":[["01","기존 번호를 먼저 해지하지 마세요","번호이동이 정상 완료되면 기존 번호를 유지할 수 있습니다. 직접 해지하면 번호이동이 어려워질 수 있습니다."],["02","미납·정지와 최근 이동 이력 확인","미납이나 최근 번호이동 이력에 따라 제한될 수 있습니다. 예외나 세부 조건은 공식 접수 과정에서 확인합니다."],["03","유심과 휴대폰 호환 확인","쓰던 휴대폰을 계속 쓰고 싶다면 선택 통신망과 단말·유심 호환 조건을 확인하세요."]],"asideTitle":"지금 번호를 꼭 유지해야 하나요?","aside":"번호를 유지하는 것이 목적이라면 '번호이동'을 선택하세요. 새로운 회선을 추가하려면 '신규가입'입니다."},{"id":"unlimited","path":"/unlimited/","theme":"speed","keyword":"알뜰폰 데이터 무제한","product":"ntelecom-k-100gb-millie","eyebrow":"데이터 무제한 요금제 고르는 법","heading":"무제한이라고 다 같지는 않아요.<br>소진 후 속도가 중요합니다.","lead":"데이터 사용량이 많다면 기본 제공량뿐 아니라 다 쓴 뒤 최대 1·3·5Mbps 중 어떤 속도로 이용하는지 확인하세요.","hook":"1Mbps · 3Mbps · 5Mbps 요금제를 비교","summary":"집 밖에서 동영상이나 데이터를 많이 사용한다면 100GB형과 소진 후 최대 5Mbps 상품을 우선 비교할 만합니다.","ribbon":"데이터가 부족한 분에게","button":"100GB 상품 가입 조건 확인","secondary":"속도별 차이 먼저 확인","above":"2026년 9월 조사 기본료 · 소진 후 속도제어형","points":[["01","기본 데이터부터 확인","기본 7GB·15GB·100GB처럼 고속 데이터 제공량이 다릅니다."],["02","다 쓴 뒤 속도까지 확인","표시된 최대 속도는 보장 속도가 아니며 실제 이용 환경에 따라 달라집니다."],["03","통화·테더링 제한도 확인","특히 일부 15GB 상품은 통화 100분·300분 유형입니다. '무제한'이라는 말만 보고 결정하지 마세요."]],"asideTitle":"속도는 숫자가 클수록 좋지만","aside":"1Mbps·3Mbps·5Mbps는 기본 데이터 소진 후의 최대 속도입니다. 영상 품질, 혼잡도, 기기와 통신망 환경에 따라 이용 경험이 달라집니다."},{"id":"naverpay","path":"/benefits/naverpay/","theme":"benefit","keyword":"네이버페이 알뜰폰","product":"ntelecom-k-7gb-naverpay","eyebrow":"알뜰폰 네이버페이 혜택 비교","heading":"네이버페이 혜택이 있다면,<br>언제 어떻게 받는지도 봐야죠.","lead":"네이버페이형 요금제를 비교한다면 월 기본료와 포인트 쿠폰 지급 조건을 따로 보세요. 포인트가 통신요금에서 자동 차감되는 것은 아닙니다.","hook":"월 기본료 21,100원 · 별도 포인트 쿠폰 조건","summary":"K망 7GB+(네이버페이) 상품의 조사 기본료와 혜택 조건을 함께 확인해 보세요.","ribbon":"제휴혜택을 따져보는 분에게","button":"네이버페이형 가입 조건 확인","secondary":"포인트 지급 조건 먼저 보기","above":"2026년 9~10월 조사 · 현재 혜택 진행 여부 공식 확인","points":[["01","월 기본료는 21,100원","5,000P를 요금에서 미리 차감해 16,100원이라고 표시하지 않습니다."],["02","사용일수 30일과 31일차 유지","2026년 10월 자료상 가입·변경 후 30일 사용하고 31일차까지 해당 요금제를 유지해야 합니다."],["03","MMS 발송·등록기한 확인","쿠폰은 기프티쇼 MMS로 제공되며 발행 후 30일 이내 등록·사용 조건이 있습니다. 최신 행사 진행 여부를 확인하세요."]],"asideTitle":"포인트가 필요하지 않다면?","aside":"쿠폰을 자주 사용하지 않는다면 같은 데이터 조건의 일반 요금제와 월 기본료 차이를 비교하는 편이 좋습니다."}];
function E(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function won(x){return Number(x).toLocaleString("ko-KR")+"원"}
function relative(from,to){return "../".repeat(from.split("/").filter(Boolean).length)+to.replace(/^\/+/,"")}
function makeLanding(config,plan,priceInfo,allPlans){
 const p=plan,rel=path=>relative(config.path,path);
 const headingText=config.heading.replace(/<br>/g," ");
 const network=p.network==="K"?"KT망":"LG U+망";
 const summary=`${p.data_gb}GB${p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":""} · 소진 후 최대 ${p.after_speed}`;
 const faqTarget="#faq",gridTarget="#plans";
 const footNote=config.id==="naverpay"?'<span class="exp-extra">5,000P는 별도 지급 조건에 따른 쿠폰입니다. 기본료에서 차감되지 않습니다.</span>':config.id==="port"?'<span class="exp-extra">자료상 번호이동 가능 · 실제 승인·접수는 별도 확인</span>':config.id==="unlimited"?'<span class="exp-extra">소진 후 최대 5Mbps · 기본 고속 데이터 100GB</span>':'<span class="exp-extra">월 17,900원은 카드 할인 전 조사 기본료</span>';
 const card=`<aside class="exp-offer" aria-label="비교할 요금제">
 <p class="exp-card-kicker">${E(config.ribbon)}</p>
 <div class="exp-offer-head"><span>${network}</span><b>${E(p.name.replace(/^앤텔레콤\s*/,""))}</b></div>
 <div class="exp-plan-price"><small>월 기본료</small><strong>${won(p.monthly_price)}</strong></div>
 <p class="exp-plan-data">${E(summary)}</p>
 <p class="exp-plan-call">일반통화: ${E(p.calls)} · 문자: ${E(p.sms)}</p>
 ${footNote}
 <a class="exp-primary" href="${gridTarget}" data-action="choose-plan" data-landing-cta="primary" data-plan="${E(p.id)}">${E(config.button)} <span aria-hidden="true">→</span></a>
 <p class="exp-fine">${E(config.above)}. 상품명·가격은 공식 화면에서 다시 확인합니다.</p>
 </aside>`;
 const hero=`<section class="conversion-hero experiment-${config.id}" id="exp-top" data-landing="${config.id}">
 <div class="exp-left">
 <p class="exp-kicker">${E(config.eyebrow)}</p>
 <h1>${config.heading}</h1>
 <p class="exp-lead">${E(config.lead)}</p>
 <div class="exp-trust"><span>가격과 조건을 함께 비교</span><span>신규가입·번호이동 구분</span><span>공식 신청 안내</span></div>
 <a class="exp-underlink" href="#exp-solve" data-landing-cta="guide">${E(config.secondary)} <span aria-hidden="true">↓</span></a>
 </div>${card}
 </section>`;
 const intro=`<section class="exp-story" id="exp-solve">
 <div class="exp-section-label">고르기 전에 이것만 확인하세요</div>
 <h2>${E(config.hook)}</h2>
 <p class="exp-story-intro">${E(config.summary)}</p>
 <div class="exp-steps">${config.points.map(([num,title,copy])=>`<article><span>${num}</span><h3>${E(title)}</h3><p>${E(copy)}</p></article>`).join("")}</div>
 </section>`;
 const baseAction=`<a href="#plans" data-action="choose-plan" data-landing-cta="secondary" data-plan="${E(p.id)}">선택한 상품 가입 안내 열기 <span aria-hidden="true">→</span></a>`;
 let feature="";
 if(config.id==="budget"){
  feature=`<div class="exp-feature exp-budget" id="exp-budget">
   <div><span class="exp-feature-tag">나의 통신비 비교</span><h2>지금 월 요금을 넣어 보세요.</h2><p>조사된 7GB+ 월 기본료와 금액 차이만 비교합니다. 실제 절약액은 현재 할인·사용량·가입 조건에 따라 달라집니다.</p></div>
   <div class="exp-feature-body"><label for="exp-bill">현재 월 통신요금</label><div class="exp-money-input"><input id="exp-bill" inputmode="numeric" type="number" min="0" max="200000" step="1000" value="50000"><span>원</span></div>
   <small>비교 대상: ${won(p.monthly_price)} (2026년 9월 기준)</small>
   <strong id="exp-diff" aria-live="polite">32,100원 차이</strong><small id="exp-year-diff">12개월 단순 비교 시 385,200원 차이</small>
   ${baseAction}</div>
  </div>`;
 }else if(config.id==="port"){
  feature=`<div class="exp-feature exp-port" id="exp-port">
    <div><span class="exp-feature-tag">번호이동 전 간단 점검</span><h2>번호를 유지하려면 무엇을 확인해야 할까요?</h2><p>아래 항목은 스스로 확인하는 안내입니다. 결과가 실제 접수 가능이나 승인을 보장하지는 않습니다.</p></div>
    <div class="exp-feature-body"><fieldset class="exp-checks"><legend>확인한 항목을 선택하세요</legend>
     <label><input type="checkbox" data-port-check> 기존 번호를 유지하려는 목적을 확인했어요.</label>
     <label><input type="checkbox" data-port-check> 현재 회선 미납·정지 여부를 확인했어요.</label>
     <label><input type="checkbox" data-port-check> 최근 번호이동 이력·휴대폰/유심 호환을 확인했어요.</label>
    </fieldset><p id="exp-check-note" role="status">확인 전입니다. 번호이동 신청 가능 여부는 공식 화면에서 결정됩니다.</p>
    ${baseAction}</div>
  </div>`;
 }else if(config.id==="unlimited"){
  const options=[
   {id:"ntelecom-l-7gb",speed:"1Mbps",why:"와이파이 위주 · 기본 7GB",label:"7GB"},
   {id:"ntelecom-l-100min-15gb",speed:"3Mbps",why:"데이터 15GB · 일반통화 100분",label:"15GB"},
   {id:"ntelecom-k-100gb-millie",speed:"5Mbps",why:"외부 데이터 많이 · 기본 100GB",label:"100GB"}
  ].map(x=>{const a=allPlans.find(z=>z.id===x.id);if(!a)throw Error("unlimited option missing "+x.id);return {...x,price:a.monthly_price,name:a.name.replace(/^앤텔레콤\s*/,"")};});
  feature=`<div class="exp-feature exp-speed" id="exp-speed">
   <div><span class="exp-feature-tag">데이터형 상품 선택</span><h2>기본 데이터와 소진 후 속도를 함께 보세요.</h2><p>아래 3개는 사용 방식이 다른 비교 예시입니다. 특히 15GB 상품은 통화량이 제한됩니다.</p></div>
   <div class="exp-feature-body"><div class="exp-speed-options">${options.map(x=>`<button type="button" class="exp-speed-choice" data-speed-pick="${E(x.speed)}" data-plan="${E(x.id)}" data-name="${E(x.name)}" data-price="${x.price}" aria-pressed="${x.speed==="5Mbps"?"true":"false"}"><b>${x.label}</b><strong>최대 ${x.speed}</strong><small>${E(x.why)}</small><em>월 ${won(x.price)}</em></button>`).join("")}</div>
    <p class="exp-selected" id="exp-speed-caption">현재 비교: K망 100GB+ · 월 43,200원 · 소진 후 최대 5Mbps</p>
    <a class="exp-option-cta" id="exp-speed-cta" href="#plans" data-action="choose-plan" data-landing-cta="speed-selection" data-plan="${E(p.id)}">고른 상품 가입 조건 확인 <span aria-hidden="true">→</span></a>
   </div>
  </div>`;
 }else{
  feature=`<div class="exp-feature exp-benefit" id="exp-benefit">
   <div><span class="exp-feature-tag">네이버페이 5,000P 쿠폰</span><h2>월 요금 할인과<br>포인트 쿠폰은 다릅니다.</h2><p>월 기본료는 ${won(p.monthly_price)}입니다. 혜택은 보관 자료상 매월 5,000P 쿠폰으로, 지급·유지 조건이 있습니다.</p></div>
   <div class="exp-feature-body"><ol class="exp-benefit-steps"><li><b>30일 사용</b><small>가입·변경 후 사용일수 30일 충족</small></li><li><b>31일차까지 유지</b><small>동일 네이버페이형 요금제 유지</small></li><li><b>MMS 쿠폰 확인</b><small>기프티쇼 발송 · 발행 후 30일 내 등록·사용</small></li></ol>
    <p class="exp-risk">혜택은 2026년 10월 14일 자료 기준입니다. 지금도 같은 혜택이 진행되는지 반드시 공식 페이지에서 확인해 주세요.</p>
    ${baseAction}</div></div>`;
 }
 const exitSection=`<section class="exp-exit" aria-label="가입 전 안내"><div><p class="exp-section-label">결정하기 전에</p><h2>${E(config.asideTitle)}</h2><p>${E(config.aside)}</p></div><a href="${faqTarget}" data-landing-cta="faq">자주 묻는 질문 보기 <span aria-hidden="true">→</span></a></section>`;
 return {hero,below:intro+feature+exitSection};
}
function update(html,config,plans){
 const p=plans.find(x=>x.id===config.product);if(!p)throw Error("Plan missing "+config.product);
 const layout=makeLanding(config,p,{},plans);
 const introRegex=/<section class="page-intro [^"]*">[\s\S]*?<\/section>/;
 if(!introRegex.test(html))throw Error("intro marker missing "+config.path);
 html=html.replace(introRegex,layout.hero);
 const navRx=/(<nav class="tag-nav"[\s\S]*?<\/nav>)/;
 if(!navRx.test(html))throw Error("tags missing "+config.path);
 html=html.replace(navRx,`$1\n${layout.below}`);
 html=html.replace(/(<link rel="stylesheet" href="[^"]*catalog\.css\?v=[^"]+")/,`$1`); // preserve catalog styling
 html=html.replace("</head>",`<link rel="stylesheet" href="${relative(config.path,"/assets/experiment-landings.css")}?v=20261028-1"></head>`);
 html=html.replace("</body>",`<script src="${relative(config.path,"/assets/experiment-landings.js")}?v=20261028-1" defer></script></body>`);
 html=html.replace('<body data-mode=',`<body data-landing="${config.id}" data-mode=`);
 // Promote the intended first-plan CTA on mobile while keeping the catalog dialog.
 html=html.replace(/(<a href="#plans" id="mobile-selected")([^>]*>)([\s\S]*?)(<\/a>)/,`$1 data-action="choose-plan" data-landing-cta="mobile" data-plan="${E(config.product)}"$2선택 상품 가입 조건 확인$4`);
 if(!html.includes('data-landing="')||!html.includes('id="exp-solve"'))throw Error("incomplete experiment");
 return html;
}
for(const config of configs){const filepath=path.join("site",config.path,"index.html");fs.writeFileSync(filepath,update(fs.readFileSync(filepath,"utf8"),config,plans),"utf8");}
console.log("Four distinct conversion landing experiments built: "+configs.map(x=>x.id).join(", "));