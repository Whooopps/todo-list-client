import "@fortawesome/fontawesome-free/css/all.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./home/Home";
import SignIn from "./signin/SignIn";
import SignUp from "./signup/SignUp";
import NotFound from "./notfound/NotFound";
import { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AxiosProvider } from "./effects/use-axios";
import { AuthProvider } from "./effects/use-auth";
import { positions, Provider as AlertProvider, transitions } from "react-alert";

function AlertTemplate({ style, options, message, close }) {
  function getIcon(type) {
    switch (type) {
      case "info":
        return <i className="fas fa-info"></i>;
      case "success":
        return <i className="far fa-check-circle"></i>;
      case "error":
        return <i className="fas fa-exclamation-triangle"></i>;
    }
    return null;
  }
  function getClasses(type) {
    switch (type) {
      case "info":
        return "border border-solid border-blue-700 bg-blue-200";
      case "success":
        return "border border-solid border-green-700 bg-green-200";
      case "error":
        return "border border-solid border-red-700 bg-red-200";
    }
  }
  return (
    <div
      style={style}
      className={`rounded flex gap-2 content-center text-left w-80 px-4 py-2 ${getClasses(
        options.type
      )}`}
    >
      <div className="w-4 h-4 text-center leading-4 self-center">
        {getIcon(options.type)}
      </div>
      <p className="flex-grow">{message}</p>
      <div className="self-right">
        <button onClick={close}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState();

  function scrollToTop() {
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    function onScroll() {
      setIsScrollToTopVisible(document.documentElement.scrollTop > 0);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Router>
      <AlertProvider
        template={AlertTemplate}
        position={positions.TOP_RIGHT}
        timeout={5000}
      >
        <AxiosProvider>
          <AuthProvider>
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
                  <NotFound />
                </Route>
              </Switch>
              <button
                className={`fixed w-6 h-6 bottom-3 right-3 text-lg transition-opacity ${
                  isScrollToTopVisible ? "opacity-100" : "opacity-0"
                }`}
                title="Go to Top"
              >
                <i
                  className="fas fa-level-up-alt fa-lg"
                  onClick={scrollToTop}
                ></i>
              </button>
            </div>
          </AuthProvider>
        </AxiosProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
