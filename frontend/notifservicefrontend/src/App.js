import React, { useState, useEffect } from "react";
import socket from './socket';
import credential from './publicKey';
import { NotificationPage } from './Routes'
import './App.css'
const alice = credential.alice
const alicePublicKeyBase64 = credential.alicePublicKeyBase64


//const aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex');
//const encrypted = aes256.encrypt(aliceSharedKey, message);
//const decrypted = aes256.decrypt(aliceSharedKey, encrypted);


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [phone, setPhone] = useState("+237699887766")
  const [sharedKey, setSharedKey] = useState("")

  const connectSocket = () =>{
    setIsConnected(true)
    socket.connect()
  }

  const disconnectSocket = () =>{
    setIsConnected(false)
    setPhone("")
    console.log('User Disconnected')
    socket.disconnect()
  }

  useEffect(()=>{
    socket.on("connect", () => {
      console.log(`socketId: ${socket.id}`); 
      console.log(`User UI conected: ${socket.connected}`);  
      
      // send a message to the server
      socket.emit("client-public-key", JSON.stringify({phone:phone, content: alicePublicKeyBase64}));
  });

  socket.on('server-public-key', (data)=>{
    const bobPublicKeyBase64 = JSON.parse(data).content;
    setSharedKey(alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex'));
    console.log(`Shared key: ${sharedKey}`)

  });

  return () => {

    socket.off("connect");
    socket.off('server-public-key');
  }
  }, [phone, sharedKey])

  const handlePhonechange = (e) =>{
      setPhone(e.target.value)
  }
  return (
    <div className="App">
        {!isConnected? 
          <>
            <p className="logout-text">User UI not logged in, press Login button to login</p>
            <button className="login-btn" onClick={connectSocket}>
              <div>
                <span>
                  <p>You are logged out</p>
                </span>
              </div>
              <div>
                <span>
                  <p>Login</p>
                </span>
              </div>
            </button>
            <div>
              <br />
              <br />
              <br />
              <form>
                <label>
                  Phone:
                  <input type="text" value={phone} onChange={handlePhonechange} />
                </label>
              </form>
            </div>
          </>
        :
        <>
          <button className="logout-btn" onClick={disconnectSocket}>
            <div>
              <span>
                <p>You are logged in</p>
              </span>
            </div>
            <div>
              <span>
                <p>Logout</p>
              </span>
            </div>
          </button>
          <NotificationPage sharedKey={sharedKey}/>
        </>
        }
    </div>
  );
}

export default App;