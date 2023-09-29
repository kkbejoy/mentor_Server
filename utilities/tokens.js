const tokenSchema = require("../models/tokens");

//Create a TIME TO LEAVE Document for every Refresh togen generation
const createTokenDocument = async (tokenData) => {
  try {
    // const newToken = new tokenSchema(tokenData);
    await tokenSchema.create(tokenData);
    console.log("Hello from tokenn");
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Delete Existing mentee & mentor refresh token document
const deleteToken = async (userId, token) => {
  try {
    const result = await tokenSchema.deleteOne({
      userId: userId,
      token: token,
    });
    console.log("Token deletion:", result);
  } catch (error) {
    throw error;
  }
};

//Find refresh token with token id
const findRefreshToken = async (refreshTokenId) => {
  try {
    const token = await tokenSchema.findOne({ token: refreshTokenId });

    if (!token) return null;
    return token;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createTokenDocument,
  deleteToken,
  findRefreshToken,
};
