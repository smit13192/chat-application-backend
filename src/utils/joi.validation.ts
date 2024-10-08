import Joi from "joi";

export const registerValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

export const loginValidation = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

export const accessChatValidation = Joi.object({
    recieverId: Joi.string().required()
});

export const createGroupValidation = Joi.object({
    chatName: Joi.string().required(),
    users: Joi.array().items(Joi.string().required()).min(2).required()
});

export const sendMessageValidation = Joi.object({
    chat: Joi.string().required(),
    message: Joi.string().required(),
    messageIv: Joi.string().required(),
    replyToMessage: Joi.string().allow(null),
});

export const getAllChatMessageValidation = Joi.object({
    chat: Joi.string().required(),
});

export const deleteMessageValidation = Joi.object({
    messageId: Joi.string().required(),
});