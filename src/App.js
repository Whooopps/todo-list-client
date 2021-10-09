import '@fortawesome/fontawesome-free/css/all.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './home/Home';
import SignIn from './signin/SignIn';
import SignUp from './signup/SignUp';
import NotFound from './notfound/NotFound';
import { useEffect, useState } from 'react';

function App() {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState();

  function scrollToTop() {
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    function onScroll() {
      setIsScrollToTopVisible(document.documentElement.scrollTop > 0);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Router>
      <div className="App flex justify-center h-full w-full font-sans">
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
        <button className={`fixed w-6 h-6 bottom-3 right-3 text-lg transition-opacity ${isScrollToTopVisible ? 'opacity-100' : 'opacity-0'}`} title="Go to Top" >
          <i class="fas fa-level-up-alt fa-lg" onClick={scrollToTop}></i>
        </button>
      </div>
    </Router>
  );
}

export default App;
