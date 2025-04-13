// ==============================
// 📄 Day Summary Logic
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 🔢 Form elements
    // ==============================

    const hourlyRateInput = document.getElementById("hourly_rate");
    const workingHoursInput = document.getElementById("working_hours");
    const ordersCountInput = document.getElementById("orders_count");
    const tipsInput = document.getElementById("tips");
    const kmPerDayInput = document.getElementById("km_per_day");
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

    [workingHoursInput, ordersCountInput, tipsInput, kmPerDayInput].forEach(input => {
        input.addEventListener("keypress", validateNumericInput);
    });

    // ==============================
    // 🧮 Calculations
    // ==============================

    function calculate() {
        const hourlyRate = parseFloat(hourlyRateInput.value) || 30.50;
        const orderRate = 5.50; // Static rate
        const workingHours = Math.max(parseFloat(workingHoursInput.value.replace(',', '.')) || 0, 0);
        const orderCount = Math.max(parseFloat(ordersCountInput.value) || 0, 0);
        const tips = Math.max(parseFloat(tipsInput.value.replace(',', '.')) || 0, 0);
        const kmPerDay = Math.max(parseFloat(kmPerDayInput.value) || 0, 0);;

        // gross
        const dayHourlyGrossEarnings = workingHours * hourlyRate;
        const grossOrderEarnings = orderCount * orderRate;

        // net
        const dayHourlyNetEarnings = calculateNetEarnings(dayHourlyGrossEarnings);
        const netOrderEarnings = calculateNetEarnings(grossOrderEarnings);
        const netTipsApp = calculateNetEarnings(tips);

        // car
        const fuelCost = kmPerDay * 0.42;
        const carIncome = netOrderEarnings - fuelCost;

        const finalAmount = dayHourlyNetEarnings + netTipsApp;

        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value.toFixed(2) + " PLN";
        };
    
        setText("net_order_earnings", netOrderEarnings);
        setText("fuel_cost", fuelCost);
        setText("car_income", carIncome);
        setText("day_final_amount", finalAmount);
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

        const workingHoursRaw = workingHoursInput.value.trim();
        let workingHours = 0;

        if (workingHoursRaw.includes(":")){
            const [h, m] = workingHoursRaw.split(":").map(Number);
            workingHours = h + (m / 60);
        } else {
            workingHours = parseFloat(workingHoursRaw.replace(',', '.')) || 0;
        }

        workingHours = Math.max(workingHours, 0);
    
        const getValue = (id) => {
            const el = document.getElementById(id);
            return el ? parseFloat(el.innerText) || 0 : 0;
        };
    
        const dayData = {
            workingHours: workingHours,
            orders: parseFloat(ordersCountInput.value) || 0,
            tips: parseFloat(tipsInput.value) || 0,
            fuelCost: getValue("fuel_cost"),
            carIncome: getValue("car_income"),
            kilometers: parseFloat(kmPerDayInput.value) || 0,
            finalAmount: getValue("day_final_amount")
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