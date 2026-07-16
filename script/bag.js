const showMyBag = () => {
  const myBag = {
    지갑: 1,
    스마트폰: 1,
    에어팟: 1,
    볼펜: 2,
    화장품: 3,
  };

  let message = "[내 가방 속 물품 목록]\n\n";
  let cnt = 0;

  for (const item in myBag) {
    message += `- ${item}: ${myBag[item]}개\n`;
    cnt++;
  }

  message += `\n총 물품 종류: ${cnt}가지`;

  alert(message);
};
