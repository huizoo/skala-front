const startUpDownGame = () => {
  const computerNum = Math.floor(Math.random() * 50) + 1;
  let cnt = 0;

  while (true) {
    const input = prompt(
      "1부터 50 사이의 숫자 중 컴퓨터가 생각한 숫자는 무엇일까요?",
    );
    if (input === null) {
      alert("게임을 종료합니다.");
      return;
    }

    if (input.trim() === "") {
      alert("숫자를 입력해주세요.");
      continue;
    }
    const num = Number(input);

    if (!Number.isInteger(num) || num < 1 || num > 50) {
      alert("1부터 50 사이의 정수만 입력해주세요.");
      continue;
    }

    cnt++;

    if (num < computerNum) {
      alert("컴퓨터가 생각한 숫자는 입력한 숫자보다 큽니다!");
    } else if (num > computerNum) {
      alert("컴퓨터가 생각한 숫자는 입력한 숫자보다 작습니다!");
    } else {
      const retry = confirm(
        `정답입니다! ${cnt}번의 시도 끝에 컴퓨터가 생각한 숫자를 맞췄습니다!\n다른 숫자도 맞춰보시겠습니까?`,
      );

      if (retry) {
        return startUpDownGame();
      }

      alert("게임을 종료합니다.");
      return;
    }
  }
};
