(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  const sections = ["home", "services", "engage", "about", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("open"));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }

    // Active section highlight
    const offset = (header ? header.offsetHeight : 72) + 24;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top - offset <= 0) {
        current = section;
      }
    }
    if (current) {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href === `#${current.id}`;
        if (match) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Progressive enhancement for contact form (FormSubmit.co POST).
  // No mailto hijack — native submit reaches FormSubmit. Optional UX: disable
  // button while submitting and show a brief status if the browser stays on-page.
  if (form) {
    form.addEventListener("submit", () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent || "";
        btn.textContent = "Sending…";
        // Re-enable if navigation is cancelled (e.g. validation or network abort)
        window.setTimeout(() => {
          if (btn.disabled) {
            btn.disabled = false;
            btn.textContent = btn.dataset.originalText || "Send Message";
          }
        }, 8000);
      }
    });
  }
})();
