"use client";

import { useState } from "react";

export default function RegisterComponent() {
  const [formInput, setFormInput] = useState<{
    trade_name: string;
    legal_name: string;
    email: string;
    username: string;
    password: string;
    repeatPassword: string;
  }>({ trade_name: "", password: "", email: "", legal_name: "", username: "", repeatPassword: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const property = e.target.name;
    setFormInput({ ...formInput, [property]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-black">Crear Empresa</h2>
        <p className="text-gray-500 text-center mb-6">Completa el formulario para comenzar</p>

        <div className="mb-4">
          <label htmlFor="trade_name" className="block text-sm font-medium mb-1 text-black  ">
            Nombre Empresa
          </label>
          <input
            type="text"
            name="trade_name"
            placeholder="Nombre de tu empresa"
            value={formInput.trade_name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="legal_name" className="block text-sm font-medium mb-1 text-black  ">
            Nombre legal de la Empresa
          </label>
          <input
            type="text"
            name="legal_name"
            placeholder="Nombre LEGAL de tu empresa"
            value={formInput.legal_name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-black ">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="tu@empresa.com"
            value={formInput.email}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-black ">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            placeholder="Mínimo 8 caracteres"
            value={formInput.username}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-black ">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={formInput.password}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="repeatPassword" className="block text-sm font-medium mb-1 text-black ">
            Repetir contraseña
          </label>
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repite tu contraseña"
            value={formInput.repeatPassword}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>

        <div className="flex items-start mb-6">
          <input type="checkbox" id="terms" className="mt-1 text-black mr-2" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Acepto los{" "}
            <a href="#" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>{" "}
            y la{" "}
            <a href="#" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Crear Cuenta
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">O REGÍSTRATE CON</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition text-black"
          >
            Google
          </button>
          <button
            type="button"
            className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition text-black"
          >
            LinkedIn
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Inicia Sesión
          </a>
        </p>
      </form>
    </div>
  );
}
