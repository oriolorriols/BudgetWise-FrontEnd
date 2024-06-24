import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, message, Select } from 'antd';

const { Option } = Select;

const NewTaskModal = ({ visible, onCancel, onCreate, goalId }) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      onCreate({ ...values, goalId });
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Please complete the form correctly.");
    }
  };

  return (
    <Modal
      title="Create New Task"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreate}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="new_task_form"
      >
        <Form.Item
          name="taskName"
          label="Task Name"
          rules={[{ required: true, message: 'Please enter the task name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label="Task Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="taskStatus"
          label="Task Status"
          rules={[{ required: true, message: 'Please select a task status' }]}
        >
          <Select placeholder="Select status">
            <Option value="Pendiente">Pendiente</Option>
            <Option value="Completada">Completada</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTaskModal;
