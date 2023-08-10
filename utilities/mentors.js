const mentorSchema = require("../models/mentors");

const allMentorsWithDetails = async () => {
  try {
    const mentors = await mentorSchema.find(
      {},
      { _id: 0, password: 0, __v: 0 }
    );
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
      { _id: 0, password: 0, __v: 0 }
    );
    return allMentorRequests;
  } catch (error) {
    throw error;
  }
};

//Accept or reject Mentor status

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

module.exports = {
  allMentorsWithDetails,
  allMentorRequestsList,
  modifyIsApprovedField,
  modifyIsBlockedField,
};
