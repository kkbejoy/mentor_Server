const { response } = require("express");
const menteeSchema = require("../models/mentees");
const { minTime } = require("date-fns");
const bcrypt = require("bcrypt");

//Get the List of all mentees With details
const allMenteesWithDetails = async () => {
  try {
    const mentees = await menteeSchema.find({}, { password: 0, __v: 0 });
    return mentees;
  } catch (error) {
    throw error;
  }
};

//Fetch mentee Details with Mentee Id

const fetchMenteeProfileWithId = async (menteeId) => {
  try {
    const menteeDetails = await menteeSchema.findById(menteeId, {
      password: 0,
    });
    return menteeDetails;
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
    console.log("Block Response mentee side", response);
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

const updateMenteeDetails = async (menteeId, updatesObject) => {
  try {
    const responseFromDb = await menteeSchema.findByIdAndUpdate(
      menteeId,
      updatesObject
    );
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

// fetch Mentee Details form array of Mentee Ids
// const fetchMenteeDetailsFromArray = async (menteesArray) => {
//   try {
//     const menteesList = await menteeSchema.find(
//       {
//         _id: { $in: menteesArray },
//       },
//       {
//         firstName: 1,
//         lastName: 1,
//       }
//     );
//     return menteesList;
//   } catch (error) {
//     throw error;
//   }
// };

//Details of new Mentee Registration

const getDetailsOfNewMenteeregistration = async () => {
  try {
    const menteeDetails = await menteeSchema.aggregate([
      {
        $match: {
          // createdAt:
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);
    return menteeDetails;
  } catch (error) {
    throw error;
  }
};

//Verify the existance of an activ Mentees with email

const fetchMenteeWithEmailI = async (email) => {
  try {
    const menteeDetails = await menteeSchema.findOne({
      email: email,
      isActive: true,
      isApproved: true,
      isBlocked: false,
    });
    return menteeDetails;
  } catch (error) {
    throw error;
  }
};

const changeMenteePassword = async (phone, newPassword) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const responseFromDb = await menteeSchema.findOneAndUpdate(
      { phone: phone },
      {
        password: hashedPassword,
      }
    );
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  allMenteesWithDetails,
  fetchMenteeProfileWithId,
  modifyMenteeIsBlockedField,
  approveMentees,
  fetchMenteeDataFromEmail,
  fetchMenteeDataFromId,
  addStripeIdToMentee,
  updateMenteeDetails,
  getDetailsOfNewMenteeregistration,
  fetchMenteeWithEmailI,
  changeMenteePassword,
};
