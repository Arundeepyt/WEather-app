const apiKey = '7f4dfa07c7f10eca09a13b20528d8cd3';

const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('#cityInput');
const locationBtn = document.querySelector('#getLocationBtn');
const card = document.querySelector('.card');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchWeatherData(cityInput.value.trim());
    cityInput.value = '';
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetchWeatherDataByCoords(pos.coords.latitude, pos.coords.longitude);
        });
    }
});

async function fetchWeatherData(city) {
    try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        
        const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        
        if (!currentRes.ok) throw new Error("City not found");
        
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();
        
        updateUI(currentData, forecastData);
    } catch (err) {
        alert(err.message);
    }
}

async function fetchWeatherDataByCoords(lat, lon) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();
    
    updateUI(currentData, forecastData);
}

function updateUI(current, forecast) {
    // 1. Update Current Weather
    document.getElementById('cityName').textContent = `${current.name}, ${current.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    
    // 2. Update Background based on weather
    changeBg(current.weather[0].main);

    // 3. Update Forecast Grid
    const container = document.getElementById('forecastContainer');
    container.innerHTML = ''; // Clear old items

    // API gives data every 3 hours. index % 8 filters it to roughly once per day.
    const dailyData = forecast.list.filter((_, index) => index % 8 === 0);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' });
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-card';
        dayCard.innerHTML = `
            <p style="font-size: 0.7rem; opacity: 0.7;">${date}</p>
            <p style="font-size: 1.5rem; margin: 8px 0;">${getEmoji(day.weather[0].main)}</p>
            <p style="font-weight: 600;">${Math.round(day.main.temp)}°</p>
        `;
        container.appendChild(dayCard);
    });

    card.classList.remove('hidden');
}

function changeBg(status) {
    document.body.className = ''; // reset
    if (status === 'Clear') document.body.classList.add('sunny');
    else if (['Clouds', 'Haze', 'Mist'].includes(status)) document.body.classList.add('cloudy');
    else if (['Rain', 'Drizzle', 'Thunderstorm'].includes(status)) document.body.classList.add('rainy');
}

function getEmoji(status) {
    const map = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️' };
    return map[status] || '🌈';
}
