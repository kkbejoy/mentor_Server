const {
  getMentorsFromSearchInput,
  getMentorData,
} = require("../../utilities/mentors");
const mentorSchema = require("../../models/mentors");
const {
  createStripeCustomer,
  fetchSubsctiptionId,
} = require("../../utilities/paymentUtilities");
const { addStripeIdToMentee } = require("../../utilities/mentees");
const {
  fetchAllMentorsWithTheirDetails,
} = require("../../utilities/enrollmentUtilities");
//Fetch Mentors Search Result
const fetchMentorsSearchResult = async (req, res) => {
  try {
    const { search } = req.query;

    // console.log(search);
    const mentorsSearchResult = await getMentorsFromSearchInput(search);
    console.log(mentorsSearchResult);
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
    const { id: mentorId } = req.params;
    const mentorData = await getMentorData(mentorId);
    res.status(200).json({ status: true, mentorData });
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
