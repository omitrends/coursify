import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      const endpoint = isAdminLogin ? '/api/v1/admin/signin' : '/api/v1/user/signin';
      const response = await axios.post(endpoint, { email, password });
      setToken(response.data.token);
      setIsAdmin(isAdminLogin);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData, isAdminSignup = false) => {
    try {
      const endpoint = isAdminSignup ? '/api/v1/admin/signup' : '/api/v1/user/signup';
      await axios.post(endpoint, userData);
      return { success: true };
    } catch (error) {
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