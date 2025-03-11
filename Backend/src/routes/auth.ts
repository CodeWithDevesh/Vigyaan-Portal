import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import { userModel, userOTPVerificationModel } from "../models/models";
import { sendOTP, transporter } from "../controllers/email";
dotenv.config();

const authRouter = express.Router();

// let transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//     auth: {
//         user: process.env.AUTH_EMAIL?.toString(),
//         pass: process.env.AUTH_PASS?.toString(),
//     }
// });

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
    const id = newUser._id;
    const token = jwt.sign({ userId: id }, process.env.JWT_TOKEN!, {
      expiresIn: "1h",
    });
    
    const otp_status= await sendOTP(email,id);
    if(otp_status){
      return res.status(201).json({
        message: "Sign-up Successful!",
        token,
        ok: true,
        otpStatus: otp_status
      });
    }
    return res.status(404).json({
      message: "Error sending the otp.",
      ok: false,
      otpStatus: otp_status
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


authRouter.post('/verify-otp',async (req: Request, res: Response): Promise<any> =>{
  const {otp,userId} = req.body;
  const user = await userOTPVerificationModel.findOne({userId});
  if(!user){
    return res.status(403).json({
      message: "Invalid User! Try Signing Up!",
      ok: false
    });
  }
  const verified = await bcrypt.compare(otp,user.otp!);
  if(verified){
    const time = Date.now();
    if(user.expiry!<=time){
      await userOTPVerificationModel.deleteOne({userId});
      return res.status(403).json({
        message: "OTP EXPIRED!",
        ok: false
      });
    }
    await userOTPVerificationModel.deleteOne({userId});
    const actualUser = await userModel.findById(userId);
    if(actualUser){
      await actualUser.updateOne({verified: true});
    }
    return res.status(200).json({
      message: "Email Verified Via OTP",
      ok: true
    });
  }
  //might implement deletion or adding a counter for invalid otp
  return res.status(403).json({
    message: "Invalid OTP",
    ok: false
  });
})

authRouter.post('/change-password',async (req: Request, res: Response): Promise<any> =>{
  const {email} = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found", ok: false });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour validity
  await user.save();
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: user.email,
    subject: "Password Reset",
    text: `Your password reset token is: ${resetToken}. It expires in 1 hour.`
  }
  await transporter.sendMail(mailOptions);
  res.json({ message: "Password reset email sent", ok: true });
})

authRouter.post('/reset-password',async (req: Request, res: Response): Promise<any> =>{

  const { token, newPassword } = req.body;

  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token", ok: false });
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT!);
  user.password = await bcrypt.hash(newPassword, saltRounds);

  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful!", ok: true });
})
export default authRouter;
