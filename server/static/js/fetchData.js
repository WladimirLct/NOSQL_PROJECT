// Function to fetch weather data for the selected city
async function fetchDailyHistory(cityId, dataName, documentName, date) {
    const response = await fetch(`/get_daily_weather_data?city_name=${cityId}&data_name=${dataName}&document_name=${documentName}&date=${date}`);
    const data = await response.json();

    const labels = data.map(item => item[1].split(' ')[1]); // Extracting date-time strings for labels but remove the day since it's daily data
    const results = data.map(item => item[2]); // Extracting results for data points

    return [ labels, results ];
}

export { fetchDailyHistory };
