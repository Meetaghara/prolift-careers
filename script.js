/* =========================================================
   ProLift Careers — Website JavaScript (Professional)
   Clean • Accessible • Performance-Focused
   ========================================================= */


// =========================================================
// 1. Configuration
// =========================================================

// WhatsApp number (country code + number, no spaces, no plus)
const whatsappNumber = "919104485504";

// Form link (Google Form / Tally / etc.) — replace when ready
const formLink = "#";

// LinkedIn URLs
const founderLinkedIn = "https://www.linkedin.com/in/meet-aghara/";
const companyLinkedIn = "https://www.linkedin.com/company/prolift-careers/";

// Default WhatsApp message
const defaultWhatsappMessage =
  "Hi Meet, I want a free profile review for ProLift Careers. " +
  "I am interested in resume, LinkedIn, or job application support. APPLY";


// =========================================================
// 2. Helper Functions
// =========================================================
const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

function formatINR(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function buildWhatsappURL(message) {
  return (
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message)
  );
}

function setWhatsappLinks(url) {
  const targets = ["#whatsappBtn", "#ctaWhatsappBtn", "#floatingWhatsapp"];
  targets.forEach((selector) => {
    const el = qs(selector);
    if (el) el.href = url;
  });
}

function getHeaderOffset() {
  const header = qs("#siteHeader");
  return header ? header.offsetHeight + 8 : 88;
}

function safeJSONParse(value, fallback = []) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


// =========================================================
// 3. Initial Setup
// =========================================================
setWhatsappLinks(buildWhatsappURL(defaultWhatsappMessage));

const formBtn = qs("#formBtn");
if (formBtn) formBtn.href = formLink;

const yearSpan = qs("#year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// =========================================================
// 4. Header Scroll State
// =========================================================
const siteHeader = qs("#siteHeader");

function updateHeaderState() {
  if (!siteHeader) return;
  if (window.scrollY > 8) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("load", updateHeaderState);


// =========================================================
// 5. Mobile Menu
// =========================================================
const mobileMenuBtn = qs("#mobileMenuBtn");
const navMenu = qs("#navMenu");

function openMobileMenu() {
  if (!mobileMenuBtn || !navMenu) return;
  mobileMenuBtn.classList.add("active");
  navMenu.classList.add("active");
  mobileMenuBtn.setAttribute("aria-expanded", "true");
  mobileMenuBtn.setAttribute("aria-label", "Close navigation menu");
  document.body.classList.add("menu-open");
}

function closeMobileMenu() {
  if (!mobileMenuBtn || !navMenu) return;
  mobileMenuBtn.classList.remove("active");
  navMenu.classList.remove("active");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
  mobileMenuBtn.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

// Close on nav link click
qsa(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close on ESC key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

// Close when clicking outside
document.addEventListener("click", (event) => {
  if (!navMenu || !mobileMenuBtn) return;
  const clickedMenu = navMenu.contains(event.target);
  const clickedButton = mobileMenuBtn.contains(event.target);
  if (
    !clickedMenu &&
    !clickedButton &&
    navMenu.classList.contains("active")
  ) {
    closeMobileMenu();
  }
});

// Close on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 980 && navMenu?.classList.contains("active")) {
    closeMobileMenu();
  }
});


// =========================================================
// 6. Smooth Scroll
// =========================================================
qsa('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetElement = qs(targetId);
    if (!targetElement) return;

    event.preventDefault();

    const targetTop =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      getHeaderOffset();

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    closeMobileMenu();
  });
});


// =========================================================
// 7. Active Nav Link On Scroll
// =========================================================
const navLinks = qsa(".nav-menu a[href^='#']");
const sections = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    const section = id && id !== "#" ? qs(id) : null;
    return section ? { link, section } : null;
  })
  .filter(Boolean);

function updateActiveNav() {
  if (!sections.length) return;
  const scrollPosition = window.scrollY + getHeaderOffset() + 100;
  let current = sections[0];

  sections.forEach((item) => {
    if (item.section.offsetTop <= scrollPosition) {
      current = item;
    }
  });

  navLinks.forEach((link) => link.classList.remove("active-link"));
  if (current?.link) current.link.classList.add("active-link");
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);


// =========================================================
// 8. Pricing Tabs
// =========================================================
const pricingTabs = qsa(".pricing-tab");
const pricingPanels = qsa(".pricing-panel");

function activatePricingTab(tab) {
  const targetId = tab.getAttribute("data-target");
  const targetPanel = targetId ? qs("#" + targetId) : null;
  if (!targetPanel) return;

  pricingTabs.forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-selected", "false");
  });

  pricingPanels.forEach((panel) => {
    panel.classList.remove("active");
    panel.setAttribute("hidden", "true");
  });

  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  targetPanel.classList.add("active");
  targetPanel.removeAttribute("hidden");
}

pricingTabs.forEach((tab) => {
  tab.addEventListener("click", () => activatePricingTab(tab));

  // Keyboard navigation
  tab.addEventListener("keydown", (event) => {
    const currentIndex = pricingTabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % pricingTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + pricingTabs.length) % pricingTabs.length;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      pricingTabs[nextIndex].focus();
      activatePricingTab(pricingTabs[nextIndex]);
    }
  });
});

// Set initial hidden state
window.addEventListener("load", () => {
  pricingPanels.forEach((panel) => {
    if (panel.classList.contains("active")) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "true");
    }
  });
});


// =========================================================
// 9. Pricing Add-on Calculator
// =========================================================
const planCards = qsa(".plan-card");

function updatePlanCalculation(card) {
  const basePrice = Number(card.getAttribute("data-base-price")) || 0;
  const checkedAddons = qsa("input[data-addon-price]:checked", card);

  let addonTotal = 0;
  const addonNames = [];

  checkedAddons.forEach((input) => {
    const price = Number(input.getAttribute("data-addon-price")) || 0;
    const name = input.getAttribute("data-addon-name") || "Add-on";
    addonTotal += price;
    addonNames.push(name);
  });

  const total = basePrice + addonTotal;

  const calcBase = qs(".calc-base", card);
  const calcAddons = qs(".calc-addons", card);
  const calcTotal = qs(".calc-total", card);

  if (calcBase) calcBase.textContent = formatINR(basePrice);
  if (calcAddons) calcAddons.textContent = formatINR(addonTotal);
  if (calcTotal) calcTotal.textContent = formatINR(total);

  card.dataset.addonTotal = String(addonTotal);
  card.dataset.totalPrice = String(total);
  card.dataset.selectedAddons = JSON.stringify(addonNames);
}

planCards.forEach((card) => {
  const addonInputs = qsa("input[data-addon-price]", card);

  addonInputs.forEach((input) => {
    // FIX: HTML uses .addon-card, not .addon-option
    const option = input.closest(".addon-card");

    input.addEventListener("change", () => {
      if (option) {
        option.classList.toggle("selected", input.checked);
      }
      updatePlanCalculation(card);

      // Subtle total price highlight
      const totalEl = qs(".calc-total", card);
      if (totalEl && !prefersReducedMotion) {
        totalEl.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.08)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 320,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          }
        );
      }
    });
  });

  // Initialize calculation on load
  updatePlanCalculation(card);
});


// =========================================================
// 10. Plan Button → Smart WhatsApp Message
// =========================================================
qsa(".plan-button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".plan-card");
    if (!card) return;

    const planName =
      card.getAttribute("data-plan-name") ||
      qs("h3", card)?.textContent.trim() ||
      "a ProLift Careers plan";

    const priceText =
      qs(".price", card)?.textContent.replace(/\s+/g, " ").trim() || "";

    const basePrice = Number(card.getAttribute("data-base-price")) || 0;
    const addonTotal = Number(card.dataset.addonTotal || 0);
    const totalPrice = Number(card.dataset.totalPrice || basePrice);
    const addonNames = safeJSONParse(card.dataset.selectedAddons || "[]", []);

    let message =
      "Hi Meet, I want to start with " +
      planName +
      " (" +
      priceText +
      ") from ProLift Careers. APPLY";

    message += " Base price: " + formatINR(basePrice) + ".";

    if (addonNames.length > 0) {
      message += " Selected add-ons: " + addonNames.join(", ") + ".";
      message += " Add-on total: " + formatINR(addonTotal) + ".";
    } else {
      message += " No add-ons selected.";
    }

    message += " Total investment: " + formatINR(totalPrice) + ".";

    setWhatsappLinks(buildWhatsappURL(message));

    // Subtle WhatsApp attention
    const floatingWhatsapp = qs("#floatingWhatsapp");
    if (floatingWhatsapp && !prefersReducedMotion) {
      floatingWhatsapp.classList.remove("attention");
      void floatingWhatsapp.offsetWidth;
      floatingWhatsapp.classList.add("attention");
    }
  });
});


// =========================================================
// 11. FAQ Accordion
// =========================================================
qsa(".faq-item").forEach((item) => {
  const question = qs(".faq-question", item);
  if (!question) return;

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // Close all
    qsa(".faq-item").forEach((faq) => faq.classList.remove("active"));

    // Open this one (if it wasn't already open)
    if (!isActive) {
      item.classList.add("active");
    }
  });
});


// =========================================================
// 12. Reveal Animations On Scroll
// =========================================================
const revealElements = qsa(".reveal");

// Subtle staggered delay
revealElements.forEach((element, index) => {
  if (!element.style.getPropertyValue("--reveal-delay")) {
    const delay = Math.min((index % 6) * 60, 300);
    element.style.setProperty("--reveal-delay", delay + "ms");
  }
});

function revealFallback() {
  const windowHeight = window.innerHeight;
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  window.addEventListener("scroll", revealFallback, { passive: true });
  window.addEventListener("load", revealFallback);
}

window.addEventListener("load", () => setTimeout(revealFallback, 120));


// =========================================================
// 13. Progress Bar Re-animate On View
// =========================================================
const progressBars = qsa(".progress-bar i");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = "0";
          requestAnimationFrame(() => {
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));
}


// =========================================================
// 14. Floating WhatsApp Periodic Attention
// =========================================================
const floatingWhatsapp = qs("#floatingWhatsapp");

if (floatingWhatsapp && !prefersReducedMotion) {
  setInterval(() => {
    floatingWhatsapp.classList.remove("attention");
    void floatingWhatsapp.offsetWidth;
    floatingWhatsapp.classList.add("attention");
  }, 12000);
}


// =========================================================
// 15. Cursor Glow (Desktop only — Subtle)
// =========================================================
const cursorGlow = qs("#cursorGlow");

if (cursorGlow && canHover && !prefersReducedMotion) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isVisible = false;

  document.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!isVisible) {
        cursorGlow.style.opacity = "1";
        isVisible = true;
      }
    },
    { passive: true }
  );

  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    cursorGlow.style.left = currentX + "px";
    cursorGlow.style.top = currentY + "px";
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
    isVisible = false;
  });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}


// =========================================================
// 16. Touch Device Enhancement
// =========================================================
document.addEventListener("touchstart", () => {}, { passive: true });


// =========================================================
// 17. Page Load State
// =========================================================
window.addEventListener("load", () => {
  document.body.classList.add("site-loaded");
});