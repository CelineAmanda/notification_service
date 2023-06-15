const { Entity, Schema, Repository } = require('redis-om')
const redisClient = require('../redisClient.js')

/* our entity */
class Notification extends Entity {}

/* create a Schema for Notification */
const notificationSchema = new Schema(Notification, {
    type: { type: 'string' },//text,Texte-lien
    userID: { type: 'string' },
    content: { type: 'string' },
    links: { type: 'string[]' },
    sendDateTime: { type: 'string' },
    status: { type: 'string' },//warning,information,succes,danger
    isRead:{type:'boolean',default:false},
    isDelete:{type:'boolean',default:false},
})

/* use the redisClient to create a Repository just for Notification */
const notificationRepository = redisClient.fetchRepository(notificationSchema)
module.exports ={
    notificationRepository
}

/* create the index for Notification*/
notificationRepository.createIndex() 