import express from "express";
import dotenv from "dotenv";
import { sendMail } from "../controllers/mail.controller";
import authenticateToken from "../middleware/checkAuthentication";
dotenv.config();

const emailRouter = express.Router();

emailRouter.post('/notifications/email',authenticateToken, sendMail);
export default emailRouter;