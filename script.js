const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    // console.log(cityInput.value);

    updateWeatherInfo(cityInput.value);

    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && cityInput.value.trim() !== "") {
    // console.log(cityInput.value);

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
    console.log(data);

    return data;
  } catch (error) {
    // console.error("Fetched error", error);
    console.log("Fetched error", error);
    return null;
  }
};
const updateWeatherInfo = async (city) => {
  const weatherData = await getFetchData("weather", city);

  // console.log("Weather Data:", weatherData); 

  if (!weatherData) {
    console.error("❌ Error: weatherData is undefined!");
    showDisplaySection(notFoundSection); 
    return;
  }

  if (weatherData.cod != "200") {
    showDisplaySection(notFoundSection);
    return;
  }

  showDisplaySection(weatherInfoSection); 
};

const showDisplaySection = (section) => {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.classList.add("hide");
  });

  section.classList.remove("hide");
};
