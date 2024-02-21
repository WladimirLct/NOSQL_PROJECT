import { fetchSevenDayForecast } from "./fetchData.js";

async function updateForcastData(city) {
    const forecast = await fetchSevenDayForecast(city);

    forecast.forEach((day,i) => {
        // Get the div with the id forecast_(i+1)
        const div = document.getElementById(`forecast_${i+1}`);

        // Set the title
        let date = (new Date(day.date)).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        let weekday = (new Date(day.date)).toLocaleDateString('en-US', { weekday: 'long' });

        div.querySelector(".title").querySelector("h1").innerText = weekday;
        div.querySelector(".title").querySelector("p").innerText = date;

        // Set the weather icon and description
        div.querySelector(".weather").querySelector("img").src = `${day.condition.icon}`;
        div.querySelector(".weather").querySelector("p").innerText = day.condition.text;

        // Set the min and max temps
        const maxtemp_c = day.info.maxtemp_c > 0 ? `+${day.info.maxtemp_c}` : `${day.info.maxtemp_c}`;
        const mintemp_c = day.info.mintemp_c > 0 ? `+${day.info.mintemp_c}` : `${day.info.mintemp_c}`;
        div.querySelector(".temps").querySelectorAll("p")[0].innerText = `${maxtemp_c}°C`;
        div.querySelector(".temps").querySelectorAll("p")[1].innerText = `${mintemp_c}°C`;
        
        // Set the average temperature
        div.querySelectorAll(".avg-info p span")[0].innerText = `${day.info.avgtemp_c}°C`;
        
        // Set the average humidity
        div.querySelectorAll(".avg-info p span")[1].innerText = `${day.info.avghumidity}%`;
        
        // Set the UV index
        div.querySelectorAll(".avg-info p span")[2].innerText = day.info.uv;
    });
};

// Event listener for when the selected city changes
document.getElementById('city').addEventListener('change', function() {
    updateForcastData(this.value);
});

// Initial update
updateForcastData(document.getElementById('city').value);