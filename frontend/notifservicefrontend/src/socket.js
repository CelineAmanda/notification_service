import {io} from 'socket.io-client'

const ServerURL = "http://localhost:8085"
const autoConnectEnabled = false
const socket = io(ServerURL, {
    autoConnect:autoConnectEnabled
});

export default socket