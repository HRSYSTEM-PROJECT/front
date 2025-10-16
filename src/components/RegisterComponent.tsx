"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const toast = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
};

interface FormState {
  trade_name: string;
  legal_name: string;
  email: string;
  name: string;
  phone_number: string;
  address: string;
  plan_id: string;
  password: string;
  repeatPassword: string;
  acceptedTerms: boolean;
  logo_url: string;
}

export default function RegisterComponent() {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

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
    setIsSubmitting(true);

    const password = formInput.password.trim();
    const repeatPassword = formInput.repeatPassword.trim();

    if (!formInput.acceptedTerms) {
      setError("Debes aceptar los términos y condiciones.");
      setIsSubmitting(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      setIsSubmitting(false);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula y un número."
      );
      setIsSubmitting(false);
      return;
    }
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/onboarding`;

      const payload = {
        trade_name: formInput.trade_name,
        legal_name: formInput.legal_name,
        email: formInput.email,
        password: formInput.password,
        logo_url:
          formInput.logo_url ||
          "https://placehold.co/100x100/333/fff?text=Logo",
        phone_number: formInput.phone_number,
        address: formInput.address,
        name: formInput.name,
      };

      const res = await axios.post(apiUrl, payload);
      toast.success("Usuario y empresa registrados correctamente 🎉");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            JSON.stringify(err.response?.data) ||
            "Error del servidor"
        );
      } else {
        setError("Error al registrar la empresa.");
      }
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error del servidor");
      } else {
        setError("Error al registrar la empresa.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-screen flex justify-center items-center mt-10 mb-10 p-5">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#083E96] mb-6">
          Crear cuenta y empresa
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-2 gap-12 w-full">
            <div className="">
              <fieldset className="space-y-3">
                <legend className="font-semibold text-center text-gray-800 border-b pb-1">
                  Datos del administrador
                </legend>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formInput.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formInput.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formInput.password}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(true);
                      setTimeout(() => setShowPassword(false), 3000);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    name="repeatPassword"
                    placeholder="Repetir contraseña"
                    value={formInput.repeatPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowRepeatPassword(true);
                      setTimeout(() => setShowRepeatPassword(false), 3000);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showRepeatPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </fieldset>
            </div>
            <div>
              <fieldset className="space-y-3">
                <legend className="font-semibold text-center text-gray-800 border-b pb-1">
                  Datos de la empresa
                </legend>
                <input
                  type="text"
                  name="trade_name"
                  placeholder="Nombre comercial"
                  value={formInput.trade_name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="legal_name"
                  placeholder="Razón social"
                  value={formInput.legal_name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={formInput.address}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Teléfono"
                  value={formInput.phone_number}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </fieldset>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formInput.acceptedTerms}
              onChange={handleInputChange}
              className="mr-2 mt-10"
            />
            <label
              htmlFor="acceptedTerms"
              className="text-lg text-gray-700 mt-10"
            >
              He leído y acepto los{" "}
              <a href="/terminos" className="text-[#083E96]">
                términos
              </a>{" "}
              y{" "}
              <a href="/privacidad" className="text-[#083E96]">
                condiciones
              </a>
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-100 py-3 rounded-lg cursor-pointer font-semibold mt-10 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#083E96] hover:bg-[#063070] text-white"
              }`}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta y empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
