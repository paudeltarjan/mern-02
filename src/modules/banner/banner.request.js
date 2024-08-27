const Joi = require("joi");


const BannerCreateDTO = Joi.object({
    name: Joi.string().min(2).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    link: Joi.string().uri(),
    image: Joi.string()
})


module.exports = {
    BannerCreateDTO
}