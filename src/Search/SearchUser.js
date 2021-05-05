import React, {Component } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Select } from 'antd';
import { Redirect,Link,withRouter } from 'react-router-dom';


const { Option } = Select;
const proxyurl = localStorage.getItem('url');
class CommunitySearch extends Component {
    state = {
        suggestlist: [],
        selected_user: "1",
    };

    onSelect = (value) => {
        this.setState({ selected_user: value });


    }
    onSearch = (value) => {
        axios.get("http://37.152.188.83/api/user/search_users/" + value,{headers:{
            'Content-Type' : 'application/json',
            'Authorization' :`Token ${localStorage.getItem('token')}`
          }})
            .then(res => {
                this.setState(prevState => {
                    return { suggestlist: res.data }
                })
            })
    }

    render() {
        return (
            <div>
                <Select
                    showSearch
                    style={{ width: "80%", height: '3vh'}}

                    placeholder="Search"
                    onSearch={this.onSearch}
                    onSelect={this.onSelect}

                >
                    {this.state.suggestlist.map(item => (
                        <Option value={item.username}><Link to={'/Profile/'+item.username}><h4>{item.username}</h4></Link></Option>
                    ))
                    }

                </Select>   
                 </div>

        );
    }

}
export default CommunitySearch;