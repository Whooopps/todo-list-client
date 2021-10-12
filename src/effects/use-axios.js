import axios from "axios";
import { createContext, useContext, useMemo } from "react";
import { useAlert } from "react-alert";
import { useHistory } from "react-router";
import { useSetAuth } from "./use-auth";

const AxiosContext = createContext(null);

export function AxiosProvider({ children }) {
  const history = useHistory();
  const setAuth = useSetAuth();
  const alert = useAlert();
  const axiosInstance = useMemo(() => {
    const instance = axios.create();
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!axios.isCancel(error)) {
          let message = "There was an error while processing your request.";
          if (error.response) {
            if (error.response.status === 401) {
              setAuth(false);
            }
            if (error.response.data.message) {
              message = error.response.data.message;
            }
          }
          alert.error(message);
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [setAuth, alert]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios() {
  const axios = useContext(AxiosContext);
  return axios;
}
