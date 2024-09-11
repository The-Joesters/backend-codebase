import { Request, Response, NextFunction } from "express";
import ErrorInterface from "../interfaces/ErrorInterface"; 

export const globalErrorHandler = (err: ErrorInterface, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ||500 ;
    const status = err.status || "error";
    const message = err.message || "An unexpected error occurred.";
    if(process.env.NODE_ENV==="development"){

        return res.status(statusCode).send({
            err,
            "status":status,
            "message":message,
            "stack":err.stack
        });
    }else{
        return res.status(statusCode).send({
            "status":status,
            "message":message
        })
    }
};