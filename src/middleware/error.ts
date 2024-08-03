import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ApiError) {
        res.status(200).json({ statusCode: err.statusCode, success: false, message: err.message });
    } else {
        res.status(200).json({ statusCode: 500, success: false, message: "Something went wrong" });
    }
};