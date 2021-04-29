import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss'
import Axios from 'axios';
import Pro from './ava.png';
import ApiContent from './ApiPage/ApiContent.js';
import CreateCollection from '../CreateCollection/CreateCollection'
import { Layout,Avatar, Menu, Dropdown , Form, Input, Button ,List,Tabs,Select,Row,Col,Switch,Radio ,message} from "antd";
import { DownOutlined,ClockCircleOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,CrownOutlined ,EditOutlined ,EyeOutlined,
    FundProjectionScreenOutlined,LogoutOutlined} from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import {  Link, NavLink } from 'react-router-dom';
const { TabPane } = Tabs;
    let isPublic= false;
    let isEditor= false;
class Collection extends React.Component {
    newTabIndex = 1;
    state = {
        title: "",
        type: true,
        users: [],
        requests: "",
        currentCollectionname: '', thisCollection: [],
        newUser: '',
        newreq: '',
        method_tpye: '',
        url: '',
        type: '',
        requests: [],
        power: 'visitor',
        id : localStorage.getItem("collection_id")

    };
    secondChange=e=>{
        this.setState({newUser :e.target.value});
      }
    deleCollection(item){
        Axios.delete('http://37.152.188.83/api/collection/'+item.id+"/",{headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }})
        .then((response)=>{
            if (response.status === 204){
                message.success("You deleted this collection successfully")
                this.getthis()
            }
            else{
                message.error("Please try again")
            }
        })
        .catch((error)=>{
            message.error("Something went wrong")
        })
      }
      leaveCollection(item){
        Axios.delete('http://37.152.188.83/api/collection/'+localStorage.getItem("collection_id")+"/left/",{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
      }})
      .then((response)=>{
          if (response.status === 200){
              message.success("You left this collection successfully")
              this.getthis()
          }
          else{
              message.error("Please try again")
          }
      })
      .catch((error)=>{
          message.error("Something went wrong")
      })
      }
    Addreq(item){

        Axios.post('http://37.152.188.83/api/request/',{
        name: this.state.newreq ,http_method: this.state.method_tpye ,url: this.state.url ,body: [{headers:{"Authorization":""}}],collection: item.id
      },{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
      }})
      .then((response)=>{
          if (response.status === 201){
              message.success("Request created successfully")
              this.getthis()
          }
          else{
              message.error("Please try again")
          }
      })
      .catch((error)=>{
          message.error("Network error")
      })
      }
    onChangeInputUrl = (input)=>{
        this.setState({url:input.target.value})
      }
    changeType=(e)=>{
        this.setState({method_tpye :e.target.value});
    
    }
    thirdChange=e=>{
        this.setState({newreq :e.target.value});
      }
    addClick(req) {
      };
    Adduser(item){
        let r=""
        if(isEditor){
          r="editor"
        }
        else
        {
          r="visitor"
        }
        Axios.post('http://37.152.188.83/api/collection/'+item.id+"/add_user/"+this.state.newUser,{
          user: this.state.newUser, role: r
      },{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
      }})
      .then((response)=>{
          if (response.status === 200){
              message.success("Added successfully")
              this.getthis()
          }
          else{
              message.error("Please try again")
          }
      })
      .catch((error)=>{
          message.error("There is no user outside of this collection with this username")
      })
      }
    Removeuser(user,item){
        Axios.delete('http://37.152.188.83/api/collection/'+item.id+"/remove_user/"+user.user,{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
      }})
      .then((response)=>{
          if (response.status === 200){
              message.success("removed successfully")
              this.getthis()
          }
          else{
              message.error("Please try again")
          }
      })
      .catch((error)=>{
          message.error("Something went wrong.")
      })
      }
    Promote(user,item){
        let st=""
        if(user.role==="visitor")
        {
          st="editor"
        }
        else if(user.role==="editor"){
          st="owner"
        }
        Axios.put('http://37.152.188.83/api/collection/'+item.id+"/promote_user/"+user.user,{
          user: user.user,role: st
      },{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
      }})
      .then((response)=>{
          if (response.status === 200){
              message.success("promotted successfully")
              this.getthis()
          }
          else{
              message.error("Please try again")
          }
      })
      .catch((error)=>{
          message.error("Something went wrong.")
      })
      }
    onFinish(v,name,status) {
        let r="public"
              if(this.state.type===false)
              {
                  r="private"
              }
        Axios.put('http://37.152.188.83/api/collection/'+v.id+"/",{
            name, type: r
        },{headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }})
        .then((response)=>{
            if (response.status === 200){
                message.success("changed successfully")
                this.getthis()
            }
            else{
                message.error("Please try again")
            }
        })
        .catch((error)=>{
            message.error("please try again")
        })
      } 
    onChange4=(e)=>{
        this.setState({type :e.target.value});
    
      };
    firstChange=e=>{
        this.setState({currentCollectionname :e.target.value});
    
      }
    getthis=()=> {
        Axios.get('http://37.152.188.83/api/collection/'+localStorage.getItem("collection_id"),{headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((res)=>{
          this.setState({thisCollection : res.data})
          this.setState({users : res.data.users})
          this.setState({requests : res.data.requests})
          if(res.data.type==="public")
          {
            this.setState({type : true})
          }
          else
          {
            this.setState({type : false})
          }
          this.setState({currentCollectionname :res.data.name});
        res.data.users.forEach(user => {
            if(user.user===localStorage.getItem('username'))
            {
                this.setState({power : user.role})
            }
        });
          if(res.data.type==="public")
          {
            this.setState({type : "public"});
          }
          else if(res.data.type==="private"){
            this.setState({type : "private"});
          }
        })
        .catch((err)=>{
          //alert(localStorage.getItem('token'));
    
        })
      }
    componentDidMount(){
        this.getthis();

      }
       
    render() {
        const item=this.state.thisCollection;
            return(
                <div style={{marginTop: '6%'}}>
        <Row >

          <Col span={8} style={{marginLeft: '5%',alignContent: 'center',alignItems: 'center'}}>
            <div className="collectinbox" style={{textAlign: 'left',marginLeft: '10%'}}>
            <h5 style={{fontSize: '23px' ,marginLeft: '5%'}}>Name: {item.name}</h5>
            <h5 style={{fontSize: '22px',marginLeft: '5%'}}>Status: {item.type}</h5>
            <h5 style={{fontSize: '22px',paddingRight: '5%',marginLeft: '5%'}}>Users :</h5>
            <h5 style={{fontSize: '18px',marginLeft: '5%'}}>{this.state.users.map(user=>(user.user+" "))} </h5>
            </div>
            
          </Col>
          <Col span={12}>
            <Row style={{float: 'right',marginTop: '1%'}}>
              <div style={{alignContent: 'center',alignItems: 'center'}}>
            <h5 style={{fontSize: '22px'}}>Edit name and status:</h5>
            <br/>
            <div>
            <Form
                name="changecol"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
            >
              <Row>
              
                <Col span={12} style={{paddingRight: "5%"}}>
                <Form.Item
                    name="Name"
                    
                >
                    <Input onChange={this.firstChange} placeholder="Name" />
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item>
                <Radio.Group buttonStyle="solid" onChange={this.onChange4} defaultValue={this.state.type}>
                        <Radio.Button  value={true}>Public</Radio.Button>
                        <Radio.Button value={false}>private</Radio.Button>

                        </Radio.Group>
                </Form.Item>
                </Col>
               
                
              </Row>
            
                
                
                <Form.Item >
                <Button htmlType="submit" name="submit"  style={{width: "50%",color: 'white',backgroundColor: '#1890ff'}} onClick={()=>this.onFinish(item,this.state.currentCollectionname,this.state.type)}>
           submit
            </Button>
          </Form.Item>
                </Form>
                </div>
                </div>
            </Row>
          </Col>
         
        </Row>
        <div style={{marginTop: '3%',marginLeft: '5%',width: '90%',borderTop: '1px solid gray'}}>
          <Row >
                <Col span={2} style={{marginLeft: '1.8%'}}>
                  <h4 style={{fontSize: '20px'}}>Users</h4>
                </Col>
          </Row>
          <Row>
          {this.state.users.map(user=>(
            
            <Col span={8}>
              <Row>
                <Col span={12} style={{float: 'right'}}>
                <Avatar src={Pro} style={{width: '10vw',height: '10vw'}}></Avatar>
                </Col>
                <Col span={12} style={{alignContent: 'center',alignItems: 'center'}}>
                <div className="collectinbox" style={{textAlign: 'left',marginLeft: '-1%',border: 'none',marginTop: '10%'}}>
                <h5 style={{fontSize: '16px' }}>{user.user}</h5>
               <h5 style={{fontSize: '16px'}}>{user.role==="owner"?<CrownOutlined style={{color: 'yellow',fontSize: '17px',paddingRight: '2px'}}></CrownOutlined>:''}
              {user.role==="editor"?<EditOutlined style={{color: '#f19813',fontSize: '17px',paddingRight: '3px'}}></EditOutlined>:''}
              {user.role==="visitor"?<EyeOutlined style={{color: '#5ef113',fontSize: '15px',paddingRight: '3px'}}></EyeOutlined>:''}             
              {user.user===localStorage.getItem('user')?this.power=user.role:user.role}</h5>
              {localStorage.getItem('user')===user.user?'':<Row>
                <Col span={12}>
                <Button hidden={this.state.power==='visitor'||user.role==='owner'||(user.role==='editor'&&this.state.power==='editor')} style={{backgroundColor: 'green',border: 'none',color: 'white'}} onClick={()=>this.Promote(user,item)}>promote</Button>
                </Col>
                <Col span={12}>
                <Button  hidden={this.state.power==='visitor'||user.role==='owner'||(user.role==='editor'&&this.state.power==='editor')} style={{backgroundColor: 'red',border: 'none',color: 'white'}} onClick={()=>this.Removeuser(user,item)}>remove</Button>

                </Col>
                </Row>}  
            </div>
                </Col>
              </Row>
             
            </Col>))}
         
          </Row>
          {this.state.power==="owner"?
          <Row style={{marginLeft: '5%',marginTop: '5%'}}>
          <Col span={8} style={{textAlign: 'left'}}>
              <h5 style={{fontSize: '20px' }}>Add a new user:</h5>
            </Col>
            <Col span={8}>
            <Input onChange={this.secondChange} placeholder="username" style={{width: '80%'}}/>            
            </Col>
            <Col span={8}>
            <Button style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.Adduser(item)}}>Add User</Button>

            </Col>
          </Row>
          :<h5>{this.state.power}</h5>}
          <div style={{marginTop: '3%',marginLeft: '1%',borderTop: '1px solid gray',paddingBottom: '2%'}}>
            <Row>
              <Col span={24}>
              <h5 style={{fontSize: '20px' ,float: 'left'}}>Requests:</h5>

              </Col>
              </Row>
              {this.state.requests.map(req=>(
                <Row style={{marginTop: '2%'}}>
                <Col span= {4} style={{float: 'left',marginLeft: '1%'}}>
                   <h5 style={{fontSize: '17px' }}>Name : {req.name}</h5>

                </Col>
                <Col span={4}>
                <h5 style={{fontSize: '17px' }}>Method : {req.http_method}</h5>
                </Col>
                <Col span={6}>
                <Button style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.addClick(req)}}>Open Request</Button>


                </Col>
                </Row>
              ))}
            </div>
            <Row style={{marginTop: '3%',marginLeft: '1%',paddingBottom: '5%'}}>
          <Col span={6} style={{marginTop: '3%'}}>
          <h5 style={{fontSize: '20px' }}>Add a new request:</h5>
          </Col>
          <Col span={4} style={{marginTop: '3%'}}>
            <Input onChange={this.thirdChange} placeholder="request Name" style={{width: '80%'}}/>            
          </Col>
          <Col span={4} style={{marginTop: '3%'}}>
            <Input onChange={this.changeType} placeholder="Request type" style={{width: '80%'}}/>            
          </Col>
          <Col span={6} style={{marginTop: '3%'}}>
          <Input  style={{width: '100%'}}  placeholder='Url' onChange={this.onChangeInputUrl} />
                    
          </Col>
          <Col span={4} style={{marginTop: '3%'}}>
            <Button style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.Addreq(item)}}>Add Request</Button>

            </Col>

            </Row>
          <Row style={{marginLeft: '1%',borderTop: '1px solid gray',paddingBottom: '5%'}}>
            <Col span={8}>
            </Col>
            <Col span={8} style={{marginTop: '3%'}}>
            {this.state.power==="owner"?
            <Button style={{backgroundColor: '#cc7d1c',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.deleCollection(item)}}>Delete</Button>
            :
            <Button style={{backgroundColor: '#cc7d1c',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.leaveCollection(item)}}>Leave</Button>
          }
            </Col>
          </Row>
          
        </div>
     
      </div>
        );
    }
}
export default Collection;