import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, message } from 'antd';

const NewObjectiveModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Please complete the form correctly.");
    }
  };

  return (
    <Modal
      title="Create New Objective"
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
        name="new_objective_form"
      >
        <Form.Item
          name="objectiveName"
          label="Objective Name"
          rules={[{ required: true, message: 'Please enter the objective name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="objectiveDescription"
          label="Objective Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewObjectiveModal;
