import { AuthError, authenticateUser, getCurrentUser, startSession } from "./authStore.js";

const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");

if (getCurrentUser()) {
  window.location.replace("./myPage.html");
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  if (!loginForm.checkValidity()) {
    loginError.textContent = "아이디와 비밀번호를 모두 입력해주세요.";
    loginForm.querySelector(":invalid")?.focus();
    return;
  }

  const submitButton = loginForm.querySelector('button[type="submit"]');
  const formData = new FormData(loginForm);
  submitButton.disabled = true;

  try {
    const user = await authenticateUser(
      String(formData.get("userId")),
      String(formData.get("password")),
    );
    startSession(user.userId, formData.get("remember") === "on");
    window.location.assign("./myPage.html");
  } catch (error) {
    loginError.textContent =
      error instanceof AuthError ? error.message : "로그인 중 문제가 발생했습니다.";
  } finally {
    submitButton.disabled = false;
  }
});
