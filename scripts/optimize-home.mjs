import fs from "node:fs";
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function optimizeHome(html,plans){
 const featured=[
 {id:"ntelecom-l-7gb",key:"light",url:"plans/l-7gb/",label:"상품 상세페이지 보기",reason:"집과 회사에서 와이파이를 많이 쓴다면 7GB부터 비교해 보세요.",numberKnown:false},
 {id:"ntelecom-k-15gb-millie",key:"medium",url:"data/15gb/",label:"15GB 상품 비교하기",reason:"밖에서 SNS나 영상을 종종 본다면 15GB를 살펴볼 만합니다.",numberKnown:true},
 {id:"ntelecom-k-100gb-millie",key:"heavy",url:"data/100gb/",label:"100GB 상품 비교하기",reason:"외부에서 동영상이나 데이터를 많이 쓴다면 100GB 상품을 살펴보세요.",numberKnown:true}
 ].map(x=>{const p=plans.find(p=>p.id===x.id);if(!p)throw Error("Missing featured "+x.id);return {...x,name:p.name.replace(/^앤텔레콤\s*/,""),price:p.monthly_price,gb:p.data_gb,network:p.network,after_speed:p.after_speed};});
 const first=featured[0];
 const start=html.indexOf('<div class="hero-offer">');
 const end=html.indexOf("\n </div></section>",start);
 if(start<0||end<0)throw Error("hero offer boundary not found");
 const panel=`<section class="quick-match" id="quick-match" aria-labelledby="match-question">
  <div class="match-heading"><p class="match-kicker">내 사용 방식으로 찾아보기</p><h2 id="match-question">밖에서 데이터를 어떻게 쓰세요?</h2><span>한 가지만 골라도 상품을 바로 볼 수 있어요.</span></div>
  <div class="match-choices" role="group" aria-label="모바일 데이터 사용 방식">
   <button type="button" class="match-choice" data-usage="light" aria-pressed="true"><strong>와이파이 위주</strong><small>메신저·지도·검색</small></button>
   <button type="button" class="match-choice" data-usage="medium" aria-pressed="false"><strong>SNS·영상 가끔</strong><small>7GB는 조금 부족</small></button>
   <button type="button" class="match-choice" data-usage="heavy" aria-pressed="false"><strong>외부 데이터 많이</strong><small>동영상·대용량 사용</small></button>
  </div>
  <div class="match-result" id="match-result" aria-live="polite">
   <span class="match-result-kicker">먼저 비교해 볼 상품</span>
   <div class="match-product-head"><strong id="match-plan-name">${esc(first.name)}</strong><span id="match-network">${first.network==="K"?"KT망":"LG U+망"}</span></div>
   <div class="match-product-price"><small>월 기본료 · 조사 기준</small><b id="match-price">${Number(first.price).toLocaleString("ko-KR")}원</b></div>
   <div class="match-data"><span id="match-data">${first.gb}GB</span><span id="match-speed">소진 후 최대 ${esc(first.after_speed)}</span></div>
   <p id="match-reason">${esc(first.reason)}</p>
   <a href="${first.url}" id="match-link" data-cta="match-product" data-plan="${esc(first.id)}">${first.label}<span aria-hidden="true">→</span></a>
  </div>
  <fieldset class="match-join"><legend>번호를 유지할 예정인가요? <small>(선택)</small></legend>
    <div class="match-join-options"><label><input type="radio" name="quick-join" value="unsure" checked> 아직 미정</label><label><input type="radio" name="quick-join" value="port"> 번호이동</label><label><input type="radio" name="quick-join" value="new"> 신규가입</label></div>
  </fieldset>
  <p class="match-note" id="match-note">판매가격·상품 제공조건·가입 가능 여부는 공식 페이지에서 확인해 주세요.</p>
 </section>`;
 html=html.slice(0,start)+panel+html.slice(end);
 html=html.replace('href="#situations" data-cta="hero-situation"','href="#quick-match" data-cta="hero-quick-match"');
 html=html.replace('내 상황에 맞는 요금제 찾기','지금 요금제 골라보기');
 html=html.replace('<h1>휴대폰은 그대로.<br><em>통신비는 내 사용량에 맞게.</em></h1>','<h1>통신비를 줄이고 싶다면,<br><em>내가 쓰는 데이터부터.</em></h1>');
 html=html.replace('집에서는 와이파이를 쓰고, 밖에서는 데이터를 얼마나 사용하시나요? 지금 쓰는 방식에 맞춰 요금제부터 비교해 보세요.','와이파이를 주로 쓰는지, 밖에서 데이터가 많이 필요한지. 몇 번만 눌러보고 비교할 요금제를 찾아보세요.');
 html=html.replace('<link rel="stylesheet" href="assets/home.css?v=20261028-story1">','<link rel="stylesheet" href="assets/home.css?v=20261028-match2">');
 html=html.replace('<script src="assets/home.js?v=20261028-story1" defer></script>','<script id="quick-match-data" type="application/json">'+JSON.stringify(featured).replace(/</g,"\\u003c")+'</script><script src="assets/home.js?v=20261028-match2" defer></script>');
 if(!html.includes('id="quick-match-data"')||!html.includes('id="match-link"'))throw Error("Not enough new match markup");
 return html;
}
const file="site/index.html";
fs.writeFileSync(file,optimizeHome(fs.readFileSync(file,"utf8"),plans),"utf8");
console.log("Above-fold, one-click choice flow installed on storefront homepage.");