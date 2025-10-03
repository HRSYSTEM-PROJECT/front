"use client";

import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function LoginForm() {
  const handleGoogle = () => {
    console.log("Login con Google (simulado)");
  };

  const handleLinkedIn = () => {
    console.log("Login con LinkedIn (simulado)");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {/* Login social */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" />
            Ingresar con Google
          </button>

          <button
            onClick={handleLinkedIn}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaLinkedinIn className="text-blue-600" />
            Ingresar con LinkedIn
          </button>
        </div>

        {/* Links abajo */}
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}