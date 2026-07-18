(() => {
  const utility = document.querySelector(".home-utility");
  if (!utility) return;

  const desktopLayout = window.matchMedia("(min-width: 60.001rem)");
  let updateFrame = 0;

  const updateStickyState = () => {
    updateFrame = 0;
    utility.classList.remove("is-sticky");

    if (!desktopLayout.matches) return;

    const utilityStyle = window.getComputedStyle(utility);
    const rootStyle = window.getComputedStyle(document.documentElement);
    const topPadding = Number.parseFloat(utilityStyle.paddingTop) || 0;
    const viewportGap = Number.parseFloat(rootStyle.getPropertyValue("--space-3")) || 24;
    const contentHeight = utility.scrollHeight - topPadding;
    const availableHeight = window.innerHeight - viewportGap * 2;

    utility.classList.toggle("is-sticky", contentHeight <= availableHeight);
  };

  const scheduleUpdate = () => {
    if (updateFrame) return;
    updateFrame = window.requestAnimationFrame(updateStickyState);
  };

  const resizeObserver = new ResizeObserver(scheduleUpdate);
  resizeObserver.observe(utility);
  desktopLayout.addEventListener?.("change", scheduleUpdate);
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  scheduleUpdate();
})();
