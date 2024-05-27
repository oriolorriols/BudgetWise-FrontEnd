import { useState } from 'react';
import { useAuth } from "../../contexts/authContext"


import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import './login.scss'
import { login } from '../../apiService/userApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setLogIn } = useAuth()

    const clickLogin = async () => { //creamos funcion que guarda el token al dar login
        const token = await login(email, password)
        setLogIn(token)
        navigate('/')
    }

return (
    <div className='flex justify-center items-center h-screen wrapper'>
        <div className='max-w-md card'>
            <div className='mb-5'>
                <img src="/BudgetWiseGB.png" width="250px" alt="" draggable="false"/>
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
                        <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Username" 
                        value={email} 
                        onChange={e => setEmail(e.currentTarget.value)}/>
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
                        value={password}
                        onChange={e => setPassword(e.currentTarget.value)}
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
                        <Button type="primary" htmlType="submit" className="w-full"
                        onClick={clickLogin}>
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