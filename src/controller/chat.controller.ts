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
        users: { $all: [user._id, recieverId] }
    }).populate(chatPopulate);

    if (findChat.length > 0) {
        return res.status(200).json(new SuccessResponse({ statusCode: 200, data: findChat[0] }));
    }
    let chat = new ChatModel({
        users: [user._id, recieverId]
    });
    chat = await (await chat.save({ validateBeforeSave: true })).populate(chatPopulate);
    const allUserId: string[] = chat.users.map((user) => (user as any)._id.toString());
    io.in(allUserId).emit('get-user-chat');
    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: chat }));
});

export const getAllUserChat = asyncHandler(async (req, res) => {
    const id = (req as any).user._id;
    const chats = await ChatModel.find({
        users: { $elemMatch: { $eq: id } },
        $or: [
            { lastMessage: { $ne: null } },
            { isGroupChat: true }
        ]
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
    const allUserId: string[] = chat.users.map((user) => (user as any)._id.toString());
    io.in(allUserId).emit('get-user-chat');
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

    const chatUsers = chatModel?.users.map((user) => user.toString());

    if (chatUsers) {
        io.in(chatUsers).emit('new-message', messageModel);
    }

    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: messageModel, message: "Message send successfully" }));
});

export const getAllChatMessage = asyncHandler(async (req, res) => {
    const { chat } = req.params;
    let lastMessageId: any = req.query.lastMessageId;
    let skip: any = req.query.skip;
    let limit: number = parseInt((req.query.limit as string) || '100');

    const chatModel = await ChatModel.findById(chat).populate(chatPopulate);

    if (!chatModel) {
        throw new ApiError(400, "Chat is not exist.");
    }

    let message;

    if (lastMessageId) {
        message = await MessageModel.findById(lastMessageId);
    }

    if (!message) {
        const messages = await MessageModel.find({ chat })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .populate(messagePopulateWithoutChat);
        return res.status(200).json(new SuccessResponse({ statusCode: 200, data: { chat: chatModel, messages }, message: "Get all chat message" }));
    }

    const messages = await MessageModel.find({ _id: { $lt: lastMessageId }, chat })
        .sort({ createdAt: 'desc' })
        .limit(limit).
        populate(messagePopulateWithoutChat);

    return res.status(200).json(new SuccessResponse({ statusCode: 200, data: { chat: chatModel, messages }, message: "Get all chat message" }));
});

export const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const id = (req as any).user._id;

    const deleteMessage = await MessageModel.findOneAndDelete({
        sender: id,
        _id: messageId
    });

    if (!deleteMessage) {
        throw new ApiError(400, "Message is not exist.");
    }
    await deleteMessage.populate(messagePopulateWithoutChat);

    const chatModel = await ChatModel.findById(deleteMessage.chat).populate(chatPopulate);
    if (chatModel) {
        if (!chatModel.lastMessage) {
            chatModel.lastMessage = undefined;
            let messages = await MessageModel.find({
                chat: chatModel._id,
            }).sort({ createdAt: 'desc' }).limit(1);
            if (messages.length > 0) {
                chatModel.lastMessage = messages[0]._id;
            }
            await chatModel.save();
        }
        const chatUsers = chatModel.users.map((user) => (user as any)._id.toString());
        if (chatUsers) {
            io.in(chatUsers).emit('delete-message', {
                chat: chatModel,
                message: deleteMessage,
            });
        }
    }

    return res.status(200).json(new SuccessResponse({ statusCode: 200, message: "Message deleted successfully", data: deleteMessage }));
})