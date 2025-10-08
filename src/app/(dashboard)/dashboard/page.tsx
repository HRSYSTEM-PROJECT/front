"use client";
import { useEffect, useState } from "react";
import {
  Users,
  CalendarX,
  DollarSign,
  TrendingUp,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  Key,
} from "lucide-react";

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

export default function DashboardPage() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No hay token guardado");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener datos de la empresa");
        const data = await res.json();
        setEmpresa(data);
      } catch (error) {
        console.error("Error al traer empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Cargando datos...</p>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bienvenido al panel de control de{" "}
        <strong>{empresa?.trade_name || "Tu Empresa"}</strong>
      </p>

      <MetricsCards empleados={empleados} />

      {empresa && <PerfilEmpresa empresa={empresa} empleados={empleados} />}
    </div>
  );
}

function MetricsCards({ empleados }: { empleados: Employee[] }) {
  const totalEmpleados = empleados.length;
  const ausenciasMes = 8.5;
  const sueldosTotales = empleados.reduce(
    (acc, emp) => acc + (parseFloat(emp.salary || "0") || 0),
    0
  );
  const productividad = 94.2;

  const cards = [
    { titulo: "Total Empleados", valor: totalEmpleados, icon: Users, color: "text-blue-600" },
    { titulo: "Ausencias del Mes", valor: `${ausenciasMes}%`, icon: CalendarX, color: "text-orange-600" },
    {
      titulo: "Sueldos Totales",
      valor: `$${sueldosTotales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    { titulo: "Productividad", valor: `${productividad}%`, icon: TrendingUp, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{card.titulo}</p>
                <h3 className="text-2xl font-semibold mt-1">{card.valor}</h3>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PerfilEmpresa({ empresa, empleados }: { empresa: Empresa; empleados: Employee[] }) {
  const admins = [
    { id: 1, name: "Admin", last_name: "Principal", email: "admin@techsolutions.com", role: "Super Admin" },
    { id: 2, name: "María", last_name: "Gónzalez", email: "maria.gonzalez@techsolutions.com", role: "Admin" },
  ];

  const Avatar = ({ name }: { name: string }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#083E96] text-white">
        <span className="text-sm font-medium">{initials}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <h2 className="text-2xl sm:text-3xl font-bold mt-10 text-black">Perfil de Empresa</h2>
      <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base">
        Gestiona la información de tu empresa y configuración de administradores
      </p>

      {/* Datos generales */}
      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Building2 className="w-14 h-14 text-blue-600 bg-blue-100 p-4 rounded-md flex-shrink-0" />
          <div>
            <h4 className="text-lg font-medium text-gray-800">{empresa.trade_name}</h4>
            <p className="text-gray-500 text-sm sm:text-base">{empresa.legal_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-x-12 mt-6">
          <InfoItem icon={<Mail />} label="Email" value={empresa.email} />
          <InfoItem icon={<Phone />} label="Teléfono" value={empresa.phone_number || "-"} />
          <InfoItem icon={<MapPin />} label="Dirección" value={empresa.address || "-"} />
          <InfoItem icon={<Users />} label="Empleados" value={`${empleados.length}`} />
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">
          Información de la empresa
        </h3>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nombre Comercial" placeholder={empresa.trade_name} />
            <Input label="Razón Social" placeholder={empresa.legal_name} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Email" placeholder={empresa.email} />
            <Input label="Teléfono" placeholder={empresa.phone_number} />
          </div>

          <Input label="Dirección" placeholder={empresa.address} />

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md transition text-sm"
          >
            <Save className="h-4 w-4" />
            Guardar Cambios
          </button>
        </form>
      </div>

      {/* Administradores */}
      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Administradores</h3>
        {admins.map((admin) => (
          <div key={admin.id} className="flex items-center justify-between border p-4 mb-3 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Avatar name={`${admin.name} ${admin.last_name}`} />
              <div>
                <p className="font-medium text-gray-900">{admin.name} {admin.last_name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">{admin.role}</span>
          </div>
        ))}
        <button className="mt-6 flex items-center gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md">
          <UserPlus className="h-4 w-4" />
          Agregar Administrador
        </button>
      </div>

      {/* Cambio de contraseña */}
      <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Cambiar Contraseña</h3>
        <form className="space-y-4">
          <Input label="Contraseña Actual" type="password" />
          <Input label="Nueva Contraseña" type="password" />
          <Input label="Confirmar Nueva Contraseña" type="password" />
          <button className="mt-2 flex items-center gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md">
            <Key className="h-4 w-4" />
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 text-gray-900 mt-1">{icon}</div>
      <div>
        <h4 className="text-gray-500 text-sm">{label}</h4>
        <p className="text-gray-800 text-sm sm:text-base break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
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