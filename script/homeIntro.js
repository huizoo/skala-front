(() => {
  const root = document.documentElement;
  if (!root.classList.contains("intro-active")) return;

  const introKey = "skala-home-intro-seen-v4";
  const titleText = "김희주의 유니버스";
  const overlay = document.createElement("div");
  const introTitle = document.createElement("p");
  const skipButton = document.createElement("button");
  let hasFinished = false;
  let characterIndex = 0;
  let typingTimer;
  let sequenceTimer;
  let safetyTimer;
  let fontTimer;

  const handleIntroKeydown = (event) => {
    if (event.key === "Escape") finishIntro(true);
  };

  overlay.className = "home-intro";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-label", "페이지를 준비하고 있습니다");
  introTitle.className = "home-intro__title";
  introTitle.setAttribute("aria-hidden", "true");
  skipButton.className = "home-intro__skip";
  skipButton.type = "button";
  skipButton.textContent = "건너뛰기";
  overlay.append(introTitle, skipButton);
  document.body.prepend(overlay);
  root.classList.add("intro-mounted");

  const rememberIntro = () => {
    try {
      window.sessionStorage.setItem(introKey, "true");
    } catch {
      // The intro still works when browser storage is unavailable.
    }
  };

  const finishIntro = (immediately = false) => {
    if (hasFinished) return;
    hasFinished = true;
    window.clearTimeout(typingTimer);
    window.clearTimeout(sequenceTimer);
    window.clearTimeout(safetyTimer);
    window.clearTimeout(fontTimer);
    document.removeEventListener("keydown", handleIntroKeydown);
    rememberIntro();

    if (immediately) root.classList.add("intro-no-transition");
    root.classList.add("intro-complete");

    window.setTimeout(
      () => {
        root.classList.remove(
          "intro-active",
          "intro-mounted",
          "intro-title-moving",
          "intro-complete",
          "intro-no-transition",
        );
        overlay.remove();
      },
      immediately ? 0 : 320,
    );
  };

  const moveTitle = () => {
    const target = document.querySelector(".home-title__main");
    if (!target) {
      finishIntro(true);
      return;
    }

    const sourceRect = introTitle.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const scale = Math.min(
      Math.max(targetRect.width / Math.max(sourceRect.width, 1), 0.6),
      1.8,
    );

    introTitle.style.setProperty("--intro-x", `${targetCenterX - sourceCenterX}px`);
    introTitle.style.setProperty("--intro-y", `${targetCenterY - sourceCenterY}px`);
    introTitle.style.setProperty("--intro-scale", String(scale));
    root.classList.add("intro-title-moving");

    sequenceTimer = window.setTimeout(() => {
      finishIntro();
    }, 680);
  };

  const typeNextCharacter = () => {
    characterIndex += 1;
    introTitle.textContent = titleText.slice(0, characterIndex);

    if (characterIndex < titleText.length) {
      typingTimer = window.setTimeout(typeNextCharacter, 65);
      return;
    }

    sequenceTimer = window.setTimeout(moveTitle, 260);
  };

  skipButton.addEventListener("click", () => finishIntro(true));
  document.addEventListener("keydown", handleIntroKeydown);

  const startTyping = () => {
    if (hasFinished) return;
    window.clearTimeout(fontTimer);
    typingTimer = window.setTimeout(typeNextCharacter, 180);
  };

  if (document.fonts?.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => {
        fontTimer = window.setTimeout(resolve, 1800);
      }),
    ]).then(startTyping);
  } else {
    startTyping();
  }

  safetyTimer = window.setTimeout(() => finishIntro(true), 7000);
})();
