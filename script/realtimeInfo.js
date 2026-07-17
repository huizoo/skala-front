import { fetchCurrentWeather, searchCities } from "./weatherAPI.js";

const citySearchForm = document.querySelector("#city-search-form");
const citySearchInput = document.querySelector("#city-search-input");
const citySelect = document.querySelector("#city-select");
const weatherBox = document.querySelector("#weather-box");
const citySearchButton = citySearchForm.querySelector('button[type="submit"]');

let cityResults = [];

citySearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = citySearchInput.value.trim();

  if (cityName.length === 0) {
    weatherBox.innerHTML = "<p>도시 이름을 입력해주세요.</p>";
    return;
  }

  weatherBox.innerHTML = "<p>도시를 검색하는 중입니다... 🔍</p>";
  citySelect.hidden = true;
  citySearchButton.disabled = true;

  try {
    cityResults = await searchCities(cityName);

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
    citySearchButton.disabled = false;
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

  weatherBox.innerHTML = `
    <p><strong>${cityName}</strong>의 날씨를 불러오는 중입니다... ⏳</p>
  `;

  try {
    const weatherData = await fetchCurrentWeather(city.lat, city.lon);

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
