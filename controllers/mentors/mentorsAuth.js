const mentorSchema = require("../../models/mentors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/jwtGen");
const { deleteToken, findRefreshToken } = require("../../utilities/tokens");
const { createSubscriptionPlan } = require("../../utilities/paymentUtilities");
//New Mentor Registration
const createMentor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newMentorDetails = req.body;
    const existingUser = await mentorSchema.findOne({ email: email });
    console.log(existingUser);
    if (existingUser?.isApproved == false) {
      return res.status(403).json({
        status: false,
        error:
          "Your Previous application is Pending review. Your Application is undergoing scrutiny. Please wait",
      });
    }

    if (existingUser?.isBlocked) {
      return res.status(403).json({
        status: false,
        error:
          "Account blocked, Please contact the support team for resolution",
        blocked: true,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        status: false,
        error: "Mentor with this email id already exists",
      });
    }
    //Subscription FUnction
    // const planId = await createSubscriptionPlan(
    //   "Service XYZ",
    //   "Monthly plan",
    //   "month",
    //   2,
    //   "usd"
    // );
    // console.log("Stripe Plan id:", planId);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    newMentorDetails.password = hashedPassword;
    // newMentorDetails.stripePlanId = planId;
    const newMentor = new mentorSchema(newMentorDetails);
    await newMentor.save();

    return res.status(201).json({
      status: true,
      message: `New user with username ${newMentor.firstName} created `,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, error: "Operation failed" });
  }
};

//Mentor Login and JWT Generation
const mentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const mentor = await mentorSchema.findOne({ email: email });

    if (!mentor) {
      return res.status(409).json({
        status: false,
        error: "Please Check Credentials. This user doesn't exists",
      });
    }
    if (mentor?.isApproved == false) {
      return res.status(403).json({
        status: false,
        error: "Your Application is undergoing scrutiny. Please wait",
      });
    }

    if (mentor?.isBlocked) {
      return res.status(403).json({
        status: false,
        error: "Mentor blocked, Please contact the moderator",
      });
    }
    const passwordsMatch = await bcrypt.compare(password, mentor.password);

    if (!passwordsMatch) {
      res.status(401).json({
        status: false,
        error: "Unauthorized",
        message:
          "Invalid username or password. Please check your credentials and try again.",
      });
    }

    const { _id, firstName } = mentor;
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
    console.log(accessToken, refreshToken);
    res.status(200).json({
      mentorName: firstName,
      mentorId: _id,
      mentorAccessToken: accessToken,
      mentorRefreshToken: refreshToken,
      message: "Login Successfull",
    });
  } catch (error) {
    return res.status(400).json({ status: false, error: "Login failed" });
  }
};
const mentorLogout = async (req, res) => {
  try {
    const { mentorId, refreshToken } = req.body;
    console.log(mentorId, refreshToken);
    await deleteToken(mentorId, refreshToken).catch((error) => {
      throw error;
    });
    return res
      .status(200)
      .json({ status: true, message: "Mentor Logged Out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

const getNewAccessToken = async (req, res) => {
  try {
    const { refreshToken, mentorId } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const refreshTokenExistence = await tok;
    console.log("decoded JWT", decoded, mentorId);
    const token = await findRefreshToken(refreshToken);
    if (!token) {
      res.status(401).json({
        status: false,
        message: "Refresh token expired. Please Login Again",
      });
    }
    const mentorDetails = await mentorSchema.findById(mentorId);
    const { _id, email, firstName } = mentorDetails;
    const newAccessToken = await generateAccessToken({
      id: _id,
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
        message: "Unauthorized token",
      });
    }
  }
};
module.exports = {
  createMentor,
  mentorLogin,
  mentorLogout,
  getNewAccessToken,
};
