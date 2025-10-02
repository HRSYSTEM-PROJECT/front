"use client";

import { useState } from "react";

export default function RegisterComponent() {
  const [formInput, setFormInput] = useState<{
    name: string;
    lastName: string;
    company: string;
    email: string;
    password: string;
    repeatPassword: string;
  }>({ name: "", password: "", email: "", lastName: "", company: "", repeatPassword: "" });

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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-black  ">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              placeholder="Juan"
              value={formInput.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-black ">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Perez"
              value={formInput.lastName}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="company" className="block text-sm font-medium mb-1 text-black  ">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            placeholder="Nombre de tu empresa"
            value={formInput.company}
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
