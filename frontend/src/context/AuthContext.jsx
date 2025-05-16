import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI, adminAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    localStorage.setItem('isAdmin', isAdmin.toString());
    setLoading(false);
  }, [token, isAdmin]);

  const login = async (email, password, isAdminLogin = false) => {
    try {
      const response = isAdminLogin 
        ? await adminAPI.signin({ email, password })
        : await userAPI.signin({ email, password });
      
      setToken(response.data.token);
      setIsAdmin(isAdminLogin);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData, isAdminSignup = false) => {
    try {
      if (isAdminSignup) {
        await adminAPI.signup(userData);
      } else {
        await userAPI.signup(userData);
      }
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    token,
    isAdmin,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 