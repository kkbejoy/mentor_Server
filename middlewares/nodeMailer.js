const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

//Function that handels outgoing Mails
const sentMail = async (toEmail, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL, // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      // html: "<b>Mentor</b>",
    });

    console.log("Message sent:", info.messageId, toEmail);
    return;
  } catch (error) {
    console.log("Node mailer Error:", error);
    throw error;
  }
};

module.exports = {
  sentMail,
};
