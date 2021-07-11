import '../App.css';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import React from 'react';

function HomePage() {
  React.useState(() => {
    if (localStorage.getItem("token") !== null) {
        window.location = '/dashboard';
    }
  });
  return (
    <div className="Authentication-header">
      <header className="App-header">
        <Radio.Group>
          <Link to='/login'>
            <Radio.Button>Login</Radio.Button>
          </Link>
          <Link to='/signup'>
            <Radio.Button>SignUp</Radio.Button>
          </Link>
        </Radio.Group>
      </header>
    </div>
  );
}

export default HomePage;