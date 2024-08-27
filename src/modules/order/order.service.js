const OrderModel = require("./order.model")

class OrderService {
    store = async (data) => {
        try {
            const order = new OrderModel(data)
            return await order.save()
        } catch(exception) {
            console.log("OrderService | store | Exception ", exception)
            throw exception;
        }
    }

    listAllData = async({limit=10, skip=0, sort={_id: "desc"}, filter={}}) => {
        try {
            const data = await OrderModel.find(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await OrderModel.countDocuments(filter);

            return {count, data}
        } catch(exception) {
            console.log("OrderService | listAllData | exception ", exception)
            throw exception;
        }
    }

    getSingleDataByFilter = async(filter) => {
        try {
            const data = await OrderModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
            return data;
        } catch(exception) {
            console.log("OrderService | getSingleDataByFilter | exception ", exception)
            throw exception;
        }
    }

    updateById = async(id, data) =>{
        try {
            const response = await OrderModel.findByIdAndUpdate(id, {$set: data})
            return response;
        } catch(exception) {
            console.log("OrderService | UpdateById | exception ", exception)
            throw exception;
        }
    }

    deleteById = async(id) => {
        try {
            const response = await OrderModel.findByIdAndDelete(id);
            if(!response) {
                throw {status: 404, message: "Order does not exists"}
            }
            return response;
        } catch(exception) {
            console.log("OrderService | deleteById | exception ", exception)
            throw exception;
        }
    }
}

const orderSvc = new OrderService()
module.exports=  orderSvc