
(()=>{
 "use strict";
 const campaign=document.body.dataset.campaign||"unknown";
 const plans={
  l7:{name:"앤텔레콤 L망 후불 7GB+",data:"7GB + 소진 후 최대 1Mbps",price:17900},
  k7:{name:"앤텔레콤 K망 7GB+(밀리의서재)",data:"7GB + 소진 후 최대 1Mbps",price:19500},
  k15:{name:"앤텔레콤 K망 15GB+(밀리의서재)",data:"15GB + 소진 후 최대 1Mbps",price:23500},
  k100:{name:"앤텔레콤 K망 100GB+(밀리의서재)",data:"100GB + 소진 후 최대 5Mbps",price:43200}
 };
 const format=n=>Number(n).toLocaleString("ko-KR")+"원";
 const track=(event,detail={})=>{
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event,category:"postpaid_number_transfer",campaign,...detail});
 };
 const params=new URLSearchParams(location.search);
 const utm={source:params.get("utm_source")||"direct",medium:params.get("utm_medium")||"none",campaign:params.get("utm_campaign")||campaign};
 track("switch_landing_view",{utm_source:utm.source,utm_medium:utm.medium,utm_campaign:utm.campaign});
 const labels=[...document.querySelectorAll('input[name="selected-plan"]')];
 const bill=document.getElementById("current-bill"), monthly=document.getElementById("monthly-diff");
 const yearly=document.getElementById("yearly-diff"),context=document.getElementById("calc-context");
 let current="l7";
 function showSelection(){
  const item=plans[current];
  document.getElementById("selected-name").textContent=item.name;
  document.getElementById("selected-price").textContent="월 "+format(item.price);
  document.getElementById("selected-data").textContent=item.data;
  if(!bill)return;
  const value=Number(bill.value);
  if(!bill.value.trim()||!Number.isFinite(value)||value<0||value>300000){
   monthly.textContent="금액 확인";
   yearly.textContent="금액 확인";
   context.textContent="현재 통신서비스 요금을 0~300,000원 사이로 입력하세요.";
   return;
  }
  const d=value-item.price;
  monthly.textContent=d>=0?format(d)+" 절감 가능":format(-d)+" 추가 부담";
  yearly.textContent=d>=0?format(d*12)+" 차이":format(-d*12)+" 추가 부담";
  context.textContent="현재 월 통신서비스 요금 "+format(value)+"과 "+item.name+"의 월 기본료 "+format(item.price)+"을 12개월 단순 비교한 예시입니다. 단말기 할부·결합 할인 손실·기타 비용은 별도이며 데이터 사용량에 맞는 상품인지 확인해야 합니다.";
 }
 labels.forEach(input=>input.addEventListener("change",()=>{
  if(!input.checked||!plans[input.value])return;
  current=input.value;
  showSelection();
  track("switch_plan_selected",{plan_id:current});
 }));
 if(bill){
  bill.addEventListener("input",showSelection);
  bill.addEventListener("change",()=>{
   const n=Number(bill.value);
   if(Number.isFinite(n)&&n>=0&&n<=300000)track("switch_savings_calculated",{plan_id:current,monthly_bill_band:n<30000?"under30k":n<50000?"30k-50k":n<80000?"50k-80k":n<100000?"80k-100k":"over100k"});
  });
 }
 const status=document.getElementById("contract-status"),feedback=document.getElementById("contract-result");
 if(status&&feedback){
  status.addEventListener("change",()=>{
   const messages={
    ended:"약정 종료 상태라면 현재 요금·결합 할인과 앤텔레콤 상품을 비교해 번호이동을 진행하세요.",
    soon:"종료 예정일과 위약금, 선택약정 할인 상태를 먼저 확인하고 번호이동 시점을 정하세요.",
    remaining:"남은 약정의 위약금이나 혜택 손실을 확인한 뒤 이동 시점과 실제 절약액을 비교하세요."
   };
   feedback.textContent=messages[status.value];
   track("switch_contract_selected",{status:status.value});
  });
 }
 const checks=[...document.querySelectorAll("[data-switch-check]")], checkNote=document.getElementById("check-result");
 if(checkNote&&checks.length){
  checks.forEach(box=>box.addEventListener("change",()=>{
   const checked=checks.filter(x=>x.checked).length;
   checkNote.textContent=checked===checks.length?"기본 준비 항목을 모두 점검했습니다. 실제 가입 가능 여부는 공식 신청 단계에서 확인됩니다.":"준비 항목 "+checked+"/"+checks.length+"개 확인했습니다. 남은 항목을 확인하세요.";
   track("switch_check_progress",{checked,total:checks.length});
  }));
 }
 document.addEventListener("click",e=>{
  const node=e.target.closest("[data-cta]");
  if(!node)return;
  track("switch_cta_click",{cta:node.dataset.cta,plan_id:current});
 });
 showSelection();
})();