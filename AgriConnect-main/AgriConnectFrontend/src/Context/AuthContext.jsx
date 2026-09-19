import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('agrihub_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrihub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('agrihub_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agrihub_token', token);
    } else {
      localStorage.removeItem('agrihub_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrihub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrihub_user');
    }
  }, [user]);

  useEffect(() => {
    if (farmerProfile) {
      localStorage.setItem('agrihub_profile', JSON.stringify(farmerProfile));
    } else {
      localStorage.removeItem('agrihub_profile');
    }
  }, [farmerProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { token, user, profile } = res.data.data;
      setToken(token);
      setUser(user);
      if (profile) setFarmerProfile(profile);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      const { token, user, profile } = res.data.data;
      setToken(token);
      setUser(user);
      if (profile) setFarmerProfile(profile);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const startDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await authApi.demoLogin();
      const { token, user, profile } = res.data.data;
      setToken(token);
      setUser(user);
      if (profile) setFarmerProfile(profile);
      return { success: true };
    } catch (error) {
      // Fallback demo user if backend is temporarily unreachable
      const fallbackUser = {
        id: 'usr-demo-ravi',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@agrihub.in',
        role: 'FARMER',
        phone: '9848012345',
        preferredLanguage: 'te'
      };
      const fallbackProfile = {
        name: 'Ravi Kumar',
        village: 'Kaza',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        farmSize: '2 acres',
        cropsGrown: ['Tomato', 'Chilli']
      };
      setToken('demo-token-123');
      setUser(fallbackUser);
      setFarmerProfile(fallbackProfile);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFarmerProfile(null);
    localStorage.removeItem('agrihub_token');
    localStorage.removeItem('agrihub_user');
    localStorage.removeItem('agrihub_profile');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      farmerProfile,
      setFarmerProfile,
      isAuthenticated: !!token || !!user,
      loading,
      login,
      register,
      startDemoLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
