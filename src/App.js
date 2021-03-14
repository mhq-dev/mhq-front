import './App.css';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage} />
      </Switch>
    </div>
  );
}

export default App;
