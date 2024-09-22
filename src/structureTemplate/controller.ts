import { NextFunction, Request, Response } from 'express';
import ApiError from '../middlewares/ApiError';


export const getAllArticles = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
    } catch (error) {
        new ApiError("error while getting the data",501);
    }

}