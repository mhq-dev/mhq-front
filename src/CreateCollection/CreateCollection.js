import React from 'react';
import 'antd/dist/antd.css';
import '../style/design.scss'
import axios from 'axios';
import {
  UserOutlined
} from "@ant-design/icons";
import FormItem from 'antd/lib/form/FormItem';
import {  Link, NavLink } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Tabs,
    Radio,
    Checkbox,
    message,
    Row, Col 
} from "antd";
import{
    EditOutlined
  } from "@ant-design/icons";
const formItemLayout = {
 
    wrapperCol: {
        xs: {
            span: 0,
        },
        sm: {
            span: 24,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 8,
        },
        sm: {
            span: 24,
            offset: 0,
        },
    },
};

const { TabPane } = Tabs;

class CreateCollection extends React.Component {
    state = {
        title: "",
        type: true,
        requests: "",

    };
    onFinish = (values) => {
        let r="public"
        if(this.state.type===false)
        {
            r="private"
        }
        axios.post('http://37.152.180.213/api/collection/',{
      type: r, name: this.state.title
  },{headers:{
    'Content-Type' : 'application/json',
    'Authorization' :`Token ${localStorage.getItem('token')}`
  }})
  .then((response)=>{
      if (response.status === 201){
          message.success("Collection created successfully")
          window.location.reload();
      }
      else{
          message.error("Please try again")
      }
  })
  .catch((error)=>{
      message.error("There is no user outside of this collection with this username")
  })
  }
        
    onChange = (e) => {
        this.setState({title :e.target.value});

    };
    changeType=(e)=>{
        this.setState({type :e.target.value});

    }
    
    render() {
            return(
                <div style={{marginTop: '6%'}}>
                <Row >
                <Col span={2} style={{marginLeft: '1.8%'}}>
                  <h4 style={{fontSize: '20px'}}>Create</h4>
                </Col>
                </Row >

                 <Form  autoComplete={false}>
                <Row style={{marginLeft: '3.6%' , marginTop: '7%'}}>
                <Col span={8}>
                <Form.Item  style={{width: '70%'}}
                    name="name"
                    >
                    <Input autoCorrect={false} autoComplete={false} value={this.state.title} style={{ width: '100%' }} placeholder="Name" onChange={this.onChange} />
                    </Form.Item>
                    </Col>
                    <Col span={8}>

                    <Form.Item
                    style={{width: '85%',marginLeft: '5%'}} >
                        <Radio.Group buttonStyle="solid" onChange={this.changeType} value={this.state.type}>
                        <Radio.Button  value={true}>Public</Radio.Button>
                        <Radio.Button value={false}>private</Radio.Button>

                        </Radio.Group>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                    <FormItem  style={{width: '85%'}}>
                    <Button onClick={this.onFinish} style={{backgroundColor: '#1890ff',color: 'white',border: 'none',width: '60%'}} 
                    >Create collection</Button>
                    </FormItem>
                    </Col>
    
                     </Row>
                     </Form>
                           
                         

                </div>
        );
    }
}
export default CreateCollection;