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
    '.reveal, .service-card, .lab-badge, .client-logo-card'
  );
  elements.forEach((el) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
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

// ===== ANIMATED STAT COUNTERS =====
(function () {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
})();

// ===== SUBTLE HERO VISUAL PARALLAX =====
(function () {
  const visual = document.getElementById('heroVisual');
  if (!visual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const seal = visual.querySelector('.guarantee-seal');
  if (!seal) return;

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * 12;
    seal.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
})();

// ===== CALLBACK FORM → EMAIL (Web3Forms) =====
(function () {
  const form = document.getElementById('leadForm');
  const errorEl = document.getElementById('formStatus');
  const formWrap = document.getElementById('formWrap');
  const successEl = document.getElementById('formSuccess');
  if (!form || !errorEl || !formWrap || !successEl) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel = submitBtn.querySelector('.btn-label');

  const showError = (msg, focusEl) => {
    errorEl.textContent = msg;
    if (focusEl) focusEl.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const nameEl = form.querySelector('#name');
    const phoneEl = form.querySelector('#phone');
    const cityEl = form.querySelector('#city');

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const city = cityEl.value.trim();
    const phoneDigits = phone.replace(/[^0-9]/g, '');

    if (!name) return showError('Please enter your name.', nameEl);
    if (!phone || phoneDigits.length < 7) return showError('Please enter a valid phone number.', phoneEl);
    if (!city) return showError('Please enter your city or location.', cityEl);

    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Sending…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();

      if (data.success) {
        formWrap.hidden = true;
        successEl.hidden = false;
        form.reset();
      } else {
        showError(data.message || 'Something went wrong. Please try again or use WhatsApp below.');
      }
    } catch (err) {
      showError('Could not send your request. Please check your connection or use WhatsApp below.');
    } finally {
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Submit Request';
    }
  });
})();

// ===== FAQ ACCORDION =====
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
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
