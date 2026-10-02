import mongoose from "mongoose";
let connected: boolean = false;

const connectDb = async () => {
  mongoose.set("strictQuery", true);
  try {
    if (connected) {
      console.log("mongodb is connected");
      return;
    }
    if (!process.env.MONGODB_URI) {
      throw new Error("connection error.. no URI founded");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
