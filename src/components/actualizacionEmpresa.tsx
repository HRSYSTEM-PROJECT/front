"use client";
import { useState } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import { Empresa } from "@/app/(dashboard)/dashboard/page";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EmpresaForm({ empresa }: { empresa: Empresa }) {
  const [formData, setFormData] = useState({
    trade_name: empresa.trade_name || "",
    legal_name: empresa.legal_name || "",
    address: empresa.address || "",
    phone_number: empresa.phone_number || "",
    email: empresa.email || "",
    logo: empresa.logo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { value: confirm } = await Swal.fire({
      title: "¿Confirmar cambios?",
      html: `
        <div style="text-align:left; font-size:14px;">
          <p><strong>Nombre legal:</strong> ${formData.legal_name}</p>
          <p><strong>Nombre comercial:</strong> ${formData.trade_name}</p>
          <p><strong>Teléfono:</strong> ${formData.phone_number}</p>
          <p><strong>Dirección:</strong> ${formData.address}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#083E96",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm) return;

    try {
      const res = await axios.patch(
        `${API_URL}/empresa/${empresa.id}`,
        formData
      );
      console.log("Respuesta:", res.data);

      await Swal.fire({
        title: "¡Cambios guardados!",
        text: "La información de la empresa fue actualizada correctamente.",
        icon: "success",
        confirmButtonColor: "#083E96",
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar los datos.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
      <h2 className="text-lg sm:text-xl font-medium text-gray-800">
        Información de {empresa.legal_name}
      </h2>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Actualiza los datos de tu empresa para mantener la información al día.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="legal_name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre de la Empresa *
            </label>
            <input
              id="legal_name"
              value={formData.legal_name}
              onChange={handleChange}
              placeholder="[Nombre de la empresa]"
              className="border border-gray-300 text-gray-500 rounded-md px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="trade_name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre Comercial
            </label>
            <input
              id="trade_name"
              value={formData.trade_name}
              onChange={handleChange}
              placeholder="[Nombre comercial de la empresa]"
              className="border border-gray-300 text-gray-500 rounded-md px-3 py-2 w-full text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="[Email de la empresa]"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div> */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone_number"
              className="text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="[Teléfono de la empresa]"
              className="border border-gray-300 text-gray-500 rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Dirección
            </label>
            <input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="[Dirección de la empresa]"
              className="border border-gray-300 text-gray-500 rounded-md px-3 py-2 w-full"
            />
          </div>

          {/* <div className="flex flex-col gap-2">
            <label htmlFor="logo" className="text-sm font-medium text-gray-700">
              Logo (URL)
            </label>
            <input
              id="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="[URL del logo]"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div> */}
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-md transition text-sm sm:text-base cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
