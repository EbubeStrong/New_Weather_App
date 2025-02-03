import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import APIKEY from "./config.js"; // Import API key from config.js

dotenv.config(); // Load environment variables (if needed)

const app = express();
const PORT = process.env.PORT || 3000; // Use default port if env is not set
const API_KEY = APIKEY; // Assign API key from config.js

console.log("API Key:", API_KEY);

app.use(cors()); // Allows frontend to access the backend

// Route to fetch weather data
app.get("/weather", async (req, res) => {
  const { city, endPoint } = req.query;

  if (!city || !endPoint) {
    return res
      .status(400)
      .json({ error: "Missing city or endpoint parameter" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
