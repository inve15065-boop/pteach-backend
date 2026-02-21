import CommunityMessage from "../models/CommunityMessage.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { skill, message } = req.body;
    if (!skill || typeof skill !== "string" || skill.trim().length < 2) {
      return res.status(400).json({ message: "Skill is required and must be at least 2 characters." });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required." });
    }
    if (message.length > 1000) {
      return res.status(400).json({ message: "Message is too long." });
    }
    const userId = req.user.id;

    if (!skill || !message) {
      return res.status(400).json({
        message: "Skill and message are required."
      });
    }

    const newMessage = await CommunityMessage.create({
      sender: userId,
      skill,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully.",
      data: newMessage,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error sending message."
    });
  }
};

// Get messages for a specific skill
export const getMessages = async (req, res) => {
  try {
    const { skill } = req.params;

    const messages = await CommunityMessage.find({ skill })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ messages });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error fetching messages."
    });
  }
};
