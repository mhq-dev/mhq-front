import React from 'react';
import 'antd/dist/antd.css';
import './Signup.css';
import axios from 'axios';
import { message } from 'antd';

class EmailConfirmation extends React.Component {
    constructor(props){
        super(props);
        
        document.body.style.backgroundColor = '#282c34'
        const addressArray = window.location.href.split("/").reverse();
        axios.post(`http://localhost:3000/api/auth/users/activation/`, 
            {
                "uid": addressArray[1],
                "token": addressArray[0]
            }
            , {})
            .then(res => {
               // message.success("Your account activated successfully.");            
                window.location.replace("/login");
            })
            .catch(err =>
            {
               // message.error("Verify your email at first.");
                console.log(err);
                window.location.replace("/signup");        
            });
    }
    render(){
        return (
            <p></p>
        );
    }
}
export default EmailConfirmation;