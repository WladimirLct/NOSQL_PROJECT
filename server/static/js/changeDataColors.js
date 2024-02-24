function temperatureColorChange(data) {
    const temp_ = document.querySelectorAll(".temp");
    let color = "#ff0000";

    if (data["temp_c"] > 20) {
        color = "#ffa404"
    } else if (data["temp_c"] >= 10) {
        color = "#ffd404";
    } else if (data["temp_c"] > 0) {
        color = "#1f1f1f";
    } else if (data["temp_c"] <= 0) {
        color = "#74c4ff";
    }
    temp_.forEach((temp) => {
        temp.style.color = color;
    });
}
export {temperatureColorChange};

function getWeatherParameterColor(dataValue, dataName) {
    // console.log(dataValue, dataName)
    const scales = {
        precip_mm: { green: [0, 0], lightGreen: [1, 5], yellow: [6, 15], orange: [16, 25], red: [26, Infinity] },
        wind_kph: { green: [0, 5], lightGreen: [6, 15], yellow: [16, 25], orange: [26, 35], red: [36, Infinity] },
        humidity: { green: [45, 55], lightGreen: [35, 44, 56, 65], yellow: [25, 34, 66, 75], orange: [15, 24, 76, 85], red: [0, 14, 86, 100] },
        vis_km: { green: [40, Infinity], lightGreen: [30, 39], yellow: [20, 29], orange: [10, 19], red: [0, 9] },
        pressure_mb: { green: [1010, 1020], lightGreen: [1007, 1009, 1021, 1023], yellow: [1004, 1006, 1024, 1026], orange: [1001, 1003, 1027, 1029], red: [0, 1000, 1030, Infinity] },
        uv: { green: [0, 2], lightGreen: [3, 4], yellow: [5, 6], orange: [7, 9], red: [10, Infinity] },
    };

    const colors = {
        green: "#4cb804",
        lightGreen: "#accc0c",
        yellow: "#ffd404",
        orange: "#ff9204",
        red: "#d11515"
      };
      
      for (const color in scales[dataName]) {
        const range = scales[dataName][color];
        for (let i = 0; i < range.length; i += 2) {
          if (dataValue >= range[i] && dataValue <= range[i + 1]) {
            return colors[color];
          }
        }
      }
    
      return 'black'; 
}

function changeIconColor(data){
    const parameters = [["precip_mm","iprecip"], ["wind_kph","iws"], ["humidity","ih"], ["vis_km","ivk"], ["pressure_mb","ipm"], ["uv","iuv"]];
    for (const parameter of parameters) {
        const color = getWeatherParameterColor(data[parameter[0]], parameter[0]);
        document.getElementById(parameter[1]).style.color = color;
    }
}

export {changeIconColor};