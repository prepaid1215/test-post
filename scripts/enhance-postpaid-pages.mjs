import fs from "node:fs";
import path from "node:path";
const SOURCE=JSON.parse(fs.readFileSync("data/consumer-enrichment.json","utf8"));
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const plans=JSON.parse(fs.readFileSync("data/plans-snapshot.json","utf8"));
const benefits=JSON.parse(fs.readFileSync("data/benefits-snapshot.json","utf8"));
function esc(x){return String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function rel(from,to){return "../".repeat(from.split("/").filter(Boolean).length)+to.replace(/^\/+/,"")}
function sectionExtra(spec,item){
 const bits=item.groups.map((g,i)=>"<article class=\"expanded-guide\"><h3>"+esc(g.title)+"</h3>"+g.paragraphs.map(p=>"<p>"+esc(p)+"</p>").join("")+(g.links?.length?"<nav class=\"context-links\" aria-label=\"관련 후불 안내\">"+g.links.map(l=>"<a href=\""+rel(spec.path,l.path)+"\">"+esc(l.label)+" →</a>").join("")+"</nav>":"")+"</article>").join("");
 return "<section class=\"segment expanded-content\" id=\"consumer-guide\"><h2>"+esc(item.headline)+"</h2><p class=\"expanded-intro\">"+esc(item.intro)+"</p>"+bits+"</section>";
}
function finderMarkup(){
 return `<section class="segment finder-section" id="postpaid-finder" aria-labelledby="postpaid-finder-title">
 <div class="finder-heading"><div><p class="eyebrow">59만모바일 후불요금제 탐색</p><h2 id="postpaid-finder-title">내 조건으로 알뜰폰 요금제 찾기</h2><p>월 예산과 데이터·통화 사용량을 골라 보관된 상품 중 조건에 맞는 후보를 비교하세요.</p></div></div>
 <form id="postpaid-finder-form" class="finder-form">
 <label>월 기본료 예산<select name="budget" required><option value="19999">2만원 미만</option><option value="29999" selected>3만원 미만</option><option value="39999">4만원 미만</option><option value="999999">가격 상관없음</option></select></label>
 <label>기본 데이터 사용량<select name="data" required><option value="0">용량 상관없음</option><option value="7" selected>7GB 이상</option><option value="10">10GB 이상</option><option value="15">15GB 이상</option><option value="50">50GB 이상</option></select></label>
 <label>통화 방식<select name="calls"><option value="any">제한형 포함 비교</option><option value="basic" selected>일반통화 기본제공</option></select></label>
 <label>통신망<select name="network"><option value="any">K망·L망 모두</option><option value="K">K망 (KT)</option><option value="L">L망 (LG U+)</option></select></label>
 <label>가입 방법<select name="join"><option value="port">기존 번호 유지(번호이동)</option><option value="new">신규가입</option><option value="unsure">아직 정하지 않음</option></select></label>
 <button type="submit" class="button finder-submit">조건에 맞는 요금제 3개 찾기</button>
 </form>
 <p class="finder-policy">이는 요금제 비교 도구이며 가입 가능 여부를 판정하는 심사가 아닙니다. 월 요금은 2026년 9월 조사값으로 현재 판매 조건과 다를 수 있습니다.</p>
 <div class="finder-output" id="postpaid-finder-results" aria-live="polite" aria-atomic="true"><p class="finder-placeholder">조건을 선택하고 ‘요금제 3개 찾기’를 누르세요.</p></div>
 </section>`;
}
const allowed=new Set(specs.map(s=>s.path));
let count=0;
for(const spec of specs){
 const addon=SOURCE.pages[spec.path];if(!addon)continue;
 for(const group of addon.groups)for(const l of group.links||[])if(!allowed.has(l.path))throw Error("Broken plan guide link: "+l.path);
 const file=path.join("site",spec.path,"index.html");
 let html=fs.readFileSync(file,"utf8");
 const marker='<section class="segment"><h2>'+esc(spec.term)+', 어떤 분에게 적합할까?</h2>';
 if(!html.includes(marker))throw Error("Missing insertion marker: "+spec.path);
 const content=sectionExtra(spec,addon);
 let injected=spec.path==="/"?finderMarkup()+content:content;
 html=html.replace(marker,injected+marker);
 const stylesheet='<link rel="stylesheet" href="'+rel(spec.path,"/assets/postpaid-enhancements.css")+'">';
 if(!html.includes("</head>"))throw Error("Missing head "+spec.path);
 html=html.replace("</head>",stylesheet+"</head>");
 if(spec.path==="/"){
  const json=JSON.stringify({plans:plans.map(p=>({id:p.id,name:p.name,network:p.network,monthly_price:p.monthly_price,data_gb:p.data_gb,daily_data_gb:p.daily_data_gb,after_speed:p.after_speed,calls:p.calls,benefit_ids:p.benefit_ids,new_available:p.new_available,port_available:p.port_available})),benefits:benefits.map(b=>({id:b.id,name:b.name}))}).replace(/</g,"\\u003c");
  html=html.replace("</body>",'<script type="application/json" id="postpaid-finder-data">'+json+'</script><script defer src="'+rel(spec.path,"/assets/postpaid-finder.js")+'"></script></body>');
 }
 fs.writeFileSync(file,html);
 count++;
}
if(count!==19)throw Error("Expected 19 pages, generated "+count);
console.log("Enhanced "+count+" priority postpaid pages; added the homepage plan finder.");
