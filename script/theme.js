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

  const sunIcon = `
    <svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.42 1.42" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  `;
  const moonIcon = `
    <svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  `;

  const setupThemeToggle = () => {
    const headerInner = document.querySelector(".site-header__inner");
    if (!headerInner) return;

    const button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";

    const updateButton = () => {
      const isDark = root.dataset.theme === "dark";
      button.innerHTML = isDark ? sunIcon : moonIcon;
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
    headerInner.append(button);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeToggle, { once: true });
  } else {
    setupThemeToggle();
  }
})();
