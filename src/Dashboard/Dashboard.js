import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss'
import Axios from 'axios';
import { Layout, Menu, Dropdown , Avatar, Button ,List,Tabs,Select,Row,Col,Switch } from "antd";
import {  FaMoon,FaSun } from "react-icons/fa";
import {  Link, NavLink } from 'react-router-dom';
import { DownOutlined,ClockCircleOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,
  FundProjectionScreenOutlined,LogoutOutlined} from '@ant-design/icons';
const { TabPane } = Tabs;
const { SubMenu } = Menu;let a="";
const { Header, Content, Footer, Sider } = Layout;
const menu = (
  <Menu>
    <Menu.Item disabled>
      <h5>New</h5>
    </Menu.Item>
    <Menu.Item disabled>
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
      Edit 
      </a>
    </Menu.Item>
    <Menu.Item disabled>
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
      Delete
      </a>
    </Menu.Item >
    <Menu.Item disabled>Search</Menu.Item>
  </Menu>

);
class Dashboard extends React.Component {
  state = {
    collections: [],
    theme: true
  };
  componentDidMount() {
    Axios.get('http://37.152.188.83/api/collections/'+localStorage.getItem('username'),{headers:{
      'Content-Type' : 'application/json',
      'Authorization' :`Token ${localStorage.getItem('token')}`
    }}).then((res)=>{
      this.setState({ collections: res.data });
    })
    .catch((err)=>{
      //alert(localStorage.getItem('token'));

    })
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
          <Col span={2} >
          <Dropdown overlay={menu}>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}style={{color: 'black'}} >
      Workspaces <DownOutlined />
    </a>
  </Dropdown>
          </Col>
          <Col span={3} >
          <h4 >Reports</h4>
          </Col>
          <Col span={3}>
          <h4>Explore</h4>
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
        <Layout style={{width: '100%',backgroundColor: 'transparent'}}>
        <Sider theme="light" collapsible style={{width: '20%' ,height: '100vh'}}>
          <Menu
          mode="inline"
          theme="light"
              style={{ position: "sticky",height: '20vh' }}>
                
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
      description={<p style={{fontSize: '14px',marginLeft: '20%',marginTop: '4%' ,color: 'black' }} > {item.name}</p>}
    
    
/>  
  </List.Item></Menu.Item>
)}
/> }
                </SubMenu>
                <SubMenu key="sub2" icon={<ApiOutlined/>}  title={"APIs"}>
                  <Menu.Item >
                    API one
                    </Menu.Item>
                    <Menu.Item >
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
          <Content style={{width: '100%' ,marginLeft: '1%'}}>

            <Tabs defaultActiveKey="1"  >
            <TabPane tab="Overview" key="1" >
                
            </TabPane>
            <TabPane tab="Create a request" key="2" >
                
            </TabPane>
            <TabPane tab="Create an API" key="3" >
                
            </TabPane>
            <TabPane tab="Create an environment" key="4" >
                
            </TabPane>
          </Tabs>

          
          </Content>
        </Layout>

        
      </Layout>
     
  );
}
}
export default Dashboard;
