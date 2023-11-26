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
    console.log("Is approved Field change", response);
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
    console.log("Block Response mentor side", response);
    return true;
  } catch (error) {
    throw error;
  }
};

//Search mentor With Search input
const getMentorsFromSearchInput = async (searchInput, feesCode, rating) => {
  try {
    let feeinput = {};

    const searchInput1 = searchInput.trim();
    console.log("Search Input", searchInput1);
    if (feesCode === "a") {
      feeinput = { $exists: true };
    } else if (feesCode === "b") {
      feeinput = { $lte: 1000 };
    } else if (feesCode === "c") {
      feeinput = { $gt: 999, $lte: 2500 };
    } else if (feesCode === "d") {
      feeinput = { $gte: 2500, $lte: 5000 };
    } else {
      feeinput = { $gte: 5000 };
    }

    let query = {};
    if (searchInput != null || searchInput.trim() !== "null") {
      query = {
        $and: [
          {
            $or: [
              { firstName: { $regex: new RegExp(searchInput, "i") } },
              { lastName: { $regex: new RegExp(searchInput, "i") } },
              { firmName: { $regex: new RegExp(searchInput, "i") } },
              {
                expertise: {
                  $elemMatch: { $regex: new RegExp(searchInput, "i") },
                },
              },
            ],
          },
          { hourlyRate: feeinput },
          { isApproved: true, isBlocked: false },
        ],
      };
      // That i is to make the expression case insensitive
    }
    // console.log("Query", query);
    const mentors = await mentorSchema.find(query, {
      password: 0,
      createdAt: 0,
      subscriptionTypes: 0,
      isApproved: 0,
      isBlocked: 0,
    });

    return mentors;
  } catch (error) {
    throw error;
  }
};

//Mentor data With Mentor iD
const getMentorData = async (mentorId) => {
  try {
    console.log(mentorId);
    const mentorData = await mentorSchema.findById(mentorId, { password: 0 });
    // console.log(mentorData);
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
    console.log("Strip Id Updatation Status to Db:", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Update mentor Profile

const updateMentorProfileDetails = async (mentorId, updationObject) => {
  try {
    const response = await mentorSchema.findByIdAndUpdate(
      mentorId,
      updationObject
    );
    console.log("Response from mentor Profile Updatipn:", response);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update mentor SKills

const updateMentorSkillsArray = async (mentorId, newSkillArray) => {
  try {
    const responseFromDB = await mentorSchema.findByIdAndUpdate(mentorId, {
      $addToSet: { expertise: { $each: newSkillArray } },
    });
    return responseFromDB;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Remove a Skill Form Mentor Skill Array

const removeASkillFromMentorSkillArray = async (mentorId, skill) => {
  try {
    const responseFromDb = await mentorSchema.findByIdAndUpdate(mentorId, {
      $pull: { expertise: skill },
    });
    console.log("Response From db", responseFromDb);
  } catch (error) {
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
  updateMentorProfileDetails,
  updateMentorSkillsArray,
  removeASkillFromMentorSkillArray,
};
