import React, { createContext, useState, useContext, useEffect } from "react";
import { useJwt } from "react-jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('access_token')
  const { decodedToken, isExpired } = useJwt(token);
  const userId = decodedToken?.id
  const isHR = decodedToken?.profileType

  const setLogIn = (token) => {
    localStorage.setItem('access_token', token)
  }

  const setLogOut = () => {
    localStorage.removeItem('access_token')
  }

  return (
    <AuthContext.Provider value={{ setLogIn, setLogOut, token, userId, isHR }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};