export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    let reply = "";

    const lowerMessage = message.toLowerCase();

    // Smart keyword-based AI
    if (lowerMessage.includes("react")) {
      reply = "React is a JavaScript library for building user interfaces. It uses components and hooks.";
    } 
    else if (lowerMessage.includes("node")) {
      reply = "Node.js allows you to run JavaScript on the server side.";
    } 
    else if (lowerMessage.includes("mongodb")) {
      reply = "MongoDB is a NoSQL database that stores data in JSON-like documents.";
    }
    else if (lowerMessage.includes("business")) {
      reply = "To build a strong business, focus on solving real problems and validating demand.";
    }
    else {
      reply = "Tell me more about what you want to learn, and I’ll guide you.";
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI server error." });
  }
};
