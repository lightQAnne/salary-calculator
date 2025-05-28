// ==========================================
// 🧰 Utility Functions for Salary Tracker
// ==========================================

// ------------------------------------------
// 🔢 Input & Parsing Utilities
// ------------------------------------------

/*
 * Parses numeric input, handles commas and fallback value.
 */
export function parseNumeric(value, fallback = 0) {
  const raw = typeof value === "string" ? value : value.value;
  const parsed = parseFloat(raw.replace(',', '.'));
  return isNaN(parsed) ? fallback : parsed;
}

/*
 * Restricts input to numeric characters and allowed control keys.
 */
export function validateNumericInput(event) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", ".", ","];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

// ------------------------------------------
// 💸 Financial Calculations
// ------------------------------------------

/*
 * Calculates net income after standard Polish deductions.
 */
export function calculateNetEarnings(grossEarnings) {
  const emerytalne = grossEarnings * 0.0976;
  const rentowe = grossEarnings * 0.015;
  const wypadkowe = grossEarnings * 0.0167;
  const zdrowotne = grossEarnings * 0.09;
  const chorobowe = grossEarnings * 0.0245;

  const totalDeductions = emerytalne + rentowe + wypadkowe + zdrowotne + chorobowe;
  return grossEarnings - totalDeductions;
}

// ------------------------------------------
// 📅 Date Helpers
// ------------------------------------------

/*
 * Returns 'date' param from URL in YYYY-MM format.
 * If not provided, defaults to current month (YYYY-MM).
 */
export function getMonthFromURL() {
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  return date || getCurrentMonthId();
}

/*
 * Returns current month in YYYY-MM format.
 */
export function getCurrentMonthId() {
  return new Date().toISOString().slice(0, 7);
}

/*
 * Formats a given year/month as YYYY-MM.
 */
export function getMonthValue(year, month) {
  return `${year}-${(month + 1).toString().padStart(2, "0")}`;
}

/*
 * Updates the browser URL with the selected month (YYYY-MM).
 */
export function updateURL(monthId) {
  const url = new URL(window.location);
  url.searchParams.set("date", monthId);
  window.history.replaceState({}, "", url);
}

/*
 * Returns 'date' param from URL in YYYY-MM-DD format.
 * Used on day.html. If not present, returns null.
 */
export function getSelectedDateFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("date") || null;
}

/*
 * Returns selected date from URL or today's date in YYYY-MM-DD format.
 */
export function getFullDayId() {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");

  if (dateParam) return dateParam;

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Returns full date string in YYYY-MM-DD format from year, month, day.
 */
export function createFullDayId(year, month, day) {
  return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

/*
 * Returns offset to align calendar start to Monday (0–6).
 */
export function getStartDayOffset(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

/*
 * Returns true if provided year/month is the current month.
 */
export function isCurrentMonth(year, month) {
  const today = new Date();
  return year === today.getFullYear() && month === today.getMonth();
}

// ------------------------------------------
// 🔁 Firebase Helpers
// ------------------------------------------

/*
 * Initializes a new document in `monthSummary` if it doesn't exist.
 */
export async function ensureMonthExists(monthId) {
  if (!window.db) return;

  const ref = db.collection("monthSummary").doc(monthId);
  const doc = await ref.get();

  if (!doc.exists) {
    await ref.set({
      totalOrders: 0,
      totalFuelCost: 0,
      totalCarIncome: 0,
      totalFinalAmount: 0,
      totalKilometers: 0,
      totalWorkingHours: 0,
      tips: 0,
      month: monthId,
    });
    console.log(`🆕 Initialized month: ${monthId}`);
  }
}

/*
 * Aggregates all day entries and updates the monthly summary.
 */
export async function recalculateMonthSummary(monthId = null) {
  if (!window.db) return;

  if (!monthId) {
    const date = new Date();
    monthId = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  }

  const prefix = `${monthId}-`;

  try {
    const snapshot = await db.collection("monthData").get();
    let summary = {
      totalOrders: 0,
      totalNetOrderEarnings: 0,
      totalFuelCost: 0,
      totalCarIncome: 0,
      totalFinalAmount: 0,
      totalKilometers: 0,
      totalWorkingHours: 0,
      tips: 0,
      month: monthId,
    };

    snapshot.docs.forEach((doc) => {
      if (doc.id.startsWith(prefix)) {
        const data = doc.data();
        summary.totalOrders += data.orders || 0;
        summary.totalNetOrderEarnings += data.netOrderEarnings || 0;
        summary.totalFuelCost += data.fuelCost || 0;
        summary.totalCarIncome += data.carIncome || 0;
        summary.totalFinalAmount += data.finalAmount || 0;
        summary.totalKilometers += data.kilometers || 0;
        summary.totalWorkingHours += data.workingHours || 0;
        summary.tips += data.tips || 0;
      }
    });

    await db.collection("monthSummary").doc(monthId).set(summary);
    console.log("♻️ Recalculated summary for:", monthId, summary);
  } catch (error) {
    console.error("❌ Error recalculating:", error);
  }
}

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
