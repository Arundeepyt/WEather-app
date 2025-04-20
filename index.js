const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('#cityInput');
const card = document.querySelector('.card');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const description = document.querySelector('#description');
const locationBtn = document.querySelector('#getLocationBtn');

// Replace with your actual WeatherAPI key
const apiKey = 'YOUR_API_KEY';

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
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateWeatherCard(data);
    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`);
        if (!response.ok) throw new Error("Location not found");

        const data = await response.json();
        updateWeatherCard(data);
    } catch (error) {
        showError(error.message);
    }
}

function updateWeatherCard(data) {
    const weatherMain = data.current.condition.text;
    const emoji = getWeatherEmoji(weatherMain);
    cityName.textContent = `Weather in ${data.location.name}, ${data.location.country}`;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C ${emoji}`;
    description.textContent = `Condition: ${weatherMain}`;
    card.classList.remove('hidden');
}

function showError(message) {
    cityName.textContent = "Error";
    temperature.textContent = message;
    description.textContent = "";
    card.classList.remove('hidden');
}

function getWeatherEmoji(condition) {
    condition = condition.toLowerCase();
    if (condition.includes('clear')) return '☀';
    if (condition.includes('cloud')) return '☁';
    if (condition.includes('rain')) return '🌧';
    if (condition.includes('drizzle')) return '🌦';
    if (condition.includes('thunder')) return '⛈';
    if (condition.includes('snow')) return '❄';
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) return '🌫';
    if (condition.includes('smoke')) return '🚬';
    if (condition.includes('dust') || condition.includes('sand')) return '🌪';
    return '🌈';
}