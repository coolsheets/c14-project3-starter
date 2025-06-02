import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "./api";

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Used while checking auth on first load

  useEffect(() => {
    // Try to restore login state from localStorage
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null); // Not logged in or invalid token
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(username, password) {
    const user = await apiLogin(username, password);
    setUser(user);
    return user;
  }

  function logout() {
    apiLogout();
    setUser(null);
  }

  return (
    <LoginContext.Provider value={{ user, login, logout, loading, isLoggedIn: !!user }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  return useContext(LoginContext);
}
