/* =========================================================
   TARA KANYAA — script.js (vanilla JS, no dependencies)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 250);
    });
    // fallback in case load event already fired
    setTimeout(() => loader.classList.add('is-hidden'), 1500);
  }

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);

    const backTop = document.querySelector('.back-to-top');
    if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 700);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Hero Ken Burns slider ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  if (heroSlides.length) {
    let current = 0;
    const showSlide = (idx) => {
      heroSlides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      heroDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      current = idx;
    };
    showSlide(0);
    let heroTimer = setInterval(() => showSlide((current + 1) % heroSlides.length), 6000);
    heroDots.forEach((dot, i) => dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      showSlide(i);
      heroTimer = setInterval(() => showSlide((current + 1) % heroSlides.length), 6000);
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--i', i % 8);
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Floating icons: only after About section ---------- */
  const floatingIcons = document.querySelector('.floating-icons');
  const floatTrigger = document.querySelector('[data-float-trigger]');
  if (floatingIcons) {
    if (floatTrigger && 'IntersectionObserver' in window) {
      const fObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          floatingIcons.classList.toggle('is-visible', entry.boundingClientRect.top < 0 || entry.isIntersecting);
        });
      }, { threshold: 0, rootMargin: '0px' });
      fObserver.observe(floatTrigger);

      // Show once the trigger has been scrolled past (top passes above viewport)
      document.addEventListener('scroll', () => {
        const rect = floatTrigger.getBoundingClientRect();
        floatingIcons.classList.toggle('is-visible', rect.top < window.innerHeight * 0.4);
      }, { passive: true });
    } else if (!floatTrigger) {
      // Pages without a hero (e.g. none) — show by default
      floatingIcons.classList.add('is-visible');
    }
  }

  /* ---------- Nav active link highlighting ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Radio chip groups (booking room/AC type) ---------- */
  document.querySelectorAll('.radio-group').forEach(group => {
    const chips = group.querySelectorAll('.radio-chip');
    chips.forEach(chip => {
      const input = chip.querySelector('input');
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        if (input) input.checked = true;
      });
    });
  });
/* ---------- Generic form validation ---------- */

const validators = {
  name: v => v.trim().length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: v => /^[0-9+\-\s()]{7,15}$/.test(v.trim()),
  required: v => v.trim().length > 0,
  date: v => v.trim().length > 0,
};

document.querySelectorAll('form[data-validate]').forEach(form => {

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    let valid = true;

    // Validation
    form.querySelectorAll('[data-rule]').forEach(input => {

      const rules = input.dataset.rule.split(' ');
      const field = input.closest('.field');
      const value = input.value || '';

      const passed = rules.every(r =>
        validators[r] ? validators[r](value) : true
      );

      if (field) {
        field.classList.toggle('error', !passed);
      }

      if (!passed) {
        valid = false;
      }

    });


    // Check-out must be after check-in

    const checkin = form.querySelector('[name="checkin"]');
    const checkout = form.querySelector('[name="checkout"]');

    if (checkin && checkout && checkin.value && checkout.value) {

      const field = checkout.closest('.field');

      if (new Date(checkout.value) <= new Date(checkin.value)) {

        field.classList.add('error');
        valid = false;

      }

    }


    // Stop if validation fails

    if (!valid) return;



    // ==========================
    // Booking Details
    // ==========================

    const name = form.querySelector("#fullName").value;
    const phone = form.querySelector("#phone").value;
    const email = form.querySelector("#email").value;
    const adults = form.querySelector("#adults").value;
    const children = form.querySelector("#children").value;
    const roomType = form.querySelector("#roomType").value;
    const specialRequest = form.querySelector("#request").value;

    let acPreference = "Either";

    const selectedAC = form.querySelector('input[name="acPref"]:checked');

    if (selectedAC) {

      acPreference = selectedAC.value;

    }



    // ==========================
    // WhatsApp Message
    // ==========================


    const message =

`*NEW ROOM BOOKING REQUEST*

Name :
${name}

Phone :
${phone}

Email :
${email}

Check-In :
${checkin.value}

Check-Out :
${checkout.value}

Adults :
${adults}

Children :
${children}

Room Type :
${roomType}

AC Preference :
${acPreference}

Special Request :
${specialRequest}

-------------------------
Sri Krishna Grand
Rooms & Hall
Kanyakumari`;




    // ==========================
    // YOUR WHATSAPP NUMBER
    // ==========================


    const whatsappNumber = "919629209542";



    // Open WhatsApp

    window.open(

      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,

      "_blank"

    );



    // ==========================
    // Success Message
    // ==========================


    form.style.display = "none";

    const success = form.parentElement.querySelector(".form-success");

    if (success) {

      success.classList.add("is-visible");

    }


  });


  // Remove errors while typing

  form.querySelectorAll('[data-rule]').forEach(input => {

    input.addEventListener('input', () => {

      input.closest('.field')?.classList.remove('error');

    });

  });


});

  /* ---------- Blog search + category filter ---------- */
  const blogSearch = document.querySelector('[data-blog-search]');
  const blogCards = document.querySelectorAll('[data-blog-card]');
  const blogFilters = document.querySelectorAll('[data-blog-filter]');

  const filterBlog = () => {
    const term = (blogSearch?.value || '').toLowerCase().trim();
    const activeFilter = document.querySelector('[data-blog-filter].is-active')?.dataset.blogFilter || 'all';
    blogCards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const cat = card.dataset.category;
      const matchesTerm = !term || title.includes(term);
      const matchesCat = activeFilter === 'all' || cat === activeFilter;
      card.style.display = (matchesTerm && matchesCat) ? '' : 'none';
    });
  };

  if (blogSearch) blogSearch.addEventListener('input', filterBlog);
  blogFilters.forEach(btn => btn.addEventListener('click', () => {
    blogFilters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    filterBlog();
  }));

  /* ---------- Tourist place category filter ---------- */
  const placeFilters = document.querySelectorAll('[data-place-filter]');
  const placeCards = document.querySelectorAll('[data-place-card]');
  placeFilters.forEach(btn => btn.addEventListener('click', () => {
    placeFilters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const val = btn.dataset.placeFilter;
    placeCards.forEach(card => {
      card.style.display = (val === 'all' || card.dataset.category === val) ? '' : 'none';
    });
  }));

  /* ---------- Set min dates on booking form ---------- */
  const todayStr = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => input.min = todayStr);

});
