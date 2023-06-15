const notifBase = require('./notifBase.js')

/*create user*/
module.exports.addNotif = async(req, res) =>{
    
   data= req.body
    data['sendDateTime']= Date.now()
    const {status, notification, error} = await notifBase.addNotif(data)
    if(status === 201){
        res.status(status).json({message: notification})
    }
    else{
        res.status(status).json({message: error})
    }
}

/* select all notification of user*/
module.exports.notifs= async (req, res) => {
    const userID = req.params.userID
    const {status,notifs,error}= await notifBase.getNotifications(userID)
    if(status === 201){
        res.status(status).json({message: notifs})
    }
    else{
        res.status(status).json({message: error})
    }
}

/* update notification */
module.exports.updateNotif = async (req, res) => {
  
    const notification = await notif.fetch(req.params.id)
  
    notification.type = req.body.type ?? null
    notification.userID = req.body.userID ?? null
    notification.content = req.body.content ?? null
    notification.links = req.body.links ?? null
    notification.sendDateTime = req.body.sendDateTime ?? null
    notification.status = req.body.status ?? null
    notification.isRead = req.body.isRead ?? null
    notification.isDelete = req.body.isDelete ?? null
  
    await notifRepository.save(notification)
  
    res.send(notification)
}