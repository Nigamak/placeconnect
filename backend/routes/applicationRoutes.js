import express from "express";
import Application from "../models/application.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/apply", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const { company, position } = req.body;
    if (typeof company !== "string" || typeof position !== "string" || !company.trim() || !position.trim()) {
      return res.status(400).json({ message: "Company and position are required" });
    }

    const newApplication = new Application({
      studentId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      company: company.trim(),
      position: position.trim(),
    });
    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Application submission failed:", error);
    res.status(500).json({ message: "Error submitting application" });
  }
});

router.get("/all", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const applications = await Application.find().populate("studentId", "name email roll_number");
    res.json(applications);
  } catch (error) {
    console.error("Application listing failed:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
});

router.get("/student/:studentId", authenticate, async (req, res) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.studentId) {
    return res.status(403).json({ message: "You do not have permission to view these applications" });
  }

  try {
    const applications = await Application.find({ studentId: req.params.studentId });
    res.json(applications);
  } catch (error) {
    console.error("Student application lookup failed:", error);
    res.status(500).json({ message: "Error fetching student applications" });
  }
});

router.put("/:id/status", authenticate, authorizeRoles("admin", "mentor"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["applied", "shortlisted", "interviewed", "selected", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application status updated", application });
  } catch (error) {
    console.error("Application status update failed:", error);
    res.status(500).json({ message: "Error updating application status" });
  }
});

export default router;
