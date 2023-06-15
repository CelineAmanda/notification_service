const http = require("../API/server.js")
const {Server} = require('socket.io')
const aes256 = require('aes256')
const {bob, bobPublicKeyBase64}=require('./publicKey.js')
const userBase = require('../API/controllers/userBase.js')
const notifBase = require('../API/controllers/notifBase.js')
const {sendInstantNotifications} = require('./mainBase.js')

// Import environement variables
const  { SOCKET_HOSTNAME, API_PORT} = require('../constants/config.js');
const API_URL = `http://${SOCKET_HOSTNAME}:${API_PORT}/api`

const io = new Server(http, {
    cors: {
        origin: `http://localhost:3000`
    }
});

sendInstantNotifications(io)

io.on('connection', (socket)=>{
    console.log('a user connected')
    console.log(`Socket Id: ${socket.id}`)
    socket.emit("test-socket", JSON.stringify({socketID: socket.id}));
    
    socket.on('disconnect', async()=>{
        console.log('user disconnected')
        
        const userObject = {
            sharedKey: "null",
            socketID: "null",
        }
        const {status, error} = await userBase.updateUserBase(socket.id, userObject)
        if(status === 201){
            console.log({message: "User updated successfully", socketID: socket.id})
        }
        else{
            console.log(`User not updated with Error: ${error}`)
        }
    })

    socket.on('client-public-key', async (data)=>{
        console.log('Client Public Key received')
        console.log(data)
        
        socket.emit('server-public-key', JSON.stringify({content: bobPublicKeyBase64}))
        const sharedKey = bob.computeSecret(JSON.parse(data).content, 'base64', 'hex');
        console.log(`Shared key: ${sharedKey}`)

        const userObject = {
            sharedKey: sharedKey,
            socketID: `${socket.id}`,
            phone:JSON.parse(data).phone
        }
        //userObject["userID"]="user010256"
        let {status, user, error} = await userBase.addUserBase(userObject)
        if(status === 201){
            console.log({message:"User added successfully", user: user})
        }
        else{
            console.log(`User not Added with Error: ${error}`)
        }
        
        const responseJSON = await notifBase.getNotificationsByPhone1(JSON.parse(data).phone)
        //`${aes256.encrypt(sharedKey,notif)}`
       if(responseJSON.status === 201) {
            console.log("response: "+responseJSON)
            let userNotification = []
            responseJSON.notifs.forEach(notif => {
                userNotification.push(aes256.encrypt(sharedKey,JSON.stringify({
                    type: notif.type,
                    userID: notif.userID,
                    content:notif.content,
                    links:notif.links,
                    sendDateTime:notif.sendDateTime,
                    status:notif.status,
                    isRead:notif.isRead,
                    isDelete:notif.isDelete
                })))
                })
            socket.emit('get-notifications',userNotification)
            console.log((await io.fetchSockets()).length)
            console.log(responseJSON)
        }
        else{
            console.log(`Notification not Sent To Client On connect with Error: ${responseJSON.error}`)
        }
        
    })
})