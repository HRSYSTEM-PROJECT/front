import FormContact from "@/components/form-contact";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
          <FormContact />
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
