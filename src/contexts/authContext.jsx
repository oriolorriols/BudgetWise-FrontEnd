import React, { createContext, useState, useContext, useEffect } from "react";
import { useJwt } from "react-jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const { decodedToken, isExpired } = useJwt(token);
  const userId = decodedToken?.id
  const isHR = decodedToken?.profileType


  return (
    <AuthContext.Provider value={{ token, setToken, userId, isHR }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};