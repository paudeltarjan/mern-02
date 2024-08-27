const express = require("express");
const cors = require("cors");


require("./db.config")


const router = require("../router/router.config")


const app = express();


app.use(cors());


app.use('/assets', express.static('./public/uploads'))



app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(router);


app.use((req, res, next) => {
    
    next({status: 404, message: "Resource not found."})
})



app.use((error, req, res, next) => {
    
    console.log(error)

    let status = error.status || 500
    let message = error.message || "Server error...."
    let result = error.detail || null;

   


    if(error.code && +error.code === 11000){
        status = 422;
        message= "Validation Failed"
        let msg = {};
        Object.keys(error.keyPattern).map((field) => {
            msg[field] = `${field} should be unique`
        })

        result = msg;

    }

    res.status(status).json({
        result: result,
        meta: null, 
        message: message
    })
});


module.exports = app;
