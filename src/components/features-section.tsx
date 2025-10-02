import { Users, BarChart3, Bell, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Users,
    titulo: "Gestión de Empleados",
    descripcion:
      "Administra perfiles, documentos y datos de tu equipo de forma centralizada y segura.",
    color: "#0d2e63",
    bgColor: "#8FA2C0",
  },
  {
    icon: BarChart3,
    titulo: "Dashboard con Métricas",
    descripcion:
      "Toda la información de tu empresa. Visualiza ausencias, nóminas y categorías en tiempo real.",
    color: "#127a1e",
    bgColor: "#BFE9C4",
  },
  {
    icon: Bell,
    titulo: "Notificaciones Inteligentes",
    descripcion:
      "Recibe alertas automáticas sobre eventos importantes y fechas clave.",
    color: "#863f19",
    bgColor: "#FAB894",
  },
  {
    icon: MessageSquare,
    titulo: "Comunicación interna",
    descripcion:
      "Facilita la colaboración con herramientas de mensajería y anuncios corporativos.",
    color: "#83232f",
    bgColor: "#FA8998",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold mb-8 text-center">
          Todo lo que necesitas para gestionar tu equipo
        </h2>
        <p
          className="text-gray-600 text-center mb-12"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
        >
          Herramientas poderosas diseñadas para simplificar la gestión de
          recursos humanos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg group hover:border-blue-500"
              >
                <Icon
                  className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    color: feature.color,
                    backgroundColor: feature.bgColor,
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                  }}
                />
                <h3 className="text-lg font-semibold mb-2">{feature.titulo}</h3>
                <p className="text-gray-600 text-center">
                  {feature.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
