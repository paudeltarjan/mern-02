const mongoose = require('mongoose');
const { GeneralStatus } = require('../../config/constants');

const CategorySchema = new mongoose.Schema({
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
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null
    },
    brands: [{
            type: mongoose.Types.ObjectId,
            ref: "Brand",
            default: null
        }],
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

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel;