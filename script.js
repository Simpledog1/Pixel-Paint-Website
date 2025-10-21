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

// Event listener for hamburger menu
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }


  // Close menu when clicking nav links on mobile
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        const nav = document.getElementById('nav-menu');
        if (nav) {
          nav.classList.remove('active');
        }
      }
    });
  });
});