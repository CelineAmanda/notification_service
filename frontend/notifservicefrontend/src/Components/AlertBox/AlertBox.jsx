import React from 'react'
import './AlertBox.css'

function AlertBox(props) {
    const status = props.status
    let statusStyle;
    switch(status){
        case "Success":
            statusStyle = {backgroundColor: '#04AA6D'}
            break;
        case "Error":
            statusStyle = {backgroundColor: '#f44336'}
            break;
        case "Information":
            statusStyle = {backgroundColor: '#2196F3'}
            break;
        case "Warning":
            statusStyle = {backgroundColor: '#ff9800'}
            break;
        default:
            statusStyle = {backgroundColor: '#2196F3'}
        break;
    }
    return (
        <div className="alert" style={statusStyle}>
            <span className="service-name">{props.type}</span>
            <span className="closebtn" onClick={() => props.closeBox(props.notifIndex)}>&times;</span>
            <div className="alert-content">
                <span className="alert-status">{props.status}!</span>
                <span className="alert-msg">{props.content}</span>
                <span className="alert-msg">{props.sendDateTime}</span>
            </div>
        </div>
    )
}

export default AlertBox