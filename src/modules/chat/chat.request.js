const Joi = require("joi");

const ChatCreateDTO= Joi.object({
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    message: Joi.string().min(1).required()
})

module.exports = {
    ChatCreateDTO
}