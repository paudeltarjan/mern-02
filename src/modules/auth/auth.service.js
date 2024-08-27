const userService = require('../user/user.service');
const mailSvc = require("../../service/mail.service");
const PatModel = require('./pat.model');

class AuthService {
    validateActivationToken = async(token) => {
        try {
            if(!token) {
                throw {status: 400, message: "Token required"}
            }
            const user = await userService.getSingleUserByFilter({
                activationToken: token
            })
            if(!user) {
                throw {status: 400, message: "User not found"}
            }
            return user;
        } catch(exception) {
            console.log("AuthService | validateActivationToken | Error", exception)
            throw exception
        }
    }


    sendPostActiveNotification = async({to, name}) => {
        try{
            return await mailSvc.sendEmail({
                to: to,
                subject: "Account Activation Success!!",
                message: `
                    <p>Dear ${name},</p>
                    <p>Your account has been activated successfully. Please login to access the user panel.</p>
                    <p>------------------------------------------------------------------</p>
                    <p>Regards,</p>
                    <p>System Admin</p>
                    <p>${process.env.SMTP_FROM}</p>
                    <p>
                        <small>
                            <em>Please do not reply to this email.</em>
                        </small>
                    </p>
                `
            })
        } catch(exception) {
            throw exception
        }
    }

    populatePAT = async (userId, {token, refreshToken}) => {
        try{
            const pat = new PatModel({
                userId: userId, 
                accessToken: token, 
                refreshToken: refreshToken
            })
            return await pat.save()
        } catch(exception){
            throw exception
        }
    }

    getPATDATA = async(filter) => {
        try {
            const pat = await PatModel.findOne(filter);
            return pat
        } catch(exception) {
            throw exception
        }
    }

    deletePAT =  async(filter) => {
        try {
            return await PatModel.deleteMany(filter)
        } catch(exception) {
            throw exception
        }
    }

}

module.exports = new AuthService()