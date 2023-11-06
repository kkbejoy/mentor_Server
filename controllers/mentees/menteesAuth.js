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
} = require("../../utilities/enrollmentUtilities");

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
    const { email, _id, firstName } = req.user;
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
    await createEntollment(enrollmentObject);
    console.log("checkout res:", checkoutResponse);
    res.status(201).json({ status: true, url: checkoutResponse.url });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
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
};
