function createChart(ctx, chartType, labels, datasetLabel, dataPoints, borderColor, tension, beginAtZero) {
    // First destroy the existing chart, if any
    if (window["chart" + ctx.canvas.id]) {
        window["chart" + ctx.canvas.id].destroy();
    }

    window["chart" + ctx.canvas.id] = new Chart(ctx, {
        type: chartType, // Chart type, e.g., 'line'
        data: {
            labels: labels, // Array of labels for the x-axis
            datasets: [{
                label: datasetLabel, // Label for the dataset
                data: dataPoints, // Array of data points
                borderColor: borderColor, // Line color
                tension: tension // Line smoothness
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: beginAtZero // Whether the y-axis should start from 0
                }
            }
        }
    });
}

export { createChart };