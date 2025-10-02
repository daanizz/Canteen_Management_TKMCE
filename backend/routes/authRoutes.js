import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

// SIGNUP (Create Account)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, admissionNumber, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create new user (password will be hashed automatically by pre-save hook)
    const newUser = new User({
      name,
      email,
      hashedPassword: password,  // IMPORTANT: assign plain password here, hook will hash
      admissionNumber,
      role,
      department
    });

    await newUser.save();

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
