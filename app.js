const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;

  if (!cities || cities.length === 0) {
    return res.status(400).json({ error: 'Please provide a valid list of cities.' });
  }

  try {
    const weatherData = await getWeatherData(cities);
    return res.json({ weather: weatherData });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function getWeatherData(cities) {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  const units = 'metric';
  const requests = cities.map(async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    const response = await axios.get(url);
    const temperature = response.data.main.temp;
    return { [city]: `${temperature}C` };
  });

  return Promise.all(requests).then((data) => Object.assign({}, ...data));
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
