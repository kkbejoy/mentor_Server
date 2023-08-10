const menteeSchema = require("../models/mentees");

//Get the List of all mentees With details
const allMenteesWithDetails = async () => {
  try {
    const mentees = await menteeSchema.find(
      {},
      { _id: 0, password: 0, __v: 0 }
    );
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

module.exports = {
  allMenteesWithDetails,
  modifyMenteeIsBlockedField,
};
