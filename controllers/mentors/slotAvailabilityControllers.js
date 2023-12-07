const { response } = require("express");
const {
  createMentorAvailableSlot,
  findMentorSlotAvailabiity,
  getAllTimeSlotsForMentor,
  fetchSlotDetailsWithId,
  deleteSlotWithId,
} = require("../../utilities/slotAppointmentUtilities");
const { addNewNotification } = require("../../utilities/notificationUtilities");
const { sentMail } = require("../../middlewares/nodeMailer");
//Add new availbale time slots by the Mentor
const createNewAvailbleSlotForMentor = async (req, res) => {
  try {
    const { slotDetails, mentorId } = req.body;

    slotDetails.mentorId = mentorId;
    const currentTime = new Date();
    const slotTime = new Date(slotDetails.start);
    const isPossible = slotTime > currentTime;
    if (!isPossible) throw new Error("Date elapsed");
    console.log("New Slot Details", slotDetails, isPossible);
    const response = await createMentorAvailableSlot(slotDetails);
    return res.status(200).json({ status: true, message: "New Slot created" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "Something went wrong" });
  }
};

//Get all availabnle slots for a mentor

const getAllSlotForMentorId = async (req, res) => {
  try {
    const { id: mentorId } = req.params;
    console.log("Mentor id", mentorId);

    const allTimeSlots = await getAllTimeSlotsForMentor(mentorId);
    // console.log("Allotted Slots", allTimeSlots);
    if (!allTimeSlots) {
      return res
        .status(204)
        .json({ status: true, message: "No time slots availbel" });
    }

    return res.status(200).json({ status: true, allTimeSlots });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "No time slots availbel" });
  }
};

//Fetch Slot Details With Slot Id
const fetchSlotDetails = async (req, res) => {
  try {
    const { slotId } = req.params;
    console.log("Slot id", slotId);
    const resonseFromDb = await fetchSlotDetailsWithId(slotId);
    // console.log("Slot from Id controller:", resonseFromDb);
    res.status(200).json({ resonseFromDb });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "No time slots availbel" });
  }
};

//Delete SLot // have to check
const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const slotDetails = await fetchSlotDetailsWithId(slotId);
    let responseFromDb = await deleteSlotWithId(slotId);
    console.log("Slot delete reso", slotId);
    let notifyMentee;
    if (slotDetails.menteeId._id !== null) {
      console.log("Entered into notifications");
      const type = "alert";
      const content = `One of the live sessions agreed has been postponed by the ${slotDetails.mentorId.firstName} ${slotDetails.mentorId.lastName}. Please check your scheduler for more info `;
      notifyMentee = await addNewNotification(
        slotDetails.menteeId._id,
        "mentee",
        content,
        type
      );
      const subject = "Live Session Postponed";
      const text =
        "Your request for a live session has been cancelled due to unforeseen circumstances on the mentor's end. We appreciate your understanding and will work to find a suitable alternative time for the session. Thank you for your patience.";
      await sentMail(slotDetails.menteeId.email, subject, text);
      // console.log("Notification db", notifyMentee);
    }
    responseFromDb.deleted = true;

    return res.status(200).json({ status: true, responseFromDb, notifyMentee });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "No time slots availbel" });
  }
};
module.exports = {
  createNewAvailbleSlotForMentor,
  getAllSlotForMentorId,
  fetchSlotDetails,
  deleteSlot,
};
