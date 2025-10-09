"use client";
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { CompanyRegistration } from "./AuthContext.type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AuthContextType {
  isAuthenticated: boolean;
  company: CompanyRegistration | null;
  registerCompany: (data: CompanyRegistration) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  startLoginRedirect: (email: string, password: string) => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<CompanyRegistration | null>(null);
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        setCompany(res.data.company);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);
  const startLoginRedirect = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      const me = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });

      setCompany(me.data.company);
      setIsAuthenticated(true);
      toast.success("Inicio de sesión exitoso");
      router.push("/perfilEmpresa");
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      toast.error("Credenciales incorrectas o error al iniciar sesión");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  const registerCompany = async (data: CompanyRegistration) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/onboarding`, data, {
        withCredentials: true,
      });
      toast.success("Registro exitoso. Bienvenido a HR SYSTEM!");
      router.push("https://back-8cv1.onrender.com/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar la compañía.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post("https://back-8cv1.onrender.com/logout");
      setIsAuthenticated(false);
      setCompany(null);
      toast.info("Sesión cerrada correctamente");
      router.push("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    company,
    registerCompany,
    logout,
    isLoading,
    startLoginRedirect,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
