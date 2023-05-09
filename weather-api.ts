import axios from 'axios';

// Define the shape of the weather data returned from the API
export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

// Fetches the current weather data for a given city from the OpenWeather API
export async function getWeatherData(city: string): Promise<WeatherData> {
  const apiKey: string = process.env.WEATHER_API_KEY!;
  const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  const data: WeatherData = response.data;
  return data;
}

