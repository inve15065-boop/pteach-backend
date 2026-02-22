import History from "../models/History.js";

export const logHistory = async (userId, type, metadata = {}, description = "") => {
  try {
    await History.create({ user: userId, type, metadata, description });
  } catch (err) {
    console.error("History log failed:", err.message);
  }
};
