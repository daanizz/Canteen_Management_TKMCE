import mongoose from 'mongoose';
//mongodb connection establishment code..
export const MongoConnection=async()=>{
    try {
        const mongolink=await mongoose.connect(process.env.MONGO_URI);//process.env.MONGO_URI-retrieves the connection string stored in .env
        console.log("Mongodb Connection established.. :)");
    } catch (error) {
        console.log("Error in MongoDb connection(related to connection with mongodb server, pls check your internet connection),error:",error);
    }
}