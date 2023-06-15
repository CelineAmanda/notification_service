const Pulsar = require('pulsar-client');

const  { PULSAR_CLIENTURL } = require('../constants/config.js');
/*

Status Guides:
1) Danger: Indicates a dangerous or potentially negative action.
2) Success: Indicates a successful or positive action.
3) Info: Indicates a neutral informative change or action.
4) Warning: Indicates a warning that might need attention.

*/

/*-----*****----- Producer's(Service) Info -----*****-----*/
/*---------- Obligatory ----------*/
const serviceTopic = 'reservation_service_notif'
const serviceName = "reservation_service"
const serviceKey = 'rs_notif'

/*const serviceTopic = 'escort_service_notif'
const serviceName = "escort_service"
const serviceKey = 'es_notif'*/

/*const serviceTopic = "payment_service_notif"
const serviceName = "payment_service"
const serviceKey = 'ps_notif'*/

/*---------- Service related ----------*/
const dateTime = new Date()
const sendDateTime = `${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}, ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`
const status = "Information"
const isDelete=false
const isRead=false

/*---------- Service Parameter ----------*/
const type = "user_Information"
const userID = "user010157"
const content = {
    userID:userID,
    keywords:["musique","sport"],
 	birthday:"08-09-2001",
 	type:"pooler" ,
    gender:"male",
	phone:"+237688776699",
	firstName:"Hetsron",
	secondName:"Alfred",
	isLocked:false,
	isVerified:false,
}

// const type = "texte-lien"
// const userID = "user010257"
// const content = "Votre Voyage est terminé"


/*---------- Extra Service Parameter ----------*/
const sendTimeout = 30000
const serviceMsgStartId = 1
const maxPendingMessages = 1000
const messageBatching = true;

/*---------- Notification object Info to be sent by service----------*/
const notificationObject = {
    type:type,
    userID :userID,
    content:content,
    sendDateTime:sendDateTime,
    status:status,
    isDelete:isDelete,
    isRead:isRead,
};

(async () => {
  // Create a pulsar client
    const client = new Pulsar.Client({
        serviceUrl: PULSAR_CLIENTURL,
        operationTimeoutSeconds: 30,
    });

    // Create a producer = Owner Serveice, Payment Service, Escort Service and Reservation Service
    const producer = await client.createProducer({
        topic: serviceTopic,
        producerName: serviceName,
        sendtimeoutMs: sendTimeout,
        intialSequenceId: serviceMsgStartId,
        maxPendingMessages: maxPendingMessages,
        bacthingEnabled: messageBatching
        /*publicKeyPath: "../certificate/public-key.client-rsa.pem",
        encryptionKey: "encryption-key"*/
    });

    // Send messages
    await producer.send({
        data: Buffer.from(JSON.stringify(notificationObject)),
        partitionKey:serviceKey,
        deliverAt: Date.now(),
        eventTimestamp: Date.now(),
        properties: {
            userID:userID
        },
    });
    console.log(`Sent message: ${JSON.stringify(notificationObject)}`);
    await producer.flush();

    await producer.close();
    await client.close();
})();