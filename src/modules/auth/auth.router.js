const router = require('express').Router()
const {setPath, uploader} = require('../../middlewares/uploader.middleware');
const {bodyValidator} = require('../../middlewares/validator.middleware');
const { UserCreateDto } = require('../user/user.request');
const userCtrl = require('../user/user.controller');
const authController = require('./auth.controller');
const { LoginDTO } = require('./auth.request');
const checklogin = require('../../middlewares/auth.middleware');
const allowUser = require('../../middlewares/rbac.middleware');

// ..../auth/register
router.post("/register", setPath('/user'), uploader.single("image"), bodyValidator(UserCreateDto), userCtrl.userCreate);
router.get('/activate/:token', authController.activateUser)
router.get("/resend-token/:token", authController.resendActivationToken)

// login 
router.post('/login', bodyValidator(LoginDTO), authController.login)

router.get('/me', checklogin, authController.getLoggedInUser);

router.post("/logout", checklogin, authController.logout)


module.exports = router;