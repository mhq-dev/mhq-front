import React from 'react';
import 'antd/dist/antd.css';
import './OtherProfile.css';
import axios from 'axios';
import {Row, Col, Image, Menu , Dropdown,Layout, Button,message, List, Typography } from 'antd';
import {InfoCircleOutlined, MailOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import APIBox from './API';
import {  Link, NavLink } from 'react-router-dom';
import SearchUser from '../Search/SearchUser';
import Modal from 'antd/lib/modal/Modal';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
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
class OtherProfile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#212121'
        this.sumbitButton=this.sumbitButton.bind(this);

        this.ToggleFollow=this.ToggleFollow.bind(this);

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
            collectionDetails:{},
            followers:0,
            following:0,
            list_follow:[],
            list_following:[],
            isModalVisibleFollow:false,
            isModalVisibleFollowing:false,
        };
    }
    componentDidMount() {
        const addressArray = window.location.href.split("/").reverse();

        axios.get('http://37.152.180.213/api/collection/user/'+addressArray[0],
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            var i;
            var colNameArray=this.state.collectionsName;
            for (i = 0; i < resDimo.data.length; i++) {
                colNameArray.push(resDimo.data[i]);
                axios.get("http://37.152.180.213/api/request/collection/"+resDimo.data[i].id,
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

        axios.get('http://37.152.180.213/api/user/profile/user/'+addressArray[0],
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
            axios.get(`http://37.152.180.213/api/user/followers/${this.state.name}`,
            {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((res)=>{
                const user_local = localStorage.getItem('username')
                this.setState({followers:res.data.length, list_follow:res.data})
                let flag = false;
                res.data.map((user)=>{
                    if (user.username === user_local) {
                        flag = true
                    }
                })
                if (flag) {
                    this.setState({follow_unfollow_button_value:"Unfollow"})
                }
                else{
                    this.setState({follow_unfollow_button_value:"Follow"})
                }
            })
            axios.get(`http://37.152.180.213/api/user/followings/${this.state.name}`,
            {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((res)=>{
                this.setState({following:res.data.length, list_following:res.data})
            })
        })
        .catch((err)=>{
            message.error(err);
        })
      }
    showModalFollow = () => {
        this.setState({isModalVisibleFollow:true})
        console.log(this.state.list_follow)
    };

    handleCancelFollow = () => {
        this.setState({isModalVisibleFollow:false})
    };

    showModalFollowing = () => {
        this.setState({isModalVisibleFollowing:true})
    };

    handleCancelFollowing = () => {
        this.setState({isModalVisibleFollowing:false})
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
      };

    sumbitButton(){
        const followStatus=this.ToggleFollow()
        this.setState(()=>{
            return {
                follow_unfollow_button_value: followStatus
            };
          });
        return followStatus;
    }
    ToggleFollow(){
        const config = {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        };
        if(this.state.follow_unfollow_button_value=="Follow"){
            axios.post(`http://37.152.180.213/api/user/follow/${this.state.name}`,{},config
            ).then((res)=>{
                this.setState({followers:this.state.followers+1})
            })
            return "Unfollow";
        }
        else{
            axios.delete(`http://37.152.180.213/api/user/unfollow/${this.state.name}`,config
            ).then((res)=>{
                this.setState({followers:this.state.followers-1})
            })
            return "Follow";
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
            <Header  style={{ height: '8vh',backgroundColor: 'transparent',padding: '0px',borderBottom: '1px solid rgb(204 204 204)',lineHeight: '3.75'}}>
                <Row justify="start" style={{width: '100%',marginLeft: '-1%'}}>
                <Col span={2}>
                <Link to="/dashboard"><h4 >Home</h4></Link>
                </Col>
                <Col span={3} >
                <Link to="/profile"><h4 >Profile</h4></Link>
                </Col>
                <Col span={3}>
                <Link onClick={this.addScen}><h4 >Scenario</h4></Link>
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
            <Modal 
            title="Followers"
            visible={this.state.isModalVisibleFollow}
            onCancel={this.handleCancelFollow}
            footer={[]}>
            <List
                dataSource={this.state.list_follow}
                bordered
                renderItem={item => (
                <List.Item
                key={item.id}
                actions={[
                <a key={`a-${item.id}`} onClick={()=>{window.location = `/Profile/${item.username}`}}>
                View Profile
                </a>,
                ]}
                >
                <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} size="large" src={"http://37.152.180.213"+item.avatar} />
                }
                title={<Typography>{item.username}</Typography>}
                description={item.bio === null ? `${item.username}'s bio` : item.bio}
              />
            </List.Item>
            )}
            />
            </Modal>
            <Modal
            title="Followings" 
            visible={this.state.isModalVisibleFollowing}
            onCancel={this.handleCancelFollowing}
            footer={[]}>
            <List
                dataSource={this.state.list_following}
                bordered
                renderItem={item => (
                <List.Item
                key={item.id}
                actions={[
                <a key={`a-${item.id}`} onClick={()=>{window.location = `/Profile/${item.username}`}}>
                View Profile
                </a>,
                ]}
                >
                <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} src={"http://37.152.180.213"+item.avatar} />
                }
                title={<Typography>{item.username}</Typography>}
                description={item.bio === null ? `${item.username}'s bio` : item.bio}
              />
            </List.Item>
            )}
            />
            </Modal>
            <Row STYLE="background-color: #212121;">
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
                            <Col style={{marginBottom:'1em'}} flex={1}>
                                <a onClick={this.showModalFollow} STYLE="color: #dfdfdf;">{this.state.followers} followers</a>
                            </Col>
                            
                            <Col style={{marginBottom:'1em'}} flex={1}>
                                <a onClick={this.showModalFollowing} STYLE="color: #dfdfdf;">{this.state.following} followings</a>
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
                    
                    {(this.state.current=="APIs") ? 
                    <div>

                    {this.state.apis.map(d=><p>
                        <APIBox api_method={d.http_method} api_address={d.url} api_id={d.id}></APIBox>    
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
// <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" STYLE="background-color: #212121; color:#ffffff;">
//                         <Menu.Item key="APIs" icon={<MailOutlined />}>
//                             APIs
//                         </Menu.Item>
                        
//                     </Menu>