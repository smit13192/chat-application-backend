import { model, ObjectId, PopulateOptions, Schema } from "mongoose";
import { userSelect } from "./user.model";
import { messagePopulate } from "./message.model";

interface IChat {
    chatName?: string;
    isGroupChat: boolean;
    users: [Schema.Types.ObjectId];
    groupAdmin?: Schema.Types.ObjectId;
    lastMessage?: Schema.Types.ObjectId;
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
