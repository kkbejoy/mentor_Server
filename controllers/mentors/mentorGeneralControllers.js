const { updateMentorProfileDetails } = require("../../utilities/mentors");
const {
  enrollmentsWithMenteeDetails,
} = require("../../utilities/enrollmentUtilities");

const {} = require("../../utilities/mentees");

const updateProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const updatedFields = req.body;
    console.log("Updated fileds", updatedFields, mentorId);
    const responseFromDb = updateMentorProfileDetails(mentorId, updatedFields);
    return res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};
const fetchSubscribedMentees = async (req, res) => {
  try {
    const { mentorId } = req.params;
    // const menteesArray = await fetchAllSubscibedMenteesArrayFromMentorId(
    //   mentorId
    // );
    // const menteesList = await fetchMenteeDetailsFromArray(menteesArray);

    const enrolledMentees = await enrollmentsWithMenteeDetails(mentorId);
    console.log("Response from utilities", enrolledMentees);
    return res.status(200).json({ status: true, enrolledMentees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

module.exports = {
  updateProfile,
  fetchSubscribedMentees,
};
