import React, {useEffect, useState} from 'react'
import './NotificationPage.css'
import socket from '../../socket.js'
import { AlertBox } from '../../Components'
import aes256 from 'aes256';

function NotificationPage(props) {
    
    const [notifications, setNotifications] = useState([]);
    const [socketID, setSocketID] = useState(socket.id);
  
    
    const closeBox = (index) =>{
        let tempNotifications= [...notifications]
        tempNotifications.splice(index,1)
        setNotifications(tempNotifications)
    }
    /*****************************************/
    
    useEffect(() => {
        
        // receive a message from the client
        
        socket.on('test-socket', (data) => {
            const socketID = (JSON.parse(data).socketID === socket.id)? JSON.parse(data).socketID : socket.id
            setSocketID(socketID)
            console.log("Test OK")
        });

        socket.on('get-notifications',(data)=>{
            const notifs = data.map(notif => JSON.parse(aes256.decrypt(props.sharedKey,notif)))
            let prevNotif = [...notifications]
            notifs.forEach(element => {
                prevNotif.push(element)
            });
            setNotifications(prevNotif)
            console.log("get-notif")
        })

        socket.on('instant-notification', (data) => {
            //setNotifications([...notifications, JSON.parse(data)])
            const notifs  = JSON.parse(aes256.decrypt(props.sharedKey, data))
            let prevNotif = [...notifications]
            notifs.forEach(element => {
                prevNotif.push(element)
            });
            setNotifications(prevNotif)
            console.log("instant-notif")
        });
        return () => {
            socket.off('test-socket')
            socket.off('get-notifications');
            socket.off('instant-notification')
        };
        
    }, [notifications, props.sharedKey]);
    /*---------------------------*/

    const notificationComponent = notifications.map((notif, index) => {
        return(
            <AlertBox
                key = {index}
                notifIndex = {index}
                type={notif.type}
                status = {notif.status}
                content = {notif.content}
                sendDateTime = {notif.sendDateTime}
                closeBox = {closeBox}
            />
        )
    }
    )
    /*---------------------------*/

    return (
        <div className='notofocation-page'>
            <h1>NOTIFICATION SERVICES</h1>
            <p className='onlineText'>User UI Connected with socket id ⚡: ${socketID}</p>
            <p>Ready to receive notifications</p>
            <p>All notifications will be displayed here</p>
            <div className="alert-containers">
                {notificationComponent}
            </div>
        </div>
    )
}

export default NotificationPage