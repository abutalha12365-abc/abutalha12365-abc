/* ============================================================
   LIGHT UPON LIGHT QURAN ACADEMY — script.js
   ============================================================ */

/* ---------- NAVBAR ---------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  handleBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ---------- ACTIVE NAV LINK ---------- */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let currentId = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      currentId = sec.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentId) {
      link.classList.add('active');
    }
  });
}

/* ---------- SMOOTH SCROLL (for older browsers) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Don't unobserve — keep for possible re-entry
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration = 1800) {
  let startTime = null;
  const start = 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.floor(ease * (target - start) + start);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// Both hero stats and about stats
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---------- TESTIMONIAL SLIDER ---------- */
const track   = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('testimonialDots');

const cards = document.querySelectorAll('.testimonial-card');
let currentSlide = 0;
let autoSlideTimer = null;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('testimonial-dot');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  cards.forEach((card, i) => {
    card.style.opacity = i === index ? '1' : '0.4';
  });
  track.style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll('.testimonial-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  goToSlide((currentSlide + 1) % cards.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + cards.length) % cards.length);
}

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

function startAutoSlide() {
  autoSlideTimer = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? nextSlide() : prevSlide();
    resetAutoSlide();
  }
});

// Pause on hover
const sliderWrapper = document.getElementById('testimonialSlider');
sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
sliderWrapper.addEventListener('mouseleave', startAutoSlide);

// Init
goToSlide(0);
startAutoSlide();

/* ---------- FORM VALIDATION ---------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validatorFn, errorMsg) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(errorId);
  const valid = validatorFn(field.value.trim());
  if (!valid) {
    errorEl.textContent = errorMsg;
    field.style.borderColor = '#c0392b';
    return false;
  }
  errorEl.textContent = '';
  field.style.borderColor = '';
  return true;
}

function isNotEmpty(val) { return val.length > 0; }
function isValidEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

// Live validation on blur
document.getElementById('name').addEventListener('blur', () => {
  validateField('name', 'nameError', isNotEmpty, 'Please enter your full name.');
});
document.getElementById('email').addEventListener('blur', () => {
  validateField('email', 'emailError', isValidEmail, 'Please enter a valid email address.');
});
document.getElementById('course').addEventListener('blur', () => {
  validateField('course', 'courseError', isNotEmpty, 'Please select a course.');
});
document.getElementById('message').addEventListener('blur', () => {
  validateField('message', 'messageError', val => val.length >= 10, 'Please enter a message (at least 10 characters).');
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameOk    = validateField('name',    'nameError',    isNotEmpty,      'Please enter your full name.');
  const emailOk   = validateField('email',   'emailError',   isValidEmail,    'Please enter a valid email address.');
  const courseOk  = validateField('course',  'courseError',  isNotEmpty,      'Please select a course.');
  const messageOk = validateField('message', 'messageError', val => val.length >= 10, 'Please enter a message (at least 10 characters).');

  if (nameOk && emailOk && courseOk && messageOk) {
    // Simulate form submission (replace with real backend/EmailJS/Formspree)
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => formSuccess.classList.remove('show'), 8000);
    }, 1500);
  }
});

/* ---------- BACK TO TOP ---------- */
const backToTopBtn = document.getElementById('backToTop');

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- HERO COUNTER TRIGGER ---------- */
// Hero stats use the same counterObserver above, so no extra code needed.

/* ---------- PAGE LOAD ENHANCEMENT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class after a tick to trigger initial animations
  setTimeout(() => document.body.classList.add('loaded'), 100);
  // Trigger navbar scroll check
  if (window.scrollY > 60) navbar.classList.add('scrolled');
});
