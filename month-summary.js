document.addEventListener("DOMContentLoaded", () => {
    loadMonthSummary("currentMonth");

   const selector = document.getElementById("monthSelector");
    if (selector) {
        selector.addEventListener("change", () => {
            const selectedMonth = selector.value;
            loadMonthSummary(selectedMonth);
        });
    }
});

async function loadMonthSummary(monthId = "currentMonth") {
    if (!window.db) {
        console.error("❌ Firebase not initialized!");
        return;
    }

    console.log(`🔄 Loading summary for: ${monthId}`);

    const monthRef = db.collection("monthSummary").doc(monthId);

    try {
        const doc = await monthRef.get();
        if (!doc.exists) {
            console.log(`ℹ️ No summary data found for: ${monthId}`);
            return;
        }

        const summary = doc.data();

        const updateText = (id, value, unit = "") => {
            const el = document.getElementById(id);
            if (el) el.innerText = value + unit;
        };

        updateText("total_working_hours", summary.totalWorkingHours || 0, " h");
        updateText("total_orders", summary.totalOrders || 0);
        updateText("total_fuel_cost", (summary.totalFuelCost || 0).toFixed(2), " PLN");
        updateText("total_car_income", (summary.totalCarIncome || 0).toFixed(2), " PLN");
        updateText("total_km", summary.totalKilometers || 0, " km");
        updateText("total_final", (summary.totalFinalAmount || 0).toFixed(2), " PLN");

        console.log(`✅ Loaded summary for: ${monthId}`);
    } catch (error) {
        console.error("❌ Error loading summary:", error);
    }
}
