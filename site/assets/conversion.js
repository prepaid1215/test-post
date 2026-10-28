/* Selected plan -> explicit number-port/new-line handoff. No PII or network APIs. */
(() => {
  "use strict";
  const dlg=document.getElementById("apply-dialog");
  const planJson=document.getElementById("plan-json");
  if(!dlg||!planJson)return;
  let plans=[];
  try{plans=JSON.parse(planJson.textContent)}catch(err){return;}
  const lookup=new Map(plans.map(p=>[p.id,p]));
  const track=(event,extra={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,site:"alttel_catalog",...extra});};
  const money=n=>Number(n).toLocaleString("ko-KR")+"원";
  const name=p=>String(p.name??"").replace(/^앤텔레콤\s*/,"");
  const chooseRadios=[...dlg.querySelectorAll('input[name="apply-method"]')];
  let selected=null;
  const mobile=document.getElementById("mobile-selected");
  const methodNote=document.getElementById("apply-method-note");
  const official=document.getElementById("apply-official");
  const copyName=document.getElementById("apply-copy-name");
  function currentMethod(){return chooseRadios.find(x=>x.checked)?.value||"undecided";}
  function setMethod(type){
    chooseRadios.forEach(x=>{x.checked=(x.value===type)});
    const method=currentMethod();
    methodNote.textContent=method==="port"
      ?"기존 번호를 유지할 때는 현재 회선을 먼저 해지하지 마세요. 미납·정지 여부에 따라 번호이동이 제한될 수 있으며 최종 가능 여부는 공식 가입 과정에서 확인합니다."
      :method==="new"
      ?"새 회선 가입은 별도 요금이 발생할 수 있습니다. 본인확인과 가입 심사, 유심·단말 호환 여부를 공식 신청 과정에서 확인하세요."
      :"현재 번호를 유지한다면 번호이동, 별도의 회선이 필요하다면 신규가입을 선택하세요.";
  }
  function openPlan(id){
    const p=lookup.get(id);
    if(!p)return false;
    selected=p;
    dlg.querySelector("#apply-name").textContent=name(p);
    dlg.querySelector("#apply-price").textContent=money(p.monthly_price);
    dlg.querySelector("#apply-details").textContent=(p.network==="K"?"KT망":"LG U+망")+" · "+(p.data_gb??"별도 확인")+"GB"+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":"")+" · 소진 후 최대 "+p.after_speed;
    copyName.textContent=p.name;
    dlg.querySelector("#apply-copy-feedback").textContent="";
    const path=location.pathname;
    setMethod(path.includes("/number-transfer/")?"port":path.includes("/new-number/")?"new":"undecided");
    if(mobile){mobile.textContent="선택 요금제 가입 안내";mobile.href="#plans";mobile.dataset.plan=id;}
    track("catalog_plan_selected",{plan_id:id});
    if(typeof dlg.showModal==="function")dlg.showModal();
    else dlg.setAttribute("open","");
    return true;
  }
  document.addEventListener("click",ev=>{
    const trigger=ev.target.closest('a[data-action="choose-plan"]');
    if(trigger&&lookup.has(trigger.dataset.plan)){
      ev.preventDefault();openPlan(trigger.dataset.plan);return;
    }
    if(mobile&&ev.target.closest("#mobile-selected")&&mobile.dataset.plan&&lookup.has(mobile.dataset.plan)){
      ev.preventDefault();openPlan(mobile.dataset.plan);return;
    }
  });
  chooseRadios.forEach(r=>r.addEventListener("change",()=>{
    setMethod(r.value);
    if(selected)track("catalog_join_method",{plan_id:selected.id,method:r.value});
  }));
  dlg.querySelector("#apply-close").addEventListener("click",()=>dlg.close());
  dlg.addEventListener("click",ev=>{if(ev.target===dlg)dlg.close()});
  dlg.querySelector("#apply-copy").addEventListener("click",async ()=>{
    if(!selected)return;
    const value=selected.name;
    try{
      if(!navigator.clipboard?.writeText)throw Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      dlg.querySelector("#apply-copy-feedback").textContent="요금제명을 복사했습니다. 공식 화면에서 같은 이름을 확인하세요.";
      track("catalog_plan_name_copied",{plan_id:selected.id});
    }catch(_){
      dlg.querySelector("#apply-copy-feedback").textContent="복사할 수 없다면 위 이름을 직접 선택해서 복사해 주세요.";
    }
  });
  official.addEventListener("click",()=>{
    if(selected)track("catalog_official_click",{plan_id:selected.id,join_method:currentMethod(),source:"selected_plan_dialog"});
  });
  dlg.querySelector("#apply-chat").addEventListener("click",()=>{
    if(selected)track("catalog_chat_click",{plan_id:selected.id,join_method:currentMethod(),source:"selected_plan_dialog"});
  });
})();
