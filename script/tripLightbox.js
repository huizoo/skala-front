const tripPreviewButtons = [
  ...document.querySelectorAll(".trip-card__preview"),
];
const tripLightbox = document.querySelector("#trip-lightbox");
const tripLightboxImage = document.querySelector("#trip-lightbox-image");
const tripLightboxTitle = document.querySelector("#trip-lightbox-title");
const tripLightboxYear = document.querySelector("#trip-lightbox-year");
const tripLightboxClose = document.querySelector(".trip-lightbox__close");
const tripLightboxPrevious = document.querySelector(
  ".trip-lightbox__nav--previous",
);
const tripLightboxNext = document.querySelector(".trip-lightbox__nav--next");

let currentTripImageIndex = 0;

const renderTripImage = (index) => {
  const button = tripPreviewButtons[index];
  const thumbnail = button.querySelector("img");

  currentTripImageIndex = index;
  tripLightboxImage.src = button.dataset.lightboxSrc;
  tripLightboxImage.alt = thumbnail.alt;
  tripLightboxTitle.textContent = button.dataset.lightboxTitle;
  tripLightboxYear.textContent = button.dataset.lightboxYear;
  tripLightboxYear.dateTime = button.dataset.lightboxYear;
};

const moveTripImage = (direction) => {
  const nextIndex =
    (currentTripImageIndex + direction + tripPreviewButtons.length) %
    tripPreviewButtons.length;

  renderTripImage(nextIndex);
};

tripPreviewButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    renderTripImage(index);
    tripLightbox.showModal();
    document.body.classList.add("is-lightbox-open");
  });
});

tripLightboxClose.addEventListener("click", () => tripLightbox.close());
tripLightboxPrevious.addEventListener("click", () => moveTripImage(-1));
tripLightboxNext.addEventListener("click", () => moveTripImage(1));

tripLightbox.addEventListener("click", (event) => {
  if (event.target === tripLightbox) {
    tripLightbox.close();
  }
});

tripLightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    moveTripImage(-1);
  } else if (event.key === "ArrowRight") {
    moveTripImage(1);
  }
});

tripLightbox.addEventListener("close", () => {
  document.body.classList.remove("is-lightbox-open");
});
