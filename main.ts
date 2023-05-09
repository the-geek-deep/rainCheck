const { App, LogLevel } = require('@slack/bolt');
require('dotenv').config();
//importing interface and api-function from weather-api.ts
import { WeatherData, getWeatherData } from "./weather-api";

// Create a new Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken : process.env.SLACK_APP_TOKEN,
});

// Listen for the /weather command and respond with the current weather data for the specified city
app.command('/weather', async ({ ack, command, respond ,client} : {ack : Function , command : any , client : any , respond : any}): Promise<void> => {
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
    await client.respond({
      response_type: 'in_channel',
      text: message,
    });
  } catch (error) {
    console.error(error);

    // Post an error message in the channel where the command was issued
    await client.respond({
      response_type: 'ephemeral',
      text: `Sorry, there was an error retrieving the weather data for ${city}.`,
    });
  }
});

// Start the app
(async (): Promise<void> => {
  await app.start(process.env.PORT || 3000);
  console.log('Eureka!');
})();

