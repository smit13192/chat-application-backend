import UserModel, { userSelect } from "../model/user.model";
import { ApiError } from "../utils/api.error";
import { asyncHandler } from "../utils/async.handler";
import { verifyToken } from "../utils/generate.token";

export const verifyUser = asyncHandler(async (req, _, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        let token = req.headers.authorization.split(" ")[1];
        const data = verifyToken(token);
        if (!data) {
            throw new ApiError(401, 'Not authorized, token failed');
        }
        const findUser = await UserModel.findById(data.id).select(userSelect);
        if(!findUser) {
            throw new ApiError(401, 'Not authorized, token failed');
        }
        (req as any).user = findUser;
        (req as any).id = findUser._id;
        next();
    } else {
        throw new ApiError(401, 'Not authorized, token failed');
    }
});