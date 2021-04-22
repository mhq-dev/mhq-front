import React from 'react';
import 'antd/dist/antd.css';
import './Profile.css';
import axios from 'axios';
import { Card,message,Row,Col } from 'antd';
import {RedoOutlined, MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

class APIBox extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282c34'
        
    }

    render(){
        return (
            <div STYLE="margin:20px;">
                <Card STYLE="background-color:#282c34; border-color:#94c1ff;">
                    <Row>
                    <Col span={2}>
                {(this.props.api_method.toUpperCase()=="GET") ? 
                        <p STYLE="text-align:left; color:#78c622; font-weight: bold;">GET</p>
                    : 
                        ((this.props.api_method.toUpperCase()=="POST") ? <p STYLE="text-align:left; color:#f5a623; font-weight: bold;">POST</p>
                        : ((this.props.api_method.toUpperCase()=="PUT") ? <p STYLE="text-align:left; color:#4a90e2; font-weight: bold;">PUT</p>
                        : 
                        ((this.props.api_method.toUpperCase()=="DELETE") ?  <p STYLE="text-align:left; color:#ed4b48; font-weight: bold;">DELETE</p>
                        :
                        <p STYLE="text-align:left;">{this.props.api_method}</p>
                        )))
                    }
                    </Col>
                    <Col span={5}>
                    <p STYLE="text-align:left; color:#dfdfdf; font-weight: bold;">{this.props.api_address}</p>                
                    </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}
export default APIBox;
