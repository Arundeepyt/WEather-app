const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('#cityInput');
const card = document.querySelector('.card');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const description = document.querySelector('#description');
const locationBtn = document.querySelector('#getLocationBtn');

const apiKey = '7f4dfa07c7f10eca09a13b20528d8cd3';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === '') return;

  getWeatherByCity(city);
  cityInput.value = '';
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    }, () => {
      alert("Unable to retrieve your location.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function getWeatherByCity(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    showError(error.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    showError(error.message);
  }
}

function updateWeatherCard(data) {
  const weatherMain = data.weather[0].main;
  const emoji = getWeatherEmoji(weatherMain);

  cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
  temperature.textContent = `Temperature: ${data.main.temp}°C ${emoji}`;
  description.textContent = `Condition: ${data.weather[0].description}`;
  card.classList.remove('hidden');
}

function showError(message) {
  cityName.textContent = "Error";
  temperature.textContent = message;
  description.textContent = "";
  card.classList.remove('hidden');
}

function getWeatherEmoji(condition) {
  switch (condition) {
    case 'Clear': return '☀';
    case 'Clouds': return '☁';
    case 'Rain': return '🌧';
    case 'Drizzle': return '🌦';
    case 'Thunderstorm': return '⛈';
    case 'Snow': return '❄';
    case 'Mist':
    case 'Fog':
    case 'Haze': return '🌫';
    case 'Smoke': return '🚬';
    case 'Dust':
    case 'Sand': return '🌪';
    default: return '🌈';
  }
}