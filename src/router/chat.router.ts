import { Router } from "express";
import { verifyUser } from "../middleware/verify.user";
import { bodyValidation, paramsValidation } from "../utils/validation";
import { accessChatValidation, createGroupValidation, deleteMessageValidation, getAllChatMessageValidation, sendMessageValidation } from "../utils/joi.validation";
import { accessChat, createGroup, deleteMessage, getAllChatMessage, getAllUserChat, sendMessage } from "../controller/chat.controller";

const chatRouter = Router();

chatRouter.post("/", verifyUser, bodyValidation(accessChatValidation), accessChat);
chatRouter.get("/", verifyUser, getAllUserChat);
chatRouter.post("/create-group", verifyUser, bodyValidation(createGroupValidation), createGroup);
chatRouter.post("/send-message", verifyUser, bodyValidation(sendMessageValidation), sendMessage);
chatRouter.get("/get-all-chat-message/:chat", verifyUser, paramsValidation(getAllChatMessageValidation), getAllChatMessage);
chatRouter.delete("/:messageId", verifyUser, paramsValidation(deleteMessageValidation), deleteMessage);

export default chatRouter;