// ==============================
// ⚙️ App Configuration Constants
// ==============================

// 🚗 Vehicle
export const DEFAULT_AVG_CONSUMPTION = 7.0; // liters per 100km

// 💰 Earnings
export const ORDER_RATE = 5.5;              // income per order (PLN)
export const DEFAULT_HOURLY_RATE = 30.5;    // default gross hourly rate (PLN)

// 📊 Tax deductions based on Polish system
export const TAX_RATES = {
    pension: 0.0976,      // emerytalne
    disability: 0.015,    // rentowe
    accident: 0.0167,     // wypadkowe
    health: 0.09,         // zdrowotne
    sickness: 0.0245      // chorobowe
};

// 🎁 Bonus tiers
export const BONUS_TIERS = [
  { threshold: 50, weekday: 0, weekend: 0 },
  { threshold: 125, weekday: 1, weekend: 1 },
  { threshold: 250, weekday: 1, weekend: 2 },
  { threshold: 400, weekday: 1.5, weekend: 3 },
  { threshold: 550, weekday: 2, weekend: 4 },
  { threshold: Infinity, weekday: 2.5, weekend: 5 }
];

// export const SETTINGS_COLLECTION = "userSettings"; //TODO: will be implemented soon
