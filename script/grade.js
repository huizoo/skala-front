const calculateGrade = () => {
  const subjects = ["HTML", "CSS", "JavaScript"];
  let total = 0;

  for (let i = 0; i < subjects.length; i++) {
    while (true) {
      const input = prompt(`${subjects[i]} 점수를 입력하세요.`);

      if (input === null) {
        alert("계산을 종료합니다.");
        return;
      }

      if (input.trim() === "") {
        alert("숫자를 입력해주세요.");
        continue;
      }

      const num = Number(input);

      if (!Number.isInteger(num) || num < 0 || num > 100) {
        alert("0 이상 100 이하의 정수만 입력해주세요.");
        continue;
      }

      total += num;
      break;
    }
  }
  const average = total / subjects.length;
  const result = average >= 60 ? "합격" : "불합격";

  alert(`총점: ${total}점\n평균: ${average}점\n결과: ${result}입니다!`);
};
