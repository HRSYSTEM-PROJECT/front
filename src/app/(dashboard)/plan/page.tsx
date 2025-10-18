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
  const [companyId, setCompanyId] = useState<string | undefined>();
  const [premiumPlanId, setPremiumPlanId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const plan = plans.find((p) => p.name === currentPlan);
    if (plan) setPrice(Number(plan.price));
  }, [currentPlan, plans]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const token = await getToken();
        const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        if (!API_BASE_URL) return;

        const resSub = await axios.get(
          `${API_BASE_URL}/suscripciones/company/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const suscripcion = resSub.data.suscripcion;
        setCompanyId(suscripcion?.company?.id);
        setPrice(Number(suscripcion?.plan?.price) || 0);
        setCurrentPlan(suscripcion?.plan?.name || "plan_free");
        const resPlans = await axios.get(`${API_BASE_URL}/plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const planes: Plan[] = resPlans.data;
        const premiumPlan = planes.find((p) => p.name === "plan_premium");

        if (premiumPlan) setPremiumPlanId(premiumPlan.id);
      } catch (error) {
        console.error("Error al obtener datos de empresa o planes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, userId]);

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

  const formatPlanName = (plan: string | null): string => {
    if (typeof plan !== "string" || !plan) {
      return "Sin plan";
    }

    return plan
      .replace("plan_", "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        />
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
          ¿Necesitas ayuda para elegir?{" "}
          <Link href="/contact">Contáctanos.</Link>
        </div>
      </section>
    </div>
  );
}
