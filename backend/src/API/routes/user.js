const express = require('express')
const  userController = require('../controllers/UserController.js')
const userRouter= express.Router()


userRouter.put('/addUser', (req,res) => { 
    console.log(req.body)
    userController.addUser(req,res)})
    
userRouter.post('/updateUser',() =>{userController.updateUser()} )

module.exports= userRouter