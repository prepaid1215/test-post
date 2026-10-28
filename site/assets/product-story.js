(() => {
 "use strict";
 const price=17900;
 const inp=document.getElementById("current-fee");
 const month=document.getElementById("monthly-difference");
 const year=document.getElementById("yearly-difference");
 const label=document.getElementById("savings-label");
 const format=n=>n.toLocaleString("ko-KR")+"원";
 const track=(event,attrs={})=>{
   window.dataLayer=window.dataLayer||[];
   window.dataLayer.push({event,site:"alttel_story",plan_id:"ntelecom-l-7gb",...attrs});
 };
 function update(){
  let value=Number(inp.value);
  if(!Number.isFinite(value)||value<0)value=0;
  if(value>200000)value=200000;
  const difference=Math.round(value)-price, abs=Math.abs(difference);
  if(difference>0){
   label.textContent="현재 요금보다 낮은 월 기본료 차이";
   month.textContent=format(abs);
   year.textContent="같은 조건 12개월 가정 시 "+format(abs*12)+" 차이";
  }else if(difference<0){
   label.textContent="현재 요금보다 높은 월 기본료 차이";
   month.textContent=format(abs);
   year.textContent="같은 조건 12개월 가정 시 "+format(abs*12)+" 더 높음";
  }else{
   label.textContent="현재 요금과 기본료가 같습니다";
   month.textContent="0원";
   year.textContent="동일 금액이며 사용조건은 별도로 비교해야 합니다";
  }
 }
 if(inp){inp.addEventListener("input",update);update();}
 const choices=[...document.querySelectorAll('input[name="join-method"]')];
 const explanation=document.getElementById("join-method-note");
 choices.forEach(c=>c.addEventListener("change",()=>{
  if(!c.checked)return;
  explanation.textContent=c.value==="port"
   ?"기존 번호를 유지하려면 번호이동을 선택하고 기존 회선을 먼저 해지하지 마세요. 미납·정지 등의 제한 여부는 공식 신청 과정에서 확인합니다."
   :"별도의 회선을 추가한다면 신규가입을 선택하세요. 본인확인과 가입 심사, 유심·단말 호환 여부를 공식 화면에서 확인합니다.";
  track("story_join_method",{method:c.value});
 }));
 // Keep an explicitly chosen join type when the user arrives from the homepage.
 const homeJoin=new URLSearchParams(location.search).get("join");
 if(homeJoin==="port"||homeJoin==="new"){
   const selected=choices.find(x=>x.value===homeJoin);
   if(selected){
     selected.checked=true;
     explanation.textContent=homeJoin==="port"
      ?"기존 번호를 유지하려면 현재 회선을 먼저 해지하지 마세요. 미납·정지 등의 제한 여부는 공식 신청 과정에서 확인합니다."
      :"별도 회선을 신청하려면 신규가입 조건과 유심·단말 호환, 본인확인 절차를 공식 화면에서 확인하세요.";
   }
 }
 document.getElementById("copy-name")?.addEventListener("click",async()=>{
  const text=document.getElementById("plan-to-copy")?.value??"L망후불 7GB+";
  const result=document.getElementById("copy-result");
  try{
   if(!navigator.clipboard?.writeText)throw new Error("Clipboard unavailable");
   await navigator.clipboard.writeText(text);
   result.textContent="상품명이 복사됐습니다. 공식 요금제 목록에서 같은 상품을 확인하세요.";
   track("story_plan_name_copy");
  }catch(err){result.textContent="복사할 수 없다면 왼쪽 상품명을 선택해 직접 복사하세요.";}
 });
 document.addEventListener("click",ev=>{
  const link=ev.target.closest("a");
  if(!link)return;
  const method=choices.find(x=>x.checked)?.value??"port";
  if(link.dataset.action==="story-official")track("story_official_click",{join_method:method});
  if(link.dataset.action==="story-chat")track("story_chat_click",{join_method:method});
  if(link.getAttribute("href")==="#purchase")track("story_purchase_section_click",{source:link.closest(".mobile-sticky")?"mobile":"body"});
 });
})();
