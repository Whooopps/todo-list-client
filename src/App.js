import '@fortawesome/fontawesome-free/css/all.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './home/Home';
import SignIn from './signin/SignIn';
import SignUp from './signup/SignUp';
import NotFound from './notfound/NotFound';

function App() {
  return (
    <Router>
      <div className="App flex justify-center h-screen w-screen font-sans bg-gray-50">
        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*">
            <NotFound/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
