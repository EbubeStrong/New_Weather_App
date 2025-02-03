import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import APIKEY from "./config.js"; // Import API key from config.js

dotenv.config(); // Load environment variables (if needed)

const app = express();
const PORT = process.env.PORT || 3000; // Use default port if env is not set
const API_KEY = APIKEY; // Assign API key from config.js

console.log("API Key:", API_KEY);

app.use(cors());

// ✅ Fixed `/weather` Route
app.get("/weather", async (req, res) => {
  const { city, endPoint, lon, lat } = req.query;

  // 🔹 Allow fetching by either city or coordinates
  if ((!city && (!lat || !lon)) || !endPoint) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let url = `https://api.openweathermap.org/data/2.5/${endPoint}?appid=${API_KEY}&units=metric`;

  if (lat && lon) {
    url += `&lat=${lat}&lon=${lon}`;
  } else if (city) {
    url += `&q=${city}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fixed `/forecast` Route
app.get("/forecast", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));