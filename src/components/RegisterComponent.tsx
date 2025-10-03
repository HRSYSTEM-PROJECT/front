"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function RegisterComponent() {
  const [formInput, setFormInput] = useState<{
    trade_name: string;
    legal_name: string;
    email: string;
    name: string;
    password: string;
    repeatPassword: string;
    phone_number: string;
    address: string;
    plan_id: string;
  }>({
    trade_name: "",
    password: "",
    email: "",
    legal_name: "",
    name: "",
    repeatPassword: "",
    phone_number: "",
    address: "",
    plan_id: "",
  });

  const [errors, setErrors] = useState<{ formError?: string }>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormInput({
      ...formInput,
      [name]: value,
    });
  };

  interface RegisterCompany {
    name: string;
    password: string;
    email: string;
    legal_name: string;
    trade_name: string;
    phone_number: string;
    address: string;
  }

  const sendRegister = async (registerData: RegisterCompany) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding`, registerData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formInput.trade_name ||
      !formInput.legal_name ||
      !formInput.email ||
      !formInput.password ||
      !formInput.repeatPassword
    ) {
      setErrors({ formError: "Faltan campos" });
      return;
    }

    setErrors({});
    try {
      await sendRegister(formInput);
      alert("Usuario registrado con éxito ✅");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        alert("Error al registrar al usuario ❌");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mb-10">
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
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-black ">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="name"
            placeholder="Mínimo 8 caracteres"
            value={formInput.name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number" className="block text-sm font-medium mb-1 text-black ">
            Numero de telefono
          </label>
          <input
            type="text"
            name="phone_number"
            placeholder="Mínimo 8 caracteres"
            value={formInput.phone_number}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-1 text-black ">
            Dirección
          </label>
          <input
            type="text"
            name="address"
            placeholder="Mínimo 8 caracteres"
            value={formInput.address}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="plan_id" className="block text-sm font-medium mb-1 text-black">
            Selecciona un plan
          </label>
          <select
            name="plan_id"
            value={formInput.plan_id}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Selecciona un plan --</option>
            <option value="c3856a72-620a-403c-a7c3-3858e78e1595">Plan Free</option>
            <option value="2a4ffeeb-b28e-43c1-9fbc-5159a13be057">Plan Premium</option>
            <option value="20d7d1de-1820-42bb-b2b2-3577e84725b1">Plan Enterprise</option>
          </select>
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
            <Link href="/terminos" className="text-blue-600 hover:underline">
              términos y condiciones
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="text-blue-600 hover:underline">
              política de privacidad
            </Link>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#083E96] text-white font-semibold py-2 rounded-lg hover:bg-[#0a4ebb] transition"
        >
          Crear Cuenta
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">O REGÍSTRATE CON</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex space-x-4 w-full justify-center mb-10">
          <button className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white cursor-pointer transition duration-150 ease-in-out">
            <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
            Google
          </button>

          <button className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white cursor-pointer transition duration-150 ease-in-out">
            <FaLinkedinIn className="w-5 h-5 mr-3 text-blue-600" />
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
