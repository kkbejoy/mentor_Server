const {} = require("../../utilities/moderators");
const moderatorSchema = require("../../models/moderator");
const jwt = require("jsonwebtoken");
const { sentMail } = require("../../middlewares/nodeMailer");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/jwtGen");
const {
  allMenteesWithDetails,
  modifyMenteeIsBlockedField,
  getDetailsOfNewMenteeregistration,
} = require("../../utilities/mentees");
const {
  allMentorsWithDetails,
  allMentorRequestsList,
  modifyIsApprovedField,
  modifyIsBlockedField,
  getMentorData,
  updateMentorDocumentWithPriceId,
} = require("../../utilities/mentors");
const {
  createSubscribableProduct,
} = require("../../utilities/paymentUtilities");
const { deleteToken, findRefreshToken } = require("../../utilities/tokens");
const {
  getAllTickets,
  changeTicketStatusChange,
  ticketDetailsWithTicketId,
} = require("../../utilities/ticketUtilities");
const {
  getDailyNewEnrollments,
} = require("../../utilities/enrollmentUtilities");
const {
  textToAccused,
  textToComplainant,
  subjectToAccusedMailText,
  subjectToComplainant,
} = require("../../constants/emailConstants");
// Moderator LogIn Function
const moderatorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const moderatorDetails = await moderatorSchema.findOne({
      email: email,
      password: password,
    });

    if (!moderatorDetails) {
      return res.status(409).json({
        status: false,
        error: "Please Check Credentials. This user doesn't exists",
      });
    }
    const { _id, name } = moderatorDetails;
    const accessToken = await generateAccessToken({
      id: _id,
      email: email,
      name: name,
    });

    //access token
    console.log(accessToken);
    const refreshToken = await generateRefreshToken({
      id: _id,
      email: email,
      name: name,
    });
    return res.status(200).json({
      status: true,
      message: "Login Successfull",
      moderatorAccessToken: accessToken,
      moderatorRefreshToken: refreshToken,
      moderatorId: _id,
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Moderator Regenerate AccessTokens

const getNewAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log(req.body);
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const { id: moderatorId, email, name } = decoded;

    console.log("decoded JWT", decoded, moderatorId);
    const token = await findRefreshToken(refreshToken);
    // console.log("token", token);
    if (!token) {
      console.log("No token");
      res.status(401).json({
        status: false,
        message: "Refresh token expired. Please Login Again",
      });
    }
    // const moderatorDetails = await moderatorSchema.findById(moderatorId);
    // const { _id, email, firstName } = moderatorDetails;
    const newAccessToken = await generateAccessToken({
      id: moderatorId,
      email: email,
      name: name,
    });
    console.log("New Access Tokjen:", newAccessToken);
    return res.status(200).json({ accessToken: newAccessToken, status: true });
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        status: false,
        message: "Refresh token expired. Please Login Again",
      });
    } else {
      console.error("Token Verification Error:", error.message);
      res.status(401).json({
        status: false,
        message: "Unauthorized token",
      });
    }
  }
};

// Mentees List with data
const getAllMentees = async (req, res) => {
  try {
    const mentees = await allMenteesWithDetails();
    console.log("mentees", mentees);
    res.status(200).json({ status: true, mentees });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Mentors List with Data
const getAllMentors = async (req, res) => {
  try {
    const mentors = await allMentorsWithDetails();
    // console.log("Mentors List:", mentors);
    res.status(200).json({ status: true, mentors });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Get all mentor requests
const getAllMentorRequests = async (req, res) => {
  try {
    const allMentorRequests = await allMentorRequestsList();
    console.log(allMentorRequests);
    res.status(200).json({ status: true, allMentorRequests });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Mentors Request Status Modification
const modifyMentorRequest = async (req, res) => {
  try {
    const { mentorId, mentorName, mentorEmail } = req.body;
    console.log(mentorId, mentorName, mentorEmail);

    const mentorDetails = await getMentorData(mentorId);
    const { firstName, lastName, email, hourlyRate } = mentorDetails;
    const mentorFullName = firstName + " " + lastName;
    const priceId = await createSubscribableProduct(mentorFullName, hourlyRate);
    await updateMentorDocumentWithPriceId(mentorId, priceId);
    await modifyIsApprovedField(mentorId);
    const subject = "Approved";
    const message = `Hello ${mentorName}. You apllication for mentor position has been verified and approved....!! `;
    await sentMail(email, subject, message);
    res
      .status(200)
      .json({ status: true, message: "Mentor Application has been approved" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Block and Unblock Mentor
const blockOrUnBlockMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    if (!mentorId) throw new Error("Mentor id null");
    await modifyIsBlockedField(mentorId);
    res.status(200).json({ status: true, message: "Mentor Status Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Block / Unblock Mentees
const blockOrUnBlockMentees = async (req, res) => {
  try {
    const { menteeId } = req.body;
    console.log(menteeId);
    if (!menteeId) throw new Error("Mentee id null");
    await modifyMenteeIsBlockedField(menteeId);
    res.status(200).json({ status: true, message: "Mentee Status Changed" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "internal server error" });
  }
};

//Moderator LogOut

const moderatorLogout = async (req, res) => {
  try {
    const { moderatorId, refreshToken } = req.body;
    console.log(moderatorId, refreshToken);
    await deleteToken(moderatorId, refreshToken).catch((error) => {
      throw error;
    });
    return res
      .status(200)
      .json({ status: true, message: "Moderator Logged Out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

//Fetch all tickets raised by Mentee and Mentor

const fetchAllTickets = async (req, res) => {
  try {
    const responseFromDb = await getAllTickets();
    console.log("All tickers froim Moderateor soide", responseFromDb.length);
    return res.status(200).json({ status: true, responseFromDb });
  } catch (error) {
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

//Take action against mentee or mentor after verifying the ticket
const takeActionAgainstAccused = async (req, res) => {
  try {
    const { ticketId } = req.body;
    console.log("Tikcet object", ticketId);
    const ticketDetails = await ticketDetailsWithTicketId(ticketId);
    //Destructuring The ticket Object
    const {
      complainant: {
        complainantType,
        complainantId: { _id: complainantId, email: complainantEmail },
      },
      accused: {
        accusedType,
        accusedId: { _id: accusedId, email: accusedEmail },
      },
    } = ticketDetails;
    console.log(
      "Ticket Details",
      accusedEmail,
      accusedId,

      complainantEmail,
      complainantId,
      complainantType,
      accusedType
    );
    //Process that have to happen for this Operation
    const blockTheAccused =
      accusedType === "mentee"
        ? modifyMenteeIsBlockedField(accusedId)
        : modifyIsBlockedField(accusedId);
    const resposeFromStatusChange = changeTicketStatusChange(ticketId);
    const mailToAccused = sentMail(
      accusedEmail,
      subjectToAccusedMailText,
      textToAccused
    );
    const mailToComplainant = sentMail(
      complainantEmail,
      subjectToComplainant,
      textToComplainant
    );

    Promise.all([
      blockTheAccused,
      resposeFromStatusChange,
      mailToAccused,
      mailToComplainant,
    ])
      .then((result) => {
        console.log("Result of the all the above promises is", result);
      })
      .then((response) => {
        console.log("Response FRom promise", response);
        res.status(200).json({ status: true });
      })
      .catch((error) => {
        throw error;
      });
    console.log("Res from Tickets Status change", blockTheAccused);
    // const blockUser=
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

//Get the data of daily Enrollment For Moderator Homepage
const fetchDailyEnrollmentData = async (req, res) => {
  try {
    const dailyEnrollmentData = await getDailyNewEnrollments();
    console.log("Daily enrollment data", dailyEnrollmentData);
    res.status(200).json({ status: true, dailyEnrollmentData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};

//fetch the details of Daily new Mentee Details

const fetchDailyNewMenteeData = async (req, res) => {
  try {
    const newMenteeDetail = await getDetailsOfNewMenteeregistration();
    console.log("Details of New Mentees:", newMenteeDetail);
    res.status(200).json({ status: true, newMenteeDetail });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Operation failed. Please Retry" });
  }
};
module.exports = {
  moderatorLogin,
  getNewAccessToken,
  getAllMentees,
  getAllMentors,
  getAllMentorRequests,
  modifyMentorRequest,
  blockOrUnBlockMentor,
  blockOrUnBlockMentees,
  moderatorLogout,
  fetchAllTickets,
  takeActionAgainstAccused,
  fetchDailyEnrollmentData,
  fetchDailyNewMenteeData,
};
