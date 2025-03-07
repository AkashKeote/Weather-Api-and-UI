document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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
    const hourlyToggle = document.querySelector('.text-button');
    
    // State variables
    let is12HourFormat = false;
    let hourlyForecastData = [];

    // Date formatting
    function formatDate() {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date().toLocaleDateString('en-IN', options);
    }

    // Time formatting
    function formatTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: is12HourFormat
        }).replace(/^0/, '');
    }

    // Toggle time format
    function toggleTimeFormat() {
        is12HourFormat = !is12HourFormat;
        hourlyToggle.textContent = is12HourFormat ? '12h' : '24h';
        updateHourlyForecast();
    }

    // Update hourly forecast display
    function updateHourlyForecast() {
        const forecastScroll = document.querySelector('.forecast-scroll');
        forecastScroll.innerHTML = '';

        hourlyForecastData.forEach(hour => {
            const hourCard = document.createElement('div');
            hourCard.className = 'hour-card';
            hourCard.innerHTML = `
                <div class="time">${formatTime(hour.dt)}</div>
                <div class="temp">${Math.round(hour.temp)}°</div>
            `;
            forecastScroll.appendChild(hourCard);
        });
    }

    // Update weather display
    function updateWeatherUI(data) {
        cityElement.textContent = `${data.city}, IN`;
        dateElement.textContent = formatDate();
        tempElement.innerHTML = `${Math.round(data.temperature)}<span>°c</span>`;
        weatherStatus.textContent = data.description;
        
        // Update metrics
        windElement.querySelector('.value').textContent = `${data.wind_speed} km/h`;
        humidityElement.querySelector('.value').textContent = `${data.humidity}%`;
        tempHighElement.querySelector('.value').textContent = `${Math.round(data.temp_high)}°c`;
        tempLowElement.querySelector('.value').textContent = `${Math.round(data.temp_low)}°c`;

        // Update hourly forecast
        hourlyForecastData = data.hourly;
        updateHourlyForecast();
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

    hourlyToggle.addEventListener('click', toggleTimeFormat);

    // Initial setup
    dateElement.textContent = formatDate();
    document.querySelector('.forecast-scroll').innerHTML = ''; // Clear static content
});
