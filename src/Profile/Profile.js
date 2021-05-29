import React from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import axios from 'axios';
import { Layout,Avatar, Menu, Dropdown , Form, Input, Button ,List,Tabs,Select,Row,Col,Switch,Radio ,message} from "antd";
import { DeleteOutlined,DownOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,CrownOutlined ,EditOutlined ,EyeOutlined,FundProjectionScreenOutlined,LockOutlined} from '@ant-design/icons';
import EditProfile from "./EditProfile.js";
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import {  FaMoon,FaSun } from "react-icons/fa";
import {  Link, NavLink } from 'react-router-dom';
import SearchUser from '../Search/SearchUser'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
let a="";
const menu = (
    <Menu>
      <Menu.Item >
        <h5>New</h5>
      </Menu.Item>
      <Menu.Item >
        <h5 target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        Edit 
        </h5>
      </Menu.Item>
      <Menu.Item >
        <h5 target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        Delete
        </h5>
      </Menu.Item >
      <Menu.Item >Search</Menu.Item>
    </Menu>
  
  );
class Profile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282828';
        this.EditProfileClicked=this.EditProfileClicked.bind(this);
        this.ChangePasswordClicked=this.ChangePasswordClicked.bind(this);
        this.DeleteAccountClicked=this.DeleteAccountClicked.bind(this);
        this.CancelModal=this.CancelModal.bind(this);
        this.state={
            EditProfileVisibility:true,
            ChangePasswordVisibility:false,
            DeleteAccountVisibility:false,
            theme:"dark",
            collections:"",
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
            <Header  style={{ height: '8vh',backgroundColor: 'transparent',padding: '0px',borderBottom: '1px solid rgb(204 204 204)',lineHeight: '3.75'}}>
                <Row justify="start" style={{width: '100%',marginLeft: '-1%'}}>
                <Col span={2}>
                <Link to="/dashboard"><h4 >Home</h4></Link>
                </Col>
                <Col span={3} >
                <Link to="/profile"><h4 >Profile</h4></Link>
                </Col>
                <Col span={3}>
                <Link to="/scenario"><h4 >Scenario</h4></Link>
                </Col>
                <Col span={2} >
                <Dropdown overlay={menu}>
            <h4 className="ant-dropdown-link" onClick={e => e.preventDefault()}style={{color: 'black'}} >
            Workspaces <DownOutlined />
            </h4>
        </Dropdown>
                </Col>
                <Col span={4} style={{float: 'right' , marginLeft: '40%'}}>
          <SearchUser/>
          </Col>
                </Row>
                </Header>
                <Row>
                    <Col flex={2}>
                        <Sider theme={this.state.theme?"dark":"light"}  collapsible style={{width: '20%' ,minHeight: '100vh'}} 
                        STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828;">
                            <Menu
                                mode="inline"
                                theme={this.state.theme?"dark":"light"}
                                style={{ position: "sticky",height: '20vh' }}
                                STYLE="text-align:left; color:#78c622; font-weight: bold; background-color:#282828;">
                            
                            
                                <Menu.Item onClick={this.EditProfileClicked} icon={<EditOutlined />} STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828;">
                                    Edit Profile
                                </Menu.Item>
                                <Menu.Item onClick={this.ChangePasswordClicked} icon={<LockOutlined />} STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828;">
                                    Change Password
                                </Menu.Item>
                                <Menu.Item onClick={this.DeleteAccountClicked} icon={<DeleteOutlined />} STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828;">
                                    Delete Account
                                </Menu.Item>
                            </Menu>
                        </Sider>
                    </Col>
                    <Col flex={8}>
                        <Row >
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
                    </Col>
                </Row>
                
                
                </div>
        );
    }
}
export default Profile;
