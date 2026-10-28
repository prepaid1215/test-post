
(()=>{"use strict";
const root=document.body,segment=root.dataset.segment||"",audience=root.dataset.audience||"",dataEl=document.getElementById("segment-plan-data");
let catalog={};try{catalog=JSON.parse(dataEl?.textContent||"{}")}catch(error){return;}
const $=id=>document.getElementById(id),money=n=>Number(n).toLocaleString("ko-KR")+"원";
const track=(event,extra={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,site:"postpaid_affinity_and_work",segment,audience,...extra});};
const search=new URLSearchParams(location.search);
track("segment_landing_view",{utm_source:search.get("utm_source")||"direct",utm_medium:search.get("utm_medium")||"none"});
const inputs=[...document.querySelectorAll('input[name="segment-plan"]')];let selected=root.dataset.defaultPlan;
function renderPlan(){
 const p=catalog[selected];if(!p)return;
 $("segment-selected-name").textContent=p.name;
 $("segment-selected-price").textContent="월 "+money(p.price);
 $("segment-selected-data").textContent=p.network+" · "+p.data+" / 소진 후 최대 "+p.speed;
}
for(const input of inputs)input.addEventListener("change",()=>{
 if(!input.checked||!catalog[input.value])return;
 selected=input.value;renderPlan();updateCard();
 track("segment_plan_selected",{plan_id:catalog[selected].id,price_band:catalog[selected].price<20000?"under20k":catalog[selected].price<30000?"20-30k":"over30k"});
});
const cardDiscount=$("card-discount"),cardFee=$("card-fee"),cardResult=$("card-result");
function updateCard(){
 if(!cardResult)return;
 let discount=Number(cardDiscount?.value),fee=Number(cardFee?.value);
 if(!Number.isFinite(discount)||!Number.isFinite(fee)||discount<0||fee<0||discount>100000||fee>100000){
  cardResult.textContent="입력값 확인";return;
 }
 const net=12*discount-fee;
 cardResult.textContent=(net<0?"연간 순부담 ":"연간 순효과 ")+money(Math.abs(net));
}
[cardDiscount,cardFee].filter(Boolean).forEach(n=>n.addEventListener("input",updateCard));
if(cardResult)updateCard();
const cuSpend=$("cu-spend"),cuResult=$("cu-result");
function updateCu(){
 if(!cuResult)return;
 const n=Number(cuSpend?.value);
 if(!Number.isFinite(n)||n<0||n>300000){cuResult.textContent="입력값 확인";return}
 cuResult.textContent=money(Math.min(5000,Math.floor(n*.2)));
}
cuSpend?.addEventListener("input",updateCu);if(cuResult)updateCu();
const hours=$("work-hours"),days=$("work-days"),video=$("work-video"),workResult=$("work-result"),advice=$("work-advice");
function updateWork(){
 if(!workResult)return;
 const total=Number(hours?.value)*Number(days?.value);
 const low=(total*20)/1024+2, high=(total*40)/1024+2;
 const f=n=>n.toFixed(1)+"GB";
 workResult.textContent=f(low)+" ~ "+f(high);
 let recommendation=high<=7?"월 7GB부터 비교할 수 있습니다.":high<=15?"월 15GB 이상을 먼저 비교하는 편이 안전합니다.":"15GB 초과 또는 일일 데이터 추가 상품까지 확인하세요.";
 if(video?.checked)recommendation+=" 동영상은 계산에서 제외되므로 실제 사용량에 맞춰 더 넉넉한 상품을 선택하세요.";
 else recommendation+=" 배차·지도 외 고용량 전송은 포함하지 않았습니다.";
 advice.textContent=recommendation;
}
[hours,days,video].filter(Boolean).forEach(el=>el.addEventListener("change",()=>{
 updateWork();track("segment_workload_changed",{hours:hours.value,days:days.value,video:video.checked?"yes":"no"});
}));if(workResult)updateWork();
const habits=[...document.querySelectorAll('input[name="segment-habit"]')],habitResult=$("habit-result");
for(const input of habits)input.addEventListener("change",()=>{
 if(!input.checked)return;
 const msg=segment==="oliveyoung"&&input.value==="rare"?
  "올리브영을 거의 사용하지 않는다면 상품권보다 월 기본료가 낮은 일반 요금제를 비교하세요.":
  segment==="naverpay"&&input.value==="occasional"?
  "네이버페이 이용이 적다면 포인트 쿠폰보다 월 기본료와 필요한 데이터를 먼저 비교하세요.":
  "평소 실제로 사용하는 혜택이라면 제휴 요금제를 선택할 이유가 됩니다. 쿠폰 수령·등록기한을 확인하세요.";
 if(habitResult)habitResult.textContent=msg;
 track("segment_benefit_habit_selected",{frequency:input.value});
});
document.addEventListener("click",event=>{
 const node=event.target.closest("[data-segment-cta]");if(!node)return;
 track("segment_cta_click",{cta:node.dataset.segmentCta,plan_id:catalog[selected]?.id||"",join_type:audience==="work"?"new":"port"});
});
renderPlan();
})();
