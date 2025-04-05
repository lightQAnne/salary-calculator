document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================
    // 📅 Utilities
    // ==============================

    function getCurrentMonthId() {
        return new Date().toISOString().slice(0, 7);
    }

    function getMonthFromURL() {
        const params = new URLSearchParams(window.location.search);
        const date = params.get("date");
        return date || getCurrentMonthId();
    }

    function updateURL(monthId) {
        const url = new URL(window.location);
        url.searchParams.set("date", monthId);
        window.history.replaceState({}, "", url);
    }
    
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
    
        cell.innerText = day;
        cell.classList.add("calendar-day");
        cell.setAttribute("data-day", day);
        
        if (isToday) {
            cell.classList.add("today");
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
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    
        let currentDate = 1;
    
        for (let week = 0; week < 6; week++) {
            const row = document.createElement("tr");
            let rowHasContent = false;
    
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                let cell;
    
                if ((week === 0 && dayIndex < startDay) || currentDate > daysInMonth) {
                    cell = createCalendarCell({ day: null });
                } else {
                    const fullDayId = `${year}-${(month + 1).toString().padStart(2, "0")}-${currentDate.toString().padStart(2, "0")}`;
                    const isToday = isCurrentMonth && currentDate === today.getDate();
    
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

    function getMonthValue(year, month) {
        return `${year}-${(month + 1).toString().padStart(2, "0")}`;
    }
    
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
        const currentMonth = now.getMonth();
    
        selector.appendChild(createMonthOption("currentMonth", "Current Month"));
    
        for (let year = startYear; year <= currentYear; year++) {
            const maxMonth = (year === currentYear) ? currentMonth : 11;
    
            for (let month = 0; month <= maxMonth; month++) {
                const value = getMonthValue(year, month);
                const label = `${value} — ${new Date(year, month).toLocaleString("en", { month: "long" })}`;
                selector.appendChild(createMonthOption(value, label));
            }
        }
    }    

    // ==============================
    // 🧭 Calendar Initialization
    // ==============================

    populateMonthSelector();

    const selector = document.getElementById("monthSelector");

    // Returns the selected month ID in format YYYY-MM
    function getSelectedMonthId() {
        const selected = selector.value;
        return selected === "currentMonth"
            ? getCurrentMonthId()
            : selected;
    }
    
    // Draws calendar for the selected month
    function updateCalendar() {
        const monthId = getSelectedMonthId();
        const [year, month] = monthId.split("-").map(Number);
        generateCalendar(year, month - 1);
    }
    
    // Redraws calendar and updates summary
    function updateMonthView() {
        const monthId = getSelectedMonthId();
        updateCalendar();
    
        if (typeof loadMonthSummary === "function") {
            loadMonthSummary(monthId);
        }

        updateURL(monthId);
    }
    
    const initialMonth = getMonthFromURL();
    selector.value = initialMonth === getCurrentMonthId()
        ? "currentMonth"
        : initialMonth;

    updateMonthView();

    selector.addEventListener("change", updateMonthView);

});