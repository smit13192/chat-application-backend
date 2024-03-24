import { Router } from "express";
import userRouter from "./user.router";
import chatRouter from "./chat.router";

const router = Router();
router.use(userRouter);
router.use("/chat", chatRouter);

export default router;