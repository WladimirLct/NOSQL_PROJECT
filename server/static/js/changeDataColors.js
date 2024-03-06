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
    const scales = {
        precip_mm: { green: [0, 1], lightGreen: [1, 5], yellow: [5, 15], orange: [15, 25], red: [25, Infinity] },
        wind_kph: { green: [0, 5], lightGreen: [5, 15], yellow: [15, 25], orange: [25, 35], red: [35, Infinity] },
        humidity: { green: [0, 20], lightGreen: [20, 40], yellow: [40, 60], orange: [60, 80], red: [80, Infinity] },
        vis_km: { green: [40, Infinity], lightGreen: [30, 40], yellow: [20, 30], orange: [10, 20], red: [0, 10] },
        pressure_mb: { green: [0, 1010], lightGreen: [1010, 1020], yellow: [1020, 1030], orange: [1030, 1040], red: [1040, Infinity] },
        uv: { green: [0, 2], lightGreen: [2, 5], yellow: [5, 7], orange: [7, 11], red: [11, Infinity] },
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