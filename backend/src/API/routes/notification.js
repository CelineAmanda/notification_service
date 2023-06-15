const express = require('express')
const notifController = require('../controllers/NotifController.js') 
const notificationRouter= express.Router()


notificationRouter.put('/addNotif',(req,res) => {notifController.addNotif(req,res)})
  
notificationRouter.get('/notifs/:userID',(req,res) => {notifController.notifs(req,res)})
  
notificationRouter.post('/updateNotif/:id',() => { notifController.updateNotif()})
  

module.exports = notificationRouter