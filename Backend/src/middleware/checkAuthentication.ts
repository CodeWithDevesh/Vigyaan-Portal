import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SERCRET as string

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({
        message: "User not Authenticated"
    });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({
            message: "Error while authenticating user"
        });
        next();
    });
};

export default authenticateToken