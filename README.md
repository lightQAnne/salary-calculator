# 🧮 Salary Tracker

A personal calculator and calendar to track income, hours worked, deliveries, car expenses, and tips — all stored with Firebase.

---

## 🚀 Features

- 📆 Dynamic calendar with per-day tracking
- 🧾 Breakdown of earnings: hours, orders, tips (gross/net)
- ⛽ Fuel cost calculation based on distance and price per liter
- 🚗 Car income logic (net order income minus fuel)
- 📊 Monthly summaries with auto-recalculation
- 🎁 Bonuses based on order count, washing, phone usage
- 🔄 Firebase Firestore integration with monthly aggregation
- ✍️ Fully editable inputs with save/clear/reset
- 🌍 URL-linked navigation with state persistence
- 🧠 Smart tip: auto-fill fuel price from latest known
- 🔧 Modular utility functions and shared logic

---

## 📁 Project Structure

| File                 | Purpose                                           |
|----------------------|--------------------------------------------------|
| `day.html`           | Daily input UI                                   |
| `month.html`         | Monthly calendar and summary overview            |
| `calendar.js`        | Generates calendar grid + month selection logic  |
| `day-summary.js`     | Calculates daily earnings and saves to Firebase  |
| `month-summary.js`   | Loads monthly data and calculates bonuses        |
| `firebase-config.js` | Firebase and Firestore setup (excluded via `.gitignore`) |
| `utils.js`           | Shared utility functions                         |
| `styles.css`         | Global styles, section theming, and layout       |

---

## 🛣️ Development Roadmap

Check out the full roadmap:  
[🗺️ View Project Roadmap](./ROADMAP.md)

---

## 📸 Screenshots

_(Screenshots coming soon)_

---

## 📦 Tech Stack

- HTML, CSS, Vanilla JavaScript (ES6 modules)
- Firebase (Firestore, Auth)
- Visual Studio Code

---

## 🤓 Author

Built with care by **Anna Ilchenko** — QA & Dev with a love for clean UI and logic-based tools.

---

## 📝 License

This project is private and personal. For educational purposes only.
