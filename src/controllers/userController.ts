import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';
import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/ApiError';
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
                password,
            }
        })

        //generate a jwt
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        const token = jwt.sign({userId:newUser.id}, process.env.JWT_SECRET_KEY);
        res.status(201).json({ newUser, token });
    }
    catch (err){
        console.log(err);
        return (new ApiError('signUp error', 501));
    }
}