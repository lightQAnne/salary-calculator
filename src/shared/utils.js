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
