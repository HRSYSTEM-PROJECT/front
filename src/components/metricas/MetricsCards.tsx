import { Users, CalendarX, DollarSign, TrendingUp } from "lucide-react";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  salary?: string;
  estado?: string;
  ausencias?: number;
}

export default function MetricsCards({
  empleados,
  ausencias,
}: {
  empleados: Employee[];
  ausencias: any[];
}) {
  const totalEmpleados = empleados.length;
  const ausenciasMes = ausencias.length;
  const sueldosTotales = empleados.reduce(
    (acc, emp) => acc + (parseFloat(emp.salary || "0") || 0),
    0
  );
  // const productividad = 94.2;

  const cards = [
    {
      titulo: "Total Empleados",
      valor: totalEmpleados,
      icon: Users,
      color: "text-blue-600",
    },
    {
      titulo: "Total Ausencias",
      valor: ausenciasMes,
      icon: CalendarX,
      color: "text-orange-600",
    },
    {
      titulo: "Sueldos Totales",
      valor: `$${sueldosTotales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    // {
    //   titulo: "Productividad",
    //   valor: `${productividad}%`,
    //   icon: TrendingUp,
    //   color: "text-emerald-600",
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
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
