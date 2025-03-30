document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 📅 Parses month (YYYY-MM) from the "date" URL parameter
    // ==============================
    
    function getMonthFromURL() {
        const params = new URLSearchParams(window.location.search);
        const date = params.get("date");
        if (!date) return null;
    
        return date.slice(0, 7);
    }
    
    // ==============================
    // 🔁 Fetches and updates monthly summary data from Firebase
    // ==============================

    async function loadMonthSummary() {
        if (!window.db) {
            console.error("❌ Firebase not initialized!");
            return;
        }
    
        const monthId = getMonthFromURL() || new Date().toISOString().slice(0, 7);
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
            console.error(`❌ Failed to load summary for ${monthId}:`, error);
        }
    }
    
    // ==============================
    // 🚀 Initiates summary loading after DOM is ready
    // ==============================

    loadMonthSummary();

});
