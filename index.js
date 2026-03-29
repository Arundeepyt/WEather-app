function updateWeatherCard(data) {
  const weatherMain = data.weather[0].main;
  const emoji = getWeatherEmoji(weatherMain);

  // ADD THIS LINE:
  changeBackground(weatherMain);

  cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
  temperature.textContent = `Temperature: ${data.main.temp}°C ${emoji}`;
  description.textContent = `Condition: ${data.weather[0].description}`;
  card.classList.remove('hidden');
}

// NEW FUNCTION:
function changeBackground(condition) {
  const body = document.body;
  // Remove any existing weather classes
  body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'stormy');

  switch (condition) {
    case 'Clear':
      body.classList.add('sunny');
      break;
    case 'Clouds':
    case 'Mist':
    case 'Fog':
    case 'Haze':
      body.classList.add('cloudy');
      break;
    case 'Rain':
    case 'Drizzle':
      body.classList.add('rainy');
      break;
    case 'Thunderstorm':
      body.classList.add('stormy');
      break;
    case 'Snow':
      body.classList.add('snowy');
      break;
    default:
      // Keep original gradient if no match
      break;
  }
}
