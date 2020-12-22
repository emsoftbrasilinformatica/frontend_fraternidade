import React, { createContext, useCallback, useState, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

interface SignInCredentials {
  cim: string;
  semiannual_word: string;
  password: string;
}

interface AuthState {
  token: string;
  user: UserData;
}

interface UserData {
  id: string;
  name: string;
  cim: number;
  avatar?: string;
  degree: Degree;
  administrative_function?: AdminstrativeFunction;
  updated_at: string;
}

interface DecodeToken {
  iat: number;
  exp: number;
  sub: string;
}

interface AdminstrativeFunction {
  id: string;
  description: string;
  admin: boolean;
}

interface Degree {
  id: string;
  description: string;
  order: number;
}

interface AuthContextData {
  user: UserData;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: UserData): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Loja:token');
    const user = localStorage.getItem('@Loja:user');

    if (token) {
      const decodeToken: DecodeToken = jwtDecode(token);
      const { exp } = decodeToken;
      if (exp < (new Date().getTime() + 1) / 1000) {
        localStorage.removeItem('@Loja:token');
        localStorage.removeItem('@Loja:user');
        return {} as AuthState;
      }
    }

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ cim, semiannual_word, password }) => {
    const response = await api.post('/authenticate', {
      semiannual_word,
      cim,
      password,
    });

    const { token, user } = response.data;

    // if (user.administrative_function.admin !== true) {
    //   throw Error;
    // }

    localStorage.setItem('@Loja:token', token);
    localStorage.setItem('@Loja:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Loja:token');
    localStorage.removeItem('@Loja:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: UserData) => {
      localStorage.setItem('@Loja:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
