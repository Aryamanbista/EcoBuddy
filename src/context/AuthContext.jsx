import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_DB_KEY = 'waste_wise_users';
const CURRENT_USER_KEY = 'waste_wise_current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage on component mount
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  
  // Effect to sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // Function to register a new user
  const register = (userData) => {
    const allUsers = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    
    // Check if email already exists
    const userExists = allUsers.some(u => u.email === userData.email);
    if (userExists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // "Create" a new user (in real app, you'd hash the password)
    const newUser = {
      id: Date.now(), // Simple unique ID
      ...userData,
    };
    
    allUsers.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
    
    return { success: true, message: 'Registration successful! Please log in.' };
  };

  // Function to log in a user
  const login = (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    
    const foundUser = allUsers.find(u => u.email === email);

    if (foundUser && foundUser.password === password) {
      // Don't store the password in the user state or session storage
      const { password: _, ...userToStore } = foundUser; 
      setUser(userToStore);
      return { success: true, user: userToStore };
    }
    
    return { success: false, message: 'Invalid email or password.' };
  };

  // Function to log out a user
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