const ChatModel = require("./chhat.model");

class ChatService {
    detailBySender = async(filter) => {
        try {
            const list = await ChatModel.find(filter)
                .populate('sender', ["_id",'name', 'email', 'role'])
                .populate('receiver', ["_id",'name', 'email', 'role'])
                .sort({date:'asc'})
            return list;
        } catch(exception) {
            throw exception
        }
    }
    chatDetailById = async(id) => {
        try {
            const list = await ChatModel.findById(id)
                .populate('sender', ["_id",'name', 'email', 'role'])
                .populate('receiver', ["_id",'name', 'email', 'role'])
                .sort({date:'asc'})
            return list;
        } catch(exception) {
            throw exception
        }
    }
    storeChat = async(data) => {
        try {
            const chat = new ChatModel(data);
            await chat.save()
            return await this.chatDetailById(chat._id)
        } catch(exception) {
            throw exception
        }
    }
}

const chatSvc = new ChatService()
module.exports = chatSvc;