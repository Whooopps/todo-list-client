import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router";

const AuthContext = createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  function setAuthenticated(val) {
    if (!val) localStorage.removeItem("token");
    setIsAuthenticated(val);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthProtected() {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();
  if (!isAuthenticated) {
    history.push("/signin");
    return false;
  }

  return true;
}

export function useNonAuthProtected() {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();
  if (isAuthenticated) {
    history.push("/");
    return false;
  }

  return true;
}

export function useSetAuth() {
  const { setAuthenticated } = useContext(AuthContext);
  return setAuthenticated;
}
