const ticketsModel = require("../models/ticketsModel");

//Get all Tickets Raised by both Mentee and Mentor

const getAllTickets = async () => {
  try {
    const allTickets = await ticketsModel
      .find()
      .populate({
        path: "accused.accusedId complainant.complainantId",
        select:
          "firstName lastName complainant.complainantType accused.accusedType",
      })
      .sort({ createdAt: -1 });
    return allTickets;
  } catch (error) {}
};
const postATicketByMentee = async (menteeId, complaint) => {
  console.log(complaint);
  try {
    const ticketObject = {
      complainant: { complainantType: "mentee", complainantId: menteeId },
      //   complainant: {},
      accused: {
        accusedType: "mentor",
        accusedId: complaint?.complaint?.accusedId,
      },
      content: complaint?.content,
    };
    const responseFromDb = await ticketsModel.create(ticketObject);
    console.log("Resonse from tikcet creation", responseFromDb);
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

//Fetch the list of Tokens created by a Mentee

const fetchListOfTokenByMentee = async (menteeId) => {
  try {
    const responseFromDb = await ticketsModel
      .find({
        "complainant.complainantType": "mentee",
        "complainant.complainantId": menteeId,
      })
      .populate({
        path: "accused.accusedId",
        select: "firstName lastName",
      })
      .sort({ createdAt: -1 });
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

//Post a ticket by Mentor

const postATicketByMentor = async (mentorId, complaint) => {
  console.log(complaint);
  try {
    const ticketObject = {
      complainant: { complainantType: "mentor", complainantId: mentorId },
      accused: {
        accusedType: "mentee",
        accusedId: complaint?.complaint?.accusedId,
      },
      content: complaint?.content,
    };
    const responseFromDb = await ticketsModel.create(ticketObject);
    console.log("Resonse from tikcet creation", responseFromDb);
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

//Fetch the list of Tokens created by a Mentor

const fetchListOfTokenByMentor = async (mentorId) => {
  try {
    const responseFromDb = await ticketsModel
      .find({
        "complainant.complainantType": "mentor",
        "complainant.complainantId": mentorId,
      })
      .populate({
        path: "accused.accusedId",
        select: "firstName lastName",
      })
      .sort({ createdAt: -1 });
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};

//Get the ticket details WIth Ticket Id

const ticketDetailsWithTicketId = async (ticketId) => {
  try {
    const ticketDetails = await ticketsModel
      .findById(ticketId)
      .populate({
        path: "accused.accusedId complainant.complainantId",
        select: "firstName lastName email ",
      });
    return ticketDetails;
  } catch (error) {
    throw error;
  }
};
//Modify the ticket status
const changeTicketStatusChange = async (ticketId) => {
  try {
    const responseFromDb = await ticketsModel.findByIdAndUpdate(ticketId, {
      status: "resolved",
    });
    return responseFromDb;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllTickets,
  postATicketByMentee,
  fetchListOfTokenByMentee,
  postATicketByMentor,
  fetchListOfTokenByMentor,
  ticketDetailsWithTicketId,
  changeTicketStatusChange,
};
