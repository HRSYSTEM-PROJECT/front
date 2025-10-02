import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-[#BFE9C4] text-[#0E6922] text-sm px-4 py-1 font-semibold rounded-full mb-4">
            <span className="font-bold text-lg">•</span> Plataforma líder en
            gestión de RRHH
          </span>

          <h1 className="text-4xl md:text-7xl font-bold text-black leading-tight mb-4 mt-10">
            Gestiona tus Recursos Humanos de manera
            <span className="text-[#083E96]"> fácil y profesional</span>
          </h1>

          <p
            className="text-gray-600 text-lg md:text-2xl mb-8 mx-auto max-w-5xl mt-15"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
          >
            Optimiza la administración de tu equipo con nuestra plataforma
            integral. Centraliza empleados, sueldos, asistencias y
            notificaciones{" "}
            <span className="text-[#083E96]">en un solo lugar.</span>
          </p>

          <div className="flex justify-center flex-wrap gap-20 mt-20">
            <Link
              href="/register"
              className="bg-[#083E96] hover:bg-[#0a4ebb] text-white px-6 py-3 rounded-md shadow-md  transition-colors cursor-pointer"
            >
              Comenzar ahora &rarr;
            </Link>
            <Link
              href="/demo"
              className="border border-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-[#0E6922] hover:text-white transition-colors cursor-pointer"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <PricingSection />

      <div className="bg-[#083E96] text-white text-center py-6 mt-20 h-100">
        <h3 className="text-2xl md:text-5xl font-bold text-white leading-tight mt-10">
          ¿Listo para transformar tu gestión de RRHH?
        </h3>
        <p className="text-white text-lg md:text-xl mb-20 mx-auto max-w-5xl mt-15">
          Únete a cientos de empresas que ya confían en HR SYSTEM para gestionar
          su talento humano
        </p>
        <Link
          href="/register"
          className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow-md hover:bg-[#0E6922] hover:text-white transition-colors"
        >
          Empieza gratis
        </Link>
      </div>
    </>
  );
}
