import { Schema } from "joi";
import { asyncHandler } from "./async.handler";
import { ApiError } from "./api.error";
import { NextFunction, Request, Response } from "express";

export const bodyValidation = (data: Schema) => {
    return asyncHandler((req: Request, _res: Response, next: NextFunction) => {
        const regex = new RegExp('\"', 'g');
        const { error } = data.validate(req.body);
        if (error) {
            throw new ApiError(400, error.details[0].message.replace(regex, ''));
        }
        next();
    });
}