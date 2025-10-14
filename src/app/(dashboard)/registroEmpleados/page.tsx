"use client";

import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface FormData {
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
  department_id: string;
  position_id: string;
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

interface FormattedData extends Omit<FormData, "dni" | "salary"> {
  dni: number;
  salary?: number;
}

export default function RegistroEmpleadosPage() {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    dni: "",
    cuil: "",
    phone_number: "",
    email: "",
    imgUrl: "",
    salary: "",
    department_id: "",
    position_id: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) {
        return;
      }

      const token = await getToken();
      if (!token) {
        console.error(
          "ERROR-DEBUG: No se pudo obtener el token para cargar departamentos/puestos."
        );
        return;
      }
      const authConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const [depRes, posRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/departamento`,
            authConfig
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/position`,
            authConfig
          ),
        ]);

        if (!depRes.ok) {
          throw new Error("Fallo en la carga de departamentos.");
        }
        if (!posRes.ok) {
          throw new Error("Fallo en la carga de puestos.");
        }        
        const depData = await depRes.json();
        const posData = await posRes.json();
        if (Array.isArray(depData)) setDepartments(depData);
        if (Array.isArray(posData)) setPositions(posData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    
    fetchData();
  }, [isLoaded, user, getToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      first_name: "",
      last_name: "",
      dni: "",
      cuil: "",
      phone_number: "",
      address: "",
      birthdate: "",
      imgUrl: "",
      salary: "",
      email: "",
      department_id: "",
      position_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Error: Usuario no autenticado. Inicie sesión de nuevo.");
      return;
    }

    const token = await getToken();
    if (!token) {
      toast.error("Error: No se pudo obtener el token de autenticación.");
      return;
    }

    const formattedData: FormattedData = {
      ...formData,
      dni: Number(formData.dni),
      salary: formData.salary
        ? Number(parseFloat(formData.salary).toFixed(2))
        : undefined,
    };

    Object.keys(formattedData).forEach((key) => {
      if (
        formattedData[key as keyof FormattedData] === "" ||
        formattedData[key as keyof FormattedData] === undefined
      ) {
        delete formattedData[key as keyof FormattedData];
      }
    });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Error ${res.status}: Falló la creación del empleado.`
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Empleado registrado",
        text: "El empleado se registró correctamente 🎉",
        confirmButtonColor: "#083E96",
        confirmButtonText: "Ver empleados",
      });
      handleCancel();
      router.push("/empleados");
    } catch (error) {
      console.error("ERROR-CATCH:", error);
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Ocurrió un error al registrar el empleado.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 text-start">
      <h1 className="text-3xl font-bold mt-4 sm:mt-8 text-black">
        Registro de Empleados
      </h1>
      <p className="text-gray-600 mt-3 sm:mt-5">
        Complete el siguiente formulario para registrar un nuevo empleado.
      </p>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
          onSubmit={handleSubmit}
        >
          {[
            {
              label: "Nombre *",
              name: "first_name",
              type: "text",
              placeholder: "Nombre del empleado",
              required: true,
            },
            {
              label: "Apellido *",
              name: "last_name",
              type: "text",
              placeholder: "Apellido del empleado",
              required: true,
            },
            {
              label: "DNI *",
              name: "dni",
              type: "number",
              placeholder: "DNI del empleado",
              required: true,
            },
            {
              label: "CUIL *",
              name: "cuil",
              type: "text",
              placeholder: "CUIL del empleado",
              required: true,
            },
            {
              label: "Número de Teléfono",
              name: "phone_number",
              type: "text",
              placeholder: "Número de teléfono",
            },
            {
              label: "Dirección",
              name: "address",
              type: "text",
              placeholder: "Dirección del empleado",
            },
            {
              label: "Fecha de Nacimiento",
              name: "birthdate",
              type: "date",
              placeholder: "Fecha de nacimiento",
            },
            {
              label: "Foto del empleado",
              name: "imgUrl",
              type: "text",
              placeholder: "URL de la foto",
            },
            {
              label: "Salario",
              name: "salary",
              type: "number",
              placeholder: "Salario del empleado",
              min: "0",
            },
            {
              label: "Email *",
              name: "email",
              type: "email",
              placeholder: "Email del empleado",
              required: true,
            },
          ].map((input) => (
            <div key={input.name} className="flex flex-col">
              <label
                htmlFor={input.name}
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {input.label}
              </label>
              <input
                id={input.name}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                required={input.required}
                value={formData[input.name as keyof FormData] || ""}
                onChange={handleChange}
                min={input.min}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#083E96] focus:border-[#083E96] text-sm"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label
              htmlFor="department_id"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Departamento *
            </label>
            <select
              id="department_id"
              name="department_id"
              required
              value={formData.department_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#083E96] focus:border-[#083E96] text-sm"
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((dep, index) => (
                <option key={index} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="position_id"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Puesto *
            </label>
            <select
              id="position_id"
              name="position_id"
              required
              value={formData.position_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#083E96] focus:border-[#083E96] text-sm"
            >
              <option value="">Seleccione un puesto</option>
              {positions.map((pos, index) => (
                <option key={index} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white rounded-md cursor-pointer shadow-md transition-colors flex items-center justify-center"
            >
              <UserPlus className="inline w-5 h-5 mr-2" />
              Registrar Empleado
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md cursor-pointer shadow-md transition-colors flex items-center justify-center"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
