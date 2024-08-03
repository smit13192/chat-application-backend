import { Router } from "express";
import { getAllUser, login, profile, register, updateProfile } from "../controller/user.controller";
import upload from "../middleware/upload";
import { verifyUser } from "../middleware/verify.user";
import { loginValidation, registerValidation } from "../utils/joi.validation";
import { bodyValidation } from "../utils/validation";

const userRouter = Router();

userRouter.post("/register", bodyValidation(registerValidation), register);
userRouter.post("/login", bodyValidation(loginValidation), login);
userRouter.get("/profile", verifyUser, profile);
userRouter.put("/update-profile", verifyUser, upload.single('image'), updateProfile);
userRouter.get("/get-all-user", verifyUser, getAllUser);

export default userRouter;