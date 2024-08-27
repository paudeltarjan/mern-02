const bannerSvc = require("./banner.service");
const { deleteFile } = require("../../utilities/helpers");

class BannerController {
    #id;
    #banner;

    /**
     * This function is used to create the banner detail. 
     * Only Admin user can create a banner
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
            
            data.createdBy = req.authUser._id;

            const banner = await bannerSvc.store(data);
            res.json({
                result: banner, 
                message: "Banner created successfully",
                meta: null
            })
        } catch(exception) {
            console.log("BannerController | create | exception", exception)
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
            const {data, count} = await bannerSvc.listAllData({
                limit: limit, 
                skip: skip, 
                sort: sorting, 
                filter: filter
            })

            res.json({
                result: data, 
                message: "Banner List",
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
            this.#banner = await bannerSvc.getSingleDataByFilter({
                _id: this.#id
            })
            if(!this.#banner) {
                throw {status: 404, message: "Banner not found"}
            }
        } catch(exception) {
            throw exception;
        }
    }

    show = async (req, res, next) => {
        try {
            await this.#validateId(req);
            res.json({
                result: this.#banner, 
                message: "Banner Detail",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    update = async (req, res, next) => {
        try {
            await this.#validateId(req);
            // this.#id, this.#banner

            const data = req.body 
            if(req.file) {
                data.image = req.file.filename;
            }

            const response = await bannerSvc.updateById(this.#id, data);
            // 
            if(req.file) {
                deleteFile('./public/uploads/banner/'+response.image)
            }
            res.json({
                result: data,  
                message: "Banner Updated successfully",
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
            const response = await bannerSvc.deleteById(this.#id);
            if(response.image) {
                deleteFile('./public/uploads/banner/'+response.image)
            }
            res.json({
                result: null,
                message: "Banner deleted successfully.",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    listForHome = async(req, res, next) => {
        try {
            const {data} = await bannerSvc.listAllData({
                limit: 10,
                skip: 0,
                sort: {_id: -1},
                filter: {
                    status: "active"
                }
            })
            res.json({
                result: data,
                message: "Banner listed successfully.",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

}  

module.exports = new BannerController()