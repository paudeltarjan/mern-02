require("dotenv").config()
const bcrypt = require('bcryptjs')
const {randomString} = require('../../utilities/helpers')
const mailSvc = require('../../service/mail.service')
const UserModel = require("./user.model")

class UserService{

    transformUserCreate = (req) => {
        const data = req.body;
        if(req.file) {
            data.image = req.file.filename
        }
        data.password = bcrypt.hashSync(data.password, 10)
        data.status = "inactive";
        data.activationToken = randomString(100)
        data.activeFor = new Date(Date.now() + (3*60*60*1000))
        return data;
    }

    sendActivationEmail = async({to, name, token, sub= "Activate your account!"}) => {
        try{
            return await mailSvc.sendEmail({
                to: to,
                subject: sub,
                message: `
                    <p>Dear ${name},</p>
                    <p>Your account has been registered successfully.</p>
                    <p>Please click on the link below or copy paste the url in the browser for further process.</p>
                    <a href="${process.env.FRONTEND_URL}/activate/${token}">
                        ${process.env.FRONTEND_URL}/activate/${token}
                    </a>
                    <p>------------------------------------------------------------------</p>
                    <p>Regards,</p>
                    <p>System Admin</p>
                    <p>${process.env.SMTP_FROM}</p>
                    <p>
                        <small>
                            <em>Please do not reply.</em>
                        </small>
                    </p>
                `
            })
        } catch(exception) {
            throw exception
        }
    }

    storeUser = async(data) => {
        try{
            const user = new UserModel(data);
            return await user.save()       // insert or update
        } catch(exception) {
            // TODO cleanup
            throw exception
        }
    }


    getSingleUserByFilter = async(filter) => {
        try {
            // get a user by filter
            const user = await UserModel.findOne(filter)
            return user;
        } catch(exception) {
            throw exception
        }
    }

    listAllByFilter = async(filter) => {
        try {
            // console.log(filter);
            // const list = await UserModel.find(filter, {password: 0, __v: 0, activationToken: 0, activeFor: 0, createdAt: 0, updatedAt: 0})
            const list = await UserModel.aggregate(
                [
                    {
                      '$match': {
                        ...filter
                      }
                    }, {
                      '$lookup': {
                        'from': 'chats', 
                        'localField': '_id', 
                        'foreignField': 'reciever', 
                        'as': 'message'
                      }
                    },
                    // filter match
                    {
                        '$project': {
                            _id: '$_id',
                            name: '$name',
                            email: '$email',
                            image: "$image",
                            role: "$role",
                            status: "$status",
                            message: "$message"
                        }
                    }
                ]
            ) 
            return list;
        } catch(exception) {
            throw exception
        }
    }

}

module.exports = new UserService()