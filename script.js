document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchFab = document.querySelector('.search-fab');
    const cityElement = document.querySelector('.city');
    const dateElement = document.querySelector('.date');
    const tempElement = document.querySelector('.temperature');
    const weatherStatus = document.querySelector('.weather-status');
    const windElement = document.querySelectorAll('.metric-card')[0];
    const humidityElement = document.querySelectorAll('.metric-card')[1];
    const tempHighElement = document.querySelectorAll('.metric-card')[2];
    const tempLowElement = document.querySelectorAll('.metric-card')[3];

    // Date formatting
    function formatDate() {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date().toLocaleDateString('en-IN', options);
    }
// Temporary hourly forecast fix (remove static content)
function clearStaticHourly() {
    const forecastScroll = document.querySelector('.forecast-scroll');
    forecastScroll.innerHTML = ''; // Remove static content
}

// Call this at the end of DOMContentLoaded
clearStaticHourly();
    // Update weather display
 function updateWeatherUI(data) {
        cityElement.textContent = `${data.city}, IN`;
        dateElement.textContent = formatDate();
        tempElement.innerHTML = `${Math.round(data.temperature)}<span>°c</span>`;
        weatherStatus.textContent = data.description;
        
        // Update all metrics
        windElement.querySelector('.value').textContent = `${data.wind_speed} km/h`;
        humidityElement.querySelector('.value').textContent = `${data.humidity}%`;
        tempHighElement.querySelector('.value').textContent = `${Math.round(data.temp_high)}°c`;
        tempLowElement.querySelector('.value').textContent = `${Math.round(data.temp_low)}°c`;
    }

    // Fetch weather data
    async function fetchWeather(city) {
        try {
            const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
            if (!response.ok) throw new Error('City not found');
            return await response.json();
        } catch (error) {
            alert(error.message);
            return null;
        }
    }

    // Event Listeners
    searchFab.addEventListener('click', async () => {
        const city = searchInput.value.trim();
        if (!city) return;
        
        const weatherData = await fetchWeather(city);
        if (weatherData) updateWeatherUI(weatherData);
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (!city) return;
            
            const weatherData = await fetchWeather(city);
            if (weatherData) updateWeatherUI(weatherData);
        }
    });

    // Initial load
    dateElement.textContent = formatDate();
});
