export const searchCities = async (cityName) => {
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

export const fetchCurrentWeather = async (latitude, longitude) => {
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