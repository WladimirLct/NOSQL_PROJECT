// Function to fetch weather data for the selected city
async function fetchLastandNextData(cityId, dataName, documentName, date) {
    const response = await fetch(`/get_last_recorded_and_forecasted_date?city_name=${cityId}&data_name=${dataName}&document_name=${documentName}&date=${date}`);
    const data = await response.json();

    const labels = data.flat().map(item => item[1].split(' ')[1]); // Extracting date-time strings for labels but remove the day since it's daily data

    return [ labels, data ];
}

async function fetchDailyHistory(cityId, dataName, documentName, date) {
    const response = await fetch(`/get_daily_weather_data?city_name=${cityId}&data_name=${dataName}&document_name=${documentName}&date=${date}`);
    const data = await response.json();

    const labels = data.map(item => item[1].split(' ')[1]); // Extracting date-time strings for labels but remove the day since it's daily data
    const results = data.map(item => item[2]); // Extracting results for data points

    return [ labels, results ];
}

async function fetchSevenDayForecast(cityId) {
    const response = await fetch(`/get_seven_day_forecast?city_name=${cityId}`);
    const data = await response.json();
    return data;
}

async function fetchLatestWeather(cityId, date) {
    const response = await fetch(`/get_all_latest_weather_data?city_name=${cityId}&date=${date}`);
    const data = await response.json();
    
    return data;
}

async function badAirQuality(cityId, date) {
    const response = await fetch(`/get_bad_air_quality_cities?city_name=${cityId}&date=${date}`);
    const data = await response.json();
    
    return data;
}

async function fetchWeatherChangeAlert(cityId){
    const response = await fetch(`/weather_change_alert?city_name=${cityId}`);
    const data = await response.json();
    
    return data;
}


export { badAirQuality };
export { fetchDailyHistory };
export { fetchLastandNextData };
export { fetchSevenDayForecast };
export { fetchLatestWeather };
export { fetchWeatherChangeAlert };