export const askAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a helpful tutor focused on programming and business skills. Give concise, accurate answers. When code is helpful, include minimal examples." },
              { role: "user", content: question },
            ],
            temperature: 0.7,
          }),
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Upstream AI failed: ${text}`);
        }
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content?.trim() || "I couldn't generate an answer.";
        return res.json({ reply, provider: "openai", model });
      } catch (e) {
        // Fall back to keyword responder if OpenAI fails
        console.error("OpenAI error:", e.message);
      }
    }

    let reply = "";
    const lowerMessage = question.toLowerCase();
    if (lowerMessage.includes("react")) {
      reply = "React is a JavaScript library for building user interfaces. It uses components and hooks.";
    } else if (lowerMessage.includes("node")) {
      reply = "Node.js allows you to run JavaScript on the server side.";
    } else if (lowerMessage.includes("mongodb")) {
      reply = "MongoDB is a NoSQL database that stores data in JSON-like documents.";
    } else if (lowerMessage.includes("business")) {
      reply = "To build a strong business, focus on solving real problems and validating demand.";
    } else {
      reply = "Tell me more about what you want to learn, and I’ll guide you.";
    }
    return res.json({ reply, provider: "keyword" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI server error." });
  }
};
