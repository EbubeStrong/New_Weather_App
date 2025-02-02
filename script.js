const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");


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
 const apiUrl = `http://localhost:3000/weather?city=${city}&endPoint=${endPoint}`

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Error fetching data");
    }

    const data = await res.json();
    console.log(data);

    // return data
  } catch (error) {
      console.error('Fetched error', error);
      return null
  }
};

const updateWeatherInfo = async (city) => {
  const weatherData = await getFetchData("weather", city);
  console.log(weatherData);
};
