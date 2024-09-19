import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';
import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/ApiError';
import bcrypt, { hash } from 'bcrypt';
import crypto from 'crypto';
import sendMail from '../utils/sendMail';
import { verifyGoogleIdToken } from '../utils/googleAuth';
require('dotenv').config();

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
        //create new user
        const hashedPassword = await bcrypt.hash(password, 15);
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        //generate a jwt
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ newUser, token });
    }
    catch (err){
        console.log(err);
        return (new ApiError('server error', 501));
    }
}

export const login = async (req:Request, res:Response, next:NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { email: email } });
        if (!user || !(await bcrypt.compare(password, user.password!))) {
            return next(new ApiError('Invalid email or password', 401));
        }

        //generate a jwt
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!process.env.REFRESH_TOKEN_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_KEY)

        res.status(201).json({ token, refreshToken });
    }
    catch(err) {
        if (err)
            return next(new ApiError('server error', 501))
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (!user)
            return next(new ApiError('user not found', 404));

    //Generate a 4-digit reset code
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    const message = `Your reset code is ${resetCode}`;
    console.log(resetCode);

    try {
        await sendMail({
            to: user.email,
            subject: 'Reset Password',
            text: message,
            html: `<p>Your password reset code is <strong>${resetCode}</strong></p>`
        })
        res.status(200).json({ message: "reset code sent successfully" });
    }
    catch (err){
        if (err)
            return next(new ApiError('error sending email', 400))
    }
}

export const verifyResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (!user)
            return (new ApiError('user not found', 404));

        const { resetCode } = req.body;
        if (!resetCode)
            return (new ApiError('reset code is required', 400));

        const hashedresetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        if (hashedresetCode !== user.resetCode) {
            return next(new ApiError('Wrong code', 400));
        }

        res.status(200).json({ message: "Rest code verfied successfully" });
    }
    catch (err) {
        console.error('Error verifying reset code:', err);
        return next(new ApiError('Server error', 500));
    }
}

export const googleAuth = async(req: Request, res: Response, next: NextFunction) => { 
    const { idToken } = req.body;
    await verifyGoogleIdToken(idToken);
    res.status(200).json({message: 'user created successfully'})
}