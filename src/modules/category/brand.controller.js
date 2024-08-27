const slugify = require("slugify");
const brandSvc = require("./brand.service");
const { deleteFile } = require("../../utilities/helpers");

class BrandController {
    #id;
    #brand;

    /**
     * This function is used to create the brand detail. 
     * Only Admin user can create a brand
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

            const brand = await brandSvc.store(data);
            res.json({
                result: brand, 
                message: "Brand created successfully",
                meta: null
            })
        } catch(exception) {
            console.log("BrandController | create | exception", exception)
            next(exception)
        }
    }

    index = async (req, res, next) => {
        try{
            // pagination 
            const page = +req.aquery.page || 1;
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
            const {data, count} = await brandSvc.listAllData({
                limit: limit, 
                skip: skip, 
                sort: sorting, 
                filter: filter
            })

            res.json({
                result: data, 
                message: "Brand List",
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
            this.#brand = await brandSvc.getSingleDataByFilter({
                _id: this.#id
            })
            if(!this.#brand) {
                throw {status: 404, message: "Brand not found"}
            }
        } catch(exception) {
            throw exception
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req);
            res.json({
                result: this.#brand, 
                message: "Brand Detail",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    update = async (req, res, next) => {
        try {
            await this.#validateId(req);
            // this.#id, this.#brand

            const data = req.body 
            if(req.file) {
                data.image = req.file.filename;
            }

            const response = await brandSvc.updateById(this.#id, data);
            // 
            if(req.file) {
                deleteFile('./public/uploads/brand/'+response.image)
            }
            res.json({
                result: data,  
                message: "Brand Updated successfully",
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
            const response = await brandSvc.deleteById(this.#id);
            if(response.image) {
                deleteFile('./public/uploads/brand/'+response.image)
            }
            res.json({
                result: null,
                message: "Brand deleted successfully.",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    getBySlug = async(req, res, next) => {
        try {
            const slug = req.params.slug;
            const brand = await brandSvc.getSingleDataByFilter({
                slug: slug
            })
            if(!brand) {
                throw {status: 404, message: "Brand does not exists"}
            }

            // TODO: Fetch product list by Brand 

            res.json({
                result: {
                    detail: brand ,
                    product: null
                }, 
                meta: {
                    // TODO: Calculate these values
                    total: 0,
                    currentPage: 1, 
                    limit: 15, 
                    totalPage: 1
                },
                message: "Brand Detail with product"
            })

        } catch(exception) {
            next(exception)
        }
    }
}  

module.exports = new BrandController()