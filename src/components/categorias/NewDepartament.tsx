import { createDepartment } from "@/services/DepartamentService";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface NewDepartmentFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const NewDepartmentForm: React.FC<NewDepartmentFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) {
      Swal.fire(
        "Atención",
        "El Nombre y la Descripción son campos obligatorios.",
        "warning"
      );
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(nombre.trim())) {
      Swal.fire(
        "Atención",
        "El Nombre del Departamento solo debe contener letras y espacios.",
        "warning"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await createDepartment(
        {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        },
        token!
      );

      Swal.fire("¡Éxito!", "Departamento creado correctamente.", "success");
      onSuccess();

      Swal.fire("¡Éxito!", "Departamento creado correctamente.", "success");
      onSuccess();
    } catch (error) {
      console.error(error);
      Swal.fire("Hubo un error al crear el departamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Crear nuevo departamento
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Complete los datos del nuevo departamento
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <label className="block flex-2">
            <span className="text-gray-700 text-sm font-medium">
              Nombre del Departamento *
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Recursos Humanos"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="text-gray-700 text-sm font-medium">Descripción</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Descripción del departamento..."
          />
        </label>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Departamento"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDepartmentForm;
