const { body, validationResult } = require("express-validator");

const moderatorLoginRules = [
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
module.exports = {
  moderatorLoginRules,
};
