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
  Trash2,
} from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import AsistenciaForm from "@/components/asistencias/FormAsistencias";
import Swal from "sweetalert2";

interface EmpleadoDetails {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  phone_number?: string;
  address?: string;
  birthdate?: string;
  imgUrl?: string;
  position?: string;
  salary?: number;
  createdAt?: string;
  updatedAt?: string;
  email: string;
  age?: number;
  created_at: string;
}

interface Ausencia {
  id: string;
  start_date: string;
  end_date: string;
  description: string;
}

export default function EmpleadoDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = useParams<{ id: string }>();
  const { getToken, isLoaded } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [empleado, setEmpleado] = useState<EmpleadoDetails | null>(null);
  const [ausencias, setAusencias] = useState<Ausencia[]>([]);

  const fetchEmpleadoDetails = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    setError("");

    const authToken = await getToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEmpleado(response.data);
    } catch (err) {
      console.error("Error al cargar detalles del empleado:", err);
    }
  };

  const fetchAusencias = async () => {
    if (!isLoaded) return;
    const authToken = await getToken();

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/absence/employee/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setAusencias(res.data);
    } catch (error) {
      console.error("Error al obtener ausencias:", error);
    }
  };
  const handleMarcarAusente = async () => {
    if (!isLoaded) return;
    const authToken = await getToken();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/absence`,        
        {
          employee_id: id,
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
          description: "Ausencia registrada automáticamente",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Ausencia registrada exitosamente");
      fetchAusencias();
    } catch (error) {
      console.error("Error al registrar ausencia:", error);
      toast.error("Error al registrar la ausencia");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la ausencia permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/absence/${id}`
      );
      setAusencias((prev) => prev.filter((a) => a.id !== id));
      Swal.fire({
        title: "Eliminada",
        text: "La ausencia fue eliminada correctamente ✅",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la ausencia ❌",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (!isLoaded || !id) return;

    const cargarDatos = async () => {
      try {
        await Promise.all([fetchEmpleadoDetails(), fetchAusencias()]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, isLoaded]);

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (!empleado) {
    return <div className="text-center py-10">Empleado no encontrado</div>;
  }

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
              <h2 className="text-lg font-semibold mb-5 text-center">
                Acciones Rápidas
              </h2>
              <div className="flex justify-between mb-4">
                <button className="bg-transparent hover:bg-green-700 text-black hover:text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-300 flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Editar Empleado
                </button>
                <button className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-100 flex items-center gap-2 ">
                  <Trash className="h-4 w-4" /> Eliminar Empleado
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-10">
                <button
                  className="bg-transparent hover:bg-green-700 text-black hover:text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-300 flex items-center gap-2 w-full justify-center"
                  onClick={handleMarcarAusente}
                >
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

          {/* <div className="bg-white rounded-lg shadow p-4">
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
          </div> */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Ausencias
            </h2>
            <div className="flex justify-between gap-6 mt-8">
              <div className="flex-1 p-4 bg-white rounded-lg">
                {ausencias.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">
                    No hay ausencias registradas.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {ausencias.map((a) => (
                      <li
                        key={a.id}
                        className="p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-semibold text-[#083E96]">
                              <span className="mr-2">🗓️</span>
                              {a.start_date === a.end_date
                                ? a.start_date
                                : `${a.start_date} → ${a.end_date}`}
                            </p>
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full mt-2 ${
                                a.description.includes("automáticamente")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {a.description}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="ml-3 hover:text-2xl hover:text-red-600 transition cursor-pointer"
                            title="Eliminar ausencia"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 mt-4">
            <div className="flex-1 max-w-xl">
              <AsistenciaForm id={id} onSuccess={fetchAusencias} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
