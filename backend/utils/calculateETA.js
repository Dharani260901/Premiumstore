export const calculateETA = (paymentMethod) => {
  // 1️⃣ Base days
  let etaDays = 3;

  if (paymentMethod === "COD") {
    etaDays = 5;
  }

  // 2️⃣ Controlled variance: -1, 0, +1
  const variance = Math.floor(Math.random() * 3) - 1;
  let finalDays = etaDays + variance;

  // 3️⃣ Clamp values (safety)
  if (paymentMethod === "ONLINE") {
    finalDays = Math.min(Math.max(finalDays, 2), 4);
  } else {
    finalDays = Math.min(Math.max(finalDays, 4), 6);
  }

  // 4️⃣ Set ETA date (6 PM end of day)
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + finalDays);
  etaDate.setHours(18, 0, 0, 0);

  return {
    etaDate,
    etaDays: finalDays,
  };
};
