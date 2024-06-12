import React, { useState, useEffect } from 'react';
import { updateUser, createUser, deleteUser } from '../../apiService/userApi';
import dayjs from 'dayjs';
import { Modal, Button, Form, Input, Select, Space, DatePicker, message, Popconfirm } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const UserFormModal = ({ user, visible, onCancel, departments, companyId }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (user) {
      getUserData(user);
    } else {
      form.resetFields();
    }
  }, [user]);

  const getUserData = async (data) => {
    const formValues = {
      name: data.name,
      surname: data.surname,
      dni: data.dni,
      status: data.status,
      address: data.address,
      email: data.email,
      phoneNumber: data.phoneNumber,
      position: data.position,
      departmentId: data.departmentId?._id,
      personalMail: data.personalMail,
      phoneExt: data.phoneExt,
      bankAccount: data.bankAccount,
      birthDate: data.birthDate ? dayjs(data.birthDate) : null,
    };
    setInitialValues(formValues);
    form.setFieldsValue(formValues);
  };

  const onFinishData = async (values) => {
    try {
      const sanitizedValues = JSON.parse(JSON.stringify(values))
      if(user) {
        console.log(sanitizedValues);
        await updateUser(user._id, sanitizedValues);
        message.success('User data updated successfully!');
      } else {
        const newValues = {
          ...sanitizedValues, 
          profileType: "Employee", 
          password: "perro123", 
          companyId: companyId
        } 
        try {
          const response = await createUser(newValues)
          if(response.error !== "")
            if(response.error.includes('email')){
              message.error('El correo ya esta registrado')
              console.error(response.error)
            }
            else {
              message.error('No se ha podido crear el usuario, comprueba que los datos sean únicos!')
              console.error(response.error)
            }
        } catch (error) {
          message.error(error)
        }
      }
      onCancel();
    } catch (error) {
      message.error('Failed to update user data');
      console.error(error);
    }
  };

  const cancelDeleteUser = (e) => {
  }
  const confirmDeleteUser = async (e) => {
    try {
      if(user) {
        await deleteUser(user._id)
        message.success('Usuario borrado correctamente')
        onCancel()
      }
    } catch (error) {
      message.error('Algo ha fallado :/');
      console.error(error)
    }
  }

  const dateFormat = 'YYYY/MM/DD';

  const handleReset = () => {
    form.setFieldsValue(initialValues);
  };

  return (
    <Modal
      title={<h3 style={{ fontSize: '20px' }}>{user ? `Datos de ${user.name} ${user.surname}` : 'Añadir Nuevo Usuario'}</h3>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className='flex mt-5'>
        <Form form={form} name='validate_other' {...formItemLayout} onFinish={onFinishData} style={{ width: 700 }}>
          <Form.Item className='w-full' name='name' label='Nombre' rules={[{ required: true, message: 'Introduce tu nombre!' }]}>
            <Input />
          </Form.Item>
          <Form.Item className='w-full' name='surname' label='Apellidos' rules={[{ required: true, message: 'Introduce tus apellidos!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='E-mail' name='email' rules={[{ required: true, message: 'Introduce tu correo electrónico' }]}>
            <Input />
          </Form.Item>
          <Form.Item className='w-full' name='dni' label='DNI' rules={[{ required: true, message: 'Introduce tu DNI!' }]}>
            <Input />
          </Form.Item>
          <Form.Item className='w-full' name='departmentId' label='Departamento' rules={[{ required: true, message: 'Selecciona un departamento' }]}>
            <Select>
              {departments?.map(department => (
                <Option key={department._id} value={department._id}>
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className='w-full' name='status' label='Estado' rules={[{ required: true, message: 'Selecciona un estado' }]}>
            <Select>
              <Option value='Alta'>Alta</Option>
              <Option value='Baja'>Baja</Option>
              <Option value='Baja medica'>Baja medica</Option>
            </Select>
          </Form.Item>
          <Form.Item className='w-full' name='position' label='Posición' rules={[{ message: 'Introduce tu posición!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Dirección' name='address' rules={[{ message: 'Introduce una dirección!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='E-mail Personal' name='personalMail'>
            <Input />
          </Form.Item>
          <Form.Item label='Móvil' name='phoneNumber'>
            <Input />
          </Form.Item>
          <Form.Item label='Extensión' name='phoneExt'>
            <Input />
          </Form.Item>
          <Form.Item label='IBAN' name='bankAccount'>
            <Input />
          </Form.Item>
          <Form.Item label='Fecha de Nacimiento' name='birthDate'>
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button type='primary' htmlType='submit'>
                {user ? 'Actualizar' : 'Añadir'}
              </Button>
              <Button htmlType='button' onClick={handleReset}>
                Restablecer
              </Button>
              {user ? (
                  <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={confirmDeleteUser}
                  onCancel={cancelDeleteUser}
                  okText="Yes"
                  cancelText="No"
                  >
                  <Button danger>
                    Eliminar
                  </Button>
                  </Popconfirm>
                ) : ''}
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserFormModal;
