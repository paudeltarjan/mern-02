const http = require("http")
const app = require("./src/config/express.config")

const {Server} = require('socket.io')

const server = http.createServer(app);

const io = new Server(server ,{
    cors: "*"
})


io.on("connection", (socket) => {
    
    socket.on('message-sent', (data) => {
        socket.broadcast.emit('message-received', data)
    })
})

server.listen(9000, '127.0.0.1', (err) => {
    if(!err) {
        console.log("Server is running on port 9000")
        console.log("Press ctrl+c to discontinue server...")
      
    }
})