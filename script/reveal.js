(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const selectors = [
    ".page-heading",
    ".section-heading",
    ".home-hero__copy",
    ".home-update-card",
    ".home-photo-card",
    ".home-notes__list li",
    ".utility-grid article",
    ".profile-section",
    ".holiday-day__heading",
    ".schedule-card",
    ".table-scroll",
    ".trip-soundtrack__bar",
    ".trip-card",
  ];

  const setupReveal = () => {
    const targets = [...document.querySelectorAll(selectors.join(","))];
    const groupIndexes = new Map();

    targets.forEach((target) => {
      const group = target.parentElement;
      const index = groupIndexes.get(group) ?? 0;

      groupIndexes.set(group, index + 1);
      target.dataset.reveal = "";
      target.style.setProperty("--reveal-delay", `${Math.min(index * 80, 240)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.removeAttribute("data-reveal"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          target.classList.add("is-revealed");
          target.addEventListener(
            "animationend",
            () => {
              target.classList.remove("is-revealed");
              target.removeAttribute("data-reveal");
              target.style.removeProperty("--reveal-delay");
            },
            { once: true },
          );
          observer.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    targets.forEach((target) => observer.observe(target));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupReveal, { once: true });
  } else {
    setupReveal();
  }
})();
