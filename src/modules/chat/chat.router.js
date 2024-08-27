const checklogin = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const chatController = require("./chat.controller");
const { ChatCreateDTO } = require("./chat.request");

const chatRouter = require("express").Router()

chatRouter.get('/chat-list', checklogin, chatController.chatList)
chatRouter.get('/chat-detail/:senderId', checklogin, chatController.listDetail)
chatRouter.post("/store", checklogin, bodyValidator(ChatCreateDTO), chatController.createChat)
module.exports = chatRouter;