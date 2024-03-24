import { Router } from "express";
import { verifyUser } from "../middleware/verify.user";
import { bodyValidation } from "../utils/validation";
import { accessChatValidation, createGroupValidation, sendMessageValidation } from "../utils/joi.validation";
import { accessChat, createGroup, getAllUserChat, sendMessage } from "../controller/chat.controller";

const chatRouter = Router();

chatRouter.post("/", verifyUser, bodyValidation(accessChatValidation), accessChat);
chatRouter.get("/", verifyUser, getAllUserChat);
chatRouter.post("/create-group", verifyUser, bodyValidation(createGroupValidation), createGroup);
chatRouter.post("/send-message", verifyUser, bodyValidation(sendMessageValidation), sendMessage);

export default chatRouter;