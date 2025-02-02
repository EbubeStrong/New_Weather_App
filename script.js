const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    // console.log(cityInput.value);
    
    updateWeatherInfo(cityInput.value)

    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && cityInput.value.trim() !== "") {
    // console.log(cityInput.value);
    
    updateWeatherInfo(cityInput.value)

    cityInput.value = "";
    cityInput.blur();
  }
})

const getFetchData = async (city) => { 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1b7d8e4e9c1b2c0b9c5c8e7c3d5f8b6e`)
    const data = await response.json()
    console.log(data)
    return data
}

const updateWeatherInfo = (city) => { 
    constweatherData = getFetchData(city)
}
