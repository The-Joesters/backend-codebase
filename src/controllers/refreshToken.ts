import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/ApiError';
require('dotenv').config();

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new ApiError('Access denied, token missing!', 403));
    }

    if (!process.env.REFRESH_TOKEN_KEY) {
        throw new Error('REFRESH_TOKEN_KEY is not defined');
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_KEY, (err, user) => {
        if (err) {
            return next(new ApiError('Invalid refresh token', 403));
        }
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        if (!user)
            throw new Error('Token Error');

        const accessToken = jwt.sign({ userID: (user as jwt.JwtPayload).userid }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ accessToken });
    })
}