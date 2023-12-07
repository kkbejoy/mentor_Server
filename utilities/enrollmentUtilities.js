const { response } = require("express");
const moment = require("moment");
const enrollmentSchema = require("../models/enrollmentModel");
const { eachQuarterOfInterval } = require("date-fns");
const mentees = require("../models/mentees");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
//Create a new Enrollment
const createEntollment = async (enrollmentObject) => {
  try {
    const newEnrollment = new enrollmentSchema(enrollmentObject);
    const response = await newEnrollment.save();
    console.log("New Enrollment Created Response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Approve Enrollement Status after payment

const approveEnrollementStatus = async (mentorId, menteeId) => {
  try {
    const currentDate = new Date();
    const nextMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );
    const response = await enrollmentSchema.findOneAndUpdate(
      {
        mentorId: mentorId,
        menteeId: menteeId,
      },
      {
        isEnrollmentActive: true,
        expiresOn: nextMonth,
      }
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

// Get the list and details of Mentors Active for a mentee

const fetchAllMentorsWithTheirDetails = async (menteeId) => {
  try {
    const mentorWithDetails = await enrollmentSchema
      .find(
        {
          // mentorId: mentorId,
          menteeId: menteeId,
          isEnrollmentActive: true,
        },
        { password: 0 }
      )
      .populate("mentorId");

    console.log("List of mentors filtered:", mentorWithDetails);
    return mentorWithDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Fetch the array of all subscibed mentors for a mentee

const fetchArrayOfMentorsForAMentee = async (menteeId) => {
  try {
    const listOfAllMentors = await enrollmentSchema.find(
      {
        // mentorId: mentorId,
        menteeId: menteeId,
        isEnrollmentActive: true,
      },
      { password: 0 }
    );
    console.log("List of all subscibed mentors list", listOfAllMentors);
    const extractedMentorsArray = await listOfAllMentors.map((enrollment) => {
      return enrollment.mentorId;
    });
    console.log("Array oF mentors", extractedMentorsArray);
    return extractedMentorsArray;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const fetchAllSubscibedMenteesArrayFromMentorId = async (mentorId) => {
//   try {
//     const response = await enrollmentSchema.find({
//       mentorId: mentorId,
//       isEnrollmentActive: true,
//     });
//     const menteesArray = response.map((enrollment) => {
//       return enrollment.menteeId;
//     });
//     return menteesArray;
//   } catch (error) {
//     throw error;
//   }
// };

//Fetch the list of enrollments with Mentee details

const enrollmentsWithMenteeDetails = async (mentorId) => {
  try {
    const enrollments = await enrollmentSchema
      .find({ mentorId: mentorId })
      .populate({ path: "menteeId", select: ["firstName", "lastName"] });
    return enrollments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Enrollment active or not checker

const isEnrollmentActive = async (mentorId, menteeId) => {
  try {
    const enrollmentDetails = await enrollmentSchema.findOne({
      menteeId: menteeId,
      mentorId: mentorId,
    });
    console.log(enrollmentDetails);
    if (!enrollmentDetails) return null;
    if (enrollmentDetails.isEnrollmentActive) return true;
    return false;
  } catch (error) {
    throw error;
  }
};
//Shceduler which makes changes to the database everyday

// Daily Footfall of new enrollments for  a particular mentor

const getDailyEnrollmentsForAParticularMentor = async (mentorId) => {
  try {
    const today = new Date();
    const dummy = new Date();
    const oneMonthPrior = dummy.setMonth(dummy.getMonth() - 1);
    console.log("Months", today, new Date(oneMonthPrior));
    const result = await enrollmentSchema.aggregate([
      {
        $match: {
          mentorId: new mongoose.Types.ObjectId(mentorId),
          // createdAt: { $gte: oneMonthPrior, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          // _id: 0,
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
      {
        $limit: 10,
      },
    ]);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Fetcht the daily New EnrollMents In the app
const getDailyNewEnrollments = async () => {
  try {
    const dailyEnrollment = await enrollmentSchema.aggregate([
      {
        $match: {
          // mentorId: new mongoose.Types.ObjectId(mentorId),
          // createdAt: { $gte: oneMonthPrior, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          // _id: 0,
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
      {
        $project: {
          date: 0,
        },
      },
      {
        $limit: 10,
      },
    ]);
    return dailyEnrollment;
  } catch (error) {
    throw error;
  }
};

//Returns an Array of Entollment ids that needs to be Unenrolled based on the exporation date

const enrolmentExpiredArray = async () => {
  try {
    const dateNow = new Date();

    const enrollments = await enrollmentSchema.find({
      expiresOn: { $lt: dateNow },
      isEnrollmentActive: true,
    });

    const expiredIdArray = enrollments?.map((enrolment) => enrolment._id);
    console.log(
      "List of enrollmment id that require sto be unenroledd",
      expiredIdArray
    );
    return expiredIdArray;
  } catch (error) {}
};

//Daily Enrollment field Updation

const checkAndUpdateEnrolmentStatus = async (idArray) => {
  try {
    const responseFromDb = await enrollmentSchema.updateMany(
      { _id: { $in: idArray } },
      { isEnrollmentActive: false }
    );

    console.log("Respose From Status Update:", responseFromDb);
    return responseFromDb;
  } catch (error) {
    console.log(error);
  }
};

//Update CheckOut Id from the stripe to the Enrollment DOCUMENT

const updateCheckOutId = async (menteeId, mentorId, newCheckOutId) => {
  try {
    const resposedfromDb = await enrollmentSchema.updateOne(
      {
        menteeId,
        mentorId,
      },
      {
        checkoutId: newCheckOutId,
      }
    );
    console.log("Checkout filed Updatation:", resposedfromDb);
    return resposedfromDb;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createEntollment,
  approveEnrollementStatus,
  fetchEnrollment,
  addSubscriptionId,
  fetchAllMentorsWithTheirDetails,
  fetchArrayOfMentorsForAMentee,
  enrollmentsWithMenteeDetails,
  isEnrollmentActive,
  getDailyEnrollmentsForAParticularMentor,
  getDailyNewEnrollments,
  enrolmentExpiredArray,
  checkAndUpdateEnrolmentStatus,
  updateCheckOutId,
};
