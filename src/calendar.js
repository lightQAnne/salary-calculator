document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 📌 Mark days that contain saved data
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
    // 📆 Generate visual calendar
    // ==============================

    function generateCalendar(year, month) {
        const calendarBody = document.getElementById("calendar-body");
        calendarBody.innerHTML = "";
    
        const today = new Date();
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1);
        const startDay = (firstDay.getDay() + 6) % 7; // Monday start
    
        let currentDate = 1;
    
        for (let week = 0; week < 6; week++) {
            const row = document.createElement("tr");
            let rowHasContent = false;
    
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement("td");
    
                if (week === 0 && day < startDay || currentDate > daysInMonth) {
                    cell.innerText = "";
                } else {
                    const dayNumber = currentDate;
                    const dayStr = dayNumber.toString().padStart(2, "0");
                    const monthStr = (month + 1).toString().padStart(2, "0");
                    const fullDayId = `${year}-${monthStr}-${dayStr}`;

                    cell.innerText = dayNumber;
                    cell.classList.add("calendar-day");
                    cell.setAttribute("data-day", dayNumber);
    
                    
                    // ➡️ Navigate to selected day
                    cell.addEventListener("click", () => {
                        window.location.href = `day.html?date=${fullDayId}`;
                    });
    
                    if (isCurrentMonth && dayNumber === today.getDate()) {
                        cell.classList.add("today");
                    }
    
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
    // 📅 Fill the month dropdown
    // ==============================

    function populateMonthSelector() {
        const selector = document.getElementById("monthSelector");
        if (!selector) return;
    
        const startYear = 2025;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
    
        const currentOption = document.createElement("option");
        currentOption.value = "currentMonth";
        currentOption.innerText = "Current Month";
        selector.appendChild(currentOption);
    
        for (let year = startYear; year <= currentYear; year++) {
            const maxMonth = (year === currentYear) ? currentMonth : 11;
    
            for (let month = 0; month <= maxMonth; month++) {
                const value = `${year}-${(month + 1).toString().padStart(2, "0")}`;
                const option = document.createElement("option");
                option.value = value;
                option.innerText = `${value} — ${new Date(year, month).toLocaleString("en", { month: "long" })}`;
                selector.appendChild(option);
            }
        }
    
        selector.value = "currentMonth";
    }

    // ==============================
    // 🧭 Calendar Init
    // ==============================

    populateMonthSelector();

    const selector = document.getElementById("monthSelector");
    const now = new Date();

    const drawCalendar = () => {
        const selected = selector.value;

        if (selected === "currentMonth") {
            generateCalendar(now.getFullYear(), now.getMonth());
        } else {
            const [year, month] = selected.split("-").map(Number);
            generateCalendar(year, month - 1);
        }
    };

    selector.addEventListener("change", drawCalendar);
    drawCalendar(); // initial load

});