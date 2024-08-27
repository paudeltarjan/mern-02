const router = require("express").Router()
const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const bannerController = require("./banner.controller");
const { BannerCreateDTO } = require("./banner.request");

router.get('/list-home', bannerController.listForHome)

router.route('/')
    .post(checklogin, allowUser([UserTypes.ADMIN]), setPath('/banner'), uploader.single("image"), bodyValidator(BannerCreateDTO), bannerController.create)
    .get(checklogin, allowUser(UserTypes.ADMIN), bannerController.index)

router.route("/:id")
    .get(checklogin, allowUser(UserTypes.ADMIN), bannerController.show)
    .put(checklogin, allowUser(UserTypes.ADMIN), setPath('/banner'), uploader.single('image'), bodyValidator(BannerCreateDTO), bannerController.update)
    .delete(checklogin, allowUser(UserTypes.ADMIN), bannerController.delete)

module.exports = router;