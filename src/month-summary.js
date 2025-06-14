// ==============================
// 📦 Imports
// ==============================

import {
  getCurrentMonthId
} from './shared/utils.js';

import {
  calculateNetEarnings,
  getBonusLevel
} from './shared/calculations.js';

// ==============================
// 📊 Month Summary Logic
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 🔘 UI Element References
    // ==============================

    const closeMonthButton = document.getElementById("closeMonthButton");
    if (closeMonthButton) closeMonthButton.addEventListener("click", closeMonth);

    // ==============================
    //  🧮 Bonus Calculation Logic
    // ==============================

    async function calculateBonusPerOrder(monthId) {
        const prefix = `${monthId}-`;
        const snapshot = await db.collection("monthData").get();

        let monThuOrders = 0;
        let friSunOrders = 0;

        snapshot.docs.forEach(doc => {
            if (doc.id.startsWith(prefix)) {
                const data = doc.data();
                const dayOfWeek = new Date(doc.id).getDay(); // 0=Sun, 1=Mon...
                const orders = data.orders || 0;

                if (dayOfWeek >= 1 && dayOfWeek <= 4) {
                    monThuOrders += orders;
                } else {
                    friSunOrders += orders;
                }
            }
        });

        const totalOrders = monThuOrders + friSunOrders;
        const bonusLevel = getBonusLevel(totalOrders);

        const monThuBonus = monThuOrders * bonusLevel.weekday;
        const friSunBonus = friSunOrders * bonusLevel.weekend;
        const totalBonus = +(monThuBonus + friSunBonus).toFixed(2);

        console.log("📦 Bonus Order Breakdown:");
        console.log(`➡️  Mon–Thu: ${monThuOrders} × ${bonusLevel.weekday} = ${monThuBonus}`);
        console.log(`➡️  Fri–Sun: ${friSunOrders} × ${bonusLevel.weekend} = ${friSunBonus}`);
        
        return totalBonus;
    }

    function calculateBonuses(summary) {
        const hours = summary.totalWorkingHours || 0;
        const bonusPerOrder = summary.bonusPerOrder || 0;
        const laundryBonus = +(hours * 0.10).toFixed(2);
        const phoneBonus = hours >= 40 ? 25.00 : +(hours * 0.62).toFixed(2);

        return {
        bonusPerOrder: calculateNetEarnings(bonusPerOrder),
        laundryBonus: calculateNetEarnings(laundryBonus),
        phoneBonus: calculateNetEarnings(phoneBonus)
        };
    }

    // ==============================
    // 🔁 Firebase: Close Month
    // ==============================

    async function closeMonth() {
        const selector = document.getElementById("monthSelector");
        const monthId = selector?.value || getCurrentMonthId();

        const monthRef = db.collection("monthSummary").doc(monthId);

        try {
            const doc = await monthRef.get();
            if (!doc.exists) return alert("❌ Month data not found.");

            const summary = doc.data();
            if (summary.closedAt) {
                return alert("📦 This month has already been closed.");
            }

            const bonusPerOrder = await calculateBonusPerOrder(monthId);
            const bonuses = calculateBonuses({ ...summary, bonusPerOrder });

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
    // 📊 Load Month Summary to UI
    // ==============================

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
            let bonuses = {
                bonusPerOrder: 0,
                laundryBonus: 0,
                phoneBonus: 0
                };

                if (summary.closedAt) {
                    bonuses.bonusPerOrder = summary.bonusPerOrder || 0;
                    bonuses.laundryBonus = summary.laundryBonus || 0;
                    bonuses.phoneBonus = summary.phoneBonus || 0;
                } else {
                    const liveBonusPerOrder = await calculateBonusPerOrder(monthId);
                    bonuses = calculateBonuses({
                        ...summary,
                        bonusPerOrder: liveBonusPerOrder
                    });
            }

            const bruttoTips = summary.tips || 0;
            const nettoTips = calculateNetEarnings(bruttoTips);

            updateText("total_working_hours", summary.totalWorkingHours || 0, " h");
            updateText("total_orders", summary.totalOrders || 0);
            updateText("total_net_order_earnings", (summary.totalNetOrderEarnings || 0).toFixed(2), " PLN");
            updateText("month_tips", nettoTips.toFixed(2), " PLN");
            updateText("total_fuel_cost", `–${(summary.totalFuelCost || 0).toFixed(2)}`, " PLN");
            updateText("total_car_income", (summary.totalCarIncome || 0).toFixed(2), " PLN");
            updateText("total_km", summary.totalKilometers || 0, " km");

            updateText("bonus_per_order", bonuses.bonusPerOrder.toFixed(2), " zł");
            updateText("washing_bonus", bonuses.laundryBonus.toFixed(2), " zł");
            updateText("phone_usage_bonus", bonuses.phoneBonus.toFixed(2), " zł");

            const baseFinal = summary.totalFinalAmount || 0;
            const totalBonuses = bonuses.bonusPerOrder + bonuses.laundryBonus + bonuses.phoneBonus;

            const adjustedFinalAmount = (baseFinal + totalBonuses).toFixed(2);
            updateText("month_final_amount", adjustedFinalAmount, " PLN");
        
        } catch (error) {
            console.error(`❌ Failed to load summary for ${monthId}:`, error);
        }
    }
    
    // ==============================
    // 🚀 Init on Load
    // ==============================

    loadMonthSummary();
});