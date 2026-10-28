import fs from "node:fs";
import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const root="https://prepaid1215.github.io/test-post/";
const requiredPaths=new Set(specs.map(s=>s.path));
const meta={canonicals:new Set(),titles:new Set(),descs:new Set()};
const errors=[];
let linksChecked=0;
const E=(f,m)=>errors.push(f+": "+m);
function target(from,url){
 const clean=url.split(/[?#]/)[0];
 const p=path.resolve(path.dirname(from),decodeURIComponent(clean));
 return path.extname(p)?p:path.join(p,"index.html");
}
for(const s of specs){
 const file=path.join("site",s.path,"index.html");
 if(!fs.existsSync(file)){E(file,"page missing");continue}
 const html=fs.readFileSync(file,"utf8");
 const h1=(html.match(/<h1\b/g)||[]).length;if(h1!==1)E(file,"H1 count "+h1);
 const title=html.match(/<title>([^<]*)<\/title>/)?.[1]||"";
 const desc=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||"";
 const canonical=html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]||"";
 const expected=root+s.path.replace(/^\//,"");
 if(canonical!==expected)E(file,"canonical mismatch: "+canonical+" vs "+expected);
 if(meta.titles.has(title))E(file,"duplicate title "+title);else meta.titles.add(title);
 if(meta.descs.has(desc))E(file,"duplicate description");else meta.descs.add(desc);
 if(meta.canonicals.has(canonical))E(file,"duplicate canonical");else meta.canonicals.add(canonical);
 if(!html.includes('id="plans"')||!html.includes('id="faq"'))E(file,"plan table or FAQ missing");
 if(/https?:\/\/(?:preplan\.site|59man\.shop)\b/i.test(html))E(file,"cross-project URL detected");
 for(const [,u] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!u||u[0]==="#"||/^(https?:|mailto:|tel:|data:)/i.test(u))continue;
  if(u[0]==="#"){const id=u.slice(1);if(id&&!html.includes('id="'+id+'"'))E(file,"missing anchor "+id);continue}
  if(u.startsWith("/")){E(file,"root-absolute URL not supported on Github Pages: "+u);continue}
  let resolved;
  try{resolved=target(file,u)}catch(ex){E(file,"unparsable URL "+u);continue}
  linksChecked++;
  if(!resolved.startsWith(path.resolve("site")+path.sep))E(file,"link escapes site root: "+u);
  else if(!fs.existsSync(resolved))E(file,"broken relative link: "+u+" -> "+resolved);
 }
 const advanced=true;
 if(advanced&&!html.includes('id="consumer-guide"'))E(file,"priority guide missing");
 if(s.path==="/"&&!html.includes('id="postpaid-finder-form"'))E(file,"plan finder missing");
}
const sitemap=fs.readFileSync("site/sitemap.xml","utf8");
const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
if(locs.length!==19||new Set(locs).size!==19)E("sitemap","expected 19 unique links, got "+locs.length);
for(const s of specs)if(!locs.includes(root+s.path.replace(/^\//,"")))E("sitemap","URL missing: "+s.path);
for(const file of ["site/assets/postpaid-enhancements.css","site/assets/postpaid-finder.js"])if(!fs.existsSync(file))E(file,"missing asset");
if(errors.length){console.error(errors.slice(0,80).join("\n"));throw Error("Validation failed with "+errors.length+" issues")}
console.log("SEO QA PASS: "+specs.length+" pages, "+linksChecked+" internal links, "+meta.canonicals.size+" canonicals, unique titles/descriptions, accessible finder & enrichment.");
