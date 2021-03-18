import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss';
import Axios from 'axios';
import { Layout, Menu, Dropdown , Avatar, Button ,List,Tabs,Select,Row,Col } from "antd";
//import {  Link, NavLink } from 'react-router-dom';
import { DownOutlined,ClockCircleOutlined,ApiOutlined,NodeCollapseOutlined,BorderOutlined,
  FundProjectionScreenOutlined,LogoutOutlined} from '@ant-design/icons';
const { TabPane } = Tabs;
const { SubMenu } = Menu;
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
  componentDidMount() {
    Axios.get('http://37.152.188.83//collections/'+localStorage.getItem('username'),{headers:{

      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
      'Authorization' :`Bearer ${localStorage.getItem('token')}`
    }})
  }
  render(){  
    return (
      <Layout style={{backgroundColor: 'transparent',overflowX: 'hidden',width: '100%'}}>
        <Header  style={{ height: '8vh',backgroundColor: 'transparent',padding: '0px',borderBottom: '1px solid rgb(204 204 204)',lineHeight: '3.75'}}>
        <Row justify="start" style={{width: '100%',marginLeft: '1.8%'}}>
          <Col span={2}>
          <h4 >Home</h4>
          </Col>
          <Col span={3} >
          <Dropdown overlay={menu}>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color: 'black'}}>
      Workspaces <DownOutlined />
    </a>
  </Dropdown>
          </Col>
          <Col span={3} >
          <h4 >Reports</h4>
          </Col>
          <Col span={10}>
          <h4>Explore</h4>
          </Col>
          <Col span={6}>
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
                  <Menu.Item >
                    Some items
                    </Menu.Item>
                    <Menu.Item >
                      some other items
                    </Menu.Item>
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
                  Exit
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
