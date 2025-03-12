import express, { Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./db/db";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/user";
import emailRouter from "./routes/email.route";

const app = express();
const PORT = 5000;
const corsOptions = {
  origin: "http://localhost:5173", // Allow all origins (Change this to a specific origin if needed)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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