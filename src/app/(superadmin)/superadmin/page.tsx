"use client";
import { CreditCard, DollarSign, FileText, User2, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export interface Empresa {
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

export interface Usuario {
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

export interface Distribucion {
  nombre: string;
  cantidad: number;
  porcentaje: string;
  totalIngresos: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
}

export interface Suscripcion {
  company_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  plan?: Plan;
  id: string;
}
export default function DashboardSuperAdmin() {
  const { isLoaded, getToken } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [empleados, setEmpleados] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [totalIngresos, setTotalIngresos] = useState(0);

  const [distribucionData, setDistribucionData] = useState<Distribucion[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchMasterData = async () => {
      try {
        const authToken = await getToken();
        const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (!API_BASE_URL)
          throw new Error("NEXT_PUBLIC_BACKEND_API_URL no está definida.");
        if (!authToken) throw new Error("Token no obtenido.");

        const empresasRes = await fetch(`${API_BASE_URL}/empresa`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!empresasRes.ok)
          throw new Error(`Error HTTP ${empresasRes.status} en /empresa`);
        const empleadosRes = await fetch(`${API_BASE_URL}/empleado`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const empresasData = await empresasRes.json();
        console.log(empresasData);

        const usersRes = await fetch(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const usersData = await usersRes.json();
        setUsers(usersData || []);

        if (!empleadosRes.ok)
          throw new Error(`Error HTTP ${empleadosRes.status} en /empleado`);

        const subsRes = await fetch(`${API_BASE_URL}/suscripciones`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const empleadosData = await empleadosRes.json();
        console.log(empleadosData);

        if (!subsRes.ok)
          throw new Error(`Error HTTP ${subsRes.status} en /suscripciones`);
        const plansRes = await fetch(`${API_BASE_URL}/plan`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const suscripcionesData = await subsRes.json();
        console.log(suscripcionesData);

        if (!plansRes.ok)
          throw new Error(`Error HTTP ${plansRes.status} en /plan`);
        const planes = await plansRes.json();
        console.log(planes);

        setEmpresas(empresasData || []);
        setEmpleados(empleadosData || []);
        setSuscripciones(suscripcionesData || []);
        const planDetails = planes.reduce(
          (acc: Record<string, Plan>, p: Plan) => ({ ...acc, [p.id]: p }),
          {}
        );

        let totalIngresosCalculado = 0;
        const conteo: Record<string, number> = {};

        suscripcionesData.forEach((s: Suscripcion) => {
          const planInfo: Plan | undefined = s.plan || planDetails[s.plan_id];
          if (planInfo) {
            conteo[planInfo.id] = (conteo[planInfo.id] || 0) + 1;
            const price = parseFloat(planInfo.price);
            if (!isNaN(price)) totalIngresosCalculado += price;
          }
        });

        setTotalIngresos(totalIngresosCalculado);

        const totalSuscripciones = suscripcionesData.length;
        const distribucion: Distribucion[] = Object.values(
          planDetails as Record<string, Plan>
        )
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
        console.error("❌ Error al cargar datos:", error);
        setError("Error al cargar datos del panel de superadministrador.");
        setSuscripciones([]);
      } finally {
        setLoadingSubscriptions(false);
      }
    };

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
