

const { App, LogLevel } = require('@slack/bolt');
const { getWeatherData , WeatherData } = require('./weather-api.mts');

const app = new App({
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  botToken: process.env.SLACK_BOT_TOKEN,
  logLevel: LogLevel.INFO,
  signingSecret: process.env.SLACK_SIGNING_TOKEN,
});



app.command('/weather', async ({ ack, command, context }) => {
  await ack();
  console.log(command);
  const city = command.text;

  try {
    const weatherData = await getWeatherData(city);
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;

    const message = `The current temperature and humidity in ${city} is ${temperature}°C and ${humidity} respectively  with ${description}.`;

    // Post the message in the channel where the command was issued
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: command.channel_id,
      text: message,
    });
  } catch (error) {
    console.error(error);

    // Post an error message in the channel where the command was issued
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: command.channel_id,
      text: `Really Sorry, there was an error retrieving the weather data for ${city}.`,
    });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Weather Bot is running!');
})();
