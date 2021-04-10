import React from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import axios from 'axios';
import { Form, Input, Button,message } from 'antd';
import {InfoCircleOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

class Profile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282c34'
    }

    sumbitButton(){
        message.success("Clicked update profile");
    }
    render(){
        return (
            <div>
                <div id="profile-text" className="profile-text">

                    <img
                        id="image-tag-profile" className="image-tag-profile" 
                        src="https://uupload.ir/files/xbdu_mhq.jpg" >
                    </img>
                    <Form
                    name="profile-form"
                    className="profile-form">
                        <p className="name-profile">Name</p>
                        <Form.Item
                        name="Name"
                        className="name-profile"
                        >
                            <Input
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                            className="input-profile" prefix={<UserOutlined className="site-form-item-icon" />} 
                            ></Input>
                        </Form.Item>

                        <p className="name-profile">Bio</p>
                        <Form.Item
                        name="Bio"
                        className="name-profile">
                            <Input 
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                            className="input-profile"
                            prefix={<InfoCircleOutlined className="site-form-item-icon" />}/>
                        </Form.Item>

                        <p className="name-profile">Email</p>
                        <Form.Item
                        name="email"
                        className="name-profile">
                            <Input
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" size="10"
                            className="input-profile"
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        
                        <Form.Item
                        className="button-profile">
                            <Button onClick={this.sumbitButton} className="profile-update-button">
                                Update Profile</Button>
                        </Form.Item>
                    </Form>
                </div>
                
                

            </div>
        );
    }
}
export default Profile;
