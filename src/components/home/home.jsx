import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { Outlet } from "react-router-dom";

import { useSocket } from "../../contexts/socketContext";

import ChatModal from '../../components/modals/modalChat';
import SideBar from '../sidebar/sidebar';

const Home = () => {
  const { socket } = useSocket();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [listMessages, setListMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Estado para contar mensajes no leídos

  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0); // Reiniciar el conteo de mensajes no leídos al abrir el modal
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', (message) => {
      // Incrementar el conteo de mensajes no leídos si el chat está cerrado
      if (!isChatOpen) {
        setUnreadCount(prevCount => prevCount + 1);
      }

      setListMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatMessage');
    }
  }, [socket, listMessages, isChatOpen]);

  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="p-8 h-full" style={{ width: 'calc(100vw - 200px)' }}>
          <Button
            id='chatIcon'
            type="primary"
            shape="circle"
            icon={isChatOpen ? <CloseOutlined style={{ fontSize: '28px' }} /> : <MessageOutlined style={{ fontSize: '28px' }} />}
            onClick={toggleChatModal}
          >
            {unreadCount > 0 && <Badge className="badge"count={unreadCount}/>}
          </Button>
          {isChatOpen && <ChatModal listMessages={listMessages} />}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
