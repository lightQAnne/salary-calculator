function generateCalendar(year, month) {
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;

    let currentDate = 1;

    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");
        let rowHasContent = false;

        for (let day = 0; day < 7; day++) {
            const cell = document.createElement("td");

            if (week === 0 && day < startDay) {
                cell.innerText = "";
            } else if (currentDate > daysInMonth) {
                cell.innerText = "";
            } else {
                const dayNumber = currentDate;
                cell.innerText = dayNumber;
                cell.classList.add("calendar-day");
                cell.setAttribute("data-day", dayNumber);

                // go to index.html?day=N
                cell.addEventListener("click", () => {
                    window.location.href = `index.html?day=${dayNumber}`;
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
}

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

document.addEventListener("DOMContentLoaded", () => {
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

    drawCalendar();
});
