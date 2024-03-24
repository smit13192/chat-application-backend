import ChatModel, { chatPopulate } from "../model/chat.model";
import MessageModel, { messagePopulate } from "../model/message.model";
import { asyncHandler } from "../utils/async.handler";
import { SuccessResponse } from "../utils/response";

export const accessChat = asyncHandler(async (req, res) => {
    const { recieverId } = req.body;
    const user = (req as any).user;

    const findChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: user._id } } },
            { users: { $elemMatch: { $eq: recieverId } } }
        ]
    }).populate(chatPopulate);

    if (findChat.length > 0) {
        return res.status(200).json(new SuccessResponse({ statusCode: 200, data: findChat[0] }));
    }
    let chat = new ChatModel({
        users: [user._id, recieverId]
    });
    chat = await (await chat.save({ validateBeforeSave: true })).populate(chatPopulate);
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: chat }));
});

export const getAllUserChat = asyncHandler(async (req, res) => {
    const id = (req as any).user._id;
    const chats = await ChatModel.find({
        users: { $elemMatch: { $eq: id } }
    })
        .sort({ updatedAt: -1 })
        .populate(chatPopulate);

    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: chats, message: "Get all user chat" }));
});

export const createGroup = asyncHandler(async (req, res) => {
    const { chatName, users } = req.body;
    const id = (req as any).user._id;
    let chat = new ChatModel(
        {
            chatName,
            isGroupChat: true,
            users: [id, ...users],
            groupAdmin: id,
        }
    );
    chat = await (await chat.save({ validateBeforeSave: true })).populate(chatPopulate);
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: chat, message: "Make group successfully" }));
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { chat, message } = req.body;
    const id = (req as any).user._id;

    let messageModel = new MessageModel({
        chat,
        sender: id,
        message
    });
    await messageModel.save({ validateBeforeSave: true });
    await ChatModel.findByIdAndUpdate(chat, { $set: { lastMessage: messageModel._id } }, { new: true });
    await messageModel.populate(messagePopulate);
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: messageModel, message: "Message send successfully" }));
});