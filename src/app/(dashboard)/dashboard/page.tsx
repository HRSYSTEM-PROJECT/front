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
import MetricsCards from "@/components/metricas/MetricsCards";

interface Empresa {
  id: number;
  trade_name: string;
  legal_name: string;
  address: string;
  phone_number: string;
  email: string;
  logo?: string;
  created_at?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  salary?: string;
  estado?: string;
  ausencias?: number;
}

const admins = [
  {
    id: 1,
    name: "Admin",
    last_name: "Principal",
    email: "admin@techsolutions.com",
    role: "Super Admin",
  },
  {
    id: 2,
    name: "María",
    last_name: "Gónzalez",
    email: "maria.gonzalez@techsolutions.com",
    role: "Admin",
  },
];

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
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Error al obtener empresa:", res.status);
          return;
        }

        const data = await res.json();
        console.log("Datos de la empresa:", data);
        setEmpresa(data);
      } catch (error) {
        console.error("Error al traer empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!empresa) return <p>No se encontraron datos de la empresa</p>;
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Gestiona la información de{" "}
        <strong className="font-bold">
          {empresa?.trade_name || "Tu Empresa"}
        </strong>{" "}
        y configuración de administradores
      </p>

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Building2 className="w-14 h-14 text-blue-600 bg-blue-100 p-4 rounded-md flex-shrink-0" />
          <div>
            <h4 className="text-lg font-medium text-gray-800 break-words">
              {empresa?.trade_name || "[Nombre de la empresa]"}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 sm:gap-x-12 mt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Email</h4>
              <p className="text-gray-800 text-sm sm:text-base break-words">
                {empresa?.email || "[Email de la empresa]"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Teléfono</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                {empresa?.phone_number || "[Teléfono de la empresa]"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Dirección</h4>
              <p className="text-gray-800 text-sm sm:text-base break-words">
                {empresa?.address || "[Dirección de la empresa]"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">Empleados</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                [Cantidad de empleados]
              </p>
            </div>
          </div>
        </div>
      </div>

      <MetricsCards empleados={empleados} />

      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <h2 className="text-lg sm:text-xl font-medium text-gray-800">
          Información de {empresa?.trade_name || "[Nombre de la empresa]"}
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
                  empresa?.trade_name || "[Nombre de la empresa]"
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
                placeholder={`${empresa?.email || "[Email de la empresa]"}`}
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
                  empresa?.phone_number || "[Teléfono de la empresa]"
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
                  empresa?.address || "[Dirección de la empresa]"
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

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar name={`${admin.name} ${admin.last_name}`} />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {admin.name} {admin.last_name}
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 text-gray-900 mt-1">{icon}</div>
      <div>
        <h4 className="text-gray-500 text-sm">{label}</h4>
        <p className="text-gray-800 text-sm sm:text-base break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
      />
    </div>
  );
}
