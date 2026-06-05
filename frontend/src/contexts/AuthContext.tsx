import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { apiLogin } from '../api';

interface AuthContextValue {
  token: string | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('forti_token')
  );

  async function login(password: string) {
    const data = await apiLogin(password);
    localStorage.setItem('forti_token', data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem('forti_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
