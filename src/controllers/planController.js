import Plan from "../models/Plan.js";

// Get all plans for a user
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ createdBy: req.user.id }).populate("skill");
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { title, description, skill, startDate, endDate } = req.body;
    const plan = new Plan({
      title,
      description,
      skill,
      startDate,
      endDate,
      createdBy: req.user.id,
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
