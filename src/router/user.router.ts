import { Router } from "express";
import { getAllUser, login, profile, register } from "../controller/user.controller";
import { bodyValidation } from "../utils/validation";
import { loginValidation, registerValidation } from "../utils/joi.validation";
import { verifyUser } from "../middleware/verify.user";

const userRouter = Router();

userRouter.post("/register", bodyValidation(registerValidation), register);
userRouter.post("/login", bodyValidation(loginValidation), login);
userRouter.get("/profile", verifyUser, profile);
userRouter.get("/get-all-user", verifyUser, getAllUser);

export default userRouter;