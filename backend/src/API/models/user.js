const { Entity, Schema, Repository } = require('redis-om')
const redisClient = require('../redisClient.js')


/* our entity */

class User extends Entity {}
 
/* create a Schema for User */
const userSchema = new Schema(User, {
    userID: { type: 'string'},
    socketID:{type:'string'},
    sharedKey: { type: 'string' },
    keywords:{type:'string[]'},
 	birthday:{type:'string'},
 	type:{type:'string'},
    gender:{type:'string'},
	phone:{type:'string'},
	firstName:{type:'string'},
	secondName:{type:'string'},
	isLocked:{type:'boolean'},
	isVerified:{type:'boolean'}

})

console.log("is open " + redisClient.isOpen())

/* use the redisClient to create a Repository just for User */
const userRepository = redisClient.fetchRepository(userSchema)

/* create the index for User*/
userRepository.createIndex()

module.exports = {
    userRepository
} 
