/* ═══════════════════════════════════════════════
   SytFix — app.js
   ═══════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Theme ── */
var TK='sf-theme';
var pref=localStorage.getItem(TK)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem(TK,t);
  document.querySelectorAll('.theme-btn').forEach(function(b){
    b.textContent=t==='dark'?'☀':'☾';
    b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' mode');
  });
}
applyTheme(pref);
document.addEventListener('click',function(e){
  if(e.target.closest('.theme-btn')){
    applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  }
});

/* ── Loader ── */
function initLoader(){
  var loader=document.getElementById('sf-loader');
  if(!loader)return;
  if(sessionStorage.getItem('sf-seen')){loader.style.display='none';document.body.style.overflow='';fireReady();return;}
  document.body.style.overflow='hidden';
  function dismiss(){
    loader.classList.add('out');
    document.body.style.overflow='';
    sessionStorage.setItem('sf-seen','1');
    setTimeout(fireReady,80);
    loader.removeEventListener('click',dismiss);
  }
  setTimeout(dismiss,2100);
  loader.addEventListener('click',dismiss);
}
function fireReady(){document.dispatchEvent(new Event('sf:ready'));}

/* ── Cursor ── */
function initCursor(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  var dot=document.createElement('div');var ring=document.createElement('div');
  dot.className='sf-dot';ring.className='sf-ring';
  document.body.appendChild(dot);document.body.appendChild(ring);
  var mx=-100,my=-100,rx=-100,ry=-100,first=false;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.transform='translate('+mx+'px,'+my+'px)';
    if(!first){first=true;dot.classList.add('on');ring.classList.add('on');}
  });
  (function lerp(){
    rx+=(mx-rx)*0.11;ry+=(my-ry)*0.11;
    ring.style.transform='translate('+rx+'px,'+ry+'px)';
    requestAnimationFrame(lerp);
  })();
  var HV='a,button,.btn,input,select,textarea,.svc-card,.card,.blog-card,.price-card,.cs-card,.stat-card,.score-card';
  document.addEventListener('mouseover',function(e){if(e.target.closest(HV)){dot.classList.add('hv');ring.classList.add('hv');}});
  document.addEventListener('mouseout',function(e){if(e.target.closest(HV)){dot.classList.remove('hv');ring.classList.remove('hv');}});
  document.addEventListener('mouseleave',function(){dot.classList.remove('on');ring.classList.remove('on');});
  document.addEventListener('mouseenter',function(){if(first){dot.classList.add('on');ring.classList.add('on');}});
}

/* ── Scroll progress ── */
function initProgress(){
  var bar=document.getElementById('sf-bar');
  if(!bar)return;
  window.addEventListener('scroll',function(){
    var tot=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(tot>0?(window.scrollY/tot)*100:0)+'%';
  },{passive:true});
}

/* ── Nav ── */
function initNav(){
  var nav=document.querySelector('.nav');
  var burger=document.querySelector('.burger');
  var mob=document.querySelector('.nav-mob');
  if(!nav)return;
  window.addEventListener('scroll',function(){
    nav.classList.toggle('scrolled',window.scrollY>20);
  },{passive:true});
  if(burger&&mob){
    burger.addEventListener('click',function(){
      var open=mob.classList.toggle('open');
      burger.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',open);
      document.body.style.overflow=open?'hidden':'';
    });
    mob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        mob.classList.remove('open');burger.classList.remove('open');
        document.body.style.overflow='';
      });
    });
  }
  var page=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.nav-mob a').forEach(function(a){
    if((a.getAttribute('href')||'').split('/').pop()===page)a.classList.add('active');
  });
}

/* ── Scramble ── */
var SC='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
function scramble(el,dur){
  if(!el)return;
  var tgt=el.getAttribute('data-text')||el.textContent;
  var chars=tgt.split('');dur=dur||950;
  var revAt=chars.map(function(_,i){return(i/chars.length)*dur*.65+Math.random()*dur*.35;});
  var st=null;
  function frame(ts){
    if(!st)st=ts;var el2=el;
    var elapsed=ts-st;
    el2.textContent=chars.map(function(ch,i){
      if(ch===' ')return ' ';
      if(elapsed>=revAt[i])return ch;
      return SC[Math.floor(Math.random()*SC.length)];
    }).join('');
    if(elapsed<dur)requestAnimationFrame(frame);else el2.textContent=tgt;
  }
  requestAnimationFrame(frame);
}

/* ── Counter ── */
function animCount(el){
  var tgt=parseFloat(el.dataset.target||el.textContent);
  var suf=el.dataset.suffix||'';var pre=el.dataset.prefix||'';
  var dur=parseInt(el.dataset.dur)||1500;var dec=el.dataset.dec==='1';
  var st=null;
  function frame(ts){
    if(!st)st=ts;
    var p=Math.min((ts-st)/dur,1);
    var ease=1-Math.pow(1-p,3);
    var v=tgt*ease;
    el.textContent=pre+(dec?v.toFixed(1):Math.round(v))+suf;
    if(p<1)requestAnimationFrame(frame);else el.textContent=pre+tgt+suf;
  }
  requestAnimationFrame(frame);
}

/* ── Magnetic ── */
function initMagnetic(){
  document.querySelectorAll('.btn-p.btn-xl,.btn-p.btn-lg').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      btn.style.transform='translate('+(e.clientX-r.left-r.width/2)*.26+'px,'+(e.clientY-r.top-r.height/2)*.26+'px)';
    });
    btn.addEventListener('mouseleave',function(){btn.style.transform='';});
  });
}

/* ── Score Card animation ── */
function initTerminal(){
  var card=document.querySelector('.score-card');if(!card)return;
  var fill=card.querySelector('.t-ring-fill');
  var scoreEl=card.querySelector('.t-score-val');
  var checks=card.querySelectorAll('.score-check');
  var tgt=72,ran=false;
  /* circumference for r=60.5: 2*PI*60.5 ≈ 380 */
  var CIRC=380;
  var obs=new IntersectionObserver(function(en){
    if(en[0].isIntersecting&&!ran){
      ran=true;obs.disconnect();
      setTimeout(function(){
        if(fill)fill.style.strokeDashoffset=CIRC-(tgt/100)*CIRC;
      },280);
      if(scoreEl){var s=0;var iv=setInterval(function(){s=Math.min(s+2,tgt);scoreEl.textContent=s;if(s>=tgt)clearInterval(iv);},38);}
      checks.forEach(function(row,i){setTimeout(function(){row.classList.add('in');},480+i*140);});
    }
  },{threshold:0.35});
  obs.observe(card);
}

/* ── Reveal ── */
function initReveal(){
  var obs=new IntersectionObserver(function(en){
    en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});
  },{threshold:0.09});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
  var cObs=new IntersectionObserver(function(en){
    en.forEach(function(e){if(e.isIntersecting){animCount(e.target);cObs.unobserve(e.target);}});
  },{threshold:0.5});
  document.querySelectorAll('[data-counter]').forEach(function(el){cObs.observe(el);});
}

/* ── Parallax ── */
function initParallax(){
  var g=document.querySelector('.hero-grid');if(!g)return;
  window.addEventListener('scroll',function(){g.style.transform='translateY('+(window.scrollY*.08)+'px)';},{passive:true});
}

/* ── Calculator ── */
function initCalc(){
  var wrap=document.querySelector('.calc-grid');if(!wrap)return;
  function fmt(n){if(n>=1e6)return'$'+(n/1e6).toFixed(1)+'M';if(n>=1e3)return'$'+Math.round(n/1e3)+'K';return'$'+Math.round(n).toLocaleString();}
  function upd(){
    var vis=+document.getElementById('r-vis').value;
    var conv=+document.getElementById('r-conv').value/100;
    var val=+document.getElementById('r-val').value;
    var cls=+document.getElementById('r-cls').value/100;
    var tup=+document.getElementById('r-tup').value/100;
    var cup=+document.getElementById('r-cup').value/100;
    document.getElementById('v-vis').textContent=vis.toLocaleString();
    document.getElementById('v-conv').textContent=(conv*100).toFixed(1)+'%';
    document.getElementById('v-val').textContent='$'+val.toLocaleString();
    document.getElementById('v-cls').textContent=Math.round(cls*100)+'%';
    document.getElementById('v-tup').textContent='+'+Math.round(tup*100)+'%';
    document.getElementById('v-cup').textContent='+'+(cup*100).toFixed(1)+'%';
    var cL=Math.round(vis*conv),cC=Math.round(cL*cls),cR=cC*val;
    document.getElementById('c-leads').textContent=cL;
    document.getElementById('c-clients').textContent=cC;
    document.getElementById('c-rev').textContent=fmt(cR);
    var nL=Math.round(vis*(1+tup)*(conv+cup)),nC=Math.round(nL*cls),nR=nC*val;
    document.getElementById('n-leads').textContent=nL;
    document.getElementById('n-clients').textContent=nC;
    document.getElementById('n-rev').textContent=fmt(nR);
    document.getElementById('annual-gain').textContent=fmt((nR-cR)*12);
  }
  document.querySelectorAll('.range').forEach(function(r){r.addEventListener('input',upd);});
  upd();
}

/* ── Audit ── */
function initAudit(){
  var btn=document.getElementById('audit-start');if(!btn)return;
  function esc(x){return String(x||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function normalizeUrl(v){
    v=(v||'').trim();
    if(!v)return '';
    if(!/^https?:\/\//i.test(v))v='https://'+v;
    try{return new URL(v).href.replace(/#.*$/,'');}catch(e){return '';}
  }
  btn.addEventListener('click',async function(){
    var input=(document.getElementById('audit-url')||{}).value||'';
    var url=normalizeUrl(input);
    if(!url){alert('Please enter a valid website URL.');return;}
    document.getElementById('audit-form').style.display='none';
    document.getElementById('audit-prog').style.display='block';
    var LABELS=['Normalizing URL and blocking unsafe hosts','Discovering sitemap and robots.txt','Running multi-page live crawl','Checking internal links and headers','Parsing metadata, schema, AI-readiness and accessibility','Running PageSpeed/Core Web Vitals check','Building scored evidence report'];
    var PCTS=[7,18,34,50,66,84,100];
    var fill=document.getElementById('prog-fill');
    var stepsEl=document.getElementById('prog-steps');
    var i=0, stopped=false;
    function paintStep(){
      if(stopped)return;
      if(i>0){var p=stepsEl.querySelector('[data-s="'+(i-1)+'"]');if(p){p.className='prog-step done';p.textContent='✓ '+LABELS[i-1];}}
      if(i<LABELS.length){
        var c=stepsEl.querySelector('[data-s="'+i+'"]');
        if(c){c.className='prog-step cur';c.textContent='▶ '+LABELS[i]+'...';}
        if(fill)fill.style.width=PCTS[i]+'%';
        i++;setTimeout(paintStep,650+Math.random()*450);
      }
    }
    paintStep();
    try{
      var payload={
        url:url,
        industry:(document.getElementById('audit-industry')||{}).value||'',
        city:(document.getElementById('audit-city')||{}).value||'',
        email:(document.getElementById('audit-email')||{}).value||''
      };
      var r=await fetch('https://sytfix-api.vercel.app/api/scan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      var data=await r.json().catch(function(){return null;});
      if(!r.ok||!data||!data.ok)throw new Error((data&&data.error)||'Live scanner did not return a usable report.');
      /* Normalize response shapes A (top-level score/issues), B (report string), C (report object) */
      var report=data.report;
      if(!report){
        report={score:data.score,issues:data.issues||[],status:data.status,weights:data.weights,scanId:data.scanId,scannedAt:data.scannedAt,sources:data.sources};
      }else if(typeof report==='string'){
        try{report=JSON.parse(report);}catch(pe){throw new Error('Could not parse report JSON: '+pe.message);}
      }
      stopped=true;finishProgress();showResult(report);
    }catch(err){
      stopped=true;finishProgress();showScannerError(url,err);
    }
  });
  function finishProgress(){
    var fill=document.getElementById('prog-fill');if(fill)fill.style.width='100%';
    var stepsEl=document.getElementById('prog-steps');
    if(stepsEl){stepsEl.querySelectorAll('.prog-step').forEach(function(p){p.className='prog-step done'; if(p.textContent.charAt(0)!=='✓')p.textContent='✓ '+p.textContent.replace(/^[○▶]\s*/,'').replace(/\.\.\.$/,'');});}
  }
  function showScannerError(url,err){
    document.getElementById('audit-prog').style.display='none';
    var res=document.getElementById('audit-result');if(!res)return;
    res.style.display='block';
    document.getElementById('res-score').textContent='—';
    var rc=document.getElementById('res-count'); if(rc)rc.textContent='live scan blocked';
    var tag=res.querySelector('.tag'); if(tag)tag.textContent='Scanner Error';
    var ctr=document.getElementById('res-issues');
    if(ctr)ctr.innerHTML='<article class="res-issue res-issue--proof"><div class="ri-head"><span class="ri-badge ri-c">Error</span><strong>Real scan could not complete</strong></div><p>The audit engine is configured to use live website data only. It will not fabricate a score when the backend is unavailable or the target blocks scanning.</p><div class="proof-grid"><div><span class="proof-label">Target</span><code>'+esc(url)+'</code></div><div><span class="proof-label">Backend response</span><code>'+esc(err&&err.message?err.message:err)+'</code></div></div><div class="deduct">No simulated fallback used</div></article>';
    res.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showResult(profile){
    document.getElementById('audit-prog').style.display='none';
    var res=document.getElementById('audit-result');if(!res)return;
    res.style.display='block';
    var score=profile.score!=null?profile.score:'—';
    document.getElementById('res-score').textContent=score;
    var issues=profile.issues||[];
    var rc=document.getElementById('res-count');
    if(rc){
      if(issues.length===0)rc.textContent='no issues found';
      else if(issues.length===1)rc.textContent='1 issue that may be costing you clients';
      else rc.textContent=issues.length+' issues that may be costing you clients';
    }
    /* Score label */
    var tag=res.querySelector('.tag');
    if(tag){
      var s=typeof score==='number'?score:parseInt(score)||0;
      tag.textContent=s>=90?'Excellent':s>=75?'Good':s>=60?'Needs Attention':'Needs Work';
      tag.className='tag'+(s>=90?' tag--good':s>=75?' tag--ok':' tag--warn');
    }
    var ctr=document.getElementById('res-issues');
    if(!ctr)return;
    var html='';
    if(issues.length===0){
      html='<p style="padding:18px 0;color:var(--t2);font-size:.9rem;">No issues were detected. Your site looks healthy.</p>';
    } else {
      html=issues.map(function(iss){
        var cls=iss.s==='c'?'ri-c':iss.s==='w'?'ri-w':iss.s==='p'?'ri-p':'ri-i';
        var lbl=iss.s==='c'?'Critical':iss.s==='w'?'Warning':iss.s==='p'?'Verified':'Info';
        var impact=iss.pts?'<div class="ri-impact">−'+iss.pts+' point'+(iss.pts===1?'':'s')+' off your score</div>':'';
        var proof='';
        if(iss.proof&&iss.proof.length){
          proof='<div class="ri-detail"><span class="ri-detail-label">What we found</span>'
            +iss.proof.map(function(p){return '<code>'+esc(p)+'</code>';}).join('')+'</div>';
        }
        var pages='';
        if(iss.pages&&iss.pages.length){
          pages='<div class="ri-detail"><span class="ri-detail-label">Pages affected</span>'
            +iss.pages.map(function(p){return '<code>'+esc(p)+'</code>';}).join('')+'</div>';
        }
        return '<article class="ri-card">'
          +'<div class="ri-head"><span class="ri-badge '+cls+'">'+lbl+'</span><strong>'+esc(iss.t)+'</strong></div>'
          +'<p class="ri-desc">'+esc(iss.d)+'</p>'
          +proof+pages+impact
          +'</article>';
      }).join('');
    }
    /* Scoring breakdown — only if data exists */
    var w=profile.weights||{};
    if(Object.keys(w).length){
      html+='<div class="score-break"><h4>How your score breaks down</h4><div class="score-bars">'
        +Object.keys(w).map(function(k){
          return '<div class="score-bar"><span>'+esc(k)+'</span><b>'+w[k]+'</b>'
            +'<i style="--w:'+w[k]+'%"></i></div>';
        }).join('')+'</div></div>';
    }
    /* Scan metadata — only if useful data exists */
    var sources=profile.sources||[];
    var scannedAt=profile.scannedAt;
    if(sources.length||scannedAt){
      var dateStr=scannedAt?new Date(scannedAt).toLocaleString():'';
      html+='<div class="score-break ri-meta">'
        +(dateStr?'<p style="font-size:.78rem;color:var(--t3);margin:0 0 6px">Scanned '+dateStr+'</p>':'')
        +(sources.length?'<p style="font-size:.78rem;color:var(--t3);margin:0">Sources checked: '+sources.map(function(s){return esc(s);}).join(', ')+'</p>':'')
        +'</div>';
    }
    ctr.innerHTML=html;
    res.scrollIntoView({behavior:'smooth',block:'start'});
  }
}


/* ── Contact ── */
function initContact(){
  var btn=document.getElementById('contact-btn');if(!btn)return;
  btn.addEventListener('click',function(){
    var name=(document.getElementById('c-name')||{}).value||'';
    var email=(document.getElementById('c-email')||{}).value||'';
    if(!name||!email){alert('Please enter your name and email.');return;}
    btn.textContent='Sending…';btn.disabled=true;
    setTimeout(function(){
      btn.style.display='none';
      var msg=document.getElementById('contact-success');
      if(msg)msg.classList.add('show');
    },1100);
  });
}

/* ── Boot ── */
function boot(){
  initLoader();initCursor();initProgress();initNav();
  initReveal();initTerminal();initParallax();
  initCalc();initAudit();initContact();initMagnetic();
  function doScramble(){
    document.querySelectorAll('[data-scramble]').forEach(function(el){scramble(el,950);});
  }
  if(sessionStorage.getItem('sf-seen'))setTimeout(doScramble,200);
  else document.addEventListener('sf:ready',function(){setTimeout(doScramble,150);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
