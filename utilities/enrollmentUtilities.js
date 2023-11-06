const { response } = require("express");
const enrollmentSchema = require("../models/enrollmentModel");
const { eachQuarterOfInterval } = require("date-fns");
const mentees = require("../models/mentees");
const schedule = require("node-schedule");

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

    if (!enrollmentDetails) return null;
    if (enrollmentDetails.isEnrollmentActive) return true;
    return false;
  } catch (error) {
    throw error;
  }
};
//Shceduler which makes changes to the database everyday

module.exports = {
  createEntollment,
  approveEnrollementStatus,
  fetchEnrollment,
  addSubscriptionId,
  fetchAllMentorsWithTheirDetails,
  fetchArrayOfMentorsForAMentee,
  enrollmentsWithMenteeDetails,
  isEnrollmentActive,
};
