
import fs from "node:fs";
import path from "node:path";
const root="https://prepaid1215.github.io/test-post/";
const groups=[
 {title:"생활 제휴 혜택",intro:"평소 쓰는 서비스를 통신요금제에서도 챙기세요.",entries:[
  ["partner-card","제휴카드 할인","카드 실적·연회비까지 실제 할인 계산"],
  ["coupang-cash","쿠팡캐시 요금제","쿠팡·쿠팡이츠를 쓰는 분께"],
  ["naverpay","네이버페이 요금제","5,000P 쿠폰 조건 확인"],
  ["oliveyoung","올리브영 요금제","모바일상품권 혜택 비교"],
  ["cu","CU 편의점 요금제","결제액 20% 할인 가능액 계산"]
 ]},
 {title:"부업·업무용 추가 회선",intro:"기존 개인용 번호는 유지하고 업무용 회선을 추가하세요.",entries:[
  ["work-phone","배달·퀵·대리 업무폰 통합 비교","새 디자인에서 요금제 3종 바로 선택"],
  ["delivery-rider","배달 라이더 업무폰","배차 앱과 지도용 데이터 선택"],
  ["quick-service","퀵서비스 업무폰","콜 접수·내비용 추가 회선"],
  ["designated-driver","대리운전 업무폰","호출 앱·업무 연락 분리"]
 ]}
];
const homepage="site/index.html",sitemapFile="site/sitemap.xml";
let html=fs.readFileSync(homepage,"utf8"),sitemap=fs.readFileSync(sitemapFile,"utf8");
if(!html.includes('id="switch-campaigns"'))throw Error("Four prior audience landings not registered");
if(!html.includes('id="segment-campaigns"')){
 const parts=groups.map(g=>{
  const cards=g.entries.map(([slug,name,desc])=>'<a class="segment-entry" href="switch/'+slug+'/"><strong>'+name+'</strong><span>'+desc+'</span><b>요금제 살펴보기 →</b></a>').join("");
  return '<div class="segment-group"><h3>'+g.title+'</h3><p>'+g.intro+'</p><div class="segment-entries">'+cards+'</div></div>';
 }).join("");
 const section='<section class="segment-campaigns" id="segment-campaigns"><div class="segment-campaigns-inner"><p class="segment-label">생활 혜택과 업무용 번호</p><h2>통신비를 바꾸는 이유, 사람마다 다릅니다.</h2>'+parts+'</div></section>';
 const css='<style id="segment-home-style">.segment-campaigns{background:#fff;padding:76px 20px;color:#172e50}.segment-campaigns-inner{max-width:1100px;margin:0 auto}.segment-campaigns .segment-label{color:#386bc3;font-size:.84rem;font-weight:800}.segment-campaigns h2{font-size:clamp(1.5rem,3vw,2.2rem);letter-spacing:-.04em;line-height:1.35;margin:9px 0 35px}.segment-group{margin:28px 0 39px}.segment-group h3{font-size:1.3rem;margin:0 0 6px}.segment-group>p{font-size:.9rem;color:#69819e;margin:0 0 17px}.segment-entries{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}.segment-entry{display:flex;flex-direction:column;gap:7px;text-decoration:none;background:#f3f7fd;border:1px solid #e1eafb;border-radius:14px;padding:18px;color:#1e3658;min-height:135px}.segment-entry strong{font-size:.98rem;line-height:1.5}.segment-entry span{font-size:.78rem;color:#68809c;line-height:1.65}.segment-entry b{margin-top:auto;color:#315fbd;font-size:.78rem}.segment-entry:hover{background:#eaf2ff;border-color:#8ab1f1}.segment-entry[href="switch/work-phone/"]{color:#fff;background:linear-gradient(135deg,#164eb1,#072d78);border-color:#2d64be}.segment-entry[href="switch/work-phone/"] span,.segment-entry[href="switch/work-phone/"] b{color:#dce9ff}.segment-entry[href="switch/work-phone/"]:hover{background:linear-gradient(135deg,#2163d7,#123d90)}@media(max-width:850px){.segment-entries{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.segment-campaigns{padding:52px 16px}.segment-entry{padding:14px;min-height:145px}.segment-entry strong{font-size:.88rem}.segment-entry span{font-size:.72rem}.segment-group{margin-bottom:30px}}</style>';
 if(!html.includes("</head>")||!html.includes("</main>"))throw Error("Home end markers changed");
 html=html.replace("</head>",css+"</head>").replace("</main>",section+"</main>");
 fs.writeFileSync(homepage,html,"utf8");
}
for(const group of groups)for(const [slug] of group.entries){
 const file=path.join("site","switch",slug,"index.html"),url=root+"switch/"+slug+"/";
 if(!fs.existsSync(file))throw Error("Missing landing "+slug);
 const source=fs.readFileSync(file,"utf8");
 if((source.match(/<h1\b/g)||[]).length!==1)throw Error("Invalid H1 "+slug);
 if(!source.includes('rel="canonical" href="'+url+'"'))throw Error("Missing canonical "+slug);
 if(slug==="work-phone"){
  for(const required of ['id="plans"','data-plan="l7"','data-plan="k15"','data-plan="l11"','id="official-link"','data-cta="official"']){
   if(!source.includes(required))throw Error(slug+" missing "+required);
  }
 }else{
  if(!source.includes('data-segment="'+slug+'"'))throw Error("Missing audience marker "+slug);
  for(const required of ['id="start"','id="segment-selected-price"','data-segment-cta="official"','data-segment-cta="chat"']){
   if(!source.includes(required))throw Error(slug+" missing "+required);
  }
 }
 if(!sitemap.includes("<loc>"+url+"</loc>"))sitemap=sitemap.replace("</urlset>","<url><loc>"+url+"</loc></url>\n</urlset>");
 for(const [,u] of source.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!u||u.startsWith("#")||/^(https?:|mailto:|tel:|data:)/i.test(u))continue;
  const clean=u.split(/[?#]/)[0];
  const resolved=path.resolve(path.dirname(file),decodeURIComponent(clean));
  const target=path.extname(resolved)?resolved:path.join(resolved,"index.html");
  if(!target.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(target))throw Error("Broken internal reference "+slug+": "+u);
 }
}
fs.writeFileSync(sitemapFile,sitemap,"utf8");
for(const asset of ["site/assets/switch-landings.css","site/assets/segment-landings.css","site/assets/segment-landings.js"])if(!fs.existsSync(asset))throw Error("Missing asset "+asset);
const links=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
if(links.length!==34||new Set(links).size!==34)throw Error("Expected 34 unique URL entries, got "+links.length);
if(!html.includes('href="switch/designated-driver/"')||!html.includes('href="switch/work-phone/"'))throw Error("Home campaign entry missing");
console.log("Campaign QA PASS: prior A-D + nine segment pages including the premium work-phone page; 34 unique sitemap entries; responsive homepage links");
