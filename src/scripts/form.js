/* ============================================================
   LEAD FUNNEL LOGIC
   ============================================================ */

// ----- LeadMailbox / CRM integration point -----
// Set this to your LeadMailbox lead-post endpoint (or a serverless
// function / Zapier / Make webhook that forwards into LeadMailbox).
// While empty, the form simulates a successful submit so you can demo it.
const LEAD_ENDPOINT = "/api/submit-lead"; // Vercel relay -> LeadMailbox (swap to your Make webhook URL if using Make)

const STATES = ["Alabama", "Arkansas", "California", "Connecticut", "Florida", "Idaho", "Indiana", "Iowa", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Mississippi", "Montana", "New Jersey", "New Mexico", "New York", "North Carolina", "Ohio", "Oklahoma", "Pennsylvania", "South Carolina", "Tennessee", "Texas", "Washington", "Wyoming"];
// ============================================================
// STATE LICENSING / AUTHORIZATION CONTROLS
// Only the 26 states where Jake / United Mortgage Corp. are licensed
// appear in the dropdown above. Two settings below let compliance
// (a) show a state-specific notice under the dropdown, and (b) block
// submissions outright for any state not authorized for this form.
// >>> UMC COMPLIANCE TO CONFIRM exact wording, which states need a
//     notice, and which (if any) to block. NY text below mirrors the
//     disclaimer UMC uses on its other web properties as a starting point.
// ============================================================
const STATE_NOTICES = {
  "New York": "This site is not authorized by the New York Department of Financial Services. No mortgage loan applications for properties in New York will be accepted through this site. This form is an inquiry only — not a loan application."
};
const BLOCKED_STATES = []; // e.g. ["New York"] to stop submissions entirely
(function(){
  const sel = document.getElementById('state');
  STATES.forEach(s=>{const o=document.createElement('option');o.textContent=s;sel.appendChild(o);});
})();
const stateSel = document.getElementById('state');
const stateNotice = document.getElementById('stateNotice');
function updateStateNotice(){
  const v = stateSel.value, note = STATE_NOTICES[v];
  if(note){ stateNotice.textContent = note; stateNotice.hidden = false;
            stateNotice.classList.toggle('blocked', BLOCKED_STATES.includes(v)); }
  else { stateNotice.hidden = true; stateNotice.classList.remove('blocked'); }
}
stateSel.addEventListener('change', updateStateNotice);

const data = {goal:"",state:"",timeline:"",price:"",agent:"",firstName:"",lastName:"",email:"",phone:"",consent:false};
let step = 1;
const TOTAL = 5;

const bar   = document.getElementById('bar');
const back  = document.getElementById('back');
const next  = document.getElementById('next');
const steps = [...document.querySelectorAll('.step')];

function render(){
  steps.forEach(s=>s.classList.toggle('active', +s.dataset.step===step));
  bar.style.width = (step/TOTAL*100)+'%';
  back.style.display = step>1 ? 'inline-flex' : 'none';
  next.textContent = step===TOTAL ? 'See my options →' : 'Continue';
  const first = steps[step-1].querySelector('input,select');
  if(first){ setTimeout(()=>first.focus({preventScroll:true}),60); }
}

// option-card selection
document.querySelectorAll('.opts').forEach(group=>{
  group.querySelectorAll('.opt').forEach(opt=>{
    opt.addEventListener('click',()=>{
      group.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));
      opt.classList.add('sel');
      data[group.dataset.field] = opt.dataset.value;
      // auto-advance on choice-style steps
      setTimeout(()=>{ if(step<TOTAL){ step++; render(); } }, 240);
    });
  });
});

function markInvalid(name, bad){
  const el = document.querySelector(`[data-validate="${name}"]`);
  if(el) el.classList.toggle('invalid', bad);
}

function validateStep(){
  if(step===1) return !!data.goal;
  if(step===2){ data.state=stateSel.value; const chosen=!!data.state; markInvalid('state',!chosen); if(chosen && BLOCKED_STATES.includes(data.state)){ updateStateNotice(); return false; } return chosen; }
  if(step===3) return !!data.timeline;
  if(step===4){ data.price=document.getElementById('price').value; data.agent=document.getElementById('agent').value; const ok=!!data.price; markInvalid('price',!ok); return ok; }
  if(step===5){
    data.firstName=document.getElementById('firstName').value.trim();
    data.lastName=document.getElementById('lastName').value.trim();
    data.email=document.getElementById('email').value.trim();
    data.phone=document.getElementById('phone').value.trim();
    data.consent=document.getElementById('consent').checked;
    const firstOk=data.firstName.length>0;
    const lastOk=data.lastName.length>0;
    const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const phoneOk=data.phone.replace(/\D/g,'').length>=10;
    markInvalid('firstName',!firstOk); markInvalid('lastName',!lastOk); markInvalid('email',!emailOk);
    markInvalid('phone',!phoneOk); markInvalid('consent',!data.consent);
    return firstOk&&lastOk&&emailOk&&phoneOk&&data.consent;
  }
  return true;
}

next.addEventListener('click',()=>{
  if(!validateStep()) return;
  if(step<TOTAL){ step++; render(); }
  else submitLead();
});
back.addEventListener('click',()=>{ if(step>1){ step--; render(); }});

function fireConversion(){
  // Google Ads conversion event — uncomment the gtag loader in <head> first.
  if(typeof gtag==='function'){
    gtag('event','conversion',{'send_to':'AW-XXXXXXXXX/your_conversion_label'});
  }
}

async function submitLead(){
  next.disabled=true; next.textContent='Sending…';
  const payload={
    ...data,
    source:'Google Ads – Homebuyer Funnel',
    submittedAt:new Date().toISOString(),
    page:location.href
  };
  try{
    if(LEAD_ENDPOINT){
      await fetch(LEAD_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    }else{
      console.log('LEAD CAPTURED (no endpoint set):',payload);
      await new Promise(r=>setTimeout(r,700));
    }
    fireConversion();
    document.getElementById('leadForm').style.display='none';
    document.getElementById('success').classList.add('show');
    document.querySelector('.progress').style.display='none';
  }catch(err){
    console.error(err);
    next.disabled=false; next.textContent='See my options →';
    alert('Something went wrong sending your request. Please try again or call us directly.');
  }
}

render();