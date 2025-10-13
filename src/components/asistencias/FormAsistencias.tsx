"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CalendarDays, FileText } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface AsistenciaFormProps {
  id: string;
  onSuccess?: () => void;
}

interface RequestFormData {
  employee_id: string;
  start_date: string;
  end_date: string;
  description: string;
}

export default function AsistenciaForm({ id, onSuccess }: AsistenciaFormProps) {
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<RequestFormData>({
    employee_id: id,
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_date || !formData.end_date) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/absence`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Ausencia registrada correctamente ✅");

      setFormData({
        employee_id: id,
        start_date: "",
        end_date: "",
        description: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      toast.error("Hubo un error al registrar la ausencia ❌");
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarDays size={22} />
        Registrar Ausencia
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Fin *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Motivo o detalles de la ausencia..."
            className="w-full border rounded-xl p-2 focus:outline-none focus:ring focus:ring-blue-200 min-h-[80px]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#083E96] hover:bg-[#0a4ebb]  text-white py-2 px-4 rounded-xl  transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText size={18} />
          Enviar
        </button>
      </form>
    </div>
  );
}
