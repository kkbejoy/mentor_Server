const passport = require("passport");
const menteeSchema = require("../../models/mentees");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/jwtGen");

const { deleteToken, findRefreshToken } = require("../../utilities/tokens");

//Creating New Mentees
const createMentee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newMenteeDetails = req.body;
    const existingUser = await menteeSchema.findOne({ email: email });

    if (existingUser?.isBlocked) {
      console.log("a");
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
    return res.status(201).json({
      message: `New user with username ${newMentee.firstName} created `,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Verifying mentees credentials
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
    const { menteeId, refreshToken } = req.body;
    // console.log(menteeId, refreshToken);
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

module.exports = {
  createMentee,
  getMenteeTokens,
  getNewAccessToken,
  menteeLogout,
  googleAuthSuccess,
};
