const userService = require("../user/user.service");
const chatSvc = require("./chat.service");

class ChatController {
    chatList = async(req, res, next) => {
        try {
            // TODO: pagination and search
            const loggedInUser = req.authUser;
            const userList = await userService.listAllByFilter({
                _id: {$ne: loggedInUser._id}
            })
            res.json({
                result: userList,
                meta: null, 
                message: "List of users"
            })
        }catch(exception) {
            next(exception);
        }
    }

    listDetail = async(req, res, next) => {
        try {
            const senderId = req.params.senderId;
            const sender = await userService.getSingleUserByFilter({
                _id: senderId
            })
            const loggedInUser = req.authUser;
            const list = await chatSvc.detailBySender({
                $or: [
                    {sender: senderId, receiver: loggedInUser._id},
                    {sender: loggedInUser._id, receiver: senderId}
                ]
            })
            res.json({
                result: {list, sender}, 
                meta: null, 
                message: "Chat Detail"
            })
        } catch(exception) {
            next(exception)
        }
    }

    createChat = async(req, res, next) => {
        try {
            const data = req.body; 
            const chat = await chatSvc.storeChat(data);
            
            res.json({
                result: chat,
                message: "Chat Sent successfully",
                meta: null
            })
        } catch(exception) {
            throw exception
        }
    }
}

module.exports =new ChatController();