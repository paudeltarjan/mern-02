const Joi = require("joi");


const ProductCreateDTO = Joi.object({
    name: Joi.string().min(2).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    isFeatured: Joi.boolean().default(false), 
    images: Joi.array().items(Joi.string())
})


module.exports = {
    ProductCreateDTO
}