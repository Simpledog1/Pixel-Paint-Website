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

      // Name validation
      if (name.value.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
        isValid = false;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        errors.push('Please enter a valid email address');
        isValid = false;
      }
      
      // Subject validation
      if (subject.value === '') {
        errors.push('Please select a subject');
        isValid = false;
      }
      
      // Message validation
      if (message.value.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
        isValid = false;
      }
      
      // Display errors or submit
      if (!isValid) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
      } else {
        alert('Thank you for your message! We\'ll get back to you soon.');
        this.reset();
      }
    });
  }
});

// ========== EDITOR PAGE FUNCTIONALITY ==========

// Global State for Editor
let gridSize = 32;
let zoom = 1;
let currentColor = '#8B5CF6';
let currentTool = 'brush';
let brushSize = 1;
let layers = [
  { id: 1, name: 'Layer 1', visible: true, pixels: {} }
];
let activeLayerId = 1;
let nextLayerId = 2;
let isDrawing = false;

const colors = [
  '#000000', '#FFFFFF', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#3B82F6', '#EF4444', '#6B7280', '#14B8A6'
];
