"use client";
import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  Key,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import MetricsCards from "@/components/metricas/MetricsCards";

interface Empresa {
  id: string;
  trade_name: string;
  legal_name: string;
  address: string;
  phone_number: string;
  email: string;
  logo?: string;
  created_at?: string;
  token?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  salary?: string;
  estado?: string;
  ausencias?: number;
}

export interface Ausencia {
  id: number;
  employee_id: number;
  date: string;
  reason: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string | null;
}

const Avatar = ({ name }: { name: string }) => {
  const names = name.split(" ");
  const initials = names
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  const colors = "bg-[#083E96] text-white";

  return (
    <div
      className={`flex items-center justify-center h-10 w-10 rounded-full ${colors} flex-shrink-0`}
    >
      <span className="text-sm font-medium">{initials}</span>
    </div>
  );
};

export default function DashboardPage() {
  const { isLoaded, getToken } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [adminPrincipal, setAdminPrincipal] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [salarioTotal, setSalarioTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) {
        return;
      }

      setLoading(true);
      const authToken = await getToken();

      if (!authToken) {
        console.error("No se pudo obtener el token de autenticación.");
        setLoading(false);
        return;
      }

      const fetchEmpresa = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) {
          console.error(`Fallo de solicitud de empresa: ${res.status}`);
          throw new Error("Error al cargar datos de la empresa.");
        }

        const data = await res.json();
        if (data && data.user && data.user.company) {
          setEmpresa(data.user.company);
        }
        if (data && data.user) {
          const fullName = `${data.user.first_name || ""} ${
            data.user.last_name || ""
          }`.trim();
          setAdminPrincipal({
            id: data.user.id,
            name: fullName,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
          });
        }
      };
      const fetchEmpleados = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) {
          console.error(`Fallo de solicitud de empleados: ${res.status}`);
          throw new Error("Error al cargar datos de empleados.");
        }

        const data: Employee[] = await res.json();

        const total = data.reduce((sum, empleado) => {
          const salarioNumerico = empleado.salary
            ? parseFloat(empleado.salary)
            : 0;
          return sum + salarioNumerico;
        }, 0);
        setEmpleados(data);
        setSalarioTotal(total);
      };

      const fetchAusencias = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/absence`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok)
          throw new Error(`Fallo de solicitud de ausencias: ${res.status}`);
        const data = await res.json();
        setAusencias(data);
      };

      try {
        await Promise.all([fetchEmpresa(), fetchEmpleados(), fetchAusencias()]);
      } catch (error) {
        console.error("Fallo al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded, getToken]);

  const displayedAdmins = [];

  if (adminPrincipal) {
    displayedAdmins.push({
      id: adminPrincipal.id,
      name: adminPrincipal.name,
      email: adminPrincipal.email,
      role: "Super Admin",
    });
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!empresa) {
    return <p>No se encontraron datos de la empresa</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Gestiona la información de{" "}
        <strong className="font-bold">{empresa.legal_name}</strong> y
        configuración de administradores
      </p>

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Building2 className="w-14 h-14 text-blue-600 bg-blue-100 p-4 rounded-md flex-shrink-0" />
          <div>
            <h4 className="text-lg font-medium text-gray-800 break-words">
              {empresa.legal_name}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 sm:gap-x-12 mt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Email</h4>
              <p className="text-gray-800 text-sm sm:text-base break-words">
                {empresa.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Teléfono</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                {empresa.phone_number || "[Teléfono de la empresa]"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Dirección</h4>
              <p className="text-gray-800 text-sm sm:text-base break-words">
                {empresa.address || "[Dirección de la empresa]"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Empleados</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                {empleados.length}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Fecha de creación</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                {empresa.created_at
                  ? new Date(empresa.created_at).toLocaleDateString()
                  : "[Fecha de creación]"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <MetricsCards empleados={empleados} ausencias={ausencias} />

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <h2 className="text-lg sm:text-xl font-medium text-gray-800">
          Información de {empresa.legal_name}
        </h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Actualiza los datos de tu empresa para mantener la información al día.
        </p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700"
              >
                Nombre de la Empresa *
              </label>
              <input
                placeholder={`${
                  empresa.legal_name || "[Nombre de la empresa]"
                }`}
                id="companyName"
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="industry"
                className="text-sm font-medium text-gray-700"
              >
                Industria
              </label>
              <input
                placeholder="[Industria de la empresa]"
                id="industry"
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="companyEmail"
                className="text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                placeholder={`${empresa.email || "[Email de la empresa]"}`}
                id="companyEmail"
                type="email"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="companyPhone"
                className="text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                placeholder={`${
                  empresa.phone_number || "[Teléfono de la empresa]"
                }`}
                id="companyPhone"
                type="tel"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Dirección
              </label>
              <input
                placeholder={`${
                  empresa.address || "[Dirección de la empresa]"
                }`}
                id="address"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="taxId"
                  className="text-sm font-medium text-gray-700"
                >
                  CUIT
                </label>
                <input
                  placeholder="[CUIT de la empresa]"
                  id="taxId"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md transition text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            Guardar Cambios
          </button>
        </form>
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <h2 className="text-lg font-medium text-gray-800">Administradores</h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Gestiona los usuarios con acceso administrativo
        </p>
        {displayedAdmins.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar name={`${admin.name}`} />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {admin.name}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
            <span className="mt-2 sm:mt-0 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md self-start sm:self-auto">
              {admin.role}
            </span>
          </div>
        ))}

        <h2 className="text-lg font-medium text-gray-800 mt-10">
          Agregar nuevo administrador
        </h2>
        <button className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md transition text-sm sm:text-base">
          <UserPlus className="h-4 w-4" />
          Agregar Administrador
        </button>
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <h2 className="text-lg font-medium text-gray-800">
          Cambiar Contraseña
        </h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Actualiza tu contraseña de acceso.
        </p>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña Actual *
            </label>
            <input
              id="currentPassword"
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700"
            >
              Nueva Contraseña *
            </label>
            <input
              id="newPassword"
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar Nueva Contraseña *
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>
        </form>

        <button className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md transition text-sm sm:text-base">
          <Key className="h-4 w-4" />
          Actualizar Contraseña
        </button>
      </div>
    </div>
  );
}
