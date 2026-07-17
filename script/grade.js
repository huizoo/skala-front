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
  let grade = "F";

  if (average >= 90) {
    grade = "A";
  } else if (average >= 80) {
    grade = "B";
  } else if (average >= 70) {
    grade = "C";
  } else if (average >= 60) {
    grade = "D";
  }

  alert(
    `총점: ${total}점\n평균: ${average.toFixed(2)}점\n등급: ${grade}\n결과: ${result}입니다!`,
  );
};
