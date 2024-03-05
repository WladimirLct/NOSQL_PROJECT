import { temperatureColorChange, changeIconColor } from './changeDataColors.js';

function replaceTimeDate(data) {
    const dateTime = (new Date(data)).toUTCString() ;
    console.log(dateTime);
    const time = dateTime.split(" ")[4].split(":").slice(0, 2).join(":"); // Gets the time in HH:MM format

    const dayOfWeek = dateTime.split(",")[0];

    const dayElement = document.getElementById("day");
    const timeElement = document.getElementById("time");
    
    dayElement.textContent = `${dayOfWeek}, `;
    timeElement.textContent = time;
}

function replaceDashBoardValues(data) {
    // Replace the values in the dashboard with the new data
    document.getElementById("feelslike_c").textContent = data["feelslike_c"] + " °C";
    document.getElementById("temp_c").textContent = data["temp_c"];
    document.getElementById("wind_kph").textContent = data["wind_kph"] + " km/h";
    document.getElementById("humidity").textContent = data["humidity"] + " %";
    document.getElementById("pressure_mb").textContent = data["pressure_mb"] + " mb";
    document.getElementById("uv").textContent = data["uv"];
    document.getElementById("precip_mm").textContent = data["precip_mm"]+ " mm";
    document.getElementById("condition").textContent = data["condition"]['text'];
    document.getElementById("conditionImg").src = data["condition"]['icon'];
    document.getElementById("vis_km").textContent = data["vis_km"] + " km";

    changeIconColor(data);
    temperatureColorChange(data);
    replaceTimeDate(data["last_updated"]);
}

export { replaceDashBoardValues };