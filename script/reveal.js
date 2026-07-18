(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const scenes = [
    { selector: ".page-heading", type: "page-title" },
    { selector: ".home-hero__copy", type: "heading" },
    { selector: ".section-heading", type: "heading" },
    {
      selector:
        ".home-update-card, .utility-grid article, .profile-section",
      type: "panel",
    },
    { selector: ".home-photo-card, .trip-card", type: "media" },
    { selector: ".home-notes__list li", type: "item" },
    { selector: ".table-scroll", type: "simple" },
    { selector: ".trip-soundtrack", type: "sequence" },
    { selector: ".holiday-plan-heading, .holiday-day", type: "sequence" },
  ];

  const setupReveal = () => {
    const sceneByElement = new Map();

    scenes.forEach(({ selector, type }) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (type === "heading" && element.closest(".profile-section")) return;
        if (type === "heading" && element.matches(".trip-soundtrack .section-heading")) return;
        if (type === "heading" && element.matches(".holiday-plan-heading")) return;
        if (!sceneByElement.has(element)) sceneByElement.set(element, type);
      });
    });

    const targets = [...sceneByElement.keys()];
    const groupIndexes = new Map();

    targets.forEach((target) => {
      const group = target.parentElement;
      const index = groupIndexes.get(group) ?? 0;
      const type = sceneByElement.get(target);
      const baseDelay =
        type === "heading" || type === "page-title" ? 0 : type === "item" ? 80 : 120;
      const isProfileSection = target.matches(".profile-section");
      const isTable = target.matches(".table-scroll");
      const isSoundtrackSequence = target.matches(".trip-soundtrack");
      const isHolidayPlanHeading = target.matches(".holiday-plan-heading");
      const isHolidayDay = target.matches(".holiday-day");
      const isFirstHolidayDay =
        isHolidayDay && target.parentElement.querySelector(".holiday-day") === target;
      const isInitiallyVisible = target.getBoundingClientRect().top < window.innerHeight * 0.94;
      const isFirstProfileSection =
        isProfileSection && target.parentElement.querySelector(".profile-section") === target;
      let delay = Math.min(baseDelay + index * 90, 360);

      if (isFirstProfileSection) delay = 540;
      else if (isProfileSection) delay = 0;
      else if ((isTable || isSoundtrackSequence) && isInitiallyVisible) delay = 540;
      else if (isHolidayPlanHeading && isInitiallyVisible) delay = 540;
      else if (isFirstHolidayDay && isInitiallyVisible) delay = 720;
      else if (isTable || isSoundtrackSequence || isHolidayPlanHeading || isHolidayDay) delay = 0;

      groupIndexes.set(group, index + 1);
      target.dataset.reveal = type;
      target.style.setProperty("--reveal-delay", `${delay}ms`);

      const setPiece = (piece, pieceDelay) => {
        piece.dataset.revealPiece = "";
        piece.style.setProperty("--piece-delay", `${pieceDelay}ms`);
      };

      if (isProfileSection) {
        const sectionHeading = target.querySelector(":scope > .section-heading");
        const listItems = target.querySelectorAll(":scope > ul > li, :scope > ol > li");
        const descriptionItems = target.querySelectorAll(":scope > dl > dt, :scope > dl > dd");

        if (sectionHeading) setPiece(sectionHeading, 0);
        listItems.forEach((item, itemIndex) => setPiece(item, 90 + itemIndex * 90));
        descriptionItems.forEach((item, itemIndex) => {
          setPiece(item, 90 + Math.floor(itemIndex / 2) * 90);
        });
        return;
      }

      if (isSoundtrackSequence) {
        const headingItems = target.querySelectorAll(":scope > .section-heading > *");
        const player = target.querySelector(":scope > .trip-soundtrack__bar");

        headingItems.forEach((item, itemIndex) => setPiece(item, itemIndex * 90));
        if (player) setPiece(player, headingItems.length * 90);
        return;
      }

      if (isHolidayPlanHeading) {
        [...target.children].forEach((item, itemIndex) => setPiece(item, itemIndex * 90));
        return;
      }

      if (isHolidayDay) {
        const headingItems = target.querySelectorAll(":scope > .holiday-day__heading > *");
        const cards = target.querySelectorAll(":scope > .holiday-schedule__grid > .schedule-card");

        headingItems.forEach((item, itemIndex) => setPiece(item, itemIndex * 90));
        cards.forEach((card, cardIndex) => setPiece(card, 180 + cardIndex * 90));
        return;
      }

      if (type === "simple") return;

      [...target.children].forEach((piece, pieceIndex) => {
        const pieceStep = type === "page-title" ? 180 : 70;

        setPiece(piece, Math.min(pieceIndex * pieceStep, 450));
      });
    });

    const cleanupReveal = (target) => {
      target.classList.remove("is-revealed");
      target.removeAttribute("data-reveal");
      target.style.removeProperty("--reveal-delay");

      target.querySelectorAll("[data-reveal-piece]").forEach((piece) => {
        piece.removeAttribute("data-reveal-piece");
        piece.style.removeProperty("--piece-delay");
      });
    };

    if (!("IntersectionObserver" in window)) {
      targets.forEach(cleanupReveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          const delay = Number.parseInt(target.style.getPropertyValue("--reveal-delay"), 10) || 0;

          target.classList.add("is-revealed");
          window.setTimeout(() => cleanupReveal(target), 1300 + delay);
          observer.unobserve(target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6%" },
    );

    targets.forEach((target) => observer.observe(target));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setupReveal(), { once: true });
  } else {
    setupReveal();
  }
})();
