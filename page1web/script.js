(function () {
  'use strict';

  /* ============================================================
     Helper: detect touch/coarse-pointer device
     ============================================================ */
  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

  /* ============================================================
     1. Nav scroll state
     ============================================================ */
  const nav = document.getElementById('main-nav');

  function updateNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll(); // run on load in case page is already scrolled

  /* ============================================================
     2. Hamburger toggle
     ============================================================ */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close menu when any nav link is clicked
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        if (hamburger) {
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    }
  });

  /* ============================================================
     3. Card 3D tilt (desktop / non-touch only)
     ============================================================ */
  function initCardTilt() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = e.clientX - cx;
        const dy     = e.clientY - cy;
        const maxTilt = 8;

        // rotateX is inverted: cursor above center → tilt top toward viewer
        const rotateX = -(dy / (rect.height / 2)) * maxTilt;
        const rotateY =  (dx / (rect.width  / 2)) * maxTilt;

        card.style.transform =
          'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  if (!isTouchDevice()) {
    initCardTilt();
  }

  /* ============================================================
     4. IntersectionObserver — scroll-triggered step entrance
        (runs on both touch and non-touch devices)
     ============================================================ */
  const steps = document.querySelectorAll('.step');

  if ('IntersectionObserver' in window && steps.length > 0) {
    const stepObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    steps.forEach(function (step) {
      stepObserver.observe(step);
    });
  } else {
    // Fallback: make all steps visible if IntersectionObserver unavailable
    steps.forEach(function (step) {
      step.classList.add('visible');
    });
  }

  /* ============================================================
     5. Parallax (desktop / non-touch only)
     ============================================================ */
  function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroRingWrap = document.querySelector('.hero-ring-wrap');

    if (!heroContent || !heroRingWrap) return;

    function onScroll() {
      const scrollY = window.scrollY;
      heroContent.style.transform  = 'translateY(' + (scrollY * 0.2) + 'px)';
      heroRingWrap.style.transform = 'translateY(calc(-50% + ' + (scrollY * 0.4) + 'px))';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!isTouchDevice()) {
    initParallax();
  }

}());
