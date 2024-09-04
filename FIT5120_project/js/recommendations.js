document.addEventListener('DOMContentLoaded', function() {
    // Fetch user data from the emissions calculator (this is just a placeholder, replace with actual logic)
    const userData = {
        dishwasherUsage: 3, // times per week
        airConditionerUsage: 5, // hours per day
        refrigeratorUsage: 24, // hours per day (constant)
        washingMachineUsage: 4, // times per week
        publicTransportUsage: 2 // times per week
    };

    // Update recommendations based on user data
    updateRecommendations(userData);
});

function updateRecommendations(userData) {
    // Dishwasher recommendation
    const dishwasherText = document.getElementById('dishwasher-text');
    if (userData.dishwasherUsage > 3) {
        dishwasherText.textContent = "Consider using the dishwasher less frequently or only with full loads to save energy.";
    } else {
        dishwasherText.textContent = "Your dishwasher usage is efficient. Keep up the good work!";
    }

    // Air conditioner recommendation
    const airConditionerText = document.getElementById('air-conditioner-text');
    if (userData.airConditionerUsage > 4) {
        airConditionerText.textContent = "Try to reduce air conditioner usage by opening windows or using fans.";
    } else {
        airConditionerText.textContent = "Your air conditioner usage is within the efficient range.";
    }

    // Refrigerator recommendation
    const refrigeratorText = document.getElementById('refrigerator-text');
    if (userData.refrigeratorUsage === 24) {
        refrigeratorText.textContent = "Ensure your refrigerator is energy-efficient and regularly maintained.";
    } else {
        refrigeratorText.textContent = "Your refrigerator usage seems typical. Consider upgrading to an energy-efficient model.";
    }

    // Washing machine recommendation
    const washingMachineText = document.getElementById('washing-machine-text');
    if (userData.washingMachineUsage > 3) {
        washingMachineText.textContent = "Consider washing clothes with full loads or using cold water to save energy.";
    } else {
        washingMachineText.textContent = "Your washing machine usage is efficient. Great job!";
    }

    // Public transport recommendation
    const publicTransportText = document.getElementById('public-transport-text');
    if (userData.publicTransportUsage < 3) {
        publicTransportText.textContent = "Using public transport more often can significantly reduce your carbon footprint.";
    } else {
        publicTransportText.textContent = "Great job using public transport! It’s an eco-friendly way to get around.";
    }
}
