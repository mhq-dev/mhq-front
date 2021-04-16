import React from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import axios from 'axios';
import {Row, Form, Input, Button,message, Col,Modal } from 'antd';
import {InfoCircleOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import EditProfile from "./EditProfile.js";
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
class Profile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282c34'
        this.EditProfileClicked=this.EditProfileClicked.bind(this);
        this.ChangePasswordClicked=this.ChangePasswordClicked.bind(this);
        this.DeleteAccountClicked=this.DeleteAccountClicked.bind(this);
        this.CancelModal=this.CancelModal.bind(this);
        this.state={
            EditProfileVisibility:false,
            ChangePasswordVisibility:false,
            DeleteAccountVisibility:false,
        };
    }

    sumbitButton(){
        message.success("Clicked update profile");
    }
    EditProfileClicked(){
        this.setState(()=>{return {EditProfileVisibility: true};});          
        this.setState(()=>{return {ChangePasswordVisibility: false};});          
        this.setState(()=>{return {DeleteAccountVisibility: false};});          
    }
    ChangePasswordClicked(){
        this.setState(()=>{return {EditProfileVisibility: false};});          
        this.setState(()=>{return {ChangePasswordVisibility: true};});          
        this.setState(()=>{return {DeleteAccountVisibility: false};});  
    }
    DeleteAccountClicked(){
        this.setState(()=>{return {EditProfileVisibility: false};});          
        this.setState(()=>{return {ChangePasswordVisibility: false};});          
        this.setState(()=>{return {DeleteAccountVisibility: true};}); 
    }
    CancelModal(){
        this.setState(()=>{return {DeleteAccountVisibility: false};}); 
    }
    render(){
        return (
            <div>
                <Row>
                    <Col flex="300px">
                                <div className="LeftDivOptions">
                                <button className="LeftOption" onClick={this.EditProfileClicked}>Edit Profile</button>
                                <button className="LeftOption" onClick={this.ChangePasswordClicked}>Change Password</button>
                                <button className="LeftOption" onClick={this.DeleteAccountClicked}>Delete Account</button>
                                </div>
                    </Col>
                    <Col flex="auto" id="profile-text">
                    {(this.state.EditProfileVisibility) ? 
                    <EditProfile></EditProfile>
                        : <div>{(this.state.ChangePasswordVisibility) ? 
                            <ChangePassword></ChangePassword>
                            :  <DeleteAccount cancel={this.CancelModal} vis={this.state.DeleteAccountVisibility}></DeleteAccount>}
                            </div>
                            }
                </Col>
                </Row>

            </div>
        );
    }
}
export default Profile;
