import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 w-full">
      <div className="w-full px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#083E96] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">HR</span>
              </div>
              <span className="text-3xl font-semibold">SYSTEM</span>
            </div>
            <p className="text-gray-500 text-base max-w-md">
              La plataforma integral para la gestión moderna de recursos
              humanos.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-lg">Producto</h3>
            <ul className="space-y-3 text-gray-500 text-base">
              <li className="hover:text-gray-900 cursor-pointer">
                Características
              </li>
              <li className="hover:text-gray-900 cursor-pointer">Precios</li>
              <Link href="/demo" className="hover:text-gray-900 cursor-pointer">Demo</Link>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-lg">Empresa</h3>
            <ul className="space-y-3 text-gray-500 text-base flex flex-col">
              <Link href="/nosotros" className="hover:text-gray-900 cursor-pointer">
                Sobre nosotros
              </Link>
              <Link
                href="/contacto"
                className="hover:text-gray-900 cursor-pointer"
              >
                Contacto
              </Link>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3 text-gray-500 text-base flex flex-col">
              <Link href="/privacidad" className="hover:text-gray-900 cursor-pointer">
                Política de privacidad
              </Link>
              <Link href="/terminos" className="hover:text-gray-900 cursor-pointer">
                Términos de servicio
              </Link>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <p className="text-center text-gray-400 text-sm">
          © 2025 HR SYSTEM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
