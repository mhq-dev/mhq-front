import './App.css';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage/HomePage';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard'
import EmailConfirmation from './Signup/EmailVerification';
import Profile from './Profile/Profile';
import OtherProfile from './Profile/OtherProfile';
import ApiRunner from './Profile/ApiRunner';
import Scenario from './Scenario/Scenario';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/login' exact component={Login} />
        <Route path="/activate/*" exact component={EmailConfirmation} />
        <Route path='/dashboard' exact component={Dashboard}/>
        <Route path='/Profile' exact component={Profile} />
        <Route path='/Profile/*' exact component={OtherProfile} />
        <Route path='/apiRunner' exact component={ApiRunner} />
        <Route path='/scenario' exact component={Scenario} />
      </Switch>
    </div>
  );
}

export default App;
