// <<<<<<< HEAD
// import EmployeeTable from "@/components/empleados/employeetable";

// export default function EmpleadoPage() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Empleados</h1>
//       <p className="mb-4 text-gray-600">
//         Gestiona y visualiza todos los empleados de la empresa
//       </p>
//       <EmployeeTable />
// =======
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface Empleado {
  id: number;
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  phone_number?: string;
  address?: string;
  birthdate?: string;
  imgUrl?: string;
  salary?: string;
  email: string;
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
{/* >>>>>>> 67e655a (Add form de registroEmpleados y conexión con Back) */}
    </div>
  );
};

export default function EmpleadoPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/empleado`
      );
      setEmpleados(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const busquedaLower = search.toLowerCase();
    return (
      empleado.last_name.toLowerCase().includes(busquedaLower) ||
      empleado.dni.toString().toLowerCase().includes(busquedaLower)
    );
  });

  const Busqueda = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-start">
        <h1 className="text-3xl font-bold mt-4 sm:mt-8 text-black">
          Empleados
        </h1>
        <p className="mt-8 text-center text-lg">
          Cargando lista de empleados...
        </p>
      </div>
    );
  }
  if (empleados.length === 0 && !error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-start">
        <h1 className="text-3xl font-bold mt-4 sm:mt-8 text-black">
          Empleados
        </h1>
        <p className="mt-8 text-center text-lg text-gray-600">
          No hay empleados registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 text-start">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mt-4 sm:mt-8 text-black">
            Empleados
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <p className="text-gray-600 mt-3 sm:mt-5">
            Gestiona y visualiza todos los empleados de la empresa
          </p>
        </div>
        <Link
          href="/registroEmpleados"
          className="text-sm text-white font-medium rounded bg-[#083E96] hover:bg-[#0a4ebb] p-3 cursor-pointer transition"
        >
          <UserPlus className="inline-block mr-1" />
          Nuevo empleado
        </Link>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-10 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="relative flex items-center w-full md:w-auto flex-grow h-11">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Busqueda />
            </div>
            <input
              type="text"
              placeholder="Buscar por APELLIDO o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm h-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h4 className="text-lg font-semibold mb-6">
          Lista de Empleados ({empleados.length})
        </h4>
        <div className="border border-gray-300" />

        {empleadosFiltrados.map((empleado) => (
          <div
            key={empleado.id}
            className="flex justify-between items-center mb-4 p-4 border-b border-gray-200"
          >
            <div className=" hover:bg-gray-50 rounded transition">
              <div className="flex items-center space-x-3">
                <Avatar name={`${empleado.first_name} ${empleado.last_name}`} />
                <div>
                  <p className="font-medium text-gray-900">
                    {empleado.first_name} {empleado.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{empleado.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4 font-medium text-gray-700 text-sm">
                <div>
                  <span className="font-bold">DNI: </span>
                  {empleado.dni}
                </div>
                <div>
                  <span className="font-bold">CUIL: </span>
                  {empleado.cuil}
                </div>
                {/* <div>
                  <span className="font-bold">Teléfono: </span>
                  {empleado.phone_number || "N/A"}
                </div>
                <div>
                  <span className="font-bold">Nacimiento: </span>
                  {empleado.birthdate || "N/A"}
                </div>
                <div>
                  <span className="font-bold">Salario: </span>
                  {empleado.salary
                    ? `$${Number(empleado.salary).toLocaleString("es-AR")}`
                    : "N/A"}
                </div> */}
              </div>
            </div>
            <div className="text-sm text-white font-medium rounded bg-[#083E96] hover:bg-[#0a4ebb] p-3 cursor-pointer transition">
              <Link href={`/empleados/${empleado.id}`}>Ver Detalles</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
