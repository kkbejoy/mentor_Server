const {
  fetchAllMentorsWithTheirDetails,
  fetchArrayOfMentorsForAMentee,
} = require("../../utilities/enrollmentUtilities");

const {
  fetchTimeSlotsFromMentorArray,
  bookMentorTimeSlot,
} = require("../../utilities/slotAppointmentUtilities");

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
    console.log("Time slots", timeSlots);
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
module.exports = {
  fetchListOfMentorsSubscribed,
  mentorsTimeSlotAvailabilityList,
  fixMentorTimeSlot,
};
