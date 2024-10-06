'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
    green: '#75c181',
    gray: '#a9b5c9',
    text: '#252930',
    border: '#e7e9ed'
};

// Function to get category emissions data
function getEmissionsData() {
    let categoryData = [
        { category: 'Electricity', emissions: parseFloat(sessionStorage.getItem('applianceEmissions') || 0) },
        { category: 'Transport', emissions: parseFloat(sessionStorage.getItem('transportEmissions') || 0) },
        { category: 'Gas', emissions: parseFloat(sessionStorage.getItem('gasEmissions') || 0) }
    ];

    categoryData = categoryData.filter(item => item.emissions > 0);

    return categoryData;
}

// Prepare data for category chart
function prepareCategoryChartData() {
    const emissionsData = getEmissionsData();
    const labels = emissionsData.map(item => item.category);
    const data = emissionsData.map(item => item.emissions);

    return {
        labels: labels,
        datasets: [{
            label: 'Emissions per Category (kg CO2)',
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            borderWidth: 1,
            data: data
        }]
    };
}

// Category chart configuration
var categoryBarChartConfig = {
    type: 'bar',
    data: prepareCategoryChartData(),
    options: {
        responsive: true,
        aspectRatio: 1.5,
        legend: {
            position: 'bottom',
            align: 'end',
        },
        title: {
            display: true,
            text: 'Emissions per Category (kg CO2)',
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            titleMarginBottom: 10,
            bodySpacing: 10,
            xPadding: 16,
            yPadding: 16,
            borderColor: window.chartColors.border,
            borderWidth: 1,
            backgroundColor: '#fff',
            bodyFontColor: window.chartColors.text,
            titleFontColor: window.chartColors.text,
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.value + ' kg CO2';
                }
            },
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        return value + ' kg CO2';
                    }
                },
            }]
        }
    }
};

// Function to get transport emissions data
function getTransportEmissionsData() {
    const transportData = JSON.parse(sessionStorage.getItem('transportationData') || '{}');
    const formattedData = Object.entries(transportData).map(([type, emissions]) => ({
        type: type.replace('_', ' '),
        emissions: parseFloat(emissions)
    }));
    return formattedData;
}

// Prepare data for transport chart
function prepareTransportChartData() {
    const transportData = getTransportEmissionsData();
    const labels = transportData.map(item => item.type);
    const data = transportData.map(item => item.emissions);

    return {
        labels: labels,
        datasets: [{
            label: 'Emissions by Transport Mode (kg CO2)',
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            borderWidth: 1,
            data: data
        }]
    };
}

// Transport chart configuration
var transportBarChartConfig = {
    type: 'bar',
    data: prepareTransportChartData(),
    options: {
        responsive: true,
        aspectRatio: 1.5,
        legend: {
            position: 'bottom',
            align: 'end',
        },
        title: {
            display: true,
            text: 'Emissions by Transport Mode (kg CO2)'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            titleMarginBottom: 10,
            bodySpacing: 10,
            xPadding: 16,
            yPadding: 16,
            borderColor: window.chartColors.border,
            borderWidth: 1,
            backgroundColor: '#fff',
            bodyFontColor: window.chartColors.text,
            titleFontColor: window.chartColors.text,
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
                ticks: {
                    beginAtZero: true,
                    userCallback: function (value) {
                        return value + ' kg CO2';
                    }
                },
            }]
        }
    }
};

// Generate charts on load
window.addEventListener('load', function () {
    var categoryBarChart = document.getElementById('categoryBarChart').getContext('2d');
    window.myCategoryBar = new Chart(categoryBarChart, categoryBarChartConfig);

    var transportBarChart = document.getElementById('transportBarChart').getContext('2d');
    window.myTransportBar = new Chart(transportBarChart, transportBarChartConfig);
});
	
