const {
  fetchAllMentorsWithTheirDetails,
  fetchArrayOfMentorsForAMentee,
} = require("../../utilities/enrollmentUtilities");

const {
  fetchTimeSlotsFromMentorArray,
  bookMentorTimeSlot,
  slotExistence,
  slotAvailabilityStatus,
  slotTimeElapsedOrNot,
  getAllBookedSlotsByThisMentee,
  revokeABookingByThisMentee,
} = require("../../utilities/slotAppointmentUtilities");

const {
  getAllNotificationForAUser,
} = require("../../utilities/notificationUtilities");

const {
  updateMenteeDetails,
  fetchMenteeProfileWithId,
} = require("../../utilities/mentees");

const {
  postATicketByMentee,
  fetchListOfTokenByMentee,
} = require("../../utilities/ticketUtilities");
//List of all mentors subscribed by a mentee
const fetchListOfMentorsSubscribed = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const allMentorsSubscribed = await fetchAllMentorsWithTheirDetails(
      menteeId
    );
    console.log("active mentor Subscribers", allMentorsSubscribed);

    return res.status(201).json({ allMentorsSubscribed, status: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Mentees Scheduler Time slot Data
const mentorsTimeSlotAvailabilityList = async (req, res) => {
  try {
    const { menteeId } = req.params;
    // console.log("MenteeId:", req.params);
    const mentorListArrayForMentee = await fetchArrayOfMentorsForAMentee(
      menteeId
    );
    const timeSlots = await fetchTimeSlotsFromMentorArray(
      mentorListArrayForMentee
    );
    // console.log("Time slots", timeSlots);
    return res.status(200).json({ status: true, timeSlots });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Booking Mentor Time slot By mentee

const fixMentorTimeSlot = async (req, res) => {
  try {
    const menteeBookingDetails = {};
    const { values, slotId } = req.body;
    const { slotId: id } = slotId;
    const { menteeQueryTitle, menteeQueryDescription, menteeId } = values;
    console.log("input values from mentee", values);
    const slotStatus = await slotAvailabilityStatus(slotId);
    const isPossible = await slotTimeElapsedOrNot(slotId);
    console.log("date elspased ot not", isPossible);
    if (slotStatus !== "available") throw new Error("Slot not availalble");
    if (isPossible) throw new Error("Date Elapsed");

    // Booking Object
    menteeBookingDetails.menteeQueryTitle = menteeQueryTitle;
    menteeBookingDetails.menteeQueryDescription = menteeQueryDescription;
    menteeBookingDetails.menteeId = menteeId;
    menteeBookingDetails.menteeId = menteeId;
    menteeBookingDetails.type = "booked";

    const responseFromDb = await bookMentorTimeSlot(
      slotId,
      menteeBookingDetails
    );
    console.log("Response from Time slot booking", responseFromDb);
    return res.status(204).json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed" });
  }
};

//Get all Notifications for a metntor

const getAllNotifications = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const notifications = await getAllNotificationForAUser(menteeId);
    // console.log("Notifications", notifications);
    res.status(200).json({ status: true, notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

//Update Mentees Profile

const updateProfile = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const updatesObject = req.body;
    console.log("Updated Fields", menteeId, req.body);
    const responseFromUpdate = await updateMenteeDetails(
      menteeId,
      updatesObject
    );
    console.log("responseFromUpdateDB", responseFromUpdate);
    res.status(200).json({ status: true, responseFromUpdate });
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false });
  }
};

//Fetch Mentee Profile Details
const fetchMenteeProfileDetails = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const menteeProfileDetails = await fetchMenteeProfileWithId(menteeId);
    res.status(200).json({ status: true, menteeProfileDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};
//Fetch Booked TIme slots By a Mentee

const fetchBookedTimeSlots = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const responseFromDb = await getAllBookedSlotsByThisMentee(menteeId);
    console.log("List of Booke slots By mentee:", responseFromDb);
    res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

const revokeABooking = async (req, res) => {
  try {
    const { slotId } = req.body;
    console.log(slotId);
    const responseFromDb = await revokeABookingByThisMentee(slotId);
    if (!responseFromDb) throw new Error("Slot does not exist");
    res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

//Raise  a Ticket
const raiseATicketFromMenteeSide = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const ticketObject = req.body;
    const ticketResponse = await postATicketByMentee(menteeId, ticketObject);
    return res.status(200).json({ status: true, ticketResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

//List of Tickets raised by a mentee
const getTheListOfTicketsRaisedByAMentee = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const listOfTickets = await fetchListOfTokenByMentee(menteeId);
    return res.status(200).json({ status: true, listOfTickets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};
module.exports = {
  fetchListOfMentorsSubscribed,
  mentorsTimeSlotAvailabilityList,
  fixMentorTimeSlot,
  getAllNotifications,
  updateProfile,
  fetchBookedTimeSlots,
  revokeABooking,
  fetchMenteeProfileDetails,
  raiseATicketFromMenteeSide,
  getTheListOfTicketsRaisedByAMentee,
};
