import mongoose from 'mongoose';

export const MongoConnection = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check your .env file');
        }

        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connection established successfully");
        
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        throw error;
    }
}