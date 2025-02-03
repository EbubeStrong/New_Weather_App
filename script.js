const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    // console.log(cityInput.value);

    showLoading();

    updateWeatherInfo(cityInput.value);

    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && cityInput.value.trim() !== "") {
    // console.log(cityInput.value);

    showLoading();
    updateWeatherInfo(cityInput.value);

    cityInput.value = "";
    cityInput.blur();
  }
});
// const apiUrl = `http://localhost:3000/weather?city=London&endPoint=weather`
// console.log(`Api: ${apiUrl}`)

const getFetchData = async (endPoint, city) => {
  // const apiUrl  = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`;
  const apiUrl = `http://localhost:3000/weather?city=${city}&endPoint=${endPoint}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Error fetching data");
    }

    const data = await res.json();
    // console.log(data);

    return data;
  } catch (error) {
    // console.error("Fetched error", error);
    console.log("Fetched error", error);
    return null;
  }
};

const getWeatherIcon = (id) => {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
};

const getCurrenDate = () => {
  const date = new Date();
  const options = { weekday: "short", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-GB", options);
};

const updateWeatherInfo = async (city) => {
  try {
    const weatherData = await getFetchData("weather", city);

    // console.log("Weather Data:", weatherData);

    if (!weatherData || weatherData.cod !== 200) {
      console.error("❌ Error: Invalid weather data!");
      showDisplaySection(notFoundSection);
      removeLoading();
      return;
    }

    const {
      name: country,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed },
    } = weatherData;

    document.querySelector(".country-txt").textContent = country;
    document.querySelector(".temp-txt").textContent = `${Math.round(temp)}°C`;
    document.querySelector(".humidity-txt").textContent = `${humidity}%`;
    document.querySelector(".wind-txt").textContent = `${speed} M/s`;
    document.querySelector(".condition-txt").textContent = main;
    document.querySelector(
      ".weather-summary-img"
    ).src = `./assets/weather/${getWeatherIcon(id)}`;
    document.querySelector(".current-date-txt").textContent = getCurrenDate();

    await updateForecastsInfo(city);

    showDisplaySection(weatherInfoSection);
  } catch (error) {
    console.error("❌ Error fetching weather data:", error);
    showDisplaySection(notFoundSection);
  } finally {
    removeLoading(); 
  }
};

const updateForecastsInfo = async (city) => {
  const forecastData = await getFetchData("forecast", city);

  const timeTaken = '12:00:00';
  const todayDate = new Date().toISOString().split('T')[0];

  forecastData.list.forEach((forecastWeather) => {
    if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
      console.log("Forecast Weather:", forecastWeather);
    }

    // console.log("Forecast Data:", forecastData);

  })

  // console.log("Forecast Data:", forecastData);
};

const showDisplaySection = (section) => {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });

  section.classList.remove("hide");
};

const showLoading = () => {
  const searchContainer = document.querySelector(".main-container");
  const loadingContainer = document.createElement("div");

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Fetching data...";
  loadingMessage.classList.add("loading-text");

  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("loading-spinner");

  loadingContainer.appendChild(loadingMessage);
  loadingContainer.appendChild(loadingSpinner);

  searchContainer.appendChild(loadingContainer);

  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });
};

const removeLoading = () => {
  const loadingText = document.querySelector(".loading-text");
  const loadingSpinner = document.querySelector(".loading-spinner");
  if (loadingText && loadingSpinner) {
    loadingText.remove();
    loadingSpinner.remove();
  }
};
