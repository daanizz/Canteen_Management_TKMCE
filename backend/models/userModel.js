import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    hashedPassword:{
        type:String,
        required:true,
        unique:true
    },
    admissionNumber:{
        type:Number,
        required:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        enum:["Student","Accountant","professor","Guest"]
    },
    department:{
        type:String,
        required:true,
        enum:["CSE","ECE","MECH","EEE","CIVIL","CHEM","ARCH","SPORTS","OTHER","MATH","PHYSICS"],
        default:"OTHER"
    }
},
{
    timestamps:true
}
)

//bcrypt password hashing middleware to be added here...

export default userModel=mongoose.model("User",userModel)