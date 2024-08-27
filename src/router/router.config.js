
const router = require("express").Router();
const userRouter = require("../modules/user/user.router")
const bannerRouter = require("../modules/banner/banner.router")
const authRouter = require("../modules/auth/auth.router")
const brandRouter = require("../modules/brand/brand.router");
const chatRouter = require("../modules/chat/chat.router");
const orderRouter = require("../modules/order/order.router");


router.use("/user", userRouter);
router.use("/banner", bannerRouter)
router.use("/auth", authRouter)
router.use('/brand', brandRouter)
router.use('/chat', chatRouter)
router.use('/order', orderRouter)


// /brand
router.get("/home", (request, response, next) => {

    response.json({
        result: "data any type",
        message: "Home data fetched",
        meta: null   // null, array, object
    })
})


module.exports = router