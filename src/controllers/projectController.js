import { generateCodeProject } from "../utils/codeGenerator.js";

// Controller delegates to utils layer
export const generateProject = async (req, res) => {
  try {
    const { skill, topic } = req.body;
    if (!skill || typeof skill !== "string" || !skill.trim()) {
      return res.status(400).json({ message: "Skill is required." });
    }
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const code = await generateCodeProject(skill.trim(), topic.trim());
    res.status(200).json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate project" });
  }
};
