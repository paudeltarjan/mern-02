const bcrypt = require("bcryptjs");
require("../config/db.config")
const userService = require("../modules/user/user.service");

const seedUsers = async () => {
    try {

        const users  = [
            {
                name: "Admin Name",
                role: "admin",
                email: "admin@ecommerce.com",
                password: bcrypt.hashSync('Admin123#', 10),
                status: "active"
            }
        ]
        
        for(let user of users) {
            const existing = await userService.getSingleUserByFilter({email:user.email});
            if(!existing) {
                await userService.storeUser(user)
            }
        }
        
    } catch(exception) {
        console.log(exception);
    } finally {
        process.exit(1)
    }
}

seedUsers()