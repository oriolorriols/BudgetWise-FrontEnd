import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getOneUser } from '../../apiService/userApi';
import { useAuth } from "../../contexts/authContext";
import { useSocket } from "../../contexts/socketContext";
import './modalChat.scss';

const ChatModal = ({ listMessages }) => {
  const { userId } = useAuth();
  const { socket, connectedUsers } = useSocket();
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
        {connectedUsers.length > 0 ? (
          <p>{connectedUsers.length} personas conectadas</p>
        ) : (
          <p>Nadie está conectado actualmente</p>
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
          placeholder="Type message here"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <SendOutlined onClick={sendMessage} />
      </div>
    </div>
  );
};

export default ChatModal;
