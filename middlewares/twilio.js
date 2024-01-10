const { Sms } = require("twilio/lib/twiml/VoiceResponse");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

// Sent code to phoine
const sentOTP = async (phone) => {
  try {
    // console.log(phoneNumber);
    const result = client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Verify Code function
const verifyOTP = async (otp, phone) => {
  try {
    console.log("Type of", typeof otp);
    const result = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+91${phone}`, code: otp });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = {
  sentOTP,
  verifyOTP,
};
