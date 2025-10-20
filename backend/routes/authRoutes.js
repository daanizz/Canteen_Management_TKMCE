// export default router;
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, admissionNumber, role, department } =
      req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email,
      hashedPassword: password, // pre-save hook hashes this
      admissionNumber,
      role,
      department,
    });

    await newUser.save();
    return res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FETCH USER BY ID
router.post("/user", async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    res.status(200).json({ message: "User found", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
