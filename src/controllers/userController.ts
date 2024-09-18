import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';
import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/ApiError';
import bcrypt from 'bcrypt';
require('dotenv').config();

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, email, password, phone } = req.body;
    try {
        //create new user
        const hashedPassword = await bcrypt.hash(password, 15);
        console.log(hashedPassword);
        const newUser = await prisma.users.create({
            data: {
                id,
                name,
                email,
                password: hashedPassword,
                phone,
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
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return (new ApiError('Invalid email or password', 401));
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
            return (new ApiError('server error', 501))
    }
}