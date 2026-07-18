import { getCurrentUser, logout } from "./authStore.js";

const accountSection = document.querySelector("#my-page-account");
const guestSection = document.querySelector("#my-page-guest");
const title = document.querySelector("#my-page-title");
const user = getCurrentUser();

const genderLabels = { male: "남성", female: "여성", none: "선택 안 함" };
const interestLabels = {
  frontend: "웹 프론트엔드",
  uiux: "UI/UX 디자인",
  backend: "백엔드·데이터베이스",
  devops: "클라우드·인프라",
};

if (!user?.userId) {
  guestSection.hidden = false;
} else {
  accountSection.hidden = false;
  title.textContent = `${user.name}님의 마이페이지`;

  const values = {
    ...user,
    gender: genderLabels[user.gender] ?? "선택 안 함",
    interests:
      user.interests?.map((interest) => interestLabels[interest] ?? interest).join(", ") || "선택 안 함",
    subscription: user.subscription || "선택 안 함",
    intro: user.intro || "작성하지 않음",
    createdAt: new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(
      new Date(user.createdAt),
    ),
  };

  document.querySelectorAll("[data-user-field]").forEach((field) => {
    field.textContent = values[field.dataset.userField] || "-";
  });
}

document.querySelector("#my-page-logout")?.addEventListener("click", () => {
  logout();
  window.location.assign("./login.html");
});
