import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';

export const getAllItems = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const items = await prisma.customization_items.findMany();
        if (items.length === 0)
            return res.status(404).json({ message: 'no items found' });
        res.status(200).json({ items: items });
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error', err });
    }
}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const document = await prisma.customization_items.findUnique({
            where: { id },
        });
        if (!document) {
            res.status(404).json({ message: 'item not found' });
        }
        res.status(200).json({ data: document });
    } catch (err) {
        res.status(500).json({ message: 'internal server error', err });
    }
};