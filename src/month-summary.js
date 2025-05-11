document.addEventListener("DOMContentLoaded", () => {

    
    // ==============================
    // 🔢 Form elements
    // ==============================

    const closeMonthButton = document.getElementById("closeMonthButton");

    if (closeMonthButton) closeMonthButton.addEventListener("click", closeMonth);

    // ==============================
    // 🧮 Calculations
    // ==============================

    function calculateBonuses(summary) {
        const hours = summary.totalWorkingHours || 0;
        const bonusPerOrder = summary.bonusPerOrder || 0;
        const laundryBonus = +(hours * 0.10).toFixed(2);
        const phoneBonus = hours >= 40 ? 25.00 : +(hours * 0.62).toFixed(2);
        const totalBonus = +(laundryBonus + phoneBonus + bonusPerOrder).toFixed(2);

        return { laundryBonus, phoneBonus, bonusPerOrder, totalBonus };
    }

    async function closeMonth() {
        const monthId = getCurrentMonthId();
        const monthRef = db.collection("monthSummary").doc(monthId);

        try {
            const doc = await monthRef.get();
            if (!doc.exists) return alert("❌ Month data not found.");

            const summary = doc.data();
            if (summary.closedAt) {
                return alert("📦 This month has already been closed.");
            }

            const bonuses = calculateBonuses(summary);

            await monthRef.update({
                ...bonuses,
                closedAt: new Date().toISOString()
            });

            alert("✅ Month closed and bonuses saved.");
            loadMonthSummary();

        } catch (err) {
            console.error("❌ Error closing month:", err);
            alert("Error occurred. Check console.");
        }
    }

    // ==============================
    // 🔁 Fetches and updates monthly summary data from Firebase
    // ==============================

    function getCurrentMonthId() {
        return new Date().toISOString().slice(0, 7);
    }

    window.loadMonthSummary = async function (monthId = null) {
        if (!window.db) return console.error("❌ Firebase not initialized!");
    
        if (!monthId) monthId = getCurrentMonthId();
        const monthRef = db.collection("monthSummary").doc(monthId);
    
        try {
            const doc = await monthRef.get();
            if (!doc.exists) return;
    
            const summary = doc.data();
    
            const updateText = (id, value, unit = "") => {
                const el = document.getElementById(id);
                if (el) el.innerText = value + unit;
            };
    
            // 💡 Calculate or use saved bonuses
            const bonuses = summary.laundryBonus !== undefined
                ? {
                    laundryBonus: summary.laundryBonus,
                    phoneBonus: summary.phoneBonus,
                    bonusPerOrder: summary.bonusPerOrder,
                }
                : calculateBonuses(summary);

            updateText("total_working_hours", summary.totalWorkingHours || 0, " h");
            updateText("total_orders", summary.totalOrders || 0);
            updateText("month_tips", (summary.tips || 0).toFixed(2), " PLN");
            updateText("total_fuel_cost", (summary.totalFuelCost || 0).toFixed(2), " PLN");
            updateText("total_car_income", (summary.totalCarIncome || 0).toFixed(2), " PLN");
            updateText("total_km", summary.totalKilometers || 0, " km");

            const baseFinalAmount = summary.totalFinalAmount || 0;
            const adjustedFinalAmount = (baseFinalAmount + bonuses.totalBonus).toFixed(2);
            updateText("month_final_amount", adjustedFinalAmount, " PLN");

            updateText("washing_bonus", bonuses.laundryBonus.toFixed(2), " zł");
            updateText("phone_usage_bonus", bonuses.phoneBonus.toFixed(2), " zł");
            updateText("bonus_per_order", bonuses.bonusPerOrder.toFixed(2), " zł");
    
        } catch (error) {
            console.error(`❌ Failed to load summary for ${monthId}:`, error);
        }
    }
    
    // ==============================
    // 🚀 Initiates summary loading after DOM is ready
    // ==============================

    loadMonthSummary();

});