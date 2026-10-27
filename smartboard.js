/* KKM CORE PDFS: student controls. Load AFTER the main <script>. */
(function(){
  const root=document.documentElement;
  const store=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null};
  let zoom=parseFloat(store("kkm_zoom"))||1, theme=store("kkm_theme");

  function applyZoom(){
    zoom=Math.min(1.6,Math.max(.8,Math.round(zoom*10)/10));
    root.style.setProperty("--zoom",zoom); store("kkm_zoom",zoom);
  }
  function applyTheme(){ if(theme) root.dataset.theme=theme }
  applyZoom(); applyTheme();

  /* A- / A+ and light/dark buttons in the top bar */
  const nav=document.querySelector("nav"), login=document.getElementById("loginBtn");
  const add=(id,text,label,fn)=>{
    const b=document.createElement("button");
    b.id=id; b.className="ghost"; b.textContent=text; b.setAttribute("aria-label",label); b.onclick=fn;
    nav.insertBefore(b,login);
  };
  add("fMinus","A\u2212","Smaller text",()=>{zoom-=.1;applyZoom()});
  add("fPlus","A+","Larger text",()=>{zoom+=.1;applyZoom()});
  add("themeBtn","\u25D0 Light / Dark","Switch light or dark theme",()=>{
    const cur=theme||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");
    theme=cur==="dark"?"light":"dark"; store("kkm_theme",theme); applyTheme();
  });


  /* motion tier: full / lite / off, plus a student Motion button */
  const auto=()=>matchMedia("(prefers-reduced-motion:reduce)").matches?"off"
    :((navigator.hardwareConcurrency||4)<=2||(navigator.deviceMemory||4)<=2)?"lite":"full";
  let motionOff=store("kkm_motion")==="off";
  const mBtn=document.createElement("button");
  mBtn.id="motionBtn"; mBtn.className="ghost"; mBtn.setAttribute("aria-label","Turn animations on or off");
  nav.insertBefore(mBtn,login);
  function applyMotion(){
    root.dataset.motion=motionOff?"off":auto();
    mBtn.textContent="\u2728 Motion: "+(motionOff?"Off":"On");
    mBtn.setAttribute("aria-pressed",String(!motionOff));
  }
  mBtn.onclick=()=>{motionOff=!motionOff;store("kkm_motion",motionOff?"off":"on");applyMotion()};
  applyMotion();
  document.addEventListener("visibilitychange",()=>root.toggleAttribute("data-paused",document.hidden));

  /* big previous / next buttons in the file viewer (shown for PDFs, hidden while writing) */
  const win=document.querySelector(".vwin");
  [["l","\u2039","Previous page",()=>prevPg()],["r","\u203A","Next page",()=>nextPg()]].forEach(([side,ch,label,fn])=>{
    const b=document.createElement("button");
    b.className="navbtn "+side; b.textContent=ch; b.setAttribute("aria-label",label); b.onclick=fn;
    win.appendChild(b);
  });

  /* keep the viewer toolbars visible while someone writes on a board in fullscreen */
  document.getElementById("viewer").addEventListener("pointerdown",()=>wake(),{passive:true});
})();
