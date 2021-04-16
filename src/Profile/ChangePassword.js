import React from 'react';
import 'antd/dist/antd.css';
import './ChangePassword.css';
import './Profile.css';

import axios from 'axios';
import {Row, Form, Input, Button,message, Col,Card,Typography,Checkbox } from 'antd';
import {InfoCircleOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';

class ChangePassword extends React.Component {
    sumbitButton(){
        const config = {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          };
          axios.post('http://37.152.188.83/api/auth/users/set_password/', 
          {
            "new_password": document.getElementById("new-pass-change").value,
            "re_new_password": document.getElementById("re-new-pass-change").value,
            "current_password": document.getElementById("old-pass-change").value
          }
          , config)
          .then(res => {
            message.success("PassWord succesfully change!");
          })
          .catch(err =>
          {
            message.error(localStorage.getItem('token'));
          });
    }
    render(){
        return (
            <div className="profile-text">
            <img
                id="image-tag-profile" className="lock-icon" 
                src="https://uupload.ir/files/6aa7_image-removebg-preview(1).png" >
            </img>
            <Form
            name="profile-form"
            className="profile-form">
                <p className="name-profile">Old Password</p>
                <Form.Item
                name="Old Password"
                className="name-profile"
                >
                    <Input
                    id="old-pass-change"
                    STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                    className="input-profile" prefix={<LockOutlined className="site-form-item-icon" />} 
                    ></Input>
                </Form.Item>
                
                <p className="name-profile">New Password</p>
                <Form.Item
                name="Bio"
                className="name-profile">
                    <Input 
                    id="new-pass-change"
                    STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                    className="input-profile"
                    prefix={<UnlockOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <p className="name-profile">Repeat New Password</p>
                <Form.Item
                name="email"
                className="name-profile">
                    <Input
                    id="re-new-pass-change"
                    STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                    className="input-profile"
                    prefix={<UnlockOutlined className="site-form-item-icon" />}
                    />
                </Form.Item>
                
                <Form.Item
                className="button-profile">
                    <Button onClick={this.sumbitButton} className="change-password-button">
                        Change Password</Button>
                </Form.Item>
            </Form>
        </div>
            
        );
    }
}

export default ChangePassword;