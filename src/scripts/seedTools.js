/**
 * Seed tools for key predefined skills.
 * Run: node src/scripts/seedTools.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Skill from "../models/Skill.js";
import Tool from "../models/Tool.js";

dotenv.config();

const TOOL_MAPPINGS = {
  "Full-Stack Software Development": [
    { name: "VS Code", downloadUrl: "https://code.visualstudio.com/", order: 1 },
    { name: "Node.js", downloadUrl: "https://nodejs.org/", order: 2 },
    { name: "Git", downloadUrl: "https://git-scm.com/", order: 3 },
    { name: "MongoDB", downloadUrl: "https://www.mongodb.com/try/download/community", order: 4 },
    { name: "Postman", downloadUrl: "https://www.postman.com/downloads/", order: 5 },
  ],
  "Web Design & Hosting": [
    { name: "VS Code", downloadUrl: "https://code.visualstudio.com/", order: 1 },
    { name: "Figma", downloadUrl: "https://www.figma.com/downloads/", order: 2 },
    { name: "Git", downloadUrl: "https://git-scm.com/", order: 3 },
  ],
  "Modern Graphic Design & Branding": [
    { name: "Canva", downloadUrl: "https://www.canva.com/", order: 1 },
    { name: "Adobe Photoshop", downloadUrl: "https://www.adobe.com/products/photoshop.html", order: 2 },
    { name: "Figma", downloadUrl: "https://www.figma.com/downloads/", order: 3 },
  ],
  "AI Development & Automation": [
    { name: "Python", downloadUrl: "https://www.python.org/downloads/", order: 1 },
    { name: "VS Code", downloadUrl: "https://code.visualstudio.com/", order: 2 },
    { name: "Git", downloadUrl: "https://git-scm.com/", order: 3 },
  ],
  "Data Analytics & Power BI": [
    { name: "Power BI Desktop", downloadUrl: "https://powerbi.microsoft.com/downloads/", order: 1 },
    { name: "Excel", downloadUrl: "https://www.microsoft.com/excel", order: 2 },
  ],
  "Digital Marketing & Social Media Growth": [
    { name: "Meta Business Suite", downloadUrl: "https://business.facebook.com/", order: 1 },
    { name: "Canva", downloadUrl: "https://www.canva.com/", order: 2 },
    { name: "Google Analytics", downloadUrl: "https://analytics.google.com/", order: 3 },
  ],
  "No-Code Development": [
    { name: "Webflow", downloadUrl: "https://webflow.com/", order: 1 },
    { name: "Bubble", downloadUrl: "https://bubble.io/", order: 2 },
    { name: "Airtable", downloadUrl: "https://airtable.com/", order: 3 },
  ],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pteach");
    for (const [skillTitle, tools] of Object.entries(TOOL_MAPPINGS)) {
      const skill = await Skill.findOne({ title: skillTitle, isPredefined: true });
      if (!skill) continue;
      for (const t of tools) {
        await Tool.findOneAndUpdate(
          { skill: skill._id, name: t.name },
          { ...t, skill: skill._id },
          { upsert: true }
        );
      }
    }
    console.log("✅ Seeded tools for skills");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
