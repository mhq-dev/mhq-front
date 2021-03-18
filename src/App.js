import './App.css';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage/HomePage';
import Login from './Login/Login';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/login' exact component={Login} />
      </Switch>
    </div>
  );
}

export default App;
