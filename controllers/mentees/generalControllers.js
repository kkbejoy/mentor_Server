const {
  getMentorsFromSearchInput,
  getMentorData,
} = require("../../utilities/mentors");
const mentorSchema = require("../../models/mentors");
const { extractIdFromJwtInHeaders } = require("../../utilities/jwtUtilities");
const {
  createStripeCustomer,
  fetchSubsctiptionId,
} = require("../../utilities/paymentUtilities");
const { addStripeIdToMentee } = require("../../utilities/mentees");
const {
  fetchAllMentorsWithTheirDetails,
  isEnrollmentActive,
} = require("../../utilities/enrollmentUtilities");
//Fetch Mentors Search Result
const fetchMentorsSearchResult = async (req, res) => {
  try {
    const search = req.query.search;
    const rating = req.query.rating;
    const price = req.query.price;
    //Make sure to validate and sanitize these fields
    // console.log(search, rating, price);
    const mentorsSearchResult = await getMentorsFromSearchInput(
      search,
      price,
      rating
    );
    // console.log(mentorsSearchResult);
    res.status(200).json({ status: true, mentorsSearchResult });
    res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Fetchs Mentor profile data
const fetchMentorProfileDetails = async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const menteeId = await extractIdFromJwtInHeaders(req.headers.authorization);
    const { id: mentorId } = req.params;
    const isEnrollmentActiveOrNot = await isEnrollmentActive(
      mentorId,
      menteeId
    );
    let mentorData = await getMentorData(mentorId);
    // mentorData?.isEnrolled=isEnrollmentActiveOrNot;
    //
    console.log("Entollment details", mentorData);
    res.status(200).json({
      status: true,
      mentorData,
      isEnrollmentActive: isEnrollmentActiveOrNot,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Trail Route

const trail = async (req, res) => {
  try {
    return res.status(200);
  } catch (error) {
    console.log("Error From trail Con", error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

module.exports = {
  fetchMentorsSearchResult,
  fetchMentorProfileDetails,
  trail,
};
