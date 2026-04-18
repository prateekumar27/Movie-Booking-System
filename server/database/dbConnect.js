import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_REPLICA_STRING);
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
