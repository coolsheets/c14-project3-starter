import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from './api';

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check for existing login on initial load
  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  const login = async (username, password) => {
    const loggedInUser = await apiLogin(username, password);
    setUser(loggedInUser);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </LoginContext.Provider>
  );
}
