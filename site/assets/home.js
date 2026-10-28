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

/* First-screen guided product selection — 1 choice reveals a product.
 * Optional join intent is preserved as URL context, not treated as approval.
 */
(() => {
  "use strict";
  const section=document.getElementById("quick-match");
  const embedded=document.getElementById("quick-match-data");
  if(!section||!embedded)return;
  let rows=[];
  try{rows=JSON.parse(embedded.textContent)}catch(_){return;}
  const byKey=new Map(rows.map(p=>[p.key,p]));
  const choices=[...section.querySelectorAll(".match-choice")];
  const join=[...section.querySelectorAll('input[name="quick-join"]')];
  const link=document.getElementById("match-link");
  const name=document.getElementById("match-plan-name");
  const network=document.getElementById("match-network");
  const price=document.getElementById("match-price");
  const data=document.getElementById("match-data");
  const speed=document.getElementById("match-speed");
  const reason=document.getElementById("match-reason");
  const note=document.getElementById("match-note");
  const formatter=new Intl.NumberFormat("ko-KR");
  let selected="light";
  const track=(event,extra={})=>{
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event,site:"alttel_story_home",...extra});
  };
  function selectedJoin(){return join.find(r=>r.checked)?.value||"unsure";}
  function update(){
    const p=byKey.get(selected);
    if(!p)return;
    name.textContent=p.name;
    network.textContent=p.network==="K"?"KT망":"LG U+망";
    price.textContent=formatter.format(p.price)+"원";
    data.textContent=p.gb+"GB";
    speed.textContent="소진 후 최대 "+p.after_speed;
    reason.textContent=p.reason;
    choices.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.usage===selected)));
    link.dataset.plan=p.id;
    link.textContent=p.label;
    const arrow=document.createElement("span");
    arrow.setAttribute("aria-hidden","true");
    arrow.textContent=" →";
    link.appendChild(arrow);
    const query=new URLSearchParams();
    const method=selectedJoin();
    if(method!=="unsure")query.set("join",method);
    if(selected!=="light")query.set("plan",p.id);
    link.href=p.url+(query.size?"?"+query.toString():"");
    note.textContent=(method!=="unsure"&&!p.numberKnown
      ?"이 상품의 "+(method==="port"?"번호이동":"신규가입")+" 가능 여부는 조사 자료에서 확인되지 않았습니다. 공식 화면에서 조건을 확인해 주세요."
      :"상품 가격은 2026년 9월 조사 기준입니다. 현재 판매·가입 조건은 공식 안내에서 확인하세요.");
  }
  choices.forEach(btn=>btn.addEventListener("click",()=>{
    if(!byKey.has(btn.dataset.usage))return;
    selected=btn.dataset.usage;
    update();
    track("home_match_choice",{usage:selected,plan_id:byKey.get(selected).id});
  }));
  join.forEach(r=>r.addEventListener("change",()=>{
    update();
    track("home_match_join_method",{method:selectedJoin(),plan_id:byKey.get(selected).id});
  }));
  update();
})();
