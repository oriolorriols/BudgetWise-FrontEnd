import React, { createContext, useState, useContext, useEffect } from "react";
import { useJwt } from "react-jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //Se puede hacer todo solo guardando el token en el localStorage
  // const [token, setToken] = useState(localStorage.getItem('access_token'))
  const { decodedToken, isExpired } = useJwt(localStorage.getItem('access_token'));
  // const { decodedToken, isExpired } = useJwt(token);
  const userId = decodedToken?.id
  const isHR = decodedToken?.profileType

  //Toda la logica de login y logout
  //Logica token

  const login = (token) => {
    localStorage.setItem('access_token', token)
    // setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    // setToken(null)
  }

  return (
    <AuthContext.Provider value={{ login, logout, userId, isHR }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};