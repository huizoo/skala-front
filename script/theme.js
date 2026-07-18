(() => {
  const storageKey = "skala-theme";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const readSavedTheme = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  };

  const storedTheme = readSavedTheme();
  const savedTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
  applyTheme(savedTheme ?? (systemTheme.matches ? "dark" : "light"));

  const setupThemeToggle = () => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;

    const updateButton = () => {
      const isDark = root.dataset.theme === "dark";
      button.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
      button.title = isDark ? "라이트 모드" : "다크 모드";
    };

    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {
        // 저장이 제한된 환경에서도 현재 페이지의 테마 전환은 유지한다.
      }

      updateButton();
    });

    updateButton();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeToggle, { once: true });
  } else {
    setupThemeToggle();
  }
})();
