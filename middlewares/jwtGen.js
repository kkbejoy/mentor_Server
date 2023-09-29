const jwt = require("jsonwebtoken");
const menteeSchema = require("../models/mentees");
const passportJWT = require("passport-jwt");
const { format } = require("date-fns");

const { createTokenDocument } = require("../utilities/tokens");

//Generates new Access tokens
const generateAccessToken = async (user) => {
  try {
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "1h",
    });
    return accessToken;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//Generates new Refresh tokens
const generateRefreshToken = async (user) => {
  try {
    const expiry = "1d";
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY, {
      expiresIn: expiry,
    });
    const { id } = user;

    const decoded = await jwt.decode(refreshToken);
    const decodedtime = new Date(decoded.exp * 1000);
    const expirationTime = format(decodedtime, "yyyy-MM-dd HH:mm:ss");

    const userDetails = {
      userId: id,
      token: refreshToken,
      expiration: expirationTime,
    };
    await createTokenDocument(userDetails);
    return refreshToken;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//JWT token for verifying Email
const geneateJwtForEmailVerification = async (user) => {
  try {
    const expiry = "1d";
    const jwtToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY, {
      expiresIn: expiry,
    });
    return jwtToken;
  } catch (error) {}
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  geneateJwtForEmailVerification,
};
