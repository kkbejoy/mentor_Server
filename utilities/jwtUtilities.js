const jwt = require("jsonwebtoken");

const extractIdFromJwtInHeaders = async (autherizationHeader) => {
  try {
    const jwtToken = autherizationHeader.split(" ")[1];
    const decodedId = jwt.decode(jwtToken).id;
    return decodedId;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  extractIdFromJwtInHeaders,
};
