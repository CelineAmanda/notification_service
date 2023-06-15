const { notificationRepository } = require('../models/notification.js')
const userBase=require('./userBase.js')
 

module.exports.addNotif = async(notifObject)=>{
    try {
        console.log(notifObject)
        const notification = await notificationRepository.createAndSave(notifObject)
        await notificationRepository.createIndex()
        return {notification: notification, status:201}
    } catch (error) {
        return{error: error.message,status:409}
        
    }

}



module.exports.getNotificationsByPhone = async(phone) => {
    try{
        let allUserNotif = []
        console.log("Getting")
        const userId= await userBase.getUserIdByPhone(phone)
        console.log("userID :"+userId.userID)
        const notifs = (await notificationRepository.search().where('userID').equals(userId.userID).returnAll()).forEach(
            async(element) => {
                const notif = await notificationRepository.fetch(element.entityId)
                console.log(notif.type)
                allUserNotif.push(notif)
                //allUserNotif.push(notif)
                console.log("tableau: " + allUserNotif)
            });
        console.log("tableau1: "+allUserNotif)
        return {notifs:allUserNotif, status:201}
        
    }catch(error){
        return {error:error.message, status: 404}
    }
}



module.exports.getNotificationsByPhone1 = async (phone) => {

    try{
        let notificationRep = await userBase.getUserIdByPhone(phone)
                        .then(userBase => notificationRepository.search().where('userID').equals(userBase.userID))
                        .then(notificationRep => notificationRep.returnAll());

        let allUserNotif = []

        for (let index = 0; index < notificationRep.length; index++) {

            const element = notificationRep[index];
            const notif = await notificationRepository.fetch(element.entityId)
            console.log('loggggg:', notif)
            allUserNotif.push(notif)
            
        }
        return {notifs:allUserNotif, status:201};
    }
    catch(error){
        return {error:error.message, status: 404}
    }     

}



module.exports.updateNotification = async(id) => {
   try {
    const notification = await notificationRepository.fetch(id)

    notification.type = req.body.type ?? null
    notification.userID = req.body.userID ?? null
    notification.content = req.body.content ?? null
    notification.links = req.body.links ?? null
    notification.sendDateTime = req.body.sendDateTime ?? null
    notification.status = req.body.status ?? null
    notification.isRead = req.body.isRead ?? null
    notification.isDelete = req.body.isDelete ?? null

    await notificationRepository.save(notification)
    return {notification: notification,status:201}
   } 
   catch (error) {
    return {error: error, status:404}
   }
}

