# 🌦️ Weather Pro Dashboard

A lightweight, real-time weather application built with Vanilla JavaScript and OpenWeather API.

## 🎯 Core Features

* **Global City Search**: Fetch current weather data for any city worldwide by name.
* **5-Day Extended Forecast**: Displays an 8-point data pull filtered into a clean 5-day daily outlook.
* **Live Geolocation**: Integrated browser GPS support to instantly get weather for the user's current coordinates.
* **Dynamic UI States**: The interface automatically transitions between specific themes (Sunny, Cloudy, Rainy, Stormy) based on API condition codes.
* **Glassmorphic Design**: High-end aesthetic using `backdrop-filter` blur effects, translucent layers, and responsive CSS Grid/Flexbox layouts.
* **Unit Conversion**: Standardized Metric system output (°C).

## 🛠️ Technical Implementation

* **Asynchronous Data**: Uses `Async/Await` and `Promise.all` to fetch both Current and Forecast data simultaneously for faster load times.
* **Template Literals**: Dynamic DOM injection for weather cards and forecast items.
* **Error Handling**: Integrated catch-blocks to alert users of invalid city names or API connection issues.
* **Mobile First**: Fully responsive CSS ensures the dashboard is usable on all screen sizes.

## ⚙️ Setup

1. Clone the repo.
2. Open `index.js` and insert your OpenWeather API key into the `apiKey` constant.
3. Launch `index.html`.

---
*Open Source Project - 2026*
