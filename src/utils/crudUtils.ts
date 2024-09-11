import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../middlewares/ApiError';

const prisma = new PrismaClient();

type Callback = (req: Request, res: Response, next: NextFunction) => Promise<boolean> | boolean;

type PrismaModel = {
  findMany: (...args: any[]) => Promise<any[]>;
  findUnique: (...args: any[]) => Promise<any | null>;
  create: (...args: any[]) => Promise<any>;
  update: (...args: any[]) => Promise<any>;
  delete: (...args: any[]) => Promise<any>;
};

type ModelName = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$extends'
>;

export const getAll = (modelName: ModelName, callback?: Callback) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model = prisma[modelName] as PrismaModel;
      const models = await model.findMany();
      if (callback) {
        const result = await callback(req, res, next);
        if (result === false) return;
      }
      res.status(200).json({ data: models });
    } catch (error) {
      console.error(`Error fetching ${String(modelName)}:`, error);
      next(error);
    }
  };

export const getOne = (modelName: ModelName) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model = prisma[modelName] as PrismaModel;
      const id = parseInt(req.params.id);
      const document = await model.findUnique({
        where: { id },
      });
      if (!document) {
        return next(new ApiError("this shit is not exist",404))
      }
      res.status(200).json({ data: document });
    } catch (error) {
      console.error(`Error fetching ${String(modelName)}:`, error);
      next(error);
    }
  };

export const createOne = (modelName: ModelName) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model = prisma[modelName] as PrismaModel;
      const created = await model.create({
        data: req.body,
      });
      res.status(201).json({ message: 'Created successfully', data: created });
    } catch (error) {
      console.error(`Error creating ${String(modelName)}:`, error);
      next(error);
    }
  };

export const updateOne = (modelName: ModelName) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model = prisma[modelName] as PrismaModel;
      const id = parseInt(req.params.id);
      const updated = await model.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json({ message: 'Updated successfully', data: updated });
    } catch (error) {
      console.error(`Error updating ${String(modelName)}:`, error);
      next(error);
    }
  };

export const deleteOne = (modelName: ModelName, callback?: Callback) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (callback) {
        const result = await callback(req, res, next);
        if (result === false) return;
      }
      const model = prisma[modelName] as PrismaModel;
      const id = parseInt(req.params.id);
      await model.delete({
        where: { id },
      });
      res.status(202).json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(`Error deleting ${String(modelName)}:`, error);
      next(error);
    }
  };