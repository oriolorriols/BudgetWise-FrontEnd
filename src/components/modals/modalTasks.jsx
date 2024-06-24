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
      message.error("Por favor, complete el formulario correctamente.");
    }
  };

  return (
    <Modal
      title="Crear nueva tarea"
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
        name="new_task_form"
      >
        <Form.Item
          name="taskName"
          label="Nombre de la tarea"
          rules={[{ required: true, message: 'Por favor, introduce el nombre de la tarea' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label="Descripción de la tarea"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="taskStatus"
          label="Estado de la tarea"
          rules={[{ required: true, message: 'Por favor, indica el estado de la tarea' }]}
        >
          <Select placeholder="Selecciona estado">
            <Option value="Pendiente">Pendiente</Option>
            <Option value="Completada">Completada</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTaskModal;
