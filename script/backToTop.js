const backToTopButton = document.createElement("button");
const siteFooter = document.querySelector(".site-footer");

backToTopButton.className = "back-to-top";
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "페이지 상단으로 이동");
backToTopButton.innerHTML = `
  <svg class="ui-icon" aria-hidden="true" viewBox="0 0 24 24">
    <path d="m18 15-6-6-6 6" />
  </svg>
`;

document.body.append(backToTopButton);

const updateBackToTopButton = () => {
  const isVisible = window.scrollY > 400;

  backToTopButton.classList.toggle("is-visible", isVisible);
  backToTopButton.tabIndex = isVisible ? 0 : -1;

  if (siteFooter) {
    const footerTop = siteFooter.getBoundingClientRect().top;
    const buttonBottom = window.innerHeight - parseFloat(getComputedStyle(backToTopButton).bottom);
    const footerGap = 24;
    const footerLift = Math.max(0, buttonBottom - footerTop + footerGap);

    backToTopButton.style.setProperty("--footer-lift", `-${footerLift}px`);
  }
};

backToTopButton.addEventListener("click", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth",
  });
});

window.addEventListener("scroll", updateBackToTopButton, { passive: true });
window.addEventListener("resize", updateBackToTopButton);
updateBackToTopButton();
