document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user selections from localStorage or sessionStorage
    const solarPanels = localStorage.getItem('solarPanels');
    const appliances = JSON.parse(localStorage.getItem('applianceData'));
    const transport = JSON.parse(localStorage.getItem('transportationData'));

    // Based on the answers, show targeted recommendations
    if (solarPanels === 'yes') {
        document.getElementById('solar-recommendation').style.display = 'block';
    }

    if (appliances.includes('refrigerator')) {
        document.getElementById('refrigerator-recommendation').style.display = 'block';
    }

    if (transport.some(t => t.transport_type === 'private-vehicle')) {
        document.getElementById('transport-recommendation').style.display = 'block';
    }
});
