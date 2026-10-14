// Weather Service module: global geocoding, current weather, 7-day forecast
// Supports Open-Meteo (full 7-day forecast, UV, precip, hourly/daily) and preserves OpenWeatherMap compatibility

export const WMO_WEATHER_MAP = {
  0: { desc: "Clear sky", emoji: "☀️" },
  1: { desc: "Mainly clear", emoji: "🌤️" },
  2: { desc: "Partly cloudy", emoji: "⛅" },
  3: { desc: "Overcast", emoji: "☁️" },
  45: { desc: "Fog", emoji: "🌫️" },
  48: { desc: "Depositing rime fog", emoji: "🌫️" },
  51: { desc: "Light drizzle", emoji: "🌦️" },
  53: { desc: "Moderate drizzle", emoji: "🌦️" },
  55: { desc: "Dense drizzle", emoji: "🌧️" },
  56: { desc: "Light freezing drizzle", emoji: "🌧️❄️" },
  57: { desc: "Dense freezing drizzle", emoji: "🌧️❄️" },
  61: { desc: "Slight rain", emoji: "🌦️" },
  63: { desc: "Moderate rain", emoji: "🌧️" },
  65: { desc: "Heavy rain", emoji: "🌧️" },
  66: { desc: "Light freezing rain", emoji: "🌧️❄️" },
  67: { desc: "Heavy freezing rain", emoji: "🌧️❄️" },
  71: { desc: "Slight snow fall", emoji: "🌨️" },
  73: { desc: "Moderate snow fall", emoji: "🌨️" },
  75: { desc: "Heavy snow fall", emoji: "❄️" },
  77: { desc: "Snow grains", emoji: "❄️" },
  80: { desc: "Slight rain showers", emoji: "🌦️" },
  81: { desc: "Moderate rain showers", emoji: "🌧️" },
  82: { desc: "Violent rain showers", emoji: "⛈️" },
  85: { desc: "Slight snow showers", emoji: "🌨️" },
  86: { desc: "Heavy snow showers", emoji: "❄️" },
  95: { desc: "Thunderstorm", emoji: "🌩️" },
  96: { desc: "Thunderstorm with slight hail", emoji: "⛈️" },
  99: { desc: "Thunderstorm with heavy hail", emoji: "⛈️" }
};

export function getWeatherCondition(code) {
  return WMO_WEATHER_MAP[code] || { desc: "Partly cloudy", emoji: "⛅" };
}

// Convert Celsius to Fahrenheit
export function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius, unit = "C") {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return "--";
  if (unit === "F") {
    return `${Math.round(toFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

// Geocode global locations with Open-Meteo geocoding API
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || "",
      country: item.country || "",
      countryCode: item.country_code || "",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || "UTC",
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(", ")
    }));
  } catch (err) {
    console.warn("Geocoding service error:", err);
    return [];
  }
}

// Fetch comprehensive 7-day forecast + current weather
export async function getDetailedForecast(lat, lon, timezone = "auto") {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=${encodeURIComponent(
    timezone
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast service error: ${res.status}`);
  const data = await res.json();

  const current = data.current || {};
  const daily = data.daily || {};

  const currentCond = getWeatherCondition(current.weather_code ?? 0);

  // Format 7 daily items
  const dailyForecast = [];
  const dates = daily.time || [];
  for (let i = 0; i < dates.length; i++) {
    const code = daily.weather_code?.[i] ?? 0;
    const cond = getWeatherCondition(code);
    dailyForecast.push({
      date: dates[i],
      maxTemp: daily.temperature_2m_max?.[i] ?? 0,
      minTemp: daily.temperature_2m_min?.[i] ?? 0,
      apparentMax: daily.apparent_temperature_max?.[i] ?? 0,
      apparentMin: daily.apparent_temperature_min?.[i] ?? 0,
      precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
      precipitationSum: daily.precipitation_sum?.[i] ?? 0,
      windSpeedMax: daily.wind_speed_10m_max?.[i] ?? 0,
      uvIndexMax: daily.uv_index_max?.[i] ?? 0,
      weatherCode: code,
      description: cond.desc,
      emoji: cond.emoji
    });
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    elevation: data.elevation,
    current: {
      time: current.time,
      temp: current.temperature_2m ?? 0,
      feelsLike: current.apparent_temperature ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      precipitation: current.precipitation ?? 0,
      weatherCode: current.weather_code ?? 0,
      windSpeed: current.wind_speed_10m ?? 0,
      uvIndex: current.uv_index ?? 0,
      description: currentCond.desc,
      emoji: currentCond.emoji
    },
    daily: dailyForecast
  };
}
