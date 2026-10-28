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
 if(css.length!==1||!css[0].includes(s.path==="/"? "home.css":"catalog.css"))errors.push(file+" incorrect stylesheet");
 if(s.path==="/"){
  for(const marker of ['id="situations"','id="stories"','id="compare-cost"','id="current-bill"','id="compare-plan"','id="calculator-target"','id="join-guide"','id="faq"','href="plans/l-7gb/"','href="plans/"','href="data/15gb/"','href="data/100gb/"']){
    if(!html.includes(marker))errors.push(file+" missing home marker "+marker);
  }
  if(!html.includes("home.js?v=20261028-story1"))errors.push(file+" missing homepage interaction script");
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
if(locs.length!==20||new Set(locs).size!==20)errors.push("sitemap count != 20");
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


if(errors.length){console.error(errors.slice(0,40).join("\n"));throw Error(errors.length+" catalog QA errors");}
console.log("STORE + HOME QA PASS: 20 pages; "+checked+" internal paths; unique canonical & title; 1 CSS; filters, comparison and mobile navigation present.");
