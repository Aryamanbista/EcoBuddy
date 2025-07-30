// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially no user is logged in

  // Mock login function
  const login = (userData) => {
    // In a real app, you'd call an API and get a token
    const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com', community: 'Greenwood Community', role: 'user' };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);