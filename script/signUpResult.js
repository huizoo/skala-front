import { getCurrentUser } from "./authStore.js";

const params = new URLSearchParams(window.location.search);
const user = getCurrentUser();
const name = user?.name ?? params.get("userName");
const title = document.querySelector("#signup-result-title");
const message = document.querySelector("#signup-result-message");

if (name) {
  title.textContent = `${name}님, 회원가입을 축하합니다!`;
  message.textContent = "로그인 상태가 시작되었습니다. 마이페이지에서 입력 정보를 확인할 수 있습니다.";
}
