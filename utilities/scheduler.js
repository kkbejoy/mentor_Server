const schedule = require("node-schedule");
const {
  enrolmentExpiredArray,
  checkAndUpdateEnrolmentStatus,
} = require("./enrollmentUtilities");
const { sentMail } = require("../middlewares/nodeMailer");
const scheduleEnrollmentCheck = async () => {
  try {
    schedule.scheduleJob("00 12 * * *", async () => {
      console.log("Scheduled Job started working");
      const enrolmentIdArray = await enrolmentExpiredArray();
      const updateEnrolmentStatus = await checkAndUpdateEnrolmentStatus(
        enrolmentIdArray
      );

      const mailResponse = await sentMail(
        "kkbejoy@gmail.com",
        "Daily Enrolment update Status",
        JSON.stringify(updateEnrolmentStatus)
      );
      console.log("Cron Response", updateEnrolmentStatus);
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  scheduleEnrollmentCheck,
};
