document.addEventListener('DOMContentLoaded', function() {
    // Replace this with actual data fetching logic
    const userData = {
        dishwasherUsage: 20, // times per week
        airConditionerUsage: 20, // hours per week
        refrigeratorUsage: 21, // hours per week (constant)
        washingMachineUsage: 20, // times per week
        publicTransportUsage: 1 // times per week
    };

    // Update Dishwasher Recommendation
    const dishwasherText = document.getElementById('dishwasher-text');
    if (userData.dishwasherUsage > 3) {
        dishwasherText.textContent = "Try to reduce the frequency of dishwasher usage to save energy.";
    } else {
        dishwasherText.textContent = "Your dishwasher usage is optimal, keep up the good work!";
    }

    // Update Air Conditioner Recommendation
    const airConditionerText = document.getElementById('air-conditioner-text');
    if (userData.airConditionerUsage > 5) {
        airConditionerText.textContent = "Consider using fans or natural ventilation to reduce air conditioner usage.";
    } else {
        airConditionerText.textContent = "Your air conditioner usage is within an energy-efficient range. Well done!";
    }

    // Update Refrigerator Recommendation
    const refrigeratorText = document.getElementById('refrigerator-text');
    if (userData.refrigeratorUsage > 20) {
        refrigeratorText.textContent = "Well done! Ensure your refrigerator is energy-efficient and running optimally.";
    } else {
        refrigeratorText.textContent = "Your refrigerator usage is typical. Consider upgrading to an energy-efficient model.";
    }

    // Update Washing Machine Recommendation
    const washingMachineText = document.getElementById('washing-machine-text');
    if (userData.washingMachineUsage > 2) {
        washingMachineText.textContent = "Try to wash larger loads less frequently to save water and energy.";
    } else {
        washingMachineText.textContent = "You're using your washing machine efficiently! Well done.";
    }

    // Update Public Transport Recommendation
    const publicTransportText = document.getElementById('public-transport-text');
    if (userData.publicTransportUsage < 3) {
        publicTransportText.textContent = "Consider using public transport more often to reduce your carbon footprint.";
    } else {
        publicTransportText.textContent = "Great job using public transport to reduce emissions!";
    }
});
