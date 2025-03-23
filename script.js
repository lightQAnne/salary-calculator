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
	const clearButton = document.getElementById("clearButton");

function getSelectedDayFromURL() {
        const params = new URLSearchParams(window.location.search);
        const day = params.get("day");
        return day ? parseInt(day) : null;
    }

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
        const totalGrossEarnings = earningsFromHours + tips;

        const totalNetEarnings = calculateNetEarnings(totalGrossEarnings);
        const netOrderEarnings = calculateNetEarnings(grossOrderEarnings);

        const fuelCost = kmPerDay * 0.42;
        const carIncome = netOrderEarnings - fuelCost;
        const totalExpenses = parking + fuelCost;
        const finalAmount = totalNetEarnings + carIncome;

        document.getElementById("gross_order_earnings").innerText = grossOrderEarnings.toFixed(2) + " PLN";
        document.getElementById("net_order_earnings").innerText = netOrderEarnings.toFixed(2) + " PLN";
        document.getElementById("total_gross").innerText = totalGrossEarnings.toFixed(2) + " PLN";
        document.getElementById("total_net").innerText = totalNetEarnings.toFixed(2) + " PLN";

        document.getElementById("fuel_cost").innerText = fuelCost.toFixed(2) + " PLN";
        document.getElementById("total_expenses").innerText = totalExpenses.toFixed(2) + " PLN";

        document.getElementById("car_income").innerText = carIncome.toFixed(2) + " PLN";
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

        const day = getSelectedDayFromURL() || new Date().getDate();

        const dayData = {
            workingHours: parseFloat(document.getElementById("working_hours").value) || 0,
            orders: parseFloat(document.getElementById("orders_count").value) || 0,
            tips: parseFloat(document.getElementById("tips").value) || 0,
            fuelCost: parseFloat(document.getElementById("fuel_cost").innerText) || 0,
            carIncome: parseFloat(document.getElementById("car_income").innerText) || 0,
            kilometers: parseFloat(document.getElementById("km_per_day").value) || 0,
            parking: parseFloat(document.getElementById("parking").value) || 0,
            finalAmount: parseFloat(document.getElementById("final_amount").innerText) || 0
        };

        try {
            await window.db.collection("monthData").doc(day.toString()).set(dayData);
            console.log("💾 Saving Day Data:", dayData);
            alert(`✅ Data for day ${day} saved successfully!`);

            await checkAndUpdateMonth();
            await recalculateMonthSummary(); 

        } catch (error) {
            console.error("❌ Error saving data to Firebase:", error);
            alert("Error saving data to Firebase.");
        }
    }

saveButton.addEventListener("click", saveDayData);

async function checkAndUpdateMonth() {
        if (!window.db) {
            console.error("❌ Firebase not initialized!");
            return;
        }

        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`;
        const monthRef = db.collection("monthSummary").doc("currentMonth");

        try {
            const doc = await monthRef.get();
            if (doc.exists) {
                const summary = doc.data();
                console.log("📊 Current stored month:", summary.month);

                if (!summary.month || summary.month !== currentMonth) {
                    // 1️⃣ Archive the old month
                    await db.collection("monthSummary").doc(summary.month).set(summary);
                    console.log(`📦 Archived month data: ${summary.month}`);

                    // 2️⃣ Create empty for the new month
                    await monthRef.set({
                        totalOrders: 0,
                        totalFuelCost: 0,
                        totalCarIncome: 0,
                        totalFinalAmount: 0,
                        totalKilometers: 0,
                        totalWorkingHours: 0,
                        tips: 0,
                        month: currentMonth
                    });
                    console.log(`🆕 Created new month: ${currentMonth}`);
                } 
            } 
            else {
                await monthRef.set({
                    totalOrders: 0,
                    totalFuelCost: 0,
                    totalCarIncome: 0,
                    totalFinalAmount: 0,
                    totalKilometers: 0,
                    totalWorkingHours: 0,
                    tips: 0,
                    month: currentMonth
                });
                console.log(`🆕 First-time summary created: ${currentMonth}`);
            }
        } catch (error) {
            console.error("❌ Error in checkAndUpdateMonth:", error);
        }
    }

async function recalculateMonthSummary() {
	if (!window.db) return;
    
        try {
            const snapshot = await db.collection("monthData").get();
    
            let summary = {
                totalOrders: 0,
                totalPaymentPerOrder: 0,
                totalFuelCost: 0,
                totalCarIncome: 0,
                totalFinalAmount: 0,
                totalKilometers: 0,
                totalWorkingHours: 0,
                tips: 0,
                month: new Date().toISOString().slice(0, 7)
            };
    
            snapshot.forEach(doc => {
                const data = doc.data();
                summary.totalOrders += data.orders || 0;
                summary.totalPaymentPerOrder += data.paymentPerOrder || 0;
                summary.totalFuelCost += data.fuelCost || 0;
                summary.totalCarIncome += data.carIncome || 0;
                summary.totalFinalAmount += data.finalAmount || 0;
                summary.totalKilometers += data.kilometers || 0;
                summary.totalWorkingHours += data.workingHours || 0;
                summary.tips += data.tips || 0;
            });
    
            await db.collection("monthSummary").doc("currentMonth").set(summary);
            console.log("♻️ Month summary recalculated:", summary);
        } catch (error) {
            console.error("❌ Error recalculating summary:", error);
        }
    }
    

    async function loadDayData(day) {
        if (!window.db || !day) return;

        try {
            const docRef = db.collection("monthData").doc(day.toString());
            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                console.log("📅 Loaded day data:", data);

                document.getElementById("orders_count").value = data.orders || "";
                document.getElementById("working_hours").value = data.workingHours || "";
                document.getElementById("km_per_day").value = data.kilometers || "";
                document.getElementById("tips").value = data.tips || "";
                document.getElementById("parking").value = data.parking || "";

                calculate();
            } else {
                console.log("🆕 No data for day:", day);
            }

        } catch (error) {
            console.error("❌ Error loading day data:", error);
        }
    }

    //clearDayData
    if (clearButton) {
        clearButton.addEventListener("click", async () => {
            const day = getSelectedDayFromURL();
            if (!day) {
                alert("⚠️ No day selected to clear.");
                return;
            }

            const confirmDelete = confirm(`Do you really want to delete data for Day ${day}?`);
            if (!confirmDelete) return;

            try {
                await db.collection("monthData").doc(day.toString()).delete();
                console.log(`🗑️ Data for Day ${day} deleted.`);

                document.getElementById("orders_count").value = "";
                document.getElementById("working_hours").value = "";
                document.getElementById("km_per_day").value = "";
                document.getElementById("tips").value = "";
                document.getElementById("parking").value = "";

                calculate();

                await recalculateMonthSummary();
                alert(`✅ Data for Day ${day} has been cleared.`);

            } catch (error) {
                console.error("❌ Error deleting day data:", error);
                alert("Error deleting data.");
            }
        });
    }

    async function recalculateMonthSummary() {
        if (!window.db) return;

        try {
            const snapshot = await db.collection("monthData").get();

            let summary = {
                totalOrders: 0,
                totalPaymentPerOrder: 0,
                totalFuelCost: 0,
                totalCarIncome: 0,
                totalFinalAmount: 0,
                totalKilometers: 0,
                totalWorkingHours: 0,
                tips: 0
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                summary.totalOrders += data.orders || 0;
                summary.totalPaymentPerOrder += data.paymentPerOrder || 0;
                summary.totalFuelCost += data.fuelCost || 0;
                summary.totalCarIncome += data.carIncome || 0;
                summary.totalFinalAmount += data.finalAmount || 0;
                summary.totalKilometers += data.kilometers || 0;
                summary.totalWorkingHours += data.workingHours || 0;
                summary.tips += data.tips || 0;
            });

            await db.collection("monthSummary").doc("currentMonth").set(summary);
            console.log("♻️ Month summary recalculated:", summary);
        } catch (error) {
            console.error("❌ Error recalculating summary:", error);
        }
    }

    // Flip Card
    const flipCard = document.querySelector(".flip-card");

    if (flipCard) {
        flipCard.addEventListener("click", () => {
            flipCard.classList.toggle("flipped");
        });

        setInterval(() => {
            if (!flipCard.classList.contains("flipped")) {
                flipCard.classList.add("hinting");

                setTimeout(() => {
                    flipCard.classList.remove("hinting");
                }, 500);
            }
        }, 8000);
    }

const selectedDay = getSelectedDayFromURL();
if (selectedDay) {
    loadDayData(selectedDay);

    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const title = `${selectedDay} ${monthName}`;
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = title;
}

});
