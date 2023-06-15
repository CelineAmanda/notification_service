const http = require('http')
const app = require('./app.js')
const {API_PORT} = require('../constants/config.js')
// const {consumeMessage} =require('../service/pulsarConsumer')

app.set('port',API_PORT)
const server = http.createServer(app)

/* start the server */
server.listen(API_PORT,()=>{
    console.log('ça marche')
    console.log("Waiting for client connection.....")
    // consumeMessage()
})

module.exports= server