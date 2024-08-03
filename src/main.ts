import { WeatherData, CityCoordinates } from "./interfaces/interfaces.js";

const searchInput = document.querySelector(
    ".search_country"
  ) as HTMLInputElement,
  form = document.querySelector(".form") as HTMLFormElement,
  temp = document.querySelector(".degree .temp") as HTMLSpanElement,
  countryName = document.querySelector(".country_name") as HTMLParagraphElement,
  humidityPercent = document.querySelector(
    ".humidity_percent"
  ) as HTMLSpanElement,
  wind = document.querySelector(".wind_speed") as HTMLSpanElement,
  day = document.querySelector(".day") as HTMLSpanElement,
  date = document.querySelector(".date") as HTMLSpanElement,
  nextDays = document.querySelector(".next_days") as HTMLUListElement,
  weatherIcon = document.querySelector(".icon img") as HTMLImageElement,
  weatherDescription = document.querySelector(
    ".icon .description"
  ) as HTMLSpanElement,
  suggestedCity = document.querySelectorAll(
    ".city"
  ) as NodeListOf<HTMLLIElement>,
  sunrise = document.querySelector(".sunrise") as HTMLSpanElement,
  sunset = document.querySelector(".sunset") as HTMLSpanElement;

const closeButton = document.querySelector(".close_btn") as HTMLButtonElement,
  openButton = document.querySelector(".open_btn") as HTMLButtonElement;

const weatherDetailsSidebar = document.querySelector(
  ".weather_details"
) as HTMLDivElement;

const API_KEY = `ac2c56d223ecb84ca015305739819a6a`;

async function getWeatherDetails(
  name: string,
  lat: number,
  lon: number
): Promise<void> {
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
    const response = await fetch(weatherApiUrl);
    const data: WeatherData = await response.json();

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
    date.textContent = `${getDate.getDate()} ${month[getDate.getMonth()]} '${
      getDate.getFullYear() % 100
    }`;
  } catch (error) {
    throw error;
  }

  try {
    const response = await fetch(forecastApiUrl);
    const data: WeatherData = await response.json();

    let uniqueForecastDay: number[] = [];
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
              <span class="day">${
                days[date.getDay()]
              }</span><span class="symbol">${Math.floor(
        fiveDaysForecast[i].main.temp - 273.15
      )}&deg;</span>
            </li>
  `;
    }
  } catch (error) {
    throw error;
  }
}

async function getCityCoordinates(
  cityName: string
): Promise<CityCoordinates | void> {
  if (!cityName) return;
  const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=
  ${cityName}&limit=1&appid=${API_KEY}`;

  try {
    const response = await fetch(geocodingApiUrl);
    const data: CityCoordinates[] = await response.json();

    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  } catch (error) {
    throw new Error(`Failed to fetch coordinate of ${cityName}`);
  }
}

function handleWeatherDetailsSidebar() {
  weatherDetailsSidebar.classList.toggle("show");
  weatherDetailsSidebar.classList.toggle("hide");
}

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const cityName = searchInput.value.trim();
  searchInput.value = "";
  getCityCoordinates(cityName);
});

suggestedCity.forEach((city) => {
  city.addEventListener("click", () => {
    const cityName = city.textContent as string;
    getCityCoordinates(cityName);
  });
});

closeButton.addEventListener("click", handleWeatherDetailsSidebar);
openButton.addEventListener("click", handleWeatherDetailsSidebar);
