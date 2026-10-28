import fs from "node:fs";
import path from "node:path";
const specs=[...JSON.parse(fs.readFileSync("data/consumer-spec-a.json","utf8")),...JSON.parse(fs.readFileSync("data/consumer-spec-b.json","utf8"))];
const root="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx";
function relative(from,to){return "../".repeat(from.split("/").filter(Boolean).length)+to.replace(/^\/+/,"")}
function shortcuts(from){
 const a=[
 ["월 2만원 미만 요금제","/price/under-20000/","기본료부터 비교"],
 ["데이터 넉넉한 요금제","/unlimited/","소진 후 속도 확인"],
 ["번호 그대로 이동","/number-transfer/","번호이동 조건 확인"]
 ];
 return '<section class="intent-shortcuts" aria-label="원하는 요금제 바로 찾기"><span class="shortcut-label">빠르게 찾기</span><div class="shortcut-items">'+a.map(x=>'<a href="'+relative(from,x[1])+'"><strong>'+x[0]+'</strong><small>'+x[2]+'</small><span aria-hidden="true">→</span></a>').join("")+'</div></section>';
}
const dialog=[
'<dialog id="apply-dialog" aria-labelledby="apply-heading">',
'<div class="dialog-head"><h2 id="apply-heading">선택한 요금제 가입 안내</h2><button id="apply-close" type="button" aria-label="가입 안내 닫기">×</button></div>',
'<div class="dialog-body">',
'<div class="apply-summary"><p>선택한 알뜰폰 요금제</p><strong id="apply-name"></strong><div class="apply-price"><span>월 기본료</span><b id="apply-price"></b></div><p id="apply-details"></p></div>',
'<div class="apply-section"><h3>1. 가입 방식을 선택하세요</h3>',
'<div class="join-options" role="radiogroup" aria-label="가입 유형"><label><input type="radio" name="apply-method" value="port"><span><b>번호이동</b><small>현재 번호 유지</small></span></label><label><input type="radio" name="apply-method" value="new"><span><b>신규가입</b><small>별도 회선 가입</small></span></label></div>',
'<p class="apply-method-note" id="apply-method-note">현재 번호를 유지한다면 번호이동, 별도 회선이 필요하다면 신규가입을 선택하세요.</p></div>',
'<div class="apply-section"><h3>2. 공식 페이지에서 상품을 확인하세요</h3>',
'<p>현재 개별 상품의 직접 신청 주소는 확인되지 않았습니다. 공식 요금제 목록에서 아래 상품명을 다시 찾아야 합니다.</p>',
'<div class="copy-plan"><span id="apply-copy-name"></span><button id="apply-copy" type="button">상품명 복사</button></div>',
'<p class="copy-feedback" id="apply-copy-feedback" role="status"></p></div>',
'<div class="apply-links"><a id="apply-official" href="'+root+'" target="_blank" rel="noopener noreferrer">공식 요금제 확인 ↗</a><a id="apply-chat" href="https://pf.kakao.com/_akxmKn/chat" target="_blank" rel="noopener noreferrer">가입 조건 상담</a></div>',
'<p class="apply-fineprint">2026년 9월 조사된 기본료입니다. 최신 판매가격·유심 호환·가입 승인 여부는 공식 화면에서 확인해야 합니다. 이곳에서는 개인정보를 수집하지 않습니다.</p>',
'</div></dialog>'
].join("");
let n=0;
for(const s of specs){
 const file=path.join("site",s.path,"index.html");
 let html=fs.readFileSync(file,"utf8");
 if(!html.includes('data-action="official"')||!html.includes('id="compare-dialog"'))throw Error("Conversion insert anchor missing: "+s.path);
 let count=0;
 html=html.replace(/(<a\b[^>]*class="apply-link"[^>]*data-action=")official("[^>]*>)[\s\S]*?<\/a>/g,(_,a,b)=>{count++;return a+"choose-plan"+b+"이 요금제 선택하기 →</a>"});
 if(count<1)throw Error("No product CTA replaced: "+s.path);
 html=html.replace(/(<nav class="tag-nav"[\s\S]*?<\/nav>)/,"$1"+shortcuts(s.path));
 html=html.replace('<dialog id="compare-dialog"',dialog+'<dialog id="compare-dialog"');
 html=html.replace(/<nav class="mobile-bottom"[\s\S]*?<\/nav>/,'<nav class="mobile-bottom" aria-label="빠른 이동"><a href="#plans">요금제 찾기</a><a href="#plans" id="mobile-selected">요금제 선택하기</a></nav>');
 html=html.replace("</body>",'<script src="'+relative(s.path,"/assets/conversion.js")+'?v=20261028-8" defer></script></body>');
 if((html.match(/id="apply-dialog"/g)||[]).length!==1||!html.includes('data-action="choose-plan"'))throw Error("Invalid conversion markup "+s.path);
 fs.writeFileSync(file,html);
 n++;
}
console.log("Added plan-selection-to-join handoff on "+n+" pages.");
