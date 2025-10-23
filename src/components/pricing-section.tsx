import { Check, X } from "lucide-react";
import Link from "next/link";

const CustomLink = ({
  href,
  className,
  children,
  disabled,
  onClick,
}: {
  href: string | null;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  if (disabled || !href) {
    return (
      <button
        className={className + " cursor-not-allowed pointer-events-none"}
        disabled
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={href} onClick={onClick} className="w-full">
      <span className={`${className} w-full block text-center`}>
        {children}
      </span>
    </Link>
  );
};

const planes = [
  {
    name: "Free",
    price: "$0",
    period: "/mes",
    description: "Perfecto para equipos pequeños",
    buttonText: "Comenzar gratis",
    buttonLink: "/register",
    isFeatured: false,
    features: [
      { name: "Hasta 10 empleados", included: true },
      { name: "Gestión básica de perfiles", included: true },
      { name: "Dashboard con métricas", included: true },
      { name: "Gestión de sueldos", included: true },
      { name: "Notificaciones inteligentes", included: false },
      { name: "Comunicación interna", included: false },
      { name: "Control de asistencias", included: false },
      { name: "App para empleados", included: false },
    ],
  },
  {
    name: "Premium",
    price: "$100",
    period: "/mes",
    description: "Ideal para empresas en crecimiento",
    buttonText: "Empezar ahora",
    buttonLink: "/register",
    isFeatured: true,
    features: [
      { name: "Hasta 100 empleados", included: true },
      { name: "Gestión avanzada de perfiles", included: true },
      { name: "Dashboard con métricas", included: true },
      { name: "Notificaciones inteligentes", included: true },
      { name: "Comunicación interna", included: true },
      { name: "Control de asistencias", included: true },
      { name: "Gestión de sueldos", included: true },
      { name: "App para empleados", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Contáctanos",
    period: "",
    description: "Soluciones personalizadas para grandes empresas",
    buttonText: "Próximamente",
    buttonLink: null,
    isFeatured: false,
    isComingSoon: true,
    features: [
      { name: "Empleados ilimitados", included: true },
      { name: "Gestión completa de perfiles", included: true },
      { name: "Dashboard con métricas", included: true },
      { name: "Notificaciones inteligentes", included: true },
      { name: "Comunicación interna", included: true },
      { name: "Control de asistencias", included: true },
      { name: "Gestión avanzada de sueldos", included: true },
      { name: "App para empleados", included: true },
    ],
  },
];

const FeatureItem = ({
  name,
  included,
  isFeatured,
}: {
  name: string;
  included: boolean;
  isFeatured: boolean;
}) => {
  const Icon = included ? Check : X;
  const iconColor = included
    ? isFeatured
      ? "text-blue-600"
      : "text-green-600"
    : "text-gray-400";
  const textColor = included ? "text-gray-800" : "text-gray-500 line-through";

  return (
    <li className="flex items-center text-base py-2">
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColor}`} />
      <span className={textColor}>{name}</span>
    </li>
  );
};

const PricingCard = ({ plan }: { plan: (typeof planes)[number] }) => {
  const isFeatured = plan.isFeatured;
  const isComingSoon = plan.isComingSoon;
  const cardClasses = `
    bg-white p-8 rounded-xl shadow-2xl relative transition-all duration-300
    ${
      isFeatured
        ? "ring-2 ring-[#083E96] transform scale-105 z-10"
        : "shadow-lg hover:shadow-xl"
    }
  `;
  const priceColor = isFeatured ? "text-[#083E96]" : "text-gray-900";
  const buttonClasses = isFeatured
    ? "bg-[#083E96] text-white font-bold py-3 rounded-lg hover:bg-[#0a4ebb] transition duration-300 shadow-md w-full cursor-pointer"
    : "bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg hover:bg-[#0E6922] hover:text-white transition duration-300 w-full cursor-pointer";

  return (
    <div className={cardClasses}>
      {isFeatured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[#083E96] text-white text-sm font-semibold rounded-full shadow-lg whitespace-nowrap">
          Más popular
        </div>
      )}
      {isComingSoon && (
        <div className="absolute top-10 right-0 transform translate-x-1/4 -translate-y-1/4 rotate-45 px-6 py-1 bg-red-600 text-white text-xs font-bold shadow-xl">
          Próximamente
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-3xl font-extrabold mb-1 text-gray-900">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </div>

      <div className="text-center mb-8">
        {plan.price === "Contáctanos" ? (
          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
        ) : (
          <p className={`text-5xl font-extrabold ${priceColor}`}>
            {plan.price}
            <span className="text-xl font-medium text-gray-500">
              {plan.period}
            </span>
          </p>
        )}
      </div>
      <ul className="space-y-2 mb-8 border-t pt-6 border-gray-100">
        {plan.features.map((feature, index) => (
          <FeatureItem
            key={index}
            name={feature.name}
            included={feature.included}
            isFeatured={isFeatured}
          />
        ))}
      </ul>
      <CustomLink
        href={plan.buttonLink}
        className={buttonClasses}
        disabled={isComingSoon}
      >
        {plan.buttonText}
      </CustomLink>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {planes.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
