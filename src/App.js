import './App.css';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage/HomePage';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard'
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/login' exact component={Login} />
        <Route path='/dashboard' exact component={Dashboard}/>
      </Switch>
    </div>
  );
}

export default App;
