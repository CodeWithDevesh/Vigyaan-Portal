import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { userModel } from "../models/models";
dotenv.config();
interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

const userCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if(req.role==="user"){
        res.status(403).json({
            message: "Unauthenticated Request!",
            ok: false
        })
        return;
    }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid token!", ok: false });
    return;
  }
};

export default userCheck;
