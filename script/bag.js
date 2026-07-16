const showMyBag = () => {
  const myBag = [
    { name: "지갑", count: 1 },
    { name: "스마트폰", count: 1 },
    { name: "에어팟", count: 1 },
    { name: "볼펜", count: 2 },
    { name: "화장품", count: 3 },
  ];

  let message = "[내 가방 속 물품 목록]\n\n";
  let cnt = 0;

  for (const item of myBag) {
    message += `${item.name}: ${item.count}개\n`;
    cnt++;
  }

  message += `\n총 물품 종류: ${cnt}가지`;

  alert(message);
};
