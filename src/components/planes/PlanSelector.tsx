"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { StripeButton } from "@/components/planes/StripeButton";
import { Check, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number | string;
  description: string;
  features: { name: string; included: boolean }[];
}

interface PlansProps {
  companyId: string;
  setPremiumPlanId: (id: string | null) => void;
  currentPlan: string | null;
  setCurrentPlan: (planName: string) => void;
  fetchCurrentPlan: (fromPayment?: boolean) => Promise<void>;
}

export const PlansSelector = ({
  companyId,
  setPremiumPlanId,
  currentPlan,
  setCurrentPlan,
  fetchCurrentPlan,
}: PlansProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { getToken } = useAuth();

  const formatPlanName = (planName: string) =>
    planName
      .replace("plan_", "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/plan`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al obtener planes");
        const data = await res.json();

        const mappedPlans = data.map((p: Plan) => {
          let features: Plan["features"] = [];

          switch (p.name) {
            case "plan_free":
              features = [
                { name: "Hasta 10 empleados", included: true },
                { name: "Gestión básica de perfiles", included: true },
                { name: "Dashboard con métricas", included: false },
                { name: "Notificaciones inteligentes", included: false },
                { name: "Comunicación interna", included: false },
                { name: "Control de asistencias", included: false },
                { name: "Gestión de sueldos", included: false },
                { name: "App para empleados", included: false },
              ];
              break;

            case "plan_premium":
              features = [
                { name: "Hasta 100 empleados", included: true },
                { name: "Gestión avanzada de perfiles", included: true },
                { name: "Dashboard con métricas", included: true },
                { name: "Notificaciones inteligentes", included: true },
                { name: "Comunicación interna", included: true },
                { name: "Control de asistencias", included: true },
                { name: "Gestión de sueldos", included: false },
                { name: "App para empleados", included: false },
              ];
              break;

            case "plan_enterprise":
              features = [
                { name: "Empleados ilimitados", included: true },
                { name: "Gestión completa de perfiles", included: true },
                { name: "Dashboard con métricas", included: true },
                { name: "Notificaciones inteligentes", included: true },
                { name: "Comunicación interna", included: true },
                { name: "Control de asistencias", included: true },
                { name: "Gestión de sueldos", included: true },
                { name: "App para empleados", included: true },
              ];
              break;

            default:
              features = p.features || [];
          }

          return { ...p, features };
        });

        setPlans(mappedPlans);

        const premium = mappedPlans.find(
          (p: Plan) => p.name === "plan_premium"
        );
        setPremiumPlanId(premium ? premium.id : null);
        const currentPlanRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/suscripciones/company/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (currentPlanRes.ok) {
          const currentData = await currentPlanRes.json();
          setCurrentPlan(currentData.plan?.name || "plan_free");
        }
      } catch (error) {
        console.error("Error al cargar planes:", error);
        setPremiumPlanId(null);
      }
    };

    fetchPlans();
  }, [getToken, setPremiumPlanId, companyId]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {plans.map((plan) => {
          const isPremium = plan.name === "plan_premium";
          const isEnterprise = plan.name === "plan_enterprise";
          let buttonText = "";
          if (plan.name === "plan_free" && currentPlan === "plan_free") {
            buttonText = "Desuscribirse";
          } else if (plan.name === "plan_premium") {
            buttonText =
              currentPlan === "plan_premium"
                ? "Plan Activo"
                : "Pasar a Premium";
          } else if (isEnterprise) {
            buttonText = "Contactar ventas";
          }

          const cardClass = isPremium
            ? "border-4 border-[#0E6922] shadow-2xl scale-[1.03] shadow-indigo-200"
            : "border border-gray-200 shadow-xl";

          const buttonClass = isPremium
            ? "bg-[#083E96] hover:bg-[#0E6922] shadow-lg shadow-indigo-300"
            : isEnterprise
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-[#083E96] hover:bg-[#0a4ebb]";

          return (
            <div
              key={plan.id}
              className={`flex-1 w-full max-w-xs lg:max-w-sm flex flex-col p-8 rounded-2xl bg-white transition-all duration-300 relative ${cardClass}`}
            >
              {isEnterprise && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-block bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-md tracking-wide">
                    PRÓXIMAMENTE
                  </span>
                </div>
              )}
              <header className="text-center mb-6">
                <h3
                  className={`text-3xl font-bold mb-1 ${
                    isPremium ? "text-[#0E6922]" : "text-gray-900"
                  }`}
                >
                  {formatPlanName(plan.name)}
                </h3>
                <p
                  className={`text-gray-500 text-sm ${
                    isPremium ? "text-[#0E6922]" : ""
                  }`}
                >
                  {plan.description ||
                    (isEnterprise
                      ? "Soluciones a medida"
                      : "Ideal para comenzar")}
                </p>
              </header>

              <div className="text-center mb-8 border-b border-gray-100 pb-6">
                <p className="text-5xl font-extrabold text-gray-900">
                  {plan.price === "Contáctanos" ? (
                    <span className="text-2xl text-[#0E6922] font-bold">
                      {plan.price}
                    </span>
                  ) : (
                    <>
                      $
                      {typeof plan.price === "number" ? plan.price : plan.price}
                      <span className="text-xl font-medium text-gray-500">
                        /mes
                      </span>
                    </>
                  )}
                </p>
              </div>
              <ul className="list-none space-y-3 flex-grow mb-8">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 text-base ${
                      f.included ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        f.included ? "text-green-500" : "text-red-400"
                      }`}
                    >
                      {f.included ? <Check /> : <X />}
                    </span>
                    <span
                      className={f.included ? "font-medium" : "line-through"}
                    >
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>
              {isEnterprise ? (
                <a
                  href="/contacto"
                  className={`text-center w-full text-white py-3 rounded-lg font-semibold transition-colors duration-200 ${buttonClass}`}
                >
                  {buttonText}
                </a>
              ) : (
                <StripeButton
                  companyId={companyId}
                  planId={plan.id}
                  text={
                    currentPlan === plan.name
                      ? "Plan Activo"
                      : plan.name === "plan_premium"
                      ? "Pasar a Premium"
                      : "Pasar a Free"
                  }
                  className={`${buttonClass} w-full text-white py-3 rounded-lg font-semibold ${
                    currentPlan === plan.name
                      ? "opacity-70 cursor-not-allowed bg-gray-400"
                      : "hover:opacity-90"
                  }`}
                  onPaymentSuccess={async () => {
                    await fetchCurrentPlan(true);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansSelector;
