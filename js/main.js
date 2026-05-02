/* ═══════════════════════════════════════════
   無糖律師 × 蠟筆小新 — 實驗版
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── LOADER ───
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('loaded'), 400);
  });

  // ─── MOBILE NAV ───
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.innerHTML = navLinks.classList.contains('open')
        ? '<i class="bi bi-x"></i>'
        : '<i class="bi bi-list"></i>';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        el.classList.add('revealed');
      }
    });
  };

  // Check on load
  window.addEventListener('load', revealOnScroll);
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // immediate check

  // ─── NAV BACKGROUND ON SCROLL ───
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(45, 74, 62, 0.98)';
      nav.style.borderBottomColor = 'rgba(200, 150, 62, 0.2)';
    } else {
      nav.style.background = 'rgba(45, 74, 62, 0.92)';
      nav.style.borderBottomColor = 'rgba(200, 150, 62, 0.15)';
    }
  });

  // ─── SMOOTH PARALLAX (subtle) ───
  const parallaxLayer = document.querySelector('.parallax-layer');
  if (parallaxLayer) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxLayer.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
  }

  // ─── FLOATING NO-SUGAR EMOJIS ───
  // Add subtle floating candy emojis to the hero
  const hero = document.querySelector('.hero');
  if (hero) {
    const emojis = ['🍬', '❌', '💼', '⚖️'];
    for (let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[i];
      span.style.cssText = `
        position: absolute; z-index: 1; opacity: 0.08;
        font-size: ${4 + Math.random() * 4}rem;
        top: ${10 + Math.random() * 80}%;
        left: ${5 + Math.random() * 90}%;
        pointer-events: none;
        animation: floatEmoji ${6 + Math.random() * 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      hero.appendChild(span);
    }
    // Add keyframes for floating emojis
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatEmoji {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        33% { transform: translateY(-20px) rotate(5deg); }
        66% { transform: translateY(10px) rotate(-3deg); }
      }
    `;
    document.head.appendChild(style);
  }

})();
