import { check } from "express-validator";
import { RequestHandler } from "express";
import prisma from "../../prisma/prismaClient";

export const createUserValidator: RequestHandler[] = [
    check('name')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 2, max: 50 }).withMessage('name length must be between 2 and 50 characters'),
    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('invaild email')
        .custom(async (val: string) => {
            const user = await prisma.users.findUnique({ where: { email: val } })
            if (user) 
                throw new Error('email already exists')
            return true;
        }),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must be at least 8 characters long and contain at least one number and one special character'),
    check('confirmPassword')
        .notEmpty().withMessage('please confirm your password')
        .custom((val: string, { req })=> {
            if (val !== req.body.password)
                throw new Error('passwords don\'t match')
            return true;
        })
]