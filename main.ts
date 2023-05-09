const { App, LogLevel } = require('@slack/bolt');
const axios = require('axios');

// Define the shape of the weather data returned from the API
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

// Fetches the current weather data for a given city from the OpenWeather API
async function getWeatherData(city: string): Promise<WeatherData> {
  const apiKey: string = process.env.WEATHER_API_KEY!;
  const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  const data: WeatherData = response.data;
  return data;
}


// Create a new Slack Bolt app
const app = new App({
  token: 'xoxb-5206254512375-5223392242386-gsaqiBeQTVfRqokKLvRlbNLj' ,
  socketMode: true,
  logLevel: LogLevel.INFO,
  signingSecret: '463b503513f09be114c51aee40b2c4b8',
  appToken : 'xapp-1-A056Y0KQ3TK-5236050399249-3eab67ec9f4eb87093c04478ad43b2b6fa3eccc57bce2d095168b003d604bcaf',
});

// Listen for the /weather command and respond with the current weather data for the specified city
app.command('/weather', async ({ ack, command, context }): Promise<void> => {
  // Acknowledge the command request
  await ack();
  
  // Get the city from the command text
  const city: string = command.text;

  try {
    // Get the current weather data for the specified city
    const weatherData = await getWeatherData(city);

    // Extract the temperature, description, and humidity from the weather data
    const temperature: number = weatherData.main.temp;
    const description: string = weatherData.weather[0].description;
    const humidity: number = weatherData.main.humidity;

    // Message to send back to the user
    const message: string = `The current temperature and humidity in ${city} is ${temperature}°C and ${humidity} respectively with ${description}.`;

    // Post the message in the channel where the command was issued
    await app.client.chat.postMessage({
      token: context.botToken!,
      channel: command.channel_id,
      text: message,
    });
  } catch (error) {
    console.error(error);

    // Post an error message in the channel where the command was issued
    await app.client.chat.postMessage({
      appToken : context.appToken,
      token : context.token,
      channel: command.channel_id,
      text: `Sorry, there was an error retrieving the weather data for ${city}.`,
    });
  }
});

// Start the app
(async (): Promise<void> => {
  await app.start(process.env.PORT || 3000);
  console.log('Eureka!');
})();
