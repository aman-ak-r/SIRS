import { createContext, useContext, useMemo, useState } from 'react';
import { AuthResponse, User } from '../types';

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (payload: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'sirs_token';
const USER_KEY = 'sirs_user';

function getInitialToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getInitialUser(): User | null {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? (JSON.parse(stored) as User) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken());
  const [user, setUser] = useState<User | null>(getInitialUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: (payload) => {
        setToken(payload.accessToken);
        setUser(payload.user);
        localStorage.setItem(TOKEN_KEY, payload.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
