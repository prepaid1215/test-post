import fs from "node:fs";
import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const base="https://prepaid1215.github.io/test-post/";
const errors=[];let checked=0;
const titles=new Set(),canonicalSet=new Set();
for(const s of specs){
 const file=path.join("site",s.path,"index.html");
 if(!fs.existsSync(file)){errors.push(file+" missing");continue;}
 const html=fs.readFileSync(file,"utf8"),h1=(html.match(/<h1\b/g)||[]).length;
 if(h1!==1)errors.push(file+" has "+h1+" H1 headings");
 const title=html.match(/<title>(.*?)<\/title>/)?.[1]||"";
 if(titles.has(title))errors.push(file+" duplicate title");titles.add(title);
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1]||"";
 if(canonical!==base+s.path.replace(/^\/+/,""))errors.push(file+" wrong canonical");
 if(canonicalSet.has(canonical))errors.push(file+" duplicate canonical");canonicalSet.add(canonical);
 const css=html.match(/<link rel="stylesheet"[^>]*>/g)||[];
 const isExperiment=["/price/under-20000/","/number-transfer/","/unlimited/","/benefits/naverpay/"].includes(s.path);
 if(isExperiment){
  if(css.length!==2||!css[0].includes("catalog.css")||!css[1].includes("experiment-landings.css"))errors.push(file+" incorrect experiment CSS");
 }else if(css.length!==1||!css[0].includes(s.path==="/"? "home.css":"catalog.css"))errors.push(file+" incorrect stylesheet");
 if(s.path==="/"){
  for(const marker of ['id="situations"','id="stories"','id="compare-cost"','id="current-bill"','id="compare-plan"','id="calculator-target"','id="join-guide"','id="faq"','href="plans/l-7gb/"','href="plans/"','href="data/15gb/"','href="data/100gb/"']){
    if(!html.includes(marker))errors.push(file+" missing home marker "+marker);
  }
  if(!html.includes("home.js?v=20261028-match2"))errors.push(file+" missing current homepage interaction script");
  for(const marker of ['id="quick-match"','id="quick-match-data"','id="match-link"','id="match-plan-name"','name="quick-join"','data-usage="light"','data-usage="medium"','data-usage="heavy"']){
    if(!html.includes(marker))errors.push(file+" missing homepage fast-choice marker "+marker);
  }
  if((html.match(/class="match-choice"/g)||[]).length!==3)errors.push(file+" expected 3 fast-choice buttons");
  const matchPayload=html.match(/<script id="quick-match-data" type="application\/json">([\s\S]*?)<\/script>/);
  try{
   const parsed=JSON.parse(matchPayload?.[1]||"null");
   if(!Array.isArray(parsed)||parsed.length!==3||parsed.some(x=>!x.id||!x.price||!x.reason||!x.url))errors.push(file+" malformed fast-choice products");
  }catch(err){errors.push(file+" invalid fast-choice JSON");}
  if((html.match(/class="story-card /g)||[]).length!==3)errors.push(file+" must show exactly 3 story products");
 }else{
  for(const marker of ['class="catalog"','class="plan-item"','id="plan-list"','id="catalog-filters"','class="faq-section"','id="plan-search"','id="compare-tray"']){
   if(!html.includes(marker))errors.push(file+" missing "+marker);
  }
  for(const marker of ['id="apply-dialog"','id="apply-name"','id="apply-copy"','id="mobile-selected"','class="intent-shortcuts"','data-action="choose-plan"']){
   if(!html.includes(marker))errors.push(file+" missing conversion marker "+marker);
  }
  if((html.match(/id="apply-dialog"/g)||[]).length!==1)errors.push(file+" duplicated enrollment dialog");
  if(!html.includes("conversion.js?v=20261028-8"))errors.push(file+" missing conversion script");
  if(isExperiment){
   const expected={"budget":"ntelecom-l-7gb","port":"ntelecom-k-15gb-millie","unlimited":"ntelecom-k-100gb-millie","naverpay":"ntelecom-k-7gb-naverpay"};
   const landing={"/price/under-20000/":"budget","/number-transfer/":"port","/unlimited/":"unlimited","/benefits/naverpay/":"naverpay"}[s.path];
   for(const marker of ['data-landing="'+landing+'"','class="conversion-hero experiment-'+landing+'"','id="exp-solve"','class="exp-primary"','id="exp-top"','data-landing-cta="primary"','data-plan="'+expected[landing]+'"','experiment-landings.js?v=20261028-1']){
     if(!html.includes(marker))errors.push(file+" missing experiment marker "+marker);
   }
   if((html.match(/<h1/g)||[]).length!==1)errors.push(file+" duplicated experiment H1");
   if(landing==="budget"&&!html.includes('id="exp-bill"'))errors.push(file+" missing calculator");
   if(landing==="port"&&(html.match(/data-port-check/g)||[]).length!==3)errors.push(file+" missing three port checks");
   if(landing==="unlimited"&&(html.match(/data-speed-pick/g)||[]).length!==3)errors.push(file+" missing three speed choices");
   if(landing==="naverpay"&&!html.includes("31일차"))errors.push(file+" missing benefit condition");
  }
 }
 const urls=[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
 for(const u of urls){
  if(u[0]==="#"){
    if(u.length>1&&!html.includes('id="'+u.substring(1)+'"'))errors.push(file+" unresolved anchor "+u);
    continue;
  }
  if(/^(https?:|mailto:|tel:|data:)/i.test(u))continue;
  if(u.startsWith("/")){errors.push(file+" root-absolute asset "+u);continue;}
  const clean=u.split(/[?#]/)[0];
  const target0=path.resolve(path.dirname(file),decodeURIComponent(clean));
  const target=path.extname(target0)?target0:path.join(target0,"index.html");
  checked++;
  if(!target.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(target))errors.push(file+" missing local path "+u);
 }
}
const sitemap=fs.readFileSync("site/sitemap.xml","utf8");
const locs=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
if(locs.length!==21||new Set(locs).size!==21)errors.push("sitemap count != 21");
if(!fs.existsSync("site/assets/catalog.js")||!fs.existsSync("site/assets/catalog.css")||!fs.existsSync("site/assets/conversion.js"))errors.push("assets missing");
const detailFile="site/plans/l-7gb/index.html";
const detailUrl=base+"plans/l-7gb/";
if(!locs.includes(detailUrl))errors.push("L7GB story URL absent from sitemap");
if(!fs.existsSync(detailFile))errors.push("L7GB product detail not generated");
else{
 const detail=fs.readFileSync(detailFile,"utf8");
 if((detail.match(/<h1\b/g)||[]).length!==1)errors.push("L7GB detail invalid H1");
 if(!detail.includes('rel="canonical" href="'+detailUrl+'"'))errors.push("L7GB detail invalid canonical");
 for(const marker of ['id="story"','id="purchase"','id="current-fee"','id="copy-name"','name="join-method"','class="mobile-sticky"','class="story-opening"']){
  if(!detail.includes(marker))errors.push("L7GB detail missing "+marker);
 }
 if(!detail.includes("product-story.css")||!detail.includes("product-story.js"))errors.push("L7GB story assets missing");
 for(const [,link] of detail.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!link||link.startsWith("#")||/^(https?:|mailto:|tel:|data:)/i.test(link))continue;
  const raw=link.split(/[?#]/)[0];
  const p=path.resolve(path.dirname(detailFile),decodeURIComponent(raw));
  const dest=path.extname(p)?p:path.join(p,"index.html");
  checked++;
  if(!dest.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(dest))errors.push("L7GB broken relative asset "+link);
 }
}
if(!fs.readFileSync("site/index.html","utf8").includes('href="plans/l-7gb/"'))errors.push("Homepage not linked to L7GB story");
for(const asset of ["site/assets/product-story.css","site/assets/product-story.js"])if(!fs.existsSync(asset))errors.push(asset+" missing");
for(const asset of ["site/assets/home.css","site/assets/home.js"])if(!fs.existsSync(asset))errors.push(asset+" missing");
for(const asset of ["site/assets/experiment-landings.css","site/assets/experiment-landings.js"])if(!fs.existsSync(asset))errors.push(asset+" missing");


const zeroFile="site/price/zero-won/index.html",zeroUrl=base+"price/zero-won/";
if(!locs.includes(zeroUrl))errors.push("0-won experiment URL not in sitemap");
if(!fs.existsSync(zeroFile))errors.push("0-won landing missing");
else{
 const z=fs.readFileSync(zeroFile,"utf8");
 if((z.match(/<h1\b/g)||[]).length!==1)errors.push("0-won landing wrong H1 count");
 if(!z.includes('rel="canonical" href="'+zeroUrl+'"'))errors.push("0-won canonical invalid");
 for(const marker of ['id="calculator"','id="promo-fee"','id="promo-months"','id="after-fee"','id="promo-total"','id="our-total"','data-zero-cta="7gb-detail"','0원 상품을 판매하지 않습니다','zero-won.css?v=20261028-1','zero-won.js?v=20261028-1']){
  if(!z.includes(marker))errors.push("0-won page missing marker "+marker);
 }
 for(const [,link] of z.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!link||link.startsWith("#")||/^(https?:|mailto:|tel:|data:)/i.test(link))continue;
  const raw=link.split(/[?#]/)[0];
  const target0=path.resolve(path.dirname(zeroFile),decodeURIComponent(raw));
  const target=path.extname(target0)?target0:path.join(target0,"index.html");
  checked++;
  if(!target.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(target))errors.push("0-won broken relative asset "+link);
 }
}
if(!fs.readFileSync("site/index.html","utf8").includes('href="price/zero-won/"'))errors.push("home does not discover 0-won landing");
if(!fs.readFileSync("site/price/under-20000/index.html","utf8").includes('href="../zero-won/"'))errors.push("budget page does not discover 0-won landing");
for(const asset of ["site/assets/zero-won.css","site/assets/zero-won.js"])if(!fs.existsSync(asset))errors.push(asset+" missing");
const brandPages=[
 ["site/price/zero-won/index.html",3],
 ["site/price/under-20000/index.html",2],
 ["site/number-transfer/index.html",2],
 ["site/unlimited/index.html",2],
 ["site/benefits/naverpay/index.html",2]
];
for(const [f,expectedCards] of brandPages){
 const html=fs.readFileSync(f,"utf8");
 if(!html.includes('id="why-ntelecom"'))errors.push(f+" missing Ntelecom reason section");
 if(!html.includes('id="why-ntelecom-title"'))errors.push(f+" missing Ntelecom reasons heading");
 if(!html.includes('data-nt-cta="consult"'))errors.push(f+" missing brand consultation CTA");
 if((html.match(/class="nt-offer"/g)||[]).length!==expectedCards)errors.push(f+" expected "+expectedCards+" reason products");
 if(!html.includes("59만모바일"))errors.push(f+" missing operator identity");
 if(!html.includes("2026년"))errors.push(f+" missing evidence timeframe");
}
if(errors.length){console.error(errors.slice(0,40).join("\n"));throw Error(errors.length+" catalog QA errors");}
console.log("STORE + HOME + 0-WON QA PASS: 21 pages; "+checked+" internal paths; unique canonical & title; 1 CSS; filters, comparison and mobile navigation present.");
