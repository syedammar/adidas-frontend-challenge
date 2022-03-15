import React, { createContext, useState } from 'react';

const AuthContext = createContext();
export default AuthContext;

export const AuthContextProvider = ({ children }) => {
  const existingTokens = localStorage.getItem("tokens") ? JSON.parse(localStorage.getItem("tokens")) : null;
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
      localStorage.setItem("tokens", JSON.stringify(data));
      setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens}}>
        {children}
    </AuthContext.Provider>
  )
}