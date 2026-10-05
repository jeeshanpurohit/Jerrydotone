/**
 * General Portfolio Features
 * Navigation, skills filtering, theme toggle, and contact form
 */

export function initPortfolio() {
  // 1. Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      menuBtn.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        menuBtn.textContent = '☰';
      });
    });
  }

  // 3. Theme Toggle (Dark / Light Mode)
  const themeToggle = document.querySelector('.btn-theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('spider_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? 'LIGHT' : 'DARK';

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('spider_theme', next);
      themeToggle.textContent = next === 'dark' ? 'LIGHT' : 'DARK';
    });
  }

  // 4. Skills Category Filtering
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5. Contact Form Dispatch Simulation
  const contactForm = document.querySelector('.contact-form');
  const formFeedback = document.querySelector('.form-feedback');
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit-contact');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>TRANSMITTING MESSAGE...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        formFeedback.classList.add('success');
        formFeedback.innerHTML = 'Message Received. Jeeshan Purohit will respond promptly.';
        setTimeout(() => {
          formFeedback.classList.remove('success');
        }, 6000);
      }, 1200);
    });
  }
}
