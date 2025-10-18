"use client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

interface StripeButtonProps {
  companyId: string;
  planId: string;
  text: string;
  className?: string;
  onPaymentSuccess?: () => void; // 👈 nueva prop
}

export const StripeButton = ({
  companyId,
  planId,
  text,
  className,
  onPaymentSuccess,
}: StripeButtonProps) => {
  const { getToken } = useAuth();

  const handlePayment = async () => {
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/stripe/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ companyId, planId }),
        }
      );

      const text = await res.text();
      console.log("Respuesta del backend:", text);

      if (!res.ok) throw new Error("Error al crear sesión de pago");

      const data = JSON.parse(text);
      if (data.url) {
        if (onPaymentSuccess) onPaymentSuccess();
        window.location.href = data.url;
      } else {
        toast.error("No se recibió una URL de pago válida");
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al iniciar el pago");
    }
  };

  return (
    <button onClick={handlePayment} className={`${className} cursor-pointer`}>
      {text}
    </button>
  );
};
