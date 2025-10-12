// "use client";

// import axios from "axios";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
// import { CompanyRegistration, Plan } from "@/context/AuthContext.type";
// import { toast } from "react-toastify";

// interface FormState extends CompanyRegistration {
//   repeatPassword: string;
//   acceptedTerms: boolean;
// }

// interface RegisterProps {
//   userId: string | null;
// }

// const Inputs = [
//   {
//     label: "Nombre Empresa",
//     name: "trade_name",
//     type: "text",
//     placeholder: "Nombre de tu empresa",
//     required: true,
//   },
//   {
//     label: "Nombre legal de la Empresa",
//     name: "legal_name",
//     type: "text",
//     placeholder: "Nombre legal de tu empresa",
//     required: true,
//   },
//   {
//     label: "Correo electrónico",
//     name: "email",
//     type: "email",
//     placeholder: "Correo electrónico",
//     required: true,
//   },
//   {
//     label: "Número de teléfono",
//     name: "phone_number",
//     type: "text",
//     placeholder: "Número de teléfono",
//     required: true,
//     minLength: 8,
//   },
//   {
//     label: "Dirección",
//     name: "address",
//     type: "text",
//     placeholder: "Dirección",
//     required: true,
//     minLength: 8,
//   },
//   {
//     label: "Nombre de usuario",
//     name: "name",
//     type: "text",
//     placeholder: "Nombre de usuario",
//     required: false,
//   },
//   {
//     label: "Contraseña",
//     name: "password",
//     type: "password",
//     placeholder: "12 caracteres, una mayúscula, una minúscula y un número",
//     required: true,
//     minLength: 12,
//   },
//   {
//     label: "Repetir contraseña",
//     name: "repeatPassword",
//     type: "password",
//     placeholder: "Repite tu contraseña",
//     required: true,
//   },
// ];

// export default function RegisterComponent({ userId }: RegisterProps) {
//   const [planes, setPlans] = useState<Plan[]>([]);
//   const [isPlansLoading, setIsPlansLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formInput, setFormInput] = useState<FormState>({
//     trade_name: "",
//     legal_name: "",
//     email: "",
//     name: "",
//     phone_number: "",
//     address: "",
//     plan_id: "",
//     password: "",
//     repeatPassword: "",
//     acceptedTerms: false,
//     logo_url: "",
//   });

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       setIsPlansLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/plan`
//         );
//         setPlans(response.data);
//       } catch (err) {
//         console.error("Error fetching planes:", err);
//       } finally {
//         setIsPlansLoading(false);
//       }
//     };
//     fetchPlans();
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormInput((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);
//     if (!userId) {
//       setError(
//         "El usuario no está autenticado. Por favor, inicie sesión o regístrese."
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     if (!formInput.acceptedTerms) {
//       setError("Debes aceptar los términos y condiciones");
//       setIsSubmitting(false);
//       return;
//     }
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

//     if (!passwordRegex.test(formInput.password)) {
//       setError(
//         "La contraseña debe tener al menos 12 caracteres, incluir una mayúscula, una minúscula y un número."
//       );
//       setIsSubmitting(false);
//       return;
//     }
//     if (formInput.password !== formInput.repeatPassword) {
//       setError("Las contraseñas no coinciden");
//       setIsSubmitting(false);
//       return;
//     }
//     const requiredFields: (keyof FormState)[] = [
//       "trade_name",
//       "legal_name",
//       "email",
//       "phone_number",
//       "address",
//       "plan_id",
//       "password",
//     ];

//     for (const field of requiredFields) {
//       if (!formInput[field]) {
//         setError("Por favor, complete todos los campos requeridos.");
//         setIsSubmitting(false);
//         return;
//       }
//     }

//     const registrationData = {
//       trade_name: formInput.trade_name,
//       legal_name: formInput.legal_name,
//       address: formInput.address,
//       phone_number: formInput.phone_number,
//       email: formInput.email,
//       user_clerk_id: userId,
//       plan_id: formInput.plan_id,
//       // password: formInput.password,
//       logo: "https://placehold.co/100x100/333/fff?text=Logo",
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empresa`,
//         registrationData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Registro exitoso:", response.data);
//       toast.success(
//         "Empresa registrada con éxito. Redirigiendo a Dashboard..."
//       );
//       // router.push('/dashboard');
//     } catch (err) {
//       console.error("Error al registrar la empresa:", err);
//       if (axios.isAxiosError(err) && err.response) {
//         setError(
//           `Error del servidor: ${
//             err.response.data.message || err.response.statusText
//           }`
//         );
//       } else {
//         setError("Error al registrar la empresa. Intente nuevamente.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError(null);

//   //   if (!formInput.acceptedTerms) {
//   //     setError("Debes aceptar los términos y condiciones");
//   //     return;
//   //   }
//   //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

//   //   if (!passwordRegex.test(formInput.password)) {
//   //     setError(
//   //       "La contraseña debe tener al menos 12 caracteres, incluir una mayúscula, una minúscula y un número."
//   //     );
//   //     return;
//   //   }
//   //   if (formInput.password !== formInput.repeatPassword) {
//   //     setError("Las contraseñas no coinciden");
//   //     return;
//   //   }
//   //   const requiredFields: (keyof FormState)[] = [
//   //     "trade_name",
//   //     "legal_name",
//   //     "email",
//   //     "phone_number",
//   //     "address",
//   //     "plan_id",
//   //     "password",
//   //   ];

//   //   for (const field of requiredFields) {
//   //     if (!formInput[field]) {
//   //       setError("Por favor, complete todos los campos requeridos.");
//   //       return;
//   //     }
//   //   }
//   //   const registrationData = {
//   //     trade_name: formInput.trade_name,
//   //     legal_name: formInput.legal_name,
//   //     address: formInput.address,
//   //     phone_number: formInput.phone_number,
//   //     email: formInput.email,
//   //     logo: "https://www.shutterstock.com/es/search/image-not-found-icon",
//   //   };

//   //   try {
//   //     const response = await axios.post(
//   //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empresa`,
//   //       registrationData
//   //     );
//   //     console.log("Registro exitoso:", response.data);
//   //     toast.success("Empresa registrada con éxito");
//   //   } catch (err) {
//   //     console.error("Error al registrar la empresa:", err);
//   //     setError("Error al registrar la empresa");
//   //   }
//   // };

//   const getInputClass = (name: keyof FormState, type?: string) => {
//     if (type === "checkbox") return "mt-1 mr-2";
//     const hasError = error && !formInput[name];
//     return `w-full border rounded-lg px-3 py-2 focus:ring-2 outline-none placeholder-gray-300 ${
//       hasError
//         ? "border-red-500 focus:ring-red-500"
//         : "border-gray-300 focus:ring-blue-500"
//     }`;
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white mt-10">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-2xl p-8 w-200 mb-10"
//       >
//         <h2 className="text-2xl font-bold text-center mb-2 text-black">
//           Crear Empresa
//         </h2>
//         <p className="text-gray-500 text-center mb-6">
//           Completa el formulario para comenzar
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Inputs.map((input) => (
//             <div className="mb-4" key={input.name}>
//               <label
//                 htmlFor={input.name}
//                 className="block text-sm font-medium mb-1 text-black"
//               >
//                 {input.label}
//               </label>
//               <input
//                 type={input.type}
//                 name={input.name}
//                 placeholder={input.placeholder}
//                 value={
//                   input.type === "checkbox"
//                     ? undefined
//                     : (formInput[input.name as keyof FormState] as string)
//                 }
//                 checked={
//                   input.type === "checkbox"
//                     ? (formInput[input.name as keyof FormState] as boolean)
//                     : undefined
//                 }
//                 onChange={handleInputChange}
//                 className={`text-sm ${getInputClass(
//                   input.name as keyof FormState,
//                   input.type
//                 )}`}
//               />
//               {input.name === "password" && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   La contraseña debe tener al menos 12 caracteres, una
//                   mayúscula, una minúscula y un número.
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="plan_id" className="block mb-1 font-medium">
//             Plan
//           </label>
//           {isPlansLoading ? (
//             <p>Cargando planes...</p>
//           ) : (
//             <select
//               name="plan_id"
//               id="plan_id"
//               value={formInput.plan_id}
//               onChange={(e) =>
//                 setFormInput({ ...formInput, plan_id: e.target.value })
//               }
//               required
//               className="border p-2 w-full rounded"
//             >
//               <option value="" className="text-gray-500">
//                 Selecciona un plan
//               </option>
//               {planes.map((plan) => (
//                 <option key={plan.id} value={plan.id}>
//                   {plan.name} - ${plan.price}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         <div className="flex items-start mb-6">
//           <input
//             type="checkbox"
//             id="terms"
//             name="acceptedTerms"
//             checked={formInput.acceptedTerms}
//             onChange={handleInputChange}
//             className={getInputClass("acceptedTerms", "checkbox")}
//           />
//           <label htmlFor="terms" className="text-sm text-gray-600">
//             Acepto los{" "}
//             <Link href="/terminos" className="text-blue-600 hover:underline">
//               términos y condiciones
//             </Link>{" "}
//             y la{" "}
//             <Link href="/privacidad" className="text-blue-600 hover:underline">
//               política de privacidad
//             </Link>
//           </label>
//         </div>

//         {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-[#083E96] text-white font-semibold py-2 rounded-lg hover:bg-[#0a4ebb] transition"
//         >
//           Crear Cuenta
//         </button>

//         <div className="flex items-center my-6">
//           <hr className="flex-grow border-gray-300" />
//           <span className="mx-2 text-gray-400 text-sm">O REGÍSTRATE CON</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         <div className="flex space-x-4 w-full justify-center mb-10">
//           <button
//             type="button"
//             className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white transition"
//           >
//             <FaGoogle className="w-5 h-5 mr-3 text-red-500" /> Google
//           </button>

//           <button
//             type="button"
//             className="flex items-center justify-center w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-[#0E6922] hover:text-white transition"
//           >
//             <FaLinkedinIn className="w-5 h-5 mr-3 text-blue-600" /> LinkedIn
//           </button>
//         </div>

//         <p className="text-center text-sm text-gray-600">
//           ¿Ya tienes una cuenta?{" "}
//           <a
//             href="/login"
//             className="text-blue-600 font-medium hover:underline"
//           >
//             Inicia Sesión
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const toast = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
};

interface Plan {
  id: string;
  name: string;
  price: number;
}

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

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/plan`);
        setPlanes(res.data);
      } catch (err) {
        toast.error("Error al cargar los planes.");
      }
    };
    fetchPlanes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormInput(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formInput.acceptedTerms) {
      setError("Debes aceptar los términos y condiciones.");
      setIsSubmitting(false);
      return;
    }
    if (formInput.password !== formInput.repeatPassword) {
      setError("Las contraseñas no coinciden.");
      setIsSubmitting(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
    if (!passwordRegex.test(formInput.password)) {
      setError("La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula y un número.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/onboarding`;

      const payload = {
        trade_name: formInput.trade_name,
        legal_name: formInput.legal_name,
        address: formInput.address,
        phone_number: formInput.phone_number,
        email: formInput.email,
        name: formInput.name,
        plan_id: formInput.plan_id,
        password: formInput.password,
        logo_url: formInput.logo_url || "https://placehold.co/100x100/333/fff?text=Logo",
      };

      const res = await axios.post(apiUrl, payload);
      toast.success("Usuario y empresa registrados correctamente 🎉");

      router.push("/dashboard");

    } catch (err) {
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
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#083E96] mb-6">Crear cuenta y empresa</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset className="space-y-3">
            <legend className="font-semibold text-gray-800 border-b pb-1">Datos del administrador</legend>
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
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formInput.password}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repetir contraseña"
              value={formInput.repeatPassword}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-semibold text-gray-800 border-b pb-1">Datos de la empresa</legend>
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
            <select
              name="plan_id"
              value={formInput.plan_id}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccionar plan</option>
              {planes.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price}
                </option>
              ))}
            </select>
          </fieldset>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formInput.acceptedTerms}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="acceptedTerms" className="text-sm text-gray-700">
              Acepto los términos y condiciones
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#083E96] hover:bg-[#063070] text-white"
            }`}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta y empresa"}
          </button>
        </form>
      </div>
    </div>
  );
}
