import React, { useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;
const Chat = () => {
  const [userData, setUserData] = useState({
    username: "",
    connected: false,
    message: ""
  });

  //register input
  const handleUsername = (e) => {
    const newName = (e.target.value);
    setUserData({...userData, username: newName})
    console.log(userData)
  };

  const connectUser = () => {
    let socket = new SockJS("http://localhost:8080/ws") 
    stompClient = over(socket);
    ;
  }

  return (
    <div>
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
        <button onClick={connectUser} type="button" className="bg-blue-500">Connect</button>
      </div>
    </div>
  );
};

export default Chat;
