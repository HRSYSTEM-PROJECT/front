"use client";
import { CreditCard, DollarSign, FileText, User2, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface Empresa {
  id?: string;
  trade_name: string;
  legal_name: string;
  address: string;
  phone_number: string;
  email: string;
  logo: string;
  created_at: string;
  update_at: string;
}

interface Usuario {
  id: string;
  role_id: string;
  employee_id: string;
  company_id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Distribucion {
  nombre: string;
  cantidad: number;
  porcentaje: string;
  totalIngresos: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
}

interface Suscripcion {
  company_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  plan?: Plan;
  id: string;
}

const getInitials = (name: string): string => {
  if (!name) return "";

  const parts = name.split(" ").filter((p) => p.length > 0);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function DashboardSuperAdmin() {
  const { isLoaded, getToken } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [empleados, setEmpleados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorEmpleados, setErrorEmpleados] = useState<string | null>(null);
  const [loadingEmpleados, setLoadingEmpleados] = useState(true);

  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [totalIngresos, setTotalIngresos] = useState(0);

  const [distribucionData, setDistribucionData] = useState<Distribucion[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    async function fetchMasterData() {
      const authToken = await getToken();
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

      if (!API_BASE_URL) {
        const configError =
          "Error: La variable NEXT_PUBLIC_BACKEND_API_URL no está definida.";
        setError(configError);
        setErrorUsers(configError);
        setLoading(false);
        setLoadingUsers(false);
        setLoadingSubscriptions(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/empresa`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok)
          throw new Error(`Error HTTP: ${res.status} (Endpoint: /empresa)`);
        setEmpresas(await res.json());
      } catch (err) {
        console.error("Error al cargar las empresas:", err);
      } finally {
        setLoading(false);
      }

      try {
        const resEmpleado = await fetch(`${API_BASE_URL}/empleado`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!resEmpleado.ok)
          throw new Error(
            `Error HTTP: ${resEmpleado.status} (Endpoint: /empleado)`
          );
        setEmpleados(await resEmpleado.json());
      } catch (err) {
        console.error("Error al cargar los empleados:", err);
      } finally {
        setLoadingEmpleados(false);
      }

      try {
        const resUser = await fetch(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!resUser.ok)
          throw new Error(`Error HTTP: ${resUser.status} (Endpoint: /user)`);
        setUsers(await resUser.json());
      } catch (err) {
        console.error("Error al cargar los usuarios:", err);
      } finally {
        setLoadingUsers(false);
      }

      try {
        const [subsRes, plansRes] = await Promise.all([
          fetch(`${API_BASE_URL}/suscripciones`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`${API_BASE_URL}/plan`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        if (!subsRes.ok || !plansRes.ok) {
          const status = !subsRes.ok ? subsRes.status : plansRes.status;
          throw new Error(
            `Error al cargar suscripciones o planes. HTTP Status: ${status}`
          );
        }

        const suscripcionesData: Suscripcion[] = await subsRes.json();
        const planes: Plan[] = await plansRes.json();

        setSuscripciones(suscripcionesData);

        let totalIngresosCalculado = 0;
        const conteo: Record<string, number> = {};

        const planDetails: Record<string, Plan> = planes.reduce(
          (acc, p) => ({ ...acc, [p.id]: p }),
          {}
        );

        suscripcionesData.forEach((s) => {
          const planInfo = s.plan || planDetails[s.plan_id];

          if (planInfo) {
            conteo[planInfo.id] = (conteo[planInfo.id] || 0) + 1;
            const price = parseFloat(planInfo.price);
            if (!isNaN(price)) {
              totalIngresosCalculado += price;
            }
          }
        });

        setTotalIngresos(totalIngresosCalculado);

        const totalSuscripciones = suscripcionesData.length;

        const distribucion: Distribucion[] = planes
          .map((plan) => {
            const cantidad = conteo[plan.id] || 0;
            const porcentaje = totalSuscripciones
              ? (cantidad / totalSuscripciones) * 100
              : 0;

            const totalIngresosPlan = cantidad * parseFloat(plan.price || "0");

            return {
              nombre: plan.name,
              cantidad,
              porcentaje: porcentaje.toFixed(1),
              totalIngresos: totalIngresosPlan.toFixed(2),
            };
          })
          .sort((a, b) => b.cantidad - a.cantidad);

        setDistribucionData(distribucion);
      } catch (error) {
        console.error("Error al cargar datos de suscripciones:", error);
        setSuscripciones([]);
      } finally {
        setLoadingSubscriptions(false);
      }
    }

    fetchMasterData();
  }, [isLoaded, getToken]);
  const cards = [
    {
      titulo: "Empresas",
      valor: empresas.length,
      icon: FileText,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      titulo: "Usuarios",
      valor: users.length,
      icon: User2,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      titulo: "Empleados",
      valor: empleados.length,
      icon: Users,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      titulo: "Suscripciones",
      valor: suscripciones.length,
      icon: CreditCard,
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      titulo: "Ingresos por Suscripciones",
      valor: `$${totalIngresos.toFixed(2)}`,
      icon: DollarSign,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const renderUsersTableStatus = () => {
    if (loadingUsers)
      return (
        <p className="text-center py-4 text-blue-600">Cargando usuarios...</p>
      );
    if (errorUsers)
      return <p className="text-center py-4 text-red-600">⚠️ {errorUsers}</p>;
    if (users.length === 0)
      return (
        <p className="text-center py-4 text-gray-500">
          No hay usuarios registrados.
        </p>
      );
  };

  const renderEmpleadosTableStatus = () => {
    if (loadingEmpleados)
      return (
        <p className="text-center py-4 text-blue-600">Cargando empleados...</p>
      );
    if (errorEmpleados)
      return (
        <p className="text-center py-4 text-red-600">⚠️ {errorEmpleados}</p>
      );
    if (empleados.length === 0)
      return (
        <p className="text-center py-4 text-gray-500">
          No hay empleados registrados.
        </p>
      );
  };

  const renderEmpresasTable = () => {
    if (loading) {
      return (
        <p className="text-center py-4 text-blue-600">Cargando empresas...</p>
      );
    }

    if (error) {
      return <p className="text-center py-4 text-red-600">⚠️ {error}</p>;
    }

    if (empresas.length === 0) {
      return (
        <p className="text-center py-4 text-gray-500">
          No hay empresas registradas.
        </p>
      );
    }
  };

  const renderDistribucionStatus = () => {
    if (loadingSubscriptions)
      return (
        <p className="text-center py-4 text-blue-600">
          Cargando distribución de planes...
        </p>
      );
    if (distribucionData.length === 0)
      return (
        <p className="text-center py-4 text-gray-500">
          No hay datos de suscripciones para mostrar la distribución.
        </p>
      );
    return null;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-start max-w-full overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold">
        Panel de Super Administrador
      </h1>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Gestión completa del sistema HR SYSTEM.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const valor =
            card.titulo === "Total Empresas"
              ? empresas.length
              : card.titulo === "Total Usuarios"
              ? users.length
              : card.valor;
          return (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-700 text-sm sm:text-base font-normal">
                  {card.titulo}
                </h2>

                <div className={`p-2 rounded-lg ${card.iconBgColor}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <p className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">
                {valor}
              </p>
            </div>
          );
        })}
      </div>

      {/*----------------------- Empresas---------------------- */}
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
          Empresas Registradas
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Gestión de todas las empresas registradas en el sistema
        </p>

        {renderEmpresasTable()}

        {empresas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Comercial
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empresas.map((empresa) => (
                  <tr
                    key={empresa.id || empresa.email}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 min-w-[32px] sm:min-w-[40px] bg-blue-50 border border-blue-200 rounded-lg mr-3 sm:mr-4">
                          <span className="text-xs sm:text-sm font-semibold text-blue-600">
                            {getInitials(empresa.trade_name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            {empresa.trade_name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {empresa.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {empresa.phone_number}
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {empresa.created_at
                        ? new Date(empresa.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*----------------------- Usuarios y Empleados------------------ */}
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
          Gestión de Usuarios y Empleados
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Usuarios y empleados registrados en el sistema.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg sm:text-xl mb-3 text-[#083E96] text-center">
              Usuarios Registrados ({users.length})
            </h3>

            {renderUsersTableStatus && renderUsersTableStatus()}

            {users.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Registro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-indigo-50/50">
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 p-4 border rounded-lg">
                No hay usuarios registrados.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl mb-3 text-[#083E96] text-center">
              Empleados Registrados ({empleados.length})
            </h3>

            {renderEmpleadosTableStatus && renderEmpleadosTableStatus()}

            {empleados.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Registro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {empleados.map((empleado) => (
                      <tr key={empleado.id} className="hover:bg-emerald-50/50">
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          {empleado.first_name} {empleado.last_name}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {empleado.email}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {new Date(empleado.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 p-4 border rounded-lg">
                No hay empleados registrados.
              </p>
            )}
          </div>
        </div>
      </div>

      {/*---------------- Distribución de Planes -----------------*/}
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100 mt-8 w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          Distribución de Planes
        </h2>

        {renderDistribucionStatus()}

        {distribucionData.length > 0 && (
          <>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Empresas por tipo de suscripción
            </p>
            <div className="space-y-3 sm:space-y-4">
              {distribucionData.map((plan) => (
                <div key={plan.nombre}>
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <span>{plan.nombre}</span>
                    <span>
                      {plan.cantidad} ({plan.porcentaje}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${plan.porcentaje}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    Ingresos: ${plan.totalIngresos}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
