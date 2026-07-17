const travelSoundtrack = document.querySelector("#travel-soundtrack");

if (travelSoundtrack) {
  travelSoundtrack.volume = 0.25;

  const autoplayAttempt = travelSoundtrack.play();

  if (autoplayAttempt) {
    autoplayAttempt.catch(() => {
      // 소리가 있는 자동 재생이 차단되면 기본 오디오 컨트롤로 재생할 수 있습니다.
    });
  }
}
