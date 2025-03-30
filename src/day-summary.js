// ==============================
// 📄 Day Summary Logic
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 🔢 Form elements
    // ==============================

    const hourlyRateInput = document.getElementById("hourly_rate");
    const orderRateInput = document.getElementById("order_rate");
    const workingHoursInput = document.getElementById("working_hours");
    const ordersCountInput = document.getElementById("orders_count");
    const tipsInput = document.getElementById("tips");
    const kmPerDayInput = document.getElementById("km_per_day");
    const parkingInput = document.getElementById("parking");
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");

    if (clearButton) clearButton.addEventListener("click", clearDayData);
    if (saveButton) saveButton.addEventListener("click", saveDayData);
    
    // ==============================
    // ✅ Input validation
    // ==============================

    const validateNumericInput = (event) => {
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", ".", ","];
        if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    [workingHoursInput, ordersCountInput, tipsInput, kmPerDayInput, parkingInput].forEach(input => {
        input.addEventListener("keypress", validateNumericInput);
    });

    // ==============================
    // 🧮 Calculations
    // ==============================

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

        const totalDeductions = emerytalne + rentowe + wypadkowe + zdrowotne + chorobowe;
        return grossEarnings - totalDeductions;
    }

    document.addEventListener("input", calculate);
    calculate();

    // ==============================
    // 🔁 Firebase: Save, Load, Clear
    // ==============================

    function getFullDayId() {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get("date");
        if (dateParam) return dateParam;
    
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    async function saveDayData() {
        if (!window.db) return alert("❌ Firebase not initialized!");
    
        const fullDayId = getFullDayId();
        const monthId = fullDayId.slice(0, 7);
    
        const dayData = {
            workingHours: parseFloat(workingHoursInput.value) || 0,
            orders: parseFloat(ordersCountInput.value) || 0,
            tips: parseFloat(tipsInput.value) || 0,
            fuelCost: parseFloat(document.getElementById("fuel_cost").innerText) || 0,
            carIncome: parseFloat(document.getElementById("car_income").innerText) || 0,
            kilometers: parseFloat(kmPerDayInput.value) || 0,
            parking: parseFloat(parkingInput.value) || 0,
            finalAmount: parseFloat(document.getElementById("final_amount").innerText) || 0
        };
    
        try {
            await ensureMonthExists(monthId);
            await db.collection("monthData").doc(fullDayId).set(dayData);
            console.log("💾 Saved:", fullDayId, dayData);
            alert(`✅ Data for ${fullDayId} saved!`);
            await recalculateMonthSummary(monthId);
        } catch (error) {
            console.error("❌ Error saving data:", error);
            alert("Error saving data to Firebase.");
        }
    }

    async function ensureMonthExists(monthId) {
        if (!window.db) return;
    
        const ref = db.collection("monthSummary").doc(monthId);
        const doc = await ref.get();
    
        if (!doc.exists) {
            await ref.set({
                totalOrders: 0,
                totalPaymentPerOrder: 0,
                totalFuelCost: 0,
                totalCarIncome: 0,
                totalFinalAmount: 0,
                totalKilometers: 0,
                totalWorkingHours: 0,
                tips: 0,
                month: monthId
            });
            console.log(`🆕 Initialized month: ${monthId}`);
        }
    }

    async function loadDayData(date) {
        if (!window.db || !date) return;
    
        try {
            const docRef = db.collection("monthData").doc(date);
            const doc = await docRef.get();
    
            if (doc.exists) {
                const data = doc.data();
                console.log("📅 Loaded:", date, data);
    
                ordersCountInput.value = data.orders || "";
                workingHoursInput.value = data.workingHours || "";
                kmPerDayInput.value = data.kilometers || "";
                tipsInput.value = data.tips || "";
                parkingInput.value = data.parking || "";
    
                calculate();
            } else {
                console.log("🆕 No data for:", date);
            }
            
        } catch (error) {
            console.error("❌ Error loading data:", error);
        }
    }

    async function clearDayData() {
        const fullDayId = getFullDayId();
        const monthId = fullDayId.slice(0, 7);
        if (!window.db) return;
    
        const confirmDelete = confirm(`Delete data for ${fullDayId}?`);
        if (!confirmDelete) return;
    
        try {
            await db.collection("monthData").doc(fullDayId).delete();
            console.log(`🗑️ Deleted: ${fullDayId}`);
    
            ordersCountInput.value = "";
            workingHoursInput.value = "";
            kmPerDayInput.value = "";
            tipsInput.value = "";
            parkingInput.value = "";
            calculate();
    
            await recalculateMonthSummary(monthId);
            alert(`✅ Data for ${fullDayId} cleared.`);
        } catch (error) {
            console.error("❌ Error deleting data:", error);
            alert("Error deleting data.");
        }
    }

    async function recalculateMonthSummary(monthId = null) {
        if (!window.db) return;
    
        if (!monthId) {
            const date = new Date();
            monthId = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        }
    
        const prefix = `${monthId}-`;
    
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
                month: monthId
            };
    
            snapshot.docs.forEach(doc => {
                if (doc.id.startsWith(prefix)) {
                    const data = doc.data();
                    summary.totalOrders += data.orders || 0;
                    summary.totalPaymentPerOrder += data.paymentPerOrder || 0;
                    summary.totalFuelCost += data.fuelCost || 0;
                    summary.totalCarIncome += data.carIncome || 0;
                    summary.totalFinalAmount += data.finalAmount || 0;
                    summary.totalKilometers += data.kilometers || 0;
                    summary.totalWorkingHours += data.workingHours || 0;
                    summary.tips += data.tips || 0;
                }
            });
    
            await db.collection("monthSummary").doc(monthId).set(summary);
            console.log("♻️ Recalculated summary for:", monthId, summary);
        } catch (error) {
            console.error("❌ Error recalculating:", error);
        }
    }    

    // ==============================
    // 🎴 Flip Card Animation
    // ==============================

    const flipCard = document.querySelector(".flip-card");

    if (flipCard) {
        flipCard.addEventListener("click", () => {
            flipCard.classList.toggle("flipped");
        });

        setInterval(() => {
            if (!flipCard.classList.contains("flipped")) {
                flipCard.classList.add("hinting");
                setTimeout(() => flipCard.classList.remove("hinting"), 500);
            }
        }, 8000);
    }

    // ==============================
    // 🗓️ Title Initialization
    // ==============================
    
    const getSelectedDateFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("date") || null;
    };

    const selectedDate = getSelectedDateFromURL();
    if (selectedDate) {
        loadDayData(selectedDate); //load from Firebase;

        const parts = selectedDate.split("-");
        const day = parts[2];
        const monthName = new Date(selectedDate).toLocaleString('default', { month: 'long' });

        const title = `Workday Report: ${day} ${monthName}`;
        const titleElement = document.getElementById("page-title");
        if (titleElement) titleElement.innerText = title;
    }

});