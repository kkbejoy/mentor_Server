const tokenSchema = require("../models/tokens");

//Create a Document for every Refresh togen generation
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
    console.log(result);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTokenDocument,
  deleteToken,
};
