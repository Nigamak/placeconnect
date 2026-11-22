import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/student.js";
import { authenticate, createAuthToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !["student", "mentor", "admin"].includes(role)
  ) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  try {
    const user = await Student.findOne({ email: email.trim().toLowerCase(), role }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: createAuthToken(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
