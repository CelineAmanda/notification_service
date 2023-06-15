const { Client } = require('redis-om')
// pulls the Redis URL from .env
const  { REDIS_CLIENTURL } = require('../constants/config');


// create and open the Redis OM Client
const redisClient = new Client()

redisClient.open(REDIS_CLIENTURL)

module.exports = redisClient