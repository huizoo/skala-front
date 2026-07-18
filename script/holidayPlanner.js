import { getCurrentUser } from "./authStore.js";

const plannerForm = document.querySelector("#planner-form");
const plannerList = document.querySelector("#planner-list");
const emptyMessage = document.querySelector("#planner-empty");
const ownerMessage = document.querySelector("#planner-owner-message");
const count = document.querySelector("#planner-count");
const clearButton = document.querySelector("#planner-clear");
const cancelButton = document.querySelector("#planner-cancel");
const submitLabel = document.querySelector("#planner-submit-label");
const user = getCurrentUser();
const ownerId = user?.userId ?? "guest";
const storageKey = `skala-weekend-planner:${ownerId}`;
const dayOrder = { saturday: 0, sunday: 1 };
const dayLabels = { saturday: "토요일", sunday: "일요일" };

let editingId = null;

const loadPlans = () => {
  try {
    const plans = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(plans) ? plans : [];
  } catch {
    return [];
  }
};

let plans = loadPlans();

const savePlans = () => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(plans));
    return true;
  } catch {
    window.alert("일정을 저장하지 못했습니다. 브라우저 저장소를 확인해주세요.");
    return false;
  }
};

const sortPlans = () => {
  plans.sort(
    (first, second) =>
      dayOrder[first.day] - dayOrder[second.day] || first.time.localeCompare(second.time),
  );
};

const createActionButton = (label, action, id) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
};

const renderPlans = () => {
  sortPlans();
  plannerList.replaceChildren();
  count.textContent = String(plans.length);
  emptyMessage.hidden = plans.length > 0;
  clearButton.disabled = plans.length === 0;

  plans.forEach((plan) => {
    const item = document.createElement("li");
    const meta = document.createElement("p");
    const title = document.createElement("strong");
    const actions = document.createElement("div");

    item.className = "planner-item";
    meta.className = "planner-item__meta";
    actions.className = "planner-item__actions";
    meta.textContent = `${dayLabels[plan.day]} · ${plan.time}`;
    title.textContent = plan.title;
    actions.append(
      createActionButton("수정", "edit", plan.id),
      createActionButton("삭제", "delete", plan.id),
    );
    item.append(meta, title, actions);
    plannerList.append(item);
  });
};

const resetForm = () => {
  editingId = null;
  plannerForm.reset();
  submitLabel.textContent = "일정 추가";
  cancelButton.hidden = true;
};

plannerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!plannerForm.checkValidity()) {
    plannerForm.reportValidity();
    return;
  }

  const formData = new FormData(plannerForm);
  const plan = {
    id:
      editingId ??
      window.crypto.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    day: String(formData.get("day")),
    time: String(formData.get("time")),
    title: String(formData.get("title")).trim(),
  };

  if (editingId) {
    plans = plans.map((item) => (item.id === editingId ? plan : item));
  } else {
    plans.push(plan);
  }

  if (savePlans()) {
    resetForm();
    renderPlans();
  }
});

plannerList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const plan = plans.find((item) => item.id === button.dataset.id);
  if (!plan) return;

  if (button.dataset.action === "delete") {
    if (!window.confirm(`“${plan.title}” 일정을 삭제할까요?`)) return;

    plans = plans.filter((item) => item.id !== plan.id);
    if (savePlans()) {
      renderPlans();
    }
    return;
  }

  editingId = plan.id;
  plannerForm.elements.day.value = plan.day;
  plannerForm.elements.time.value = plan.time;
  plannerForm.elements.title.value = plan.title;
  submitLabel.textContent = "수정 완료";
  cancelButton.hidden = false;
  plannerForm.elements.title.focus();
});

cancelButton?.addEventListener("click", resetForm);

clearButton?.addEventListener("click", () => {
  if (!plans.length || !window.confirm("저장된 개인 일정을 모두 삭제할까요?")) return;
  plans = [];
  if (savePlans()) {
    resetForm();
    renderPlans();
  }
});

ownerMessage.textContent = user
  ? `${user.name}님의 브라우저에 개인 일정이 저장됩니다.`
  : "로그인 전에는 게스트 일정으로 저장되며, 로그인하면 계정별로 따로 관리됩니다.";
renderPlans();
