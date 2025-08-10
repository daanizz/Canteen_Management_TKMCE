import mongoose from "mongoose";

const orderModel=new mongoose.Schema({
    orderNumber:{
        type: Number,
        required:true,
        unique:true
    },
    customerId:{
        
    }
})