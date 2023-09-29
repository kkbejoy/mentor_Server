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
  }
};

//Fetchs Mentor profile data
const fetchMentorProfileDetails = async (req, res) => {
  try {
    const { id: mentorId } = req.params;
    const mentorData = await getMentorData(mentorId);

    res.status(200).json({ status: true, mentorData });
  } catch (error) {}
};

//Trail Route

const trail = async (req, res) => {
  try {
    console.log("hello");
    const name = "Bejoy K K";
    const email = "kkbejoy@gmail.com";
    const id =
      "cs_test_a1mCeTi1ZV2UcEbkj2qHo0V7Ja5p7TywhLszYNMd0UchEl5o0ly0Sn5amj";
    const subId = await fetchSubsctiptionId(id);

    console.log("subid", subId);
    return res.status(200);
  } catch (error) {
    console.log("Error From trail Con", error);
  }
};

module.exports = {
  fetchMentorsSearchResult,
  fetchMentorProfileDetails,
  trail,
};
