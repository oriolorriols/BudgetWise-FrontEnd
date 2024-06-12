import React, { useState } from 'react'
import { addExpenses } from '../../apiService/expensesApi'
import { Modal, Button, Form, Input, Select, Space, DatePicker } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ExpenseModal = ({ user, visible, onCancel }) => {
  const [form] = Form.useForm();

  const onFinishData = async (values) => {
    console.log(values)
    //const response = await addExpenses(values)
  }

  
  const dateFormat = 'YYYY/MM/DD';

  return (
    <Modal
      title={<h3 style={{ fontSize: '20px' }}> Añadir un gasto</h3>}
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={700}
    >
      <div className='flex mt-5'>
        <Form form={form} name='validate_other' {...formItemLayout} onFinish={onFinishData} style={{ width: 700 }}>
        <Form.Item rules={[{ required: true, message: 'Introduce tus apellidos!' }]} label='expenseDate' name='expenseDate'>
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item className='w-full' name='paymentMethod' label='paymentMethod' rules={[{ required: true, message: 'Introduce tus apellidos!' }]}>
          <Select>
            <Option value="Personal">
              Personal
            </Option>
            <Option value="Business Card">
              Business Card
            </Option>
        
            </Select>
          </Form.Item>
          <Form.Item className='w-full' name='expenseTraslados' label='Traslados' rules={[{ required: true, message: 'Introduce tu DNI!' }]}>
              <Input type='number' suffix="€" />
          </Form.Item>
          <Form.Item className='w-full' name='expenseDietas' label='Dietas' rules={[{ message: 'Introduce tu posición!' }]}>
            <Input type='number' suffix="€" />
          </Form.Item>
          <Form.Item className='w-full' name='expenseHospedajes' label='Hospedajes' rules={[{ required: true, message: 'Selecciona un departamento' }]}>
            <Input type='number' suffix="€" />
          </Form.Item>
         
  

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button type='primary' htmlType='submit'>
                Añadir
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default ExpenseModal;
