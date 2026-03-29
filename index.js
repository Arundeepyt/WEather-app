const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('#cityInput');
const card = document.querySelector('.card');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const description = document.querySelector('#description');
const locationBtn = document.querySelector('#getLocationBtn');

// Your active API Key
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
            alert("Unable to retrieve your location. Please check browser permissions.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

async function getWeatherByCity(city) {
    try {
        // FIXED: Removed ",IN" to allow global searches like "New York"
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        updateWeatherCard(data);
    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();
        updateWeatherCard(data);
    } catch (error) {
        showError(error.message);
    }
}

function updateWeatherCard(data) {
    const weatherMain = data.weather[0].main;
    const emoji = getWeatherEmoji(weatherMain);

    // Update the background color of the body
    changeBackground(weatherMain);

    // Update the UI Text (Using Backticks `` for template literals)
    cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C ${emoji}`;
    description.textContent = data.weather[0].description;
    
    // CRITICAL: Make the card visible
    card.classList.remove('hidden');
}

function changeBackground(condition) {
    const body = document.body;
    // Reset all weather classes first
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'stormy');

    if (condition === 'Clear') {
        body.classList.add('sunny');
    } else if (['Clouds', 'Mist', 'Fog', 'Haze'].includes(condition)) {
        body.classList.add('cloudy');
    } else if (['Rain', 'Drizzle'].includes(condition)) {
        body.classList.add('rainy');
    } else if (condition === 'Thunderstorm') {
        body.classList.add('stormy');
    } else if (condition === 'Snow') {
        body.classList.add('snowy');
    }
}

function showError(message) {
    cityName.textContent = "Error";
    temperature.textContent = "⚠️";
    description.textContent = message;
    card.classList.remove('hidden');
}

function getWeatherEmoji(condition) {
    switch (condition) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain': return '🌧️';
        case 'Drizzle': return '🌦️';
        case 'Thunderstorm': return '⛈️';
        case 'Snow': return '❄️';
        case 'Mist':
        case 'Fog':
        case 'Haze': return '🌫️';
        default: return '🌈';
    }
}
