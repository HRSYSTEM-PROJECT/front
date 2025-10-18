"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface MockProps {
  text: string;
  className?: string;
  onPaymentSuccess: () => void;
}

export const StripeButtonMock = ({
  text,
  className = "",
  onPaymentSuccess,
}: MockProps) => {
  const [loading, setLoading] = useState(false);

  const handleMockPayment = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    onPaymentSuccess();

    setLoading(false);
    alert("✅ Pago simulado exitosamente (modo mock)");
  };

  return (
    <button
      onClick={handleMockPayment}
      disabled={loading}
      className={`${className} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" /> Procesando...
        </div>
      ) : (
        text
      )}
    </button>
  );
};
