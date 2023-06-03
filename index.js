const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const apiKey = process.env.API_KEY;
app.use(express.json());

app.post("/getWeather", async (req, res) => {
  try {
    const cities = req.body.cities;
    // console.log("req boy -> " + req.body);

    // console.log("cities -> " + cities);

    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const weatherResponse = await axios.get(
          // api.openweathermap.org/data/2.5/weather?id=524901&appid=YOUR_API_KEY
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        return weatherResponse.data;
      })
    );
    console.log("wD -> " + weatherData);

    // Extract relevant information from the weather data
    const formattedWeatherData = weatherData.map((data) => {
      return {
        city: data.name,
        temperature: data.main.temp,
      };
    });

    res.json({ weather: formattedWeatherData });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
