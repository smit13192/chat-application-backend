import ChatModel, { chatPopulate } from "../model/chat.model";
import MessageModel, { messagePopulateWithoutChat } from "../model/message.model";
import { io } from "../socket";
import { ApiError } from "../utils/api.error";
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

    const findChat = await ChatModel.findOne({ chatName });
    if (findChat) {
        throw new ApiError(400, 'Group name already exist.');
    }

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
    const chatModel = await ChatModel.findByIdAndUpdate(chat, { $set: { lastMessage: messageModel._id } }, { new: true });
    await messageModel.populate(messagePopulateWithoutChat);
    chatModel?.users.forEach((user) => {
        io.in(user.toString()).emit('new-message', messageModel);
    });
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: messageModel, message: "Message send successfully" }));
});

export const getAllChatMessage = asyncHandler(async (req, res) => {
    const { chat } = req.params;
    let messageId: any = req.query.messageId;
    let skip: any = req.query.skip;

    const message = await MessageModel.findById(messageId);
    if (!message) {
        const messages = await MessageModel.find({ chat })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(100)
            .populate(messagePopulateWithoutChat);
        return res.status(200).json(new SuccessResponse({ statusCode: 200, data: messages, message: "Get all chat message" }));
    }
    
    const messages = await MessageModel.find({ _id: { $lt: messageId }, chat })
        .sort({ createdAt: 'desc' })
        .limit(100).
        populate(messagePopulateWithoutChat);
    
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: messages, message: "Get all chat message" }));
});