// ==============================
// 📦 Imports
// ==============================

import {
  getMonthFromURL,
  updateURL,
  getMonthValue,
  createFullDayId,
  getStartDayOffset,
  isCurrentMonth
} from './shared/utils.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 📌 Mark days with data
    // ==============================
    
    async function markDaysWithData(year, month) {
        if (!window.db) return;
    
        const prefix = `${year}-${(month + 1).toString().padStart(2, "0")}-`;
        const snapshot = await db.collection("monthData").get();
    
        snapshot.forEach(doc => {
            if (doc.id.startsWith(prefix)) {
                const day = parseInt(doc.id.slice(-2)); // e.g. "2025-03-22" → 22
                const cell = document.querySelector(`.calendar-day[data-day="${day}"]`);
                if (cell) {
                    cell.classList.add("has-data");
                }
            }
        });
    }

    // ==============================
    // 📆 Calendar generation
    // ==============================

    function createCalendarCell({ day, isToday, fullDayId }) {
        const cell = document.createElement("td");
    
        if (!day) {
            cell.innerText = "";
            return cell;
        }
    
        const span = document.createElement("span");
        span.innerText = day;
        cell.appendChild(span);

        cell.classList.add("calendar-day");
        cell.setAttribute("data-day", day);
        
        if (isToday) {
            span.classList.add("today");
        }
    
        cell.addEventListener("click", () => {
            window.location.href = `day.html?date=${fullDayId}`;
        });
    
        return cell;
    }
    
    function generateCalendar(year, month) {
        const calendarBody = document.getElementById("calendar-body");
        calendarBody.innerHTML = "";
    
        const today = new Date();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = getStartDayOffset(year, month);
    
        let currentDate = 1;
    
        for (let week = 0; week < 6; week++) {
            const row = document.createElement("tr");
            let rowHasContent = false;
    
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                let cell;
    
                if ((week === 0 && dayIndex < startDay) || currentDate > daysInMonth) {
                    cell = createCalendarCell({ day: null });
                } else {
                    const fullDayId = createFullDayId(year, month, currentDate);
                    const isToday =
                        isCurrentMonth(year, month) &&
                        currentDate === today.getDate();
    
                    cell = createCalendarCell({
                        day: currentDate,
                        isToday,
                        fullDayId
                    });
    
                    currentDate++;
                    rowHasContent = true;
                }
    
                row.appendChild(cell);
            }
    
            if (rowHasContent) {
                calendarBody.appendChild(row);
            }
        }
    
        markDaysWithData(year, month);
    }    

    // ==============================
    // 📅 Month selector
    // ==============================

    function createMonthOption(value, label) {
        const option = document.createElement("option");
        option.value = value;
        option.innerText = label;
        return option;
    }
    
    function populateMonthSelector() {
        const selector = document.getElementById("monthSelector");
        if (!selector) return;
    
        const startYear = 2025;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-based (0 = Jan)
    
        for (let year = startYear; year <= currentYear; year++) {
            const maxMonth = (year === currentYear) ? currentMonth : 11;
    
            for (let month = 0; month <= maxMonth; month++) {
                const value = getMonthValue(year, month);
                const label = value;
                selector.appendChild(createMonthOption(value, label));
            }
        }

        selector.value = getMonthFromURL();
    }    

    // ==============================
    // 🧭 Calendar Initialization
    // ==============================

    populateMonthSelector();

    const selector = document.getElementById("monthSelector");

    // Returns the selected month ID in format YYYY-MM
    function getSelectedMonthId() {
    return selector.value;
    }
    
    // Draws calendar for the selected month
    function updateCalendar() {
        const monthId = getSelectedMonthId();
        const [year, month] = monthId.split("-").map(Number);
        generateCalendar(year, month - 1);
    }
    
    // Redraws calendar and updates summary
    function updateMonthView() {
        updatePageTitleFromMonthId(selector.value);
        const monthId = getSelectedMonthId();
        updateCalendar();
    
        if (typeof loadMonthSummary === "function") {
            loadMonthSummary(monthId);
        }

        updateURL(monthId);
    }
    
    const initialMonth = getMonthFromURL();
    selector.value = initialMonth;
    updateMonthView();

    selector.addEventListener("change", updateMonthView);

    function updatePageTitleFromMonthId(monthId) {
        const [year, month] = monthId.split("-");
        const monthName = new Date(`${monthId}-01`).toLocaleString("en", { month: "long" });
        const titleEl = document.getElementById("page-title");
        if (titleEl) titleEl.innerText = `Income · ${monthName} ${year}`;
    }

});