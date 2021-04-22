import React from 'react';
import 'antd/dist/antd.css';
import './ChangePassword.css';
import './Profile.css';

import axios from 'axios';
import {Row, Form, Input, Button,message, Modal,Card,Typography,Checkbox } from 'antd';
import {InfoCircleOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';

class DeleteAccount extends React.Component {
    constructor(props){
        super(props);
        document.body.style.backgroundColor = '#282c34'
    }
    
    render(){
        return (
            <Modal
            visible={this.props.vis}
            title="Enter your current password"
            closable={false}
            footer={[
              <button className="cancel-account-button" key="cancel" type="secondary" onClick={this.props.cancel}>
                Cancel
              </button>,
              <button className="delete-account-button" key="ok" onClick={this.props.cancel}>
                Delete
              </button>
            ]}>
            <div>
              <form>
                  <textarea STYLE="width:100%;" type="text" id="messagedimo" name="messagedimo" ></textarea>
              </form> 
            </div>
            </Modal>
            
        );
    }
}

export default DeleteAccount;