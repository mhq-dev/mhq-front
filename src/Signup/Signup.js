import React from 'react';
import 'antd/dist/antd.css';
import './Signup.css';
import { Form, Input, Button, Typography, Card,message } from 'antd';
import {RedoOutlined, MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.CheckSubmission=this.CheckSubmission.bind(this);
        this.sumbitButton=this.sumbitButton.bind(this);
        document.body.style.backgroundColor = '#282c34'
    }
    sumbitButton(){
        const username=document.getElementById('username-signup').value
        const email=document.getElementById('email-signup').value
        const password=document.getElementById('password-signup').value
        const repeatPass=document.getElementById('repeat-password-signup').value
        
        this.CheckSubmission(password,repeatPass);
    }
    CheckSubmission(password,repeatPass){
        if(password!=repeatPass){
            message.error("Please check the password");
            return "Wrong";
        }
        else{
            message.success("That's ok");
            return "Correct";
        }
    }
    render(){
        return (
            <Card className='signup-card'>
            <Form
                name="normal_singup"
                className="singup-form"
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" id="username-signup"/>
                </Form.Item>
                <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email address!',
                    },
                ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" id="email-signup"/>
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
                        id="password-signup"
                    />
                    
                </Form.Item>
                <Form.Item
                    name="repeat-password"
                    rules={[
                        {
                            required: true,
                            message: 'Please repeat your password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<RedoOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Repeat the password"
                        id="repeat-password-signup"
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={this.sumbitButton} type="primary" htmlType="submit" className="singup-form-button">
                        Sign up
                    </Button>
                    <Typography style={{ margin: '8px' }}>
                        Or <a href="/login">login into your existing account!</a>
                    </Typography>
                </Form.Item>
            </Form>
        </Card>
        );
    }
}
export default Signup;
