import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const conn_url= process.env.MONGO_URL!;
export default async function connectDatabase(): Promise<void>{
    try{
        await mongoose.connect(conn_url);
        console.log("DATABASE CONNECTED");
    } catch(error){
        console.log("Error connecting to MongoDB Atlas: ",error);
    }
};

export async function closeDatabaseConnection(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.log("Error disconnecting from MongoDB:", error);
    }
  }