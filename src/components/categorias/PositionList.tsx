import { Posicion } from "@/types/categorias";
import { Edit, Trash2 } from "lucide-react";
import React from "react";

const MOCK_POSITIONS: Posicion[] = [
  {
    id: "p1",
    name: "Administrador de Sistemas / SysAdmin",
    DepartamentoId: "Tecnología de la Información (TI)",
    description: "$60,000 - $85,000",
  },
  {
    id: "p2",
    name: "Agente de Soporte Técnico",
    DepartamentoId: "Tecnología de la Información (TI)",
    description: "$35,000 - $50,000",
  },
  {
    id: "p3",
    name: "Analista Financiero",
    DepartamentoId: "Finanzas y Contabilidad",
    description: "$50,000 - $70,000",
  },
  {
    id: "p4",
    name: "Asesor Legal / Abogado Corporativo",
    DepartamentoId: "Legal",
    description: "$70,000 - $100,000",
  },
  {
    id: "p5",
    name: "Contador General",
    DepartamentoId: "Finanzas y Contabilidad",
    description: "$55,000 - $75,000",
  },
  {
    id: "p6",
    name: "Desarrollador de Software",
    DepartamentoId: "Tecnología de la Información (TI)",
    description: "$65,000 - $95,000",
  },
];

const PositionList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">
        Posiciones Laborales
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Lista completa de posiciones en la organización
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rango Salarial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleados
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_POSITIONS.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {position.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {position.DepartamentoId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {position.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    5{" "}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 transition">
                      <Edit className="h-5 w-5 cursor-pointer" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 transition">
                      <Trash2 className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionList;
