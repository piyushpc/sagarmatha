/* =========================================================
   SAGARMATHA PESTGUARD — INTERACTIONS
   ========================================================= */

'use strict';

// ===== NAVBAR SCROLL EFFECT =====
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== HAMBURGER MENU =====
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ===== SCROLL REVEAL ANIMATION =====
(function () {
  const elements = document.querySelectorAll(
    '.reveal, .service-card, .process-card, .team-member, .lab-badge, .client-logo-card'
  );
  elements.forEach((el, i) => {
    if(!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    el.style.transitionDelay = (i % 4 * 0.08) + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

// ===== CALLBACK FORM → WhatsApp =====
(function () {
  const form = document.getElementById('leadForm');
  const errorEl = document.getElementById('formStatus');
  if (!form || !errorEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const service = form.querySelector('#service').value.trim();

    if (!name) {
      errorEl.textContent = 'Please enter your name.';
      form.querySelector('#name').focus();
      return;
    }
    if (!phone || phone.length < 7) {
      errorEl.textContent = 'Please enter a valid phone number.';
      form.querySelector('#phone').focus();
      return;
    }

    const msg = [
      'Hello, I am requesting a scientific site inspection from your website.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      service ? 'Requirement: ' + service : '',
    ].filter(Boolean).join('\n');

    const url = 'https://wa.me/9779857033583?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener,noreferrer');

    // Reset form
    form.reset();
    errorEl.textContent = '';
  });
})();

// ===== ACTIVE NAV HIGHLIGHT ON SCROLL =====
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const navH = document.getElementById('navbar')?.offsetHeight || 72;

  const highlight = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 60) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.style.background = link.getAttribute('href') === '#' + current
        ? 'var(--bg-light)'
        : '';
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--primary)'
        : '';
    });
  };

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
})();
