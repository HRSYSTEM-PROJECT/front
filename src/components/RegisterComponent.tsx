"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { CompanyRegistration, Plan } from "@/context/AuthContext.type";
import { useAuth } from "@/hooks/useAuth";

interface FormState extends CompanyRegistration {
  repeatPassword: string;
  acceptedTerms: boolean;
}

const Inputs = [
  {
    label: "Nombre Empresa",
    name: "trade_name",
    type: "text",
    placeholder: "Nombre de tu empresa",
    required: true,
  },
  {
    label: "Nombre legal de la Empresa",
    name: "legal_name",
    type: "text",
    placeholder: "Nombre legal de tu empresa",
    required: true,
  },
  {
    label: "Correo electrónico",
    name: "email",
    type: "email",
    placeholder: "Correo electrónico",
    required: true,
  },
  {
    label: "Nombre de usuario",
    name: "name",
    type: "text",
    placeholder: "Nombre de usuario",
    required: true,
    minLength: 8,
  },
  {
    label: "Número de teléfono",
    name: "phone_number",
    type: "text",
    placeholder: "Número de teléfono",
    required: true,
    minLength: 8,
  },
  {
    label: "Dirección",
    name: "address",
    type: "text",
    placeholder: "Dirección",
    required: true,
    minLength: 8,
  },
  {
    label: "Contraseña",
    name: "password",
    type: "password",
    placeholder: "Mínimo 8 caracteres",
    required: true,
    minLength: 8,
  },
  {
    label: "Repetir contraseña",
    name: "repeatPassword",
    type: "password",
    placeholder: "Repite tu contraseña",
    required: true,
  },
];

export default function RegisterComponent() {
  const { registerCompany, isAuthenticated } = useAuth();
  const router = useRouter();
  const [planes, setPlans] = useState<Plan[]>([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  const [formInput, setFormInput] = useState<FormState>({
    trade_name: "",
    legal_name: "",
    email: "",
    name: "",
    phone_number: "",
    address: "",
    plan_id: "",
    password: "",
    repeatPassword: "",
    acceptedTerms: false,
    logo_url: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsPlansLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/plan`
        );
        setPlans(response.data);
      } catch (err) {
        console.error("Error fetching planes:", err);
      } finally {
        setIsPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formInput.acceptedTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    if (formInput.password !== formInput.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const requiredFields: (keyof FormState)[] = [
      "trade_name",
      "legal_name",
      "email",
      "name",
      "phone_number",
      "address",
      "plan_id",
      "password",
    ];

    for (let field of requiredFields) {
      if (!formInput[field]) {
        setError("Por favor, complete todos los campos requeridos.");
        return;
      }
    }

    const registrationData = {
      trade_name: formInput.trade_name,
      legal_name: formInput.legal_name,
      email: formInput.email,
      name: formInput.name,
      phone_number: formInput.phone_number,
      address: formInput.address,
      plan_id: formInput.plan_id,
      password: formInput.password,
      logo_url:
        formInput.logo_url ||
        "https://www.shutterstock.com/es/search/image-not-found-icon",
    };

    try {
      await registerCompany(registrationData);
    } catch (err) {
      console.error("Error al registrar la empresa:", err);
      setError("Error al registrar la empresa");
    }
  };

  const getInputClass = (name: keyof FormState, type?: string) => {
    if (type === "checkbox") return "mt-1 mr-2";
    const hasError = error && !formInput[name];
    return `w-full border rounded-lg px-3 py-2 focus:ring-2 outline-none placeholder-gray-300 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-200 mb-10"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Crear Empresa
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Completa el formulario para comenzar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Inputs.map((input) => (
            <div className="mb-4" key={input.name}>
              <label
                htmlFor={input.name}
                className="block text-sm font-medium mb-1 text-black"
              >
                {input.label}
              </label>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={
                  input.type === "checkbox"
                    ? undefined
                    : (formInput[input.name as keyof FormState] as string)
                }
                checked={
                  input.type === "checkbox"
                    ? (formInput[input.name as keyof FormState] as boolean)
                    : undefined
                }
                onChange={handleInputChange}
                className={getInputClass(
                  input.name as keyof FormState,
                  input.type
                )}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="plan_id" className="block mb-1 font-medium">
            Plan
          </label>
          {isPlansLoading ? (
            <p>Cargando planes...</p>
          ) : (
            <select
              name="plan_id"
              id="plan_id"
              value={formInput.plan_id}
              onChange={(e) =>
                setFormInput({ ...formInput, plan_id: e.target.value })
              }
              required
              className="border p-2 w-full rounded"
            >
              <option value="" className="text-gray-500">
                Selecciona un plan
              </option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            id="terms"
            name="acceptedTerms"
            checked={formInput.acceptedTerms}
            onChange={handleInputChange}
            className={getInputClass("acceptedTerms", "checkbox")}
          />
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

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

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
          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white transition"
          >
            <FaGoogle className="w-5 h-5 mr-3 text-red-500" /> Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white transition"
          >
            <FaLinkedinIn className="w-5 h-5 mr-3 text-blue-600" /> LinkedIn
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Inicia Sesión
          </a>
        </p>
      </form>
    </div>
  );
}
