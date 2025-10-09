"use client";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
} from "lucide-react";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/components/navigation";
import { Empleado } from "../page";

interface Params {
  params: { id: string };
}

export default function EmpleadoDetailsPage({ params }: Params) {
  const { id } = params;
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [empleadoDetails, setEmpleadoDetails] = useState<Empleado | null>(null);

  const fetchEmpleadoDetails = async () => {
    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("Usuario no autenticado.");
      setLoading(false);
      router.push("/");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/empleado/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEmpleadoDetails(response.data);
    } catch (err: any) {
      console.error("Error al cargar detalles del empleado:", err);

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        localStorage.removeItem("authToken");
        router.push("/");
      } else if (err.response && err.response.status === 404) {
        setError("Empleado no encontrado.");
      } else {
        setError("Error al cargar los detalles.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleadoDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-600">
        Cargando detalles del empleado...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <h1 className="text-xl font-semibold">Error de Carga</h1>
        <p>{error}</p>
      </div>
    );
  }

  const empleado = empleadoDetails as Empleado;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-8 text-black">
            {empleado.first_name} {empleado.last_name}
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base">
            [Puesto o rol del empleado]
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-transparent hover:bg-green-700 text-black hover:text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-300 flex items-center gap-2">
            <Edit className="h-4 w-4" /> Editar
          </button>
          <button className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-100 flex items-center gap-2 ">
            <Trash className="h-4 w-4" /> Eliminar
          </button>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 mt-10 sm:mt-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Información Personal
            </h2>
            <p className="text-gray-500 mb-4">Datos personales del empleado</p>

            <div className="flex flex-col gap-4 text-gray-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-md flex-shrink-0" />
                  <span>{empleado.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-md flex-shrink-0" />
                  <span>{empleado.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-md flex-shrink-0" />
                  <span>{empleado.address}</span>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-10">
                <div className="flex items-center gap-1">
                  <span className="font-medium">DNI:</span>
                  <span>{empleado.dni}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">CUIL:</span>
                  <span>{empleado.cuil}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Fecha de Nacimiento:</span>
                <span>{empleado.birthdate}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Edad:</span>
                <span>{empleado.age}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Acciones Rápidas</h2>
              <div className="flex flex-col gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <CheckCircle className="w-4 h-4" />
                  Marcar Presente
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <XCircle className="w-4 h-4" />
                  Marcar Ausente
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Estado</h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">Estado Actual</span>
                <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-sm">
                  Activo
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Información Laboral
            </h2>
            <p className="text-gray-500 mb-4">
              Datos relacionados con el empleo
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-10 h-10 text-green-600 bg-green-100 p-2 rounded-md flex-shrink-0" />
                <span>
                  Fecha de Ingreso:{" "}
                  {new Date(empleado.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-10 h-10 text-green-600 bg-green-100 p-2 rounded-md flex-shrink-0" />
                <span>Departamento: </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-10 h-10 text-orange-500 bg-orange-100 p-2 rounded-md flex-shrink-0" />
                <span>Salario Mensual: {empleado.salary}</span>
              </div>
              <div className="flex align-center gap-2">
                <span className="font-medium">Tipo de Contrato:</span>
                <span className="font-medium text-gray-700 inline-block w-max">
                  Tiempo Indefinido
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Categoría Laboral:</span>
                <span>Senior</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Estadísticas</h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Asistencia</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Desempeño</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-gray-500">Días trabajados este mes</p>
                <p className="text-2xl font-bold text-gray-800">18 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
