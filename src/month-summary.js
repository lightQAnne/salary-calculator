// ==============================
// 📦 Imports
// ==============================

import {
  updateText,
  updateCloseMonthButtonUI,
  clearMonthSummaryUI 
} from './shared/dom-utils.js';

import {
  getCurrentMonthId
} from './shared/utils.js';

import {
  calculateNetEarnings,
  getBonusLevel,
  calculateBonuses,
  calculateBonusPerOrder
} from './shared/calculations.js';

// ==============================
// 📊 Month Summary Logic
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 🔘 UI Element References
    // ==============================

    const closeMonthButton = document.getElementById("closeMonthButton");
    const monthSelector = document.getElementById("monthSelector");

    if (monthSelector) {
        monthSelector.addEventListener("change", () => {
            loadMonthSummary(monthSelector.value);
        });
    }

    if (closeMonthButton) closeMonthButton.addEventListener("click", closeMonth);

    // ==============================
    // 🔁 Firebase: Close Month
    // ==============================

    async function closeMonth() {
        const currentMonthId = monthSelector?.value || getCurrentMonthId();
        const monthRef = db.collection("monthSummary").doc(currentMonthId);;

        try {
            const doc = await monthRef.get();
            if (!doc.exists) return alert("❌ Month data not found.");

            const summary = doc.data();
            if (summary.closedAt) {
                alert("📦 This month has already been closed.");
                return;
            }

            const bonusPerOrder = await calculateBonusPerOrder(currentMonthId);
            const bonuses = calculateBonuses({ ...summary, bonusPerOrder });

            await monthRef.update({
                ...bonuses,
                closedAt: new Date().toISOString()
            });

            alert("✅ Month closed and bonuses saved.");
            loadMonthSummary(currentMonthId);

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
            if (doc.exists) {
            updateCloseMonthButtonUI(!!doc.data().closedAt);
            }

            if (!doc.exists) {
                clearMonthSummaryUI();
                return;
            }
    
            const summary = doc.data();

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

    // ==============================
    // 📅 Go to Today Button
    // ==============================
    const goToTodayButton = document.getElementById("goToToday");

    if (goToTodayButton) {
        goToTodayButton.addEventListener("click", () => {
            const today = new Date().toISOString().split("T")[0];
            window.location.href = `day.html?date=${today}`;
        });
    }

});