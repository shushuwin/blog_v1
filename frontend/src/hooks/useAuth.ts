import { useState, useEffect } from 'react';
import { getCurrentUser, setAuthToken, login as loginApi, register as registerApi } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const onAuthUpdated = () => {
      setLoading(true);
      fetchUser();
    };
    window.addEventListener('auth-updated', onAuthUpdated);
    return () => window.removeEventListener('auth-updated', onAuthUpdated);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await loginApi(username, password);
    const { access_token } = response;
    setAuthToken(access_token);
    localStorage.setItem('access_token', access_token);
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await registerApi(username, password, email);
    const { access_token } = response;
    setAuthToken(access_token);
    localStorage.setItem('access_token', access_token);
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    try { window.dispatchEvent(new CustomEvent('auth-updated')) } catch {}
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};