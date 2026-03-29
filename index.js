const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('#cityInput');
const card = document.querySelector('.card');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const description = document.querySelector('#description');
const locationBtn = document.querySelector('#getLocationBtn');

// Use your second active key from the photo
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
        // FIXED: Removed ",IN" so you can search global cities
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

    // This updates the background color based on weather
    changeBackground(weatherMain);

    cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C ${emoji}`;
    description.textContent = data.weather[0].description;
    
    card.classList.remove('hidden');
}

function changeBackground(condition) {
    const body = document.body;
    // Clears old classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'stormy');

    if (condition === 'Clear') body.classList.add('sunny');
    else if (['Clouds', 'Mist', 'Fog', 'Haze'].includes(condition)) body.classList.add('cloudy');
    else if (['Rain', 'Drizzle'].includes(condition)) body.classList.add('rainy');
    else if (condition === 'Thunderstorm') body.classList.add('stormy');
    else if (condition === 'Snow') body.classList.add('snowy');
}

function showError(message) {
    cityName.textContent = "Oops!";
    temperature.textContent = "❌";
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
