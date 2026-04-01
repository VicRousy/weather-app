
// Get DOM elements
const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const toggleBtn = document.getElementById('toggle-temp');
const loading = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');

let currentData = null; // Store current weather data
let isCelsius = false;

// Function to fetch weather data from API
async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Location not found')
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Test the function
getWeatherData('London');

// Process the data and return only what we need
function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        temperature: data.currentConditions.temp,
        conditions: data.currentConditions.conditions,
        humidity: data.currentConditions.humidity,
        description: data.description
    };
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    
    if (location) {
        loading.classList.remove('hidden');
        weatherDisplay.innerHTML = '';
        
        try {
            const rawData = await getWeatherData(location);
            const processedData = processWeatherData(rawData);
            
            loading.classList.add('hidden');
            displayWeather(processedData);
            currentData = processedData;
        } catch (error) {
            loading.classList.add('hidden');
            weatherDisplay.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Location not found. Please try again.</p>
                </div>
            `;
        }
    }
});

// Display weather data on the page
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>${data.location}</h2>
            <p class="temp">${convertTemp(data.temperature)}°${isCelsius ? 'C' : 'F'}</p>
            <p class="conditions">${data.conditions}</p>
            <p class="humidity">Humidity: ${data.humidity}%</p>
            <p class="description">${data.description}</p>
        </div>
    `;
    changeBackground(data.conditions);
}

function changeBackground(conditions) {
    const body = document.body;
    
    if (conditions.toLowerCase().includes('rain')) {
        body.style.background = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
    } else if (conditions.toLowerCase().includes('cloud')) {
        body.style.background = 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
    } else if (conditions.toLowerCase().includes('clear') || conditions.toLowerCase().includes('sun')) {
        body.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (conditions.toLowerCase().includes('snow')) {
        body.style.background = 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)';
      } else {
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}    


// Convert Fahrenheit to Celsius
function convertTemp(temp) {
    if (isCelsius) {
        return ((temp - 32) * 5/9).toFixed(1);
    }
    return temp;
}

// Toggle temperature unit
toggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;
    toggleBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
    
    if (currentData) {
        displayWeather(currentData);
    }
});