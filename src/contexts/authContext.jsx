import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('access_token')
  const [isAuth, setAuth] = useState( () => {
    if(token !== null){
        return true
    } else return false
})

  return (
    <AuthContext.Provider value={{ token, isAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};