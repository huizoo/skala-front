(() => {
  const modeButtons = document.querySelectorAll("[data-tool-mode]");
  const modeDescription = document.querySelector("#tool-mode-description");
  const dialog = document.querySelector("#quick-tool-dialog");
  const form = document.querySelector("#quick-tool-form");
  const title = document.querySelector("#quick-tool-title");
  const description = document.querySelector("#quick-tool-description");
  const result = document.querySelector("#quick-tool-result");
  const field = document.querySelector("#quick-tool-field");
  const inputLabel = document.querySelector("#quick-tool-input-label");
  const input = document.querySelector("#quick-tool-input");
  const error = document.querySelector("#quick-tool-error");
  const cancelButton = document.querySelector("#quick-tool-cancel");
  const closeButton = document.querySelector("#quick-tool-close");
  const submitLabel = document.querySelector("#quick-tool-submit-label");

  if (!modeButtons.length || !dialog || !form) return;

  const subjects = ["HTML", "CSS", "JavaScript"];
  const bagItems = [
    { name: "지갑", count: 1 },
    { name: "스마트폰", count: 1 },
    { name: "에어팟", count: 1 },
    { name: "볼펜", count: 2 },
    { name: "화장품", count: 3 },
  ];
  const nativeTools = {
    upDown: () => startUpDownGame(),
    grade: () => calculateGrade(),
    bag: () => showMyBag(),
  };

  let toolMode = "alert";
  let toolState = null;

  const setMode = (mode) => {
    toolMode = mode;
    modeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.toolMode === mode));
    });
    modeDescription.textContent =
      mode === "alert"
        ? "과제 필수 prompt·alert 방식으로 실행합니다."
        : "페이지 안의 커스텀 dialog 방식으로 실행합니다.";
  };

  const clearDialog = () => {
    result.replaceChildren();
    result.classList.remove("is-complete");
    error.textContent = "";
    field.hidden = false;
    cancelButton.hidden = false;
    input.value = "";
    input.removeAttribute("min");
    input.removeAttribute("max");
    submitLabel.textContent = "확인";
  };

  const openDialog = () => {
    dialog.showModal();
    window.requestAnimationFrame(() => input.focus());
  };

  const configureInput = ({ label, min, max }) => {
    inputLabel.textContent = label;
    input.min = String(min);
    input.max = String(max);
  };

  const completeTool = (message) => {
    description.textContent = message;
    result.classList.add("is-complete");
    field.hidden = true;
    cancelButton.hidden = true;
    submitLabel.textContent = "닫기";
    toolState.complete = true;
  };

  const startUpDownDialog = () => {
    clearDialog();
    toolState = {
      type: "upDown",
      answer: Math.floor(Math.random() * 50) + 1,
      attempts: 0,
      complete: false,
    };
    title.textContent = "업다운 게임";
    description.textContent = "1부터 50 사이에서 컴퓨터가 고른 숫자를 맞혀보세요.";
    configureInput({ label: "예상 숫자", min: 1, max: 50 });
    result.textContent = "시도 횟수 0회";
    openDialog();
  };

  const startGradeDialog = () => {
    clearDialog();
    toolState = { type: "grade", subjectIndex: 0, scores: [], complete: false };
    title.textContent = "성적 계산기";
    description.textContent = "세 과목의 점수를 차례대로 입력해주세요.";
    configureInput({ label: `${subjects[0]} 점수`, min: 0, max: 100 });
    result.textContent = `1 / ${subjects.length} 과목`;
    openDialog();
  };

  const startBagDialog = () => {
    clearDialog();
    toolState = { type: "bag", complete: true };
    title.textContent = "내 가방 보기";
    description.textContent = "반복문으로 확인한 가방 속 물품 목록입니다.";
    field.hidden = true;
    cancelButton.hidden = true;
    submitLabel.textContent = "닫기";

    const list = document.createElement("ul");
    bagItems.forEach((item) => {
      const listItem = document.createElement("li");
      const name = document.createElement("span");
      const count = document.createElement("strong");
      name.textContent = item.name;
      count.textContent = `${item.count}개`;
      listItem.append(name, count);
      list.append(listItem);
    });
    const summary = document.createElement("p");
    summary.textContent = `총 물품 종류 ${bagItems.length}가지`;
    result.append(list, summary);
    result.classList.add("is-complete");
    dialog.showModal();
  };

  const readInteger = (min, max) => {
    const value = input.value.trim();
    if (!value) {
      error.textContent = "숫자를 입력해주세요.";
      return null;
    }

    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
      error.textContent = `${min} 이상 ${max} 이하의 정수만 입력해주세요.`;
      return null;
    }

    error.textContent = "";
    return number;
  };

  const submitUpDown = () => {
    const guess = readInteger(1, 50);
    if (guess === null) return;

    toolState.attempts += 1;
    if (guess === toolState.answer) {
      result.textContent = `정답 ${toolState.answer} · ${toolState.attempts}번 만에 성공`;
      completeTool("축하합니다! 컴퓨터가 생각한 숫자를 맞혔습니다.");
      return;
    }

    result.textContent = `${guess < toolState.answer ? "Up" : "Down"}! · 시도 횟수 ${toolState.attempts}회`;
    input.value = "";
    input.focus();
  };

  const submitGrade = () => {
    const score = readInteger(0, 100);
    if (score === null) return;

    toolState.scores.push(score);
    toolState.subjectIndex += 1;

    if (toolState.subjectIndex < subjects.length) {
      input.value = "";
      inputLabel.textContent = `${subjects[toolState.subjectIndex]} 점수`;
      result.textContent = `${toolState.subjectIndex + 1} / ${subjects.length} 과목`;
      input.focus();
      return;
    }

    const total = toolState.scores.reduce((sum, item) => sum + item, 0);
    const average = total / subjects.length;
    const passed = average >= 60;
    const grade = average >= 90 ? "A" : average >= 80 ? "B" : average >= 70 ? "C" : average >= 60 ? "D" : "F";
    result.textContent = `총점 ${total}점\n평균 ${average.toFixed(2)}점\n등급 ${grade}\n${passed ? "합격" : "불합격"}`;
    completeTool(`성적 계산이 완료되었습니다. ${passed ? "합격입니다!" : "불합격입니다."}`);
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.toolMode));
  });

  window.runQuickTool = (toolName) => {
    if (toolMode === "alert") {
      nativeTools[toolName]?.();
      return;
    }

    if (toolName === "upDown") startUpDownDialog();
    else if (toolName === "grade") startGradeDialog();
    else if (toolName === "bag") startBagDialog();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!toolState) return;
    if (toolState.complete) {
      dialog.close();
      return;
    }
    if (toolState.type === "upDown") submitUpDown();
    else if (toolState.type === "grade") submitGrade();
  });

  cancelButton.addEventListener("click", () => dialog.close());
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    toolState = null;
  });
})();
