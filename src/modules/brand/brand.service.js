const BrandModel = require("./brand.model")

class BrandService {
    store = async (data) => {
        try {
            const brand = new BrandModel(data)
            return await brand.save()
        } catch(exception) {
            console.log("BrandService | store | Exception ", exception)
            throw exception;
        }
    }

    listAllData = async({limit=10, skip=0, sort={_id: "desc"}, filter={}}) => {
        try {
            const data = await BrandModel.find(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await BrandModel.countDocuments(filter);

            return {count, data}
        } catch(exception) {
            console.log("BrandService | listAllData | exception ", exception)
            throw exception;
        }
    }

    getSingleDataByFilter = async(filter) => {
        try {
            const data = await BrandModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
            return data;
        } catch(exception) {
            console.log("BrandService | getSingleDataByFilter | exception ", exception)
            throw exception;
        }
    }

    updateById = async(id, data) =>{
        try {
            const response = await BrandModel.findByIdAndUpdate(id, {$set: data})
            return response;
        } catch(exception) {
            console.log("BrandService | UpdateById | exception ", exception)
            throw exception;
        }
    }

    deleteById = async(id) => {
        try {
            const response = await BrandModel.findByIdAndDelete(id);
            if(!response) {
                throw {status: 404, message: "Brand does not exists"}
            }
            return response;
        } catch(exception) {
            console.log("BrandService | deleteById | exception ", exception)
            throw exception;
        }
    }
}

const brandSvc = new BrandService()
module.exports=  brandSvc