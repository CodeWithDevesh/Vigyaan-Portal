import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT=5000;
app.use(cors());
app.use(express.json());

app.get('/api/2025',(req:Request,res:Response)=>{
    res.send("SERVER RESPONDING");
})
app.listen(PORT,()=>{
    console.log("Server Running at port 5000");
})