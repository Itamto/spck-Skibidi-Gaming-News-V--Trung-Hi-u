// JS dùng chung: toggle menu mobile + hide loading overlay
(function(){
  function initMobileMenu(){
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if(!btn || !menu) return;
    btn.addEventListener('click', ()=>{
      menu.classList.toggle('hidden');
      menu.classList.add('mobile-menu-enter-active');
      setTimeout(()=> menu.classList.remove('mobile-menu-enter-active'),250);
    });
  }

  function hideOverlay(){
    const overlay = document.getElementById('loading-overlay');
    if(overlay){ overlay.classList.add('opacity-0'); overlay.classList.add('invisible'); }
  }

  if(document.readyState === 'complete'){
    initMobileMenu(); hideOverlay();
  } else {
    window.addEventListener('load', ()=>{ initMobileMenu(); hideOverlay(); });
  }
})();
