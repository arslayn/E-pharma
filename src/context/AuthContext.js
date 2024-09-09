import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check local storage for user data on component mount
    const storedUserData = localStorage.getItem('userData');
    console.log('storedUserData', storedUserData);

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);
      setRole(parsedUserData.role);
    }
  }, []);

  const signIn = (userData) => {
    // Save user data to local storage and set the user state
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
  };

  const signOut = () => {
    // Remove user data from local storage and set user state to null
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut,role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
