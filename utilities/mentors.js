const { find } = require("../models/mentees");
const mentorSchema = require("../models/mentors");

//Fetches all mentors with all details
const allMentorsWithDetails = async () => {
  try {
    const mentors = await mentorSchema.find({}, { password: 0, __v: 0 });
    return mentors;
  } catch (error) {
    throw error;
  }
};

//All unapproved mentor requests with details
const allMentorRequestsList = async () => {
  try {
    const allMentorRequests = await mentorSchema.find(
      { isApproved: false },
      { password: 0, __v: 0 }
    );

    return allMentorRequests;
  } catch (error) {
    throw error;
  }
};

//Accept or reject Mentor request
const modifyIsApprovedField = async (mentorId) => {
  try {
    const newStatus = (await mentorSchema.findById(mentorId))?.isApproved;
    console.log(newStatus);
    const update = { $set: { isApproved: !newStatus } };
    const response = await mentorSchema.findByIdAndUpdate(mentorId, update);
    console.log(response);
    return true;
  } catch (error) {
    throw error;
  }
};

//Block Or UnBlock Mentors
const modifyIsBlockedField = async (mentorId) => {
  try {
    const currentStatus = (await mentorSchema.findById(mentorId))?.isBlocked;
    // const newStatus = !currentStatus;
    // console.log(currentStatus, newStatus);
    const update = { $set: { isBlocked: !currentStatus } };
    const response = await mentorSchema.findByIdAndUpdate(mentorId, update);
    console.log(response);
    return true;
  } catch (error) {
    throw error;
  }
};

//Search mentor With Search input
const getMentorsFromSearchInput = async (searchInput) => {
  try {
    const searchInput1 = searchInput.trim();
    console.log("Search Input", searchInput1);

    let query = {};
    if (searchInput != null || searchInput.trim() !== "null") {
      query = {
        firstName: { $regex: new RegExp(searchInput, "i") },
      };
      // That i is to make the expression case insensitive
    }
    console.log(query);
    const mentors = await mentorSchema.find(query);

    return mentors;
  } catch (error) {
    throw error;
  }
};

//Mentor data With Mentor iD
const getMentorData = async (mentorId) => {
  try {
    console.log(mentorId);
    const mentorData = await mentorSchema.findById(mentorId);
    console.log(mentorData);
    return mentorData;
  } catch (error) {
    throw error;
  }
};

//Store Stripe Price ID in Mentor Document

const updateMentorDocumentWithPriceId = async (mentorId, priceId) => {
  try {
    const response = await mentorSchema.findByIdAndUpdate(mentorId, {
      stripePriceId: priceId,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  allMentorsWithDetails,
  allMentorRequestsList,
  modifyIsApprovedField,
  modifyIsBlockedField,
  getMentorsFromSearchInput,
  getMentorData,
  updateMentorDocumentWithPriceId,
};
