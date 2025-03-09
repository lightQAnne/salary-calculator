document.addEventListener("DOMContentLoaded", () => {
    const hourlyRateInput = document.getElementById("hourly_rate");
    const orderRateInput = document.getElementById("order_rate");
    const workingHoursInput = document.getElementById("working_hours");
    const ordersCountInput = document.getElementById("orders_count");
    const tipsInput = document.getElementById("tips");
    const kmPerDayInput = document.getElementById("km_per_day");
    const parkingInput = document.getElementById("parking");
    const saveButton = document.getElementById("saveButton");

function validateNumericInput(event) {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", ".", ","];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
 }

[workingHoursInput, ordersCountInput, tipsInput, kmPerDayInput, parkingInput].forEach(input => {
        input.addEventListener("keypress", validateNumericInput);
});

function calculate() {
    const hourlyRate = parseFloat(hourlyRateInput.value) || 30.50;
    const orderRate = parseFloat(orderRateInput.value) || 5.50;
    const workingHours = Math.max(parseFloat(workingHoursInput.value.replace(',', '.')) || 0, 0);
    const orderCount = Math.max(parseFloat(ordersCountInput.value) || 0, 0);
    const tips = Math.max(parseFloat(tipsInput.value.replace(',', '.')) || 0, 0);
    const kmPerDay = Math.max(parseFloat(kmPerDayInput.value) || 0, 0);
    const parking = Math.max(parseFloat(parkingInput.value) || 0, 0);

    const earningsFromHours = workingHours * hourlyRate;
    const grossOrderEarnings = orderCount * orderRate;
    const totalGrossEarnings = earningsFromHours + tips + grossOrderEarnings;

    const totalNetEarnings = calculateNetEarnings(totalGrossEarnings);
    const netOrderEarnings = calculateNetEarnings(grossOrderEarnings);

    const fuelCost = kmPerDay * 0.42;
    const carIncome = netOrderEarnings - fuelCost;
    const totalExpenses = parking + fuelCost;
    const finalAmount = totalNetEarnings - totalExpenses;

    document.getElementById("hourly_wage").innerText = earningsFromHours.toFixed(2) + " PLN";
    document.getElementById("gross_order_earnings").innerText = grossOrderEarnings.toFixed(2) + " PLN";
    document.getElementById("fuel_cost").innerText = fuelCost.toFixed(2) + " PLN";
    document.getElementById("car_income").innerText = carIncome.toFixed(2) + " PLN";
    document.getElementById("total_gross").innerText = totalGrossEarnings.toFixed(2) + " PLN";
    document.getElementById("total_net").innerText = totalNetEarnings.toFixed(2) + " PLN";
    document.getElementById("total_expenses").innerText = totalExpenses.toFixed(2) + " PLN";
    document.getElementById("final_amount").innerText = finalAmount.toFixed(2) + " PLN";
    document.getElementById("net_order_earnings").innerText = netOrderEarnings.toFixed(2) + " PLN";
}

function calculateNetEarnings(grossEarnings) {
    const emerytalne = grossEarnings * 0.0976; // 9.76%
    const rentowe = grossEarnings * 0.015; // 1.5%
    const wypadkowe = grossEarnings * 0.0167; // 1.67%
    const zdrowotne = grossEarnings * 0.09; // 9%
    const chorobowe = grossEarnings * 0.0245; // 2.45% 

    const totalDeductions = emerytalne + rentowe + wypadkowe + zdrowotne;
    return grossEarnings - totalDeductions;
}

document.addEventListener("input", calculate);
