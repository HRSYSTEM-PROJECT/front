import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#083E96] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">HR</span>
              </div>
              <span className="text-2xl font-semibold">SYSTEM</span>
            </div>
            <p className="text-gray-500 text-sm">
              La plataforma integral para la gestión moderna de recursos
              humanos.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Producto</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-gray-900 cursor-pointer">
                Características
              </li>
              <li className="hover:text-gray-900 cursor-pointer">Precios</li>
              <li className="hover:text-gray-900 cursor-pointer">Demo</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Empresa</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-gray-900 cursor-pointer">
                Sobre nosotros
              </li>
              <li className="hover:text-gray-900 cursor-pointer">Contacto</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-gray-900 cursor-pointer">
                Política de privacidad
              </li>
              <li className="hover:text-gray-900 cursor-pointer">
                Términos de servicio
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <p className="text-center text-gray-400 text-sm">
          © 2025 HR SYSTEM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
