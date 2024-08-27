require('dotenv').config();
const mailSvc = require("../../service/mail.service");
const userService = require("./user.service");

/**
 * UserController class is to handle all the business logic for user 
 */
class UserController{
    /**
     * This function creates a user in our database.
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {import("express").NextFunction} next 
     */
    userCreate = async(req, res, next) => {
        try{
            // Mapping 
            const data = userService.transformUserCreate(req);
            const user = await userService.storeUser(data)
            // notification 
            await userService.sendActivationEmail({to: user.email, name: user.name, token: user.activationToken})
            
            res.json({
                result: {
                    _id: user._id,
                    name: user.name, 
                    email: user.email, 
                    address: user.address, 
                    activationToken: user.activationToken,       // testing
                    activeFor: user.activeFor,
                    phone: user.phone
                },
                message: "User Create",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    listAllUsers = (req, res, next) => {
        // code tofetch datas from db
        res.json({
            result: [],
            meta: null,
            message: "All User List"
        })
    }

    getDetailById = (req, res, next) => {
        // params
                // loggedin user
            // admin user
 
        const params = req.params;  // object
        const query = req.query;    // object
        res.json({
            result: {
                params: params,
                query: query
            },
            message: "User Detail of " + params.id,
            meta: null
        })
    }

    updateUserById = (req, res, next) => {
        // loggedin user
        // admin user

        // params 
        const params = req.params;  // object
        res.json({
            result: {
                params: params
            },
            message: "User Update ",
            meta: null
        })
    }

    deleteUserById = (req, res, next) => {
        // loggedin user
        // admin user

        // params 
        const params = req.params;  // object
        res.json({
            result: {
                params: params
            },
            message: "User Delete",
            meta: null
        })
    }
}
/**
 * userCtrl object is an instance of UserController Class
 */
const userCtrl = new UserController()
module.exports  = userCtrl;