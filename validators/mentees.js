const { body, validationResult } = require("express-validator");

const menteeRegistrationRules = [
  body("firstName").notEmpty().withMessage("First name is required").trim(),
  body("lastName").notEmpty().withMessage("Last name is required").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("phoneNumber").isNumeric().withMessage("Invalid phone number"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters"),
  //Input validation and sanitization
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: "Validation failed" });
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
      return res.status(400).json({ errors: "Validation failed" });
    }
    next();
  },
];
module.exports = { menteeRegistrationRules, menteeLoginRules };
