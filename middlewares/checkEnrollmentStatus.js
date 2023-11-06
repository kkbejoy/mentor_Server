const enrollmentSchema = require("../models/enrollmentModel"); // Import your Mongoose model

// Middleware function to check enrollment status
const checkEnrollmentStatus = async (req, res, next) => {
  const enrollmentId = req.params.enrollmentId; // Assuming you have the enrollment ID in the request params

  try {
    const enrollment = await enrollmentSchema.findById(enrollmentId);
    console.log("Enrollment status from middleware", enrollment);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (!enrollment.isEnrollmentActive) {
      return res.status(403).json({ message: "Enrollment is not active" });
    }

    // If enrollment is active, you can proceed with the next middleware or request handler
    next();
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkEnrollmentStatus;
