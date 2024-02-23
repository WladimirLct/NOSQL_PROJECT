// id = "feelslike_c"
            // id = "temp_c"
            // id = "wind_kph"
            // id = "humidity"
            // id = "pressure_mb"
            // id = "uv"
            // id = "precip_mm"
            // id = "condition"
function replaceTimeDate(data) {
    const dateTime = new Date(data[1]);

    const dayOfWeek = dateTime.toLocaleString('default', { weekday: 'long' }); // Gets the day of the week in written form
    const day = dateTime.getDate(); // Gets the day of the month
    const month = dateTime.toLocaleString('default', { month: 'short' }); // Gets the month name
    const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Gets the time in hh:mm format

    const dayElement = document.getElementById("day");
    const timeElement = document.getElementById("time");
    const monthElement = document.getElementById("month");
    
    dayElement.textContent = dayOfWeek + ", ";
    timeElement.textContent = time;
    monthElement.textContent = "Last updated, " + month + " " + day;
}

function colorChange(data) {
    if (data["temp_c"][2] > 30) {
        document.getElementById("temp_c").style.color = "red";
        document.getElementById("temp_color").style.color = "red";
    } else if (data["temp_c"][2] > 20) {
        document.getElementById("temp_c").style.color = "#ffa404";
        document.getElementById("temp_color").style.color = "#ffa404";
    } else if (data["temp_c"][2] >= 10) {
        document.getElementById("temp_c").style.color = "#ffd404";
        document.getElementById("temp_color").style.color = "#ffd404";
    } else if (data["temp_c"][2] > 0) {
        document.getElementById("temp_c").style.color = "#107ce8";
        document.getElementById("temp_color").style.color = "#107ce8";
    } else if (data["temp_c"][2] <= 0) {
        document.getElementById("temp_c").style.color = "#74c4ff";
        document.getElementById("temp_color").style.color = "#74c4ff";
    } else {
        document.getElementById("temp_c").style.color = "black";
        document.getElementById("temp_color").style.color = "black";
    }
}

function replaceDashBoardValues(data) {
    // Replace the values in the dashboard with the new data
    document.getElementById("feelslike_c").textContent = data["feelslike_c"][2];
    document.getElementById("temp_c").textContent = data["temp_c"][2];
    document.getElementById("wind_kph").textContent = data["wind_kph"][2] + " km/h";
    document.getElementById("humidity").textContent = data["humidity"][2] + " %";
    document.getElementById("pressure_mb").textContent = data["pressure_mb"][2] + " mb";
    document.getElementById("uv").textContent = data["uv"][2];
    document.getElementById("precip_mm").textContent = data["precip_mm"][2]+ " mm";
    document.getElementById("condition").textContent = data["condition"][2]['text'];
    document.getElementById("conditionImg").src = data["condition"][2]['icon'];
    replaceTimeDate(data["last_updated"]);
    colorChange(data);
}

export { replaceDashBoardValues };