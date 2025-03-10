import express, { Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./db/db";
import authRouter from "./routes/auth";

const app = express();
const PORT=5000;
app.use(cors());
app.use(express.json());

connectDatabase();

app.get('/api/2025',(req:Request,res:Response)=>{
    res.send("SERVER RESPONDING");
})
app.use('/vigyaanportal/v1/auth',authRouter);
app.listen(PORT,()=>{
    console.log("Server Running at port 5000");
})