function createChart(ctx, labels, dataPoints) {
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
                label: 'Temperature Wave',
                data: dataPoints,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false, // Fill the area under the line
                tension: 0.4, // Adjust the curve tension
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                      drawBorder: false,
                    },
                }],
                x: {
                    grid : {
                        display : false
                    }
                },
                y: {
                    grid : {
                        display : false
                    },
                    beginAtZero: false,
                    suggestedMin: Math.min(...dataPoints) - 2, // Adjust based on your data
                    suggestedMax: Math.max(...dataPoints) + 2 // Adjust based on your data
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
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
                        return 'rgba(0, 255, 0, 0.7)'; 
                    } else if (value <= 5) {
                        return 'rgba(255, 255, 0, 0.7)';
                    } else if (value <= 7) {
                        return 'rgba(255, 165, 0, 0.7)';
                    } else if (value === 11) {
                        return 'rgba(128, 0, 128, 0.7)'; 
                    } else {
                        return 'rgba(255, 0, 0, 0.7)'; 
                    }
                }),
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
            }
        }
    });
}




function createScatterPlot(ctx, labels, dataPoints, imageSrc) {
    // First destroy the existing chart, if any
    if (window["scatterPlotChart" + ctx.canvas.id]) {
        window["scatterPlotChart" + ctx.canvas.id].destroy();
    }
    const img = new Image();
    img.src = imageSrc;
    img.width = 20;
    img.height = 23;

    // Create a scatter plot with custom image points
    window["scatterPlotChart" + ctx.canvas.id] = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: "Humidity",
                data: dataPoints,
                pointStyle: img,
            }]
        },
        options: {
            clip: false,
            scales: {
                x: {
                    grid : {
                        display : false
                    },
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        stepSize: 1,
                        callback: function (value, index) {
                            return labels[index];
                        }
                    }
                },
                y: {
                    grid : {
                        display : false
                    },
                    min: 0,  // Set minimum value for the y-axis
                    max: 100,  // Set maximum value for the y-axis
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}




export { createScatterPlot };



export { createHistogram };




export { createChart };