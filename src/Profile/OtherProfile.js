import React from 'react';
import 'antd/dist/antd.css';
import './OtherProfile.css';
import axios from 'axios';
import {Row, Col, Image, Menu , Input, Button,message } from 'antd';
import {InfoCircleOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import APIBox from './API';

const { SubMenu } = Menu;

class OtherProfile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282c34'
        this.sumbitButton=this.sumbitButton.bind(this);


        this.state={
            follow_unfollow_button_value:"Follow",
            current: 'APIs',
        };
    }

    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
      };

    sumbitButton(){
        if(this.state.follow_unfollow_button_value=="Follow"){
            this.setState(()=>{
                return {
                    follow_unfollow_button_value: "Unfollow"
                };
              });
        }
        else{
            this.setState(()=>{
                return {
                    follow_unfollow_button_value: "Follow"
                };
              });
        }
    }
    render(){
        return (
            <div>
            <Row>
                <Col span={6}> 
                    <div className="LeftPage">
                        <Image
                        className="OtherProfile-image"
                        src="https://uupload.ir/files/xbdu_mhq.jpg"
                        preview={true}/>
                        
                        <h1 className="other-profile-name" STYLE="color: #dfdfdf; font-size:2vw;">Name</h1>
                        
                        <Button value={this.state.follow_unfollow_button_value} id="follow_unfollow_button" ghost={false} STYLE="margin-bottom:20px; width:100%; color: #dfdfdf; background-color: rgb(33, 38, 45);" onClick={this.sumbitButton} shape='round' >
                                    {this.state.follow_unfollow_button_value}</Button>
                        
                        <Row>
                            <Col flex={1}>
                                <p STYLE="color: #dfdfdf;">1 followers</p>
                            </Col>
                            
                            <Col flex={1}>
                                <p STYLE="color: #dfdfdf;">2 followings</p>
                            </Col>
                        </Row>

                        <Row STYLE="margin-bottom:-5px; color: #dfdfdf;">
                            <Col>
                                <InfoCircleOutlined STYLE="color: #dfdfdf;"/>
                            </Col>
                            <Col flex="auto">
                                <p STYLE=" text-align: left; margin-left:5px; color: #dfdfdf;">Bio</p>
                            </Col>
                        </Row>

                        <Row >
                            <Col>
                                <MailOutlined STYLE="color: #dfdfdf;"/>
                            </Col>
                            <Col flex="auto">
                                <p STYLE=" text-align: left; margin-left:5px; color: #dfdfdf;">Email</p>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={18}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" STYLE="background-color: #282c34; color:#ffffff;">
                        <Menu.Item key="APIs" icon={<MailOutlined />}>
                            APIs
                        </Menu.Item>
                        <SubMenu key="SubMenu" icon={<AppstoreOutlined />} title="Collections">
                        <Menu.ItemGroup title="Item 1">
                            <Menu.Item key="col:1:1">Coll 1</Menu.Item>
                            <Menu.Item key="col:1:2">Coll 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Item 2">
                            <Menu.Item key="col:2:1">Coll 3</Menu.Item>
                            <Menu.Item key="col:2:2">Coll 4</Menu.Item>
                        </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                    {(this.state.current=="APIs") ? 
                    <div>
                    <APIBox api_method="GET" api_address="http://kapi.medlegten.com/getCategory"></APIBox>
                    <APIBox api_method="POST" api_address="http://kapi.medlegten.com/getCategory"></APIBox>
                    </div>
                    :
                    <div></div>
                    }
                </Col>
            </Row>
            </div>
        );
    }
}
export default OtherProfile;
