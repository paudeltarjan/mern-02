const router = require("express").Router()
const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const brandController = require("./brand.controller");
const { BrandCreateDTO } = require("./brand.request");

router.get("/:slug/detail", brandController.getBySlug)

router.route('/')
    .post(checklogin, allowUser([UserTypes.ADMIN]), setPath('/brand'), uploader.single("image"), bodyValidator(BrandCreateDTO), brandController.create)
    .get(checklogin, allowUser(UserTypes.ADMIN), brandController.index)

router.route("/:id")
    .get(checklogin, allowUser(UserTypes.ADMIN), brandController.show)
    .put(checklogin, allowUser(UserTypes.ADMIN), setPath('/brand'), uploader.single('image'), bodyValidator(BrandCreateDTO), brandController.update)
    .delete(checklogin, allowUser(UserTypes.ADMIN), brandController.delete)

module.exports = router;