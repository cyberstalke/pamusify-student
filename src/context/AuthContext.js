import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const stored = await AsyncStorage.getItem('authUser');
        if (token) {
          setIsLoggedIn(true);
          if (stored) setUser(JSON.parse(stored));
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    check();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authApi.login(username, password);
      await AsyncStorage.setItem('authToken', res.token);
      await AsyncStorage.setItem('authUser', JSON.stringify(res.user));
      setUser(res.user);
      setIsLoggedIn(true);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    await AsyncStorage.multiRemove(['authToken', 'authUser']);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
