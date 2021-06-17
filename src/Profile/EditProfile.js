import React from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import axios from 'axios';
import {Row, Form, Input, Button,message, Col,Card, Image } from 'antd';
import {InfoCircleOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

class EditProfile extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#212121'
        this.componentDidMount=this.componentDidMount.bind(this);
        this.onFileChange=this.onFileChange.bind(this);
        // https://uupload.ir/files/xbdu_mhq.jpg
        this.state={
            ImageURL:"",
            selectedFile:""
        };
    }

    componentDidMount(){
        axios.get('http://37.152.180.213/api/user/profile/user/'+localStorage.getItem('username'),
        {headers:{
            'Content-Type' : 'application/json',
            'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((res)=>{
            this.setState(()=>{return {ImageURL: res.data.avatar};}); 
            document.getElementById("input-profile").value = res.data.username;
            document.getElementById("bio-profile").value = res.data.bio;
            document.getElementById("email-profile").value = res.data.email;        
      })
      .catch((err)=>{
        message.error("Network Error");
      })
    }

    sumbitButton(bioValue,token){

        const config = {
            headers: { 'Authorization': `Token ${token}` }
          };
          axios.put('http://37.152.180.213/api/user/profile/update/', 
          {
            "bio": bioValue
          }
          , config)
          .then(res => {
            message.success("Bio Updated");
            return "Updated";
          })
          .catch(err =>
          {
            message.error("Network Error");
            return "Error";
          });
    }

    onFileChange = e => {
        // this.setState({ selectedFile: event.target.files[0] });
        // console.log(this.state.selectedFile);

        // var fil = document.getElementById("myFile");
        // alert(fil.value);
            
            const formData = new FormData(); 
     
            formData.append( 
                "avatar", 
                e.target.files[0]
            ); 

            axios.put('http://37.152.180.213/api/user/profile/update/'
            
            ,formData,
            {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
              }})
            .then((res)=>{
                console.log("Yeah");
                console.log("Omid");
                message.success("Image uploaded");
                window.location.reload();
            })
            .catch((err)=>{
                console.log(err);
                console.log("Omid");
                message.success("Bad network connection!");
            });

            
      };

    render(){
        return (
            <div className="profile-text">
                    {(this.state.ImageURL==null) ? 
                    <Image
                    style={{objectFit:"cover"}}
                    width={250}
                    height={220}
                    id="image-tag-profile" className="image-tag-profile" 
                    src="https://uupload.ir/files/b9f3_default_user.png" >
                    </Image> 
                     : 
                    <Image
                    style={{objectFit:"cover", padding:8}}
                    width={250}
                    height={220}
                    id="image-tag-profile" className="image-tag-profile" 
                    src={this.state.ImageURL} >
                    </Image>
                    }
                    
                    
                    <Form
                    name="profile-form"
                    className="profile-form">
                        <Input className="profile-photo-button" type="file" id="myFile" name="myFile" onChange={this.onFileChange}/>
                        <p className="name-profile">Name</p>
                        <Form.Item
                        name="Name"
                        className="name-profile"
                        >
                            <Input
                            disabled={true}
                            id="input-profile"
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" 
                            className="input-profile" prefix={<UserOutlined className="site-form-item-icon" />} 
                            ></Input>
                        </Form.Item>

                        <p className="name-profile">Bio</p>
                        <Form.Item
                        name="Bio"
                        className="name-profile">
                            <Input 
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" 
                            className="input-profile"
                            id="bio-profile"
                            prefix={<InfoCircleOutlined className="site-form-item-icon" />}/>
                        </Form.Item>

                        <p className="name-profile">Email</p>
                        <Form.Item
                        name="email"
                        className="name-profile">
                            <Input
                            disabled={true}
                            STYLE="color: #FFFFFF; font-family: Verdana; font-weight: bold; font-size: 12px; background-color: #282c34;" 
                            className="input-profile"
                            id="email-profile"
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        
                        <Form.Item
                        className="button-profile">
                            <Button 
                            onClick={d=>this.sumbitButton(document.getElementById("bio-profile").value,
                                                          localStorage.getItem('token'))} 
                            className="profile-update-button">
                                Update Profile</Button>
                        </Form.Item>
                    </Form>
                </div>
        );
    }
}

export default EditProfile;