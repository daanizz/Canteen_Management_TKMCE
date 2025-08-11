import mongoose from "mongoose";

const ratingModel=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    itemId:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5]
    },
})


export default mongoose.model("Rating",ratingModel);