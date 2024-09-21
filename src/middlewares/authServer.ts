import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from './ApiError';
require('dotenv').config();

export const authenticateToken = (req:Request, res:Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token)
        return next(new ApiError('Access denied, token missing!', 403));

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err)
            return next(new ApiError('Invalid token', 403));

        req.user = user;
        next();
    })
}