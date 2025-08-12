import express from 'express';
import dotenv from 'dotenv';
import { MongoConnection } from './configurations/dbConnection.js';
import path from 'path';
import {fileURLToPath} from 'url';


const app=express();
dotenv.config()

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.use(express.static(path.join(__dirname,'../frontend')));
app.get("/menu",(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/menu.html'));
})

app.get("/",(req,res)=>{
    res.send("<h1><marquee behavior=scroll direction=left>Hello This is canteen Management Sytem For TKMCE- by group-16 </marquee></h1>")
})

const PORT=process.env.PORT || 4500;//assigned port number
app.listen(PORT,()=>{
    MongoConnection()//called mongodb connection function from './configurations/dbConnection.js'
    console.log(`The server is running on:http://localhost:${PORT} (ctrl+click to open)`)
})