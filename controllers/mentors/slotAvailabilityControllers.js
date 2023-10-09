const { response } = require("express");
const {
  createMentorAvailableSlot,
  findMentorSlotAvailabiity,
  getAllTimeSlotsForMentor,
  fetchSlotDetailsWithId,
  deleteSlotWithId,
} = require("../../utilities/slotAppointmentUtilities");

//Add new availbale time slots by the Mentor
const createNewAvailbleSlotForMentor = async (req, res) => {
  try {
    const { slotDetails, mentorId } = req.body;

    slotDetails.mentorId = mentorId;
    console.log("New Slot Details", slotDetails);
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
    console.log("Allotted Slots", allTimeSlots);
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
    console.log("Slot from Id controller:", resonseFromDb);
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

    const responseFromDb = await deleteSlotWithId(slotId);
    console.log("Slot delete reso", responseFromDb);
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
