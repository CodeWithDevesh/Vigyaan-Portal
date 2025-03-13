import express, { Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./db/db";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/user";
import emailRouter from "./routes/email.route";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: "http://127.0.0.1:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  exposedHeaders: ["Set-Cookie"],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDatabase();

app.get('/api/2025',(req:Request,res:Response)=>{
    res.send("SERVER RESPONDING");
})
app.use('/vigyaanportal/v1/auth',authRouter);
app.use('/vigyaanportal/v1',projectsRouter);
app.use('/vigyaanportal/v1',emailRouter);
app.listen(PORT,()=>{
    console.log("Server Running at port 5000");
})