import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authService.login({ username, password });
    const { data } = response.data;
    localStorage.setItem('token', data.token);
    // Store full user object — now includes phone, address, rentStatus, floor, etc.
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Refresh user profile from server and update localStorage
  const refreshProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      const fresh = response.data.data;
      const updated = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...fresh };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  }, []);

  const isAdmin = () => user?.role === 'ADMIN';
  const isStudent = () => user?.role === 'STUDENT';
  const isVerified = () => user?.status === 'VERIFIED';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout, refreshProfile,
      isAdmin, isStudent, isVerified
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
