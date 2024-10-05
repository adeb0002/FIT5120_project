'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#75c181',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};

// Function to retrieve emissions data
function getEmissionsData() {
    let categoryData = [
        { category: 'Electricity', emissions: parseFloat(sessionStorage.getItem('applianceEmissions') || 0) },
        { category: 'Transport', emissions: parseFloat(sessionStorage.getItem('transportEmissions') || 0) },
        { category: 'Gas', emissions: parseFloat(sessionStorage.getItem('gasEmissions') || 0) }
    ];

    // Filter out categories with zero emissions
    categoryData = categoryData.filter(item => item.emissions > 0);

    return categoryData;
}

// Prepare data for the line chart
function prepareChartData() {
    const emissionsData = getEmissionsData();
    const labels = emissionsData.map(item => item.category); // x-axis categories
    const data = emissionsData.map(item => item.emissions);  // y-axis emissions

    return {
        labels: labels,
        datasets: [{
            label: 'Emissions per Category (kg CO2)',
            fill: false,
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            data: data // Emissions data
        }]
    };
}


// Line chart configuration
var lineChartConfig = {
    type: 'line',
    data: prepareChartData(),
    options: {
        responsive: true,
        aspectRatio: 1.5,
        legend: {
            display: true,
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
                label: function (tooltipItem, data) {
                    return tooltipItem.value + ' kg CO2';
                }
            },
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
                scaleLabel: {
                    display: false,
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    drawBorder: false,
                    color: window.chartColors.border,
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    userCallback: function (value, index, values) {
                        return value + ' kg CO2';
                    }
                },
            }]
        }
    }
};


// Function to retrieve transport emissions data from session storage
function getTransportEmissionsData() {
	// Retrieve transport emissions from session storage
	const transportData = JSON.parse(sessionStorage.getItem('transportationData') || '{}');

	// Map the transport data to an array suitable for the bar chart
	const formattedData = Object.entries(transportData).map(([type, emissions]) => ({
		type: type.replace('_', ' '), // Replace underscores with spaces for readability
		emissions: parseFloat(emissions) // Convert emissions to a number
	}));

	return formattedData;
}

// Prepare data for the transport emissions bar chart
function prepareTransportChartData() {
	const transportData = getTransportEmissionsData();

	const labels = transportData.map(item => item.type); // x-axis: transportation types
	const data = transportData.map(item => item.emissions); // y-axis: emissions

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

// Bar chart configuration for transport emissions
var barChartConfig = {
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
window.addEventListener('load', function(){
	
	var lineChart = document.getElementById('canvas-linechart').getContext('2d');
    window.myLine = new Chart(lineChart, lineChartConfig);
	
	var barChart = document.getElementById('canvas-barchart').getContext('2d');
	window.myBar = new Chart(barChart, barChartConfig);
	

});	
	
