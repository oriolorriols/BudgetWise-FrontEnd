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
      message.error("Por favor, complete el formulario correctamente.");
    }
  };

  return (
    <Modal
      title="Crear nuevo objetivo"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreate}>
          Crear
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
          label="Nombre del objetivo"
          rules={[{ required: true, message: 'Por favor, introduce el nombre del objetivo' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="objectiveDescription"
          label="Descripción del objetivo"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Fecha límite"
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewObjectiveModal;
