const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");

async function checkWeather(city) {
    if (city === "") {
        alert("Please enter city name");
        return;
    }

    try {
        errorDiv.style.display = "none";

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            errorDiv.style.display = "block";
            weatherDiv.style.display = "none";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const weatherRes = await fetch(weatherUrl);
        const data = await weatherRes.json();

        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
        document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
        document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";

        const code = data.current.weather_code;
        if (code === 0) weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/6974/6974833.png";
        else if (code === 1 || code === 2 || code === 3) weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414825.png";
        else if (code >= 51) weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
        else weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414825.png";

        weatherDiv.style.display = "block";

    } catch (error) {
        console.log("Error:", error);
        errorDiv.style.display = "block";
        weatherDiv.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkWeather(searchBox.value);
});