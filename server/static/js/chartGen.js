function createChart(ctx, labels, dataPoints) {
    labels = labels.map(item => parseInt(item.split(':')[0])); // Extracting date-time strings for labels but remove the day since it's daily data
    
    let count = 0; let first_forecast = -1;
    dataPoints.forEach((type, index) => {
        type.forEach((value, idx) => {
            value[2] = parseInt(value[2]);
            value.color = index == 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
            labels[count] = index == 0 ? labels[count] + 1 : labels[count];
            index == 1 && idx == 0 ? first_forecast = count : null;
            count++;
        });
    });

    dataPoints = dataPoints.flat();
    // Remove the first forecast from the data points
    if (first_forecast !== -1) {
        dataPoints.splice(first_forecast, 1);
        labels.splice(first_forecast, 1);
    }

    let pointsColor = dataPoints.map(item => item.color); // Extracting results for data points
    dataPoints = dataPoints.map(item => item[2]); // Extracting results for data points

    // First destroy the existing chart, if any
    if (window["temperatureWaveChart" + ctx.canvas.id]) {
        window["temperatureWaveChart" + ctx.canvas.id].destroy();
    }

    // Create a line chart with bezier curve
    window["temperatureWaveChart" + ctx.canvas.id] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: dataPoints,
                borderColor: pointsColor,
                borderWidth: 2,
                tension: 0.5, // Adjust the curve tension
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            title : {
                display : true,
                text : 'Temperature',
            },
            scales: {
                x: {
                    grid : {
                        display : false
                    },
                    max: 24,  // Set maximum value for the x-axis
                },
                y: {
                    display : false,
                    grid : {
                        display : false
                    },
                    beginAtZero: false,
                    suggestedMin: Math.min(...dataPoints) - 2,
                    suggestedMax: Math.max(...dataPoints) + 2 
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
                datalabels: {
                    anchor : 'end',
                    align : 'top',
                }
           }
        }
    });
}

function createHistogram(ctx, labels, dataPoints) {
    // First destroy the existing chart, if any
    if (window["histogramChart" + ctx.canvas.id]) {
        window["histogramChart" + ctx.canvas.id].destroy();
    }

    labels = labels.map(item => parseInt(item.split(':')[0]) + 1); // Extracting date-time strings for labels but remove the day since it's daily data

    const diff = 23 - labels[labels.length - 1];
    // For each missing, set 0
    for (let i = 0; i < diff; i++) {
        labels.push(labels[labels.length - 1] + 1);
        dataPoints.push(0);
    }

    // Create a bar chart
    window["histogramChart" + ctx.canvas.id] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Wave',
                data: dataPoints,
                backgroundColor: dataPoints.map(value => {
                    if (value <= 2) {
                        return 'rgba(0, 150, 0, 0.7)'; 
                    } else if (value <= 5) {
                        return 'rgba(255, 165, 0, 0.7)';
                    } else if (value <= 7) {
                        return 'rgba(255, 140, 0, 0.8)';
                    } else if (value === 11) {
                        return 'rgba(128, 0, 128, 0.7)'; 
                    } else {
                        return 'rgba(255, 0, 0, 0.7)'; 
                    }
                }),
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    max: 24,  // Set maximum value for the x-axis
                },
                y: {
                    display: false,
                    grid: {
                        display: false,
                    },
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                datalabels: {
                    color : 'white'
                }
            }
        },
    });
}

function createScatterPlot(ctx, labels, dataPoints, imageSrc) {
    // First destroy the existing chart, if any
    if (window["scatterPlotChart" + ctx.canvas.id]) {
        window["scatterPlotChart" + ctx.canvas.id].destroy();
    }
    const img = new Image();
    img.src = imageSrc;

    labels = labels.map(item => parseInt(item.split(':')[0])); // Extracting date-time strings for labels but remove the day since it's daily data

    let count = 0; let first_forecast = -1;
    dataPoints.forEach((type, index) => {
        type.forEach((value, idx) => {
            value.img = img.cloneNode(); // Create a new image object
            (value.img.width = 16 * value[2]/100, value.img.height = 18 * value[2]/100);
            labels[count] = index == 0 ? labels[count] + 1 : labels[count];
            index == 1 && idx == 0 ? first_forecast = count : null;
            count++;
        });
    });

    dataPoints = dataPoints.flat();
    // Remove the first forecast from the data points
    if (first_forecast !== -1) {
        dataPoints.splice(first_forecast, 1);
        labels.splice(first_forecast, 1);
    }

    let images = dataPoints.map(item => item.img); // Extracting results for data points
    dataPoints = dataPoints.map(item => item[2]); // Extracting results for data points

    // Create a scatter plot with custom image points
    window["scatterPlotChart" + ctx.canvas.id] = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: "Humidity",
                data: dataPoints,
                pointStyle: images,
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            clip: false,
            scales: {
                x: {
                    grid : {
                        display : false
                    },
                    max: 23,  // Set maximum value for the x-axis
                },
                y: {
                    display : false,
                    grid : {
                        display : false
                    },
                    min: 0,  // Set minimum value for the y-axis
                    max: 120,  // Set maximum value for the y-axis
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    anchor : 'end',
                    align : 'top',
                    offset : 10,
                    clip : false,
                    formatter: function (value) {
                        return value.y; 
                    }
                }
            }
        }
    });
}

export { createScatterPlot, createHistogram, createChart };