var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const searchInput = document.querySelector(".search_country"), form = document.querySelector(".form"), temp = document.querySelector(".degree .temp"), countryName = document.querySelector(".country_name"), humidityPercent = document.querySelector(".humidity_percent"), wind = document.querySelector(".wind_speed"), day = document.querySelector(".day"), date = document.querySelector(".date"), nextDays = document.querySelector(".next_days"), weatherIcon = document.querySelector(".icon img"), weatherDescription = document.querySelector(".icon .description"), suggestedCity = document.querySelectorAll(".city"), sunrise = document.querySelector(".sunrise"), sunset = document.querySelector(".sunset");
const closeButton = document.querySelector(".close_btn"), openButton = document.querySelector(".open_btn");
const weatherDetailsSidebar = document.querySelector(".weather_details");
const API_KEY = `ac2c56d223ecb84ca015305739819a6a`;
function getWeatherDetails(name, lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        try {
            const response = yield fetch(weatherApiUrl);
            const data = yield response.json();
            const getDate = new Date();
            const sunriseDate = new Date(data.sys.sunrise * 1000);
            const sunsetDate = new Date(data.sys.sunset * 1000);
            const sunriseTime = sunriseDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            const sunsetTime = sunsetDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            temp.textContent = `${Math.floor(data.main.temp - 273.15)}`;
            countryName.textContent = name;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            weatherDescription.textContent = data.weather[0].main;
            humidityPercent.textContent = `${data.main.humidity}%`;
            wind.textContent = `${data.wind.speed}km/h`;
            sunrise.textContent = sunriseTime;
            sunset.textContent = sunsetTime;
            // get date
            day.textContent = days[getDate.getDay()];
            date.textContent = `${getDate.getDate()} ${month[getDate.getMonth()]} '${getDate.getFullYear() % 100}`;
        }
        catch (error) {
            throw error;
        }
        try {
            const response = yield fetch(forecastApiUrl);
            const data = yield response.json();
            let uniqueForecastDay = [];
            let fiveDaysForecast = data.list.filter((forecast) => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDay.includes(forecastDate)) {
                    return uniqueForecastDay.push(forecastDate);
                }
            });
            nextDays.innerHTML = "";
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                nextDays.innerHTML += `
        <li class="day">
              <span class="day">${days[date.getDay()]}</span><span class="symbol">${Math.floor(fiveDaysForecast[i].main.temp - 273.15)}&deg;</span>
            </li>
  `;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
function getCityCoordinates(cityName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!cityName)
            return;
        const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=
  ${cityName}&limit=1&appid=${API_KEY}`;
        try {
            const response = yield fetch(geocodingApiUrl);
            const data = yield response.json();
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        }
        catch (error) {
            throw new Error(`Failed to fetch coordinate of ${cityName}`);
        }
    });
}
function handleWeatherDetailsSidebar() {
    weatherDetailsSidebar.classList.toggle("show");
    weatherDetailsSidebar.classList.toggle("hide");
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();
    searchInput.value = "";
    getCityCoordinates(cityName);
});
suggestedCity.forEach((city) => {
    city.addEventListener("click", () => {
        const cityName = city.textContent;
        getCityCoordinates(cityName);
    });
});
closeButton.addEventListener("click", handleWeatherDetailsSidebar);
openButton.addEventListener("click", handleWeatherDetailsSidebar);
export {};
