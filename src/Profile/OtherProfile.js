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
        this.componentDidMount=this.componentDidMount.bind(this);

        this.state={
            follow_unfollow_button_value:"Follow",
            current: 'APIs',
            apis:[],
            name:"",
            imgURL:"",
            email:"",
            bio:"",
            collectionsName:[],
            collectionDetails:{}
        };
    }
    componentDidMount() {
        const addressArray = window.location.href.split("/").reverse();

        axios.get('http://37.152.188.83/api/collection/user/'+addressArray[0],
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            var i;
            var colNameArray=this.state.collectionsName;
            for (i = 0; i < resDimo.data.length; i++) {
                colNameArray.push(resDimo.data[i]);
                axios.get("http://37.152.188.83/api/request/collection/"+resDimo.data[i].id,
                {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
                }}).then((res)=>{  
                    var newArr = this.state.apis;   
                    var j;
                    var thisColApis = []
                    var colID;
                    for (j = 0; j < res.data.length; j++) { 
                        newArr.push(res.data[j]);    
                        thisColApis.push(res.data[j]);
                        colID=res.data[j].collection.id;
                    }
                    var dict=this.state.collectionDetails;
                    dict[colID]=thisColApis;
                    this.setState(()=>{
                        return {
                            apis: newArr,
                            collectionDetails:dict
                        };
                      });

                })
                .catch((err)=>{
                    message.error(err);
                })
            }
            this.setState(()=>{
                return {
                    collectionsName: colNameArray,
                };
              });   

            
        })
        .catch((err)=>{
            message.error(err);
        })

        axios.get('http://37.152.188.83/api/user/profile/user/'+addressArray[0],
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((res)=>{
            this.setState(()=>{
                return {
                    name: res.data.username,
                    email:res.data.email,
                    bio: res.data.bio||(res.data.username+"'s bio"),
                    imgURL: res.data.avatar
                };
              });

        })
        .catch((err)=>{
            message.error(err);
        })
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
    renderCol(colID){
        console.log(this.state.collectionDetails[colID]);
        console.log("Omid");
        <p>Hi</p>
        var j;
        for (j = 0; j < this.state.collectionDetails[colID]; j++) { 
            
        }
    }
    
    render(){
        return (
            <div>
            <Row>
                <Col span={6}> 
                    <div className="LeftPage">
                        {(this.state.imgURL==null) ? 
                        <Image
                        id="image-tag-profile" className="OtherProfile-image"
                        src="https://uupload.ir/files/b9f3_default_user.png"
                        preview={false} >
                        </Image> 
                         : 
                         <Image
                         id="image-tag-profile" className="OtherProfile-image"
                         src={this.state.imgURL} 
                         preview={true}>
                         </Image>
                        }

                        
                        
                        <h1 className="other-profile-name" STYLE="color: #dfdfdf; font-size:2vw;">{this.state.name}</h1>
                        
                        <Button value={this.state.follow_unfollow_button_value} id="follow_unfollow_button" ghost={false} STYLE="margin-bottom:20px; width:100%; color: #dfdfdf; background-color: rgb(33, 38, 45);" onClick={this.sumbitButton} shape='round' >
                                    {this.state.follow_unfollow_button_value}</Button>
                        
                        <Row>
                            <Col flex={1}>
                                <p STYLE="color: #dfdfdf;">0 followers</p>
                            </Col>
                            
                            <Col flex={1}>
                                <p STYLE="color: #dfdfdf;">0 followings</p>
                            </Col>
                        </Row>

                        <Row STYLE="margin-bottom:-5px; color: #dfdfdf;">
                            <Col>
                                <InfoCircleOutlined STYLE="color: #dfdfdf;"/>
                            </Col>
                            <Col flex="auto">
                                <p STYLE=" text-align: left; margin-left:5px; color: #dfdfdf;">{this.state.bio}</p>
                            </Col>
                        </Row>

                        <Row >
                            <Col>
                                <MailOutlined STYLE="color: #dfdfdf;"/>
                            </Col>
                            <Col flex="auto">
                                <p STYLE=" text-align: left; margin-left:5px; color: #dfdfdf;">{this.state.email}</p>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={18}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" STYLE="background-color: #282c34; color:#ffffff;">
                        <Menu.Item key="APIs" icon={<MailOutlined />}>
                            APIs
                        </Menu.Item>
                        
                    </Menu>
                    {(this.state.current=="APIs") ? 
                    <div>
                    {this.state.apis.map(d=><p>
                        <APIBox api_method={d.http_method} api_address={d.url}></APIBox>    
                        </p>)}
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
// <SubMenu key="SubMenu" icon={<AppstoreOutlined />} title="Collections">
//                         {this.state.collectionsName.map(d=>
//                             <Menu.ItemGroup title={d.name}>
//                                 <Menu.Item key="col:1:1">{this.renderCol(d.id)}</Menu.Item>
//                                 <Menu.Item key="col:1:2">Coll 2</Menu.Item>
//                             </Menu.ItemGroup>
//                         )}
                        
//                         </SubMenu>