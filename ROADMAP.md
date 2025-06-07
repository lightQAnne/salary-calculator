## 🗺️ Project Roadmap — Salary Tracker

A structured path for building and scaling a personal earnings & logistics tracker.

---

### 📄 Page: Day (`day.html`)

**Income Section:**
- [x] Calculator for working hours and number of orders
- [x] Tax deductions included
- [x] Hourly and per-order rates
- [x] Input for tips (net)
- [ ] Separate tips: app vs cash
- [x] Display of gross and net income
- [x] Accept time input like `10:30` for hours

**Expenses Section:**
- [x] Fuel cost (based on km × avg consumption × zł/l)
- [x] Auto-fill fuel price from history
- [x] Parking input (deprecated for now)
- [x] Display total expenses and car income
- [ ] Refactor car income logic into shared module

**Controls:**
- [x] Save data to Firebase (with recalculation of month)
- [x] Clear data with confirmation dialog
- [x] Validate numeric inputs
- [ ] Show warning on invalid/negative entries

**UI/UX:**
- [x] Dynamic title: "Workday Report: DD Month"
- [x] Inputs with tooltips
- [x] Smart autofill for fuel
- [x] Clean card-style layout

---

### 📅 Page: Month (`month.html`)

**Calendar View:**
- [x] Dynamic calendar grid
- [x] Highlight current day
- [x] Mark saved days with orange dot
- [x] Click to go to `day.html?date=YYYY-MM-DD`
- [x] Dropdown to select any month from 2025
- [ ] Double marker for days that helped cross bonus tier

**Summary View:**
- [x] Display hours, orders, tips, fuel, kilometers
- [x] Car income and total netto summary
- [x] Bonuses: per order, phone usage, washing
- [x] Accurate rounding and net conversion

**URL Logic:**
- [x] Sync selected month to URL
- [x] Load summary when URL changes
- [ ] Full browser navigation history support

---

### 🔁 Shared Logic & Utilities

**Firebase:**
- [x] Setup Firestore collections: `monthData`, `monthSummary`, `fuelHistory`
- [x] Anonymous auth & real-time connection
- [x] Auto-recalculate month on save/clear
- [x] Store fuel price per day

**Code Architecture:**
- [x] Shared `utils.js` with net/tax/date helpers
- [x] ES6 modules: `import/export`
- [ ] Full modularity (bonus logic, car logic)
- [ ] Error handling for fetch failures

---

### 🧪 Testing & Stability

**To Add:**
- [ ] Unit tests for net/tax logic
- [ ] Regression test for monthly totals
- [ ] Smoke test: save → reload → match
- [ ] Edge cases: zero, invalid, `10:30`, `NaN`

---

### 🎯 Advanced Features (Backlog)

**Ideas for the future:**
- [ ] Configurable tax model (per user or role)
- [ ] User accounts, hosted backend (Node.js?)
- [ ] Highlight top-earning days visually
- [ ] Mobile-friendly layout

---

### 👤 Profile Settings (planned)

**Configuration Page:**
- [ ] Choose transport type: Car / Bicycle
- [ ] Select fuel type: Petrol / Diesel / Gas / Hybrid / Electric
- [ ] Set default fuel consumption (L/100km)
- [ ] Input engine volume (optional)
- [ ] Toggle bonuses: washing / phone / per-order
- [ ] Save settings to local storage or Firestore
- [ ] Auto-use profile settings in day calculations

### ✅ Progress Summary

- 🎯 Focus: UX polish, modular logic, calendar-state syncing  
- 🚀 Up next: error handling, Profile Settings page

🧠 *This roadmap evolves with every sprint.*
