import jwt from 'jsonwebtoken';
import express, { NextFunction } from "express";
import prisma from '../prisma/prismaClient';
require('dotenv').config();

interface JwtPayload {
    userId: number;
}

export function checkAuth(req: express.Request, res: express.Response, next: NextFunction) {
    const jwtSecret = process.env.JWT_SECRET_KEY ?? "";
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    if (token === undefined)
        return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, jwtSecret, async(err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Failed to authenticate token' });

        const { userId } = decoded as JwtPayload;
        const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    })
}