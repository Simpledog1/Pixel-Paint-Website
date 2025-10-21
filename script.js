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

// ========== SMOOTH SCROLL WITH OFFSET ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const targetPos = target.offsetTop - offset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ========== HOME PAGE - FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('#name');
      const email = this.querySelector('#email');
      const message = this.querySelector('#message');
      const subject = this.querySelector('#subject');
      
      if (!name || !email || !message || !subject) return;
      
      let isValid = true;
      let errors = [];