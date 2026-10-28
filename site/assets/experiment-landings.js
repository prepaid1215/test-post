/* Four conversion landing experiments. No personal information collected. */
(() => {
  "use strict";
  const page=document.body?.dataset?.landing;
  if(!page||!["budget","port","unlimited","naverpay"].includes(page))return;
  const params=new URLSearchParams(location.search);
  const allowed=["utm_source","utm_medium","utm_campaign","utm_content"];
  const origin={};
  allowed.forEach(k=>{
    const raw=params.get(k);
    if(raw)origin[k]=raw.slice(0,80).replace(/[^a-zA-Z0-9가-힣._\- ]/g,"");
  });
  try{
    if(Object.keys(origin).length){
      sessionStorage.setItem("alttel_landing_campaign",JSON.stringify(origin));
    } else {
      Object.assign(origin,JSON.parse(sessionStorage.getItem("alttel_landing_campaign")||"{}"));
    }
  }catch(_){}
  const track=(event,info={})=>{
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event,landing_id:page,site:"alttel_conversion_experiment",...origin,...info});
  };
  track("landing_view",{keyword:{"budget":"알뜰폰 1만원대","port":"알뜰폰 번호이동","unlimited":"알뜰폰 데이터 무제한","naverpay":"네이버페이 알뜰폰"}[page]});
  document.addEventListener("click",ev=>{
    const brand=ev.target.closest("a[data-nt-cta]");
    if(brand)track("ntelecom_reason_click",{reason:brand.dataset.ntCta,plan_id:brand.dataset.ntPlan||""});
    const anchor=ev.target.closest("a");
    if(anchor?.dataset?.landingCta){
      track("landing_cta_click",{position:anchor.dataset.landingCta,plan_id:anchor.dataset.plan||""});
    }
    if(anchor?.id==="apply-official"){
      track("landing_official_handoff",{plan_id:document.getElementById("apply-name")?.textContent||""});
    }
    if(anchor?.id==="apply-chat"||anchor?.dataset?.action==="chat"){
      track("landing_chat_click",{context:anchor.id||anchor.dataset.action});
    }
  });
  if(page==="budget"){
    const inp=document.getElementById("exp-bill");
    const diff=document.getElementById("exp-diff");
    const year=document.getElementById("exp-year-diff");
    const price=17900; // sourced from data/plans-snapshot.json, 2026-09.
    const fmt=n=>Math.round(n).toLocaleString("ko-KR")+"원";
    function update(){
      let n=Number(inp?.value||0);
      if(!Number.isFinite(n)||n<0)n=0;
      n=Math.min(200000,n);
      const delta=Math.round(n-price);
      diff.textContent=delta>0?fmt(delta)+" 차이":delta<0?fmt(Math.abs(delta))+" 더 높은 기본료":"동일한 월 기본료";
      year.textContent=delta>0?"같은 요금으로 12개월 가정 시 "+fmt(delta*12)+" 차이":delta<0?"12개월 가정 시 "+fmt(Math.abs(delta)*12)+" 더 높음":"단순 기본료 비교상 차이 없음";
    }
    inp?.addEventListener("input",update);
    inp?.addEventListener("change",()=>{
      update();
      track("landing_price_calculate",{plan_id:"ntelecom-l-7gb"});
    });
    update();
  }
  if(page==="port"){
    const checks=[...document.querySelectorAll("[data-port-check]")];
    const note=document.getElementById("exp-check-note");
    checks.forEach(c=>c.addEventListener("change",()=>{
      const count=checks.filter(i=>i.checked).length;
      note.textContent=count===checks.length
        ?"세 가지를 확인하셨습니다. 번호이동 가능 여부와 승인 결과는 공식 신청 과정에서 결정됩니다."
        :count+" / "+checks.length+" 항목을 확인했습니다. 아직 확인할 조건이 남아 있습니다.";
      track("landing_port_checklist",{checked_count:count,total:checks.length});
    }));
  }
  if(page==="unlimited"){
    const options=[...document.querySelectorAll("[data-speed-pick]")];
    const caption=document.getElementById("exp-speed-caption");
    const cta=document.getElementById("exp-speed-cta");
    options.forEach(button=>button.addEventListener("click",()=>{
      options.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
      caption.textContent="현재 비교: "+button.dataset.name+" · 월 "+Number(button.dataset.price).toLocaleString("ko-KR")+"원 · 소진 후 최대 "+button.dataset.speedPick;
      cta.dataset.plan=button.dataset.plan;
      track("landing_speed_choice",{speed:button.dataset.speedPick,plan_id:button.dataset.plan});
    }));
  }
})();
