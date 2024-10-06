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

const CO2_PER_KM_PETROL_CAR = 0.17048;
const CO2_PER_ICE_SQUARE_METER = 333.33;
const TREES_TO_OFFSET_CO2 = 21.77;
const CO2_SAVED_PER_SOLAR_PANEL = 38.46;
const CO2_EMITTED_PER_CAR = 88.46;
const AVERAGE_WEEKLY_EMISSIONS = 234.6153846;

function displayEquivalences(totalEmissions) {
    const kmsEquivalent = (totalEmissions / CO2_PER_KM_PETROL_CAR).toFixed(2);
    const iceEquivalent = (totalEmissions / CO2_PER_ICE_SQUARE_METER).toFixed(2);
    const treesEquivalent = (totalEmissions / TREES_TO_OFFSET_CO2).toFixed(2);
    const solarPanelsEquivalent = (totalEmissions / CO2_SAVED_PER_SOLAR_PANEL).toFixed(2);
    const carsRemovedEquivalent = (totalEmissions / CO2_EMITTED_PER_CAR).toFixed(2);

    document.getElementById('car-equivalent').innerText = `${kmsEquivalent} km travelled by petrol car`;
    document.getElementById('ice-equivalent').innerText = `${iceEquivalent} m² of melted polar ice caps`;
    document.getElementById('trees-equivalent').innerText = `Plant ${treesEquivalent} trees to offset`;
    document.getElementById('solar-panels-equivalent').innerText = `Install ${solarPanelsEquivalent} solar panels to offset`;
    document.getElementById('cars-removed-equivalent').innerText = `Remove ${carsRemovedEquivalent} cars from the road to offset`;
}

function updateEmissionComparison(userEmissions) {
    const difference = (userEmissions - AVERAGE_WEEKLY_EMISSIONS) / AVERAGE_WEEKLY_EMISSIONS;
    const percentageDifference = (difference * 100).toFixed(2);
    const comparisonElement = document.getElementById('comparison-percentage');

    if (difference > 0) {
        comparisonElement.textContent = `${percentageDifference}% more`;
        comparisonElement.style.color = 'red';
    } else if (difference < 0) {
        comparisonElement.textContent = `${Math.abs(percentageDifference)}% less`;
        comparisonElement.style.color = 'green';
    } else {
        comparisonElement.textContent = `equal to the average`;
        comparisonElement.style.color = 'blue';
    }

    document.getElementById('user-emissions').textContent = userEmissions.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function () {
    const totalEmissions = parseFloat(sessionStorage.getItem('totalEmissions')); // Example: getting total emissions from sessionStorage
    if (!isNaN(totalEmissions)) {
        updateEmissionComparison(totalEmissions); // Update comparison to average
        displayEquivalences(totalEmissions); // Update equivalences dynamically
    }
});

// Generate charts on load
window.addEventListener('load', function () {
    var categoryBarChart = document.getElementById('categoryBarChart').getContext('2d');
    window.myCategoryBar = new Chart(categoryBarChart, categoryBarChartConfig);

    var transportBarChart = document.getElementById('transportBarChart').getContext('2d');
    window.myTransportBar = new Chart(transportBarChart, transportBarChartConfig);
});
	
