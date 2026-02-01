// src/utils/mockPayment.js

/**
 * Simulates an online payment (Card / UPI)
 * Used ONLY for testing / UG project
 */
export const mockOnlinePayment = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ✅ change this to test failure scenarios
      const success = true; // or Math.random() > 0.3

      if (success) {
        resolve({
          status: "paid",
          transactionId: "MOCK_TXN_" + Date.now(),
        });
      } else {
        reject({
          status: "failed",
          message: "Mock payment failed",
        });
      }
    }, 1500); // simulate network delay
  });
};
