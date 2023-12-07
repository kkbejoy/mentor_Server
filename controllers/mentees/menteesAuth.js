const passport = require("passport");
const menteeSchema = require("../../models/mentees");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const {
  generateAccessToken,
  generateRefreshToken,
  geneateJwtForEmailVerification,
} = require("../../middlewares/jwtGen");
const {
  approveMentees,
  fetchMenteeDataFromEmail,
  addStripeIdToMentee,
  fetchMenteeDataFromId,
  fetchMenteeWithEmailI,
  changeMenteePassword,
} = require("../../utilities/mentees");
const { deleteToken, findRefreshToken } = require("../../utilities/tokens");
const { sentMail } = require("../../middlewares/nodeMailer");
const { create } = require("express-hbs");
const {
  createCheckoutSession,
  createStripeCustomer,
} = require("../../utilities/paymentUtilities");
const {
  createEntollment,
  isEnrollmentActive,
  updateCheckOutId,
} = require("../../utilities/enrollmentUtilities");
const { sentOTP, verifyOTP } = require("../../middlewares/twilio");

//Creating New Mentees
const createMentee = async (req, res) => {
  try {
    const { email, password, firstName } = req.body;
    const newMenteeDetails = req.body;
    const existingUser = await menteeSchema.findOne({ email: email });

    if (existingUser?.isBlocked) {
      return res
        .status(403)
        .json({ error: "User blocked, Please contact the moderator" });
    }

    if (existingUser) {
      console.log("a");

      return res
        .status(409)
        .json({ error: "User with this email id already exists" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    newMenteeDetails.password = hashedPassword;

    const newMentee = new menteeSchema(newMenteeDetails);
    await newMentee.save();
    console.log(newMentee);
    // const newEmail = "kkbejoy@ymail.com";
    const jwt = await geneateJwtForEmailVerification({ firstName, email });
    console.log("Jwt", jwt);
    const message = ` Good morning ${firstName}. Your account has been successfully created. Please go to this link to verify your account. ${process.env.CLIENT_url}/api/mentees/verify/${jwt}`;
    await sentMail(email, "Verfication", message); //Sending Acknowlkegment with Link for verification mail to the user

    return res.status(201).json({
      message: `New user with username ${newMentee.firstName} created `,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Function which verify the Email ID provided by the Mentees

const verifyEmailIdFromJWT = async (req, res) => {
  try {
    const { jwt: jwtToken } = req.params;
    const decoded = await jwt.verify(jwtToken, process.env.REFRESH_SECRET_KEY);
    const { email } = decoded;
    console.log(email);
    const mentee = await fetchMenteeDataFromEmail(email);
    const { _id, firstName, lastName } = mentee;
    const name = firstName + lastName;
    const response = await approveMentees(email);
    const createStripeAccount = await createStripeCustomer(name, email, _id);
    await addStripeIdToMentee(_id, createStripeAccount.id);
    console.log(createStripeAccount);
    const responseObject = {
      title: " Success",
      message: "User email was verified successfully",
    };

    res.render("emailVerification", { response: responseObject });
  } catch (error) {
    const responseObject = {
      title: " Failed",
      message: "User Email Verification Failed",
      error: error.message,
    };
    console.log(error);
    res.render("emailVerification", { response: responseObject });
  }
};

//Verifying mentees credentials // LOGIN
const getMenteeTokens = async (req, res) => {
  try {
    console.log("hello");
    const { email, password } = req.body;
    const existingUser = await menteeSchema.findOne({ email: email });
    const { _id, firstName } = existingUser;
    console.log(_id, email, firstName);

    const accessToken = await generateAccessToken({
      id: _id,
      email: email,
      name: firstName,
    });
    const refreshToken = await generateRefreshToken({
      id: _id,
      email: email,
      name: firstName,
    });

    res.status(200).json({
      menteeName: firstName,
      menteeId: _id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: "Login Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Mentee Logout
const menteeLogout = async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const { menteeId, refreshToken } = req.body;
    console.log(menteeId, refreshToken);
    await deleteToken(menteeId, refreshToken);
    // await popRefreshToken(menteeId, refreshToken);
    return res
      .status(200)
      .json({ status: true, message: "User Logged Out successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

//Regenerate Access Tokens
const getNewAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log(req.body);
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const token = await findRefreshToken(refreshToken);
    if (!token) {
      res.status(401).json({
        status: false,
        message: "Refresh token expired. Please Login Again",
      });
    }
    console.log("decoded JWT", decoded);

    const menteeDetails = await menteeSchema.findById(decoded.id);
    const { id, email, firstName } = menteeDetails;
    const newAccessToken = await generateAccessToken({
      id: id,
      email: email,
      name: firstName,
    });
    res.status(200).json({ accessToken: newAccessToken, status: true });
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        status: false,
        message: "Refresh token expired. Please Login Again",
      });
    } else {
      console.error("Token Verification Error:", error.message);
      res.status(401).json({
        status: false,
        message: "Refresh Token expired, Please login agin",
      });
    }
  }
};

//Google success redirect for JWT generation

const googleAuthSuccess = async (req, res) => {
  try {
    console.log("Google auth controller function");
    const { email, _id: menteeId, firstName: menteeName } = req.user;
    console.log("mentee name", menteeId, menteeName);

    const accessToken = await generateAccessToken({
      id: menteeId,
      email: email,
      name: menteeName,
    });
    const refreshToken = await generateRefreshToken({
      id: menteeId,
      email: email,
      name: menteeName,
    });
    const redirectURl = `${process.env.CLIENT_url}/${process.env.GOOGLE_AUTH_SUCCESS_REDIRECT_URL}/data?menteeName=${menteeName}&accessToken=${accessToken}&refreshToken=${refreshToken}&menteeId=${menteeId}`;
    res.redirect(redirectURl);
    // res.status(200).json({
    //   menteeName: firstName,
    //   menteeId: _id,
    //   accessToken: accessToken,
    //   refreshToken: refreshToken,
    //   message: "Login Successfull",
    // });
    console.log(req.user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

// //Stripe config
// const getStripePublishableKey = async (req, res) => {
//   try {
//     const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
//     res.send({ publishableKey: stripePublishableKey });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //Stripe Payment intent

// const getStripePaymentIntent = async (req, res) => {
//   try {
//     console.log("hello");
//     const customer = await stripe.customers.create({
//       name: "Jenny Rosen",
//       email: "jenny@example.com",
//       address: {
//         line1: "510 Townsend St",
//         postal_code: "98140",
//         city: "San Francisco",
//         state: "CA",
//         country: "US",
//       },
//     });
//     const paymentIntent = await stripe.paymentIntents.create({
//       customer: customer.id,
//       description: "Software development services Test",
//       shipping: {
//         name: "Jenny Rosen",
//         address: {
//           line1: "510 Townsend St",
//           postal_code: "98140",
//           city: "San Francisco",
//           state: "CA",
//           country: "US",
//         },
//       },
//       currency: "EUR",
//       amount: 1999,
//       automatic_payment_methods: { enabled: true },
//     });
//     console.log("Payment Intent", paymentIntent);
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send({ error: { message: error.message } });
//   }
// };

//Stripe Checkout Function
const stripeCheckoutSession = async (req, res) => {
  try {
    const { mentorPriceId, menteeId, mentorId } = req.body;
    const { stripeId, firstName, email } = await fetchMenteeDataFromId(
      menteeId
    );
    console.log(
      "Details to Checkout",
      mentorPriceId,
      menteeId,
      mentorId,
      email
    );

    const isAlreadyEnrolled = await isEnrollmentActive(mentorId, menteeId);
    4;
    console.log("Enrollment status:", isAlreadyEnrolled);
    if (isAlreadyEnrolled) {
      console.log("Already Enrolled", isAlreadyEnrolled);
      return res.status(409).json({
        status: false,
        message: "Subscription Active",
        isAlreadyEnrolled,
      });
    }
    const checkoutResponse = await createCheckoutSession(
      mentorPriceId,
      stripeId,
      email,
      mentorId
    );
    const enrollmentObject = {
      menteeId: menteeId,
      mentorId: mentorId,
      checkoutId: checkoutResponse.id,
    };
    // await createEntollment(enrollmentObject);
    console.log("checkout res:", checkoutResponse);
    if (isAlreadyEnrolled === false && isAlreadyEnrolled !== null) {
      await updateCheckOutId(menteeId, mentorId, checkoutResponse?.id);
      console.log("Enrollment Expired");
    }
    if (isAlreadyEnrolled === null) {
      console.log("No enrollment exists");
      await createEntollment(enrollmentObject);
    }
    res.status(201).json({ status: true, url: checkoutResponse.url });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

// Function to sent OTP
const menteeSendOTPForForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isMenteeExistsOrNot = await fetchMenteeWithEmailI(email);
    if (!isMenteeExistsOrNot)
      return res
        .status(404)
        .json({ status: false, message: "Enter a valid Email id" });
    const phone = isMenteeExistsOrNot?.phone;
    const sentOTPStatus = await sentOTP(phone);
    if (!sentOTPStatus && !sentOTPStatus?.valid) {
      throw new Error("Failed to sent OTP");
    }

    console.log(email, isMenteeExistsOrNot, sentOTPStatus);
    return res
      .status(200)
      .json({ status: true, message: "OTP has been sent to mobile number" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Operation failed" });
  }
};

//Funtion to verify the OTP and Change Change Passwor

const changePasswordWithOTP = async (req, res) => {
  try {
    const { otp, password, email } = req.body;
    const isMenteeExistsOrNot = await fetchMenteeWithEmailI(email);
    const phone = isMenteeExistsOrNot?.phone;

    console.log(otp, password);
    const otpVerificationStatus = await verifyOTP(otp, phone);
    if (!otpVerificationStatus) {
      return res.status(401).json({ status: false, message: "Ente valid OTP" });
    }
    console.log("Result of OTP verifications", otpVerificationStatus);

    const responseFromDb = await changeMenteePassword(phone, password);
    console.log("response from pass", responseFromDb);
    // return res.status(200).json({ status: true, message: "Password changed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Operation failed" });
  }
};
module.exports = {
  createMentee,
  verifyEmailIdFromJWT,
  getMenteeTokens,
  getNewAccessToken,
  menteeLogout,
  googleAuthSuccess,
  // getStripePublishableKey,
  // getStripePaymentIntent,
  stripeCheckoutSession,
  menteeSendOTPForForgotPassword,
  changePasswordWithOTP,
};
