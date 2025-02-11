// import APIKEY from "./config.js";
// const API_KEY = APIKEY; // Assign API key from config.js
// console.log("API Key:", API_KEY);

// const API_KEY = "ccedc5f26bf12146e4f5d673f45a7492";

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

if (!forecastItemsContainer) {
  console.error("❌ forecastItemsContainer not found!");
}

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
  // const apiUrl = `http://localhost:3000/weather?city=${city}&endPoint=${endPoint}`;
  const apiUrl = `https://weather-server-cpgs.onrender.com/weather?city=${city}&endPoint=${endPoint}`;

  // const apiUrl = `https://backend-2j1vtfqbm-ebubestrong-projects.vercel.app/weather?city=${city}&endPoint=${endPoint}`;
  // const apiUrl = `https://backend-2j1vtfqbm-ebubestrong-projects.vercel.app/weather?city=${city}&endPoint=${endPoint}`;
  // const apiUrl = `https://backend-d3zeyqjb2-ebubestrong-projects.vercel.app/weather?city=${city}&endPoint=${endPoint}`;

  // const apiUrl =  `https://api.openweathermap.org/data/2.5/${endPoint}?appid=${API_KEY}&units=metric/weather?city=${city}&endPoint=${endPoint}`
  // const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${API_KEY}&units=metric`;

  // const apiUrl = `https://backend-d3zeyqjb2-ebubestrong-projects.vercel.app/weather?city=${city}&endPoint=${endPoint}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer YOUR_API_KEY`, // Only if needed
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Fetched error", error);
    return null;
  }

  //  const proxyUrl = "https://http-cors-proxy.p.rapidapi.com/";
  //  const targetUrl = `https://backend-d3zeyqjb2-ebubestrong-projects.vercel.app/weather?city=${city}&endPoint=${endPoint}`;

  //  const options = {
  //    method: "POST",
  //    headers: {
  //      "x-rapidapi-key": "cfa4cf2065msh7ed7336a2b1cdafp16e746jsn360fbc11cf4a",
  //      "x-rapidapi-host": "http-cors-proxy.p.rapidapi.com",
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({ url: targetUrl }), // ✅ Convert object to JSON string
  //  };

  //  try {
  //    const response = await fetch(proxyUrl, options);

  //    if (!response.ok) {
  //      throw new Error(`HTTP error! Status: ${response.status}`);
  //    }

  //    const data = await response.json(); // ✅ Parse as JSON
  //    console.log("✅ Weather Data:", data);
  //    return data;
  //  } catch (error) {
  //    console.error("❌ Fetch Error:", error);
  //    return null;
  //  }
};

// getFetchData("weather", "London");


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
  // showLoading()
  try {
    const weatherData = await getFetchData("weather", city);
    console.log(weatherData);

    if (!weatherData || weatherData.cod !== 200) {
      console.error("❌ Error: Invalid weather data!");
      showDisplaySection(notFoundSection);
      // removeLoading();
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
    // const ErrMessage = document.createElement("p");
    // ErrMessage.textContent = "Internet Disconnect, please, try again later";
    // ErrMessage.classList.add("err-text");
    // showDisplaySection(ErrMessage);

    showDisplaySection(notFoundSection);
    console.error("❌ Error fetching weather data:", error);
  } finally {
    removeLoading();
  }
};

// UPDATE FORECASTINFO FUNCTION
const updateForecastsInfo = async (city) => {
  const forecastData = await getFetchData("forecast", city);

  if (!forecastData) {
    console.error("❌ Forecast data is unavailable.");
    return;
  }

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = " ";

  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastWeather);
    }
  });
};

const updateForecastsItems = (weatherData) => {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };

  const dateResult = dateTaken.toLocaleString("en-US", dateOption);

  const forecastItem = `
    <div class="forecast-item">
      <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
      <img
        src="assets/weather/${getWeatherIcon(id)}"
        alt="icon"
        class="forecast-item-img"
      />
      <h5 class="forecast-item-temp">${Math.round(temp)}&deg;C</h5>
    </div>
  `;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
};

const showDisplaySection = (section) => {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });

  section.classList.remove("hide");
};

const showLoading = () => {
  // console.log("✅ showLoading() triggered!");

  const searchContainer = document.querySelector(".main-container");

  let loadingContainer = document.querySelector(".loading-container");

  if (!loadingContainer) {
    // ✅ Create a new loading container if it doesn't exist
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
  } else {
    // ✅ Make sure it's visible
    loadingContainer.style.display = "block";
  }

  // Hide other sections
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });
};

// const removeLoading = () => {
//   const loadingText = document.querySelector(".loading-text");
//   const loadingSpinner = document.querySelector(".loading-spinner");

//   if (loadingText) {
//     loadingText.remove();
//   }
//   if (loadingSpinner) {
//     loadingSpinner.remove();
//   }
// };

const removeLoading = () => {
  const loadingContainer = document.querySelector(".loading-container");

  if (loadingContainer) {
    loadingContainer.style.display = "none"; // ✅ Hide instead of removing
  }
};

// GET WEATHER BY GEOLOCATION
// const getWeatherByLocation = () => {
//   if (!navigator.geolocation) {
//     console.error("❌ Geolocation is not supported by this browser.");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;
//       // console.log(`📍 Location: Lat ${latitude}, Lon ${longitude}`);

//       await getWeatherByCoords(latitude, longitude); // Fetch weather by coordinates
//     },
//     (error) => {
//       console.error("❌ Location error:", error.message); // Error in case geolocation fails
//     }
//   );
// };

// async function getWeatherByCoords(latitude, longitude) {
//   showLoading(); // ✅ Only one call to show the spinner

//   try {
//     // Fetch current weather data and forecast data
//     const currentWeatherResponse = await fetch(
//       `https://backend-hdej6hysl-ebubestrong-projects.vercel.app/weather?lat=${latitude}&lon=${longitude}&endPoint=weather`
//     );

//     // const currentWeatherResponse = await fetch(
//     //   `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
//     // );
//     // const forecastResponse = await fetch(
//     //   `https://backend-hdej6hysl-ebubestrong-projects.vercel.app/forecast?lat=${latitude}&lon=${longitude}`
//     // );
//     const forecastResponse = await fetch(
//       `https://backend-hdej6hysl-ebubestrong-projects.vercel.app/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
//     );

//     if (!currentWeatherResponse.ok) {
//       throw new Error(
//         `❌ Failed to fetch weather data: ${currentWeatherResponse.statusText}`
//       );
//     }

//     if (!forecastResponse.ok) {
//       console.warn("⚠️ Forecast data is unavailable.");
//       showDisplaySection(notFoundSection); // Show not found section if forecast data is unavailable
//       removeLoading();
//       return;
//     }

//     // Parse the weather data
//     const currentWeatherData = await currentWeatherResponse.json();
//     const forecastData = forecastResponse.ok
//       ? await forecastResponse.json()
//       : null;

//     // console.log("🌦️ Current Weather Data:", currentWeatherData);
//     // console.log("📅 Forecast Data:", forecastData);

//     // Display the current weather data
//     displayWeatherData(currentWeatherData, forecastData);

//     // Update the forecast section after displaying the current weather
//     updateForecastsInfo(currentWeatherData.name);
//   } catch (err) {
//     console.error("❌ Error fetching weather data:", err.message);
//     showDisplaySection(notFoundSection); // Show not found section in case of an error
//   } finally {
//     removeLoading(); // ✅ Removes spinner when fetch is complete
//   }
// }

// // 📌 Fetch weather when page loads
// window.addEventListener("load", getWeatherByLocation); // Automatically get weather by location on page load

// // Function to display the weather data on the page
// function displayWeatherData(currentWeatherData, forecastData) {
//   const {
//     name: country,
//     main: { temp, humidity },
//     weather: [{ id, main }],
//     wind: { speed },
//   } = currentWeatherData;

//   // Update elements on the page
//   document.querySelector(".country-txt").textContent = country;
//   document.querySelector(".temp-txt").textContent = `${Math.round(temp)}°C`;
//   document.querySelector(".humidity-txt").textContent = `${humidity}%`;
//   document.querySelector(".wind-txt").textContent = `${speed} M/s`;
//   document.querySelector(".condition-txt").textContent = main;
//   document.querySelector(
//     ".weather-summary-img"
//   ).src = `./assets/weather/${getWeatherIcon(id)}`;
//   document.querySelector(".current-date-txt").textContent = getCurrentDate();

//   // Show weather info section after data is updated
//   showDisplaySection(weatherInfoSection);
// }
