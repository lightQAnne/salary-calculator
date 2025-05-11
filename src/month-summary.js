document.addEventListener("DOMContentLoaded", () => {

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
    
            updateText("total_working_hours", summary.totalWorkingHours || 0, " h");
            updateText("total_orders", summary.totalOrders || 0);
            updateText("month_tips", (summary.tips || 0).toFixed(2), " PLN");
            updateText("total_fuel_cost", (summary.totalFuelCost || 0).toFixed(2), " PLN");
            updateText("total_car_income", (summary.totalCarIncome || 0).toFixed(2), " PLN");
            updateText("total_km", summary.totalKilometers || 0, " km");
            updateText("month_final_amount", (summary.totalFinalAmount || 0).toFixed(2), " PLN");
    
        } catch (error) {
            console.error(`❌ Failed to load summary for ${monthId}:`, error);
        }
    }
    
    // ==============================
    // 🚀 Initiates summary loading after DOM is ready
    // ==============================

    loadMonthSummary();

});