function calculate() 
{
	let workingHours = Math.max(parseFloat(document.getElementById("working_hours").value.replace(',', '.')) || 0, 0);
	let orderCount = Math.max(parseFloat(document.getElementById("orders_count").value) || 0, 0);
	let tips = Math.max(parseFloat(document.getElementById("tips").value) || 0, 0);
	let hourlyRate = parseFloat(document.getElementById("hourly_rate").value) || 30.50;
	let orderRate = parseFloat(document.getElementById("order_rate").value) || 5.50;
	let kmPerDay = Math.max(parseFloat(document.getElementById("km_per_day").value) || 0, 0);
	let parking = Math.max(parseFloat(document.getElementById("parking").value) || 0, 0);
	let foodExpenses = Math.max(parseFloat(document.getElementById("food_expenses").value) || 0, 0);

	let earningsFromHours = workingHours * hourlyRate;
	let grossOrderEarnings = orderCount * orderRate;
	let netOrderEarnings = grossOrderEarnings * 0.91; // 9% health insurance deduction
	let costPerKm = kmPerDay * 0.42;
	let carIncome = netOrderEarnings - costPerKm;
	let totalGrossEarnings = earningsFromHours + tips + grossOrderEarnings;
	let healthInsurance = totalGrossEarnings * 0.09; // 9% health insurance deduction
	let totalNetEarnings = totalGrossEarnings - healthInsurance;
	let totalExpenses = parking + foodExpenses + costPerKm;
	let finalAmount = totalNetEarnings - totalExpenses;

	document.getElementById("hourly_wage").innerText = earningsFromHours.toFixed(2) + " PLN";
	document.getElementById("gross_order_earnings").innerText = grossOrderEarnings.toFixed(2) + " PLN";
	document.getElementById("car_income").innerText = carIncome.toFixed(2) + " PLN";
	document.getElementById("total_gross").innerText = totalGrossEarnings.toFixed(2) + " PLN";
	document.getElementById("total_net").innerText = totalNetEarnings.toFixed(2) + " PLN";
	document.getElementById("total_expenses").innerText = totalExpenses.toFixed(2) + " PLN";
	document.getElementById("final_amount").innerText = finalAmount.toFixed(2) + " PLN";
}

	document.addEventListener("input", calculate);
