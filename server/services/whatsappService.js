export const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[MOCK WhatsApp] ${to}: ${message}`);
    return;
  }

  // Integrate Twilio or Meta API here for production usage.
  console.log(`[WhatsApp queued] ${to}: ${message}`);
};
