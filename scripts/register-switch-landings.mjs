
import fs from "node:fs";
import path from "node:path";
const root="https://prepaid1215.github.io/test-post/";
const pages=[
 ["contract-ended","A · 약정 종료","약정이 끝났다면 통신비부터 바꾸세요","계속 내던 요금에서 벗어날 시점"],
 ["cost-comparison","B · 통신비 비교","내 통신비에서 얼마나 줄일 수 있을까요?","월 5만~8만원 통신비 직접 계산"],
 ["keep-number","C · 번호이동 안심","휴대폰과 번호 그대로 번호이동","처음 바꾸는 고객을 위한 순서"],
 ["savings-opportunity","D · 손실회피","10만원 통신비, 1년이면 얼마가 다를까요?","절약 가능 금액으로 시작하는 비교"]
];
const homePath="site/index.html";
const sitemapPath="site/sitemap.xml";
let home=fs.readFileSync(homePath,"utf8");
if(!home.includes('id="switch-campaigns"')){
 const cards=pages.map(([slug,letter,title,copy])=>'<a href="switch/'+slug+'/" class="switch-entry"><small>'+letter+'</small><strong>'+title+'</strong><span>'+copy+'</span><em>자세히 보기 →</em></a>').join("");
 const section='<section id="switch-campaigns" class="switch-campaigns"><div class="switch-inner"><p>약정이 끝났거나 통신비가 부담된다면</p><h2>쓰던 번호와 휴대폰 그대로, 통신비부터 바꾸세요.</h2><div class="switch-grid">'+cards+'</div></div></section>';
 const style='<style id="switch-home-style">.switch-campaigns{padding:68px 22px;background:#f2f6ff;color:#172d53}.switch-inner{max-width:1100px;margin:auto}.switch-inner>p{color:#3562bd;font-size:.85rem;font-weight:700}.switch-inner>h2{font-size:clamp(1.5rem,3vw,2.25rem);line-height:1.35;margin:10px 0 25px;letter-spacing:-.045em}.switch-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.switch-entry{display:flex;flex-direction:column;gap:9px;padding:19px;background:#fff;border:1px solid #dfe9fb;border-radius:14px;text-decoration:none;color:#1b3151}.switch-entry small{color:#3763c7;font-weight:800}.switch-entry strong{font-size:1rem;line-height:1.45}.switch-entry span{font-size:.8rem;color:#667d99;line-height:1.55}.switch-entry em{font-size:.79rem;font-style:normal;font-weight:800;color:#3260be;margin-top:auto}.switch-entry:hover{border-color:#3c6bdd}@media(max-width:900px){.switch-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.switch-campaigns{padding:48px 18px}.switch-grid{grid-template-columns:1fr 1fr;gap:9px}.switch-entry{padding:14px}.switch-entry strong{font-size:.87rem}.switch-entry span{font-size:.72rem}}</style>';
 if(!home.includes("</head>")||!home.includes("</main>"))throw Error("Homepage structure changed");
 home=home.replace("</head>",style+"</head>").replace("</main>",section+"</main>");
 fs.writeFileSync(homePath,home,"utf8");
}
let sitemap=fs.readFileSync(sitemapPath,"utf8");
if(!sitemap.includes("</urlset>"))throw Error("Sitemap missing urlset");
for(const [slug] of pages){
 const url=root+"switch/"+slug+"/";
 const file=path.join("site","switch",slug,"index.html");
 if(!fs.existsSync(file))throw Error("Missing campaign page "+file);
 const html=fs.readFileSync(file,"utf8");
 if((html.match(/<h1\b/g)||[]).length!==1)throw Error("Wrong H1 on "+slug);
 if(!html.includes('rel="canonical" href="'+url+'"'))throw Error("Wrong canonical "+slug);
 if(!html.includes('id="start"')||!html.includes('data-cta="official"'))throw Error("Missing CTA "+slug);
 if(!sitemap.includes("<loc>"+url+"</loc>"))sitemap=sitemap.replace("</urlset>","<url><loc>"+url+"</loc></url>\n</urlset>");
 for(const [,link] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!link||/^(https?:|mailto:|tel:|data:|#)/i.test(link))continue;
  const clean=link.split(/[?#]/)[0];
  const resolved=path.resolve(path.dirname(file),clean);
  const target=path.extname(resolved)?resolved:path.join(resolved,"index.html");
  if(!target.startsWith(path.resolve("site")+path.sep)||!fs.existsSync(target))throw Error("Broken link "+file+": "+link);
 }
}
fs.writeFileSync(sitemapPath,sitemap,"utf8");
const entries=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
if(entries.length!==25||new Set(entries).size!==25)throw Error("Expected 25 unique URLs, got "+entries.length);
if(!fs.readFileSync(homePath,"utf8").includes('href="switch/savings-opportunity/"'))throw Error("Home missing campaign links");
console.log("4 switch landings, homepage entry, sitemap (25 URLs), and internal links validated");
