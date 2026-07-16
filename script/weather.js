const citySearchForm = document.querySelector("#city-search-form");
const citySearchInput = document.querySelector("#city-search-input");
const citySelect = document.querySelector("#city-select");
const weatherBox = document.querySelector("#weather-box");

let cityResults = [];

const searchCities = async (cityName) => {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

  url.searchParams.set("name", cityName);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("도시 검색 요청에 실패했습니다.");
  }

  const data = await response.json();

  return data.results ?? [];
};

const fetchCurrentWeather = async (latitude, longitude) => {
  const url = new URL("https://api.open-meteo.com/v1/forecast");

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("날씨 정보 요청에 실패했습니다.");
  }

  return response.json();
};

citySearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = citySearchInput.value.trim();

  if (cityName.length < 2) {
    weatherBox.innerHTML = "<p>도시 이름을 2글자 이상 입력해주세요.</p>";
    return;
  }

  weatherBox.innerHTML = "<p>도시를 검색하는 중입니다... 🔍</p>";
  citySelect.hidden = true;

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
      option.textContent = [city.name, city.admin1, city.country]
        .filter(Boolean)
        .join(", ");

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
      <p>도시를 검색하지 못햇습니다. </p>
      <p>잠시 후 다시 시도해주세요. </p>
    `;
  }
});

citySelect.addEventListener("change", async (event) => {
  const selectedIndex = event.target.value;

  if (selectedIndex === "") {
    weatherBox.innerHTML = "<p>도시를 선택해주세요.</p>";
    return;
  }

  const city = cityResults[Number(selectedIndex)];

  weatherBox.innerHTML = `
    <p><strong>${city.name}</strong>의 날씨를 불러오는 중입니다... ⏳</p>
  `;

  try {
    const weatherData = await fetchCurrentWeather(
      city.latitude,
      city.longitude,
    );

    const current = weatherData.current;
    const units = weatherData.current_units;

    weatherBox.innerHTML = `
      <h3>${city.name}, ${city.country}</h3>
      <p>지역: ${city.admin1 ?? "지역 정보 없음"}</p>
      <p>위도: ${city.latitude}</p>
      <p>경도: ${city.longitude}</p>
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
