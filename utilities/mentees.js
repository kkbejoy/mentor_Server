const { response } = require("express");
const menteeSchema = require("../models/mentees");

//Get the List of all mentees With details
const allMenteesWithDetails = async () => {
  try {
    const mentees = await menteeSchema.find({}, { password: 0, __v: 0 });
    return mentees;
  } catch (error) {
    throw error;
  }
};

//Block Or UnBlock Mentees
const modifyMenteeIsBlockedField = async (menteeId) => {
  try {
    const currentStatus = (await menteeSchema.findById(menteeId))?.isBlocked;
    // const newStatus = !currentStatus;
    console.log(currentStatus);
    const update = { $set: { isBlocked: !currentStatus } };
    const response = await menteeSchema.findByIdAndUpdate(menteeId, update);
    if (response == null || undefined) throw new Error("Some Issue");
    console.log(response);
    return true;
  } catch (error) {
    throw error;
  }
};

//Modify Mentees Approval status

const approveMentees = async (email) => {
  try {
    const response = await menteeSchema.findOneAndUpdate(
      { email: email },
      {
        isActive: true, //Convert this to isApproved
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//Fetch details of Mentee details

const fetchMenteeDataFromEmail = async (email) => {
  try {
    const response = await menteeSchema.findOne({ email });
    return response;
  } catch (error) {
    throw error;
  }
};

//Fetch details of Mentee details With id

const fetchMenteeDataFromId = async (menteeId) => {
  try {
    const response = await menteeSchema.findById(menteeId);
    return response;
  } catch (error) {
    throw error;
  }
};

//Add Stripe Customer id to Mentee database
const addStripeIdToMentee = async (menteeId, stripeId) => {
  try {
    const response = await menteeSchema.findByIdAndUpdate(menteeId, {
      stripeId,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  allMenteesWithDetails,
  modifyMenteeIsBlockedField,
  approveMentees,
  fetchMenteeDataFromEmail,
  fetchMenteeDataFromId,
  addStripeIdToMentee,
};
