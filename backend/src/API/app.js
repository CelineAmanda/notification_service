const express = require('express')
const {API_PORT} = require('../constants/config.js')

/* import routers */
const UserRouter = require('./routes/user.js')
const NotificationRouter = require('./routes/notification.js')

/* create an express app and use JSON */
const app = new express()
app.use(express.json())


/* bring in some routers */
app.use('/api/user', UserRouter)
app.use('/api/notification', NotificationRouter)




module.exports=app