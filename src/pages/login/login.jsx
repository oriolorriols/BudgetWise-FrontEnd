import React from 'react';
import { Link } from "react-router-dom";

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import './login.scss'

const Login = () => {

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  
  return (
    <div className='flex justify-center items-center h-screen'>
       <div className='max-w-md card'>
        <div className='mb-5'>
            <img src="/BudgetWiseGreen.png" width="250px" alt="" draggable="false"/>
        </div>
        <div className='login-form-container'>
            <Form
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
            <Form.Item
                name="username"
                rules={[
                {
                    required: true,
                    message: 'Please input your Username!',
                },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your Password!',
                },
                ]}
            >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                />
            </Form.Item>
            
            <div className='flex w-full justify-between mt-8 mb-5'>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                Forgot password
                </a>
            </div>

            <Form.Item>
             
                    <Button type="primary" htmlType="submit" className="w-full">
                    Log in
                </Button>
           
                Or <a href="">register now!</a>
            </Form.Item>
        </Form>
        </ div>
    </ div>
        </div>

    
  );
};
export default Login;