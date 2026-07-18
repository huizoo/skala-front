(() => {
  const introKey = "skala-home-intro-seen-v4";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasSeenIntro = false;

  try {
    hasSeenIntro = window.sessionStorage.getItem(introKey) === "true";
  } catch {
    hasSeenIntro = false;
  }

  if (!reduceMotion && !hasSeenIntro) {
    document.documentElement.classList.add("intro-active");
  }
})();
