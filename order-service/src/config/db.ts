import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connectToMongoDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URL;
  try {
    if (mongoURI) await mongoose.connect(mongoURI);
    console.log("Connected to Order MongoDB ");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
