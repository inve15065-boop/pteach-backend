/**
 * Auth validation middleware - validates input before DB operations.
 * Keeps validation out of model layer and controller business logic.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < MIN_NAME_LENGTH) {
    errors.push("Name is required and must be at least 2 characters.");
  }
  if (!email || typeof email !== "string") {
    errors.push("Email is required.");
  } else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    errors.push("Invalid email format.");
  }
  if (!password || typeof password !== "string") {
    errors.push("Password is required.");
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Password is required." });
  }
  next();
};
