"use client";

import { useEffect, useState } from "react";
import { Usuario } from "../superadmin/page";
import { useAuth } from "@clerk/nextjs";

export default function UsuariosSuperAdmin() {
  const { isLoaded, getToken } = useAuth();
  const [loadingEmpleados, setLoadingEmpleados] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [empleados, setEmpleados] = useState<Usuario[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [errorEmpleados, setErrorEmpleados] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  useEffect(() => {
    if (!isLoaded) return;

    const fetchData = async () => {
      const authToken = await getToken();
      try {
        const resEmpleado = await fetch(`${API_BASE_URL}/empleado`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!resEmpleado.ok)
          throw new Error(
            `Error HTTP: ${resEmpleado.status} (Endpoint: /empleado)`
          );
          const data = await resEmpleado.json();
          setEmpleados(data.data);
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
    };
    fetchData();
  }, [isLoaded, getToken]);

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

  return (
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
  );
}
