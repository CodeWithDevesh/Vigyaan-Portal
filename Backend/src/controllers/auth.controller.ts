import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import { userModel, userOTPVerificationModel } from "../models/models";
import { sendOTP, transporter } from "../services/email.services";
dotenv.config();
const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, branch, grad_year } = req.body;

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
      grad_year,
    });
    await newUser.save();
    const id = newUser._id;
    const token = jwt.sign(
      { userId: id, role: "user" },
      process.env.JWT_TOKEN!,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // TODO: aim for https... so set it true later
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    return res.json({
      message: "Sign-up successful",
      ok: true,
    });

    // const otp_status = await sendOTP(email, id);
    // if (otp_status) {
    //   return res.status(201).json({
    //     message: "Sign-up Successful!",
    //     token,
    //     ok: true,
    //     otpStatus: otp_status,
    //   });
    // }
    // return res.status(404).json({
    //   message: "Error sending the otp.",
    //   ok: false,
    //   otpStatus: otp_status,
    // });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Sign-Up Failed!",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // console.log(email, password)

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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_TOKEN!,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // TODO: aim for https... so set it true later
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    return res.status(200).json({
      message: "Login Successful!",
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
};

const logout = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logout Successful!",
    ok: true,
  });
}

const verify_otp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { otp, userId } = req.body;
    if (!userId) {
      return res.status(403).json({
        message: "UserId required!",
        ok: false,
      });
    }
    const user = await userOTPVerificationModel.findOne({ userId });
    if (!user) {
      return res.status(403).json({
        message: "Invalid User! Try Signing Up!",
        ok: false,
      });
    }
    const verified = await bcrypt.compare(otp, user.otp!);
    if (verified) {
      const time = Date.now();
      if (user.expiry! <= time) {
        await userOTPVerificationModel.deleteOne({ userId });
        return res.status(403).json({
          message: "OTP EXPIRED!",
          ok: false,
        });
      }
      await userOTPVerificationModel.deleteOne({ userId });
      const actualUser = await userModel.findById(userId);
      if (actualUser) {
        await actualUser.updateOne({ verified: true });
      }
      return res.status(200).json({
        message: "Email Verified Via OTP",
        ok: true,
      });
    }
    //might implement deletion or adding a counter for invalid otp
    return res.status(403).json({
      message: "Invalid OTP",
      ok: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Some Error occurred",
      error: err,
      ok: false,
    });
  }
};

const forgot_password = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
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
    text: `Your password reset token is: ${resetToken}. It expires in 1 hour.`,
  };
  await transporter.sendMail(mailOptions);
  res.json({ message: "Password reset email sent", ok: true });
};
const reset_password = async (req: Request, res: Response): Promise<any> => {
  const { token, newPassword } = req.body;

  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired token", ok: false });
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT!);
  user.password = await bcrypt.hash(newPassword, saltRounds);

  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful!", ok: true });
};
interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}
const change_password = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { old_pass, new_pass } = req.body;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        ok: false,
      });
    }
    const verifypass = await bcrypt.compare(old_pass, user.password);
    if (!verifypass) {
      return res.status(403).json({
        message: "Invalid Password",
        ok: false,
      });
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT!);
    const hashedPassword = await bcrypt.hash(new_pass, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return res.status(201).json({
      message: "Password Changed Successfully!",
      ok: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some Error occurred",
      error: err,
      ok: false,
    });
  }
};

const requestOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const present = await userModel.findOne({ email });
    if (!present) throw new Error("User not found");
    const id = present._id;
    await sendOTP(email, id);
    res.status(200).json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error while sending OTP",
      error: err instanceof Error ? err.message : String(err),
      ok: false,
    });
  }
};

export {
  signup,
  login,
  logout,
  verify_otp,
  forgot_password,
  reset_password,
  change_password,
  requestOTP,
};
