const citySearchCache = new Map();
let lastCitySearchTime = 0;

const waitForSearchInterval = async () => {
  const elapsedTime = Date.now() - lastCitySearchTime;
  const remainingTime = 1000 - elapsedTime;

  if (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }
};

export const searchCities = async (cityName) => {
  const searchQuery = cityName.trim().replace(/\s+/g, " ");

  if (citySearchCache.has(searchQuery)) {
    return citySearchCache.get(searchQuery);
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");

  url.searchParams.set("q", searchQuery);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "10");
  url.searchParams.set("accept-language", "ko");
  url.searchParams.set("featureType", "city");

  await waitForSearchInterval();
  lastCitySearchTime = Date.now();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("도시 검색 요청에 실패했습니다.");
  }

  const cities = await response.json();

  citySearchCache.set(searchQuery, cities);

  return cities;
};

export const reverseGeocodeCoordinates = async (latitude, longitude) => {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");

  url.searchParams.set("lat", latitude);
  url.searchParams.set("lon", longitude);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "ko");
  url.searchParams.set("zoom", "14");

  await waitForSearchInterval();
  lastCitySearchTime = Date.now();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("현재 위치의 지역명 요청에 실패했습니다.");
  }

  return response.json();
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
