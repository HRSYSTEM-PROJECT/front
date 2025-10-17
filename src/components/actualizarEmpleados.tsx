"use client";
import React, { useState } from "react";
import axios, { isAxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

interface EditableEmpleadoDetails {
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  phone_number?: string | null;
  address?: string | null;
  birthdate?: string | null;
  imgUrl?: string | null;
  salary?: number | string | null;
  email: string;
  department_id?: string;
  position_id: string;
}

interface EditEmployeeFormProps {
  empleado: EditableEmpleadoDetails & { id: string; position_id: string };
  departments: { id: string; nombre: string }[];
  positions: { id: string; name: string }[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function ActualizarEmpleados({
  empleado,
  departments,
  positions,
  onClose,
  onUpdate,
}: EditEmployeeFormProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EditableEmpleadoDetails>({
    first_name: empleado.first_name,
    last_name: empleado.last_name,
    dni: empleado.dni,
    cuil: empleado.cuil,
    phone_number: empleado.phone_number || "",
    address: empleado.address || "",
    birthdate: empleado.birthdate || "",
    imgUrl: empleado.imgUrl || "",
    salary:
      empleado.salary === null || empleado.salary === undefined
        ? 0
        : empleado.salary,
    email: empleado.email,
    department_id: empleado.department_id || "",
    position_id: empleado.position_id || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const CLEAN_STRING_FIELDS = ["dni", "cuil"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = await getToken();

      const keysToInclude: (keyof EditableEmpleadoDetails)[] = [
        "first_name",
        "last_name",
        "dni",
        "cuil",
        "phone_number",
        "address",
        "birthdate",
        "imgUrl",
        "salary",
        "email",
        "department_id",
        "position_id",
      ];

      const payload: Record<string, string | number> = {};

      keysToInclude.forEach((key) => {
        const value = formData[key];

        if (value === null || value === undefined) {
          return;
        }

        if (key === "salary") {
          const salaryValue =
            typeof value === "string" ? parseFloat(value) : (value as number);

          if (!isNaN(salaryValue) && salaryValue !== 0) {
            payload[key] = salaryValue;
          }
        } else if (typeof value === "string") {
          const trimmedValue = value.trim();

          if (trimmedValue !== "") {
            if (CLEAN_STRING_FIELDS.includes(key)) {
              payload[key] = trimmedValue.replace(/[-.\s]/g, "");
            } else {
              payload[key] = trimmedValue;
            }
          }
        } else {
          payload[key] = value;
        }
      });

      if (Object.keys(payload).length === 0) {
        toast.info("No se detectaron cambios para actualizar.");
        setLoading(false);
        return;
      }

      console.log("Payload Final Enviado:", payload);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado/${empleado.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("Empleado actualizado exitosamente 🎉");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar empleado:", err);
      if (isAxiosError(err) && err.response?.data) {
        const errorMessage =
          (err.response.data as { message?: string }).message ||
          (err.response.status === 403
            ? "Acceso Denegado. Verifique permisos."
            : "Error interno del servidor.");
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("Error al actualizar el empleado.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Actualizar Empleado
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Apellido"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        <input
          type="text"
          name="phone_number"
          value={formData.phone_number || ""}
          onChange={handleChange}
          placeholder="Teléfono (ej: +54 9 11 9876-5432)"
          className="p-2 border border-gray-300 rounded w-full"
        />

        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Dirección"
          className="p-2 border border-gray-300 rounded w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="DNI"
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            placeholder="CUIL (ej: 20-12345678-0)"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex gap-4 items-center">
          <label className="text-gray-600 flex-shrink-0">F. Nacimiento:</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <input
          type="number"
          name="salary"
          value={formData.salary ? String(formData.salary) : "0"}
          onChange={handleChange}
          placeholder="Salario Mensual"
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        <select
          name="department_id"
          value={formData.department_id || ""}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Selecciona Departamento</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.nombre}
            </option>
          ))}
        </select>

        <select
          name="position_id"
          value={formData.position_id}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Selecciona Posición</option>
          {positions.map((pos) => (
            <option key={pos.id} value={pos.id}>
              {pos.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
