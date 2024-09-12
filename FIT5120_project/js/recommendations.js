document.addEventListener('DOMContentLoaded', function () {
    // going to have to have some sort of storage system to get the results for each calculator question
    // replace x with what storage system
    const solarOption = x.getItem('solarOption'); // Solar energy option
    const gasWaterHeater = x.getItem('gasWaterHeater'); // Gas water heater option
    const selectedAppliance = x.getItem('selectedAppliance'); // Selected appliance type
    const carDistance = parseFloat(x.getItem('totalDistance_car')) || 0;
    const busDistance = parseFloat(x.getItem('totalDistance_bus')) || 0;
    const trainDistance = parseFloat(x.getItem('totalDistance_train')) || 0;
    const tramDistance = parseFloat(x.getItem('totalDistance_tram')) || 0;

    const recommendationsContainer = document.getElementById('recommendations');
    let recommendationsHTML = '<h2>Your Personalized Recommendations</h2>';

    // Basic emission reduction suggestions
    recommendationsHTML += '<p>Here are some ways to reduce your carbon emissions based on your inputs:</p>';

    // Solar Option
    if (solarOption === 'yes') {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Optimize Your Solar Energy Usage</h3>
                <p>It looks like you're using solar energy. To maximise its benefits, ensure your solar panels are clean and positioned to get optimal sunlight year-round.</p>
                <p>Also, try to utalise your solar energy in the to daytime reduce reliance on the grid and save money on electricity bills..</p>
            </div>
        `;
    }
    if (solarOption === 'no') {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Consider Switching to Solar Energy</h3>
                <p>It looks like you haven't installed solar energy yet. Solar panels can significantly reduce your carbon footprint and energy bills by harnessing renewable energy from the sun.</p>
                <p>Consider installing solar panels to cut down on your electricity costs and reduce your household emissions.</p>
            </div>
        `;
    }
    

    // Gas Water Heater Recommendations
    if (gasWaterHeater === 'yes') {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Upgrade Your Water Heater</h3>
                <p>Since you have a gas water heater, switching to a more efficient gas model or even an electric heat pump could drastically reduce your emissions.</p>
                <p>Alternatively, consider adding a solar water heater to reduce gas consumption.</p>
            </div>
        `;
    }
    if (gasWaterHeater === 'no') {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Consider Upgrading to a Gas or Solar Water Heater</h3>
                <p>It looks like you don't have a gas water heater. Switching to an energy-efficient gas water heater or an electric heat pump can significantly lower your energy usage and emissions.</p>
                <p>An electric heat pump can be especially cost-effective, as it uses electricity more efficiently to heat water, saving you money on your energy bills.</p>
            </div>
        `;
    }

    // Appliance Selection Recommendations
    if (selectedAppliance) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Upgrade Your ${selectedAppliance}</h3>
                <p>Upgrading your ${selectedAppliance} to an energy-efficient model can save both emissions and costs. Look for models with high energy star ratings.</p>
            </div>
        `;
    }

    // Transportation Recommendations
    if (carDistance > 50) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Reduce Car Usage</h3>
                <p>You travel ${carDistance} km by car per week. Consider carpooling, using public transport, or switching to an electric vehicle to reduce your carbon footprint.</p>
            </div>
        `;
    }

    if (busDistance > 50) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Optimize Bus Travel</h3>
                <p>You currently travel ${busDistance} km by bus per week.</p>
                <p>Bus travel is more efficient than cars, but you can still reduce emissions by opting for bus routes that use low-emission or electric buses when available.</p>
            </div>
        `;
    }

    if (trainDistance > 50) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Train Travel Efficiency</h3>
                <p>You travel ${trainDistance} km per week by train.</p>
                <p>Train travel is one of the most efficient public transport modes. Keep using trains where possible to minimise emissions.</p>
            </div>
        `;
    }

    if (tramDistance > 50) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Efficient Tram Usage</h3>
                <p>Trams are electric and have a smaller carbon footprint than cars or buses. You travel ${tramDistance} km per week by tram. Keep using trams where possible, especially during off-peak hours to avoid congestion and energy emissions.</p>
            </div>
        `;
    }

    // If no transportation mode is selected
    if (carDistance === 0 && busDistance === 0 && trainDistance === 0 && tramDistance === 0) {
        recommendationsHTML += `
            <div class="recommendation">
                <h3>Consider Your Transportation Options</h3>
                <p>You haven't recorded any transport distances. Choosing public transportation or switching to cycling or walking for shorter trips can significantly reduce your carbon emissions.</p>
            </div>
        `;
    }

    // Add the recommendations to the container
    recommendationsContainer.innerHTML = recommendationsHTML;
});
