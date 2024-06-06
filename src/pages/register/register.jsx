import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Select, Typography } from 'antd';
import './register.scss'
const { RangePicker } = DatePicker;
const { Title } = Typography;


export const Register = () => (

    <div className='flex justify-center items-center h-screen wrapper'>
    <div className='card'>
        <div className='text-center mb-5'>
        <img className="m-auto" src="/BudgetWiseGB.png" width="250px" alt="" draggable="false"/>
        </div>
        <div className='login-form-container'>
    <div className='m-auto bg-white max-w-screen-sm rounded-lg p-6 mt-6'>
        <Form layout="vertical" className='flex flex-col max-w-fit content-end'>
            <Title>Formulario de registro</Title>
            <Form.Item
            label="Nombre de la compañia"
            name="companyName"
            rules={[
                {
                required: true,
                message: 'Añade un nombre!',
                },
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Dirección de la compañía"
            name="companyAddress"
            className=''
            rules={[
                {
                required: true,
                message: 'Añade una dirección!',
                },
            ]}
            >
            <Input className="mb-2" placeholder='Dirección'/>
            <Input className="mb-2" placeholder='Código Postal'/>
            <Input className="mb-2" placeholder='Ciudad'/>
            <Input placeholder='País'/>
            </Form.Item>

            <Form.Item
            label="Número de teléfono"
            name="phoneNumber"
            rules={[
                {
                len: 9,
                required: true,
                message: 'Añade un número de teléfono!',
                },
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Plan"
            name="plan"
            rules={[
                {
                required: true,
                message: 'Selecciona un plan!',
                },
            ]}
            >

                <Select
                    placeholder="Selecciona una de las opciones"
                    allowClear
                    >
                    <Option value="Small">Pequeña empresa (1-50)</Option>
                    <Option value="Medium">Mediana empresa (50-150)</Option>
                    <Option value="Large">Gran empresa (+150)</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full mb-3"
                onClick={''}>
                Crear Empresa
                </Button>
                ¡Volver <Link to="/login"><span className='link'>al login</span></Link>!
            </Form.Item>
            
        </Form>
        
        </ div>
        </ div>
    </div>
  </div>
);