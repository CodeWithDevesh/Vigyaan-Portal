import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { userModel, userOTPVerificationModel } from "../models/models";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

dotenv.config();

const authRouter = express.Router();

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
});
// **Sign-up Route** 
/*
todo:
 - Create a check for college mail ID compulsorily.
 -otp verification via email
*/
authRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, branch, sem } = req.body;

    const present = await userModel.findOne({ email });
    if (present) {
      return res.status(403).json({
        message: "User already exists! Try Signing in.",
        ok: false,
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT!);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      branch,
      sem,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN!, {
      expiresIn: "1h",
    });
    await sendOTP(email,res,newUser._id);
    return res.status(201).json({
      message: "Sign-up Successful!",
      token,
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Sign-Up Failed!",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
});

authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User Not Found",
        ok: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Invalid Credentials",
        ok: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN!, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login Successful!",
      token,
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Login Failed!",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
});

const sendOTP = async(email: string,res: Response, _id: mongoose.Types.ObjectId)=>{
    try{
        const otp: string = `${Math.floor(100000 + Math.random() * 900000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email: NITRR VIGYAAN",
            html: `<p>Your OTP: <b>${otp}</b>.</p><p>This otp expires in 2 mins.</p>`
        };
        const saltRounds = parseInt(process.env.BCRYPT_SALT!);
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTP = new userOTPVerificationModel({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiry: Date.now()+120000,
        });
        await newOTP.save();
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "OTP SENT! VERIFICATION PENDING.",
            ok: true
        })
    }catch(err){
        return res.json({
            message: "ERROR SENDING OTP",
            ok: false,
            error: "Error: "+err
        })
    }
};
authRouter.post('/verify-otp',async (req: Request, res: Response): Promise<any> =>{
//todo
})
authRouter.post('/forgot-password',async (req: Request, res: Response): Promise<any> =>{
//todo: email services for verification
})

export default authRouter;
