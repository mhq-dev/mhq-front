import React from 'react';
import 'antd/dist/antd.css';
import './Signup.css';
import axios from 'axios';

class EmailConfirmation extends React.Component {
    constructor(props){
        super(props);
        
        document.body.style.backgroundColor = '#282c34'
        const addressArray = window.location.href;
        axios.post(`http://localhost:3000/api/auth/users/activation/`, 
            {
                "uid": this.getUid(addressArray),
                "token": this.getToken(addressArray)
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
    getUid(urlAddress){
        return urlAddress.split("/").reverse()[1];
    }
    getToken(urlAddress){
        return urlAddress.split("/").reverse()[0];
    }
    render(){
        return (
            <p></p>
        );
    }
}
export default EmailConfirmation;