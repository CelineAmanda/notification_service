// Import all libraries
const Pulsar = require('pulsar-client')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const crypto = require('crypto')
const aes256 = require('aes256')
const http = require("../API/server.js")
const app = require('../API/app.js')

// Import environement variables
const  { API_PORT, SOCKET_HOSTNAME, PULSAR_CLIENTURL, REDIS_CLIENTURL, SOCKET_PORT } = require('../constants/config.js');



// Setup express and socket.io for socket connection with the UI
const io = require('socket.io')(http, {
    cors: {
        origin: `http://localhost:3000`
    }
})
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Usage of the imported routes
//app.use('/user', UserRoute)

// Setup private and public keys to ensure CIA between the notification service and the UI
const bob = crypto.createECDH('secp256k1')
bob.generateKeys()
const bobPublicKeyBase64 = bob.getPublicKey().toString('base64')
/*const bobSharedKey = bob.computeSecret(alicePublicKeyBase64, 'base64', 'hex');
const encrypted = aes256.encrypt(bobSharedKey, message);
const decrypted = aes256.decrypt(bobSharedKey, encrypted);*/


// Globale variables
let notifReceived = false


// Create a pulsar client
const pulsarClient = new Pulsar.Client({
    serviceUrl: PULSAR_CLIENTURL,
    operationTimeoutSeconds: 30,
});


// Receive function to consume 
const subscribeConsumer = async() => {
    // Create a consumer = Notification Service for any service in the topics
    const consumer =  await pulsarClient.subscribe({
        consumerName: 'notification-service',
        topics: ['owner_service_notif', 'payment_service_notif', 'escort_service_notif', 'reservation_service_notif'],
        subscription: 'notification_service',
        subscriptionType: 'Key_Shared',
        ackTimeoutMs: 10000,
        receiverQueueSize: 1000,
        //privateKeyPath: "../certificate/private-key.client-rsa.pem"
    });

    // Receive Notification from pulsar broker
    const msg = await consumer.receive();
    
    const topicName = msg.getTopicName();
    const notif = msg.getData().type
    console.log("type: "+msg.getData());

    // Display the notification and the properties in the terminal
    console.log(msg.getMessageId()); // MessageId {}
    console.log(topicName); // persistent://public/default/Reservation Service Notif
    //console.log(msg.getPartitionKey());
    //console.log(JSON.parse(msg.getData().toString()));
    
    // Acknowledge and close the consumer
    consumer.acknowledge(msg);
    notifReceived = true;
    await consumer.close();
    return {topicName: topicName, notif: notif}
}

const consumeMessage = async() =>{
    while(!notifReceived){
        let {topicName, notif} = await subscribeConsumer()
        console.log(JSON.parse(notif))
        
        if(notifReceived){
            //console.log(notif.getProperties());
            notifReceived = false;
        }
    }
}

io.on("connection", async(socket) => {
    //await socket.disconnect()
    console.log('A Client got connected...')
    console.log(`⚡: ${socket.id} user just connected!`);


    // Main body of the notification consumer subscriber service. Everything is done here
    while(!notifReceived){
        const {topicName, notif} = await subscribeConsumer()
        if(notifReceived){
            // send the notification to the client
            let topic = topicName.substring(topicName.lastIndexOf('/')+1) // Example = persistent://public/default/Reservation Service Notif
            switch(topic){
                case 'owner_service_notif':
                    socket.emit("Owner Service",  notif);
                break;
                case 'payment_service_notif':
                    socket.emit("Payment Service",  notif);
                break;
                case 'escort_service_notif':
                    socket.emit("Escort Service",  notif);
                break;
                case 'reservation_service_notif':
                    let notification = {
                        service: "Reservation Service",
                        content: notif,
                        info: "Info"
                    }
                    console.log(`emit notification: ${JSON.stringify(notification)}`)
                    socket.emit("Reservation Service", JSON.stringify(notification));
                break;
                default:
                    console.log("Invalid Topic Name");
                break;
            }
            notifReceived = false;
        }

        // receive a message from the client
        socket.on("hello from client", async(data) => {
            //msg = JSON.parse(data)
            console.log('DATA received from client:' + data)
            
            // send a hello message to the client
            await socket.emit("hello from server",  JSON.stringify({content: 'Hello Client'}));
        });
        
        // When the Client emits logout
        socket.on("logout", async() => {
            console.log('🔥: A user is disconnected');
            await pulsarClient.close();
            socket.disconnect();
        })
    
        // When the Client emits disconnect
        socket.on("disconnect", async() => {
            console.log('🔥: A user is disconnected');
            await client.close();
            //socket.disconnect();
        })
    }
    
})
http.listen(API_PORT,()=>{
    console.log('ça marche')
    console.log("Waiting for client connection.....")
    consumeMessage()
})
