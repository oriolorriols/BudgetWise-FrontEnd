import React, { createContext, useState, useContext } from "react";
import { useJwt } from "react-jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const { decodedToken, isExpired } = useJwt(token);
  const userId = decodedToken?.id
  const isHR = decodedToken?.profileType

  const isAuthenticated = !!token && !isExpired;

  const setLogIn = (token) => {
    localStorage.setItem('access_token', token)
    setToken(token)
  }

  const setLogOut = () => {
    localStorage.removeItem('access_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ setLogIn, setLogOut, isAuthenticated, userId, isHR }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};