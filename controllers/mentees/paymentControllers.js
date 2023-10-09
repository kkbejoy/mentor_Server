const {
  approveEnrollementStatus,
  addSubscriptionId,
} = require("../../utilities/enrollmentUtilities");

const { fetchSubsctiptionId } = require("../../utilities/paymentUtilities");
//Approve Enrollment Field in Enrollment Document
const approveEnrollementFromPaymentSuccess = async (req, res) => {
  try {
    const { mentorId, menteeId } = req.body;
    console.log(mentorId);

    const responseFromDb = await approveEnrollementStatus(mentorId, menteeId);
    const subscriptionId = await fetchSubsctiptionId(responseFromDb.checkoutId);
    await addSubscriptionId(responseFromDb._id, subscriptionId);
    return res.status(200).json({ status: true });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  approveEnrollementFromPaymentSuccess,
};
