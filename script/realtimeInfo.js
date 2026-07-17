import { fetchCurrentWeather, searchCities } from "./weatherAPI.js";

const citySearchForm = document.querySelector("#city-search-form");
const citySearchInput = document.querySelector("#city-search-input");
const citySelect = document.querySelector("#city-select");
const weatherBox = document.querySelector("#weather-box");
const citySearchButton = citySearchForm.querySelector('button[type="submit"]');

let cityResults = [];

const setSearchButtonLoading = (isLoading) => {
  citySearchButton.disabled = isLoading;
  citySearchButton.classList.toggle("is-loading", isLoading);
  citySearchButton.setAttribute("aria-busy", String(isLoading));
};

const loadingMarkup = (message) => `
  <p class="weather-loading">
    <span>${message}</span><span class="loading-dots" aria-hidden="true"></span>
  </p>
`;

const withMinimumDuration = async (request, minimumDuration = 1500) => {
  const startedAt = Date.now();

  try {
    return await request;
  } finally {
    const remainingTime = minimumDuration - (Date.now() - startedAt);

    if (remainingTime > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, remainingTime));
    }
  }
};

citySearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = citySearchInput.value.trim();

  if (cityName.length === 0) {
    weatherBox.hidden = true;
    return;
  }

  weatherBox.hidden = false;
  weatherBox.innerHTML = loadingMarkup("도시를 검색하는 중입니다");
  citySelect.hidden = true;
  setSearchButtonLoading(true);

  try {
    cityResults = await withMinimumDuration(searchCities(cityName));

    if (cityResults.length === 0) {
      weatherBox.innerHTML = "<p>검색 결과가 없습니다.</p>";
      return;
    }

    citySelect.innerHTML =
      '<option value="">-- 검색 결과에서 도시를 선택해주세요 --</option>';

    cityResults.forEach((city, index) => {
      const option = document.createElement("option");

      option.value = index;
      option.textContent = city.display_name;

      citySelect.append(option);
    });

    citySelect.hidden = false;
    weatherBox.innerHTML = `
      <p>${cityResults.length}개의 도시를 찾았습니다.</p>
      <p>검색 결과에서 정확한 도시를 선택해주세요.</p>
    `;
  } catch (error) {
    console.error(error);

    weatherBox.innerHTML = `
      <p>도시를 검색하지 못했습니다. </p>
      <p>잠시 후 다시 시도해주세요. </p>
    `;
  } finally {
    setSearchButtonLoading(false);
  }
});

citySelect.addEventListener("change", async (event) => {
  const selectedIndex = event.target.value;

  if (selectedIndex === "") {
    weatherBox.innerHTML = "<p>도시를 선택해주세요.</p>";
    return;
  }

  const city = cityResults[Number(selectedIndex)];
  const cityName =
    city.name ??
    city.address?.city ??
    city.address?.town ??
    city.address?.village ??
    "선택한 지역";
  const regionName =
    city.address?.state ??
    city.address?.province ??
    city.address?.state_district ??
    city.address?.county ??
    city.address?.city ??
    city.address?.town ??
    city.address?.village ??
    cityName;

  weatherBox.innerHTML = loadingMarkup(
    `<strong>${cityName}</strong>의 날씨를 불러오는 중입니다`,
  );

  try {
    const weatherData = await withMinimumDuration(fetchCurrentWeather(city.lat, city.lon));

    const current = weatherData.current;
    const units = weatherData.current_units;

    weatherBox.innerHTML = `
      <h3>${cityName}, ${city.address?.country ?? "국가 정보 없음"}</h3>
      <p>지역: ${regionName}</p>
      <p>위도: ${city.lat}</p>
      <p>경도: ${city.lon}</p>
      <p>
        현재 온도:
        <strong>
          ${current.temperature_2m}${units.temperature_2m}
        </strong>
      </p>
      <p>
        현재 습도:
        <strong>
          ${current.relative_humidity_2m}
          ${units.relative_humidity_2m}
        </strong>
      </p>
      <p>관측 기준 시각: ${current.time}</p>
    `;
  } catch (error) {
    console.error(error);
    weatherBox.innerHTML = `
      <p>날씨 정보를 불러오지 못했습니다.</p>
      <p>잠시 후 다시 시도해주세요.</p>
    `;
  }
});
