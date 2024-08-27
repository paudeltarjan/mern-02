const mongoose = require('mongoose');
const { GeneralStatus } = require('../../config/constants');

const OrderSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        unique: true,
        min: 2
    },
    slug: {
        type: String, 
        requried: true, 
        unique: true
    },
    isFeatured: {
        type: Boolean,
        default: false 
    },
    image: String,
    status: {
        type: String, 
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true, 
    autoCreate: true, 
    autoIndex: true
})

const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel;