import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getOneUser } from '../../apiService/userApi';
import { useAuth } from "../../contexts/authContext";
import { useSocket } from "../../contexts/socketContext";
import './modalChat.scss';

const ChatModal = ({ listMessages }) => {
  const { userId, isHR } = useAuth();
  const { socket, connectedUsers, isHRconnected } = useSocket();
  const [user, setUser] = useState({});
  const [messageInput, setMessageInput] = useState('');

  const getUserData = async () => {
    try {
      const data = await getOneUser(userId);
      setUser(data);
      if (data.profilePic === "" || !data.profilePic) data.profilePic = "/noProfilePic.jpg";
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const message = {
      text: messageInput,
      user: {
        id: user.id,
        name: user.name,
        profilePic: user.profilePic
      }
    };
    
    socket.emit('chatMessage', message);
    setMessageInput('');
  };

  return (
    <div className="chat-modal">
      <div className="connected-users">
        {isHRconnected ? (
          <p className='p-2 text-center' style={{color:"#071829", fontWeight:'500', backgroundColor:'#e3e3e3'}}> {isHR!=="HR" ? 'Recursos Humanos y' : ''} {connectedUsers.length - 1}  {` usuario${(connectedUsers.length === 1 || connectedUsers.length >= 3) ? 's' : ''} conectado${(connectedUsers.length === 1 || connectedUsers.length >= 3) ? 's' : ''}`}</p>
        ) : (
          <p className='p-2 text-center' style={{color:"#071829", fontWeight:'500', backgroundColor:'#34B990'}}>Recursos Humanos no esta disponible</p>
        )}
      </div>

      {listMessages.length === 0 && (
        <div className="no-messages">
          <Empty description={false} />
        </div>
      )}

      {listMessages.length > 0 && (
        <div className="message-list">
          <ul>
            {listMessages.map((msg, index) => (
              <li key={index} className="message">
                <img src={msg.user.profilePic} alt="Avatar" className="avatar" />
                <div className="text">
                  <div className="username">{msg.user.name}</div>
                  <div>{msg.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="message-input">
       <input
          type="text"
          disabled={!isHRconnected || connectedUsers.length < 2}
          placeholder="Type message here"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        <SendOutlined onClick={sendMessage} style={{
          opacity: isHRconnected ? 1 : 0.5, 
          cursor: isHRconnected ? 'pointer' : 'not-allowed'
       
        }}
/>
      </div>
    </div>
  );
};

export default ChatModal;
