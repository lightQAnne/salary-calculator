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
      totalNetOrderEarnings: 0,
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
  const date = new Date();
  if (!monthId)
    monthId = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
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