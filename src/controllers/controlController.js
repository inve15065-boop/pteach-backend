import User from "../models/User.js";
import Plan from "../models/Plan.js";

// Get student access data
export const getControlData = async (req, res) => {
  try {
    const userId = req.user.id;
    const plans = await Plan.find({ createdBy: userId }).populate("skill");
    
    // For V1, only return allowed resources and plan steps
    const allowedResources = plans.map(p => ({
      planId: p._id,
      skill: p.skill?.title,
      steps: [
        // Mock steps — later can be loaded from PDFs or skill guides
        "Step 1: Learn basics",
        "Step 2: Do exercises",
        "Step 3: Build project"
      ]
    }));

    res.status(200).json({ allowedResources });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
