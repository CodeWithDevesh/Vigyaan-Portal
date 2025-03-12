import nodemailer from "nodemailer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userOTPVerificationModel } from "../models/models";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
const sendOTP = async(email: string, _id: mongoose.Types.ObjectId): Promise<Boolean>=>{
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
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
};


export {
    sendOTP,
    transporter
}