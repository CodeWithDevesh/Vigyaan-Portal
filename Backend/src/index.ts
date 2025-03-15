import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import connectDatabase from "./db/db";
import { Db } from "mongodb";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/user";
import emailRouter from "./routes/email.route";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";
import dotevn from "dotenv";
dotevn.config();
const firebaseKeys: string = process.env.FIREBASE_LOCATION as string;
let firebaseAdmin: admin.app.App;
const initializeFirebase = async () => {
  try {
    const serviceAccount = await import(firebaseKeys);
    const firebaseAdminConfig: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "technocracy-97aab.appspot.com",
    };
    firebaseAdmin = admin.initializeApp(firebaseAdminConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error(`Error initializing Firebase: ${error}`);
  }
};

initializeFirebase();
connectDatabase();

export interface CustomRequest extends Request {
  db?: Db | null;
  admin?: admin.app.App;
  userId?: string;
  role?: string;
}
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
app.use((req: CustomRequest, res: Response, next: NextFunction)=>{
  req.admin = firebaseAdmin,
  next();
})

app.get('/api/2025',(req:Request,res:Response)=>{
    res.send("SERVER RESPONDING");
})
app.use('/vigyaanportal/v1/auth',authRouter);
app.use('/vigyaanportal/v1',projectsRouter);
app.use('/vigyaanportal/v1',emailRouter);
app.listen(PORT,()=>{
    console.log("Server Running at port 5000");
})