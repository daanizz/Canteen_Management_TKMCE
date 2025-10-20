import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { MongoConnection } from "./configurations/dbConnection.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/AdminRoute.js";
import orderRoutes from "./routes/orderRoute.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// Static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Page routes
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/menu.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/order_history", (req, res) => {
  console.log("📄 Serving order_history.html");
  res.sendFile(path.join(__dirname, "../frontend/order_history.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  MongoConnection();
  console.log(`Server running on: http://localhost:${PORT}`);
});
