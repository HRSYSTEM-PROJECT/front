"use client";

import {useEffect, useState} from "react";
import {Check, X} from "lucide-react";
import axios from "axios";

export default function PlanesPage() {
  const [currentPlan, setCurrentPlan] = useState("Premium");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/plan`);
        setCurrentPlan(response.data.name);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching planes:", err);
      }
    };
    fetchPlans();
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Perfecto para empezar y probar el sistema",
      features: [
        {text: "Hasta 10 empleados", included: true},
        {text: "Dashboard básico", included: true},
        {text: "Registro de asistencia", included: true},
        {text: "Gestión de categorías", included: true},
        {text: "Reportes avanzados", included: false},
        {text: "Notificaciones ilimitadas", included: false},
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49",
      tag: "Más Popular",
      description: "Para empresas en crecimiento",
      features: [
        {text: "Hasta 100 empleados", included: true},
        {text: "Dashboard completo", included: true},
        {text: "Registro de asistencia", included: true},
        {text: "Gestión de categorías", included: true},
        {text: "Reportes avanzados", included: true},
        {text: "Notificaciones ilimitadas", included: true},
        {text: "Múltiples administradores (hasta 3)", included: true},
        {text: "API access", included: false},
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$149",
      description: "Para grandes organizaciones",
      features: [
        {text: "Empleados ilimitados", included: true},
        {text: "Dashboard personalizado", included: true},
        {text: "Registro de asistencia avanzado", included: true},
        {text: "Gestión de categorías", included: true},
        {text: "Reportes avanzados y personalizados", included: true},
        {text: "Notificaciones ilimitadas", included: true},
        {text: "Soporte 24/7 dedicado", included: true},
        {text: "API access completo", included: true},
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Planes de Suscripción</h1>
        <p className="text-gray-600 mt-2">Elige el plan que mejor se adapte a las necesidades de tu empresa</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex justify-between items-center mb-8">
        <div>
          <span className="text-sm font-semibold text-white bg-blue-700 px-2 py-1 rounded-md mr-2">Plan Actual</span>
          <span className="font-semibold">{currentPlan}</span>
          <p className="text-gray-600 text-sm mt-1">Tu suscripción se renueva el 15 de febrero de 2025</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">$49</p>
          <p className="text-sm text-gray-500">por mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 flex flex-col justify-between shadow-sm ${
              currentPlan === plan.name ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div>
              {plan.tag && (
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md inline-block mb-3">
                  {plan.tag}
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="text-3xl font-bold mb-4">
                {plan.price}
                <span className="text-sm text-gray-600 font-normal ml-1">por mes</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className={feature.included ? "text-gray-800" : "text-gray-400 line-through"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setCurrentPlan(plan.name)}
              disabled={currentPlan === plan.name}
              className={`w-full py-2 rounded-md text-white font-semibold ${
                currentPlan === plan.name
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {currentPlan === plan.name ? "Plan Actual" : `Cambiar a ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-1">Métodos de Pago</p>
            <p>
              Aceptamos tarjetas de crédito, débito y transferencias bancarias. Todos los pagos son procesados de forma
              segura.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Facturación</p>
            <p>Recibirás una factura detallada cada mes. Puedes descargar todas tus facturas desde tu perfil.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Cancelación</p>
            <p>Puedes cancelar tu suscripción en cualquier momento. No hay penalizaciones ni cargos ocultos.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Soporte</p>
            <p>
              Todos los planes incluyen soporte por email. Los planes Premium y Enterprise tienen soporte prioritario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
