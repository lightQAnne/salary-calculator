import { TAX_RATES, BONUS_TIERS } from './config.js';

// ------------------------------------------
// 💸 Financial Calculations
// ------------------------------------------

/*
 * Calculates net income after standard Polish deductions.
 */

export function calculateNetEarnings(gross) {
  return Object.values(TAX_RATES)
    .reduce((acc, rate) => acc - gross * rate, gross);
}

export function getBonusLevel(orderCount) {
  for (const tier of BONUS_TIERS) {
    if (orderCount < tier.threshold) {
      return tier;
    }
  }
  return BONUS_TIERS[BONUS_TIERS.length - 1];
}

export async function calculateBonusPerOrder(monthId) {
    const prefix = `${monthId}-`;
    const snapshot = await db.collection("monthData").get();

    let monThuOrders = 0;
    let friSunOrders = 0;

    snapshot.docs.forEach(doc => {
        if (doc.id.startsWith(prefix)) {
            const data = doc.data();
            const dayOfWeek = new Date(doc.id).getDay(); // 0=Sun, 1=Mon...
            const orders = data.orders || 0;

            if (dayOfWeek >= 1 && dayOfWeek <= 4) {
                monThuOrders += orders;
            } else {
                friSunOrders += orders;
            }
        }
    });

    const totalOrders = monThuOrders + friSunOrders;
    const bonusLevel = getBonusLevel(totalOrders);

    const monThuBonus = monThuOrders * bonusLevel.weekday;
    const friSunBonus = friSunOrders * bonusLevel.weekend;
    const totalBonus = +(monThuBonus + friSunBonus).toFixed(2);
    console.log("📦 Bonus Order Breakdown:");
    console.log(`➡️  Mon–Thu: ${monThuOrders} × ${bonusLevel.weekday} = ${monThuBonus}`);
    console.log(`➡️  Fri–Sun: ${friSunOrders} × ${bonusLevel.weekend} = ${friSunBonus}`);
    return totalBonus;
}

export function calculateBonuses(summary) {
    const hours = summary.totalWorkingHours || 0;
    const bonusPerOrder = summary.bonusPerOrder || 0;
    const laundryBonus = +(hours * 0.10).toFixed(2);
    const phoneBonus = hours >= 40 ? 25.00 : +(hours * 0.62).toFixed(2);

    return {
        bonusPerOrder: calculateNetEarnings(bonusPerOrder),
        laundryBonus: calculateNetEarnings(laundryBonus),
        phoneBonus: calculateNetEarnings(phoneBonus)
    };
}
