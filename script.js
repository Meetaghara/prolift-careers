// =========================================================
// ProLift Careers Website JavaScript
// Premium Animated + Pricing Calculator Version
// =========================================================

// -------------------------------
// Main Config
// -------------------------------

// WhatsApp number format: country code + number, no plus sign, no spaces.
const whatsappNumber = "919104485504";

// Replace with your Google Form / Tally Form link.
// Keep "#" if you do not have a form yet.
const formLink = "#";

// LinkedIn URLs
const founderLinkedIn = "https://www.linkedin.com/in/meet-aghara/";
const companyLinkedIn = "https://www.linkedin.com/company/prolift-careers/";

// Default WhatsApp message
const defaultWhatsappMessage =
  "Hi Meet, I want a free profile review for ProLift Careers. I am interested in resume, LinkedIn, or job application support. APPLY";

// -------------------------------
// Helper Functions
// -------------------------------
const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const whatsappBtn = qs("#whatsappBtn");
  const ctaWhatsappBtn = qs("#ctaWhatsappBtn");
  const floatingWhatsapp = qs("#floatingWhatsapp");

  if (whatsappBtn) whatsappBtn.href = url;
  if (ctaWhatsappBtn) ctaWhatsappBtn.href = url;
  if (floatingWhatsapp) floatingWhatsapp.href = url;
}

function getHeaderOffset() {
  const header = qs("#siteHeader");
  return header ? header.offsetHeight + 10 : 90;
}

function safeJSONParse(value, fallback = []) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// -------------------------------
// Initial Links
// -------------------------------
setWhatsappLinks(buildWhatsappURL(defaultWhatsappMessage));

const formBtn = qs("#formBtn");
if (formBtn) {
  formBtn.href = formLink;
}

// -------------------------------
// Current Year
// -------------------------------
const yearSpan = qs("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// =========================================================
// Header Scroll State
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
// Mobile Menu
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
  mobileMenuBtn.addEventListener("click", function () {
    const isOpen = navMenu.classList.contains("active");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

// Close mobile menu after clicking nav link
qsa(".nav-menu a").forEach(function (link) {
  link.addEventListener("click", closeMobileMenu);
});

// Close menu on ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  if (!navMenu || !mobileMenuBtn) return;

  const clickedMenu = navMenu.contains(event.target);
  const clickedButton = mobileMenuBtn.contains(event.target);

  if (!clickedMenu && !clickedButton && navMenu.classList.contains("active")) {
    closeMobileMenu();
  }
});

// =========================================================
// Smooth Scroll
// =========================================================
qsa('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
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
// Active Nav Link On Scroll
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

  const scrollPosition = window.scrollY + getHeaderOffset() + 120;
  let current = sections[0];

  sections.forEach(function (item) {
    if (item.section.offsetTop <= scrollPosition) {
      current = item;
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active-link");
  });

  if (current && current.link) {
    current.link.classList.add("active-link");
  }
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);

// =========================================================
// Pricing Tabs
// =========================================================
const pricingTabs = qsa(".pricing-tab");
const pricingPanels = qsa(".pricing-panel");

function activatePricingTab(tab) {
  const targetId = tab.getAttribute("data-target");
  const targetPanel = targetId ? qs("#" + targetId) : null;

  if (!targetPanel) return;

  pricingTabs.forEach(function (item) {
    item.classList.remove("active");
    item.setAttribute("aria-selected", "false");
  });

  pricingPanels.forEach(function (panel) {
    panel.classList.remove("active");
    panel.setAttribute("hidden", "true");
  });

  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("active");
  targetPanel.removeAttribute("hidden");

  animatePricingCards(targetPanel);
}

pricingTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    activatePricingTab(tab);
    burstParticlesFromElement(tab, 12);
  });

  tab.addEventListener("keydown", function (event) {
    const currentIndex = pricingTabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % pricingTabs.length;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + pricingTabs.length) % pricingTabs.length;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      pricingTabs[nextIndex].focus();
      activatePricingTab(pricingTabs[nextIndex]);
    }
  });
});

window.addEventListener("load", function () {
  pricingPanels.forEach(function (panel) {
    if (panel.classList.contains("active")) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "true");
    }
  });
});

function animatePricingCards(panel) {
  if (prefersReducedMotion) return;

  const cards = qsa(".plan-card", panel);

  cards.forEach(function (card, index) {
    card.animate(
      [
        {
          opacity: 0,
          transform: "translateY(28px) scale(0.97)",
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          transform: "translateY(0) scale(1)",
          filter: "blur(0)",
        },
      ],
      {
        duration: 650,
        delay: index * 110,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      }
    );
  });
}

// =========================================================
// Pricing Add-on Calculator
// =========================================================
const planCards = qsa(".plan-card");

function updatePlanCalculation(card) {
  const basePrice = Number(card.getAttribute("data-base-price")) || 0;
  const checkedAddons = qsa("input[data-addon-price]:checked", card);

  let addonTotal = 0;
  const addonNames = [];

  checkedAddons.forEach(function (input) {
    const addonPrice = Number(input.getAttribute("data-addon-price")) || 0;
    const addonName = input.getAttribute("data-addon-name") || "Add-on";

    addonTotal += addonPrice;
    addonNames.push(addonName);
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

planCards.forEach(function (card) {
  const addonInputs = qsa("input[data-addon-price]", card);

  addonInputs.forEach(function (input) {
    const option = input.closest(".addon-option");

    input.addEventListener("change", function () {
      if (option) {
        option.classList.toggle("selected", input.checked);
      }

      updatePlanCalculation(card);

      const totalElement = qs(".calc-total", card);
      if (totalElement && !prefersReducedMotion) {
        totalElement.animate(
          [
            { transform: "scale(1)", color: "inherit" },
            { transform: "scale(1.12)", color: "#00a879" },
            { transform: "scale(1)", color: "inherit" },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          }
        );
      }

      burstParticlesFromElement(option || input, 8);
    });
  });

  updatePlanCalculation(card);
});

// =========================================================
// Smart WhatsApp Messages From Plan Buttons
// =========================================================
qsa(".plan-button").forEach(function (button) {
  button.addEventListener("click", function () {
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

    const floatingWhatsapp = qs("#floatingWhatsapp");
    if (floatingWhatsapp && !prefersReducedMotion) {
      floatingWhatsapp.classList.remove("attention");
      void floatingWhatsapp.offsetWidth;
      floatingWhatsapp.classList.add("attention");
    }

    burstParticlesFromElement(button, 16);
  });
});

// =========================================================
// FAQ Accordion
// =========================================================
qsa(".faq-item").forEach(function (item) {
  const question = qs(".faq-question", item);

  if (!question) return;

  question.addEventListener("click", function () {
    const isActive = item.classList.contains("active");

    qsa(".faq-item").forEach(function (faq) {
      faq.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }

    burstParticlesFromElement(question, 6);
  });
});

// =========================================================
// Reveal Animation On Scroll
// =========================================================
const revealElements = qsa(".reveal");

revealElements.forEach(function (element, index) {
  if (!element.style.getPropertyValue("--reveal-delay")) {
    const delay = Math.min((index % 7) * 70, 420);
    element.style.setProperty("--reveal-delay", delay + "ms");
  }
});

function revealFallback() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 110;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.13,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  window.addEventListener("scroll", revealFallback, { passive: true });
  window.addEventListener("load", revealFallback);
}

window.addEventListener("load", function () {
  setTimeout(revealFallback, 120);
});

// =========================================================
// Comparison Table Row Animation
// =========================================================
const comparisonTables = qsa(".comparison-table");

comparisonTables.forEach(function (table) {
  const rows = qsa(".comparison-row", table);

  rows.forEach(function (row, index) {
    row.style.setProperty("--row-delay", index * 90 + "ms");
  });

  if ("IntersectionObserver" in window) {
    const tableObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            table.classList.add("active");

            rows.forEach(function (row, index) {
              if (prefersReducedMotion) {
                row.style.opacity = "1";
                row.style.transform = "none";
                return;
              }

              row.animate(
                [
                  { opacity: 0, transform: "translateY(18px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                {
                  duration: 520,
                  delay: index * 90,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  fill: "both",
                }
              );
            });

            observer.unobserve(table);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    tableObserver.observe(table);
  } else {
    table.classList.add("active");
  }
});

// =========================================================
// Cursor Glow
// =========================================================
const cursorGlow = qs("#cursorGlow");

if (cursorGlow && canHover && !prefersReducedMotion) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener(
    "mousemove",
    function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.style.opacity = "1";
    },
    { passive: true }
  );

  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;

    cursorGlow.style.left = currentX + "px";
    cursorGlow.style.top = currentY + "px";

    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();

  document.addEventListener("mouseleave", function () {
    cursorGlow.style.opacity = "0";
  });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

// =========================================================
// 3D Tilt Cards
// =========================================================
const tiltCards = qsa(".tilt-card");

if (canHover && !prefersReducedMotion) {
  tiltCards.forEach(function (card) {
    card.addEventListener(
      "mousemove",
      function (event) {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX +
          "deg) rotateY(" +
          rotateY +
          "deg) translateY(-5px)";
      },
      { passive: true }
    );

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
}

// =========================================================
// Magnetic Buttons
// =========================================================
const magneticElements = qsa(".magnetic, .btn-primary, .plan-button.filled, .nav-cta");

if (canHover && !prefersReducedMotion) {
  magneticElements.forEach(function (element) {
    element.addEventListener(
      "mousemove",
      function (event) {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        element.style.transform =
          "translate(" + x * 0.1 + "px, " + y * 0.1 + "px)";
      },
      { passive: true }
    );

    element.addEventListener("mouseleave", function () {
      element.style.transform = "";
    });
  });
}

// =========================================================
// Ripple Click Effect
// =========================================================
function createRipple(event, element) {
  if (prefersReducedMotion) return;

  const rect = element.getBoundingClientRect();
  const ripple = document.createElement("span");

  ripple.className = "ripple-dot";
  ripple.style.left = event.clientX - rect.left + "px";
  ripple.style.top = event.clientY - rect.top + "px";

  element.appendChild(ripple);

  setTimeout(function () {
    ripple.remove();
  }, 750);
}

qsa(".btn, .plan-button, .pricing-tab, .nav-cta, .linkedin-btn, .mobile-menu-btn").forEach(
  function (element) {
    element.addEventListener("click", function (event) {
      createRipple(event, element);
    });
  }
);

// Add ripple style through JS so it works even if CSS missed it
(function injectRippleStyle() {
  const style = document.createElement("style");

  style.textContent = `
    .ripple-dot {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(255,255,255,.55);
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleBlast 700ms ease-out forwards;
      z-index: 5;
    }

    @keyframes rippleBlast {
      to {
        transform: translate(-50%, -50%) scale(18);
        opacity: 0;
      }
    }

    .micro-particle {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 9999;
      background: #00a879;
      animation: particlePop 850ms ease-out forwards;
    }

    @keyframes particlePop {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }

      100% {
        opacity: 0;
        transform: translate(var(--x), var(--y)) scale(0);
      }
    }

    .floating-whatsapp.attention {
      animation: whatsappAttention 900ms ease;
    }

    @keyframes whatsappAttention {
      0%, 100% { transform: translateY(0) rotate(0); }
      20% { transform: translateY(-4px) rotate(-4deg); }
      40% { transform: translateY(0) rotate(4deg); }
      60% { transform: translateY(-3px) rotate(-3deg); }
      80% { transform: translateY(0) rotate(3deg); }
    }

    .nav-menu a.active-link {
      color: #00a879;
    }

    .addon-option.selected {
      color: #00a879;
    }
  `;

  document.head.appendChild(style);
})();

// =========================================================
// Particle Burst
// =========================================================
function burstParticlesFromElement(element, count = 10) {
  if (prefersReducedMotion || isMobile || !element) return;

  const rect = element.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const colors = ["#00a879", "#17d19a", "#ffde7a", "#061427", "#0a66c2"];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "micro-particle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 42 + Math.random() * 68;

    particle.style.left = originX + "px";
    particle.style.top = originY + "px";
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.setProperty("--x", Math.cos(angle) * distance + "px");
    particle.style.setProperty("--y", Math.sin(angle) * distance + "px");

    document.body.appendChild(particle);

    setTimeout(function () {
      particle.remove();
    }, 900);
  }
}

// =========================================================
// Parallax Floating Elements
// =========================================================
const parallaxItems = qsa(
  ".hero-orb, .floating-tag, .party-emoji, .party-bg-orb, .process-orb"
);

if (!prefersReducedMotion && !isMobile) {
  window.addEventListener(
    "scroll",
    function () {
      const scrollY = window.scrollY;

      parallaxItems.forEach(function (item, index) {
        const speed = 0.012 + (index % 5) * 0.004;
        const y = Math.sin(scrollY * speed + index) * 8;
        const x = Math.cos(scrollY * speed + index) * 5;

        item.style.translate = x + "px " + y + "px";
      });
    },
    { passive: true }
  );
}

// =========================================================
// Animated Counters / Progress Restart On View
// =========================================================
const progressBars = qsa(".progress-bar i");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const progressObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;

          bar.style.width = "0";

          setTimeout(function () {
            bar.style.width = width;
          }, 120);

          observer.unobserve(bar);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  progressBars.forEach(function (bar) {
    progressObserver.observe(bar);
  });
}

// =========================================================
// Floating WhatsApp Attention Pulse
// =========================================================
const floatingWhatsapp = qs("#floatingWhatsapp");

if (floatingWhatsapp && !prefersReducedMotion) {
  setInterval(function () {
    floatingWhatsapp.classList.remove("attention");
    void floatingWhatsapp.offsetWidth;
    floatingWhatsapp.classList.add("attention");
  }, 9000);
}

// =========================================================
// Touch Friendly Enhancement
// =========================================================
document.addEventListener(
  "touchstart",
  function () {},
  { passive: true }
);

// =========================================================
// Load State
// =========================================================
window.addEventListener("load", function () {
  document.body.classList.add("site-loaded");

  // Animate active pricing cards on first load
  const activePanel = qs(".pricing-panel.active");
  if (activePanel) {
    animatePricingCards(activePanel);
  }
});