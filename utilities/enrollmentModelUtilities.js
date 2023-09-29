const { response } = require("express");
const enrollmentSchema = require("../models/enrollmentModel");

//Create a new Enrollment
const createEntollment = async (enrollmentObject) => {
  try {
    const newEnrollment = new enrollmentSchema(enrollmentObject);
    const response = await newEnrollment.save();
    console.log("ertollment Response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Approve Enrollement Status after payment

const approveEnrollementStatus = async (mentorId, menteeId) => {
  try {
    const response = await enrollmentSchema.findOneAndUpdate(
      {
        mentorId: mentorId,
        menteeId: menteeId,
      },
      { isEnrollmentActive: true }
    );
    console.log("Approval Enrollment ", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Fetch enrollment details for a mentor and Mentee

const fetchEnrollment = async (mentorId, menteeId) => {
  try {
    const response = await enrollmentSchema.findOne({ menteeId, mentorId });

    console.log("Entrollment Details for:", response);
    return response;
  } catch (error) {
    throw error;
  }
};

//Add subscription Id to the Document

const addSubscriptionId = async (id, subscriptionId) => {
  try {
    const response = await enrollmentSchema.findByIdAndUpdate(id, {
      subscriptionId: subscriptionId,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  createEntollment,
  approveEnrollementStatus,
  fetchEnrollment,
  addSubscriptionId,
};
