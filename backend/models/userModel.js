import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
      // unique: true,
    },
    admissionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Student", "Accountant", "professor", "Guest"],
    },
    department: {
      type: String,
      required: true,
      enum: [
        "CSE",
        "ECE",
        "MECH",
        "EEE",
        "CIVIL",
        "CHEM",
        "ARCH",
        "SPORTS",
        "OTHER",
        "MATH",
        "PHYSICS",
      ],
      default: "OTHER",
    },
  },
  {
    timestamps: true,
  }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("hashedPassword")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("users", userModel);
