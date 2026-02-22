/**
 * Seed 50 predefined skills for the skill selection system.
 * Run: node src/scripts/seedPredefinedSkills.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Skill from "../models/Skill.js";

dotenv.config();

const PREDEFINED_SKILLS = [
  { order: 1, title: "Basic Computer & Digital Skills", level: "Beginner", duration: "1 mo", icon: "🔹" },
  { order: 2, title: "Office Productivity & Admin Tools", level: "Intermediate", duration: "1 mo", icon: "🔹" },
  { order: 3, title: "Receptionist / Registrar / Cashier Training", level: "Intermediate", duration: "1 mo", icon: "🔹" },
  { order: 4, title: "Modern Graphic Design & Branding", level: "Intermediate", duration: "2 mo", icon: "🎨" },
  { order: 5, title: "Modern Video Editing & Motion Graphics", level: "Intermediate", duration: "2 mo", icon: "🎬" },
  { order: 6, title: "No-Code Development", level: "Intermediate", duration: "2 mo", icon: "⚡" },
  { order: 7, title: "Full-Stack Software Development", level: "Advanced", duration: "6 mo", icon: "💻" },
  { order: 8, title: "Cloud Computing & Firebase / AWS", level: "Advanced", duration: "2 mo", icon: "☁️" },
  { order: 9, title: "AI Development & Automation", level: "Advanced", duration: "3 mo", icon: "🤖" },
  { order: 10, title: "Cybersecurity & Ethical Hacking", level: "Professional", duration: "3 mo", icon: "🛡️" },
  { order: 11, title: "Business & Startup Management", level: "Intermediate", duration: "1 mo", icon: "💼" },
  { order: 12, title: "Important Demand Skill Training", level: "Intermediate", duration: "1–2 mo", icon: "🧠" },
  { order: 13, title: "Data Analytics & Power BI", level: "Beginner → Intermediate", duration: "4 wk", icon: "📊" },
  { order: 14, title: "Digital Marketing & Social Media Growth", level: "Beginner → Intermediate", duration: "4 wk", icon: "📢" },
  { order: 15, title: "Web Design & Hosting", level: "Beginner → Intermediate", duration: "4 wk", icon: "🌐" },
  { order: 16, title: "Networking & CCTV Installation", level: "Beginner → Intermediate", duration: "3 wk", icon: "🔧" },
  { order: 17, title: "Cybersecurity & Ethical Hacking", level: "Intermediate", duration: "5 wk", icon: "🛡️" },
  { order: 18, title: "AI & Automation Engineer", level: "Beginner → Intermediate", duration: "4–6 wk", icon: "🤖" },
  { order: 19, title: "Machine Learning & Data Science", level: "Intermediate → Advanced", duration: "6 wk", icon: "🤖" },
  { order: 20, title: "Robotics & IoT", level: "Intermediate", duration: "4 wk", icon: "⚙️" },
  { order: 21, title: "Startup Incubation & Business Leadership", level: "Advanced", duration: "4 wk", icon: "💼" },
  { order: 22, title: "Software Development (Full Stack: Web & Mobile)", level: "Advanced", duration: "6 mo", icon: "💻" },
  { order: 23, title: "Online Business & E-Commerce", level: "Intermediate", duration: "2 mo", icon: "📈" },
  { order: 24, title: "E-Commerce & Delivery Systems", level: "Intermediate", duration: "1 mo", icon: "📦" },
  { order: 25, title: "Graphic Design & Multimedia", level: "Intermediate", duration: "2 mo", icon: "🎨" },
  { order: 26, title: "Technical Repair & Maintenance", level: "Intermediate", duration: "3 wk", icon: "🔧" },
  { order: 27, title: "E-Commerce Product Photography", level: "Beginner → Intermediate", duration: "4 wk", icon: "📸" },
  { order: 28, title: "Digital Accounting & POS Management", level: "Intermediate", duration: "4 wk", icon: "💼" },
  { order: 29, title: "Mobile Phone Repair & Software Flashing", level: "Beginner → Intermediate", duration: "4 wk", icon: "🔧" },
  { order: 30, title: "Digital ID, Passport Photo & Mini Studio Setup", level: "Beginner", duration: "3 wk", icon: "⚡" },
  { order: 31, title: "Real Estate Digital Marketing & Listing Creation", level: "Intermediate", duration: "4 wk", icon: "📢" },
  { order: 32, title: "Social Media Page Management", level: "Intermediate", duration: "4 wk", icon: "📈" },
  { order: 33, title: "Cyber Hygiene & Tech Support for Businesses", level: "Intermediate", duration: "3 wk", icon: "🛡️" },
  { order: 34, title: "Personal Branding & Influencer Starter", level: "Beginner → Intermediate", duration: "4 wk", icon: "✨" },
  { order: 35, title: "Global Virtual Assistant", level: "Intermediate", duration: "4 wk", icon: "🌍" },
  { order: 36, title: "Dropshipping & Mini Import (Africa Model)", level: "Intermediate", duration: "4 wk", icon: "📦" },
  { order: 37, title: "Freelancing Accelerator", level: "Intermediate", duration: "4 wk", icon: "💼" },
  { order: 38, title: "Productivity, Life Skills & Performance Mastery", level: "Intermediate", duration: "4 wk", icon: "🧠" },
  { order: 39, title: "Creative Thinking & Innovation Lab", level: "Intermediate", duration: "4 wk", icon: "🧠" },
  { order: 40, title: "Digital Creativity & Content Mastery", level: "Intermediate–Advanced", duration: "6 wk", icon: "🎬" },
  { order: 41, title: "AI Creativity & Generative Design Mastery", level: "Intermediate–Advanced", duration: "6 wk", icon: "🤖" },
  { order: 42, title: "Innovation & Product Design Engineering Lab", level: "Advanced", duration: "4 wk", icon: "🧠" },
  { order: 43, title: "Creative Coding & Interactive Experience Design", level: "Intermediate", duration: "5 wk", icon: "💻" },
  { order: 44, title: "BioTech & Digital Health Basics", level: "Intermediate", duration: "1 mo", icon: "🧬" },
  { order: 45, title: "Game Development & 3D World Building", level: "Beginner → Intermediate", duration: "6 wk", icon: "🎮" },
  { order: 46, title: "Creativity Engineering & Innovative Thinking", level: "Intermediate → Advanced", duration: "1 mo", icon: "🧠" },
  { order: 47, title: "Future Tech Innovation & Foresight Masterclass", level: "Intermediate–Advanced", duration: "4 wk", icon: "⚡" },
  { order: 48, title: "Quantum Computing & Advanced Future Systems", level: "Advanced → Future Expert", duration: "1 mo", icon: "🧠" },
  { order: 49, title: "Global CEO Leadership & Mega-Business Strategy", level: "Advanced Leadership", duration: "1 mo", icon: "👑" },
  { order: 50, title: "AGI Systems & World Automation Architecture", level: "Ultra-Advanced", duration: "6 wk", icon: "🤖" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pteach");
    console.log("MongoDB connected");

    for (const s of PREDEFINED_SKILLS) {
      await Skill.findOneAndUpdate(
        { title: s.title, isPredefined: true },
        { ...s, isPredefined: true, description: `Learn ${s.title} from beginner to advanced.` },
        { upsert: true }
      );
    }
    console.log("✅ Seeded 50 predefined skills");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
