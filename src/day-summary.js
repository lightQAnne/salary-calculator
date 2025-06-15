// ==============================
// 📦 Imports
// ==============================

import { 
    DEFAULT_AVG_CONSUMPTION, 
    DEFAULT_HOURLY_RATE,
    ORDER_RATE
} from './shared/config.js';

import {
    parseNumeric,
    calculateNetEarnings,
    getFullDayId,
    validateNumericInput,
    getSelectedDateFromURL,
} from './shared/utils.js';

import {
    ensureMonthExists,
    recalculateMonthSummary
 
} from './shared/firebase-helpers.js';

import {
    setCalculatedValue,
    getCalculatedValue
} from './shared/dom-utils.js';

// ==============================
// 📄 Day Summary Logic
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 🧾 Element References & Events
    // ==============================

    const hourlyRateInput = document.getElementById("hourly_rate");
    const workingHoursInput = document.getElementById("working_hours");
    const ordersCountInput = document.getElementById("orders_count");
    const tipsInput = document.getElementById("tips");
    const kmPerDayInput = document.getElementById("km_per_day");
    const fuelPriceInput = document.getElementById("fuel_price");
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");

    if (clearButton) clearButton.addEventListener("click", clearDayData);
    if (saveButton) saveButton.addEventListener("click", saveDayData);
    
    [workingHoursInput, ordersCountInput, tipsInput, kmPerDayInput, fuelPriceInput]
    .forEach(input => input.addEventListener("keypress", validateNumericInput));

    document.addEventListener("input", calculate);

    // ==============================
    // 🧮 Earnings Calculation
    // ==============================

    function calculate() {
        const hourlyRate = parseFloat(hourlyRateInput.value) || DEFAULT_HOURLY_RATE;
        const workingHours = Math.max(parseNumeric(workingHoursInput.value), 0);
        const orderCount = Math.max(parseNumeric(ordersCountInput.value), 0);
        const tips = Math.max(parseNumeric(tipsInput.value), 0);
        const kmPerDay = Math.max(parseNumeric(kmPerDayInput.value), 0);

        // gross
        const dayHourlyGrossEarnings = workingHours * hourlyRate;
        const grossOrderEarnings = orderCount * ORDER_RATE;

        // net
        const dayHourlyNetEarnings = calculateNetEarnings(dayHourlyGrossEarnings);
        const netOrderEarnings = calculateNetEarnings(grossOrderEarnings);
        const netTipsApp = calculateNetEarnings(tips);

        // car
        const fuelPrice = parseNumeric(fuelPriceInput.value);
        const costPerKm = (fuelPrice * DEFAULT_AVG_CONSUMPTION) / 100;
        const fuelCost = kmPerDay * costPerKm;

        const carIncome = netOrderEarnings - fuelCost;
        const finalAmount = dayHourlyNetEarnings + netTipsApp;

        console.log("🧪 orderCount =", orderCount);
        console.log("🧪 grossOrderEarnings =", grossOrderEarnings);
        console.log("🧪 netOrderEarnings =", netOrderEarnings);

        setCalculatedValue("net_order_earnings", netOrderEarnings);
        setCalculatedValue("fuel_cost", fuelCost);
        setCalculatedValue("car_income", carIncome);
        setCalculatedValue("day_final_amount", finalAmount);
    }

    // ==============================
    // 🔁 Firebase: Save / Load / Clear
    // ==============================

    async function saveDayData() {
        if (!window.db) return alert("❌ Firebase not initialized!");
    
        const fullDayId = getFullDayId();
        const monthId = fullDayId.slice(0, 7);

        let workingHours = 0;
        const workingHoursRaw = workingHoursInput.value.trim();

        if (workingHoursRaw.includes(":")) {
            const [h, m] = workingHoursRaw.split(":").map(Number);
            workingHours = h + (m / 60);
        } else {
            workingHours = parseFloat(workingHoursRaw.replace(",", ".")) || 0;
        }


        workingHours = Math.max(workingHours, 0);
    
        const dayData = {
            workingHours,
            orders: parseFloat(ordersCountInput.value) || 0,
            tips: parseFloat(tipsInput.value) || 0,
            fuelPrice: parseNumeric(fuelPriceInput),
            fuelCost: getCalculatedValue("fuel_cost"),
            netOrderEarnings: getCalculatedValue("net_order_earnings"),
            carIncome: getCalculatedValue("car_income"),
            finalAmount: getCalculatedValue("day_final_amount"),
            kilometers: parseFloat(kmPerDayInput.value) || 0
        };
    
        try {
            await ensureMonthExists(monthId);
            
            const fuelPrice = parseNumeric(fuelPriceInput, null);
            if (fuelPrice !== null) {
                await db.collection("fuelHistory").doc(fullDayId).set({ price: fuelPrice });
            }

            await db.collection("monthData").doc(fullDayId).set(dayData);        
            console.log("💾 Saved:", fullDayId, dayData);
            alert(`✅ Data for ${fullDayId} saved!`);

            await recalculateMonthSummary(monthId);
        } catch (error) {
            console.error("❌ Error saving data:", error);
            alert("Error saving data to Firebase.");
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
                fuelPriceInput.value = data.fuelPrice?.toFixed(2) || "";

                setCalculatedValue("net_order_earnings", data.netOrderEarnings || 0);
                setCalculatedValue("fuel_cost", data.fuelCost || 0);
                setCalculatedValue("car_income", data.carIncome || 0);
                setCalculatedValue("day_final_amount", data.finalAmount || 0);

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

    // ==============================
    // 📅 Title & Fuel Data
    // ==============================

    const selectedDate = getSelectedDateFromURL();
    if (selectedDate) {
        loadDayData(selectedDate);
        loadFuelPriceForDate(selectedDate);

        const parts = selectedDate.split("-");
        const day = parts[2];
        const monthName = new Date(selectedDate).toLocaleString('default', { month: 'long' });

        const title = `Workday Report: ${day} ${monthName}`;
        const titleElement = document.getElementById("page-title");
        if (titleElement) titleElement.innerText = title;
    }

    async function loadFuelPriceForDate(dateStr) {
        if (!window.db || !dateStr) return;

        const snapshot = await db.collection("fuelHistory").get();
        const entries = [];

        snapshot.forEach(doc => {
            if (doc.exists) {
                entries.push({ date: doc.id, price: doc.data().price });
            }
        });

        entries.sort((a, b) => b.date.localeCompare(a.date));

            for (const entry of entries) {
                if (entry.date <= dateStr) {
                    const input = document.getElementById("fuel_price");
                    if (input && !input.value) {
                        input.value = entry.price.toFixed(2);

                        const tooltip = document.getElementById("fuel_price_tooltip");
                        const tooltipText = document.getElementById("fuel_price_tooltip_text");

                        if (tooltip && tooltipText) {
                            const parsedDate = new Date(entry.date);
                            const dateStr = parsedDate.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                            });
                            tooltipText.innerHTML = `Price auto-filled from: <br> ${dateStr}`;
                            tooltip.style.display = 'inline-block';
                        }
                    }
                    break;
                }
            }
    }

    calculate();
});