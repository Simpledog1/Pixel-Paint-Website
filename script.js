/* ========================================
   PIXEL PAINT - JAVASCRIPT
   ======================================== */

// ========== HAMBURGER MENU FUNCTIONALITY ==========
function toggleMenu() {
  const nav = document.getElementById('nav-menu');
  const hamburger = document.getElementById('hamburger');
  
  if (nav && hamburger) {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  }
}

