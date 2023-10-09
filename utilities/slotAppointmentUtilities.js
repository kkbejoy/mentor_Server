const slotAppointmentModel = require("../models/slotAppointmentModel");
const moment = require("moment");
const { ObjectId } = require("mongodb");

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
    const allTimeSlots = await slotAppointmentModel
      .find({
        mentorId: mentorId,
      })
      .populate("menteeId", ["firstName", "lastName"]);

    return allTimeSlots;
  } catch (error) {
    throw error;
  }
};

const listOfAllAvailableTimeSlots = async (menteeId) => {
  try {
    const timeSlots = await slotAppointmentModel.find({ menteeId });
    console.log("Time Slots available od Subscribed mentors", timeSlots);
    return timeSlots;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Time Slots to Mentee scheduler
const fetchTimeSlotsFromMentorArray = async (mentorsArray) => {
  try {
    const slotsForTheseMentors = await slotAppointmentModel
      .find({
        mentorId: { $in: mentorsArray },
      })
      .populate({
        path: "mentorId",
        select: ["firstName", "lastName", "profileImageUrl"],
      });
    return slotsForTheseMentors;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Book Mentor Slot By Mentee

const bookMentorTimeSlot = async (slotId, menteeDetails) => {
  try {
    const response = await slotAppointmentModel.findByIdAndUpdate(
      slotId,
      menteeDetails
    );
    console.log("Response from Slot booking", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Get Slot Details from Slot Id

const fetchSlotDetailsWithId = async (slotId) => {
  try {
    const slotDetails = await slotAppointmentModel
      .findById(slotId)
      .populate([
        {
          path: "menteeId",
          select: ["firstName", "lastName"],
        },
      ])
      .lean();

    // console.log("Slot details from id", slotDetails);
    return slotDetails;
  } catch (error) {
    throw error;
  }
};

//Delete Slot using Id

const deleteSlotWithId = async (slotId) => {
  try {
    const deleteResponse = await slotAppointmentModel.deleteOne({
      _id: slotId,
    });
    console.log(deleteResponse);
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = {
  createMentorAvailableSlot,
  updateMentorAvailbaleSlot,
  deleteMentorAvailableSlot,
  findMentorSlotAvailabiity,
  getAllTimeSlotsForMentor,
  listOfAllAvailableTimeSlots,
  fetchTimeSlotsFromMentorArray,
  bookMentorTimeSlot,
  fetchSlotDetailsWithId,
  deleteSlotWithId,
};
