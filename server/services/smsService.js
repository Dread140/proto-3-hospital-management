export const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[MOCK SMS] ${to}: ${message}`);
    return;
  }

  // Integrate Twilio client here for production usage.
  console.log(`[SMS queued] ${to}: ${message}`);
};
