export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CompanyRegistration {
  id?: string;
  name: string;
  email: string;
  password: string;
  plan_id: string;
  trade_name: string;
  legal_name: string;
  company_email?: string;
  logo_url?: string;
  phone_number?: string;
  address?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  company: CompanyRegistration | null;
  registerCompany: (data: CompanyRegistration) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  startLoginRedirect: (email: string, password: string) => Promise<void>;
}
