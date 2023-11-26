const
const accountSid = "AC2a3ec1005ab6c0be48faeb35f66aa2f3";
const authToken = "f7e625be97faca6c0cab087f4d97de37";
const verifySid = "VA0c1fad06a350fa452ef889cb85b6b6d0";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+919400822788", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+919400822788", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });