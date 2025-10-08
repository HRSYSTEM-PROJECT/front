"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarX, DollarSign, TrendingUp, CalendarDays } from "lucide-react";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  salary?: string;
  estado?: string;
  ausencias?: number;
}

export default function DashboardPage() {
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleado`);
        const data = await response.json();

        // Adaptar los datos reales del backend a lo que necesita el Dashboard
        const empleadosAdaptados = data.map((emp: any) => ({
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          salary: emp.salary,
          // Datos simulados hasta que el backend los provea
          estado: "Activo",
          ausencias: Math.floor(Math.random() * 5),
        }));

        setEmpleados(empleadosAdaptados);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Cargando datos...</p>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bienvenido al panel de control de <strong>HR SYSTEM</strong>
      </p>

      <MetricsCards empleados={empleados} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEmployees empleados={empleados} />
        <UpcomingEvents />
      </div>
    </div>
  );
}

function MetricsCards({ empleados }: { empleados: Employee[] }) {
  const totalEmpleados = empleados.length;
  const ausenciasMes = 8.5; // simulación
  const sueldosTotales = empleados.reduce((acc, emp) => acc + (parseFloat(emp.salary || "0") || 0), 0);
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

function RecentEmployees({ empleados }: { empleados: Employee[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Empleados Recientes</h2>
        <Link href="/empleados" className="text-blue-600 text-sm font-medium hover:underline">
          Ver todos
        </Link>
      </div>

      <ul className="space-y-3">
        {empleados.slice(0, 5).map((emp) => (
          <li key={emp.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">
                {emp.first_name} {emp.last_name}
              </p>
              <span className="text-gray-500 text-sm">Empleado</span>

              {/* <span className="text-gray-500 text-sm">{emp.puesto}</span> */}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                emp.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {emp.estado}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================= */
/* 🔹 COMPONENTE PRÓXIMOS EVENTOS     */
/* ================================= */
function UpcomingEvents() {
  const eventos = [
    { id: 1, titulo: "Revisión de Desempeño - Equipo IT", fecha: "15 Ene", categoria: "Evaluación" },
    { id: 2, titulo: "Pago de Nómina", fecha: "18 Ene", categoria: "Finanzas" },
    { id: 3, titulo: "Capacitación: Liderazgo", fecha: "22 Ene", categoria: "Formación" },
    { id: 4, titulo: "Reunión Trimestral", fecha: "25 Ene", categoria: "Reunión" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Próximos Eventos</h2>
      <ul className="space-y-3">
        {eventos.map((evento) => (
          <li key={evento.id} className="flex items-center gap-3 border-b pb-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">{evento.titulo}</p>
              <p className="text-sm text-gray-500">
                {evento.fecha} — {evento.categoria}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
