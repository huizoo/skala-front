import { reverseGeocodeCoordinates } from "./weatherAPI.js";

const locationName = document.querySelector("#current-location-name");
const locationStatus = document.querySelector("#current-location-status");
const locationButton = document.querySelector("#current-location-button");
const locationButtonLabel = locationButton?.querySelector(".location-request-button__label");

const setButtonLoading = (isLoading) => {
  locationButton.disabled = isLoading;
  locationButton.classList.toggle("is-loading", isLoading);
  locationButton.setAttribute("aria-busy", String(isLoading));
  locationButtonLabel.textContent = isLoading ? "위치 확인 중" : "현재 위치 사용";
};

const renderLocationName = (address) => {
  const candidates = [
    address.state ?? address.province,
    address.city ?? address.municipality ?? address.county,
    address.city_district ?? address.borough ?? address.suburb ?? address.town ?? address.village,
  ];
  const parts = candidates.filter(
    (part, index) => part && candidates.indexOf(part) === index,
  );

  locationName.replaceChildren();

  (parts.length > 0 ? parts : ["현재 위치"]).forEach((part, index) => {
    if (index > 0) locationName.append(document.createElement("br"));
    locationName.append(document.createTextNode(part));
  });
};

const handleLocationError = (error) => {
  setButtonLoading(false);
  locationButton.hidden = false;

  if (error.code === error.PERMISSION_DENIED) {
    locationStatus.textContent =
      "위치 권한이 차단되어 있습니다. 브라우저의 사이트 설정에서 위치 권한을 허용해주세요.";
    return;
  }

  locationStatus.textContent =
    error.code === error.TIMEOUT
      ? "위치 확인 시간이 초과되었습니다. 다시 시도해주세요."
      : "현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.";
};

const requestCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = "현재 브라우저에서는 위치 확인을 지원하지 않습니다.";
    locationButton.hidden = true;
    return;
  }

  setButtonLoading(true);
  locationStatus.textContent = "현재 위치를 확인하는 중입니다.";

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const location = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);

        renderLocationName(location.address ?? {});
        locationStatus.textContent = "현재 위치를 기준으로 표시했습니다.";
        locationButton.hidden = true;
      } catch (error) {
        console.error(error);
        setButtonLoading(false);
        locationStatus.textContent = "위치는 확인했지만 지역명을 불러오지 못했습니다. 다시 시도해주세요.";
      }
    },
    handleLocationError,
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
};

locationButton?.addEventListener("click", requestCurrentLocation);

if (locationButton && "permissions" in navigator) {
  navigator.permissions
    .query({ name: "geolocation" })
    .then((permission) => {
      if (permission.state === "granted") {
        requestCurrentLocation();
      } else if (permission.state === "denied") {
        locationStatus.textContent =
          "위치 권한이 차단되어 있습니다. 브라우저의 사이트 설정에서 허용할 수 있습니다.";
      }

      permission.addEventListener?.("change", () => {
        if (permission.state === "granted") requestCurrentLocation();
      });
    })
    .catch(() => {
      locationStatus.textContent = "버튼을 눌러 현재 위치 사용 여부를 선택해주세요.";
    });
}
