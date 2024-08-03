export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  weather: [{ icon: string; main: string }];
  wind: { speed: number };
  list: { dt_txt: string; main: { temp: number } }[];
}

export interface CityCoordinates {
  name: string;
  lat: number;
  lon: number;
}
