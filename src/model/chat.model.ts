import { model, Schema, Types } from "mongoose";
import { userSelect } from "./user.model";

interface IChat {
    chatName?: string;
    isGroupChat: boolean;
    users: [Types.ObjectId];
    groupAdmin?: Types.ObjectId;
    lastMessage?: Types.ObjectId;
    groupImage: String;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    chatName: {
        type: String,
        trim: true,
        required: false,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [
        { type: Schema.Types.ObjectId, ref: 'users' }
    ],
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'messages'
    },
    groupImage: {
        type: String,
        default: 'uploads/kakashi.jpeg'
    }
},
    { timestamps: true }
);

chatSchema.path('chatName').validate(function () {
    return this.isGroupChat === true ? this.chatName != null : true;
}, 'Group name is required');

const ChatModel = model('chats', chatSchema);
export default ChatModel;


export const chatPopulate = [
    {
        path: 'groupAdmin',
        select: userSelect
    },
    {
        path: 'users',
        select: userSelect
    },
    {
        path: 'lastMessage',
        populate: {
            path: "sender",
            select: userSelect
        }
    }
];
