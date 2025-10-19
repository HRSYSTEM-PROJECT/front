"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function PagoAceptadoToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("paymentSuccess") === "true") {
      toast.success("¡Pago realizado con éxito!");
      const url = new URL(window.location.href);
      url.searchParams.delete("paymentSuccess");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}
