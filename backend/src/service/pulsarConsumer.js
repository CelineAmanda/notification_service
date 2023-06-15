const Pulsar = require('pulsar-client')
const {addNotif}=require('../API/controllers/notifBase')
const userBase = require('../API/controllers/userBase')

// Import environement variables
const  {PULSAR_CLIENTURL} = require('../constants/config.js');

// Globale variable
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
    let instantNotification = "null"
    const msg = await consumer.receive();
    const topicName = msg.getTopicName();
    const type = JSON.parse(msg.getData()).type;

    if(type === "user_Information"){
        const notif = await JSON.parse(msg.getData());
        const userObject = notif.content
        console.log(userObject)
        console.log(notif.userID === userObject.userID)
        if(notif.userID === userObject.userID){
            const phone = userObject.phone
            const {status, error} = await userBase.updateUserByPhone(phone,userObject)
            if(status === 201){
                console.log({message:"User updated successfully", phone: phone})
            }
            else{
                console.log(`User not updated with Error: ${error}`)
            }
        }
        const dateTime = new Date()
        const notification ={
            userID : userObject.userID,
            type : "text",
            status:"Information",
            content:`Bienvenue ${userObject.firstName} ${userObject.secondName} sur letsgo`,
            sendDateTime:`${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}, ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`,
            isDelete:false,
            isRead:false,
        }
        const {status, error} = await addNotif(notification)
        if(status === 201){
            console.log({message:"Notification added successfully", type: notification.type})
            instantNotification = notification
        }
        else{
            console.log(`Notification not added with Error: ${error}`)
        }
    } else{
        const notification = await JSON.parse(msg.getData());
        const {status, error} = await addNotif(notification)
        if(status === 201){
            console.log({message:"Notification added successfully", type: notification.type})
            instantNotification = notification
        }
        else{
            console.log(`Notification not added with Error: ${error}`)
        }
    }
    // Display the notification and the properties in the terminal
    //console.log(msg.getMessageId()); // MessageId {}
    //console.log(topicName); // persistent://public/default/Reservation Service Notif
    //console.log(msg.getPartitionKey());
    //console.log(JSON.parse(msg.getData().toString()));
    
    // Acknowledge and close the consumer
    consumer.acknowledge(msg);
    notifReceived = true;
    await consumer.close();
    return instantNotification
}

module.exports.consumeMessage = async() =>{
    while(!notifReceived){
        let notif = await subscribeConsumer()
        //console.log(notif)
        //addNotif(notif)
        
        if(notifReceived){
            //console.log(notif.getProperties());
            notifReceived = false;
        }
        return notif
    }
}