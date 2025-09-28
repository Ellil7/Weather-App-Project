// --- AI Chatbox feature ---
document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("ai-chat-form");
  const chatInput = document.getElementById("ai-chat-input");
  const chatResponse = document.getElementById("ai-chat-response");
  if (chatForm && chatInput && chatResponse) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;
      chatResponse.textContent = "Thinking...";
      // Gather current weather data for context
      const city = document.querySelector("#city")?.textContent || "";
      const temp = typeof currentTempC === "number" ? `${Math.round(currentTempC)}°C` : "";
      const desc = document.querySelector("#description")?.textContent || "";
      const humidity = document.querySelector("#humidity")?.textContent || "";
      const wind = document.querySelector("#wind-speed")?.textContent || "";
      // Build forecast summary
      let forecastSummary = "";
      const forecastDays = document.querySelectorAll('.weather-forecast-day');
      if (forecastDays.length > 0 && currentForecastC.length > 0) {
        forecastSummary = " Weekly forecast:";
        forecastDays.forEach((el, idx) => {
          if (idx < currentForecastC.length) {
            const dayName = el.querySelector('.weather-forecast-date')?.textContent || "";
            const max = Math.round(currentForecastC[idx].max);
            const min = Math.round(currentForecastC[idx].min);
            const iconAlt = el.querySelector('img')?.alt || "";
            forecastSummary += ` ${dayName}: ${iconAlt}, High: ${max}°C, Low: ${min}°C.`;
          }
        });
      }
  const context = `Current weather in ${city}: ${desc}, ${temp}, Humidity: ${humidity}, Wind: ${wind}.${forecastSummary} If the user asks about weather beyond this week, kindly let them know you can only provide information for the current week’s forecast.`;
      fetch(`https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(question)}&context=${encodeURIComponent(context)}&key=taef532c1914eobc5596f904e3dfcfab`)
        .then((res) => res.json())
        .then((data) => {
          if (data.answer) {
            chatResponse.textContent = data.answer;
          } else {
            chatResponse.textContent = "Sorry, I couldn't get an answer right now.";
          }
        })
        .catch(() => {
          chatResponse.textContent = "Sorry, something went wrong.";
        });
    });
  }
});
// --- Brighten my day (AI joke) feature ---
document.addEventListener("DOMContentLoaded", function () {
  const jokeBtn = document.getElementById("joke-btn");
  const jokeResponse = document.getElementById("joke-response");
  if (jokeBtn && jokeResponse) {
    jokeBtn.addEventListener("click", function () {
      jokeBtn.disabled = true;
      jokeBtn.textContent = "Thinking...";
      jokeResponse.textContent = "";
  fetch(`https://api.shecodes.io/ai/v1/generate?prompt=Tell%20me%20a%20joke%20and%20respond%20with%20only%20the%20joke%2C%20no%20extra%20text.&key=taef532c1914eobc5596f904e3dfcfab`)
        .then((res) => res.json())
        .then((data) => {
          if (data.answer) {
            jokeResponse.textContent = data.answer;
          } else {
            jokeResponse.textContent = "Sorry, I couldn't find a joke right now.";
          }
        })
        .catch(() => {
          jokeResponse.textContent = "Sorry, something went wrong.";
        })
        .finally(() => {
          jokeBtn.disabled = false;
          jokeBtn.textContent = "Brighten my day";
        });
    });
  }
});
// --- Celsius/Fahrenheit toggle ---
let currentTempC = null;
let currentForecastC = [];
function setTemperatureDisplay(temp, isCelsius) {
  const temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32);
  document.querySelector("#celsius-link").classList.toggle("active", isCelsius);
  document.querySelector("#fahrenheit-link").classList.toggle("active", !isCelsius);
}
function setForecastDisplay(forecastArr, isCelsius) {
  // Update forecast temperatures
  const forecastDays = document.querySelectorAll('.weather-forecast-day');
  forecastArr.forEach(function(day, idx) {
    if (forecastDays[idx]) {
      const temps = forecastDays[idx].querySelectorAll('.weather-forecast-temperature');
      if (temps.length === 2) {
        temps[0].innerHTML = `<strong>${isCelsius ? Math.round(day.max) : Math.round(day.max * 9/5 + 32)}º</strong>`;
        temps[1].innerHTML = `${isCelsius ? Math.round(day.min) : Math.round(day.min * 9/5 + 32)}º`;
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const celsiusLink = document.getElementById("celsius-link");
  const fahrenheitLink = document.getElementById("fahrenheit-link");
  let isCelsius = true;
  if (celsiusLink && fahrenheitLink) {
    celsiusLink.addEventListener("click", function(e) {
      e.preventDefault();
      if (!isCelsius) {
        setTemperatureDisplay(currentTempC, true);
        setForecastDisplay(currentForecastC, true);
        isCelsius = true;
      }
    });
    fahrenheitLink.addEventListener("click", function(e) {
      e.preventDefault();
      if (isCelsius) {
        setTemperatureDisplay(currentTempC, false);
        setForecastDisplay(currentForecastC, false);
        isCelsius = false;
      }
    });
  }
});
// --- Autocomplete for city search ---
const cityList = [
  "London", "Paris", "New York", "Tokyo", "Sydney", "Perth", "Baguio", "Manila", "Los Angeles", "Berlin", "Rome", "Madrid", "Toronto", "Chicago", "Melbourne", "Moscow", "Beijing", "Seoul", "Bangkok", "Dubai"
];
const searchInput = document.getElementById("search-form-input");
const suggestionsBox = document.getElementById("city-suggestions");
if (searchInput && suggestionsBox) {
  searchInput.addEventListener("input", function () {
    const value = searchInput.value.trim().toLowerCase();
    if (value.length === 0) {
      suggestionsBox.classList.remove("active");
      suggestionsBox.innerHTML = "";
      return;
    }
    const matches = cityList.filter((city) => city.toLowerCase().startsWith(value));
    if (matches.length === 0) {
      suggestionsBox.classList.remove("active");
      suggestionsBox.innerHTML = "";
      return;
    }
    suggestionsBox.innerHTML = matches.map((city) => `<div>${city}</div>`).join("");
    suggestionsBox.classList.add("active");
  });
  suggestionsBox.addEventListener("mousedown", function (e) {
    if (e.target && e.target.nodeName === "DIV") {
      searchInput.value = e.target.textContent;
      suggestionsBox.classList.remove("active");
      suggestionsBox.innerHTML = "";
      searchInput.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.remove("active");
      suggestionsBox.innerHTML = "";
    }
  });
}
// Dark theme toggle logic
document.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      if (document.body.classList.contains("dark-theme")) {
        themeBtn.textContent = "Light Theme";
      } else {
        themeBtn.textContent = "Dark Theme";
      }
    });
  }
});
function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  currentTempC = temperature;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let dateElement = document.querySelector("#date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  // Show full date (e.g. September 28, 2025)
  dateElement.innerHTML = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  timeElement.innerHTML = formatDate(date);
  // Capitalize first letter of description
  let desc = response.data.condition.description;
  descriptionElement.innerHTML = desc.charAt(0).toUpperCase() + desc.slice(1);
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  setTemperatureDisplay(temperature, true);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "taef532c1914eobc5596f904e3dfcfab";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "taef532c1914eobc5596f904e3dfcfab";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";
  currentForecastC = [];
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      currentForecastC.push({
        max: day.temperature.maximum,
        min: day.temperature.minimum
      });
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>

        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}º</div>
        </div>
      </div>
    `;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Perth");