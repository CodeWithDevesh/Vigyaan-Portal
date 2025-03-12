import { Request, Response } from "express";
import dotenv from "dotenv";
import {transporter } from "../services/email.services";
import { userModel } from "../models/models";
dotenv.config();

interface AuthenticatedRequest extends Request {
    userId?: string;
    role?: string;
}

export const sendMail = async (req: AuthenticatedRequest, res: Response): Promise<any> =>{
    try{
    const {to, subject, message} = req.body;
    const sender = await userModel.findById(req.userId);
    const mailOptions = {
        from: sender?.email,
        to: to,
        subject: subject,
        html: message
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
        message: "Email Sent Successfully!",
        ok: true
    })} catch(err){
        return res.status(404).json({
            message: "Some error occurred.",
            ok: false,
            error: err
        })
    }
}