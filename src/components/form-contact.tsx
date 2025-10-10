"use client";
import {useState} from "react";
import {toast} from "react-toastify";

const input = [
  {
    label: "Nombre Completo",
    name: "nombreCompleto",
    type: "text",
    placeholder: "Nombre completo",
    required: true,
  },
  {
    label: "Correo electrónico",
    name: "correoElectronico",
    type: "email",
    placeholder: "Correo electrónico",
    required: true,
  },
  {
    label: "Teléfono",
    name: "telefono",
    type: "tel",
    placeholder: "Teléfono",
    required: true,
  },
  {
    label: "Empresa",
    name: "empresa",
    type: "text",
    placeholder: "Empresa",
    required: true,
  },
  {
    label: "Asunto",
    name: "asunto",
    type: "text",
    placeholder: "¿Cuál es el motivo de tu mensaje?",
    required: true,
  },
  {
    label: "Mensaje",
    name: "mensaje",
    type: "textarea",
    placeholder: "Escribe tu mensaje aquí...",
    required: true,
  },
];

export default function FormContact() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    telefono: "",
    empresa: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Mensaje enviado correctamente");
        setFormData({
          nombreCompleto: "",
          correoElectronico: "",
          telefono: "",
          empresa: "",
          asunto: "",
          mensaje: "",
        });
      } else {
        toast.error(data.message || "Ocurrió un error al enviar el mensaje");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
      console.error("Error enviando el formulario:", error);
    }
  };

  return (
    <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Envíanos un mensaje</h2>
        <p className="text-sm text-gray-600 mt-1">Completa el formulario y te responderemos en menos de 24 horas</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {input.slice(0, 4).map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {input.slice(4, 5).map((field, index) => (
          <div key={index + 4} className="flex flex-col">
            <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 mb-1">
              {field.name}
            </label>
            <input
              className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
              type={field.type}
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
            />
          </div>
        ))}
        {input.slice(5).map((field, index) => (
          <div key={index + 5} className="flex flex-col">
            <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 mb-1">
              {field.name}
            </label>
            <textarea
              className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
              id={field.name}
              name={field.name}
              rows={5}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="pt-4 flex justify-center">
          <button
            className="bg-[#083E96] text-white font-bold px-12 py-3 rounded-md hover:bg-[#0a4ebb] transition duration-300 shadow-lg w-full md:w-auto cursor-pointer"
            type="submit"
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </form>
    </div>
  );
}
