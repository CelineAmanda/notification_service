/*const { Server } = require("socket.io")
const { createServer } = require("http")

const { SOCKET_PORT, SOCKET_HOSTNAME } = require('./constants/index.js')

const httpServer = createServer()
const io = new Server(httpServer, {})

io.on("connection", (socket) => {
    console.log('A Client got connected...')

    // send a message to the client
    socket.emit("hello from server",  JSON.stringify({content: 'Hello Client'}));

    // receive a message from the client
    socket.on("hello from client", (data) => {
        msg = JSON.parse(data)
        console.log('DATA received from client:' + data)
    });
});


socket.on('disconnect', function() {
        console.log("Server Disconnected.....")
})

// Listen for Connection on Port
httpServer.listen(SOCKET_PORT, SOCKET_HOSTNAME, ()=>{
    console.log('Listenning to port '+ SOCKET_PORT + '...')
})
*/