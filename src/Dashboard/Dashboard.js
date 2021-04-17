import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss'
import Axios from 'axios';
import CreateCollection from '../CreateCollection/CreateCollection'
import Pro from './ava.png';
import { Layout,Avatar, Menu, Dropdown , Form, Input, Button ,List,Tabs,Select,Row,Col,Switch,Radio ,message} from "antd";
import {  FaMoon,FaSun } from "react-icons/fa";
import {  Link, NavLink } from 'react-router-dom';
import { DownOutlined,ClockCircleOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,CrownOutlined ,EditOutlined ,EyeOutlined,
  FundProjectionScreenOutlined,LogoutOutlined} from '@ant-design/icons';
import ApiContent from './ApiPage/ApiContent.js';
import Checkbox from 'antd/lib/checkbox/Checkbox';
const { TabPane } = Tabs;
const { SubMenu } = Menu;let a="";
const { Header, Content, Footer, Sider } = Layout;
function onFinish(v,name,status) {
  let ar=""
  if(status)
  {
    ar="public"
  }
  else{
    ar="private"
  }
  Axios.put('http://37.152.188.83/api/collection/'+v.id,{
      name, type: ar
  },{headers:{
    'Content-Type' : 'application/json',
    'Authorization' :`Token ${localStorage.getItem('token')}`
  }})
  .then((response)=>{
      if (response.status === 200){
          message.success("changed successfully")
          this.getCollection()
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("please try again")
  })
} 
const optionsWithDisabled = [
  { label: 'public', value: 'public' },
  { label: 'private', value: 'private' },
];
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
const panes = [
  { title: 'Overview', content: '',closable: false ,key: '1' },
  { title: 'Create a collection', content: <CreateCollection/>, key: '2' ,closable: false },
  { title: 'Create an API', content: '', key: '3',closable: false },
  { title: 'Create an environment', content: '', key: '4',closable: false },
];
class Dashboard extends React.Component {
  newTabIndex = 0;
  state = {
    activeKey: panes[0].key,
    panes,
    collections: [],
    theme: true,
    currentCollectionname: '',
    newUser: ''
    
  };
  isPublic= false;
  isEditor= false;
  onChange4=(e)=>{
    this.isPublic=e.target.value;

  };
  onChange5=(e)=>{
    this.isEditor=e.target.value;

  };
  firstChange=e=>{
    this.setState({currentCollectionname :e.target.value});

  }
  secondChange=e=>{
    this.setState({newUser :e.target.value});

  }
  power=""
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
          this.getCollection()
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("Something went wrong.")
  })
  }
  Adduser(item){
    let r=""
    if(this.isEditor){
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
          this.getCollection()
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("There is no user outside of this collection with this username")
  })
  }
  deleCollection(item){
    Axios.delete('http://37.152.188.83/api/collection/'+item.id+"/",{headers:{
      'Content-Type' : 'application/json',
      'Authorization' :`Token ${localStorage.getItem('token')}`
    }})
    .then((response)=>{
        if (response.status === 204){
            message.success("You deleted this collection successfully")
            this.getCollection()
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
    Axios.delete('http://37.152.188.83/api/collection/'+item.id+"/left/",{headers:{
    'Content-Type' : 'application/json',
    'Authorization' :`Token ${localStorage.getItem('token')}`
  }})
  .then((response)=>{
      if (response.status === 200){
          message.success("You left this collection successfully")
          this.getCollection()
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("Something went wrong")
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
          this.getCollection()
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("Something went wrong.")
  })
  }
  addNew(item) {
    const { panes } = this.state;
    this.setState({currentCollectionname :item.name});
    if(item.type==="public")
    {
      this.isPublic=true
    }
    else if(item.type==="private"){
      this.isPublic=false
    }
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: item.name, content: 
      <div style={{marginTop: '6%'}}>
        <Row >

          <Col span={8} style={{marginLeft: '5%',alignContent: 'center',alignItems: 'center'}}>
            <div className="collectinbox" style={{textAlign: 'left',marginLeft: '10%'}}>
            <h5 style={{fontSize: '23px' ,marginLeft: '5%'}}>Name: {item.name}</h5>
            <h5 style={{fontSize: '22px',marginLeft: '5%'}}>Status: {item.type}</h5>
            <h5 style={{fontSize: '22px',paddingRight: '5%',marginLeft: '5%'}}>Users:</h5>
            <h5 style={{fontSize: '18px',marginLeft: '5%'}}>{item.users.map(user=>(user.user+" : "+user.role+" , "))} </h5>
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
                <Col span={2}>
                <Form.Item>
                  
                <Checkbox buttonStyle="solid" style={{float: 'right'}} onChange={() => this.onChange4} value={this.isPublic}>
                </Checkbox>
                </Form.Item>
                </Col>
                <Col span={10}>
                <h5 style={{fontSize: '16px',marginLeft: '-10%',marginTop: '2%'}}>Public access</h5>
                </Col>
                
              </Row>
            
                
                
                <Form.Item >
                <Button htmlType="submit" name="submit"  style={{width: "50%",color: 'white',backgroundColor: '#1890ff'}} onClick={()=>onFinish(item,this.state.currentCollectionname,this.isPublic)}>
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
          {item.users.map(user=>(
            
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
                <Button hidden={this.power==='visitor'||user.role==='owner'||(user.role==='editor'&&this.power==='editor')} style={{backgroundColor: 'green',border: 'none',color: 'white'}} onClick={()=>this.Promote(user,item)}>promote</Button>
                </Col>
                <Col span={12}>
                <Button  hidden={this.power==='visitor'||user.role==='owner'||(user.role==='editor'&&this.power==='editor')} style={{backgroundColor: 'red',border: 'none',color: 'white'}} onClick={()=>this.Removeuser(user,item)}>remove</Button>

                </Col>
                </Row>}  
            </div>
                </Col>
              </Row>
             
            </Col>))}
         
          </Row>
          {this.power==="owner"?
          <Row style={{marginLeft: '5%',marginTop: '5%'}}>
          <Col span={6} style={{textAlign: 'left'}}>
              <h5 style={{fontSize: '20px' }}>Add a new user:</h5>
            </Col>
            <Col span={6}>
            <Input onChange={this.secondChange} placeholder="username" style={{width: '80%'}}/>            
            </Col>
            <Col span="1">
            <Checkbox buttonStyle="solid" style={{float: 'right'}} onChange={() => this.onChange5} value={this.isEditor}>
                </Checkbox>
                </Col>
                <Col span={4}>
                <h5 style={{fontSize: '16px',marginLeft: '8%',float: 'left'}}>Give editor access</h5>
                </Col>
            <Col span={6}>
            <Button style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.Adduser(item)}}>Add User</Button>

            </Col>
          </Row>
          :''}
          
          <Row style={{marginLeft: '5%',marginTop: '3%',borderTop: '1px solid gray',paddingBottom: '5%'}}>
            <Col span={8}>
            </Col>
            <Col span={8} style={{marginTop: '3%'}}>
            {this.power==="owner"?
            <Button style={{backgroundColor: '#cc7d1c',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.deleCollection(item)}}>Delete</Button>
            :
            <Button style={{backgroundColor: '#cc7d1c',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.leaveCollection(item)}}>Leave</Button>
          }
            </Col>
          </Row>
          
        </div>
     
      </div>
      , key: activeKey });
    this.setState({ panes, activeKey });
  };

  getCollection=()=>
  {
    Axios.get('http://37.152.188.83/api/collection/user/'+localStorage.getItem('username'),{headers:{
      'Content-Type' : 'application/json',
      'Authorization' :`Token ${localStorage.getItem('token')}`
    }}).then((res)=>{
      this.setState({ collections: res.data });
    })
    .catch((err)=>{
      //alert(localStorage.getItem('token'));

    })
  }



  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: 'New Tab', content: <ApiContent/>, key: activeKey });
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };

  addClick = (name) => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: name, content: <ApiContent id="1"/>, key: activeKey });
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };

  remove = targetKey => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };
  componentDidMount() {
    this.getCollection()
  }
  setDark = () =>{
    if(this.state.theme)
    {
      document.documentElement.style.setProperty('--background','#f9f9f9');
      document.documentElement.style.setProperty('--layout1','#ececec');
      document.documentElement.style.setProperty('--layout2','#d8d8d8');
      document.documentElement.style.setProperty('--layout4','#c5c5c5');
      document.documentElement.style.setProperty('--layout5','#b1b1b1');
      document.documentElement.style.setProperty('--layout3','#9e9e9e');
      document.documentElement.style.setProperty('--layout6','#8e8e8e');
      document.documentElement.style.setProperty('--layout7','#7e7e7e');
      document.documentElement.style.setProperty('--layout8','#6f6f6f');
      document.documentElement.style.setProperty('--layout9','#5f5f5f');
      document.documentElement.style.setProperty('--maintext','black');
      document.documentElement.style.setProperty('--secondtext','#212121');
      document.documentElement.style.setProperty('--bar','black');
      document.documentElement.style.setProperty('--barOnhover','#212121');
      this.setState({theme: false})

    }
   
    else{
        
      document.documentElement.style.setProperty('--background','#212121');
      document.documentElement.style.setProperty('--layout1','#282828');
      document.documentElement.style.setProperty('--layout2','#303030');
      document.documentElement.style.setProperty('--layout4','#333');
      document.documentElement.style.setProperty('--layout5','#414141');
      document.documentElement.style.setProperty('--layout3','#505050');
      document.documentElement.style.setProperty('--layout6','#575757');
      document.documentElement.style.setProperty('--layout7','#676767');
      document.documentElement.style.setProperty('--layout8','#818181');
      document.documentElement.style.setProperty('--layout9','#949494');
      document.documentElement.style.setProperty('--maintext','rgb(255, 255, 255)');
      document.documentElement.style.setProperty('--secondtext','rgb(218, 212, 212)');
      document.documentElement.style.setProperty('--bar','white');
      document.documentElement.style.setProperty('--barOnhover','silver');
      this.setState({theme: true})
    }

  };
  render(){  
    return (
      <Layout style={{backgroundColor: 'transparent',overflowX: 'hidden',width: '100%'}}>
        <Header  style={{ height: '8vh',backgroundColor: 'transparent',padding: '0px',borderBottom: '1px solid rgb(204 204 204)',lineHeight: '3.75'}}>
        <Row justify="start" style={{width: '100%',marginLeft: '-1%'}}>
          <Col span={2}>
          <h4 >Home</h4>
          </Col>
          <Col span={3} >
          <h4 >Reports</h4>
          </Col>
          <Col span={3}>
          <h4>Explore</h4>
          </Col>
          <Col span={2} >
          <Dropdown overlay={menu}>
    <h4 className="ant-dropdown-link" onClick={e => e.preventDefault()}style={{color: 'black'}} >
      Workspaces <DownOutlined />
    </h4>
  </Dropdown>
          </Col>
          <Col span={4} style={{float: 'right' , marginLeft: '40%'}}>
          <Select
                    showSearch
                    style={{ width: "80%"}}

                    placeholder="Search"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }

                >

                </Select>   
          </Col>
        </Row>
        </Header>
        <Layout style={{width: '100%',backgroundColor: 'transparent',marginTop: '-0.05%'}}>
        <Sider theme={this.state.theme?"dark":"light"}  collapsible style={{width: '20%' ,minHeight: '100vh'}}>
          <Menu
          mode="inline"
          theme={this.state.theme?"dark":"light"}
              style={{ position: "sticky",height: '20vh' }}>
              
              <Menu.Item disabled style={{cursor: 'default'}} key="switch" icon={this.state.theme?<FaMoon className="iconstyle" style={{ verticalAlign: 'middle', marginTop: '0.7%' }} />
            :<FaSun className="iconstyle" style={{ verticalAlign: 'middle', marginTop: '1%' }} />}>
            <Switch checkedChildren='Dark' unCheckedChildren='Light' defaultChecked={true} onClick={this.setDark} style={{width: '40%'}}/>

              </Menu.Item>
             <SubMenu key="sub1" icon={<NodeCollapseOutlined />}  title={"Collection"}>
             { this.state.collections.length===0?'':    <List
              size="small"
              itemLayout="horizontal"
              dataSource={this.state.collections}
              renderItem={item => (
  
              this.state.collections.forEach(item=> a=(item.name)),
              <Menu.Item   key={item.name+item.id} >
              <List.Item style={{borderColor: 'transparent'}}>
              <List.Item.Meta  style={{borderColor: 'transparent'}}
              description={<p className="colect" onClick={()=>this.addNew(item)} style={{fontSize: '14px',cursor: 'pointer',marginLeft: '20%',marginTop: '4%' ,color: 'black' }} > {item.name}</p>}
    
    
            />  
            </List.Item></Menu.Item>
          )}
        /> }
                </SubMenu>
                <SubMenu key="sub2" icon={<ApiOutlined/>}  title={"APIs"}>
                  <Menu.Item onClick={()=>this.addClick("API One")} >
                    API one
                    </Menu.Item>
                    <Menu.Item onClick={()=>this.addClick("API Two")} >
                      API two
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<BorderOutlined />}  title={"Environments"}>
                  <Menu.Item >
                    Environment1
                    </Menu.Item>
                    <Menu.Item >
                      Environment2
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" icon={<FundProjectionScreenOutlined />}  title={"Monitors"}>
                  <Menu.Item >
                    Some items
                    </Menu.Item>
                    <Menu.Item >
                      some other items
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub5" icon={<ClockCircleOutlined />}  title={"History"}>
                  <Menu.Item >
                    First item
                    </Menu.Item>
                    <Menu.Item >
                      second item
                    </Menu.Item>
                </SubMenu>
                <Menu.Item icon={<LogoutOutlined />}>
                 <Link to='./login'>Exit</Link>
                </Menu.Item>
               </Menu>
          </Sider>
          <Content style={{width: '100%' }}>

          <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>

          </Content>
        </Layout>

        
      </Layout>
     
  );
}
}
export default Dashboard;
