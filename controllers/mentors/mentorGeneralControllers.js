const {
  updateMentorProfileDetails,
  getMentorData,
  updateMentorSkillsArray,
  removeASkillFromMentorSkillArray,
} = require("../../utilities/mentors");
const {
  enrollmentsWithMenteeDetails,
  getDailyEnrollmentsForAParticularMentor,
} = require("../../utilities/enrollmentUtilities");

const {} = require("../../utilities/mentees");
const {
  fetchSessionWithDate,
} = require("../../utilities/slotAppointmentUtilities");

const {
  fetchListOfTokenByMentor,
  postATicketByMentor,
} = require("../../utilities/ticketUtilities");
const { extractIdFromJwtInHeaders } = require("../../utilities/jwtUtilities");

//Fetch the Mentor Profile Data

const fetchMentorProfileData = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const profileData = await getMentorData(mentorId);
    // console.log("Mentor Profile Details", profileData);
    res.status(200).json({ status: true, profileData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Update Mentor Profile Details
const updateProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const updatedFields = req.body;
    console.log("Updated fileds", updatedFields, mentorId);
    // const newUpdatedObject = {};
    // if (updatedFields.expertise) {

    // }
    // console.log("New object", newUpdatedObject);
    const responseFromDb = updateMentorProfileDetails(mentorId, updatedFields);
    return res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Fetch the list of all subscribed Mentees
const fetchSubscribedMentees = async (req, res) => {
  try {
    const { mentorId } = req.params;
    // const menteesArray = await fetchAllSubscibedMenteesArrayFromMentorId(
    //   mentorId
    // );
    // const menteesList = await fetchMenteeDetailsFromArray(menteesArray);

    const enrolledMentees = await enrollmentsWithMenteeDetails(mentorId);
    // console.log("Subscribed mentees List:", enrolledMentees);
    return res.status(200).json({ status: true, enrolledMentees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Fetch the list of all Live sessions in the next 24 hr
const fetchTodaysLiveSession = async (req, res) => {
  try {
    const { mentorId } = req.params;
    // const mentorId = await extractIdFromJwtInHeaders(req.headers.authorization);
    const todaysDate = new Date();
    // console.log("Feth derail sto home page", mentorId, todaysDate);
    const sessionDetails = await fetchSessionWithDate(mentorId, todaysDate);
    res.status(200).json({ status: true, sessionDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Fetch the Data for Mentor Dashboard
const fetchEnrollmentDetailsForParticularMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    console.log("MentorId", mentorId);
    const enrollmentObject = await getDailyEnrollmentsForAParticularMentor(
      mentorId
    );
    console.log("Results", enrollmentObject);
    res.status(200).json({ status: true, enrollmentObject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//add new skill to the mentor Profile
const addNewSkillForMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { newSkills } = req.body;
    console.log("Update skill", mentorId, newSkills);
    const responseFromDBOp = await updateMentorSkillsArray(mentorId, newSkills);
    console.log("Response from DB Update SKills", responseFromDBOp);
    return res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Delete  a skill From Mentor Skill Array

const deleteMentorSkill = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { skill } = req.body;
    console.log("Skill deeleteion", mentorId, skill);
    const responseFromDb = await removeASkillFromMentorSkillArray(
      mentorId,
      skill
    );
    console.log("Response FRom Skill delettion", responseFromDb);

    return res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//Raise  a Ticket
const raiseATicketFromMentorSide = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { ticketObject } = req.body;
    console.log("Ticket object from mentor side", req.body);
    const ticketResponse = await postATicketByMentor(mentorId, ticketObject);
    return res.status(200).json({ status: true, ticketResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

//List of Tickets raised by a mentee
const getTheListOfTicketsRaisedByAMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const listOfTickets = await fetchListOfTokenByMentor(mentorId);
    return res.status(200).json({ status: true, listOfTickets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};
module.exports = {
  fetchMentorProfileData,
  updateProfile,
  fetchSubscribedMentees,
  fetchTodaysLiveSession,
  fetchEnrollmentDetailsForParticularMentor,
  addNewSkillForMentor,
  deleteMentorSkill,
  raiseATicketFromMentorSide,
  getTheListOfTicketsRaisedByAMentor,
};
