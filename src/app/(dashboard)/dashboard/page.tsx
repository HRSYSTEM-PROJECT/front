"use client";
import { useEffect, useState } from "react";
import { Users, Building2, Mail, Phone, MapPin, Flag } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import MetricsCards from "@/components/metricas/MetricsCards";
import EmpresaForm from "@/components/actualizacionEmpresa";
import Link from "next/link";
import PagoAceptadoToast from "@/hooks/PagoAceptadoToast";
import { useRouter } from "next/navigation";

export interface Empresa {
  id: string;
  trade_name: string;
  legal_name: string;
  address: string;
  phone_number: string;
  email: string;
  country?: string;
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
  email?: string;
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
  role_id?: string | null;
  employee_id?: string | null;
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
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [adminPrincipal, setAdminPrincipal] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);
  const [otrosAdmins, setOtrosAdmins] = useState<User[]>([]);

  const SUPER_ADMIN_EMAIL = ["superadmin@mail.com"];

  useEffect(() => {
    if (isUserLoaded) {
      const primaryEmail = user?.primaryEmailAddress?.emailAddress;
      if (primaryEmail && SUPER_ADMIN_EMAIL.includes(primaryEmail)) {
        router.replace("/superadmin");
        return;
      }
    }
  }, [isUserLoaded, user, router]);

  const fetchAdmins = async (authToken: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/byCompany`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data: User[] = await res.json();
      setOtrosAdmins(data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user && isUserLoaded) {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      if (primaryEmail && SUPER_ADMIN_EMAIL.includes(primaryEmail)) {
        return;
      }

      return;
    }
    const fetchData = async () => {
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
        setEmpleados(data);
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
        await fetchEmpresa();
        await Promise.all([
          fetchEmpleados(),
          fetchAusencias(),
          fetchAdmins(authToken),
        ]);
      } catch (error) {
        console.error("Fallo al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, isUserLoaded, getToken]);

  if (!isUserLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando autenticación...</p>
      </div>
    );
  }
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  if (primaryEmail && SUPER_ADMIN_EMAIL.includes(primaryEmail)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Redirigiendo a la vista de Super Administrador...</p>
      </div>
    );
  }
  const displayedAdmins: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[] = [];
  const adminIds = new Set();
  const currentEmployeeEmails = new Set(
    empleados.map((e) => e.email?.toLowerCase())
  );
  const superAdminEmail = adminPrincipal?.email.toLowerCase();

  if (adminPrincipal) {
    displayedAdmins.push({
      id: adminPrincipal.id,
      name: adminPrincipal.name,
      email: adminPrincipal.email,
      role: "Super Admin",
    });
    adminIds.add(adminPrincipal.id);
  }

  otrosAdmins.forEach((admin) => {
    const adminEmail = admin.email.toLowerCase();

    if (
      adminEmail !== superAdminEmail &&
      currentEmployeeEmails.has(adminEmail) &&
      !!admin.last_name &&
      !adminIds.has(admin.id)
    ) {
      const fullName = `${admin.first_name || ""} ${
        admin.last_name || ""
      }`.trim();

      displayedAdmins.push({
        id: admin.id,
        name: fullName,
        email: admin.email,
        role: "Admin",
      });
      adminIds.add(admin.id);
    }
  });

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!empresa) {
    return <p>No se encontraron datos de la empresa</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <PagoAceptadoToast />
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
            <Flag className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-gray-500 text-sm">País</h4>
              <p className="text-gray-800 text-sm sm:text-base">
                {empresa.country || "[País de la empresa]"}
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

      <EmpresaForm empresa={empresa} />

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
        <p className="text-gray-500 mb-6 text-sm sm:text-base mt-10 text-center italic">
          Para designar a un empleado como administrador, ve a la vista de
          detalles del{" "}
          <Link href="/empleados" className="font-medium text-[#083E96]">
            empleado
          </Link>{" "}
          y ajusta su rol.
        </p>
      </div>
    </div>
  );
}
