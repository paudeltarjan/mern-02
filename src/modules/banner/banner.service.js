const BannerModel = require("./banner.model")

class BannerService {
    store = async (data) => {
        try {
            const banner = new BannerModel(data)
            return await banner.save()
        } catch(exception) {
            console.log("BannerService | store | Exception ", exception)
            throw exception;
        }
    }

    listAllData = async({limit=10, skip=0, sort={_id: "desc"}, filter={}}) => {
        try {
            const data = await BannerModel.find(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await BannerModel.countDocuments(filter);

            return {count, data}
        } catch(exception) {
            console.log("BannerService | listAllData | exception ", exception)
            throw exception;
        }
    }

    getSingleDataByFilter = async(filter) => {
        try {
            const data = await BannerModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
            return data;
        } catch(exception) {
            console.log("BannerService | getSingleDataByFilter | exception ", exception)
            throw exception;
        }
    }

    updateById = async(id, data) =>{
        try {
            const response = await BannerModel.findByIdAndUpdate(id, {$set: data})
            return response;
        } catch(exception) {
            console.log("BannerService | UpdateById | exception ", exception)
            throw exception;
        }
    }

    deleteById = async(id) => {
        try {
            const response = await BannerModel.findByIdAndDelete(id);
            if(!response) {
                throw {status: 404, message: "Banner does not exists"}
            }
            return response;
        } catch(exception) {
            console.log("BannerService | deleteById | exception ", exception)
            throw exception;
        }
    }
}

const bannerSvc = new BannerService()
module.exports=  bannerSvc