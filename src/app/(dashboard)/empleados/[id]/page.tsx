"use client";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Edit,
  Trash,
  Trash2,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import AsistenciaForm from "@/components/asistencias/FormAsistencias";
import Swal from "sweetalert2";
import ActualizarEmpleados from "@/components/actualizarEmpleados";

interface DepartmentInfo {
  id: string;
  nombre: string;
  descripcion: string;
}

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
  position_id: string;
  department: DepartmentInfo;
  department_id: string;
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

interface Department {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Position {
  id: string;
  name: string;
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
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

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

  const fetchPositions = async (authToken: string) => {
    try {
      const posRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/position`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (Array.isArray(posRes.data)) setPositions(posRes.data);
    } catch (error) {
      console.error("Error al obtener puestos:", error);
    }
  };

  const fetchDepartments = async (authToken: string) => {
    try {
      const depRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/departamento`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (Array.isArray(depRes.data)) setDepartments(depRes.data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
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
      const authToken = await getToken();
      if (!authToken) {
        console.error("Error: No se pudo obtener el token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        await Promise.all([
          fetchEmpleadoDetails(),
          fetchAusencias(),
          fetchPositions(authToken),
          fetchDepartments(authToken),
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, isLoaded, getToken]);

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (!empleado) {
    return <div className="text-center py-10">Empleado no encontrado</div>;
  }
  const currentPosition = positions.find(
    (pos) => pos.id === empleado.position_id
  );
  const currentDepartment = departments.find(
    (dep) => dep.id === empleado.department_id
  );
  const departmentName = empleado.department?.nombre || "No asignado";

  const handleDesignarAdmin = async () => {
    if (!isLoaded || !empleado) return;

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/;
    const validationMessage =
      "La contraseña debe tener un mínimo de 12 caracteres, incluyendo al menos una mayúscula, una minúscula y un número.";

    const { value: adminPassword, isConfirmed: passwordConfirmed } =
      await Swal.fire({
        title: "Confirma tu Contraseña",
        text: `Para confirmar a ${empleado.first_name} ${empleado.last_name} como Administrador, ingresa tu contraseña.`,
        input: "password",
        inputPlaceholder: "Ingresa tu contraseña",
        inputAttributes: {
          maxlength: "50",
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
        confirmButtonColor: "#083E96",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      });

    if (!passwordConfirmed) {
      return;
    }

    if (!adminPassword || adminPassword.trim() === "") {
      toast.error("Debes ingresar tu contraseña para confirmar.");
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar designación?",
      text: `¿Estás seguro de que deseas designar a ${empleado.first_name} ${empleado.last_name} como Administrador?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#083E96",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, designar",
      cancelButtonText: "Cancelar",

      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar tu contraseña.";
        }
        if (!PASSWORD_REGEX.test(value)) {
          return validationMessage;
        }
        return null;
      },
    });

    if (!result.isConfirmed) return;

    const authToken = await getToken();
    const payload = {
      employee_id: empleado.id,
      email: empleado.email,
      password: adminPassword,
      first_name: empleado.first_name,
      last_name: empleado.last_name,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(
        `¡${empleado.first_name} ${empleado.last_name} ha sido designado como Administrador!`
      );
    } catch (err) {
      console.error("Error al designar como administrador:", err);
      toast.error("Hubo un error al intentar designar como administrador.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmpleado = async (empleadoId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al empleado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const authToken = await getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado/${empleadoId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      Swal.fire({
        title: "Eliminado",
        text: "El empleado fue eliminado correctamente ✅",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/empleados");
      setEmpleado(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar al empleado ❌",
        icon: "error",
      });
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-8 text-black">
            {empleado.first_name} {empleado.last_name}
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base">
            {departmentName}
          </p>
        </div>
        <div>
          <button
            onClick={handleDesignarAdmin}
            disabled={loading}
            className="bg-[#083E96] hover:bg-[#0a4ebb] disabled:bg-gray-400 text-white py-2 px-4 rounded-lg cursor-pointer transition duration-150 ease-in-out"
          >
            {loading ? "Procesando..." : "Designar como Administrador"}
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
                  <span>{empleado.address || "No informado"}</span>
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
                <span>{empleado.birthdate || "No informado"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Edad:</span>
                <span>{empleado.age || "No informado"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-5 text-center">
                Acciones Rápidas
              </h2>
              <div className="flex justify-between mb-4">
                {/* <button
                  onClick={() => setIsEditing(true)}
                  className="bg-transparent hover:bg-green-700 text-black hover:text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-300 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" /> Editar Empleado
                </button> */}

                <button
                  className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg cursor-pointer border border-gray-100 flex items-center gap-2 "
                  onClick={() => handleDeleteEmpleado(empleado.id!)}
                >
                  <Trash className="h-4 w-4" /> Eliminar Empleado
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
                <span>Departamento: {departmentName}</span>
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
      {isEditing && empleado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <ActualizarEmpleados
            empleado={empleado}
            departments={departments}
            positions={positions}
            onClose={() => setIsEditing(false)}
            onUpdate={fetchEmpleadoDetails}
          />
        </div>
      )}
    </div>
  );
}
