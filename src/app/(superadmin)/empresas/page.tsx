"use client";

import { useEffect, useState } from "react";
import { Empresa } from "../superadmin/page";
import { useAuth } from "@clerk/nextjs";

const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function EmpresasSuperAdmin() {
  const { isLoaded, getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchEmpresas = async () => {
      const authToken = await getToken();
      try {
        if (!authToken) {
          throw new Error("No se pudo obtener el token de autenticación");
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empresa`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!res.ok)
          throw new Error(`Error HTTP: ${res.status} (Endpoint: /empresa)`);

        const data = await res.json();
        setEmpresas(data);
      } catch (err) {
        console.error("Error al cargar las empresas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [isLoaded, getToken]);

  const renderEmpresasTable = () => {
    if (loading)
      return (
        <p className="text-center py-4 text-blue-600">Cargando empresas...</p>
      );

    if (error)
      return <p className="text-center py-4 text-red-600">⚠️ {error}</p>;

    if (empresas.length === 0)
      return (
        <p className="text-center py-4 text-gray-500">
          No hay empresas registradas.
        </p>
      );

    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
        Empresas Registradas ({empresas.length})
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
  );
}
