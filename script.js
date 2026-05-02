// ===============================
// ProLift Careers Website Script
// ===============================

// IMPORTANT:
// Replace this with your real WhatsApp number.
// Format: country code + number, no plus sign, no spaces.
// Example: 919876543210
const whatsappNumber = "919104485504";

// Replace this with your Google Form / Tally Form link.
// If you do not have a form yet, keep "#".
const formLink = "#";

// LinkedIn URLs
const founderLinkedIn = "https://www.linkedin.com/in/meet-aghara/";
const companyLinkedIn = "https://www.linkedin.com/company/prolift-careers/";

// WhatsApp message
const whatsappMessage =
  "Hi Meet, I want a free profile review for ProLift Careers. I am interested in resume, LinkedIn, or job application support. APPLY";

// Create WhatsApp URL
const whatsappURL =
  "https://wa.me/" +
  whatsappNumber +
  "?text=" +
  encodeURIComponent(whatsappMessage);

// WhatsApp buttons
const whatsappBtn = document.getElementById("whatsappBtn");
const floatingWhatsapp = document.getElementById("floatingWhatsapp");

if (whatsappBtn) {
  whatsappBtn.href = whatsappURL;
}

if (floatingWhatsapp) {
  floatingWhatsapp.href = whatsappURL;
}

// Form button
const formBtn = document.getElementById("formBtn");

if (formBtn) {
  formBtn.href = formLink;
}

// Mobile menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active");

    const isOpen = navMenu.classList.contains("active");

    if (isOpen) {
      mobileMenuBtn.setAttribute("aria-label", "Close menu");
      mobileMenuBtn.textContent = "×";
    } else {
      mobileMenuBtn.setAttribute("aria-label", "Open menu");
      mobileMenuBtn.textContent = "☰";
    }
  });
}

// Close mobile menu after clicking any menu link
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (navMenu) {
      navMenu.classList.remove("active");
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-label", "Open menu");
      mobileMenuBtn.textContent = "☰";
    }
  });
});

// Pricing tabs
const pricingTabs = document.querySelectorAll(".pricing-tab");
const pricingPanels = document.querySelectorAll(".pricing-panel");

pricingTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    const target = tab.getAttribute("data-target");

    pricingTabs.forEach(function (item) {
      item.classList.remove("active");
    });

    pricingPanels.forEach(function (panel) {
      panel.classList.remove("active");
    });

    tab.classList.add("active");

    const activePanel = document.getElementById(target);

    if (activePanel) {
      activePanel.classList.add("active");
    }
  });
});

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  const question = item.querySelector(".faq-question");

  if (question) {
    question.addEventListener("click", function () {
      item.classList.toggle("active");
    });
  }
});

// Current year in footer
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Reveal animation on scroll
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 110;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Cursor glow effect
const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow) {
  document.addEventListener("mousemove", function (event) {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
    cursorGlow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", function () {
    cursorGlow.style.opacity = "0";
  });
}

// 3D tilt effect for selected cards
const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach(function (card) {
  card.addEventListener("mousemove", function (event) {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform =
      "perspective(900px) rotateX(" +
      rotateX +
      "deg) rotateY(" +
      rotateY +
      "deg) translateY(-4px)";
  });

  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
});

// Magnetic button effect
const magneticButtons = document.querySelectorAll(".magnetic");

magneticButtons.forEach(function (button) {
  button.addEventListener("mousemove", function (event) {
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform =
      "translate(" + x * 0.12 + "px, " + y * 0.12 + "px)";
  });

  button.addEventListener("mouseleave", function () {
    button.style.transform = "";
  });
});

// Smooth scroll fallback for internal links
const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href");

    if (targetId && targetId.length > 1) {
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});