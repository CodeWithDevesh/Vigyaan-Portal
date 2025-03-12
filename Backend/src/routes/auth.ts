import express from "express";
import dotenv from "dotenv";
import { change_password, forgot_password, login, requestOTP, reset_password, signup, verify_otp } from "../controllers/auth.controller";
import authenticateToken from "../middleware/checkAuthentication";
dotenv.config();

const authRouter = express.Router();

// **Sign-up Route**
/*
todo:
 - Create a check for college mail ID compulsorily.
*/
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post('/verify-otp', verify_otp)
authRouter.post('/request-otp', requestOTP)
authRouter.post('/forgot-password', forgot_password)
authRouter.post('/reset-password', reset_password)
authRouter.post('/change-password',authenticateToken,change_password)

export default authRouter;
