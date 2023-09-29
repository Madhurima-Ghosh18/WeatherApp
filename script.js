let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let searchInput = document.getElementById("search-input");
let tempUnitSelect = document.getElementById("temp-unit");
let geoBtn = document.getElementById("geo-btn");

// Function to fetch weather details from API and display them
let getWeather = () => {
  let queryValue = searchInput.value.trim();
  let unitValue = tempUnitSelect.value; // Get the selected temperature unit

  // If input field is empty
  if (queryValue.length == 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name, zip code, or click 'Get My Location'</h3>`;
  } else {
    let url = '';

    // Check if the input value is a number (possibly a zip code)
    let isNumeric = /^\d+$/.test(queryValue);

    if (isNumeric) {
      // If it's numeric, treat it as a zip code
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${queryValue}&appid=${key}&units=${unitValue}`;
    } else {
      // Otherwise, treat it as a city name
      url = `https://api.openweathermap.org/data/2.5/weather?q=${queryValue}&appid=${key}&units=${unitValue}`;
    }

    fetch(url)
      .then((resp) => resp.json())
      // If the query is valid
      .then((data) => {
        console.log(data);
        console.log(data.weather[0].icon);
        console.log(data.weather[0].main);
        console.log(data.weather[0].description);
        console.log(data.name);
        console.log(data.main.temp_min);
        console.log(data.main.temp_max);

        let unitSymbol = unitValue === "metric" ? "&#176;C" : "&#176;F"; // Determine the unit symbol based on the selected unit

        result.innerHTML = `
        <h2>${data.name}</h2>
        <h4 class="weather">${data.weather[0].main}</h4>
        <h4 class="desc">${data.weather[0].description}</h4>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <h1>${data.main.temp} ${unitSymbol}</h1>
        <div class="temp-container">
        <div class="humidity">
        <img src="images/humidity.png">
        <h4>${data.main.humidity} %</h4>
        </div>

            <div> 
                <h4 class="title">min</h4>
                <h4 class="temp">${data.main.temp_min}${unitSymbol}</h4>
            </div>
            <div>
                <h4 class="title">max</h4>
                <h4 class="temp">${data.main.temp_max}${unitSymbol}</h4>
            </div>
            <div class="wind">
            <img src="images/wind.png">
            <h4> ${data.wind.speed} km/h</h4>
            </div>
        </div>
        `;
      })
      // If the query is NOT valid
      .catch(() => {
        result.innerHTML = `<h3 class="msg">City or zip code not found</h3>`;
      });
  }
};

// Add an event listener to the temperature unit dropdown to call getWeather when the unit is changed
tempUnitSelect.addEventListener('change', getWeather);

// Add an event listener to the search button to call getWeather
searchBtn.addEventListener("click", getWeather);// ...
// Inside the geolocation button click event listener
geoBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let unitValue = tempUnitSelect.value; // Get the selected temperature unit

      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=${unitValue}`;

      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          let unitSymbol = unitValue === "metric" ? "&#176;C" : "&#176;F";

          // Update the result container to show latitude and longitude
          result.innerHTML = `
          <h2>Latitude: ${latitude}, Longitude: ${longitude}</h2>
          <h4 class="weather">${data.weather[0].main}</h4>
          <h4 class="desc">${data.weather[0].description}</h4>
          <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <h1>${data.main.temp} ${unitSymbol}</h1>
          <div class="temp-container">
            <div class="humidity">
              <img src="images/humidity.png">
              <h4>${data.main.humidity} %</h4>
            </div>
            <div> 
              <h4 class="title">min</h4>
              <h4 class="temp">${data.main.temp_min}${unitSymbol}</h4>
            </div>
            <div>
              <h4 class="title">max</h4>
              <h4 class="temp">${data.main.temp_max}${unitSymbol}</h4>
            </div>
            <div class="wind">
              <img src="images/wind.png">
              <h4> ${data.wind.speed} km/h</h4>
            </div>
          </div>
          `;
        })
        .catch(() => {
          result.innerHTML = `<h3 class="msg">Unable to get weather data for your location</h3>`;
        });
    });
  }
});
// ...
