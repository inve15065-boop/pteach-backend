import mongoose from "mongoose";
import Plan from "../models/Plan.js";
import { logHistory } from "../utils/historyLogger.js";
import PlanStep from "../models/PlanStep.js";
import PlanCompletion from "../models/PlanCompletion.js";
import Skill from "../models/Skill.js";

// Validation helper - keeps validation out of model layer
const validatePlanInput = (body, isUpdate = false) => {
  const { title, description, skill, startDate, endDate } = body;
  if (!isUpdate && (!title || typeof title !== "string" || title.trim().length < 2)) {
    return { valid: false, message: "Title is required and must be at least 2 characters." };
  }
  if (isUpdate && title !== undefined && (typeof title !== "string" || title.trim().length < 2)) {
    return { valid: false, message: "Title must be at least 2 characters." };
  }
  if (!isUpdate && (!skill || !mongoose.Types.ObjectId.isValid(skill))) {
    return { valid: false, message: "A valid skill id is required." };
  }
  if (isUpdate && skill !== undefined && !mongoose.Types.ObjectId.isValid(skill)) {
    return { valid: false, message: "Invalid skill id." };
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    return { valid: false, message: "Description must be a string." };
  }
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (start && isNaN(start.getTime())) {
    return { valid: false, message: "Invalid startDate." };
  }
  if (end && isNaN(end.getTime())) {
    return { valid: false, message: "Invalid endDate." };
  }
  if (start && end && end < start) {
    return { valid: false, message: "endDate cannot be before startDate." };
  }
  return { valid: true };
};

// Get all plans for a user (own or assigned)
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    }).populate("skill");
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single plan by id
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const plan = await Plan.findOne({
      _id: id,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    }).populate("skill");
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    const steps = await PlanStep.find({ plan: id }).sort({ month: 1, week: 1, day: 1, order: 1 });
    const completionCount = await PlanCompletion.countDocuments({ plan: id, user: req.user.id, completed: true });
    res.status(200).json({
      ...plan.toObject(),
      steps,
      completedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const validation = validatePlanInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    const { title, description, skill, startDate, endDate, timePerSessionMinutes, reminderTime, reminderEnabled } = req.body;
    const skillDoc = await Skill.findOne({
      _id: skill,
      $or: [{ createdBy: req.user.id }, { isPredefined: true }],
    });
    if (!skillDoc) {
      return res.status(404).json({ message: "Skill not found." });
    }
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const plan = new Plan({
      title: title.trim(),
      description: description?.trim() || undefined,
      skill,
      startDate: start,
      endDate: end,
      timePerSessionMinutes: timePerSessionMinutes ?? 30,
      reminderTime: reminderTime || undefined,
      reminderEnabled: !!reminderEnabled,
      createdBy: req.user.id,
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const validation = validatePlanInput(req.body, true);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    const plan = await Plan.findOne({ _id: id, createdBy: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }
    if (req.body.skill !== undefined) {
      const skillDoc = await Skill.findOne({
        _id: req.body.skill,
        $or: [{ createdBy: req.user.id }, { isPredefined: true }],
      });
      if (!skillDoc) return res.status(404).json({ message: "Skill not found." });
      plan.skill = req.body.skill;
    }
    if (req.body.title !== undefined) plan.title = req.body.title.trim();
    if (req.body.description !== undefined) plan.description = req.body.description?.trim() || "";
    if (req.body.startDate !== undefined) plan.startDate = req.body.startDate ? new Date(req.body.startDate) : undefined;
    if (req.body.endDate !== undefined) plan.endDate = req.body.endDate ? new Date(req.body.endDate) : undefined;
    if (req.body.timePerSessionMinutes !== undefined) plan.timePerSessionMinutes = req.body.timePerSessionMinutes;
    if (req.body.reminderTime !== undefined) plan.reminderTime = req.body.reminderTime || undefined;
    if (req.body.reminderEnabled !== undefined) plan.reminderEnabled = !!req.body.reminderEnabled;
    await plan.save();
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const plan = await Plan.findOne({ _id: id, createdBy: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    await PlanStep.deleteMany({ plan: id });
    await PlanCompletion.deleteMany({ plan: id });
    await Plan.findByIdAndDelete(id);
    res.status(200).json({ message: "Plan deleted.", id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Plan steps
export const getPlanSteps = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const plan = await Plan.findOne({
      _id: id,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    });
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    const steps = await PlanStep.find({ plan: id }).sort({ month: 1, week: 1, day: 1, order: 1 });
    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addPlanStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, week, month, learningTopic, durationMinutes, order } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const plan = await Plan.findOne({ _id: id, createdBy: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    if (!learningTopic || typeof learningTopic !== "string" || learningTopic.trim().length < 1) {
      return res.status(400).json({ message: "Learning topic is required." });
    }
    const step = new PlanStep({
      plan: id,
      day: day ?? 1,
      week: week ?? 1,
      month: month ?? 1,
      learningTopic: learningTopic.trim(),
      durationMinutes: durationMinutes ?? 30,
      order: order ?? 0,
    });
    await step.save();
    res.status(201).json(step);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const togglePlanStepComplete = async (req, res) => {
  try {
    const { id, stepId } = req.params;
    const { completed, note } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(stepId)) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const plan = await Plan.findOne({
      _id: id,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    });
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    const step = await PlanStep.findOne({ _id: stepId, plan: id });
    if (!step) return res.status(404).json({ message: "Step not found." });

    step.completed = completed !== undefined ? !!completed : !step.completed;
    step.completedAt = step.completed ? new Date() : null;
    if (note !== undefined) step.note = String(note).trim() || undefined;
    await step.save();

    await PlanCompletion.findOneAndUpdate(
      { plan: id, planStep: stepId, user: req.user.id },
      {
        plan: id,
        planStep: stepId,
        user: req.user.id,
        completed: step.completed,
        completedAt: step.completedAt,
        note: step.note,
      },
      { upsert: true }
    );
    logHistory(req.user.id, "plan_completion", { plan: id, stepId, completed: step.completed }, `Plan step ${step.completed ? "completed" : "incomplete"}`).catch(() => {});

    res.status(200).json(step);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Completion analytics for a plan
export const getPlanAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }
    const plan = await Plan.findOne({
      _id: id,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    });
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    const total = await PlanStep.countDocuments({ plan: id });
    const completed = await PlanStep.countDocuments({ plan: id, completed: true });
    res.status(200).json({ total, completed, rate: total ? Math.round((completed / total) * 100) : 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
