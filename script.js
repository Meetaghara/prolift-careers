/* =========================================================
   ProLift Careers — Site Logic
   Currency · Pricing · Form · Counters · CTA · Mobile
   ========================================================= */

(function () {
  "use strict";

  // ----- 1. Config -----
  const WHATSAPP_NUMBER = "919104485504"; // country + number, no +
  const DEFAULT_MESSAGE =
    "Hi Meet, I want a free profile review from ProLift Careers. Sending my resume + LinkedIn now. APPLY";

  // Currency conversion rates (relative to INR base)
  // These are approximate — adjust based on current rates / your pricing strategy
  const CURRENCY = {
    INR: { rate: 1,       symbol: "₹",     code: "INR",  position: "before", locale: "en-IN" },
    USD: { rate: 0.012,   symbol: "$",     code: "USD",  position: "before", locale: "en-US" },
    AED: { rate: 0.044,   symbol: "د.إ ",  code: "AED",  position: "before", locale: "en-AE" },
    CAD: { rate: 0.016,   symbol: "C$",    code: "CAD",  position: "before", locale: "en-CA" }
  };

  let currentCurrency = "INR";

  // ----- 2. Helpers -----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function formatPrice(amountINR, currency = currentCurrency) {
    const cfg = CURRENCY[currency] || CURRENCY.INR;
    const converted = amountINR * cfg.rate;

    // Round sensibly
    let rounded;
    if (currency === "INR") {
      rounded = Math.round(converted);
    } else if (converted < 100) {
      // Small amounts — round to nearest dollar
      rounded = Math.round(converted);
    } else {
      // Larger amounts — round to nearest 5/10 for cleaner display
      rounded = Math.round(converted / 5) * 5;
    }

    const formatted = rounded.toLocaleString(cfg.locale);
    return `${cfg.symbol}${formatted}`;
  }

  function buildWhatsappURL(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function setWhatsappLinks(url) {
    const targets = ["#floatingWa", "#mobileWa", "#startWhatsapp", "#successWhatsapp"];
    targets.forEach((sel) => {
      const el = $(sel);
      if (el) el.href = url;
    });
  }

  function safeJSONParse(value, fallback = []) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function getHeaderOffset() {
    const header = $("#header");
    return header ? header.offsetHeight + 12 : 88;
  }

  // ----- 3. Init defaults -----
  setWhatsappLinks(buildWhatsappURL(DEFAULT_MESSAGE));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- 4. Header scroll state -----
  const header = $("#header");
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ----- 5. Mobile menu -----
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");

  function openMenu() {
    if (!menuBtn || !nav) return;
    menuBtn.classList.add("active");
    nav.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (!menuBtn || !nav) return;
    menuBtn.classList.remove("active");
    nav.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      if (nav.classList.contains("active")) closeMenu();
      else openMenu();
    });
  }

  $$(".nav a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && nav?.classList.contains("active")) {
      closeMenu();
    }
  });

  // ----- 6. Smooth scroll -----
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      closeMenu();
    });
  });

  // ----- 7. Active nav link -----
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      const sec = id && id !== "#" ? $(id) : null;
      return sec ? { link, section: sec } : null;
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (!sections.length) return;
    const pos = window.scrollY + getHeaderOffset() + 80;
    let current = sections[0];
    sections.forEach((item) => {
      if (item.section.offsetTop <= pos) current = item;
    });
    navLinks.forEach((l) => l.classList.remove("active"));
    if (current?.link) current.link.classList.add("active");
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ----- 8. Currency switcher -----
  const curBtns = $$(".cur-btn");

  function updateAllPrices() {
    // Update plan prices
    $$(".plan").forEach((plan) => {
      const baseINR = Number(plan.dataset.baseInr) || 0;
      const priceEl = $("[data-price]", plan);
      if (priceEl) priceEl.textContent = formatPrice(baseINR);

      // Update add-on prices
      $$("[data-addon-inr]", plan).forEach((input) => {
        const inr = Number(input.dataset.addonInr) || 0;
        const label = input.closest(".addon");
        const priceEl = label ? $("[data-addon-price]", label) : null;
        if (priceEl) priceEl.textContent = formatPrice(inr);
      });

      // Recalc total
      updatePlanCalc(plan);
    });
  }

  function setCurrency(code) {
    if (!CURRENCY[code]) return;
    currentCurrency = code;
    curBtns.forEach((btn) => {
      const active = btn.dataset.currency === code;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
    updateAllPrices();
  }

  curBtns.forEach((btn) => {
    btn.addEventListener("click", () => setCurrency(btn.dataset.currency));
  });

  // Try to detect user region for initial currency (one-time, non-invasive)
  function detectCurrency() {
    try {
      const lang = (navigator.language || "").toLowerCase();
      if (lang.includes("ae") || lang.includes("ar")) return "AED";
      if (lang.includes("ca")) return "CAD";
      if (lang.includes("us") || lang.includes("en-us")) return "USD";
      // Default stays INR
    } catch (e) {}
    return "INR";
  }
  // Set initial currency based on locale hint, but quietly
  const initialCurrency = detectCurrency();
  if (initialCurrency !== "INR") setCurrency(initialCurrency);

  // ----- 9. Pricing tabs -----
  const ptTabs = $$(".pt-tab");
  const ptPanels = $$(".pricing-panel");

  function activateTab(tab) {
    const targetId = tab.dataset.target;
    const targetPanel = targetId ? $("#" + targetId) : null;
    if (!targetPanel) return;

    ptTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    ptPanels.forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("hidden", "true");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    targetPanel.classList.add("active");
    targetPanel.removeAttribute("hidden");
  }

  ptTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (e) => {
      const idx = ptTabs.indexOf(tab);
      let next = idx;
      if (e.key === "ArrowRight") next = (idx + 1) % ptTabs.length;
      else if (e.key === "ArrowLeft") next = (idx - 1 + ptTabs.length) % ptTabs.length;
      if (next !== idx) {
        e.preventDefault();
        ptTabs[next].focus();
        activateTab(ptTabs[next]);
      }
    });
  });

  // ----- 10. Plan calculator -----
  function updatePlanCalc(plan) {
    const baseINR = Number(plan.dataset.baseInr) || 0;
    const checked = $$("input[data-addon-inr]:checked", plan);

    let addonTotalINR = 0;
    const addonNames = [];

    checked.forEach((input) => {
      addonTotalINR += Number(input.dataset.addonInr) || 0;
      addonNames.push(input.dataset.addonName || "Add-on");
    });

    const totalINR = baseINR + addonTotalINR;

    const baseEl = $("[data-calc-base]", plan);
    const addonsEl = $("[data-calc-addons]", plan);
    const totalEl = $("[data-calc-total]", plan);

    if (baseEl) baseEl.textContent = formatPrice(baseINR);
    if (addonsEl) addonsEl.textContent = formatPrice(addonTotalINR);
    if (totalEl) totalEl.textContent = formatPrice(totalINR);

    plan.dataset.addonNames = JSON.stringify(addonNames);
    plan.dataset.totalInr = String(totalINR);
    plan.dataset.addonTotalInr = String(addonTotalINR);
  }

  $$(".plan").forEach((plan) => {
    $$("input[data-addon-inr]", plan).forEach((input) => {
      input.addEventListener("change", () => {
        updatePlanCalc(plan);

        // Subtle total flash
        const totalEl = $("[data-calc-total]", plan);
        if (totalEl && !prefersReducedMotion) {
          totalEl.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
            { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
          );
        }
      });
    });
    updatePlanCalc(plan);
  });

  // ----- 11. Plan CTA → smart WhatsApp + scroll to form -----
  $$(".plan-cta").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.closest(".plan");
      if (!plan) return;

      const planName = plan.dataset.planName || "a ProLift Careers plan";
      const baseINR = Number(plan.dataset.baseInr) || 0;
      const addonNames = safeJSONParse(plan.dataset.addonNames, []);
      const totalINR = Number(plan.dataset.totalInr) || baseINR;
      const cur = CURRENCY[currentCurrency];

      let msg = `Hi Meet, I want to start with the ${planName} plan from ProLift Careers.`;
      msg += ` Base price: ${formatPrice(baseINR)}.`;

      if (addonNames.length) {
        msg += ` Add-ons: ${addonNames.join(", ")}.`;
      }

      msg += ` Total: ${formatPrice(totalINR)}`;
      if (currentCurrency !== "INR") {
        msg += ` (approx. ${formatPrice(totalINR, "INR")} INR base)`;
      }
      msg += `. Please send next steps. APPLY`;

      setWhatsappLinks(buildWhatsappURL(msg));

      // Pre-fill form concern field with plan selection for context
      const concernEl = $("#f-concern");
      if (concernEl && !concernEl.value.trim()) {
        const summary = addonNames.length
          ? `Interested in ${planName} with ${addonNames.join(", ")}.`
          : `Interested in ${planName}.`;
        concernEl.value = summary;
      }
    });
  });

  // ----- 12. Lead capture form -----
  const form = $("#startForm");
  const formSuccess = $("#startFormSuccess");

  function buildFormMessage(data) {
    let msg = `Hi Meet, I'd like a free profile review from ProLift Careers.\n\n`;
    msg += `Name: ${data.name}\n`;
    msg += `Email: ${data.email}\n`;
    msg += `WhatsApp: ${data.phone}\n`;
    msg += `Target country: ${data.country}\n`;
    if (data.role) msg += `Target role: ${data.role}\n`;
    if (data.linkedin) msg += `LinkedIn: ${data.linkedin}\n`;
    if (data.concern) msg += `\nMain concern: ${data.concern}\n`;
    msg += `\nAPPLY`;
    return msg;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Native HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const data = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        country: (formData.get("country") || "").toString().trim(),
        role: (formData.get("role") || "").toString().trim(),
        linkedin: (formData.get("linkedin") || "").toString().trim(),
        concern: (formData.get("concern") || "").toString().trim()
      };

      // Build WhatsApp message with form data
      const msg = buildFormMessage(data);
      const url = buildWhatsappURL(msg);

      // Update success WhatsApp link
      const successWa = $("#successWhatsapp");
      if (successWa) successWa.href = url;

      // Update floating + mobile WA links too
      setWhatsappLinks(url);

      // Show success state
      const submitBtn = form.querySelector('button[type="submit"]');
      const fieldsToHide = [
        ".start-form-title",
        ".field",
        ".field-row",
        ".field-cta",
        ".start-form-note"
      ];
      fieldsToHide.forEach((sel) => {
        $$(sel, form).forEach((el) => (el.style.display = "none"));
      });

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Optional: fire a custom event so you can wire analytics
      try {
        document.dispatchEvent(
          new CustomEvent("prolift:lead", { detail: data })
        );
      } catch (err) {}

      // Open WhatsApp automatically after a short delay (let user see success first)
      setTimeout(() => {
        window.open(url, "_blank", "noopener");
      }, 600);
    });
  }

  // ----- 13. Reveal animations -----
  const revealEls = $$(".reveal, .manifesto-card, .service-tile, .process-step, .plan, .testimonial, .compare-row, .about-stat, .faq-item, .start-check");

  // Stagger delay within a group
  revealEls.forEach((el, i) => {
    if (!el.style.getPropertyValue("--reveal-delay")) {
      const delay = Math.min((i % 6) * 60, 300);
      el.style.setProperty("--reveal-delay", delay + "ms");
    }
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("active"));
  }

  // ----- 14. Animated number counters -----
  function animateCounter(el, target, suffix = "", duration = 1800) {
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const start = performance.now();
    const initial = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(initial + (target - initial) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterEls = $$("[data-count-to]");
  if ("IntersectionObserver" in window && counterEls.length) {
    const counterIO = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.countTo) || 0;
            const suffix = el.dataset.countSuffix || "";
            animateCounter(el, target, suffix);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach((el) => counterIO.observe(el));
  } else {
    counterEls.forEach((el) => {
      el.textContent = (el.dataset.countTo || "0") + (el.dataset.countSuffix || "");
    });
  }

  // ----- 15. Sticky mobile CTA on scroll past hero -----
  const mobileCta = $("#mobileCta");
  const hero = $("#home");

  function updateMobileCta() {
    if (!mobileCta || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const startSection = $("#start");
    const startTop = startSection ? startSection.getBoundingClientRect().top : Infinity;

    // Show after scrolling past hero, hide when start form is visible
    const shouldShow = heroBottom < 200 && startTop > 400;
    mobileCta.classList.toggle("visible", shouldShow);
  }
  window.addEventListener("scroll", updateMobileCta, { passive: true });
  updateMobileCta();

  // ----- 16. Cursor glow (desktop only) -----
  const cursorGlow = $("#cursorGlow");
  if (cursorGlow && canHover && !prefersReducedMotion) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, visible = false;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        cursorGlow.style.opacity = "1";
        visible = true;
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
      visible = false;
    });

    function animate() {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      cursorGlow.style.left = currentX + "px";
      cursorGlow.style.top = currentY + "px";
      requestAnimationFrame(animate);
    }
    animate();
  } else if (cursorGlow) {
    cursorGlow.style.display = "none";
  }

  // ----- 17. Touch device enhancement -----
  document.addEventListener("touchstart", () => {}, { passive: true });

  // ----- 18. Mark loaded -----
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
})();
