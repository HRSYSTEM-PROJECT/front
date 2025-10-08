"use client";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

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
}

const Inputs = [
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
    placeholder: "Número de teléfono del empleado",
    required: false,
  },
  {
    label: "Dirección",
    name: "address",
    type: "text",
    placeholder: "Dirección del empleado",
    required: false,
  },
  {
    label: "Fecha de Nacimiento",
    name: "birthdate",
    type: "date",
    placeholder: "Fecha de nacimiento del empleado",
    required: false,
  },
  {
    label: "Foto del empleado",
    name: "imgUrl",
    type: "text",
    placeholder: "Foto del empleado",
    required: false,
  },
  {
    label: "Salario",
    name: "salary",
    type: "number",
    placeholder: "Salario del empleado",
    required: false,
  },
  {
    label: "Email *",
    name: "email",
    type: "email",
    placeholder: "Email del empleado",
    required: true,
  },
];

export default function RegistroEmpleadosPage() {
  const [formValues, setFormValues] = useState<FormData>({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formValues,
      dni: Number(formValues.dni),
      salary: formValues.salary
        ? Number(parseFloat(formValues.salary).toFixed(2))
        : undefined,
    };

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("La URL de la API no está definida");
      }

      // 1️⃣ Crear empleado
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "No se pudo parsear la respuesta del servidor" };
      }

      if (!res.ok) throw new Error(data.message || "Error desconocido");

      toast.success("Empleado creado con éxito");
      handleCancel();

      // 2️⃣ Obtener sesión actual del usuario
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });

      const meData = await meRes.json();
      console.log("Usuario logueado:", meData);
    } catch (error: any) {
      console.error("Error al crear empleado:", error);
      toast.error(error.message || "Error al crear empleado");
    }
  };

  const handleCancel = () => {
    setFormValues({
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
    });
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
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Información Personal
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Datos personales del empleado
          </p>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
          onSubmit={handleSubmit}
        >
          {Inputs.map((input) => (
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
                value={formValues[input.name as keyof FormData] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#083E96] focus:border-[#083E96] text-sm"
              />
            </div>
          ))}

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
