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
// Constants for calculations
const ENERGY_COST_PER_UNIT = 0.1901; 

// Function to retrieve appliance data from session storage and format it
function retrieveApplianceData() {
    const individualApplianceEmissions = JSON.parse(sessionStorage.getItem('individualApplianceEmissions')) || {};

    // Log individual appliance emissions to check if the data is correctly stored
    console.log('Individual Appliance Emissions:', individualApplianceEmissions);

    const averageConsumptions = {
        television: 6.54,
        clothes_washer: 3.2,
        clothes_dryer: 22.452,
        air_conditioner: 20.01,
        refrigerator: 35.52,
        dishwasher: 25.82
    };

    const applianceData = Object.entries(individualApplianceEmissions).map(([appliance, emissions]) => {
        const normalizedAppliance = appliance.toLowerCase().replace(/\s+/g, '_');
        const avgConsumption = averageConsumptions[normalizedAppliance];  
        if (avgConsumption) {
            const userConsumption = emissions; 
            return { appliance, userConsumption, avgConsumption };
        }
        return null;  
    }).filter(item => item !== null); 

    // Log the formatted appliance data
    console.log('Appliance Data:', applianceData);

    return applianceData;
}



// Function to calculate the cost savings based on the retrieved appliance data
function calculateCostSaving(data) {
    let totalPositiveDifference = 0;

    data.forEach(item => {
        const difference = item.avgConsumption - item.userConsumption; 
        console.log(`Appliance: ${item.appliance}, Average Consumption: ${item.avgConsumption}, User Consumption: ${item.userConsumption}, Difference: ${difference}`);

        if (difference > 0) {
            totalPositiveDifference += difference; 
        }
    });

    const totalCostSavings = Math.round(totalPositiveDifference * ENERGY_COST_PER_UNIT); 
    console.log('Total Cost Savings:', totalCostSavings);
    return totalCostSavings;
}


// Function to dynamically display the calculated savings on the webpage
function displayTotalSavings(totalSavings) {
    const savingsContainer = document.getElementById('negative-differences');
    console.log('Displaying Total Savings:', totalSavings);
    if (totalSavings > 0) {
        savingsContainer.textContent = `$${totalSavings} per year`;
        savingsContainer.style.backgroundColor = '#4CAF50'; 
    } else {
        savingsContainer.textContent = 'No significant savings identified';
        savingsContainer.style.backgroundColor = '#f44336'; 
    }
}

// Function to initialize and calculate savings on page load
function init() {
    const applianceData = retrieveApplianceData(); 
    const totalSavings = calculateCostSaving(applianceData); 
    displayTotalSavings(totalSavings); 
}


window.onload = init;


// Function to dynamically update the comparison section
function updateComparisonSection() {
    // Calculate the total cost savings
    const totalSavings = calculateCostSaving(averagesData);

    // Find the container where you want to display the savings
    const savingsContainer = document.getElementById('negative-differences');
    if (totalSavings > 0) {
        savingsContainer.textContent = `$${totalSavings} per year`;
        savingsContainer.style.backgroundColor = '#4CAF50'; // Green for positive savings
    } else {
        savingsContainer.textContent = 'No significant savings identified';
        savingsContainer.style.backgroundColor = '#f44336'; // Red for no savings
    }

    // Update other relevant dynamic parts
    // Example: Update bar chart dynamically if not done elsewhere
    createGroupedBarChart(averagesData, "#grouped-bar-chart");
}

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
	
