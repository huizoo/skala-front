import { getCurrentUser, logout } from "./authStore.js";

const menuIcon = `
  <svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
  </svg>
`;

const closeIcon = `
  <svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
    <path d="m6 6 12 12" /><path d="m18 6-12 12" />
  </svg>
`;

const setupSiteShell = () => {
  const headerInner = document.querySelector(".site-header__inner");
  const nav = headerInner?.querySelector(".site-nav");
  const navList = nav?.querySelector("ul");

  if (!headerInner || !nav || !navList) return;

  nav.id ||= "site-navigation";

  const accountLink = [...navList.querySelectorAll("a")].find((link) =>
    /\/(signUp|myPage)\.html$/.test(new URL(link.href).pathname),
  );
  const authItem = navList.querySelector(".site-nav__auth-item");

  if (!authItem) return;

  const updateAuthNavigation = () => {
    const user = getCurrentUser();
    const pageName = window.location.pathname.split("/").pop();

    if (accountLink) {
      accountLink.href = user ? "./myPage.html" : "./signUp.html";
      accountLink.textContent = user ? "마이페이지" : "회원가입";
      const isAccountPage = user
        ? pageName === "myPage.html"
        : pageName === "signUp.html";

      if (isAccountPage) accountLink.setAttribute("aria-current", "page");
      else accountLink.removeAttribute("aria-current");
    }

    authItem.replaceChildren();

    if (user) {
      const logoutButton = document.createElement("button");
      logoutButton.className = "site-nav__auth-button";
      logoutButton.type = "button";
      logoutButton.textContent = "로그아웃";
      logoutButton.title = `${user.name}님 로그아웃`;
      logoutButton.addEventListener("click", () => {
        logout();
        window.location.assign("./index.html");
      });
      authItem.append(logoutButton);
    } else {
      const loginLink = document.createElement("a");
      loginLink.href = "./login.html";
      loginLink.textContent = "로그인";
      if (pageName === "login.html") loginLink.setAttribute("aria-current", "page");
      authItem.append(loginLink);
    }
  };

  const navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.type = "button";
  navToggle.setAttribute("aria-controls", nav.id);
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "메뉴 열기");
  navToggle.innerHTML = menuIcon;
  headerInner.classList.add("has-nav-toggle");
  headerInner.insertBefore(navToggle, nav);

  const setMenuOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    navToggle.innerHTML = isOpen ? closeIcon : menuIcon;
  };

  navToggle.addEventListener("click", () => {
    setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  window.matchMedia("(min-width: 49.126rem)").addEventListener?.("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });
  window.addEventListener("skala:auth-change", updateAuthNavigation);
  updateAuthNavigation();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSiteShell, { once: true });
} else {
  setupSiteShell();
}
