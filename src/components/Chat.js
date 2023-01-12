import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  //register input
  const handleUsername = (e) => {
    const {value} = e.target;
    setUserData({ ...userData, username: value });
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
    userJoin();
  };

  const userJoin = () => {
    let message = {
      senderName: userData.username,
      status: "CONNECT",
    };
    stompClient.send("/app/message", {}, JSON.stringify(message));
  };
  
  const onMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "CONNECT":
        break;
      case "MESSAGE":
        chatMessage.push(payloadData);
        setChatMessage([...chatMessage]);
        break;
    }
  };

  const handleMessage = (e) => {
    const {value} = e.target;
    setUserData({...userData, message: value});
  }

  const SendMessage = () => {
    if (stompClient) {
      let messanger = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      console.log(messanger)
      stompClient.send("/app/message", {}, JSON.stringify(messanger));
      setUserData({...userData, message: ""})
    }
  }

  return (
    <div className="bg-neutral-900 flex flex-col justify-center items-center h-[100vh] w-full p-10">
      
        {userData.connected ? (
          <div className="bg-neutral-800 flex flex-col items-center h-screen w-2/3 rounded-2xl border-2">
            <div className="flex justify-between items-center w-[90%] border-b-2 mb-5">
              <p className="text-4xl text-white font-bold my-5 w-full">Chatroom</p>
              <p className="bg-blue-500 w-20 h-10 flex items-center justify-center text-xl text-white border-2 rounded-full mt-2">{userData.username}</p>
            </div>
            {
              <div className="flex flex-col justify-between h-full w-[90%]">
                <ul className="max-h-[70vh] w-full overflow-auto">
                  {chatMessage.map((chat, index) => (
                    <li className={`flex justify-end items-center h-14 gap-8 ${chat.senderName === userData.username && "self"}`} key={index}>
                      
                      {chat.senderName !== userData.username && (
                      <div className="bg-green-400 text-white flex items-center px-4 py-1 rounded-full ">{chat.message}</div>
                      )}

                      {chat.senderName === userData.username && (
                      <div className="bg-emerald-600 text-white flex items-center px-4 py-1 rounded-full ">{chat.message}</div>
                      )}

                      {chat.senderName !== userData.username && (
                        <div className="border-2 bg-green-500 flex justify-end items-center rounded-full text-white h-10 w-auto p-1">{chat.senderName}</div>
                      )}
                      
                      {chat.senderName === userData.username && (
                        <div className="border-2 bg-emerald-600 flex justify-end items-center rounded-full text-white h-10 w-auto p-1">{chat.senderName}</div>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="bg-neutral-900 flex justify-between w-full p-2 gap-2 rounded-2xl px-5 mb-5">
                  <input
                    type="text"
                    placeholder="Enter the message"
                    value={userData.message}
                    onChange={handleMessage}
                    className="bg-neutral-900 h-full w-5/6 rounded-full px-2 text-white outline-0"
                  />
                  <button type="button" onClick={SendMessage} className="bg-green-500 h-10 w-16 border-2 rounded-full text-white">Send</button>
                </div>
              </div>
            }
          </div>
        ) : (
          <div className="bg-neutral-800 h-96 w-96 flex flex-col justify-center items-center gap-4 rounded-xl">
            <h1 className="text-white font-bold text-4xl">Register</h1>
            <input
              type="text"
              name="userName"
              id="user-name"
              placeholder="Enter your name"
              onChange={handleUsername}
              className="h-10 rounded-xl px-2 outline-0"
            />
            <button onClick={connectUser} type="button" className="bg-green-600 h-10 w-28 rounded-xl text-white font-bold text-xl">
              Connect
            </button>
          </div>
        )}

      
    </div>
  );
};

export default Chat;
