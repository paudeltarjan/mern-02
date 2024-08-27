const Joi = require("joi");


const BrandCreateDTO = Joi.object({
    name: Joi.string().min(2).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    isFeatured: Joi.boolean().default(false), 
    image: Joi.string()
})


module.exports = {
    BrandCreateDTO
}