(() => {
  "use strict";
  const form=document.querySelector("#postpaid-finder-form");
  const output=document.querySelector("#postpaid-finder-results");
  const dataset=document.querySelector("#postpaid-finder-data");
  if(!form||!output||!dataset)return;
  let data;
  try{data=JSON.parse(dataset.textContent)}catch(e){output.textContent="상품 정보를 불러오지 못했습니다.";return}
  const money=n=>new Intl.NumberFormat("ko-KR").format(n)+"원";
  const escapeText=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const benefits=new Map(data.benefits.map(b=>[b.id,b.name]));
  const action="https://www.n-telecom.co.kr/59man/view/plan/phone_plan.aspx";
  const status=(p,join)=>join==="port"?(p.port_available===true?"번호이동 가능 자료 있음":"번호이동 가능 여부 별도 확인"):join==="new"?(p.new_available===true?"신규가입 가능 자료 있음":"신규가입 가능 여부 별도 확인"):"가입 방식별 확인 필요";
  const label=p=>p.data_gb!==null&&p.data_gb!==undefined?p.data_gb+"GB"+(p.daily_data_gb?" + 매일 "+p.daily_data_gb+"GB":""):p.daily_data_gb?"매일 "+p.daily_data_gb+"GB":"기본 제공량 별도 확인";
  function track(event,values){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:event,site_section:"postpaid_experiment",...values});
  }
  form.addEventListener("submit",ev=>{
    ev.preventDefault();
    const vals=new FormData(form);
    const budget=Number(vals.get("budget"));
    const minGb=Number(vals.get("data"));
    const network=vals.get("network");
    const calls=vals.get("calls");
    const join=vals.get("join");
    const choices=data.plans.filter(p=>p.monthly_price<=budget
      &&(minGb===0||(typeof p.data_gb==="number"&&p.data_gb>=minGb))
      &&(network==="any"||p.network===network)
      &&(calls==="any"||p.calls.startsWith("기본제공"))
    ).sort((a,b)=>a.monthly_price-b.monthly_price||((b.data_gb||0)-(a.data_gb||0)));
    track("postpaid_finder_submit",{budget_band:budget,data_min_gb:minGb,network:network,call_mode:calls,join_type:join,match_count:choices.length});
    if(!choices.length){
      output.innerHTML='<div class="finder-empty"><strong>선택한 조건에 맞는 상품이 없습니다.</strong><p>예산을 높이거나 기본 데이터 기준을 낮춰 다시 검색해 보세요. 자료에 없는 상품이 존재할 수도 있으므로 공식 알뜰폰 요금제 목록도 확인할 수 있습니다.</p><a href="'+action+'" target="_blank" rel="noopener noreferrer">공식 알뜰폰 요금제 확인 ↗</a></div>';
      return;
    }
    const top=[];
    const seenProfiles=new Set();
    for(const plan of choices){
      const profile=[plan.data_gb??"none",plan.daily_data_gb??"none",plan.after_speed,plan.calls.startsWith("기본제공")?"basic":"limited"].join("|");
      if(seenProfiles.has(profile))continue;
      seenProfiles.add(profile);
      top.push(plan);
      if(top.length===3)break;
    }
    if(top.length<3)for(const plan of choices){
      if(top.some(p=>p.id===plan.id))continue;
      top.push(plan);
      if(top.length===3)break;
    }
    output.innerHTML='<h3>조건에 해당하는 알뜰폰 요금제 '+choices.length+'개 중 데이터 구간별 대표 3개</h3><p class="finder-count">2026년 9월 28일 자료 기준입니다. ‘가격이 낮다’는 이유만으로 가입 가능한 최적의 상품이라는 의미는 아닙니다.</p><div class="finder-matches">'
      +top.map((p,i)=>{
        const benefit=p.benefit_ids.map(id=>benefits.get(id)).filter(Boolean).join(" · ");
        return '<article class="finder-match"><div class="match-top"><span class="match-number">'+(i+1)+'번 비교</span><span>'+(p.network==="K"?"KT망":"LG U+망")+'</span></div><h4>'+escapeText(p.name.replace(/^앤텔레콤\s*/,""))+'</h4><strong class="match-price">월 '+money(p.monthly_price)+'</strong><dl><div><dt>기본 데이터</dt><dd>'+escapeText(label(p))+'</dd></div><div><dt>데이터 소진 후</dt><dd>최대 '+escapeText(p.after_speed||"별도 확인")+'</dd></div><div><dt>일반통화</dt><dd>'+escapeText(p.calls.startsWith("기본제공")?"기본제공":p.calls)+'</dd></div><div><dt>가입 방식</dt><dd>'+escapeText(status(p,join))+'</dd></div>'+(benefit?'<div><dt>제휴혜택</dt><dd>'+escapeText(benefit)+' (조건 확인)</dd></div>':"")+'</dl><a class="button match-cta" href="'+action+'" data-plan="'+escapeText(p.id)+'" target="_blank" rel="noopener noreferrer">공식 상품 조건 확인 ↗</a></article>'
      }).join("")+'</div><p class="notice">현재 판매 여부·유심 호환·가입 심사·프로모션은 공식 신청 화면에서 최종 확인해야 합니다. 번호이동 가능 여부가 미확인된 상품은 별도 확인이 필요합니다.</p>';
  });
  document.addEventListener("click",ev=>{
    const target=ev.target.closest("a");
    if(!target)return;
    if(target.matches(".match-cta"))track("postpaid_finder_plan_click",{plan_id:target.dataset.plan||"unknown"});
    else if(target.href.includes("www.n-telecom.co.kr"))track("postpaid_official_click",{destination:"official_plan_listing"});
    else if(target.href.includes("pf.kakao.com"))track("postpaid_chat_click",{destination:"kakao_chat"});
  });
})();