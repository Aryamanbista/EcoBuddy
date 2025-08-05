import { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../api/api.js'; 

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'ecobuddy_current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // This part remains the same - it rehydrates the user state on page load
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // --- NEW ASYNC FUNCTIONS ---

  const login = async (email, password) => {
    try {
      const { data } = await api.login({ email, password });
      setUser(data); // The response data includes the token
      return { success: true, user: data };
    } catch (error) {
      // Return the error message from the backend
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.register(formData);
      setUser(data);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);