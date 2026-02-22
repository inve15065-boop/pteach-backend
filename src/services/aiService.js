/**
 * Adaptive AI Service - builds personalized context from user data
 */
import Plan from "../models/Plan.js";
import PlanStep from "../models/PlanStep.js";
import PlanCompletion from "../models/PlanCompletion.js";
import History from "../models/History.js";

export async function getAdaptiveContext(userId, skillTitle) {
  try {
    const [plans, completions, recentHistory] = await Promise.all([
      Plan.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] }).populate("skill").limit(5),
      PlanCompletion.find({ user: userId, completed: true }).countDocuments(),
      History.find({ user: userId, type: "plan_completion" }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const planContext = plans.map((p) => {
      const stepsTotal = 0;
      return { title: p.title, skill: p.skill?.title };
    });

    let context = `You are a helpful tutor. The student is learning: ${skillTitle || "general skills"}. `;
    if (planContext.length > 0) {
      context += `Their active plans: ${planContext.map((c) => c.title).join(", ")}. `;
    }
    if (completions > 0) {
      context += `They have completed ${completions} plan steps. `;
    }
    context += "Adapt your teaching: if they complete quickly, accelerate; if they struggle, slow down and reinforce. Give concise, practical answers with examples when helpful.";

    return context;
  } catch (err) {
    return `You are a helpful tutor. The student is learning: ${skillTitle || "general skills"}. Give concise, practical answers.`;
  }
}
