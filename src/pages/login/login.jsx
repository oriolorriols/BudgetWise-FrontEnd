import { useState } from 'react';
import { useAuth } from "../../contexts/authContext"
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import './login.scss'
import { login } from '../../apiService/userApi';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { setLogIn } = useAuth()

    const onFinish = async (values) => {
        if(values.username === "" || values.password === "") {}
        setLoading(true)
        const response = await login(email, password)
        setLoading(false)
        if (!response.msg) {
            setLogIn(response);
            navigate('/');
        } else {
            if (response.msg === "No estas registrado con este correo") {
                form.setFields([
                    {
                        name: 'username',
                        errors: [response.msg],
                    },
                ]);
            } else if (response.msg === "Tu correo ya no esta activo.") {
                form.setFields([
                    {
                        name: 'username',
                        errors: [response.msg],
                    },
                ]);
            } else if (response.msg === "Tu cuenta aún no está activada.") {
                form.setFields([
                    {
                        name: 'username',
                        errors: [response.msg],
                    },
                ]);
            }
            
            else if (response.msg === "Contraseña incorrecta") {
                form.setFields([
                    {
                        name: 'password',
                        errors: [response.msg],
                    },
                ]);
            } else {
                form.setFields([
                    {
                        name: 'username',
                        errors: [],
                    },
                    {
                        name: 'password',
                        errors: [],
                    },
                ]);
            }
        }
    };

    return (
        <div className='flex justify-center items-center h-screen wrapper'>
            <div className='max-w-md card'>
                <div className='mb-5'>
                    <img className="m-auto" src="/BudgetWiseGB.png" width="250px" alt="" draggable="false" />
                </div>
                <div className='login-form-container'>
                    <Form
                        form={form}
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
                                    type: "email",
                                    required: true,
                                    message: '¡Escribe tu email!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Email" 
                                value={email} 
                                onChange={e => setEmail(e.currentTarget.value)} 
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '¡Introduce tu contraseña!',
                                },
                            ]}
                            
                        >
                            <Input.Password 
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={e => setPassword(e.currentTarget.value)}
                            />
                            
                        </Form.Item>
                        <div className='flex w-full justify-between mt-8 mb-5'>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Recuérdame</Checkbox>
                            </Form.Item>
                            <a className="login-form-forgot" href="">
                                ¿Olvidaste la contraseña?
                            </a>
                        </div>
                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full mb-3" disabled={loading}>
                                {loading ? <Spin /> : 'Iniciar'}
                            </Button>
                            ¡O <Link to="/registro"><span className='link'>registrate</span></Link>!
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default Login;
