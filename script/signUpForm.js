const signupForm = document.querySelector(".signup-form");
const passwordInput = document.querySelector("#userPw");
const passwordToggle = document.querySelector(".password-toggle");
const emailDomain = document.querySelector("#emailDomain");
const emailCustomDomain = document.querySelector("#emailCustomDomain");
const introTextarea = document.querySelector("#userIntro");
const introCount = document.querySelector("#intro-count span");

const validationMessages = {
  userId: "아이디는 4~15자의 영문과 숫자로 입력해주세요.",
  userPw: "비밀번호는 8자 이상 입력해주세요.",
  userEmail: "이메일 아이디를 입력해주세요.",
  emailCustomDomain: "올바른 도메인을 입력해주세요. 예: example.com",
  userName: "이름을 입력해주세요.",
  userBirth: "생년월일을 선택해주세요.",
};

const showFieldError = (input) => {
  const errorId = input.dataset.errorTarget ?? `${input.id}-error`;
  const error = document.querySelector(`#${errorId}`);

  if (!error) return;

  const isValid = input.checkValidity();
  error.textContent = isValid ? "" : validationMessages[input.id];
  input.setAttribute("aria-invalid", String(!isValid));
};

signupForm.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") showFieldError(input);
  });
});

passwordToggle.addEventListener("click", () => {
  const isVisible = passwordInput.type === "text";

  passwordInput.type = isVisible ? "password" : "text";
  passwordToggle.textContent = isVisible ? "보기" : "숨기기";
  passwordToggle.setAttribute("aria-label", isVisible ? "비밀번호 표시" : "비밀번호 숨기기");
  passwordToggle.setAttribute("aria-pressed", String(!isVisible));
  passwordInput.focus();
});

emailDomain.addEventListener("change", () => {
  const isDirect = emailDomain.value === "direct";

  emailCustomDomain.hidden = !isDirect;
  emailCustomDomain.disabled = !isDirect;
  emailCustomDomain.required = isDirect;
  if (isDirect) {
    emailCustomDomain.focus();
  } else {
    emailCustomDomain.value = "";
    emailCustomDomain.removeAttribute("aria-invalid");
    document.querySelector("#emailCustomDomain-error").textContent = "";
  }
});

introTextarea.addEventListener("input", () => {
  introCount.textContent = introTextarea.value.length;
});

signupForm.addEventListener("submit", (event) => {
  const requiredInputs = [...signupForm.querySelectorAll("[required]")];

  requiredInputs.forEach(showFieldError);

  const firstInvalidInput = requiredInputs.find((input) => !input.checkValidity());
  if (firstInvalidInput) {
    event.preventDefault();
    firstInvalidInput.focus();
  }
});

signupForm.addEventListener("reset", () => {
  window.requestAnimationFrame(() => {
    signupForm.querySelectorAll(".form-error").forEach((error) => (error.textContent = ""));
    signupForm.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
    emailCustomDomain.hidden = true;
    emailCustomDomain.disabled = true;
    emailCustomDomain.required = false;
    passwordInput.type = "password";
    passwordToggle.textContent = "보기";
    passwordToggle.setAttribute("aria-pressed", "false");
    introCount.textContent = "0";
  });
});
