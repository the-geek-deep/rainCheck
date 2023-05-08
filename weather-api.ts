// weather-api.ts

const fetch = require('isomorphic-fetch');


 export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

 async function getWeatherData(city: string): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data : any = await response.json();
  return data;
}
module.exports = {getWeatherData};
