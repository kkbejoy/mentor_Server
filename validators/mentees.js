const { body, validationResult, sanitizeBody } = require("express-validator");

const menteeRegistrationRules = [
  body("firstName").notEmpty().withMessage("First name is required").trim(),
  body("lastName").notEmpty().withMessage("Last name is required").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("phone").isNumeric().withMessage("Invalid phone number"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
  //Input validation and sanitization
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: "Validation failed",
        errorReason: validationErrors.errors,
      });
    }
    next();
  },
];

const menteeLoginRules = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),

  //Input validation and sanitization
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log("validation failed", validationErrors);
      return res.status(400).json({ errors: "Validation failed" });
    }
    next();
  },
];

const checkMenteeOTPandNewPassword = [
  body("otp")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be a 6-digit number"),
  body("password")
    .notEmpty()
    // .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  // sanitizeBody("otp").toInt(), // Sanitize OTP to an integer
  // sanitizeBody(["password", "confirmPassword"]).escape(), // Sanitize passwords
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log(validationErrors);
      return res.status(400).json({ errors: "Validation failed" });
    }
    next();
  },
];
module.exports = {
  menteeRegistrationRules,
  menteeLoginRules,
  checkMenteeOTPandNewPassword,
};
