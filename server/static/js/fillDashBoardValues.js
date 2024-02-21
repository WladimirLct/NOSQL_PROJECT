// id = "feelslike_c"
            // id = "temp_c"
            // id = "wind_kph"
            // id = "humidity"
            // id = "pressure_mb"
            // id = "uv"
            // id = "precip_mm"
            // id = "condition"

function replaceDashBoardValues(data) {
    // Replace the values in the dashboard with the new data
    document.getElementById("feelslike_c").textContent = data["feelslike_c"][2];
    document.getElementById("temp_c").textContent = data["temp_c"][2] + "°C";
    document.getElementById("wind_kph").textContent = data["wind_kph"][2];
    document.getElementById("humidity").textContent = data["humidity"][2];
    document.getElementById("pressure_mb").textContent = data["pressure_mb"][2];
    document.getElementById("uv").textContent = data["uv"][2];
    document.getElementById("precip_mm").textContent = data["precip_mm"][2];
    // document.getElementById("condition").textContent = data["condition"][2];
}

export { replaceDashBoardValues };