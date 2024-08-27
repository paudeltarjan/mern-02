const slugify = require("slugify");
const orderSvc = require("./order.service");
const { deleteFile } = require("../../utilities/helpers");

class OrderController {
    #id;
    #order;

    /**
     * This function is used to create the order detail. 
    
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {import("express").NextFunction} next 
     */
    create = async (req, res, next) => {
        try{
            const data = req.body;
            if(req.file) {
                data.image = req.file.filename
            }
            // slug Apple => Apple => apple
            data.slug = slugify(data.name, {
                lower: true
            })  // apple
            data.createdBy = req.authUser._id;

            const order = await orderSvc.store(data);
            res.json({
                result: order, 
                message: "Order created successfully",
                meta: null
            })
        } catch(exception) {
            console.log("OrderController | create | exception", exception)
            next(exception)
        }
    }

    index = async (req, res, next) => {
        try{
            // pagination 
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;
            
            // ?page=1&limit=10&sortKey=title&sortdir=asc&q=
            const sorting = {_id: "desc"}

            // search / filter
            let filter = {};
            
            if(req.query.search) {
                filter = {
                    $or: [
                        {name: new RegExp(req.query.search, 'i')},
                        {status: new RegExp(req.query.search, 'i')}
                    ]
                }
            }
            const {data, count} = await orderSvc.listAllData({
                limit: limit, 
                skip: skip, 
                sort: sorting, 
                filter: filter
            })

            res.json({
                result: data, 
                message: "Order List",
                meta: {
                    currentPage: page,
                    total: count, 
                    limit: limit, 
                    totalPages: Math.ceil(count/limit)
                }
            })
        } catch(exception) {
            next(exception)
        }
    }

    #validateId = async (req) => {
        try {
            this.#id = req.params.id;
            this.#order = await orderSvc.getSingleDataByFilter({
                _id: this.#id
            })
            if(!this.#order) {
                throw {status: 404, message: "Order not found"}
            }
        } catch(exception) {
            throw exception
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req);
            res.json({
                result: this.#order, 
                message: "Order Detail",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    update = async (req, res, next) => {
        try {
            await this.#validateId(req);
            // this.#id, this.#order

            const data = req.body 
            if(req.file) {
                data.image = req.file.filename;
            }

            const response = await orderSvc.updateById(this.#id, data);
            // 
            if(req.file) {
                deleteFile('./public/uploads/order/'+response.image)
            }
            res.json({
                result: data,  
                message: "Order Updated successfully",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    delete = async (req, res, next) => {
        try {
            await this.#validateId(req)
            // 
            const response = await orderSvc.deleteById(this.#id);
            if(response.image) {
                deleteFile('./public/uploads/order/'+response.image)
            }
            res.json({
                result: null,
                message: "Order deleted successfully.",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    getBySlug = async(req, res, next) => {
        try {
            const slug = req.params.slug;
            const order = await orderSvc.getSingleDataByFilter({
                slug: slug
            })
            if(!order) {
                throw {status: 404, message: "Order does not exists"}
            }

            // TODO: Fetch product list by Order 

            res.json({
                result: {
                    detail: order ,
                    product: null
                }, 
                meta: {
                    // TODO: Calculate these values
                    total: 0,
                    currentPage: 1, 
                    limit: 15, 
                    totalPage: 1
                },
                message: "Order Detail with product"
            })

        } catch(exception) {
            next(exception)
        }
    }
}  

module.exports = new OrderController()