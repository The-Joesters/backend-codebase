import { check,validationResult } from "express-validator";
import { RequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';

import prisma from "../../prisma/prismaClient";

export const createUserValidator: RequestHandler[] = [
    check('name')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 2, max: 50 }).withMessage('name length must be between 2 and 50 characters'),
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('invalid email')
        .custom(async (val: string) => {
            const user = await prisma.users.findUnique({ where: { email: val } })
            if (user) 
                throw new Error('User already exists')
            return true;
        }),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    check('confirmPassword')
        .notEmpty().withMessage('please confirm your password')
        .custom((val: string, { req })=> {
            if (val !== req.body.password)
                throw new Error('passwords don\'t match')
            return true;
        }),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
]
export const loginValidator: RequestHandler[] = [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]