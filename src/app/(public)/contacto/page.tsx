import { Mail, Phone, MapPin, Clock } from "lucide-react";

const input = [
  {
    name: "Nombre completo",
    type: "text",
    placeholder: "Nombre completo",
    required: true,
  },
  {
    name: "Correo electrónico",
    type: "email",
    placeholder: "Correo electrónico",
    required: true,
  },
  {
    name: "Teléfono",
    type: "tel",
    placeholder: "Teléfono",
    required: true,
  },
  {
    name: "Empresa",
    type: "text",
    placeholder: "Empresa",
    required: false,
  },
  {
    name: "Asunto",
    type: "text",
    placeholder: "¿Cuál es el motivo de tu mensaje?",
    required: true,
  },
  {
    name: "Mensaje",
    type: "textarea",
    placeholder: "Escribe tu mensaje aquí...",
    required: true,
  },
];
const contactData = [
  {
    Icon: Mail,
    title: "Email",
    content: "hrsystemproyecto@gmail.com",
  },
  {
    Icon: Phone,
    title: "Teléfono",
    content: "+54 11 123 456 789",
  },
  {
    Icon: MapPin,
    title: "Oficina",
    content: (
      <>
        Calle falsa 123
        <br />
        Buenos Aires, Argentina
      </>
    ),
  },
  {
    Icon: Clock,
    title: "Horario",
    content: (
      <>
        Lunes a Viernes
        <br />
        9:00 AM – 6:00 PM
      </>
    ),
  },
];
export default function ContactoPage() {
  return (
    <div className="pt-10 pb-20 bg-gray-50">
      <h2 className="text-5xl font-bold mt-10 mb-10 text-center">
        Contáctanos
      </h2>
      <p
        className="text-gray-600 text-center text-xl max-w-3xl mx-auto"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
      >
        ¿Tienes preguntas sobre HR SYSTEM? Estamos aquí para ayudarte. Completa
        el formulario o usa nuestros canales de contacto.
      </p>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-8 mt-10">
          <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Completa el formulario y te responderemos en menos de 24 horas
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {input.slice(0, 4).map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-gray-700 mb-1"
                    >
                      {field.name}
                    </label>
                    <input
                      className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              {input.slice(4, 5).map((field, index) => (
                <div key={index + 4} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-gray-700 mb-1"
                  >
                    {field.name}
                  </label>
                  <input
                    className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              {input.slice(5).map((field, index) => (
                <div key={index + 5} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-gray-700 mb-1"
                  >
                    {field.name}
                  </label>
                  <textarea
                    className="w-full border-b-2 border-gray-200 bg-gray-50 rounded-md p-3 focus:outline-none focus:border-blue-500 transition duration-150"
                    id={field.name}
                    name={field.name}
                    rows={5}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="pt-4 flex justify-center">
                <button
                  className="bg-[#083E96] text-white font-bold px-12 py-3 rounded-md hover:bg-[#0a4ebb] transition duration-300 shadow-lg w-full md:w-auto cursor-pointer"
                  type="submit"
                >
                  Enviar mensaje
                </button>
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Información de contacto
            </h2>
            <div className="space-y-6">
              {contactData.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl p-2 flex items-center justify-center">
                    <item.Icon className="w-6 h-6 text-blue-800" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-600 text-sm">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
