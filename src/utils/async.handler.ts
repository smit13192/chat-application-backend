import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./api.error";
import { ErrorResponse } from "./response";

export function asyncHandler(requestHandler: RequestHandler): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (e) {
            if (e instanceof ApiError) {
                return res.status(200).json(new ErrorResponse({
                    statusCode: e.statusCode,
                    message: e.message,
                }));
            } else {
                return res.status(200).json(new ErrorResponse({
                    statusCode: 500,
                    message: "Something went wrong",
                }));
            }
        }
    }
}