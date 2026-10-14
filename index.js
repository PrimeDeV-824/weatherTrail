const weatherForm = document.querySelector(".weatherInput");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "ae5ec943abf34721262af7d2a9b23575";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const WeatherData = await getWeatherData(city);
      displayWeatherInfo(WeatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please Enter A City");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could Not Fetch Data");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  console.log(data);
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");
  card.appendChild(cityDisplay);

  tempDisplay.textContent = `${(temp - 273.5).toFixed(1)}°C`;
  tempDisplay.classList.add("tempDisplay");
  card.appendChild(tempDisplay);

  humidityDisplay.textContent = `${humidity}%`;
  tempDisplay.classList.add("humidityDisplay");
  card.appendChild(humidityDisplay);

  descDisplay.textContent = description;
  descDisplay.classList.add("descDisplay");
  card.appendChild(descDisplay);

  weatherEmoji.textContent = displayEmoji(id);
  weatherEmoji.classList.add("weatherEmoji");
  card.appendChild(weatherEmoji);
}

function displayEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "🌩️";

    case weatherId >= 300 && weatherId < 400:
      return "🌧️";

    case weatherId >= 400 && weatherId < 500:
      return "⛈️";

    case weatherId >= 500 && weatherId < 600:
      return "🌧️";

    case weatherId >= 600 && weatherId < 700:
      return "🌨️";

    case weatherId >= 700 && weatherId < 800:
      return "༄.°";

    case weatherId === 800:
      return "⛅";

    case weatherId >= 800 && weatherId < 900:
      return "☁️";

    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
