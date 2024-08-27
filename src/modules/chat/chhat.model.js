const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true
    },
    message: {
        type: String, 
        min: 1, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, 
    autoCreate: true, 
    autoIndex: true
});

const ChatModel = mongoose.model("Chat", ChatSchema)

module.exports = ChatModel;