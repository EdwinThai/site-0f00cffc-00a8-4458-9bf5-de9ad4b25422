/* ============================================
   LEILA SALONG — SCRIPT.JS
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     NAV SCROLL STATE
  ------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ------------------------------------------
     MOBILE MENU TOGGLE
  ------------------------------------------ */
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      const isOpen = overlay.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      overlay.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------
     FADE-IN VIA INTERSECTION OBSERVER
  ------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      if (prefersReducedMotion) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  /* ------------------------------------------
     FLIP CARD TOUCH SUPPORT (mobile)
  ------------------------------------------ */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(function (card) {
    card.addEventListener('click', function () {
      // Only toggle on touch devices (no hover)
      if (window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('flipped');
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  /* ------------------------------------------
     OPEN/CLOSED STATUS INDICATOR
  ------------------------------------------ */
  function updateOpenStatus() {
    const statusEl = document.getElementById('open-status');
    const dotEl = document.querySelector('.open-dot');
    if (!statusEl || !dotEl) return;

    // Opening hours: Mon–Fri 10:00–18:00, Sat 10:00–16:00, Sun closed
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeNow = hours * 60 + minutes;

    let openFrom = 10 * 60;  // 10:00
    let openTo = 18 * 60;    // 18:00

    let isOpen = false;

    if (day === 0) {
      // Sunday — closed
      isOpen = false;
    } else if (day === 6) {
      // Saturday — 10:00–16:00
      openTo = 16 * 60;
      isOpen = timeNow >= openFrom && timeNow < openTo;
    } else {
      // Mon–Fri — 10:00–18:00
      isOpen = timeNow >= openFrom && timeNow < openTo;
    }

    if (isOpen) {
      dotEl.classList.add('is-open');
      dotEl.classList.remove('is-closed');
      statusEl.textContent = 'Öppet nu';
    } else {
      dotEl.classList.add('is-closed');
      dotEl.classList.remove('is-open');
      statusEl.textContent = 'Stängt just nu';
    }
  }

  updateOpenStatus();

  /* ------------------------------------------
     COUNT-UP ANIMATION FOR RATING NUMBER
  ------------------------------------------ */
  const ratingNumberEl = document.querySelector('.rating-number');
  if (ratingNumberEl && !prefersReducedMotion) {
    const target = 4.7;
    let started = false;

    const countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            let start = 0;
            const duration = 1200;
            const startTime = performance.now();

            function step(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const value = start + (target - start) * eased;
              ratingNumberEl.textContent = value.toFixed(1);
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                ratingNumberEl.textContent = target.toFixed(1);
              }
            }
            requestAnimationFrame(step);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    countObserver.observe(ratingNumberEl);
  }

})();