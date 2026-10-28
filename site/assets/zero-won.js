/* 0원 광고 비교 계산 및 유입 계측. 0원 요금제 판매를 주장하지 않음. */
(() => {
 "use strict";
 const form=document.getElementById("zero-calculator");
 if(!form)return;
 const inputs={
  first:document.getElementById("promo-fee"),
  months:document.getElementById("promo-months"),
  after:document.getElementById("after-fee")
 };
 const promo=document.getElementById("promo-total");
 const our=document.getElementById("our-total");
 const difference=document.getElementById("cost-difference");
 const ownMonthly=17900;
 const fmt=v=>Math.round(v).toLocaleString("ko-KR")+"원";
 const query=new URLSearchParams(location.search);
 const attrs={};
 for(const key of ["utm_source","utm_medium","utm_campaign","utm_content"]){
   const value=query.get(key);
   if(value)attrs[key]=value.slice(0,72).replace(/[^a-zA-Z0-9가-힣._ -]/g,"");
 }
 const track=(event,detail={})=>{
   window.dataLayer=window.dataLayer||[];
   window.dataLayer.push({event,site:"alttel_zero_won_landing",landing_id:"zero-won",...attrs,...detail});
 };
 const clamp=(value,min,max)=>{
  const n=Number(value);
  return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;
 };
 const calc=()=>{
   const fee=clamp(inputs.first.value,0,200000);
   const months=Math.round(clamp(inputs.months.value,0,12));
   const after=clamp(inputs.after.value,0,200000);
   const total=fee*months+after*(12-months),own=ownMonthly*12;
   promo.textContent=fmt(total);
   our.textContent=fmt(own);
   const d=total-own;
   difference.textContent=d<0?"입력한 광고 요금제가 "+fmt(-d)+" 낮습니다.":d>0?"7GB 상품의 가정 총액이 "+fmt(d)+" 낮습니다.":"기본료 합계가 같습니다.";
   return {fee,months,after,total,own};
 };
 form.addEventListener("submit",ev=>ev.preventDefault());
 Object.values(inputs).forEach(i=>{
  i.addEventListener("input",calc);
  i.addEventListener("change",()=>{const r=calc();track("zero_won_comparison_calculated",{promo_months:r.months,promo_total:r.total,comparison_total:r.own});});
 });
 document.addEventListener("click",ev=>{
  const brand=ev.target.closest("a[data-nt-cta]");
  if(brand)track("ntelecom_reason_click",{reason:brand.dataset.ntCta,plan_id:brand.dataset.ntPlan||""});
  const a=ev.target.closest("a[data-zero-cta]");
  if(!a)return;
  track("zero_won_cta_click",{cta:a.dataset.zeroCta,plan_id:a.dataset.plan||""});
 });
 track("zero_won_landing_view");
 calc();
})();