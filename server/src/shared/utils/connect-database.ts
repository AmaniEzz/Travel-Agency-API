import config from "config";
import mongoose from "mongoose";

export async function connectToMongo() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.get<"string">("dbUri"));
    console.log(`🚀 Database connected successfully`);
  } catch (error) {
    throw new Error("Database Connection Failed");
  }
}
