const apiKey = "YOUR_API_KEY_HERE"; 
const getWeatherBtn = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

getWeatherBtn.addEventListener("click", () => {
    searchCity();
});

cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        searchCity();
    }
});

function searchCity() {
    const city = cityInput.value.trim();
    if(city === "") {
        weatherResult.textContent = "Please enter a city.";
        return;
    }
    fetchWeather(city);
}

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
    .then(response => {
        if(response.status === 401) {
            throw new Error("Unauthorized: Check your API key");
        }
        if(response.status === 404) {
            throw new Error("City not found");
        }
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const { name, main, weather, coord } = data;
        weatherResult.innerHTML = `
            <h2>${name}</h2>
            <p>Temperature: ${main.temp} °C</p>
            <p>Feels like: ${main.feels_like} °C</p>
            <p>Weather: ${weather[0].description}</p>
            <div id="map" style="height: 400px; margin-top: 20px;"></div>
        `;
        const map = L.map("map").setView([coord.lat, coord.lon], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([coord.lat, coord.lon]).addTo(map)
            .bindPopup(`<b>${name}</b><br>Temperature: ${main.temp} °C`)
            .openPopup();
    })
    .catch(err => {
        weatherResult.textContent = err.message;
    });
}
