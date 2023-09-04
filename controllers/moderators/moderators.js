const {} = require("../../utilities/moderators");
const moderatorSchema = require("../../models/moderator");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/jwtGen");
const {
  allMenteesWithDetails,
  modifyMenteeIsBlockedField,
} = require("../../utilities/mentees");
const {
  allMentorsWithDetails,
  allMentorRequestsList,
  modifyIsApprovedField,
  modifyIsBlockedField,
} = require("../../utilities/mentors");

// Moderator LogIn Function
const moderatorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const moderatorDetails = await moderatorSchema.findOne({
      email: email,
      password: password,
    });

    if (!moderatorDetails) {
      return res.status(409).json({
        status: false,
        error: "Please Check Credentials. This user doesn't exists",
      });
    }
    const { _id, name } = moderatorDetails;
    const accessToken = await generateAccessToken({
      id: _id,
      email: email,
      name: name,
    });
    const refreshToken = await generateRefreshToken({
      id: _id,
      email: email,
      name: name,
    });
    return res.status(200).json({
      status: true,
      message: "Login Successfull",
      moderatorAccessToken: accessToken,
      moderatorRefreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

// Mentees List with data
const getAllMentees = async (req, res) => {
  try {
    const mentees = await allMenteesWithDetails();
    res.status(200).json({ status: true, mentees });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Mentors List with Data

const getAllMentors = async (req, res) => {
  try {
    const mentors = await allMentorsWithDetails();
    res.status(200).json({ status: true, mentors });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Get all mentor requests

const getAllMentorRequests = async (req, res) => {
  try {
    const allMentorRequests = await allMentorRequestsList();
    console.log(allMentorRequests);
    res.status(200).json({ status: true, allMentorRequests });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Mentors Request Status Modification

const modifyMentorRequest = async (req, res) => {
  try {
    const { mentorId } = req.body;
    await modifyIsApprovedField(mentorId);
    res.status(200).json({ status: true, message: "Mentor Status Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Block and Unblock Mentor
const blockOrUnBlockMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    if (!mentorId) throw new Error("Mentor id null");
    await modifyIsBlockedField(mentorId);
    res.status(200).json({ status: true, message: "Mentor Status Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Block ? Unblock Mentees
const blockOrUnBlockMentees = async (req, res) => {
  try {
    const { menteeId } = req.body;
    console.log(menteeId);
    if (!menteeId) throw new Error("Mentee id null");
    await modifyMenteeIsBlockedField(menteeId);
    res.status(200).json({ status: true, message: "Mentee Status Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};
module.exports = {
  moderatorLogin,
  getAllMentees,
  getAllMentors,
  getAllMentorRequests,
  modifyMentorRequest,
  blockOrUnBlockMentor,
  blockOrUnBlockMentees,
};
