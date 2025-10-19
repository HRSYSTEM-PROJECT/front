import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

interface StripeButtonProps {
  companyId: string;
  planId: string;
  text: string;
  className?: string;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
}

export const StripeButton = ({
  companyId,
  planId,
  text,
  className,
  onPaymentSuccess,
  disabled = false,
}: StripeButtonProps) => {
  const { getToken } = useAuth();

  const handlePayment = async () => {
    if (disabled) return;
    try {
      const token = await getToken();

      if (!companyId || !planId) {
        toast.error("Faltan datos para procesar el pago.");
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!API_BASE_URL) {
        toast.error("No se encontró la URL del backend.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/stripe/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId, planId }),
      });

      const textResponse = await res.text();
      console.log("Respuesta del backend:", textResponse);

      if (!res.ok) throw new Error("Error al crear la sesión de pago");

      const data = JSON.parse(textResponse);

      if (data.url) {
        if (onPaymentSuccess) onPaymentSuccess();
        window.location.href = data.url;
      } else {
        toast.error("No se recibió una URL de pago válida.");
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      toast.error("Hubo un error al iniciar el pago.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className={`${className || ""} ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
    >
      {text}
    </button>
  );
};
