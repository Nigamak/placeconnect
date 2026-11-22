import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/student.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { name, roll_number, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof roll_number !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !roll_number.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({ message: "Enter all fields and use a password with at least 8 characters" });
    }

    const newStudent = new Student({
      name,
      roll_number,
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: "student",
    });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A student with that email already exists" });
    }
    console.error("Student registration failed:", error);
    res.status(500).json({ message: "Error adding student" });
  }
});

router.get("/all", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const students = await Student.find().select("name roll_number email role");
    res.json(students);
  } catch (error) {
    console.error("Student listing failed:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

export default router;
