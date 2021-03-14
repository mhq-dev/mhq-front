import './App.css';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage/HomePage';
import Signup from './Signup/Signup';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/signup' exact component={Signup} />
      </Switch>
    </div>
  );
}

export default App;
