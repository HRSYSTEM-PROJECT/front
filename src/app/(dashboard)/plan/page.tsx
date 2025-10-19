"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import PlansSelector from "@/components/planes/PlanSelector";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: { name: string; included: boolean }[];
}

export default function PlanPage() {
  const { getToken, userId } = useAuth();
  const [companyId, setCompanyId] = useState<string>();
  const [premiumPlanId, setPremiumPlanId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);

  const fetchCurrentPlan = async () => {
    try {
      const token = await getToken();
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const res = await axios.get(
        `${API_BASE_URL}/suscripciones/company/current`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newPlan = res.data.suscripcion?.plan?.name;
      console.log("Plan actualizado desde backend:", newPlan);
      setCurrentPlan(newPlan);
      setPrice(Number(res.data.suscripcion?.plan?.price) || 0);
      setCompanyId(res.data.suscripcion?.company?.id);
    } catch (error) {
      console.error("Error al obtener plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCurrentPlan();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-gray-600 text-lg font-medium">
          Cargando datos de la empresa...
        </p>
        <p className="text-sm text-gray-400 mt-1">Un momento, por favor.</p>
      </div>
    );
  }

  const formatPlanName = (plan: string | null) =>
    plan
      ?.replace("plan_", "")
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Sin plan";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-gray-600 text-lg font-medium">
          Cargando datos de la empresa...
        </p>
        <p className="text-sm text-gray-400 mt-1">Un momento, por favor.</p>
      </div>
    );
  }

  const currentPlanDisplay = formatPlanName(currentPlan);
  const planColorClass =
    currentPlan === "plan_premium"
      ? "bg-yellow-100 text-yellow-800"
      : currentPlan
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 text-start max-w-full overflow-x-hidden">
      <header className="mb-10 text-start">
        <h1 className="text-3xl font-bold">Gestión de Suscripciones</h1>
        <p className="text-xl text-gray-500">
          Revisa y selecciona el plan que mejor se adapte a tu negocio.
        </p>
      </header>
      <div className="mb-10 bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center">
          Tu Plan Actual
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-lg text-gray-500">Plan activo:</p>
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${planColorClass}`}
          >
            {currentPlanDisplay}
          </span>
        </div>
        {price !== null && (
          <div className="mt-2 flex justify-between items-center">
            <p className="text-lg text-gray-500">Precio mensual:</p>
            <span className="text-lg font-semibold text-gray-800">
              ${price.toFixed(2)}
            </span>
          </div>
        )}
        {currentPlan === "plan_premium" && (
          <div className="mt-4 p-4 bg-[#c1d7fc] border-l-4 border-[#083E96] text-black rounded-lg flex items-center justify-between">
            <p className="font-medium">¿Querés dejar de ser Premium?</p>
            <button
              className="font-medium text-black hover:bg-[#0E6922] hover:text-white px-4 py-2 rounded-md transition-colors duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!companyId}
              onClick={async () => {
                if (!companyId) return;
                try {
                  const token = await getToken();
                  console.log("Cancelando plan para companyId:", companyId);
                  await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/stripe/cancel`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ companyId }),
                    }
                  );
                  await fetchCurrentPlan();
                } catch (error) {
                  console.error("Error al cancelar plan:", error);
                }
              }}
            >
              Dar de baja plan
            </button>
          </div>
        )}
      </div>

      <section className="bg-white shadow-2xl rounded-2xl p-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Explora nuestros planes
        </h2>
        <PlansSelector
          companyId={companyId!}
          setPremiumPlanId={setPremiumPlanId}
          currentPlan={currentPlan}
          setCurrentPlan={setCurrentPlan}
          fetchCurrentPlan={fetchCurrentPlan}
        />
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
          ¿Necesitas ayuda para elegir?{" "}
          <Link href="/contact">Contáctanos.</Link>
        </div>
      </section>
    </div>
  );
}
