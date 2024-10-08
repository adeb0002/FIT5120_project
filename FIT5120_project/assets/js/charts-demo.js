'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#75c181', // rgba(117,193,129, 1)
	blue: '#5b99ea', // rgba(91,153,234, 1)
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};

/* Retrieve user-selected appliance settings */
function getUserSelections() {
    const selectedAppliances = JSON.parse(sessionStorage.getItem('applianceData')) || [];
    const userSelections = {};

    selectedAppliances.forEach(appliance => {
        userSelections[appliance] = {
            hours: sessionStorage.getItem(`${appliance}-hours`) || null,
        };

        switch (appliance) {
            case 'television':
                userSelections[appliance].screenSize = sessionStorage.getItem('television-screen-size');
                userSelections[appliance].screenTech = sessionStorage.getItem('television-screen-tech');
                break;
            case 'clothes_washer':
                userSelections[appliance].loadingType = sessionStorage.getItem('clothes_washer-loading');
                userSelections[appliance].loadSize = parseFloat(sessionStorage.getItem('clothes_washer-load-size'));
                break;
            case 'clothes_dryer':
                userSelections[appliance].dryerType = sessionStorage.getItem('clothes_dryer-type');
                break;
            case 'air_conditioner':
                userSelections[appliance].type = sessionStorage.getItem('air_conditioner-type');
                break;
            case 'refrigerator':
                userSelections[appliance].volume = sessionStorage.getItem('refrigerator-volume');
                break;
            case 'dishwasher':
                userSelections[appliance].usage = sessionStorage.getItem('dishwasher-usage');
                break;
            default:
                console.warn(`No specific handling for ${appliance}`);
        }
    });

    console.log('User selections retrieved from sessionStorage:', userSelections);
    return userSelections;
}
// Data for charts

const averagesData = [
    { appliance: "Television", userConsumption: 50, avgConsumption: 654.73 },
    { appliance: "Clothes Washer", userConsumption: 58, avgConsumption: 32.65 },
    { appliance: "Clothes Dryer", userConsumption: 40, avgConsumption: 224.52 },
    { appliance: "Air Conditioner", userConsumption: 91, avgConsumption: 20.01 },
    { appliance: "Refrigerator", userConsumption: 30, avgConsumption: 353.52 }
];

const tvScreenSizeData = [
    { screenSize: 'less than 40', avgConsumption: 114.02 },
    { screenSize: '40-49', avgConsumption: 229.27 },
    { screenSize: '50-59', avgConsumption: 349.04 },
    { screenSize: '60-69', avgConsumption: 515.98 },
    { screenSize: '70-79', avgConsumption: 659.81 },
    { screenSize: '80-89', avgConsumption: 871.68 },
    { screenSize: '90-99', avgConsumption: 1145.47 },
    { screenSize: 'greater than 100', avgConsumption: 1352.56 }
];

const tvScreenTechData = [
    { screenTech: 'OLED', avgConsumption: 491.74 },
    { screenTech: 'LED', avgConsumption: 441.19 },
    { screenTech: 'LCD', avgConsumption: 312.73 },
    { screenTech: 'Plasma', avgConsumption: 428.00 }
];

const clothesWasherLoadSizeData = [
    { loadSize: 5, energyUsage: 47.74 },
    { loadSize: 6, energyUsage: 34.81 },
    { loadSize: 7, energyUsage: 14.57 },
    { loadSize: 8, energyUsage: 25.22 },
    { loadSize: 9, energyUsage: 45.01 },
    { loadSize: 10, energyUsage: 35.41 },
    { loadSize: 11, energyUsage: 62.37 },
    { loadSize: 12, energyUsage: 51.48 },
    { loadSize: 13, energyUsage: 67.38 },
    { loadSize: 14, energyUsage: 69.53 }
];

const clothesWasherTypeData = [
    { loadType: 'Front', energyUsage: 27.68 },
    { loadType: 'Top', energyUsage: 42.74 }
];

const clothesDryerData = [
    { dryerType: 'Vented', energyUsage: 274.64 },
    { dryerType: 'Condensed', energyUsage: 174.39 }
];

const airConditionerData = [
    { type: 'Ducted', energyUsage: 28.15 },
    { type: 'Non Ducted', energyUsage: 9.72 }
];

const refrigeratorData = [
    { volume: 'less than 99', avgUsage: 153.57 },
    { volume: '100-199L', avgUsage: 213.19 },
    { volume: '200-299L', avgUsage: 291.03 },
    { volume: '300-399L', avgUsage: 321.92 },
    { volume: '400-499L', avgUsage: 372.28 },
    { volume: '500-599L', avgUsage: 442.72 },
    { volume: '600-699L', avgUsage: 482.45 },
    { volume: 'greater than 700L', avgUsage: 551.03 }
];

//Area line Chart Demo

// Function to retrieve clothes washer load size data
function getClothesWasherLoadSizeData() {
	return JSON.parse(sessionStorage.getItem('clothesWasherLoadSizeData')) || [
		{ loadSize: 5, energyUsage: 47.74 },
		{ loadSize: 6, energyUsage: 34.81 },
		{ loadSize: 7, energyUsage: 14.57 },
		{ loadSize: 8, energyUsage: 25.22 },
		{ loadSize: 9, energyUsage: 45.01 },
		{ loadSize: 10, energyUsage: 35.41 },
		{ loadSize: 11, energyUsage: 62.37 },
		{ loadSize: 12, energyUsage: 51.48 },
		{ loadSize: 13, energyUsage: 67.38 },
		{ loadSize: 14, energyUsage: 69.53 },
        { loadSize: 15, energyUsage: 72.32 },
        { loadSize: 16, energyUsage: 75.23 }
	];
}

// Function to get the user's selected load size
function getUserSelectedLoadSize() {
    // Retrieve the load size from sessionStorage
    const userSelectedLoadSize = parseFloat(sessionStorage.getItem('clothes_washer-load-size'));

    // Check if a valid value is retrieved, otherwise log a message and return 0
    if (isNaN(userSelectedLoadSize)) {
        console.warn("No valid load size found in sessionStorage. Defaulting to 0.");
        return 0;  // Default to 0 if no valid value is found
    }

    return userSelectedLoadSize;
}


function createClothesWasherLineChart() {
    const clothesWasherLoadSizeData = getClothesWasherLoadSizeData();
    const userSelectedLoadSize = getUserSelectedLoadSize();  // Retrieve the user's selected load size

    const labels = clothesWasherLoadSizeData.map(item => item.loadSize);
    const avgEnergyUsageData = clothesWasherLoadSizeData.map(item => item.energyUsage);

    // Create a dataset with only the user-selected load size's energy usage
    const userEnergyUsageData = clothesWasherLoadSizeData.map(item => item.loadSize === userSelectedLoadSize ? item.energyUsage : null);

    const ctx = document.getElementById('clothes-washer-load-size-chart').getContext('2d');

    const lineChartConfig = {
        type: 'line',
        data: {
            labels: labels,  // X-axis labels (Load Sizes)
            datasets: [{
                label: 'Average Energy Usage (kWh)',
                backgroundColor: "rgba(91,153,234,0.2)", 
                borderColor: "rgba(91,153,234,0.8)", 
                data: avgEnergyUsageData,  // Y-axis values (Average Energy Usage)
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(91,153,234,0.8)'  // Default point color
            }, {
                label: 'Your Energy Usage (kWh)',
                backgroundColor: "rgba(117,193,129,0.2)", 
                borderColor: "darkgreen", 
                data: userEnergyUsageData,  // Only highlight the user's selected load size
                fill: false,
                pointRadius: labels.map(label => label === userSelectedLoadSize ? 10 : 0),  // Only show point for selected load size
                pointBackgroundColor: labels.map(label => label === userSelectedLoadSize ? 'darkgreen' : 'transparent'),  // Highlight user-selected point
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Load Size (kg)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Usage (kWh)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Load Size: ${tooltipItem.label}, Energy Usage: ${tooltipItem.raw} kWh`;
                        }
                    }
                }
            }
        }
    };

    new Chart(ctx, lineChartConfig);
}

// Fixed average consumption values for appliances
const averageConsumptions = {
    television: 6.54,
    clothes_washer: 3.2,
    clothes_dryer: 22.452,
    air_conditioner: 20.01,
    refrigerator: 35.52,
    dishwasher: 25.82
};

//Bar Chart Demo

// Function to dynamically create the bar chart using session storage data and fixed average values
// Bar Chart Demo

// Function to dynamically create the bar chart using session storage data and fixed average values
function createDynamicBarChart() {
    // Retrieve individual appliance emissions/consumptions from session storage
    const individualApplianceEmissions = JSON.parse(sessionStorage.getItem('individualApplianceEmissions') || '{}');
    
    // Map the appliance data to include both user consumption (from sessionStorage) and average consumption (static)
    const data = Object.entries(individualApplianceEmissions).map(([appliance, userConsumption]) => ({
        appliance: appliance.charAt(0).toUpperCase() + appliance.slice(1).replace(/_/g, ' '), // Format appliance names
        userConsumption: parseFloat(userConsumption), // Convert string to float for user consumption
        avgConsumption: averageConsumptions[appliance.toLowerCase().replace(/\s+/g, '_')] || 0 // Default to 0 if no average value is found
    }));

    // Bar chart configuration for dynamic data
    var barChartConfig = {
        type: 'bar',
        data: {
            labels: data.map(d => d.appliance), // Appliance names
            datasets: [{
                label: 'Your Consumption (kWh)',
                backgroundColor: "rgba(117,193,129,0.8)",
                hoverBackgroundColor: "rgba(117,193,129,1)",
                data: data.map(d => d.userConsumption) // User consumption values
            }, {
                label: 'Average Consumption (kWh)',
                backgroundColor: "rgba(91,153,234,0.8)",
                hoverBackgroundColor: "rgba(91,153,234,1)",
                data: data.map(d => d.avgConsumption) // Average consumption values
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
                align: 'end',
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
                    label: function(tooltipItem, data) {
                        return tooltipItem.value + ' kWh';
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Energy Consumption (kWh)'
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                }]
            }
        }
    };

    // Load and generate the bar chart on page load
    var barChart = document.getElementById('grouped-bar-chart').getContext('2d');
    new Chart(barChart, barChartConfig);
}




// Pie Chart Demo

// Function to retrieve appliance emissions from session storage
function getApplianceEmissionsData() {
    const individualApplianceEmissions = JSON.parse(sessionStorage.getItem('individualApplianceEmissions') || '{}');
    const applianceData = Object.entries(individualApplianceEmissions).map(([appliance, emissions]) => ({
        appliance,
        emissions: parseFloat(emissions) // Ensure emissions are numbers
    }));
    return applianceData;
}

// Function to update the pie chart with dynamic data from session storage
function updatePieChart() {
    const applianceData = getApplianceEmissionsData();
    const labels = applianceData.map(item => item.appliance);
    const dataValues = applianceData.map(item => item.emissions);

    // Update the pie chart with dynamic data
    const ctx = document.getElementById('chart-pie').getContext('2d');
    window.myPie = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    window.chartColors.green,
                    window.chartColors.blue,
                    window.chartColors.gray,
                ],
                label: 'Emissions per Appliance (kg CO2)'
            }],
            labels: labels
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: 'bottom',
                align: 'center',
            },
            tooltips: {
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
                    label: function(tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce((prev, current) => prev + current, 0);
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return `${currentValue} kg CO2 (${percentage}%)`;
                    }
                }
            }
        }
    });
}

// Function to dynamically create a bar chart for the appliances
function createApplianceBarChart(data, selector, labelKey, valueKey, avgKey, userSelectedKey) {
    const userSelections = getUserSelections(); // Retrieve the user selections
    const appliance = userSelectedKey.split('.')[0]; // Get appliance name (e.g., 'television')
    const selectionKey = userSelectedKey.split('.')[1]; // Get selection key (e.g., 'screenTech')

    // Make sure userSelections contains the appliance and selection key
    const userSelectedValue = userSelections[appliance] ? userSelections[appliance][selectionKey] : '';

    console.log('User Selected Value for', userSelectedKey, ':', userSelectedValue); // Log for debugging

    const ctx = document.getElementById(selector).getContext('2d');
    const labels = data.map(item => item[labelKey]); // Get labels from chart data
    const avgConsumptionData = data.map(item => item[avgKey]); // Average data for comparison

    // Highlight only the user-selected value in the chart by changing the background color
    const backgroundColors = labels.map(label => label === userSelectedValue ? window.chartColors.green : 'rgba(91,153,234,0.8)');
    const borderColors = labels.map(label => label === userSelectedValue ? 'darkgreen' : 'transparent');
    const borderWidth = labels.map(label => label === userSelectedValue ? 2 : 0);

    // Bar chart configuration for dynamic data
    const barChartConfig = {
        type: 'bar',
        data: {
            labels: labels, // Appliance names (or sizes/types)
            datasets: [{
                label: 'Average Consumption (kWh)',
                backgroundColor: backgroundColors,  // Highlight selected in green, others in blue
                borderColor: borderColors, // Add darkgreen border to the selected one
                borderWidth: borderWidth, // Only show border for the selected one
                hoverBackgroundColor: backgroundColors,
                data: avgConsumptionData // Average consumption values
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                labels: {
                    generateLabels: function(chart) {
                        const datasets = chart.data.datasets;
                        return datasets.map((dataset, i) => ({
                            text: dataset.label,
                            fillStyle: window.chartColors.blue,
                            strokeStyle: window.chartColors.blue,
                            hidden: false,
                            lineCap: 'round',
                            lineDash: [],
                            lineDashOffset: 0,
                            lineJoin: 'round',
                            pointStyle: 'rect',
                            datasetIndex: i
                        }));
                    }
                },
                position: 'bottom',
                align: 'end',
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
                    label: function(tooltipItem, data) {
                        return `${tooltipItem.label}: ${tooltipItem.value} kWh`;
                    }
                }
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Energy Consumption (kWh)'
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                }]
            }
        }
    };

    new Chart(ctx, barChartConfig);
}


// Generate charts on load
window.addEventListener('load', function(){
    createApplianceBarChart(tvScreenTechData, 'tv-screen-tech-chart', 'screenTech', 'avgConsumption', 'avgConsumption', 'television.screenTech');
    createApplianceBarChart(tvScreenSizeData, 'tv-screen-size-chart', 'screenSize', 'avgConsumption', 'avgConsumption', 'television.screenSize');
    createApplianceBarChart(clothesDryerData, 'clothes-dryer-chart', 'dryerType', 'energyUsage', 'energyUsage', 'clothes_dryer.dryerType');
    createApplianceBarChart(refrigeratorData, 'refrigerator-chart', 'volume', 'avgUsage', 'avgUsage', 'refrigerator.volume');
    createApplianceBarChart(airConditionerData, 'air-conditioner-chart', 'type', 'energyUsage', 'energyUsage', 'air_conditioner.type');
    createApplianceBarChart(clothesWasherTypeData, 'clothes-washer-type-chart', 'loadType', 'energyUsage', 'energyUsage', 'clothes_washer.loadingType');

    createDynamicBarChart();  // The overall consumption comparison chart
    updatePieChart();  // Pie chart for emissions
    createClothesWasherLineChart();  // Line chart for clothes washer
});

	
