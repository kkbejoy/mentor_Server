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
    if (!response) throw new Error("Slot not available");
    console.log("Response from Slot booking", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Verify a slot exists or not

const slotExistence = async (slotId) => {
  try {
    const responseFromDb = await slotAppointmentModel.findById(slotId);
    return responseFromDb;
  } catch (error) {
    console.log(errro);
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
          path: "menteeId mentorId",
          select: ["firstName", "lastName", "email"],
        },
      ])
      .lean();

    console.log("Slot details from id", slotDetails);
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
    return deleteResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//Returns the slot availbakity status
const slotAvailabilityStatus = async (slotId) => {
  try {
    const slotDetails = await slotAppointmentModel.findById(slotId);
    return slotDetails?.type;
  } catch (error) {
    throw error;
  }
};

//Checks the slot slot time have elapsed or not.

const slotTimeElapsedOrNot = async (slotId) => {
  try {
    const slotDetails = await slotAppointmentModel.findById(slotId);
    const currentTime = new Date();
    return currentTime > slotDetails.start;
  } catch (error) {
    throw error;
  }
};

//GEt all Booked time slots By this Mentee

const getAllBookedSlotsByThisMentee = async (menteeId) => {
  try {
    const today = new Date();

    const responseFromDb = await slotAppointmentModel
      .find({
        menteeId: menteeId,
        type: "booked",
        end: { $gte: today },
      })
      .populate({
        path: "mentorId",
        select: "firstName lastName",
      })
      .sort({ start: 1 });
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

const revokeABookingByThisMentee = async (slotId) => {
  try {
    const responseFromDb = await slotAppointmentModel.findByIdAndUpdate(
      slotId,
      {
        type: "available",
      }
    );
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

const fetchSessionWithDate = async (mentorId, date) => {
  try {
    console.log("date, ", mentorId);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const newId = new ObjectId(mentorId);
    const sessionDetails = await slotAppointmentModel
      .find({
        mentorId: newId,
        end: { $gte: today, $lte: tomorrow },
        type: "booked",
        menteeId: { $exists: true },
      })
      .populate({ path: "menteeId", select: "firstName lastName" })
      .sort({ start: 1 });
    // console.log("session detils", sessionDetails);
    return sessionDetails;
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
  listOfAllAvailableTimeSlots,
  fetchTimeSlotsFromMentorArray,
  bookMentorTimeSlot,
  fetchSlotDetailsWithId,
  deleteSlotWithId,
  slotExistence,
  slotAvailabilityStatus,
  slotTimeElapsedOrNot,
  getAllBookedSlotsByThisMentee,
  revokeABookingByThisMentee,
  fetchSessionWithDate,
};
