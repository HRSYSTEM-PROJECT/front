"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  fetchCurrentPlan: () => Promise<void>;
}

export default function StripeSuccessPage({ fetchCurrentPlan }: Props) {
  const router = useRouter();

  useEffect(() => {
    const updatePlan = async () => {
      try {
        await fetchCurrentPlan(); // refresca plan desde backend
        router.push("/dashboard/planes"); // vuelve a la página de planes
      } catch (err) {
        console.error(err);
      }
    };
    updatePlan();
  }, [fetchCurrentPlan, router]);

  return <p>Cargando...</p>;
}
