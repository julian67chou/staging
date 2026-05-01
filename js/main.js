/**
 * Block Studio × 伊萊診所 — Motion Engine
 * Dynamic scroll animations, parallax, mouse effects
 */

(function() {
  'use strict';

  // ── 1. LOADING SCREEN ──
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('loaded');
    }, 800);
  });

  // ── 2. NAV SCROLL EFFECT ──
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  // ── 3. INTERSECTION OBSERVER — Scroll Reveal ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => revealObserver.observe(el));

  // ── 4. PARALLAX HERO MOUSE EFFECT (Block Studio signature) ──
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg img');

  if (hero && heroBg) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroBg.style.transform = `scale(1.08) translate(${x * 20}px, ${y * 12}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = 'scale(1.05) translate(0, 0)';
    });
  }

  // ── 5. SCROLL PARALLAX ON HERO ──
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroBg && y < window.innerHeight) {
      const rate = y * 0.3;
      heroBg.style.transform = heroBg.style.transform.replace(/translate\([^)]+\)/, '') + 
        ` translateY(${rate}px)`;
    }
  }, { passive: true });

  // ── 6. SERVICE CARDS STAGGER ANIMATION ──
  const serviceCards = document.querySelectorAll('.service-card');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.service-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const serviceGrid = document.querySelector('.service-grid');
  if (serviceGrid) staggerObserver.observe(serviceGrid);

  // ── 7. MOBILE NAV TOGGLE ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── 8. COUNTER ANIMATION (for stats if any) ──
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString();
        }, 30);
        countObserver.unobserve(el);
      }
    });
  });

  document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

  // ── 9. SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 10. TREATMENT ITEMS HOVER SOUND (visual only, no audio) ──
  // Just adds a subtle class for the arrow animation

  console.log('🏥 伊萊診所 × Block Studio Motion Engine initialized');

})();
