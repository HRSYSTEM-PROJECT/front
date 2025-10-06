"use client";
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { CompanyRegistration, User } from "./AuthContext.type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface FormState extends CompanyRegistration {
  repeatPassword: string;
  acceptedTerms: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  company: CompanyRegistration | null;
  registerCompany: (data: CompanyRegistration) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  startLoginRedirect: (email: string, password: string) => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const VERIFICATION_ENDPOINT = `${API_BASE_URL}/ruta-protegida-valida`;

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       // const response = await axios.get(VERIFICATION_ENDPOINT, {
  //         withCredentials: true,
  //       });
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkSession();
  // }, []);

  const startLoginRedirect = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const token = response.data.token;
      const companyData: CompanyRegistration = response.data.company;
      if (!token || !companyData)
        throw new Error("Respuesta de login inválida.");

      localStorage.setItem("auth_token", token);
      setIsAuthenticated(true);
      router.push("/login");
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      toast.error(
        "Error en inicio de sesión: " +
          (axios.isAxiosError(error) && error.response?.data?.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (data: CompanyRegistration) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/onboarding`, data);

      setIsAuthenticated(true);

      toast.success("Registro exitoso. Bienvenido a HR SYSTEM!");
      router.push("https://back-8cv1.onrender.com/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("El email ya existe, por favor usa otro.");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Error desconocido al registrar la compañía."
          );
        }
      } else {
        toast.error("Error al registrar la compañía.");
      }

      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    router.push("https://back-8cv1.onrender.com/logout");
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    company: null,
    registerCompany,
    logout,
    isLoading,
    startLoginRedirect: startLoginRedirect as (
      email: string,
      password: string
    ) => Promise<void>,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
