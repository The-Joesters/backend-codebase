import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendMail from '../utils/sendMail';
import { handleGoogleAuth } from '../utils/googleAuth';
require('dotenv').config();

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, age, gender, preferedStreak, character_id } = req.body;
    try {
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 15);
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Generate a JWT
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: 'JWT_SECRET_KEY is not defined' });
        }
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ newUser, token });
    } catch (err) {
        console.error('Error in signUp:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { email: email } });
        if (!user || !(await bcrypt.compare(password, user.password!))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: 'JWT_SECRET_KEY is not defined' });
        }
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!process.env.REFRESH_TOKEN_KEY) {
            return res.status(500).json({ message: 'REFRESH_TOKEN_KEY is not defined' });
        }
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_KEY);

        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 4-digit reset code
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        const message = `Your reset code is ${resetCode}`;

        await prisma.users.update({
            where: { email: req.body.email },
            data: { resetCode: hashedResetCode },
        });

        await sendMail({
            to: user.email,
            subject: 'Reset Password',
            text: message,
            html: `<p>Your password reset code is <strong>${resetCode}</strong></p>`
        });
        res.status(200).json({ message: 'Reset code sent successfully' });
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        res.status(500).json({ message: 'Error sending email' });
    }
};

export const verifyResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { resetCode } = req.body;
        console.log(resetCode);
        if (!resetCode) {
            return res.status(400).json({ message: 'Reset code is required' });
        }

        const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        if (hashedResetCode !== user.resetCode) {
            return res.status(400).json({ message: 'Wrong code' });
        }
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: 'JWT_SECRET_KEY is not defined' });
        }
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Reset code verified successfully' , accessToken});
    } catch (err) {
        console.error('Error verifying reset code:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;
    try {
        const user = await handleGoogleAuth(idToken);

        // Generate a JWT token
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: 'JWT_SECRET_KEY is not defined' });
        }

        const accessToken = jwt.sign({ userId: user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        if (!process.env.REFRESH_TOKEN_KEY) {
            return res.status(500).json({ message: 'REFRESH_TOKEN_KEY is not defined' });
        }
        const refreshToken = jwt.sign({ userId: user }, process.env.REFRESH_TOKEN_KEY);

        res.status(200).json({ message: 'User authenticated successfully', accessToken, refreshToken });
    } catch (err) {
        console.error('Error in googleAuth:', err);
        res.status(500).json({ message: 'Server error' });
    }
};