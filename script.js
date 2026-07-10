/* =========================================================
   ProLift Careers — Platform Interactions & Animations
   Scroll reveal · Pricing calculator · Currency switcher · Lead Capture
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const active = menuBtn.classList.toggle('active');
      nav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', active);
      document.body.classList.toggle('menu-open', active);
    });

    // Close menu when navigation links are clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // 2. Pricing Tab Switching
  const tabs = document.querySelectorAll('.pt-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetId = tab.getAttribute('data-target');
      const panels = document.querySelectorAll('.pricing-panel');
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', 'true');
        }
      });
    });
  });

  // 3. Dynamic Currency & Pricing System (7 currencies, launch + standard prices)
  const currencyConfig = {
    INR: { symbol: '₹', locale: 'en-IN' },
    USD: { symbol: '$', locale: 'en-US' },
    GBP: { symbol: '£', locale: 'en-GB' },
    EUR: { symbol: '€', locale: 'en-IE' },
    AED: { symbol: 'د.إ', locale: 'en-AE' },
    CAD: { symbol: 'C$', locale: 'en-CA' },
    AUD: { symbol: 'A$', locale: 'en-AU' }
  };

  // Launch prices (currently active)
  const launchPrices = {
    "Starter":              { INR: 19999, USD: 219, GBP: 159, EUR: 189, AED: 799,  CAD: 299, AUD: 319 },
    "Growth":               { INR: 29999, USD: 329, GBP: 249, EUR: 289, AED: 1199, CAD: 449, AUD: 479 },
    "Global Premium":       { INR: 39999, USD: 449, GBP: 339, EUR: 399, AED: 1649, CAD: 599, AUD: 649 },
    "Resume":               { INR: 2499,  USD: 29,  GBP: 25,  EUR: 29,  AED: 109,  CAD: 39,  AUD: 45 },
    "LinkedIn Profile Plus": { INR: 3999,  USD: 45,  GBP: 39,  EUR: 45,  AED: 169,  CAD: 65,  AUD: 69 },
    "Resume + LinkedIn Bundle": { INR: 5999, USD: 69, GBP: 59, EUR: 65, AED: 249, CAD: 95, AUD: 99 }
  };

  // Standard prices (struck-through anchor)
  const standardPrices = {
    "Starter":              { INR: 26999, USD: 289, GBP: 209, EUR: 249, AED: 1059, CAD: 399, AUD: 419 },
    "Growth":               { INR: 39999, USD: 439, GBP: 329, EUR: 389, AED: 1599, CAD: 599, AUD: 639 },
    "Global Premium":       { INR: 52999, USD: 599, GBP: 449, EUR: 529, AED: 2199, CAD: 799, AUD: 859 }
  };

  let activeCurrency = 'INR';

  function formatPrice(amount, currency) {
    const config = currencyConfig[currency];
    if (!config) return String(amount);
    const formatted = amount.toLocaleString(config.locale);
    return config.symbol + formatted;
  }

  function updatePricing() {
    const plans = document.querySelectorAll('.plan');
    plans.forEach(plan => {
      const planName = plan.getAttribute('data-plan-name');
      
      // Update launch (main) price
      const priceDisplay = plan.querySelector('[data-price]');
      const launchAmt = launchPrices[planName] ? launchPrices[planName][activeCurrency] : 0;
      if (priceDisplay) {
        priceDisplay.textContent = formatPrice(launchAmt, activeCurrency);
      }

      // Update standard (struck-through) price if it exists
      const standardDisplay = plan.querySelector('[data-standard-price]');
      if (standardDisplay && standardPrices[planName]) {
        const standardAmt = standardPrices[planName][activeCurrency];
        standardDisplay.textContent = formatPrice(standardAmt, activeCurrency);
      }
    });
  }

  // Currency Switcher Buttons
  const curBtns = document.querySelectorAll('.cur-btn');
  curBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      curBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      activeCurrency = btn.getAttribute('data-currency');
      updatePricing();
    });
  });

  // Plan CTA Lead Pre-fill
  const planCtaButtons = document.querySelectorAll('.plan-cta');
  planCtaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.plan');
      if (plan) {
        const planName = plan.getAttribute('data-plan-name');
        const concernTextarea = document.getElementById('f-concern');
        if (concernTextarea) {
          concernTextarea.value = `Hi Meet, I am interested in the "${planName}" package. I would like a free profile review.`;
        }
        
        const nameInput = document.getElementById('f-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 800);
        }
      }
    });
  });

  // 4. Scroll Reveal Animations System
  const animTargets = [
    '.service-tile',
    '.about-stat',
    '.match-card'
  ];

  animTargets.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        const delay = (index % 4) * 100;
        el.style.setProperty('--reveal-delay', `${delay}ms`);
      }
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 5. Stat Counter Numbers Animation
  const countElements = document.querySelectorAll('[data-count-to]');
  if (countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count-to'));
          const suffix = el.getAttribute('data-count-suffix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);
            
            el.textContent = currentCount + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCount);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));
  }

  // 6. Cursor Glow Tracking
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // 7. Dynamic WhatsApp Message Generation & Lead Submit
  const startForm = document.getElementById('startForm');
  const startFormSuccess = document.getElementById('startFormSuccess');
  const startWhatsapp = document.getElementById('startWhatsapp');
  const successWhatsapp = document.getElementById('successWhatsapp');
  const waNumber = "917436053507";

  function getWhatsAppMessage() {
    const name = document.getElementById('f-name')?.value || '';
    const email = document.getElementById('f-email')?.value || '';
    const phone = document.getElementById('f-phone')?.value || '';
    const country = document.getElementById('f-country')?.value || '';
    const role = document.getElementById('f-role')?.value || '';
    const linkedin = document.getElementById('f-linkedin')?.value || '';
    const concern = document.getElementById('f-concern')?.value || '';

    let msg = `Hi Meet! I would like a free profile review on ProLift Careers. Here are my details:\n`;
    if (name) msg += `- Name: ${name}\n`;
    if (email) msg += `- Email: ${email}\n`;
    if (phone) msg += `- WhatsApp: ${phone}\n`;
    if (country) msg += `- Target Country: ${country}\n`;
    if (role) msg += `- Target Role: ${role}\n`;
    if (linkedin) msg += `- LinkedIn: ${linkedin}\n`;
    if (concern) msg += `- Concern: ${concern}\n`;

    return encodeURIComponent(msg);
  }

  // Bind input changes to pre-load Whatsapp link
  const formFields = document.querySelectorAll('#startForm input, #startForm select, #startForm textarea');
  formFields.forEach(field => {
    field.addEventListener('input', () => {
      if (startWhatsapp) {
        startWhatsapp.href = `https://wa.me/${waNumber}?text=${getWhatsAppMessage()}`;
      }
    });
  });

  if (startForm) {
    startForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = startForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      });

      if (!isValid) return;

      if (startFormSuccess) {
        startFormSuccess.removeAttribute('hidden');
        startFormSuccess.style.display = 'block';
      }

      if (successWhatsapp) {
        successWhatsapp.href = `https://wa.me/${waNumber}?text=${getWhatsAppMessage()}`;
      }
    });
  }

  // Initialize totals on load
  updatePricing();
});
