// ------------------------------------------
// 📊 Calculated Value Helpers
// ------------------------------------------

export function setCalculatedValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        const str = value.toFixed(2);
        el.dataset.value = str;
        el.innerText = `${str} PLN`;
    }
}

export function getCalculatedValue(id) {
    const el = document.getElementById(id);
    return el?.dataset.value ? parseFloat(el.dataset.value) || 0 : 0;
}

export const updateText = (id, value, unit = "") => {
    const el = document.getElementById(id);
    if (el) el.innerText = value + unit;
};

export const updateCloseMonthButtonUI = (isArchived) => {
    const closeMonthButton = document.getElementById("closeMonthButton");
    const closeMonthButtonIcon = closeMonthButton?.querySelector("i"); 
    if (!closeMonthButton || !closeMonthButtonIcon) return;

    if (isArchived) {
        closeMonthButton.classList.add("archived");
        closeMonthButtonIcon.classList.remove("fa-box-archive");
        closeMonthButtonIcon.classList.add("fa-circle-check");
        closeMonthButton.title = "Month is closed";
    } else {
        closeMonthButton.classList.remove("archived");
        closeMonthButtonIcon.classList.remove("fa-circle-check");
        closeMonthButtonIcon.classList.add("fa-box-archive");
        closeMonthButton.title = "Close month report";
    }
};

export const clearMonthSummaryUI = () => {
    updateText("total_working_hours", 0, " h");
    updateText("total_orders", 0);
    updateText("total_net_order_earnings", 0.00, " PLN");
    updateText("month_tips", 0.00, " PLN");
    updateText("total_fuel_cost", `–${0.00}`, " PLN");
    updateText("total_car_income", 0.00, " PLN");
    updateText("total_km", 0, " km");
    updateText("bonus_per_order", 0.00, " zł");
    updateText("washing_bonus", 0.00, " zł");
    updateText("phone_usage_bonus", 0.00, " zł");
    updateText("month_final_amount", 0.00, " PLN");
};