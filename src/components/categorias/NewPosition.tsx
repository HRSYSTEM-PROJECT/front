import { getDepartments } from "@/services/DepartamentService";
import { createPosition, PosicionPayload } from "@/services/PositionService";
import { Departmento } from "@/types/categorias";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface NewPositionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const NewPositionForm: React.FC<NewPositionFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      Swal.fire(
        "Atención",
        "El nombre y la descripción son obligatorios.",
        "warning"
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const token = await getToken();

      const payload: PosicionPayload = {
        name: name.trim(),
        description: description.trim(),
      };
      await createPosition(token!, payload);

      Swal.fire("¡Éxito!", "Posición creada correctamente.", "success");
      onSuccess();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Hubo un error al crear la posición.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Crear nuevo puesto
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Complete los datos de la nueva posición laboral.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-4">
          <label className="block">
            <span className="text-gray-700">Nombre de la Posición *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Desarrollador de Software"
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-[#083E96] focus:ring focus:ring-[#083E96] focus:ring-opacity-50"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Descripción *</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción de la posición"
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-[#083E96] focus:ring focus:ring-[#083E96] focus:ring-opacity-50"
              rows={3}
              required
            ></textarea>
          </label>
        </div>
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="bg-[#083E96] text-white px-4 py-2 rounded-md hover:bg-[#0a4ebb] transition font-medium disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Posición"}
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

export default NewPositionForm;
