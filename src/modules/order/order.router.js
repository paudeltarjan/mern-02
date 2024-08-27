const router = require("express").Router()
const { UserTypes } = require("../../config/constants");
const checklogin = require("../../middlewares/auth.middleware");
const allowUser = require("../../middlewares/rbac.middleware");
const { setPath, uploader } = require("../../middlewares/uploader.middleware");
const { bodyValidator } = require("../../middlewares/validator.middleware");
const orderController = require("./order.controller");
const { orderCreateDTO } = require("./order.request");

router.get("/:slug/detail", orderController.getBySlug)

router.route('/')
    .post(checklogin, allowUser([UserTypes.ADMIN]), setPath('/order'), uploader.single("image"), bodyValidator(orderCreateDTO), orderController.create)
    .get(checklogin, allowUser(UserTypes.ADMIN), orderController.index)

router.route("/:id")
    .get(checklogin, allowUser(UserTypes.ADMIN), orderController.show)
    .put(checklogin, allowUser(UserTypes.ADMIN), setPath('/order'), uploader.single('image'), bodyValidator(orderCreateDTO), orderController.update)
    .delete(checklogin, allowUser(UserTypes.ADMIN), orderController.delete)

module.exports = router;