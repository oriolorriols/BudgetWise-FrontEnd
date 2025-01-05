import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from 'react-router-dom';

const TokenModal = ({ visible }) => {
    const { setLogOut } = useAuth();
    const navigate = useNavigate();

    const onOk = () => {
        setLogOut();
        navigate('/login');
    };

    return (
        <Modal
            title={<span><ExclamationCircleOutlined style={{ color: 'red' }} /> Token is expired. Please Log In again</span>}
            open={visible}
            onOk={onOk}
            closable={false}
            okText="OK"
            footer={[
                <Button key="ok" type="primary" onClick={onOk}>OK</Button>,
            ]}
            transitionName="zoom" 
        />
    );
};

export default TokenModal;
