import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "../types/auth";
import { login as loginRequest } from "../services/auth.service";
import { getMe } from "../services/auth.service";

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [loading, setLoading] =
    useState(true);
  
  useEffect(() => {
    async function loadUser() {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const userData =
          await getMe();

        setUser(userData);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  async function login(data: LoginInput) {
    const response =
      await loginRequest(data);

    setUser(response.user);
    setToken(response.token);

    localStorage.setItem(
      "token",
      response.token
    );
  
    localStorage.setItem(
      "workspaceId",
      response.user.workspaceId
    );
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");

    localStorage.removeItem("workspaceId");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

async function loadUser() {
  try {
    if (!token) return;

    const userData =
      await getMe();

    setUser(userData);
  } catch {
    logout();
  } finally {
    setLoading(false);
  }
}