const mongoose = require('mongoose')
const { UserTypes, GeneralStatus, UserProvider } = require('../../config/constants')

const AddressSchema = new mongoose.Schema({
    state: {
        type: String, 
        enum: ["Koshi", "Madhesh", 'Bagmati', "Gandaki", "Lumbini", "Karnali", "Sudur-Paschim"]
    },
    district: String, 
    muniVdc: String, 
    wardNo: Number, 
    tole: String, 
    houseNo: String, 
    landmark: String
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    email: {
        type: String, 
        requried: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    address: {
        permanentAddress: AddressSchema,
        temporaryAddress: AddressSchema
    },
    role: {
        type: String, 
        enum: [...Object.values(UserTypes)],
        default: UserTypes.CUSTOMER
    },
    status:  {
        type: String, 
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    phone: [String], 
    activationToken: String,
    activeFor: Date,
    userProvider: {
        type: String, 
        enum: [...Object.values(UserProvider)],
        default: UserProvider.CUSTOM
    },
    userProviderId: String,
    forgetToken: String,
    forgetTokenFor: Date,
    image: String, 
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


// Model Name => Singular form 
// collection name => pluralForm of Model name
const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel