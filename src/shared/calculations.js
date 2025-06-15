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
