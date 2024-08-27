const userRouter = require("express").Router()
const userCtrl = require("./user.controller")
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const {setPath, uploader} = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const { UserCreateDto } = require("./user.request");


// userRouter.use(checklogin)

userRouter.route("/")
    .post(checklogin, allowUser, setPath('/user'),uploader.single('image'), bodyValidator(UserCreateDto), userCtrl.userCreate)
    .get(userCtrl.listAllUsers)

userRouter.route('/:id')
    .get(userCtrl.getDetailById)
    .put(userCtrl.updateUserById)
    .delete(userCtrl.deleteUserById)


module.exports = userRouter;