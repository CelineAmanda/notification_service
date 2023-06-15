const dotenv = require('dotenv')
//const path = require('path')

dotenv.config({
    path: "../config/.env" /*path.join(process.cwd(), '/src/config/.env')*/
})
const pulsarIP = "127.0.0.1"

const SOCKET_HOSTNAME = process.env.SOCKET_HOSTNAME || '127.0.0.1'
const SOCKET_PORT = process.env.SOCKET_PORT || 4000
const API_PORT = process.env.API_PORT || 8085

const PULSAR_PORT = process.env.PULSAR_PORT || 6650
const PULSAR_CLIENTURL = `pulsar://${pulsarIP}:${PULSAR_PORT}`
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_CLIENTURL = `redis://${SOCKET_HOSTNAME}:${REDIS_PORT}`


module.exports = {
    SOCKET_HOSTNAME,
    SOCKET_PORT,
    API_PORT,
    PULSAR_CLIENTURL,
    REDIS_CLIENTURL
}