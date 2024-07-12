import React from 'react';
import { Modal } from 'antd';

const ImageModal = ({ visible, onCancel, expenseUrl }) => {
  return (
    <Modal open={visible} onCancel={onCancel} footer={null}>
        <div className='m-5'>
            <img src={expenseUrl} alt="Ticket" style={{ width: '100%' }} />
        </div>
    </Modal>
  );
};

export default ImageModal;
