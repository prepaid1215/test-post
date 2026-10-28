import fs from "node:fs";import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const home="https://prepaid1215.github.io/test-post/";
const problems=[];const titles=new Set(),canons=new Set();let checked=0;
const fail=(where,why)=>problems.push(where+": "+why);
for(const s of specs){
 const file=path.join("site",s.path,"index.html");if(!fs.existsSync(file)){fail(file,"missing HTML");continue;}
 const html=fs.readFileSync(file,"utf8"),linkList=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
 const h1=(html.match(/<h1\b/g)||[]).length; if(h1!==1)fail(s.path,"H1 "+h1);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1]??"";
 const canon=html.match(/rel="canonical" href="([^"]+)"/)?.[1]??"";
 if(titles.has(title))fail(s.path,"duplicate title");titles.add(title);
 if(canons.has(canon))fail(s.path,"duplicate canonical");canons.add(canon);
 if(canon!==home+s.path.replace(/^\//,""))fail(s.path,"bad canonical: "+canon);
 const css=html.match(/<link rel="stylesheet"[^>]*>/g)||[];
 if(css.length!==1||!css[0].includes("storefront.css"))fail(s.path,"expected exactly one storefront stylesheet");
 for(const marker of ['class="hero"','class="plan-card"','id="plans"','id="consumer-guide"','id="faq"','class="mobile-cta"'])if(!html.includes(marker))fail(s.path,"missing "+marker);
 if(/preplan\.site|59man\.shop|편의점선불유심|선불폰 개통/g.test(html))fail(s.path,"separate prepaid business link/text");
 if(s.path==="/"&&!html.includes('id="postpaid-finder-form"'))fail(s.path,"finder missing");
 for(const u of linkList){
  if(/^https?:|^mailto:|^tel:/.test(u)||u[0]==="#")continue;
  if(u.startsWith("/")){fail(s.path,"absolute GitHub Pages path "+u);continue}
  let target=u.split(/[?#]/)[0];let p=path.resolve(path.dirname(file),decodeURIComponent(target));
  if(!path.extname(p))p=path.join(p,"index.html");
  checked++;
  if(!p.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(p))fail(s.path,"broken asset/link "+u);
 }
}
const sitemap=fs.readFileSync("site/sitemap.xml","utf8");const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(urls.length!==19||new Set(urls).size!==19)fail("sitemap","expected 19 unique URLs");
if(problems.length){console.error(problems.slice(0,30).join("\n"));process.exit(1)}
console.log("STORE UI QA PASS: "+specs.length+" URLs, "+titles.size+" unique titles, "+checked+" local links, single storefront stylesheet; ready to deploy");
