const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    showLoading();
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && cityInput.value.trim() !== "") {
    showLoading();
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

const getFetchData = async (endPoint, city) => {
  const apiUrl = `http://localhost:3000/weather?city=${city}&endPoint=${endPoint}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Error fetching data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
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

const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: "short", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-GB", options);
};

const updateWeatherInfo = async (city) => {
  try {
    const weatherData = await getFetchData("weather", city);

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
    document.querySelector(".current-date-txt").textContent = getCurrentDate();

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

  if (!forecastData) {
    console.error("❌ Forecast data is unavailable.");
    return;
  }

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      console.log("Forecast Weather:", forecastWeather);
    }
  });
};

const showDisplaySection = (section) => {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });

  section.classList.remove("hide");
};

const showLoading = () => {
  const searchContainer = document.querySelector(".main-container");

  // Ensure the loading container is created only once
  let loadingContainer = document.querySelector(".loading-container");
  if (!loadingContainer) {
    loadingContainer = document.createElement("div");
    loadingContainer.classList.add("loading-container");

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Fetching data...";
    loadingMessage.classList.add("loading-text");

    const loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("loading-spinner");

    loadingContainer.appendChild(loadingMessage);
    loadingContainer.appendChild(loadingSpinner);
    searchContainer.appendChild(loadingContainer);
  }

  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });
};

const removeLoading = () => {
  const loadingText = document.querySelector(".loading-text");
  const loadingSpinner = document.querySelector(".loading-spinner");

  if (loadingText) {
    loadingText.remove();
  } else {
    console.warn("❌ Loading text not found.");
  }

  if (loadingSpinner) {
    loadingSpinner.remove();
  } else {
    console.warn("❌ Loading spinner not found.");
  }
};

const getWeatherByLocation = () => {
  if (!navigator.geolocation) {
    console.error("❌ Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`📍 Location: Lat ${latitude}, Lon ${longitude}`);

      await getWeatherByCoords(latitude, longitude);
    },
    (error) => {
      console.error("❌ Location error:", error.message);
    }
  );
};

async function getWeatherByCoords(latitude, longitude) {
  showLoading(); // ✅ Only one call to show the spinner

  try {
    const currentWeatherResponse = await fetch(
      `http://localhost:3000/weather?lat=${latitude}&lon=${longitude}&endPoint=weather`
    );
    const forecastResponse = await fetch(
      `http://localhost:3000/forecast?lat=${latitude}&lon=${longitude}`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error(
        `❌ Failed to fetch weather data: ${currentWeatherResponse.statusText}`
      );
    }

    if (!forecastResponse.ok) {
      console.warn("⚠️ Forecast data is unavailable.");
      showDisplaySection(notFoundSection);
      removeLoading();
      return;
    }

    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = forecastResponse.ok
      ? await forecastResponse.json()
      : null;

    console.log("🌦️ Current Weather Data:", currentWeatherData);
    console.log("📅 Forecast Data:", forecastData);

    displayWeatherData(currentWeatherData, forecastData);
  } catch (err) {
    console.error("❌ Error fetching weather data:", err.message);
  } finally {
    removeLoading(); // ✅ Removes spinner when fetch is complete
  }
}

// 📌 Fetch weather when page loads
window.addEventListener("load", getWeatherByLocation);

// FOR GEOLOCATION
function displayWeatherData(currentWeatherData, forecastData) {
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = currentWeatherData;

  // Update elements on the page
  document.querySelector(".country-txt").textContent = country;
  document.querySelector(".temp-txt").textContent = `${Math.round(temp)}°C`;
  document.querySelector(".humidity-txt").textContent = `${humidity}%`;
  document.querySelector(".wind-txt").textContent = `${speed} M/s`;
  document.querySelector(".condition-txt").textContent = main;
  document.querySelector(
    ".weather-summary-img"
  ).src = `./assets/weather/${getWeatherIcon(id)}`;
  document.querySelector(".current-date-txt").textContent = getCurrentDate();

  // Show weather info section after data is updated
  showDisplaySection(weatherInfoSection);
}
