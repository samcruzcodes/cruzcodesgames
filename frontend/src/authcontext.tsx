// authContext.tsx
import React, { createContext, useContext } from 'react';

const AuthContext = createContext({
  currentUser: null,
  userLoggedIn: false,
  loading: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("AuthProvider rendering");
  return (
    <AuthContext.Provider value={{ currentUser: null, userLoggedIn: false, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);