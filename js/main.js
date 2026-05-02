// ══════════════════════════════════════════
// 伊萊診所 × 日濟安風格 — Main JS
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Loader ──
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // fallback: hide loader after 3s if load event doesn't fire
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ── Header scroll effect ──
  const header = document.querySelector('header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  });

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toggleIcon = navToggle.querySelector('i');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggleIcon.className = navLinks.classList.contains('open') ? 'bi bi-x-lg' : 'bi bi-list';
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleIcon.className = 'bi bi-list';
    });
  });

  // ── Scroll reveal (Intersection Observer) ──
  const revealEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
