import React, { useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;
const Chat = () => {
  const [chatMessage, setChatMessage] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    connected: false,
    message: "",
  });

  //register input
  const handleUsername = (e) => {
    const newName = e.target.value;
    setUserData({ ...userData, username: newName });
    console.log(userData);
  };

  const connectUser = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
  };

  const onMessageReceived = () => {
    let payloadData = JSON.parse(payloadData);
    switch (payloadData.status) {
      case "CONNECT":
        break;
      case "MESSAGE":
        chatMessage.push(payloadData);
        setChatMessage([...chatMessage]);
        break;
    }
  };

  const userJoin = () => {
    let message = {
      senderName: userData.username,
      status: "CONNECT",
    };
    stompClient.send("/app/message", {}, JSON.stringify(message));
  };

  const handleMessage = (e) => {
    let newMessage = (e.target.value);
    setUserData({...userData, message: newMessage});
  }

  const SendMessage = () => {
    if (stompClient) {
      let messanger = {
        senderName: userData.username,
        message: userData.message,
        staus: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(messanger));
      setUserData({...userData, message: ""})
    }
  }

  return (
    <div>
      {userData.connected ? (
        <div>
          <p>Chatroom</p>
          {
            <div>
              <ul>
                {chatMessage.map((chat, index) => (
                  <li>
                    {chat.senderName !== userData.username && (
                      <div>{chat.senderName}</div>
                    )}
                    <div>{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div>{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div>
                <input
                  type="text"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button onClick={SendMessage}>Send Message</button>
              </div>
            </div>
          }
        </div>
      ) : (
        <div>
          <h1>Register</h1>
          <input
            type="text"
            name="userName"
            id="user-name"
            placeholder="Enter your name"
            onChange={handleUsername}
            className="border"
          />
          <button onClick={connectUser} type="button" className="bg-blue-500">
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
