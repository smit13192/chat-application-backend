import { model, PopulateOptions, Schema, Types } from "mongoose";
import { chatPopulate } from "./chat.model";
import { userSelect } from "./user.model";

interface IMessage {
    message: string;
    sender: Types.ObjectId;
    chat: Types.ObjectId;
    replyToMessage: Types.ObjectId;
    messageIv: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chats',
        required: true,
    },
    replyToMessage: {
        type: Schema.Types.ObjectId,
        ref: 'messages',
        default: null,
    },
    messageIv: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const MessageModel = model<IMessage>('messages', messageSchema);

export default MessageModel;

export const messagePopulate: (string | PopulateOptions)[] = [
    {
        path: 'sender',
        select: userSelect
    },
    {
        path: 'chat',
        populate: chatPopulate,
    },
    {
        path: 'replyToMessage',
        populate: [{ path: 'sender', select: userSelect }],
        select: "-replyToMessage"
    }
];

export const messagePopulateWithoutChat: (string | PopulateOptions)[] = [
    {
        path: 'sender',
        select: userSelect
    },
    {
        path: 'replyToMessage',
        populate: [{ path: 'sender', select: userSelect }],
        select: "-replyToMessage"
    }
];