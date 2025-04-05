## 🗺️ Project Roadmap — Salary Tracker

A structured path for building and scaling a personal earnings & logistics tracker.

---

### 📄 Page: Day (`day.html`)

**Income Section:**
- [x] Create calculator for working hours and number of orders
- [x] Include tax deductions in calculations
- [x] Add hourly and order rates
- [x] Add input for tips
- [ ] Separate tips: app vs cash
- [x] Display gross and net income (flip card)

**Expenses Section:**
- [x] Add fuel cost (km-based)
- [x] Add parking input
- [x] Show total expenses and car income
- [ ] Refactor car income logic (modularize)

**Controls:**
- [x] Add Save button (connected to Firebase)
- [x] Add Clear button
- [ ] Improve validation: disallow negative, invalid input
- [ ] Add confirmation dialogs

**UI/UX:**
- [x] Page title with selected date

---

### 📅 Page: Month (`month.html`)

**Calendar View:**
- [x] Generate dynamic calendar grid
- [x] Highlight current day
- [x] Mark days with saved data (orange dot)
- [x] Navigate to `day.html` on cell click
- [x] Add dropdown to select any month (from 2025)

**Summary View:**
- [x] Load summary data from Firebase by selected month
- [x] Display: working hours, orders, tips, fuel, car income
- [ ] Add summary per category (e.g. tips app vs cash)

**URL Logic:**
- [x] Reflect selected month in URL
- [x] Load summary on URL change
- [ ] Support browser history navigation

---

### 🔁 Shared Logic

**Firebase:**
- [x] Setup Firestore structure
- [x] Save daily entries
- [x] Summarize month data (auto-recalculate)
- [x] Connect DB to UI

**Utilities & Code Structure:**
- [ ] Modularize helper functions
- [ ] Setup proper error handling
- [ ] Add ES6 module import/export
- [ ] Code cleanup: rename duplicate selectors/IDs
- [ ] Enforce formatting (Prettier, ESLint)

---

### 🧪 Testing & Stability

**Tests to add:**
- [ ] Write auto-tests in Python
- [ ] Validate tax logic and rounding
- [ ] Smoke test for saving/loading data
- [ ] Input edge cases (e.g. `10:30`, zero, NaN)

---

### 🎯 Advanced Features

**Possible Future Additions:**
- [ ] Allow configurable tax formulas per user
- [ ] Add server (Node.js?) to enable hosting and user accounts
- [ ] Support multi-language and currency
- [ ] PWA support (offline mode?)
- [ ] Highlight highest-earning days

---

### ✅ Progress Summary

- 🎯 Focus: UX, modular refactor, URL-driven logic


🧠 *This roadmap evolves as the project grows.*
