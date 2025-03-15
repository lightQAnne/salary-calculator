document.addEventListener("DOMContentLoaded", () => {
//get all the elements of the form
    const hourlyRateInput = document.getElementById("hourly_rate");
    const orderRateInput = document.getElementById("order_rate");
    const workingHoursInput = document.getElementById("working_hours");
    const ordersCountInput = document.getElementById("orders_count");
    const tipsInput = document.getElementById("tips");
    const kmPerDayInput = document.getElementById("km_per_day");
    const parkingInput = document.getElementById("parking");
    const saveButton = document.getElementById("saveButton");

//input validation
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
    const totalGrossEarnings = earningsFromHours + grossOrderEarnings + tips;

    const totalNetEarnings = calculateNetEarnings(totalGrossEarnings);
    const netOrderEarnings = calculateNetEarnings(grossOrderEarnings);

    const fuelCost = kmPerDay * 0.42;
    const carIncome = netOrderEarnings - fuelCost;
    const totalExpenses = parking + fuelCost;
    const finalAmount = totalNetEarnings - totalExpenses;

    document.getElementById("gross_order_earnings").innerText = grossOrderEarnings.toFixed(2) + " PLN";
	document.getElementById("net_order_earnings").innerText = netOrderEarnings.toFixed(2) + " PLN";
    document.getElementById("fuel_cost").innerText = fuelCost.toFixed(2) + " PLN";
    document.getElementById("car_income").innerText = carIncome.toFixed(2) + " PLN";
    document.getElementById("total_gross").innerText = totalGrossEarnings.toFixed(2) + " PLN";
    document.getElementById("total_net").innerText = totalNetEarnings.toFixed(2) + " PLN";
    document.getElementById("total_expenses").innerText = totalExpenses.toFixed(2) + " PLN";
    document.getElementById("final_amount").innerText = finalAmount.toFixed(2) + " PLN";
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
	calculate();

// 	Firebase
    async function saveDayData() {
        if (!window.db) {
            console.error("❌ Firebase not initialized!");
            alert("Error saving data to Firebase.");
            return;
        }
        
        const today = new Date().getDate().toString();
        const dayData = {
            orders: parseFloat(ordersCountInput.value) || 0,
            tips: parseFloat(tipsInput.value) || 0,
            carIncome: parseFloat(document.getElementById("car_income").innerText) || 0,
            finalAmount: parseFloat(document.getElementById("final_amount").innerText) || 0
        };
        
        try {
            await window.db.collection("monthData").doc(today).set(dayData);
            alert(`✅ Data for day ${today} saved successfully!`);
        } catch (error) {
            console.error("❌ Error saving data to Firebase:", error);
            alert("Error saving data to Firebase.");
        }
    }

	saveButton.addEventListener("click", saveDayData);

    async function loadMonthData() {
        try {
            const snapshot = await db.collection("monthData").get();
            snapshot.forEach((doc) => {
                console.log(`Day ${doc.id}:`, doc.data());
            });
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }
	
	loadMonthData();
	
// Flip Card
    const flipCard = document.querySelector(".flip-card");

    if (flipCard) {
        // Flip on click
        flipCard.addEventListener("click", () => {
            flipCard.classList.toggle("flipped");
        });

        // Micro-animation of tilt once every 5 seconds
        setInterval(() => {
            if (!flipCard.classList.contains("flipped")) { 
                flipCard.classList.add("hinting");

                setTimeout(() => {
                    flipCard.classList.remove("hinting");
                }, 500);
            }
        }, 8000);
    }
});
