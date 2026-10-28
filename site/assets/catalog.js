/* Real catalog interactions: filters, sorting, comparison. No tracking pixels or personal data. */
(() => {
  "use strict";
  const form=document.getElementById("catalog-filters"), list=document.getElementById("plan-list");
  const count=document.getElementById("result-count"),more=document.getElementById("load-more");
  if(!form||!list)return;
  const all=[...list.querySelectorAll(".plan-item")],sort=document.getElementById("sort-by");
  const empty=document.getElementById("empty-results"),tray=document.getElementById("compare-tray");
  const chosen=new Set();
  const cards=new Map(all.map(el=>[el.dataset.id,el]));
  let visibleLimit=8;
  const clean=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const format=n=>Number(n).toLocaleString("ko-KR")+"원";
  const track=(event,meta={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,site:"alttel_catalog",...meta});};
  const read=()=>({
    network:form.elements.network.value,
    price:form.elements.price.value,
    data:form.elements.data.value,
    speed:form.elements.speed.value,
    calls:form.elements.calls.value,
    benefit:form.elements.benefit.value,
    query:(document.getElementById("plan-search")?.value||"").trim().toLowerCase()
  });
  function match(el,q){
    const p=Number(el.dataset.price),data=Number(el.dataset.gb);
    if(q.network!=="all"&&el.dataset.network!==q.network)return false;
    if(q.price==="under20"&&p>=20000)return false;
    if(q.price==="under30"&&p>=30000)return false;
    if(q.price==="under40"&&p>=40000)return false;
    if(q.price==="over40"&&p<40000)return false;
    if(q.data==="under10"&&data>=10)return false;
    if(q.data==="from10"&&data<10)return false;
    if(q.data==="from15"&&data<15)return false;
    if(q.data==="from100"&&data<100)return false;
    if(q.data==="daily"&&!planMap.get(el.dataset.id)?.daily_data_gb)return false;
    if(q.speed!=="all"&&el.dataset.speed!==q.speed)return false;
    if(q.calls==="basic"&&el.dataset.basic!=="yes")return false;
    if(q.calls==="limited"&&el.dataset.basic==="yes")return false;
    if(q.benefit!=="all"&&!el.dataset.benefits.split(" ").includes(q.benefit))return false;
    if(q.query&&!el.dataset.name.toLowerCase().includes(q.query))return false;
    return true;
  }
  let planData=[];
  try{planData=JSON.parse(document.getElementById("plan-json").textContent)}catch(_){}
  const planMap=new Map(planData.map(p=>[p.id,p]));
  function refresh(trackEvent=false){
    const q=read();
    let found=all.filter(el=>match(el,q));
    const order=sort.value;
    found.sort((a,b)=>{
      if(order==="price-desc")return Number(b.dataset.price)-Number(a.dataset.price);
      if(order==="data-desc")return Number(b.dataset.gb)-Number(a.dataset.gb)||Number(a.dataset.price)-Number(b.dataset.price);
      return Number(a.dataset.price)-Number(b.dataset.price);
    });
    const foundIDs=new Set(found.map(x=>x.dataset.id));
    // Reorder once; keep hidden entries in DOM for no-JS fallback & SEO.
    list.replaceChildren(...found,...all.filter(el=>!foundIDs.has(el.dataset.id)));
    all.forEach(el=>{el.hidden=true;});
    found.forEach((el,i)=>{el.hidden=i>=visibleLimit;});
    count.textContent=found.length+"개";
    empty.hidden=found.length!==0;
    more.hidden=found.length<=visibleLimit;
    if(!more.hidden)more.textContent="요금제 더 보기 ("+Math.min(visibleLimit,found.length)+"/"+found.length+")";
    if(trackEvent)track("catalog_filter",{network:q.network,price:q.price,data:q.data,speed:q.speed,calls:q.calls,benefit:q.benefit,results:found.length});
  }
  form.addEventListener("change",()=>{visibleLimit=8;refresh(true)});
  sort.addEventListener("change",()=>{visibleLimit=8;refresh(true)});
  more.addEventListener("click",()=>{visibleLimit+=8;refresh();track("catalog_load_more")});
  const reset=()=>{form.reset();sort.value="price-asc";const search=document.getElementById("plan-search");if(search)search.value="";visibleLimit=8;refresh(true)};
  ["reset-filters","reset-filters-bottom"].forEach(id=>document.getElementById(id)?.addEventListener("click",reset));
  let debounce;
  document.getElementById("plan-search")?.addEventListener("input",()=>{clearTimeout(debounce);debounce=setTimeout(()=>{visibleLimit=8;refresh(true)},180)});
  const drawer=document.getElementById("filter-drawer");
  if(window.matchMedia("(max-width: 720px)").matches)drawer.removeAttribute("open");
  function paintTray(){
    tray.hidden=chosen.size===0;
    document.getElementById("compare-count").textContent=chosen.size;
    document.getElementById("compare-open").disabled=chosen.size<2;
  }
  list.addEventListener("change",ev=>{
    const box=ev.target.closest(".compare-pick");if(!box)return;
    if(box.checked&&chosen.size>=3){box.checked=false;window.alert("요금제는 최대 3개까지 비교할 수 있습니다.");return;}
    if(box.checked)chosen.add(box.value);else chosen.delete(box.value);
    paintTray();
  });
  document.getElementById("compare-clear").addEventListener("click",()=>{
    chosen.clear();all.forEach(el=>{const cb=el.querySelector(".compare-pick");if(cb)cb.checked=false;});paintTray();
  });
  const dialog=document.getElementById("compare-dialog"),output=document.getElementById("compare-output");
  document.getElementById("compare-open").addEventListener("click",()=>{
    const items=[...chosen].map(id=>planMap.get(id)).filter(Boolean);
    if(items.length<2)return;
    const columns=items.map(p=>"<th>"+clean(p.name.replace(/^앤텔레콤\s*/,""))+"</th>").join("");
    const row=(label,fn)=>"<tr><th>"+clean(label)+"</th>"+items.map(p=>"<td>"+clean(fn(p))+"</td>").join("")+"</tr>";
    const url="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx";
    output.innerHTML='<table class="compare-table"><thead><tr><th>항목</th>'+columns+'</tr></thead><tbody>'
      +row("월 기본료",p=>format(p.monthly_price))
      +row("통신망",p=>p.network==="K"?"KT망":"LG U+망")
      +row("데이터",p=>(p.data_gb??"")+"GB"+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":""))
      +row("소진 후",p=>"최대 "+p.after_speed)
      +row("통화",p=>p.calls)
      +row("문자",p=>p.sms)
      +'<tr><th>가입 조건</th>'+items.map(()=>'<td><a href="'+url+'" target="_blank" rel="noopener noreferrer">공식 목록 확인 ↗</a></td>').join("")+'</tr></tbody></table>';
    track("catalog_compare_open",{plan_ids:items.map(p=>p.id).join(",")});
    if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
  });
  document.getElementById("compare-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  document.addEventListener("click",ev=>{
    const a=ev.target.closest("a");if(!a)return;
    if(a.dataset.action==="official")track("catalog_official_click",{plan_id:a.dataset.plan});
    else if(a.dataset.action==="chat")track("catalog_chat_click");
  });
  paintTray();refresh();
})();
