import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, message, Select } from 'antd';

const { Option } = Select;

const NewTaskModal = ({ visible, onCancel, onCreate, goalId, task }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) {
      console.log('task', task);
      form.setFieldsValue(task);
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      onCreate({ ...values, goalId, id: task ? task.id : undefined });
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Por favor, complete el formulario correctamente.");
    }
  };

  return (
    <Modal
      title={task ? "Editar tarea" : "Crear nueva tarea"}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreate}>
          {task ? "Guardar cambios" : "Crear"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="new_task_form"
      >
        <Form.Item
          name="name"
          label="Nombre de la tarea"
          rules={[{ required: true, message: 'Por favor, introduce el nombre de la tarea' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción de la tarea"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="status"
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
