import UserModel, { userSelect } from "../model/user.model";
import { ApiError } from "../utils/api.error";
import { asyncHandler } from "../utils/async.handler";
import { generateToken } from "../utils/generate.token";
import { SuccessResponse } from "../utils/response";

export const register = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const findUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (findUser) {
        throw new ApiError(400, 'Email or username already exist');
    }
    const user = new UserModel(req.body);
    await user.save({ validateBeforeSave: true });
    res.status(200).json(new SuccessResponse({ statusCode: 200, message: 'User register successfully' }));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        throw new ApiError(400, 'User is not exist');
    }
    const isMatch = findUser.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(400, 'Password is wrong');
    }
    const token = generateToken(findUser._id.toString());

    const user = await UserModel.findById(findUser._id).select("-password");

    res.status(200).json(new SuccessResponse({
        statusCode: 200, message: 'User logged in successfully', data: {
            token,
            user
        }
    }));
});

export const profile = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    res.status(200).json(new SuccessResponse({ statusCode: 200, data: user, message: "User profile get successfully" }));
});

export const getAllUser = asyncHandler(async (req, res) => {
    const skip: number = parseInt((req.query.skip as string) || '0');
    const limit: number = parseInt((req.query.limit as string) || '10');
    const id = (req as any).id;
    const users = await UserModel.find({ _id: { $ne: id } }).skip(skip).limit(limit).select(userSelect);
    res.status(200).json(new SuccessResponse({ statusCode: 200, data: users }));
});

