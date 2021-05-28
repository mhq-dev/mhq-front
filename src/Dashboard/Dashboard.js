import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss'
import Axios from 'axios';
import Collection from './Collection'
import CreateCollection from '../CreateCollection/CreateCollection'
import Pro from './ava.png';
import { Layout,Avatar, Menu, Dropdown , Form, Input, Button ,List,Tabs,Select,Row,Col,Switch,Radio ,message} from "antd";
import { Option } from 'antd/lib/mentions';
import {  FaMoon,FaSun } from "react-icons/fa";
import {  Link, NavLink } from 'react-router-dom';
import { DownOutlined,ClockCircleOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,CrownOutlined ,EditOutlined ,EyeOutlined,
  FundProjectionScreenOutlined,LogoutOutlined} from '@ant-design/icons';
import ApiContent from './ApiPage/ApiContent.js';
import SearchUser from '../Search/SearchUser';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import Scenario from '../Scenario/Scenario';
const { TabPane } = Tabs;
const { SubMenu } = Menu;let a="";
const { Header, Content, Footer, Sider } = Layout;

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
  let isPublic= false;
  let isEditor= false;
class Dashboard extends React.Component {
  newTabIndex = 0;
  state = {
    
    collections: [],activeKey: panes[0].key,
    panes,
    thisCollection: "",
    theme: true,
    currentCollectionname: '',
    newUser: '',
    newreq: '',
    method_tpye: '',
    url: '',
    type: '',

    
  };
  
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

onChangeInputUrl = (input)=>{
  this.setState({url:input.target.value})
}
  onChange4=(e)=>{
    this.setState({type :e.target.value});

  };
  onChange5=(e)=>{
    isEditor=e.target.value;

  };
  firstChange=e=>{
    this.setState({currentCollectionname :e.target.value});

  }
  secondChange=e=>{
    this.setState({newUser :e.target.value});
  }
  Exit=e=>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('theme');
    localStorage.clear();
    this.setState({theme: false});
    this.setDark();
  }
  changeType=(e)=>{
    this.setState({method_tpye :e.target.value});

}
  thirdChange=e=>{
    this.setState({newreq :e.target.value});
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
          window.location.reload();
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("Network error")
  })
  }
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
  getthis(item) {
    Axios.get('http://37.152.188.83/api/collection/'+item.id,{headers:{
      'Content-Type' : 'application/json',
      'Authorization' :`Token ${localStorage.getItem('token')}`
    }}).then((res)=>{
      item=res.data;
    })
    .catch((err)=>{
      //alert(localStorage.getItem('token'));

    })
  }
  addNew(item) {
    const { panes } = this.state;
    localStorage.removeItem("collection_id")
    localStorage.setItem("collection_id" , item.id)
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: item.name, content: 
      <div>
      <Collection/>
      <div style={{marginTop: '3%',marginLeft: '4%',width: '90%',borderTop: '1px solid gray'}}>
            <Row>
              <Col span={24}>
              <h5 style={{fontSize: '20px',marginLeft: '5%',marginTop: '1%' ,float: 'left'}}>Requests</h5>

              </Col>
              </Row>
              {item.requests.map(req=>(
                <Row style={{marginTop: '2%',marginLeft: '6%',textAlign: 'left'}}>
                <Col span= {6} style={{float: 'left',marginLeft: '1%'}}>
                   <h5 style={{fontSize: '17px' }}>Name : {req.name}</h5>

                </Col>
                <Col span={6}>
                <h5 style={{fontSize: '17px' }}>Method : {req.http_method}</h5>
                </Col>
                <Col span={6}>
                <Button style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} onClick={()=>{this.addClick(req)}}>Open Request</Button>


                </Col>
                </Row>
              ))}
            </div>
            <Row style={{marginTop: '3%',marginLeft: '4%',paddingBottom: '5%'}}>
          <Col span={6} style={{marginTop: '3%'}}>
          <h5 style={{fontSize: '20px' }}>Add a new request</h5>
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

  addClick(req) {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: req.name, content: <ApiContent id={req.id}/>, key: activeKey });
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };
  addCol(req) {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: req.name, content: <ApiContent id={req.id}/>, key: activeKey });
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
  addScen = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: 'Scenario', content: <Scenario/>, key: activeKey });
    this.setState({
      panes: newPanes,
      activeKey,
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
                <Menu.Item icon={<LogoutOutlined />} onClick={this.Exit}>
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
            <TabPane style={{minHeight:'100vh',width:'100%'}} tab={pane.title} key={pane.key} closable={pane.closable}>
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
