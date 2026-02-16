import SkillResource from "../models/SkillResource.js";

// Mock AI function to generate code
const generateCodeProject = async (skill, topic) => {
  // In real implementation, call OpenAI/Kiro API here
  if (skill.toLowerCase() === "web development") {
    return `
<!DOCTYPE html>
<html>
  <head>
    <title>${topic}</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>${topic} Project</h1>
    <p>This is an auto-generated web project for ${skill}.</p>
  </body>
</html>
`;
  } else {
    return `// Example project for ${skill}: ${topic}\nconsole.log("Hello World!");`;
  }
};

// Controller to return project code
export const generateProject = async (req, res) => {
  try {
    const { skill, topic } = req.body;
    if (!skill || !topic)
      return res.status(400).json({ message: "Skill and topic are required" });

    const code = await generateCodeProject(skill, topic);
    res.status(200).json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate project" });
  }
};
