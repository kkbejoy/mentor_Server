const slotAppointmentModel = require("../models/slotAppointmentModel");
const moment = require("moment");

const createMentorAvailableSlot = async (slotDetails) => {
  try {
    const newSlotObject = new slotAppointmentModel(slotDetails);
    const response = await newSlotObject.save();
    console.log("Slot creatioon response", response);
    return;
  } catch (error) {
    throw error;
  }
};

const updateMentorAvailbaleSlot = async (updatedSlotDetails) => {
  try {
    const response = await slotAppointmentModel.findByIdAndUpdate(
      updatedSlotDetails
    );
    console.log("Resposde after updating mentor slot", response);
    return;
  } catch (error) {
    throw error;
  }
};

const deleteMentorAvailableSlot = async (slotId) => {
  try {
    const response = await slotAppointmentModel.deleteOne(slotId);
    console.log(response);
    return;
  } catch (error) {
    throw error;
  }
};

const findMentorSlotAvailabiity = async (time, mentorId) => {
  try {
    //Create  a logic for proper searching
    const existingSlot = await slotAppointmentModel.findOne({});
    return existingSlot;
  } catch (error) {
    throw error;
  }
};

const getAllTimeSlotsForMentor = async (mentorId) => {
  try {
    const allTimeSlots = await slotAppointmentModel.find({
      mentorId: mentorId,
    });

    return allTimeSlots;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createMentorAvailableSlot,
  updateMentorAvailbaleSlot,
  deleteMentorAvailableSlot,
  findMentorSlotAvailabiity,
  getAllTimeSlotsForMentor,
};
