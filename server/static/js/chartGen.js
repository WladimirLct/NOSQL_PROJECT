function createChart(ctx, chartType, labels, datasetLabel, dataPoints, borderColor, tension, beginAtZero) {
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

function createHistogram(ctx, labels, dataPoints ) {
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
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false, // Fill the area under the line
                tension: 0.4, // Adjust the curve tension
            }]
        },
        options: {
            scales: {
                x: {
                    grid : {
                        display : false
                    }
                },
                y: {
                    grid : {
                        display : false
                    },
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

export { createHistogram };




export { createChart };