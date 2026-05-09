import Config from "./config.js";
import mongoose from "mongoose";

const connectDB = async () => {
   await mongoose.connect(Config.MONGO_URI)
   .then(() => {
    console.log("Connected to MongoDB");
   })
    
}

export default connectDB;