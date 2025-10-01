
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongoConnection } from './configurations/dbConnection.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// API Routes
app.use('/api/items', itemRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Page routes
app.get("/menu", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/menu.html'));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get("/", (req, res) => {
    res.send("<h1><marquee behavior=scroll direction=left>Hello This is canteen Management System For TKMCE- by group-16 </marquee></h1>");
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    MongoConnection();
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`User Dashboard: http://localhost:${PORT}/menu`);
    console.log(`Admin Portal: http://localhost:${PORT}/admin`);
    console.log(`API: http://localhost:${PORT}/api/items`);
});

