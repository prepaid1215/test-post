(() => {
  "use strict";
  const bill=document.getElementById("current-bill");
  const product=document.getElementById("compare-plan");
  const diff=document.getElementById("difference-value");
  const label=document.getElementById("difference-label");
  const annual=document.getElementById("difference-year");
  const target=document.getElementById("calculator-target");
  if(!bill||!product||!diff||!label||!annual||!target)return;
  const targets={
    "ntelecom-l-7gb":"plans/l-7gb/",
    "ntelecom-k-15gb-millie":"data/15gb/",
    "ntelecom-k-100gb-millie":"data/100gb/"
  };
  const track=(event,fields={})=>{
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event,site:"alttel_story_home",...fields});
  };
  const money=n=>Number(n).toLocaleString("ko-KR")+"원";
  function update(){
    const raw=Number(bill.value);
    const current=Number.isFinite(raw)?Math.max(0,Math.min(200000,raw)):0;
    const price=Number(product.selectedOptions[0]?.dataset.price||0);
    const delta=Math.round(current-price);
    const abs=Math.abs(delta);
    target.href=targets[product.value]||"plans/";
    if(delta>0){
      label.textContent="현재 요금보다 낮은 월 기본료 차이";
      diff.textContent=money(abs);
      annual.textContent="같은 요금 12개월 가정 시 "+money(abs*12)+" 차이";
    } else if(delta<0){
      label.textContent="현재 요금보다 높은 월 기본료 차이";
      diff.textContent=money(abs);
      annual.textContent="같은 요금 12개월 가정 시 "+money(abs*12)+" 더 높음";
    } else {
      label.textContent="월 기본료가 같습니다";
      diff.textContent="0원";
      annual.textContent="데이터·통화 제공량과 가입 조건을 비교하세요";
    }
  }
  bill.addEventListener("input",update);
  bill.addEventListener("change",()=>{
    update();
    const current=Number(bill.value);
    track("home_savings_calculated",{plan_id:product.value,price_difference:Math.round((Number.isFinite(current)?Math.max(0,Math.min(current,200000)):0)-Number(product.selectedOptions[0]?.dataset.price||0))});
  });
  product.addEventListener("change",()=>{
    update();
    track("home_savings_plan_changed",{plan_id:product.value});
  });
  document.addEventListener("click",ev=>{
    const a=ev.target.closest("a[data-cta]");
    if(!a)return;
    const cta=a.dataset.cta;
    const fields={cta,section:cta.startsWith("hero")?"hero":cta.startsWith("final")?"footer":cta.startsWith("calculator")?"savings":cta==="featured"?"story_products":cta==="situation"?"needs":"other"};
    if(a.dataset.plan)fields.plan_id=a.dataset.plan;
    if(a.dataset.intent)fields.intent=a.dataset.intent;
    if(cta==="calculator-product")fields.plan_id=product.value;
    track("home_cta_click",fields);
  });
  update();
})();