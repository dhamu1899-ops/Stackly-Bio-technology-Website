const loader = document.getElementById("loader");
const website = document.getElementById("website");
const notFoundPage = document.getElementById("notFoundPage");
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");
const mainHeader = document.getElementById("mainHeader");

window.addEventListener("load", () => {
  if (loader) {
    if (loader) setTimeout(() => loader.classList.add("hide"), 900);
  }

  if (sessionStorage.getItem("stacklyLogoReloaded") === "true") {
    sessionStorage.removeItem("stacklyLogoReloaded");
    showWebsite(true);
  }

  initReveal();
  initCounters();
  initParallax();
  initTiltCards();
});

function toggleMenu() {
  nav?.classList.toggle("open");
  const menuButton = document.querySelector(".menu-btn");
  if (menuButton && nav) {
    menuButton.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
  }
}

function closeMenu() {
  nav?.classList.remove("open");
  const menuButton = document.querySelector(".menu-btn");
  if (menuButton) menuButton.setAttribute("aria-expanded", "false");
}

function scrollToSection(id) {
  showWebsite(false);
  closeMenu();

  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 50);
}

document.querySelectorAll(".nav a, .footer a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function open404() {
  closeMenu();
  website?.classList.remove("active");
  notFoundPage?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showWebsite(scrollTop = true) {
  notFoundPage?.classList.remove("active");
  website?.classList.add("active");
  closeMenu();

  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* Logo click: one reload, then land at top of home */
document.addEventListener("click", (event) => {
  const logo = event.target.closest(".stackly-logo, .stackly-home");
  if (!logo) return;

  event.preventDefault();
  sessionStorage.setItem("stacklyLogoReloaded", "true");
  location.reload();
});

/* Scroll progress and premium header state */
window.addEventListener("scroll", () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

  if (progress) {
    if (progress) progress.style.width = value + "%";
  }

  if (mainHeader) {
    mainHeader.classList.toggle("scrolled", window.scrollY > 80);
  }
});

/* Premium cursor glow */
document.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;

  if (cursorGlow) {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  }
});

/* Reveal animation and progress bars */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("show");

      entry.target.querySelectorAll(".progress b").forEach((bar) => {
        bar.style.width = bar.dataset.width || "80%";
      });
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const duration = 1400;
      const startTime = performance.now();

      function update(now) {
        const amount = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - amount, 3);
        const value = Math.floor(eased * target);

        if (target === 98) {
          counter.textContent = value + "%";
        } else if (target >= 1000) {
          counter.textContent = value.toLocaleString() + "+";
        } else {
          counter.textContent = value + "+";
        }

        if (amount < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(counter);
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
}

/* Hero image parallax */
function initParallax() {
  const images = document.querySelectorAll(".parallax-img");

  document.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 900) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 16;
    const y = (event.clientY / window.innerHeight - 0.5) * 16;

    images.forEach((image) => {
      image.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
    });
  });
}

/* Soft 3D hover cards */
function initTiltCards() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) return;

      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function submitForm(event) {
  event.preventDefault();
  alert("Appointment request submitted successfully!");
  event.target.reset();
}



/* ===== LIGHT / DARK MODE ===== */
(function(){
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("stacklyTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("stacklyTheme", isDark ? "dark" : "light");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }
})();


/* Extra responsive menu safety */
document.addEventListener("click", (event) => {
  const clickedInsideHeader = event.target.closest("#mainHeader");
  if (!clickedInsideHeader) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) closeMenu();
});
