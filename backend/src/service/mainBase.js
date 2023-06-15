const {consumeMessage} =require('./pulsarConsumer.js')
const aes256 = require('aes256')
const userBase = require('../API/controllers/userBase.js')

module.exports.sendInstantNotifications = async (io) => {
    while(true){
        const notification = await consumeMessage()
        if(notification !== "null"){
            const sockets = await io.fetchSockets();
            const {status, user, error} = await userBase.getUserByUserID(notification.userID)
            if(status === 201){
                console.log({message:"User fetched successfully"})
                if(user.socketID !== "null"){
                    let userSocket = sockets.filter((socket)=>{
                        return user.socketID === socket.id
                    })[0]
                    if(userSocket){
                        userSocket.emit('instant-notification', `${aes256.encrypt(user.sharedKey,JSON.stringify(notification))}`);
                    }
                }
            }
            else{
                console.log(`User not fetched with Error: ${error}`)
            }
        }
    }
}