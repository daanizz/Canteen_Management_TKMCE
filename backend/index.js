import express from 'express';
import dotenv from 'dotenv';
import { MongoConnection } from './configurations/dbConnection.js';


const app=express();
dotenv.config()

const PORT=process.env.PORT || 4500;
app.listen(PORT,()=>{
    MongoConnection()
    console.log(`The server is running on:http://localhost:${PORT} (ctrl+click to open)`)
})