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

  // 3. Dynamic Currency & Pricing Calculation System
  const currencyRates = {
    INR: { symbol: '₹', rate: 1 },
    USD: { symbol: '$', rate: 0.012 },
    AED: { symbol: 'د.إ', rate: 0.044 },
    CAD: { symbol: 'C$', rate: 0.016 }
  };

  const planPrices = {
    "Starter Apply": { INR: 14999, USD: 199, AED: 699, CAD: 249 },
    "Growth Apply": { INR: 24999, USD: 299, AED: 1099, CAD: 399 },
    "Global Premium": { INR: 49999, USD: 599, AED: 2199, CAD: 799 },
    "Fresher Resume": { INR: 999, USD: 15, AED: 49, CAD: 19 },
    "Professional Resume": { INR: 1799, USD: 25, AED: 89, CAD: 35 },
    "LinkedIn Profile Plus": { INR: 3999, USD: 49, AED: 179, CAD: 69 }
  };

  const addonPrices = {
    "We Find Jobs": { INR: 1999, USD: 25, AED: 89, CAD: 35 },
    "AI Custom Resumes": { INR: 1999, USD: 25, AED: 89, CAD: 35 },
    "Expert Resume Writing": { INR: 1999, USD: 25, AED: 89, CAD: 35 },
    "LinkedIn Makeover": { INR: 1999, USD: 25, AED: 89, CAD: 35 },
    "LinkedIn Premium Rebuild": { INR: 1999, USD: 25, AED: 89, CAD: 35 }
  };

  // Adjust Starter specific addon prices if needed
  const starterAddonOverrides = {
    "We Find Jobs": { INR: 1499, USD: 19, AED: 69, CAD: 25 },
    "AI Custom Resumes": { INR: 1499, USD: 19, AED: 69, CAD: 25 }
  };

  let activeCurrency = 'INR';

  function formatPrice(amount, currency) {
    const symbol = currencyRates[currency]?.symbol || '';
    if (currency === 'INR') {
      return symbol + amount.toLocaleString('en-IN');
    } else {
      return symbol + amount.toLocaleString('en-US');
    }
  }

  function calculatePlanTotal(plan) {
    const planName = plan.getAttribute('data-plan-name');
    const baseAmt = planPrices[planName] ? planPrices[planName][activeCurrency] : 0;

    const checkedAddons = plan.querySelectorAll('.addon input[type="checkbox"]:checked');
    let addonsTotal = 0;
    
    checkedAddons.forEach(checkbox => {
      const addonName = checkbox.getAttribute('data-addon-name');
      let priceMap = addonPrices[addonName];
      
      // Override for Starter plan specific add-on pricing
      if (planName === "Starter Apply" && starterAddonOverrides[addonName]) {
        priceMap = starterAddonOverrides[addonName];
      }
      
      addonsTotal += priceMap ? priceMap[activeCurrency] : 0;
    });

    const totalAmt = baseAmt + addonsTotal;

    const baseCalc = plan.querySelector('[data-calc-base]');
    const addonsCalc = plan.querySelector('[data-calc-addons]');
    const totalCalc = plan.querySelector('[data-calc-total]');

    if (baseCalc) baseCalc.textContent = formatPrice(baseAmt, activeCurrency);
    if (addonsCalc) addonsCalc.textContent = formatPrice(addonsTotal, activeCurrency);
    if (totalCalc) totalCalc.textContent = formatPrice(totalAmt, activeCurrency);
  }

  function updatePricing() {
    const plans = document.querySelectorAll('.plan');
    plans.forEach(plan => {
      const planName = plan.getAttribute('data-plan-name');
      const priceDisplay = plan.querySelector('[data-price]');
      const baseAmt = planPrices[planName] ? planPrices[planName][activeCurrency] : 0;
      
      if (priceDisplay) {
        priceDisplay.textContent = formatPrice(baseAmt, activeCurrency);
      }

      const addons = plan.querySelectorAll('.addon');
      addons.forEach(addon => {
        const checkbox = addon.querySelector('input[type="checkbox"]');
        if (checkbox) {
          const addonName = checkbox.getAttribute('data-addon-name');
          const addonAmtDisplay = addon.querySelector('[data-addon-price]');
          if (addonAmtDisplay) {
            let priceMap = addonPrices[addonName];
            if (planName === "Starter Apply" && starterAddonOverrides[addonName]) {
              priceMap = starterAddonOverrides[addonName];
            }
            const addonAmt = priceMap ? priceMap[activeCurrency] : 0;
            addonAmtDisplay.textContent = formatPrice(addonAmt, activeCurrency);
          }
        }
      });

      calculatePlanTotal(plan);
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

  // Addon Checkbox Listeners
  const addonCheckboxes = document.querySelectorAll('.addon input[type="checkbox"]');
  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const label = checkbox.closest('.addon');
      if (label) {
        label.classList.toggle('selected', checkbox.checked);
      }
      const plan = checkbox.closest('.plan');
      if (plan) {
        calculatePlanTotal(plan);
      }
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
          let selectedAddons = [];
          const checkedAddons = plan.querySelectorAll('.addon input[type="checkbox"]:checked');
          checkedAddons.forEach(cb => selectedAddons.push(cb.getAttribute('data-addon-name')));
          
          let addonString = selectedAddons.length > 0 ? ` with addons: ${selectedAddons.join(', ')}` : '';
          concernTextarea.value = `Hi Meet, I am interested in the "${planName}" package${addonString}. I would like a free profile review.`;
        }
        
        const nameInput = document.getElementById('f-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 800);
        }
      }
    });
  });

  // 4. Scroll Reveal Animations System
  // Dynamically apply reveal class to cards to trigger animations
  const animTargets = [
    '.manifesto-card',
    '.service-tile',
    '.process-step',
    '.testimonial',
    '.plan',
    '.about-stat',
    '.section-head',
    '.founder-card',
    '.compare-table'
  ];

  animTargets.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.classList.add('reveal');
      const delay = (index % 4) * 100;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
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
            const easeProgress = progress * (2 - progress); // easeOutQuad
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
  const waNumber = "919104485504";

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
