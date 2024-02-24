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
                label: 'Temperature',
                data: dataPoints,
                borderColor: 'rgba(255, 99, 132, 1)',
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
                    max: 23,  // Set maximum value for the x-axis
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
                    max: 23,  // Set maximum value for the x-axis
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
    img.width = 15;
    img.height = 18;

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