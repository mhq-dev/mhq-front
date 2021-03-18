import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import './Login.css';
import { Form, Input, Button, Checkbox, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function Login() {
    const onFinish = values => {
        console.log('Received values of form: ', values);
        axios.post('http://37.152.188.83/api/auth/token/login/',{
            password: values.password,
            username: values.username
        })
        .then((response)=>{
            if (response.status === 200){
                message.success("Logged in!")
                let token = response.data.auth_token;
                localStorage.setItem('username',values.username);
                localStorage.setItem('token', token);
                window.location = '/dashboard'
            }
            else{
                message.error("Wrong Credentials")
            }
        })
        .catch((error)=>{
            message.error("This account is not activated")
            console.log(error)
        })
    };
    useEffect(() => {
        document.body.style.backgroundColor = '#282c34'
    }, [])
    return (
        <Card
            style={{ width: 300, height: 400, alignContent: 'center' }}
            className='login-card'
            bodyStyle={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%)` 
            }}>
            <Form
                name="normal_login"
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
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <Typography style={{ margin: '8px' }}>
                        Or <a href="/signup">register now!</a>
                    </Typography>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Login;