"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", { email, password });
    //     // Más adelante: fetch/axios al backend para autenticar
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 transition"
          >
            Entrar
          </button>
        </form>

        {/* Link de registro */}
        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
}
