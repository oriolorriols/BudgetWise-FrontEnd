import React, { useState, useEffect } from 'react';
import { updateUser } from '../../apiService/userApi';
import dayjs from 'dayjs';
import { Button, Form, Input, Select, Space, DatePicker, message } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const UserFormModal = ({ user }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (user) {
      getUserData(user)
      console.log(user)
    }
  }, [user]);

  const getUserData = async (data) => {
    if (data.profilePic === '' || !data.profilePic) data.profilePic = '/noProfilePic.jpg';
    const formValues = {
      name: data.name,
      surname: data.surname,
      dni: data.dni,
      status: data.status,
      address: data.address,
      email: data.email,
      phoneNumber: data.phoneNumber,
      position: data.position,
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
      await updateUser(user._id, values);
      await getUserData(values);
      message.success('User data updated successfully!');
    } catch (error) {
      message.error('Failed to update user data');
      console.error(error);
    }
  };

  const dateFormat = 'YYYY/MM/DD';

  const handleReset = () => {
    form.setFieldsValue(initialValues);
  };

  return (
    <>
      <div className='flex'>
        <Form form={form} name='validate_other' {...formItemLayout} onFinish={onFinishData} style={{ width: 650 }}>
          <h2 className='text-lg font-bold mb-7'>Datos Personales</h2>
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
          <Form.Item className='w-full' name='position' label='Posición' rules={[{ message: 'Introduce tu posición!' }]}>
            <Input />
          </Form.Item>
          <Form.Item className='w-full' name='status' label='Estado' rules={[{ message: 'Selecciona un estado' }]}>
            <Select>
              <Option value='Alta'>Alta</Option>
              <Option value='Baja'>Baja</Option>
              <Option value='Baja medica'>Baja medica</Option>
            </Select>
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
                Actualizar
              </Button>
              <Button htmlType='button' onClick={handleReset}>
                Restablecer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default UserFormModal
