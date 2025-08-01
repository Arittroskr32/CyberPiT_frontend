import React, { useEffect, useState, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if user is already logged in with a valid token
    const token = localStorage.getItem('adminToken');
    if (token && token !== 'admin_authenticated') {
      // Check if token is a valid JWT (basic check)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          // It looks like a JWT token
          setIsAuthenticated(true);
        } else {
          // Invalid token format, remove it
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (_email: string, _password: string) => {
    // Note: The actual token is set by the Login component after successful API call
    // This just updates the context state
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_token'); // Remove old token too
    setIsAuthenticated(false);
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    login,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};